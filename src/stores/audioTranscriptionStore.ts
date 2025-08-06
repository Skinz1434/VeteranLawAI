/**
 * @fileoverview Audio Transcription Store - Centralized state management for the AudioTranscription component
 * @author QBit-Claude Refactor Agent
 * @version 1.0.0
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface Transcript {
  id: string
  title: string
  type: 'cp_exam' | 'deposition' | 'hearing' | 'consultation' | 'other'
  date: string
  duration: string
  speakers: string[]
  status: 'completed' | 'processing' | 'error'
  confidence: number
  language: string
  summary: string
  keyFindings: string[]
  transcript: string
  audioUrl?: string
}

export interface ServiceInfo {
  provider: string
  available: boolean
  capabilities: string[]
  version: string
}

// Recording State
interface RecordingState {
  isRecording: boolean
  recordingTime: number
  audioLevel: number
  realTimeTranscript: string
  interimTranscript: string
  currentSpeaker: string
  mediaRecorder: MediaRecorder | null
  stream: MediaStream | null
}

// Transcription State  
interface TranscriptionState {
  transcripts: Transcript[]
  selectedTranscript: Transcript | null
  isTranscribing: boolean
  transcriptionProgress: number
}

// Playback State
interface PlaybackState {
  isPlaying: boolean
  playbackPosition: number
  playbackDuration: number
  volume: number
  playbackSpeed: number
}

// Configuration State
interface ConfigurationState {
  qualitySettings: 'low' | 'medium' | 'high' | 'ultra'
  languageModel: 'legal-va' | 'general' | 'medical'
  speakerCount: number
  exportFormat: 'txt' | 'docx' | 'pdf' | 'srt' | 'vtt' | 'json'
  serviceInfo: ServiceInfo | null
}

// UI State
interface UIState {
  activeTab: 'record' | 'upload' | 'transcripts' | 'analytics'
  searchQuery: string
  filterType: 'all' | 'cp_exam' | 'deposition' | 'hearing' | 'consultation'
  showPreview: boolean
}

// Combined Store State
interface AudioTranscriptionStore extends 
  RecordingState,
  TranscriptionState, 
  PlaybackState,
  ConfigurationState,
  UIState {
  // Recording actions
  startRecording: () => void
  stopRecording: () => void
  updateAudioLevel: (level: number) => void
  updateRealTimeTranscript: (text: string) => void
  updateInterimTranscript: (text: string) => void
  setCurrentSpeaker: (speaker: string) => void
  setMediaRecorder: (recorder: MediaRecorder | null) => void
  setStream: (stream: MediaStream | null) => void
  
  // Transcription actions
  addTranscript: (transcript: Transcript) => void
  selectTranscript: (transcript: Transcript | null) => void
  updateTranscriptionProgress: (progress: number) => void
  setTranscribing: (isTranscribing: boolean) => void
  deleteTranscript: (id: string) => void
  
  // Playback actions
  setPlaying: (isPlaying: boolean) => void
  updatePlaybackPosition: (position: number) => void
  setPlaybackDuration: (duration: number) => void
  setVolume: (volume: number) => void
  setPlaybackSpeed: (speed: number) => void
  
  // Configuration actions
  setQualitySettings: (quality: ConfigurationState['qualitySettings']) => void
  setLanguageModel: (model: ConfigurationState['languageModel']) => void
  setSpeakerCount: (count: number) => void
  setExportFormat: (format: ConfigurationState['exportFormat']) => void
  setServiceInfo: (info: ServiceInfo | null) => void
  
  // UI actions
  setActiveTab: (tab: UIState['activeTab']) => void
  setSearchQuery: (query: string) => void
  setFilterType: (filter: UIState['filterType']) => void
  setShowPreview: (show: boolean) => void
  
  // Utility actions
  reset: () => void
  clearRecordingState: () => void
}

const initialState = {
  // Recording State
  isRecording: false,
  recordingTime: 0,
  audioLevel: 0,
  realTimeTranscript: '',
  interimTranscript: '',
  currentSpeaker: 'Speaker 1',
  mediaRecorder: null,
  stream: null,
  
  // Transcription State
  transcripts: [],
  selectedTranscript: null,
  isTranscribing: false,
  transcriptionProgress: 0,
  
  // Playback State
  isPlaying: false,
  playbackPosition: 0,
  playbackDuration: 0,
  volume: 0.8,
  playbackSpeed: 1.0,
  
  // Configuration State
  qualitySettings: 'high' as const,
  languageModel: 'legal-va' as const,
  speakerCount: 2,
  exportFormat: 'docx' as const,
  serviceInfo: null,
  
  // UI State
  activeTab: 'record' as const,
  searchQuery: '',
  filterType: 'all' as const,
  showPreview: false,
}

export const useAudioTranscriptionStore = create<AudioTranscriptionStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Recording Actions
        startRecording: () => {
          set({ isRecording: true, recordingTime: 0 }, false, 'recording/start')
        },
        
        stopRecording: () => {
          const state = get()
          // Clean up resources
          if (state.mediaRecorder) {
            state.mediaRecorder.stop()
          }
          if (state.stream) {
            state.stream.getTracks().forEach(track => track.stop())
          }
          set({ 
            isRecording: false, 
            mediaRecorder: null,
            stream: null,
            realTimeTranscript: '',
            interimTranscript: ''
          }, false, 'recording/stop')
        },
        
        updateAudioLevel: (level: number) => {
          set({ audioLevel: level }, false, 'recording/updateAudioLevel')
        },
        
        updateRealTimeTranscript: (text: string) => {
          set({ realTimeTranscript: text }, false, 'recording/updateRealTimeTranscript')
        },
        
        updateInterimTranscript: (text: string) => {
          set({ interimTranscript: text }, false, 'recording/updateInterimTranscript')
        },
        
        setCurrentSpeaker: (speaker: string) => {
          set({ currentSpeaker: speaker }, false, 'recording/setCurrentSpeaker')
        },
        
        setMediaRecorder: (recorder: MediaRecorder | null) => {
          set({ mediaRecorder: recorder }, false, 'recording/setMediaRecorder')
        },
        
        setStream: (stream: MediaStream | null) => {
          set({ stream }, false, 'recording/setStream')
        },
        
        // Transcription Actions
        addTranscript: (transcript: Transcript) => {
          set(state => ({
            transcripts: [transcript, ...state.transcripts]
          }), false, 'transcription/addTranscript')
        },
        
        selectTranscript: (transcript: Transcript | null) => {
          set({ selectedTranscript: transcript }, false, 'transcription/selectTranscript')
        },
        
        updateTranscriptionProgress: (progress: number) => {
          set({ transcriptionProgress: progress }, false, 'transcription/updateProgress')
        },
        
        setTranscribing: (isTranscribing: boolean) => {
          set({ isTranscribing }, false, 'transcription/setTranscribing')
        },
        
        deleteTranscript: (id: string) => {
          set(state => ({
            transcripts: state.transcripts.filter(t => t.id !== id),
            selectedTranscript: state.selectedTranscript?.id === id ? null : state.selectedTranscript
          }), false, 'transcription/deleteTranscript')
        },
        
        // Playback Actions
        setPlaying: (isPlaying: boolean) => {
          set({ isPlaying }, false, 'playback/setPlaying')
        },
        
        updatePlaybackPosition: (position: number) => {
          set({ playbackPosition: position }, false, 'playback/updatePosition')
        },
        
        setPlaybackDuration: (duration: number) => {
          set({ playbackDuration: duration }, false, 'playback/setDuration')
        },
        
        setVolume: (volume: number) => {
          set({ volume }, false, 'playback/setVolume')
        },
        
        setPlaybackSpeed: (speed: number) => {
          set({ playbackSpeed: speed }, false, 'playback/setSpeed')
        },
        
        // Configuration Actions
        setQualitySettings: (quality: ConfigurationState['qualitySettings']) => {
          set({ qualitySettings: quality }, false, 'config/setQuality')
        },
        
        setLanguageModel: (model: ConfigurationState['languageModel']) => {
          set({ languageModel: model }, false, 'config/setLanguageModel')
        },
        
        setSpeakerCount: (count: number) => {
          set({ speakerCount: count }, false, 'config/setSpeakerCount')
        },
        
        setExportFormat: (format: ConfigurationState['exportFormat']) => {
          set({ exportFormat: format }, false, 'config/setExportFormat')
        },
        
        setServiceInfo: (info: ServiceInfo | null) => {
          set({ serviceInfo: info }, false, 'config/setServiceInfo')
        },
        
        // UI Actions
        setActiveTab: (tab: UIState['activeTab']) => {
          set({ activeTab: tab }, false, 'ui/setActiveTab')
        },
        
        setSearchQuery: (query: string) => {
          set({ searchQuery: query }, false, 'ui/setSearchQuery')
        },
        
        setFilterType: (filter: UIState['filterType']) => {
          set({ filterType: filter }, false, 'ui/setFilterType')
        },
        
        setShowPreview: (show: boolean) => {
          set({ showPreview: show }, false, 'ui/setShowPreview')
        },
        
        // Utility Actions
        reset: () => {
          set(initialState, false, 'utility/reset')
        },
        
        clearRecordingState: () => {
          set({
            isRecording: false,
            recordingTime: 0,
            audioLevel: 0,
            realTimeTranscript: '',
            interimTranscript: '',
            currentSpeaker: 'Speaker 1',
            mediaRecorder: null,
            stream: null,
          }, false, 'utility/clearRecordingState')
        },
      }),
      {
        name: 'audio-transcription-storage',
        partialize: (state) => ({
          // Only persist non-sensitive data
          transcripts: state.transcripts,
          qualitySettings: state.qualitySettings,
          languageModel: state.languageModel,
          speakerCount: state.speakerCount,
          exportFormat: state.exportFormat,
          volume: state.volume,
          playbackSpeed: state.playbackSpeed,
          activeTab: state.activeTab,
          filterType: state.filterType,
        }),
      }
    ),
    {
      name: 'AudioTranscriptionStore',
    }
  )
)

// Optimized selectors to prevent unnecessary re-renders
export const useRecordingState = () => 
  useAudioTranscriptionStore(state => ({
    isRecording: state.isRecording,
    recordingTime: state.recordingTime,
    audioLevel: state.audioLevel,
    realTimeTranscript: state.realTimeTranscript,
    interimTranscript: state.interimTranscript,
    currentSpeaker: state.currentSpeaker,
  }))

export const useTranscriptionState = () => 
  useAudioTranscriptionStore(state => ({
    transcripts: state.transcripts,
    selectedTranscript: state.selectedTranscript,
    isTranscribing: state.isTranscribing,
    transcriptionProgress: state.transcriptionProgress,
  }))

export const usePlaybackState = () => 
  useAudioTranscriptionStore(state => ({
    isPlaying: state.isPlaying,
    playbackPosition: state.playbackPosition,
    playbackDuration: state.playbackDuration,
    volume: state.volume,
    playbackSpeed: state.playbackSpeed,
  }))

export const useConfigurationState = () => 
  useAudioTranscriptionStore(state => ({
    qualitySettings: state.qualitySettings,
    languageModel: state.languageModel,
    speakerCount: state.speakerCount,
    exportFormat: state.exportFormat,
    serviceInfo: state.serviceInfo,
  }))

export const useUIState = () => 
  useAudioTranscriptionStore(state => ({
    activeTab: state.activeTab,
    searchQuery: state.searchQuery,
    filterType: state.filterType,
    showPreview: state.showPreview,
  }))

// Action selectors
export const useRecordingActions = () => 
  useAudioTranscriptionStore(state => ({
    startRecording: state.startRecording,
    stopRecording: state.stopRecording,
    updateAudioLevel: state.updateAudioLevel,
    updateRealTimeTranscript: state.updateRealTimeTranscript,
    updateInterimTranscript: state.updateInterimTranscript,
    setCurrentSpeaker: state.setCurrentSpeaker,
    setMediaRecorder: state.setMediaRecorder,
    setStream: state.setStream,
  }))

export const useTranscriptionActions = () => 
  useAudioTranscriptionStore(state => ({
    addTranscript: state.addTranscript,
    selectTranscript: state.selectTranscript,
    updateTranscriptionProgress: state.updateTranscriptionProgress,
    setTranscribing: state.setTranscribing,
    deleteTranscript: state.deleteTranscript,
  }))

export const usePlaybackActions = () => 
  useAudioTranscriptionStore(state => ({
    setPlaying: state.setPlaying,
    updatePlaybackPosition: state.updatePlaybackPosition,
    setPlaybackDuration: state.setPlaybackDuration,
    setVolume: state.setVolume,
    setPlaybackSpeed: state.setPlaybackSpeed,
  }))

export const useConfigurationActions = () => 
  useAudioTranscriptionStore(state => ({
    setQualitySettings: state.setQualitySettings,
    setLanguageModel: state.setLanguageModel,
    setSpeakerCount: state.setSpeakerCount,
    setExportFormat: state.setExportFormat,
    setServiceInfo: state.setServiceInfo,
  }))

export const useUIActions = () => 
  useAudioTranscriptionStore(state => ({
    setActiveTab: state.setActiveTab,
    setSearchQuery: state.setSearchQuery,
    setFilterType: state.setFilterType,
    setShowPreview: state.setShowPreview,
  }))