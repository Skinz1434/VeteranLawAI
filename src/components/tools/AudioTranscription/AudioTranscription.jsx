/**
 * @fileoverview Audio Transcription Tool - Professional Legal Audio Processing
 * @author VeteranLawAI Platform
 * @version 3.0.0
 */

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  Square,
  Play,
  Pause,
  Upload,
  Download,
  FileAudio,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  FileText,
  Copy,
  Edit3,
  Save,
  Clock,
  User,
  Calendar,
  Settings,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader,
  Trash2,
  Brain,
  Crown,
  Shield,
  Star,
  Sparkles,
  Activity,
  Search,
  Filter,
  Share2,
  Archive,
  Tag,
  Bookmark,
  Eye,
  Target,
  Scale,
  BookOpen,
  Info,
  ExternalLink,
  BarChart3,
  Headphones,
  Radio,
  Layers,
  Globe,
  Database,
  Briefcase,
  Award,
  TrendingUp,
  PieChart,
  RefreshCw,
  Plus,
  Minus,
  Users,
  X,
} from 'lucide-react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import { announceToScreenReader } from '../../../utils/accessibility'

/**
 * Audio Transcription Component
 * Professional Legal Audio Processing with AI Enhancement
 */
const AudioTranscription = () => {
  // Core state
  const [activeTab, setActiveTab] = useState('record')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [transcripts, setTranscripts] = useState([])
  const [selectedTranscript, setSelectedTranscript] = useState(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionProgress, setTranscriptionProgress] = useState(0)
  const [playbackPosition, setPlaybackPosition] = useState(0)
  const [playbackDuration, setPlaybackDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [speakerCount, setSpeakerCount] = useState(2)
  const [qualitySettings, setQualitySettings] = useState('high')
  const [languageModel, setLanguageModel] = useState('legal-va')
  const [exportFormat, setExportFormat] = useState('docx')
  const [showPreview, setShowPreview] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [realTimeTranscript, setRealTimeTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [currentSpeaker, setCurrentSpeaker] = useState('Speaker 1')

  // Refs for audio handling
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const streamRef = useRef(null)
  const fileInputRef = useRef(null)
  const audioRef = useRef(null)

  // Mock transcripts for demonstration
  const mockTranscripts = [
    {
      id: '1',
      title: 'C&P Exam - John Doe',
      type: 'C&P Exam',
      duration: '45:30',
      speakers: 2,
      confidence: 0.98,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      content: 'Dr. Smith: Good morning, Mr. Doe. I\'m Dr. Smith conducting your Compensation and Pension examination today.\n\nJohn Doe: Good morning, doctor.\n\nDr. Smith: Let\'s start with your current symptoms. Can you describe your PTSD symptoms?\n\nJohn Doe: I experience frequent nightmares about my deployment...',
      summary: 'C&P examination for PTSD claim with detailed symptom review and medical history discussion.',
      tags: ['PTSD', 'C&P Exam', 'Mental Health'],
      fileSize: '12.5 MB',
      processingTime: '2:30',
    },
    {
      id: '2',
      title: 'Deposition - Jane Smith',
      type: 'Deposition',
      duration: '1:23:45',
      speakers: 3,
      confidence: 0.96,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      content: 'Attorney Johnson: Ms. Smith, can you please state your full name for the record?\n\nJane Smith: Jane Elizabeth Smith.\n\nAttorney Johnson: And you are currently employed as?\n\nJane Smith: I work as a registered nurse at the VA Medical Center...',
      summary: 'Deposition testimony regarding medical treatment and disability claim process.',
      tags: ['Deposition', 'Medical', 'Testimony'],
      fileSize: '28.7 MB',
      processingTime: '4:15',
    },
  ]

  // Initialize component
  useEffect(() => {
    announceToScreenReader('Audio Transcription tool loaded')
  }, [])

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        processAudioFile(audioBlob, `recording_${Date.now()}.wav`)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      announceToScreenReader('Recording started')

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      return () => clearInterval(timer)
    } catch (error) {
      console.error('Failed to start recording:', error)
      announceToScreenReader('Failed to start recording')
    }
  }, [])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      streamRef.current?.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      announceToScreenReader('Recording stopped')
    }
  }, [isRecording])

  // Process audio file
  const processAudioFile = useCallback(async (file, filename) => {
    setIsTranscribing(true)
    setTranscriptionProgress(0)
    announceToScreenReader('Processing audio file')

    try {
      // Simulate processing steps
      const steps = [
        'Analyzing audio quality...',
        'Converting speech to text...',
        'Identifying speakers...',
        'Applying legal terminology...',
        'Generating transcript...'
      ]

      for (let i = 0; i < steps.length; i++) {
        setTranscriptionProgress((i + 1) * 20)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Create transcript
      const transcript = {
        id: Date.now().toString(),
        title: filename.replace('.wav', '').replace('.mp3', ''),
        type: 'Recording',
        duration: formatTime(recordingTime),
        speakers: speakerCount,
        confidence: 0.95 + Math.random() * 0.04,
        timestamp: new Date().toISOString(),
        content: `Sample transcript content for ${filename}.\n\nThis is a demonstration of the audio transcription capabilities.\n\nSpeaker 1: Hello, this is a test recording.\n\nSpeaker 2: Yes, I can hear you clearly.\n\nSpeaker 1: The audio quality seems good.\n\nSpeaker 2: Perfect for transcription.`,
        summary: `Transcription of ${filename} with ${speakerCount} speakers identified.`,
        tags: ['Recording', 'Legal', 'Transcription'],
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        processingTime: '2:30',
      }

      setTranscripts(prev => [transcript, ...prev])
      setActiveTab('transcripts')
      announceToScreenReader(`Transcription completed. Confidence: ${Math.round(transcript.confidence * 100)}%`)
    } catch (error) {
      console.error('Transcription failed:', error)
      announceToScreenReader('Transcription failed')
    } finally {
      setIsTranscribing(false)
      setTranscriptionProgress(0)
    }
  }, [recordingTime, speakerCount])

  // Handle file upload
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/m4a', 'audio/webm']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an audio file (WAV, MP3, M4A, or WebM)')
      return
    }

    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      alert('File too large. Please upload files smaller than 100MB.')
      return
    }

    processAudioFile(file, file.name)
    
    // Reset file input
    if (event.target) {
      event.target.value = ''
    }
  }, [processAudioFile])

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      announceToScreenReader('Copied to clipboard')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [])

  // Download transcript
  const downloadTranscript = useCallback((transcript, format = 'txt') => {
    try {
      let content = transcript.content
      let mimeType = 'text/plain'
      let filename = `${transcript.title}_transcript.${format}`

      if (format === 'json') {
        content = JSON.stringify(transcript, null, 2)
        mimeType = 'application/json'
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      announceToScreenReader(`Downloaded ${filename}`)
    } catch (error) {
      console.error('Download failed:', error)
      announceToScreenReader('Download failed')
    }
  }, [])

  // Delete transcript
  const deleteTranscript = useCallback((transcriptId) => {
    setTranscripts(prev => prev.filter(t => t.id !== transcriptId))
    announceToScreenReader('Transcript deleted')
  }, [])

  // Format time
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Tab configuration
  const tabs = [
    {
      id: 'record',
      label: 'Live Recording',
      icon: Mic,
      description: 'High-quality capture'
    },
    {
      id: 'upload',
      label: 'File Upload',
      icon: Upload,
      description: 'Process existing files'
    },
    {
      id: 'transcripts',
      label: `Transcripts (${transcripts.length + mockTranscripts.length})`,
      icon: FileText,
      description: 'Completed transcriptions'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Performance insights'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Audio Transcription</h1>
                <p className="text-slate-400">Professional Legal Audio Processing</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-medium">98.7% Accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'record' && (
            <motion.div
              key="record"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Recording Controls */}
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                  <Mic className="h-6 w-6 text-emerald-400" />
                  <span>Live Recording Studio</span>
                </h3>

                {/* Recording Status */}
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-emerald-400 mb-4">
                    {formatTime(recordingTime)}
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
                    <span className="text-slate-400">
                      {isRecording ? 'Recording...' : 'Ready to record'}
                    </span>
                  </div>
                </div>

                {/* Recording Controls */}
                <div className="flex space-x-4">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600"
                      disabled={isTranscribing}
                    >
                      <Mic className="h-5 w-5 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-600"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                </div>

                {/* Settings */}
                <div className="mt-8 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Quality Settings
                    </label>
                    <select
                      value={qualitySettings}
                      onChange={(e) => setQualitySettings(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="standard">Standard</option>
                      <option value="high">High</option>
                      <option value="ultra">Ultra</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Language Model
                    </label>
                    <select
                      value={languageModel}
                      onChange={(e) => setLanguageModel(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="legal-va">Legal VA</option>
                      <option value="medical">Medical</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Recording Tips */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Recording Tips</h3>
                  <div className="space-y-3">
                    {[
                      { icon: '🎤', title: 'Use Quality Microphone', desc: 'Ensure clear audio input' },
                      { icon: '🔇', title: 'Minimize Background Noise', desc: 'Find quiet environment' },
                      { icon: '📏', title: 'Optimal Distance', desc: 'Keep 6-12 inches from mic' },
                      { icon: '🗣️', title: 'Speak Clearly', desc: 'Enunciate words properly' },
                    ].map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="text-2xl">{tip.icon}</div>
                        <div>
                          <h4 className="font-medium text-white">{tip.title}</h4>
                          <p className="text-slate-400 text-sm">{tip.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Supported Formats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Audio Formats:</span>
                      <span className="text-white">WAV, MP3, M4A, WebM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Max File Size:</span>
                      <span className="text-white">100 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Processing Time:</span>
                      <span className="text-white">2-5 minutes</span>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-8 text-center">
                <div className="max-w-md mx-auto">
                  <Upload className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">Upload Audio Files</h3>
                  <p className="text-slate-300 mb-8">
                    Upload audio recordings for professional transcription with AI-powered legal terminology recognition
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".wav,.mp3,.m4a,.webm"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="lg"
                    className="mb-6"
                    disabled={isTranscribing}
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    {isTranscribing ? 'Processing...' : 'Choose Audio Files'}
                  </Button>

                  <div className="text-slate-400 text-sm">
                    <p>Supported formats: WAV, MP3, M4A, WebM</p>
                    <p>Maximum file size: 100MB</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'transcripts' && (
            <motion.div
              key="transcripts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {transcripts.length === 0 && mockTranscripts.length === 0 ? (
                <Card className="p-8 text-center">
                  <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Transcripts Yet</h3>
                  <p className="text-slate-400">
                    Start by recording or uploading audio files to see transcripts here
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {[...transcripts, ...mockTranscripts].map((transcript) => (
                    <Card key={transcript.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <FileText className="h-5 w-5 text-emerald-400" />
                            <h3 className="font-bold text-white">{transcript.title}</h3>
                            <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                              {transcript.type}
                            </span>
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                              {Math.round(transcript.confidence * 100)}% confidence
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{transcript.summary}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-400">
                            <span>Duration: {transcript.duration}</span>
                            <span>Speakers: {transcript.speakers}</span>
                            <span>File: {transcript.fileSize}</span>
                            <span>{new Date(transcript.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {transcript.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(transcript.content)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadTranscript(transcript, 'txt')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTranscript(transcript)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteTranscript(transcript.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  {
                    label: 'Total Transcripts',
                    value: transcripts.length + mockTranscripts.length,
                    icon: FileText,
                    color: 'text-emerald-400',
                  },
                  {
                    label: 'Average Confidence',
                    value: transcripts.length + mockTranscripts.length
                      ? `${Math.round(
                          ([...transcripts, ...mockTranscripts].reduce((acc, t) => acc + t.confidence, 0) /
                            (transcripts.length + mockTranscripts.length)) *
                            100
                        )}%`
                      : '0%',
                    icon: Target,
                    color: 'text-green-400',
                  },
                  {
                    label: 'Total Duration',
                    value: '12:45:30',
                    icon: Clock,
                    color: 'text-blue-400',
                  },
                  {
                    label: 'Processing Time',
                    value: '2.3 min avg',
                    icon: Zap,
                    color: 'text-purple-400',
                  },
                ].map((stat, index) => (
                  <Card key={index} className="p-6 text-center">
                    <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </Card>
                ))}
              </div>

              <Card className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="text-slate-400">
                  {transcripts.length === 0 && mockTranscripts.length === 0 ? (
                    <p>No recent activity available yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {[...transcripts, ...mockTranscripts].slice(0, 5).map(transcript => (
                        <div key={transcript.id} className="flex items-center justify-between py-2">
                          <div>
                            <span className="text-white">{transcript.title}</span>
                            <span className="text-slate-500 text-sm ml-2">{transcript.type}</span>
                          </div>
                          <span className="text-slate-400 text-sm">
                            {new Date(transcript.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing Overlay */}
        {isTranscribing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <Loader className="h-12 w-12 text-emerald-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-bold text-white mb-2">Processing Audio</h3>
                <p className="text-slate-400 mb-4">Converting speech to text...</p>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${transcriptionProgress}%` }}
                  />
                </div>
                <p className="text-slate-400 text-sm">{Math.round(transcriptionProgress)}% complete</p>
              </div>
            </div>
          </div>
        )}

        {/* Transcript Preview Modal */}
        {selectedTranscript && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">{selectedTranscript.title}</h2>
                <button
                  onClick={() => setSelectedTranscript(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Transcript Content</h3>
                    <div className="bg-slate-900 rounded-lg p-4">
                      <pre className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                        {selectedTranscript.content}
                      </pre>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Type:</span>
                          <span className="text-white">{selectedTranscript.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Duration:</span>
                          <span className="text-white">{selectedTranscript.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Speakers:</span>
                          <span className="text-white">{selectedTranscript.speakers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Confidence:</span>
                          <span className="text-white">{Math.round(selectedTranscript.confidence * 100)}%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTranscript.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4 border-t border-slate-700">
                    <Button
                      onClick={() => copyToClipboard(selectedTranscript.content)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Text
                    </Button>
                    <Button
                      onClick={() => downloadTranscript(selectedTranscript, 'txt')}
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AudioTranscription
