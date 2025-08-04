import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Play, Pause, Square, Download, Upload, Search, Filter, Star, Eye, ExternalLink, Calendar, User, Clock, CheckCircle, AlertCircle, Zap, Cloud, Settings, X, ChevronRight, Home, BookOpen, FileText, Scale, BarChart3, Menu, Bell, HelpCircle, Tag, Bookmark, History, TrendingUp, Award, Shield, Target, ArrowRight, Plus, Edit, Trash2, AlertTriangle, Info, ChevronDown, ChevronUp, Volume2, VolumeX, SkipBack, SkipForward, RotateCcw, Share2, Copy, Users, MessageSquare } from 'lucide-react'

const AudioTranscription = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [selectedTranscript, setSelectedTranscript] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeTab, setActiveTab] = useState('record')
  const [playbackPosition, setPlaybackPosition] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpeaker, setSelectedSpeaker] = useState('all')
  
  const recordingTimerRef = useRef(null)
  const playbackTimerRef = useRef(null)

  const sidebarNavigation = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: FileText, label: "Camera OCR", path: "/camera-ocr" },
    { icon: BookOpen, label: "Legal Knowledge", path: "/legal-knowledge" },
    { icon: Target, label: "Claim Guidance", path: "/claim-guidance" },
    { icon: Mic, label: "Audio Transcription", path: "/audio-transcription", active: true },
    { icon: Scale, label: "Case Research", path: "/case-research" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" }
  ]

  const welcomeSteps = [
    {
      title: "Welcome to Audio Transcription",
      description: "Professional-grade audio recording and transcription optimized for legal consultations and client interviews.",
      features: ["Legal terminology recognition", "Speaker identification", "Real-time transcription", "Secure cloud storage"]
    },
    {
      title: "Recording Best Practices",
      description: "Optimize your recordings for maximum transcription accuracy and legal compliance.",
      features: ["Clear audio quality", "Speaker positioning", "Background noise reduction", "Legal confidentiality"]
    },
    {
      title: "AI-Powered Transcription",
      description: "Advanced AI technology specifically trained on legal terminology and VA disability claim language.",
      features: ["95% accuracy rate", "Legal term highlighting", "Automatic punctuation", "Speaker labeling"]
    },
    {
      title: "Collaboration & Sharing",
      description: "Share transcripts with team members, add annotations, and maintain secure collaboration workflows.",
      features: ["Team collaboration", "Annotation system", "Version control", "Secure sharing"]
    }
  ]

  // Sample transcript data
  const [transcripts, setTranscripts] = useState([
    {
      id: 1,
      title: "Client Interview - John Smith PTSD Claim",
      date: "2024-01-25",
      duration: "45:32",
      speakers: ["Attorney", "Client"],
      status: "Complete",
      confidence: 94,
      wordCount: 3247,
      tags: ["PTSD", "Service Connection", "Initial Interview"],
      transcript: [
        {
          timestamp: "00:00:15",
          speaker: "Attorney",
          text: "Good morning, Mr. Smith. Thank you for coming in today. I'd like to discuss your PTSD claim and gather some information about your military service.",
          confidence: 96,
          legalTerms: ["PTSD claim", "military service"]
        },
        {
          timestamp: "00:00:32",
          speaker: "Client",
          text: "Thank you for seeing me. I served in Iraq from 2004 to 2006, and I've been struggling with nightmares and anxiety ever since I got back.",
          confidence: 92,
          legalTerms: ["Iraq", "nightmares", "anxiety"]
        },
        {
          timestamp: "00:00:48",
          speaker: "Attorney",
          text: "I understand. Can you tell me about any specific traumatic events or stressors you experienced during your deployment?",
          confidence: 95,
          legalTerms: ["traumatic events", "stressors", "deployment"]
        },
        {
          timestamp: "00:01:05",
          speaker: "Client",
          text: "There was an IED explosion that killed two soldiers in my unit. I was in the convoy behind them. The images still haunt me every night.",
          confidence: 93,
          legalTerms: ["IED explosion", "convoy"]
        },
        {
          timestamp: "00:01:22",
          speaker: "Attorney",
          text: "That sounds like a very traumatic experience. Have you received any medical treatment for these symptoms since returning from service?",
          confidence: 97,
          legalTerms: ["traumatic experience", "medical treatment", "symptoms"]
        }
      ],
      annotations: [
        {
          timestamp: "00:00:48",
          note: "Key stressor identification - important for nexus",
          author: "Attorney",
          type: "legal"
        },
        {
          timestamp: "00:01:05",
          note: "Specific traumatic event - document for stressor verification",
          author: "Attorney",
          type: "evidence"
        }
      ],
      audioFile: "john_smith_interview_20240125.wav",
      size: "42.3 MB"
    },
    {
      id: 2,
      title: "Medical Expert Consultation - PTSD Nexus",
      date: "2024-01-23",
      duration: "28:15",
      speakers: ["Attorney", "Medical Expert"],
      status: "Complete",
      confidence: 97,
      wordCount: 2156,
      tags: ["Medical Opinion", "Nexus", "Expert Consultation"],
      transcript: [
        {
          timestamp: "00:00:10",
          speaker: "Attorney",
          text: "Dr. Johnson, thank you for reviewing Mr. Smith's case. Can you provide your medical opinion on the nexus between his military service and current PTSD symptoms?",
          confidence: 98,
          legalTerms: ["medical opinion", "nexus", "military service", "PTSD symptoms"]
        },
        {
          timestamp: "00:00:28",
          speaker: "Medical Expert",
          text: "Based on my review of his service records and current symptomatology, it is at least as likely as not that his PTSD is related to his combat experiences in Iraq.",
          confidence: 96,
          legalTerms: ["service records", "symptomatology", "at least as likely as not", "PTSD", "combat experiences"]
        }
      ],
      audioFile: "medical_expert_consultation_20240123.wav",
      size: "28.7 MB"
    },
    {
      id: 3,
      title: "Team Strategy Meeting - Complex Claims",
      date: "2024-01-22",
      duration: "1:12:45",
      speakers: ["Attorney 1", "Attorney 2", "Paralegal"],
      status: "Processing",
      confidence: 89,
      wordCount: 5432,
      tags: ["Strategy", "Team Meeting", "Complex Claims"],
      audioFile: "team_meeting_20240122.wav",
      size: "73.2 MB"
    }
  ])

  const speakers = ["All Speakers", "Attorney", "Client", "Medical Expert", "Paralegal"]
  const tags = ["PTSD", "Service Connection", "Medical Opinion", "Nexus", "Strategy", "Initial Interview"]

  useEffect(() => {
    if (showWelcomeModal && currentStep < 4) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, showWelcomeModal])

  useEffect(() => {
    if (isRecording && !isPaused) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
        // Simulate audio level
        setAudioLevel(Math.random() * 100)
      }, 1000)
    } else {
      clearInterval(recordingTimerRef.current)
    }

    return () => clearInterval(recordingTimerRef.current)
  }, [isRecording, isPaused])

  useEffect(() => {
    if (isPlaying && selectedTranscript) {
      playbackTimerRef.current = setInterval(() => {
        setPlaybackPosition(prev => {
          const newPosition = prev + 1
          const totalDuration = selectedTranscript.duration.split(':').reduce((acc, time) => (60 * acc) + +time, 0)
          if (newPosition >= totalDuration) {
            setIsPlaying(false)
            return totalDuration
          }
          return newPosition
        })
      }, 1000)
    } else {
      clearInterval(playbackTimerRef.current)
    }

    return () => clearInterval(playbackTimerRef.current)
  }, [isPlaying, selectedTranscript])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = () => {
    setIsRecording(true)
    setIsPaused(false)
    setRecordingTime(0)
  }

  const pauseRecording = () => {
    setIsPaused(!isPaused)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    setRecordingTime(0)
    setAudioLevel(0)
    
    // Simulate saving new recording
    const newTranscript = {
      id: transcripts.length + 1,
      title: `New Recording - ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString().split('T')[0],
      duration: formatTime(recordingTime),
      speakers: ["Attorney", "Client"],
      status: "Processing",
      confidence: 0,
      wordCount: 0,
      tags: ["New Recording"],
      audioFile: `recording_${Date.now()}.wav`,
      size: `${(recordingTime * 0.5).toFixed(1)} MB`
    }
    
    setTranscripts(prev => [newTranscript, ...prev])
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const filteredTranscripts = transcripts.filter(transcript => {
    const matchesSearch = transcript.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transcript.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSpeaker = selectedSpeaker === 'all' || 
                          (selectedSpeaker === 'All Speakers') ||
                          transcript.speakers.includes(selectedSpeaker)
    return matchesSearch && matchesSpeaker
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'Complete': return 'text-green-400 bg-green-500/20'
      case 'Processing': return 'text-blue-400 bg-blue-500/20'
      case 'Error': return 'text-red-400 bg-red-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Left Sidebar Navigation */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-expert text-white">Audio Transcription</h2>
                  <p className="text-xs text-slate-400">Legal Recording Studio</p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {sidebarNavigation.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      item.active 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.a>
                ))}
              </div>
            </nav>

            {/* Recording Stats */}
            <div className="p-4 border-t border-slate-700">
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Mic className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">Recording Stats</span>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Total Recordings:</span>
                    <span className="text-cyan-400">{transcripts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month:</span>
                    <span className="text-green-400">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Hours:</span>
                    <span className="text-blue-400">47.5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Drive Integration */}
            <div className="p-4 border-t border-slate-700">
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Cloud className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">Google Drive</span>
                </div>
                <div className="text-xs text-slate-300 mb-2">
                  Connected: legal@lawfirm.com
                </div>
                <div className="text-xs text-slate-400">
                  Audio Files: 156 recordings
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div>
                <h1 className="text-xl font-expert text-white">Legal Audio Transcription</h1>
                <p className="text-sm text-slate-400">Professional recording and AI-powered transcription</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Bell className="h-5 w-5 text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Settings className="h-5 w-5 text-slate-400" />
              </button>
              <button 
                onClick={() => setShowWelcomeModal(true)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <HelpCircle className="h-5 w-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-expert p-6 rounded-xl mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-expert text-white flex items-center space-x-3">
                  <Mic className="h-6 w-6 text-cyan-400" />
                  <span>Audio Recording & Transcription</span>
                </h2>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActiveTab('record')}
                    className={`px-4 py-2 rounded-lg font-expert transition-colors ${
                      activeTab === 'record' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Record
                  </button>
                  <button
                    onClick={() => setActiveTab('transcripts')}
                    className={`px-4 py-2 rounded-lg font-expert transition-colors ${
                      activeTab === 'transcripts' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Transcripts
                  </button>
                  <button
                    onClick={() => setActiveTab('viewer')}
                    className={`px-4 py-2 rounded-lg font-expert transition-colors ${
                      activeTab === 'viewer' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Viewer
                  </button>
                </div>
              </div>

              {/* Recording Tab */}
              {activeTab === 'record' && (
                <div className="space-y-6">
                  {/* Recording Interface */}
                  <div className="bg-slate-800 rounded-lg p-8 text-center">
                    <div className="flex items-center justify-center mb-6">
                      <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isRecording 
                          ? 'bg-red-500/20 border-4 border-red-500 animate-pulse' 
                          : 'bg-slate-700 border-4 border-slate-600'
                      }`}>
                        <Mic className={`h-16 w-16 ${isRecording ? 'text-red-400' : 'text-slate-400'}`} />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-3xl font-expert text-white mb-2">
                        {formatTime(recordingTime)}
                      </div>
                      <div className={`text-sm ${
                        isRecording 
                          ? isPaused ? 'text-yellow-400' : 'text-red-400'
                          : 'text-slate-400'
                      }`}>
                        {isRecording 
                          ? isPaused ? 'Recording Paused' : 'Recording...'
                          : 'Ready to Record'
                        }
                      </div>
                    </div>

                    {/* Audio Level Indicator */}
                    {isRecording && (
                      <div className="mb-6">
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full"
                            style={{ width: `${audioLevel}%` }}
                            animate={{ width: `${audioLevel}%` }}
                            transition={{ duration: 0.1 }}
                          />
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Audio Level</div>
                      </div>
                    )}

                    {/* Recording Controls */}
                    <div className="flex items-center justify-center space-x-4">
                      {!isRecording ? (
                        <motion.button
                          onClick={startRecording}
                          className="gradient-trust px-8 py-4 rounded-lg font-expert flex items-center space-x-2 hover-expert"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Mic className="h-5 w-5" />
                          <span>Start Recording</span>
                        </motion.button>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <motion.button
                            onClick={pauseRecording}
                            className={`px-6 py-3 rounded-lg font-expert flex items-center space-x-2 transition-colors ${
                              isPaused 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                            <span>{isPaused ? 'Resume' : 'Pause'}</span>
                          </motion.button>
                          
                          <motion.button
                            onClick={stopRecording}
                            className="bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-3 rounded-lg font-expert flex items-center space-x-2 hover:bg-red-500/30 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Square className="h-4 w-4" />
                            <span>Stop</span>
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Upload Option */}
                    <div className="mt-8 pt-6 border-t border-slate-700">
                      <p className="text-slate-400 mb-4">Or upload an existing audio file</p>
                      <motion.button
                        className="glass-expert border border-cyan-500/30 hover:border-cyan-500/50 px-6 py-3 rounded-lg font-expert flex items-center space-x-2 mx-auto transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload Audio File</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {/* Transcripts Tab */}
              {activeTab === 'transcripts' && (
                <div className="space-y-6">
                  {/* Search and Filter */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search transcripts, tags, or speakers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    
                    <select
                      value={selectedSpeaker}
                      onChange={(e) => setSelectedSpeaker(e.target.value)}
                      className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    >
                      {speakers.map((speaker, index) => (
                        <option key={index} value={speaker}>{speaker}</option>
                      ))}
                    </select>
                  </div>

                  {/* Transcripts List */}
                  <div className="space-y-4">
                    {filteredTranscripts.map((transcript, index) => (
                      <motion.div
                        key={transcript.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedTranscript(transcript)
                          setActiveTab('viewer')
                        }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-expert text-white">{transcript.title}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(transcript.status)}`}>
                                {transcript.status}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{transcript.date}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{transcript.duration}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{transcript.speakers.join(', ')}</span>
                              </span>
                              {transcript.confidence > 0 && (
                                <span className="flex items-center space-x-1">
                                  <CheckCircle className="h-3 w-3" />
                                  <span>{transcript.confidence}% accuracy</span>
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {transcript.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="text-sm text-slate-300">{transcript.wordCount} words</div>
                              <div className="text-xs text-slate-500">{transcript.size}</div>
                            </div>
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                              <Download className="h-4 w-4 text-slate-400" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transcript Viewer Tab */}
              {activeTab === 'viewer' && selectedTranscript && (
                <div className="space-y-6">
                  {/* Transcript Header */}
                  <div className="bg-slate-800 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-expert text-white mb-2">{selectedTranscript.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span>{selectedTranscript.date}</span>
                          <span>{selectedTranscript.duration}</span>
                          <span>{selectedTranscript.speakers.join(', ')}</span>
                          <span>{selectedTranscript.confidence}% accuracy</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Share2 className="h-4 w-4 text-slate-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Download className="h-4 w-4 text-slate-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Edit className="h-4 w-4 text-slate-400" />
                        </button>
                      </div>
                    </div>

                    {/* Audio Player Controls */}
                    <div className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center space-x-4 mb-3">
                        <button
                          onClick={togglePlayback}
                          className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                        >
                          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </button>
                        
                        <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors">
                          <SkipBack className="h-4 w-4 text-slate-400" />
                        </button>
                        
                        <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors">
                          <SkipForward className="h-4 w-4 text-slate-400" />
                        </button>
                        
                        <div className="flex-1">
                          <div className="text-sm text-slate-300 mb-1">
                            {formatTime(playbackPosition)} / {selectedTranscript.duration}
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                              style={{ 
                                width: `${(playbackPosition / selectedTranscript.duration.split(':').reduce((acc, time) => (60 * acc) + +time, 0)) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                        
                        <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors">
                          <Volume2 className="h-4 w-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Transcript Content */}
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h4 className="text-lg font-expert text-white mb-4 flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-cyan-400" />
                      <span>Transcript</span>
                    </h4>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {selectedTranscript.transcript && selectedTranscript.transcript.map((entry, index) => (
                        <div key={index} className="flex space-x-4 p-3 hover:bg-slate-700 rounded-lg transition-colors">
                          <div className="text-xs text-slate-400 w-16 flex-shrink-0 mt-1">
                            {entry.timestamp}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-cyan-400">{entry.speaker}</span>
                              <span className="text-xs text-slate-500">({entry.confidence}%)</span>
                            </div>
                            
                            <p className="text-slate-300 text-sm leading-relaxed">
                              {entry.text.split(' ').map((word, wordIndex) => {
                                const isLegalTerm = entry.legalTerms && entry.legalTerms.some(term => 
                                  word.toLowerCase().includes(term.toLowerCase())
                                )
                                return (
                                  <span
                                    key={wordIndex}
                                    className={isLegalTerm ? 'bg-yellow-500/20 text-yellow-300 px-1 rounded' : ''}
                                  >
                                    {word}{' '}
                                  </span>
                                )
                              })}
                            </p>
                          </div>
                          
                          <div className="flex items-start space-x-1">
                            <button className="p-1 hover:bg-slate-600 rounded transition-colors">
                              <Edit className="h-3 w-3 text-slate-400" />
                            </button>
                            <button className="p-1 hover:bg-slate-600 rounded transition-colors">
                              <MessageSquare className="h-3 w-3 text-slate-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Annotations */}
                  {selectedTranscript.annotations && selectedTranscript.annotations.length > 0 && (
                    <div className="bg-slate-800 rounded-lg p-6">
                      <h4 className="text-lg font-expert text-white mb-4 flex items-center space-x-2">
                        <Tag className="h-5 w-5 text-cyan-400" />
                        <span>Annotations</span>
                      </h4>
                      
                      <div className="space-y-3">
                        {selectedTranscript.annotations.map((annotation, index) => (
                          <div key={index} className="p-3 bg-slate-700 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-slate-400">{annotation.timestamp}</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                annotation.type === 'legal' ? 'bg-blue-500/20 text-blue-400' :
                                annotation.type === 'evidence' ? 'bg-green-500/20 text-green-400' :
                                'bg-slate-500/20 text-slate-400'
                              }`}>
                                {annotation.type}
                              </span>
                            </div>
                            <p className="text-slate-300 text-sm">{annotation.note}</p>
                            <div className="text-xs text-slate-500 mt-1">by {annotation.author}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-8 max-w-2xl w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-expert text-white">
                  {welcomeSteps[currentStep - 1].title}
                </h2>
                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <p className="text-slate-300 mb-6">
                {welcomeSteps[currentStep - 1].description}
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {welcomeSteps[currentStep - 1].features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-cyan-400" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {welcomeSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index + 1 === currentStep ? 'bg-cyan-400' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  {currentStep < 4 ? (
                    <motion.button
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="gradient-trust px-6 py-2 rounded-lg font-expert flex items-center space-x-2 hover-expert"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => setShowWelcomeModal(false)}
                      className="gradient-trust px-6 py-2 rounded-lg font-expert hover-expert"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Recording
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AudioTranscription

