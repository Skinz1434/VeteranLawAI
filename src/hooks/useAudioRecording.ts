/**
 * @fileoverview Audio Recording Hook - Manages microphone recording functionality
 * @author QBit-Claude Refactor Agent
 * @version 1.0.0
 */

import { useCallback, useEffect, useRef } from 'react'
import {
  useRecordingState,
  useRecordingActions,
  useTranscriptionActions,
  useConfigurationState,
} from '../stores/audioTranscriptionStore'
import {
  startRealTimeTranscription,
  stopRealTimeTranscription,
  initializeSpeechService,
} from '../services/speechToTextService'
import { announceToScreenReader } from '../utils/accessibility'

export interface UseAudioRecordingReturn {
  // State
  isRecording: boolean
  recordingTime: number
  audioLevel: number
  realTimeTranscript: string
  interimTranscript: string
  currentSpeaker: string

  // Actions
  startRecording: () => Promise<void>
  stopRecording: () => void
  toggleRecording: () => Promise<void>

  // Utils
  formatRecordingTime: (seconds: number) => string
}

export const useAudioRecording = (): UseAudioRecordingReturn => {
  const recordingState = useRecordingState()
  const recordingActions = useRecordingActions()
  const { addTranscript } = useTranscriptionActions()
  const { qualitySettings, languageModel, speakerCount } = useConfigurationState()

  // Refs for audio handling
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize speech service when configuration changes
  useEffect(() => {
    const initializeService = async () => {
      try {
        const result = await initializeSpeechService({
          continuous: true,
          interimResults: true,
          language: 'en-US',
          quality: qualitySettings,
        })

        if (result.success) {
          announceToScreenReader(`Speech service initialized with ${result.provider}`)
        }
      } catch (error) {
        console.error('Failed to initialize speech service:', error)
        announceToScreenReader('Speech service initialization failed')
      }
    }

    initializeService()
  }, [qualitySettings, languageModel])

  // Recording timer effect
  useEffect(() => {
    if (recordingState.isRecording) {
      recordingTimerRef.current = setInterval(() => {
        recordingActions.updateAudioLevel(recordingState.recordingTime + 1)
      }, 1000)
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [recordingState.isRecording, recordingState.recordingTime, recordingActions])

  // Audio level monitoring
  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Calculate average audio level
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
    const normalizedLevel = average / 255

    recordingActions.updateAudioLevel(normalizedLevel)

    if (recordingState.isRecording) {
      animationFrameRef.current = requestAnimationFrame(monitorAudioLevel)
    }
  }, [recordingState.isRecording, recordingActions])

  // Start recording function
  const startRecording = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: qualitySettings === 'ultra' ? 48000 : 44100,
          channelCount: 2,
        },
      })

      recordingActions.setStream(stream)

      // Set up audio context for level monitoring
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      source.connect(analyserRef.current)

      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4',
      })

      recordingActions.setMediaRecorder(mediaRecorder)

      // Handle data available
      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        })

        // Create transcript from recording
        const transcript = {
          id: `rec-${Date.now()}`,
          title: `Recording ${new Date().toLocaleDateString()}`,
          type: 'consultation' as const,
          date: new Date().toISOString(),
          duration: formatRecordingTime(recordingState.recordingTime),
          speakers: Array.from({ length: speakerCount }, (_, i) => `Speaker ${i + 1}`),
          status: 'completed' as const,
          confidence: 0.95,
          language: 'en-US',
          summary: 'Audio recording completed',
          keyFindings: [],
          transcript: recordingState.realTimeTranscript || 'Transcript processing...',
          audioUrl: URL.createObjectURL(audioBlob),
        }

        addTranscript(transcript)
        audioChunksRef.current = [] // Clear chunks
      }

      // Start real-time transcription
      await startRealTimeTranscription({
        onTranscript: (text: string) => {
          recordingActions.updateRealTimeTranscript(text)
        },
        onInterim: (text: string) => {
          recordingActions.updateInterimTranscript(text)
        },
        onSpeakerChange: (speaker: string) => {
          recordingActions.setCurrentSpeaker(speaker)
        },
        speakerCount,
        quality: qualitySettings,
      })

      // Start recording
      mediaRecorder.start(1000) // Collect data every second
      recordingActions.startRecording()
      monitorAudioLevel()

      announceToScreenReader('Recording started')
    } catch (error) {
      console.error('Error starting recording:', error)
      announceToScreenReader('Failed to start recording. Please check microphone permissions.')
      throw error
    }
  }, [
    qualitySettings,
    speakerCount,
    recordingActions,
    addTranscript,
    recordingState.recordingTime,
    recordingState.realTimeTranscript,
    monitorAudioLevel,
  ])

  // Stop recording function
  const stopRecording = useCallback(() => {
    try {
      // Stop real-time transcription
      stopRealTimeTranscription()

      // Stop media recorder
      if (recordingState.mediaRecorder && recordingState.mediaRecorder.state !== 'inactive') {
        recordingState.mediaRecorder.stop()
      }

      // Stop monitoring
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      // Cleanup audio context
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }

      // Stop stream
      if (recordingState.stream) {
        recordingState.stream.getTracks().forEach(track => track.stop())
      }

      // Update state
      recordingActions.stopRecording()

      announceToScreenReader(
        `Recording stopped. Duration: ${formatRecordingTime(recordingState.recordingTime)}`
      )
    } catch (error) {
      console.error('Error stopping recording:', error)
      announceToScreenReader('Error stopping recording')
    }
  }, [
    recordingState.mediaRecorder,
    recordingState.stream,
    recordingState.recordingTime,
    recordingActions,
  ])

  // Toggle recording function
  const toggleRecording = useCallback(async () => {
    if (recordingState.isRecording) {
      stopRecording()
    } else {
      await startRecording()
    }
  }, [recordingState.isRecording, startRecording, stopRecording])

  // Format recording time helper
  const formatRecordingTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return {
    // State
    isRecording: recordingState.isRecording,
    recordingTime: recordingState.recordingTime,
    audioLevel: recordingState.audioLevel,
    realTimeTranscript: recordingState.realTimeTranscript,
    interimTranscript: recordingState.interimTranscript,
    currentSpeaker: recordingState.currentSpeaker,

    // Actions
    startRecording,
    stopRecording,
    toggleRecording,

    // Utils
    formatRecordingTime,
  }
}
