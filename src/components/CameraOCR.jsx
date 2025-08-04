import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import NavigationSidebar from './NavigationSidebar'
import { Camera, Upload, FileText, FolderOpen, Search, Filter, Star, Download, Eye, Trash2, Tag, Calendar, User, Clock, CheckCircle, AlertCircle, Zap, Cloud, Settings, X, Play, ChevronRight, Home, BookOpen, Mic, Scale, BarChart3, Menu, Bell, HelpCircle, HardDrive, Users } from 'lucide-react'

const CameraOCR = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [extractedText, setExtractedText] = useState('')
  const [confidenceScore, setConfidenceScore] = useState(0)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedTags, setSelectedTags] = useState([])
  const [showSidebar, setShowSidebar] = useState(true)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  // Sample documents with enhanced metadata
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: "VA Form 21-526EZ - Disability Compensation Application",
      type: "Disability Claim",
      date: "2024-01-15",
      size: "2.4 MB",
      pages: 8,
      confidence: 98,
      status: "processed",
      tags: ["Form 21-526EZ", "Disability", "Primary Claim"],
      driveFolder: "VA Claims/Disability Applications",
      extractedText: "Application for Disability Compensation and Related Compensation Benefits. Veteran Information: John Smith, SSN: XXX-XX-1234, Date of Birth: 01/15/1985...",
      thumbnail: "/api/placeholder/150/200",
      lastModified: "2024-01-15T10:30:00Z",
      createdBy: "Attorney Johnson"
    },
    {
      id: 2,
      title: "Medical Records - PTSD Evaluation",
      type: "Medical Evidence",
      date: "2024-01-10",
      size: "5.7 MB",
      pages: 15,
      confidence: 95,
      status: "processed",
      tags: ["PTSD", "Medical Records", "C&P Exam"],
      driveFolder: "VA Claims/Medical Evidence",
      extractedText: "Compensation and Pension Examination Report. Veteran exhibits symptoms consistent with Post-Traumatic Stress Disorder. Current diagnosis: PTSD, chronic, severe...",
      thumbnail: "/api/placeholder/150/200",
      lastModified: "2024-01-10T14:45:00Z",
      createdBy: "Dr. Sarah Wilson"
    },
    {
      id: 3,
      title: "Service Connection Letter - VA Decision",
      type: "VA Correspondence",
      date: "2024-01-08",
      size: "1.2 MB",
      pages: 4,
      confidence: 97,
      status: "processed",
      tags: ["Service Connection", "VA Decision", "Rating"],
      driveFolder: "VA Claims/Decisions",
      extractedText: "Department of Veterans Affairs notification regarding service connection decision. Your claim for service connection for PTSD has been granted at 70% rating...",
      thumbnail: "/api/placeholder/150/200",
      lastModified: "2024-01-08T09:15:00Z",
      createdBy: "VA Regional Office"
    },
    {
      id: 4,
      title: "Buddy Statement - Combat Incident",
      type: "Supporting Evidence",
      date: "2024-01-05",
      size: "0.8 MB",
      pages: 2,
      confidence: 92,
      status: "processed",
      tags: ["Buddy Statement", "Combat", "PTSD Support"],
      driveFolder: "VA Claims/Supporting Evidence",
      extractedText: "Statement in Support of Claim. I served with John Smith in Afghanistan from 2010-2011. On March 15, 2011, our convoy was attacked by an IED...",
      thumbnail: "/api/placeholder/150/200",
      lastModified: "2024-01-05T16:20:00Z",
      createdBy: "Former Squad Leader"
    }
  ])

  const availableTags = ["Disability Claim", "Medical Records", "VA Correspondence", "Supporting Evidence", "PTSD", "Service Connection", "C&P Exam", "Rating Decision"]

  const sidebarNavigation = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Camera, label: "Camera OCR", path: "/camera-ocr", active: true },
    { icon: BookOpen, label: "Legal Knowledge", path: "/legal-knowledge" },
    { icon: FileText, label: "Claim Guidance", path: "/claim-guidance" },
    { icon: Mic, label: "Audio Transcription", path: "/audio-transcription" },
    { icon: Scale, label: "Case Research", path: "/case-research" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" }
  ]

  const welcomeSteps = [
    {
      title: "Welcome to Camera OCR",
      description: "Transform your VA document processing with AI-powered OCR technology designed specifically for legal professionals.",
      features: ["99% accuracy on VA forms", "Instant text extraction", "Secure Google Drive storage", "Legal document recognition"]
    },
    {
      title: "Capture Documents",
      description: "Use your device camera or upload files to instantly digitize VA forms, medical records, and legal documents.",
      features: ["Real-time camera capture", "Multi-format support", "Batch processing", "Quality optimization"]
    },
    {
      title: "AI Processing",
      description: "Our specialized AI recognizes VA forms, extracts key information, and organizes content for legal review.",
      features: ["Form field recognition", "Legal terminology extraction", "Confidence scoring", "Error detection"]
    },
    {
      title: "Secure Storage",
      description: "All processed documents are automatically organized and stored in your secure Google Drive folders.",
      features: ["Automatic organization", "HIPAA compliance", "Version control", "Team collaboration"]
    }
  ]

  useEffect(() => {
    // Auto-advance welcome modal steps
    if (showWelcomeModal && currentStep < 4) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, showWelcomeModal])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCapturing(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      
      const imageData = canvas.toDataURL('image/jpeg')
      setCapturedImage(imageData)
      
      // Stop camera
      const stream = video.srcObject
      const tracks = stream.getTracks()
      tracks.forEach(track => track.stop())
      setIsCapturing(false)
      
      // Start processing
      processDocument(imageData)
    }
  }

  const processDocument = (imageData) => {
    setIsProcessing(true)
    setProcessingProgress(0)
    
    // Simulate AI processing with realistic progress
    const progressSteps = [
      { progress: 20, message: "Analyzing document structure..." },
      { progress: 40, message: "Detecting text regions..." },
      { progress: 60, message: "Extracting text content..." },
      { progress: 80, message: "Applying legal document recognition..." },
      { progress: 95, message: "Finalizing extraction..." },
      { progress: 100, message: "Processing complete!" }
    ]
    
    let stepIndex = 0
    const processInterval = setInterval(() => {
      if (stepIndex < progressSteps.length) {
        setProcessingProgress(progressSteps[stepIndex].progress)
        stepIndex++
      } else {
        clearInterval(processInterval)
        
        // Simulate extracted text
        const sampleText = `VA FORM 21-526EZ
APPLICATION FOR DISABILITY COMPENSATION AND RELATED COMPENSATION BENEFITS

SECTION I - VETERAN INFORMATION
1. VETERAN'S FIRST NAME: John
2. VETERAN'S MIDDLE NAME: Michael  
3. VETERAN'S LAST NAME: Smith
4. SOCIAL SECURITY NUMBER: XXX-XX-1234
5. DATE OF BIRTH: 01/15/1985
6. SERVICE NUMBER: 123456789

SECTION II - MILITARY SERVICE INFORMATION
7. BRANCH OF SERVICE: Army
8. DATE ENTERED ACTIVE DUTY: 06/15/2008
9. DATE SEPARATED FROM ACTIVE DUTY: 06/14/2012
10. SERVICE COMPONENT: Active Duty

SECTION III - DISABILITY INFORMATION
11. CONDITION(S) FOR WHICH YOU ARE CLAIMING COMPENSATION:
    - Post-Traumatic Stress Disorder (PTSD)
    - Tinnitus
    - Lower Back Strain

I CERTIFY THAT the statements made in this application are true and complete to the best of my knowledge and belief.

SIGNATURE: John M. Smith
DATE: 01/15/2024`
        
        setExtractedText(sampleText)
        setConfidenceScore(98)
        setIsProcessing(false)
        
        // Add to documents list
        const newDoc = {
          id: documents.length + 1,
          title: "VA Form 21-526EZ - New Application",
          type: "Disability Claim",
          date: new Date().toISOString().split('T')[0],
          size: "2.1 MB",
          pages: 6,
          confidence: 98,
          status: "processed",
          tags: ["Form 21-526EZ", "Disability", "New Claim"],
          driveFolder: "VA Claims/New Applications",
          extractedText: sampleText,
          thumbnail: imageData,
          lastModified: new Date().toISOString(),
          createdBy: "Current User"
        }
        
        setDocuments(prev => [newDoc, ...prev])
      }
    }, 800)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedImage(e.target.result)
        processDocument(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.extractedText.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || doc.type === selectedFilter
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => doc.tags.includes(tag))
    
    return matchesSearch && matchesFilter && matchesTags
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'processed': return 'text-green-400 bg-green-500/20'
      case 'processing': return 'text-yellow-400 bg-yellow-500/20'
      case 'error': return 'text-red-400 bg-red-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  const currentTool = {
    name: 'Camera OCR',
    description: 'Document Processing',
    icon: Camera,
    gradient: 'from-cyan-500 to-blue-600'
  }

  const toolStats = [
    { icon: FileText, label: 'Documents Processed', value: '247' },
    { icon: HardDrive, label: 'Storage Used', value: '2.4GB' },
    { icon: Users, label: 'Team Members', value: '3' },
    { icon: Clock, label: 'Processing Time', value: '< 30s' }
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Navigation Sidebar */}
      <NavigationSidebar 
        currentTool={currentTool}
        toolStats={toolStats}
        showSidebar={showSidebar}
      />

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
                <h1 className="text-xl font-bold text-white">Camera OCR Processing</h1>
                <p className="text-sm text-slate-400">AI-powered document digitization and text extraction</p>
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
            {/* Document Capture Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-expert p-8 rounded-xl mb-8"
            >
              <h2 className="text-2xl font-expert text-white mb-6 flex items-center space-x-3">
                <Camera className="h-6 w-6 text-cyan-400" />
                <span>Document Capture</span>
              </h2>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Camera Interface */}
                <div className="space-y-4">
                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    {!isCapturing && !capturedImage && (
                      <div className="text-center py-12">
                        <Camera className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-300 mb-4">Ready to capture documents</p>
                        <motion.button
                          onClick={startCamera}
                          className="gradient-trust px-6 py-3 rounded-lg font-expert flex items-center space-x-2 mx-auto hover-expert"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Camera className="h-5 w-5" />
                          <span>Start Camera</span>
                        </motion.button>
                      </div>
                    )}

                    {isCapturing && (
                      <div className="space-y-4">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full rounded-lg"
                        />
                        <div className="flex justify-center space-x-4">
                          <motion.button
                            onClick={capturePhoto}
                            className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Camera className="h-8 w-8" />
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {capturedImage && !isProcessing && (
                      <div className="space-y-4">
                        <img
                          src={capturedImage}
                          alt="Captured document"
                          className="w-full rounded-lg"
                        />
                        <div className="flex justify-center space-x-4">
                          <motion.button
                            onClick={() => setCapturedImage(null)}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-expert transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Retake
                          </motion.button>
                          <motion.button
                            onClick={() => processDocument(capturedImage)}
                            className="gradient-trust px-4 py-2 rounded-lg font-expert hover-expert"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Process Document
                          </motion.button>
                        </div>
                      </div>
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  {/* Upload Alternative */}
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-cyan-500/50 transition-colors">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-300 text-sm mb-2">Or upload a document</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <motion.button
                      onClick={() => fileInputRef.current?.click()}
                      className="glass-expert border border-cyan-500/30 hover:border-cyan-500/50 px-4 py-2 rounded-lg font-expert transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Choose File
                    </motion.button>
                  </div>
                </div>

                {/* Processing & Results */}
                <div className="space-y-4">
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-800 rounded-lg p-6 border border-slate-700"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
                        <span className="text-cyan-400 font-expert">Processing Document...</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${processingProgress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <div className="text-sm text-slate-300">{processingProgress}% complete</div>
                      </div>
                    </motion.div>
                  )}

                  {extractedText && !isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-800 rounded-lg p-6 border border-slate-700"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-expert text-white">Extracted Text</h3>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <span className="text-green-400 font-expert">{confidenceScore}% confidence</span>
                        </div>
                      </div>
                      
                      <div className="bg-slate-900 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                          {extractedText}
                        </pre>
                      </div>
                      
                      <div className="flex space-x-3 mt-4">
                        <motion.button
                          className="gradient-trust px-4 py-2 rounded-lg font-expert flex items-center space-x-2 hover-expert"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Cloud className="h-4 w-4" />
                          <span>Save to Drive</span>
                        </motion.button>
                        
                        <motion.button
                          className="glass-expert border border-cyan-500/30 hover:border-cyan-500/50 px-4 py-2 rounded-lg font-expert flex items-center space-x-2 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Download className="h-4 w-4" />
                          <span>Export</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Document Library */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-expert p-8 rounded-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-expert text-white flex items-center space-x-3">
                  <FolderOpen className="h-6 w-6 text-cyan-400" />
                  <span>Document Library</span>
                </h2>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="Disability Claim">Disability Claims</option>
                    <option value="Medical Evidence">Medical Records</option>
                    <option value="VA Correspondence">VA Correspondence</option>
                    <option value="Supporting Evidence">Supporting Evidence</option>
                  </select>
                </div>
              </div>

              {/* Tag Filter */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <motion.button
                      key={tag}
                      onClick={() => {
                        setSelectedTags(prev => 
                          prev.includes(tag) 
                            ? prev.filter(t => t !== tag)
                            : [...prev, tag]
                        )
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Documents Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-expert text-white mb-2 line-clamp-2">{doc.title}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                          <span className="text-slate-400 text-xs">{doc.confidence}% confidence</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <motion.button
                          className="p-1 hover:bg-slate-700 rounded transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Star className="h-4 w-4 text-slate-400" />
                        </motion.button>
                        <motion.button
                          className="p-1 hover:bg-slate-700 rounded transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Download className="h-4 w-4 text-slate-400" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-400">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{doc.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FileText className="h-3 w-3" />
                          <span>{doc.pages} pages</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <FolderOpen className="h-3 w-3" />
                        <span className="text-xs">{doc.driveFolder}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {doc.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {doc.tags.length > 2 && (
                        <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                          +{doc.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
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
                      Get Started
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDocument(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-expert text-white">{selectedDocument.title}</h2>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-slate-900 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-expert text-white mb-3">Extracted Text</h3>
                    <div className="max-h-96 overflow-y-auto">
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                        {selectedDocument.extractedText}
                      </pre>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-white font-expert mb-3">Document Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type:</span>
                        <span className="text-white">{selectedDocument.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Pages:</span>
                        <span className="text-white">{selectedDocument.pages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Size:</span>
                        <span className="text-white">{selectedDocument.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Confidence:</span>
                        <span className="text-green-400">{selectedDocument.confidence}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Created by:</span>
                        <span className="text-white">{selectedDocument.createdBy}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-white font-expert mb-3">Google Drive</h4>
                    <div className="text-sm text-slate-300 mb-3">
                      {selectedDocument.driveFolder}
                    </div>
                    <motion.button
                      className="w-full gradient-trust px-4 py-2 rounded-lg font-expert flex items-center justify-center space-x-2 hover-expert"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FolderOpen className="h-4 w-4" />
                      <span>Open in Drive</span>
                    </motion.button>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-white font-expert mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDocument.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CameraOCR

