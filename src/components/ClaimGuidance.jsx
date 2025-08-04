import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Upload, Camera, Search, Filter, Star, Download, Eye, ExternalLink, Calendar, User, Clock, CheckCircle, AlertCircle, Zap, Cloud, Settings, X, Play, ChevronRight, Home, BookOpen, Mic, Scale, BarChart3, Menu, Bell, HelpCircle, Tag, Bookmark, History, TrendingUp, Award, Shield, Target, ArrowRight, Plus, Edit, Trash2, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react'

const ClaimGuidance = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCase, setSelectedCase] = useState(null)
  const [uploadedDocuments, setUploadedDocuments] = useState([])
  const [analysisResults, setAnalysisResults] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeTab, setActiveTab] = useState('upload')
  const [processingStatus, setProcessingStatus] = useState('idle')

  const sidebarNavigation = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Camera, label: "Camera OCR", path: "/camera-ocr" },
    { icon: BookOpen, label: "Legal Knowledge", path: "/legal-knowledge" },
    { icon: FileText, label: "Claim Guidance", path: "/claim-guidance", active: true },
    { icon: Mic, label: "Audio Transcription", path: "/audio-transcription" },
    { icon: Scale, label: "Case Research", path: "/case-research" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" }
  ]

  const welcomeSteps = [
    {
      title: "Welcome to Claim Guidance",
      description: "AI-powered step-by-step guidance for optimal VA disability claim strategy and evidence collection.",
      features: ["Document analysis", "Evidence gap identification", "Deadline tracking", "Form recommendations"]
    },
    {
      title: "Document Upload & Analysis",
      description: "Upload VA paperwork and receive comprehensive AI analysis with actionable insights.",
      features: ["OCR document processing", "Form recognition", "Content extraction", "Legal analysis"]
    },
    {
      title: "Evidence Gap Detection",
      description: "Identify missing evidence and receive specific recommendations for strengthening your case.",
      features: ["Missing evidence alerts", "Recommendation engine", "Priority scoring", "Action items"]
    },
    {
      title: "Step-by-Step Workflow",
      description: "Follow personalized guidance with deadlines, forms, and next steps for optimal claim outcomes.",
      features: ["Workflow automation", "Deadline management", "Form generation", "Progress tracking"]
    }
  ]

  // Sample case data
  const [cases, setCases] = useState([
    {
      id: 1,
      veteranName: "John Smith",
      claimType: "PTSD Service Connection",
      status: "Evidence Development",
      progress: 65,
      priority: "High",
      nextDeadline: "2024-02-15",
      documentsUploaded: 8,
      evidenceGaps: 3,
      lastActivity: "2024-01-25",
      description: "Combat-related PTSD claim with multiple stressor events during Iraq deployment.",
      stressors: ["IED explosion", "Combat operations", "Loss of unit member"],
      currentEvidence: [
        { type: "Service Records", status: "Complete", confidence: 95 },
        { type: "Medical Records", status: "Partial", confidence: 70 },
        { type: "Buddy Statements", status: "Missing", confidence: 0 },
        { type: "Stressor Verification", status: "In Progress", confidence: 60 }
      ],
      recommendations: [
        {
          priority: "High",
          action: "Obtain buddy statements from unit members",
          deadline: "2024-02-10",
          impact: "Critical for stressor verification",
          forms: ["VA Form 21-4138"]
        },
        {
          priority: "Medium",
          action: "Request complete medical records from VA",
          deadline: "2024-02-05",
          impact: "Needed for continuity of symptoms",
          forms: ["VA Form 21-4142"]
        },
        {
          priority: "Medium",
          action: "Schedule C&P examination",
          deadline: "2024-02-20",
          impact: "Required for current diagnosis",
          forms: ["Automated by VA"]
        }
      ],
      timeline: [
        { date: "2024-01-25", event: "Initial claim filed", status: "Complete" },
        { date: "2024-01-28", event: "Service records obtained", status: "Complete" },
        { date: "2024-02-01", event: "Medical records requested", status: "In Progress" },
        { date: "2024-02-05", event: "Medical records due", status: "Pending" },
        { date: "2024-02-10", event: "Buddy statements due", status: "Pending" },
        { date: "2024-02-15", event: "Evidence submission deadline", status: "Pending" }
      ]
    },
    {
      id: 2,
      veteranName: "Maria Rodriguez",
      claimType: "Knee Injury Secondary Connection",
      status: "Ready for Submission",
      progress: 90,
      priority: "Medium",
      nextDeadline: "2024-02-08",
      documentsUploaded: 12,
      evidenceGaps: 1,
      lastActivity: "2024-01-26",
      description: "Secondary service connection for knee injury due to service-connected back condition.",
      currentEvidence: [
        { type: "Service Records", status: "Complete", confidence: 100 },
        { type: "Medical Records", status: "Complete", confidence: 95 },
        { type: "Medical Opinion", status: "Complete", confidence: 90 },
        { type: "Lay Evidence", status: "Partial", confidence: 75 }
      ],
      recommendations: [
        {
          priority: "Low",
          action: "Obtain additional lay statements about functional impact",
          deadline: "2024-02-08",
          impact: "Strengthens functional limitation evidence",
          forms: ["VA Form 21-4138"]
        }
      ]
    }
  ])

  const documentTypes = [
    { type: "VA Forms", icon: FileText, color: "text-blue-400 bg-blue-500/20" },
    { type: "Medical Records", icon: FileText, color: "text-green-400 bg-green-500/20" },
    { type: "Service Records", icon: Shield, color: "text-purple-400 bg-purple-500/20" },
    { type: "Supporting Evidence", icon: Star, color: "text-yellow-400 bg-yellow-500/20" }
  ]

  useEffect(() => {
    if (showWelcomeModal && currentStep < 4) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, showWelcomeModal])

  const handleDocumentUpload = (files) => {
    setProcessingStatus('processing')
    
    // Simulate document processing
    setTimeout(() => {
      const newDocs = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Processed',
        confidence: Math.floor(Math.random() * 20) + 80,
        extractedText: "Sample extracted text from VA document...",
        formType: "VA Form 21-526EZ",
        category: "Disability Claim"
      }))
      
      setUploadedDocuments(prev => [...prev, ...newDocs])
      setProcessingStatus('complete')
      
      // Simulate analysis results
      setTimeout(() => {
        setAnalysisResults({
          overallScore: 78,
          strengths: [
            "Complete service records documentation",
            "Current medical evidence present",
            "Clear nexus established"
          ],
          gaps: [
            "Missing buddy statements for stressor verification",
            "Incomplete continuity of treatment records",
            "No lay evidence for functional impact"
          ],
          nextSteps: [
            "Obtain buddy statements from unit members",
            "Request complete VA medical records",
            "Schedule independent medical examination"
          ],
          recommendations: [
            {
              priority: "High",
              action: "File VA Form 21-4138 for buddy statements",
              timeline: "Within 30 days",
              impact: "Critical for claim success"
            },
            {
              priority: "Medium", 
              action: "Request records using VA Form 21-4142",
              timeline: "Within 14 days",
              impact: "Strengthens medical evidence"
            }
          ]
        })
      }, 2000)
    }, 3000)
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-400 bg-red-500/20'
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20'
      case 'Low': return 'text-green-400 bg-green-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Complete': return 'text-green-400 bg-green-500/20'
      case 'In Progress': return 'text-blue-400 bg-blue-500/20'
      case 'Partial': return 'text-yellow-400 bg-yellow-500/20'
      case 'Missing': return 'text-red-400 bg-red-500/20'
      case 'Pending': return 'text-slate-400 bg-slate-500/20'
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
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-expert text-white">Claim Guidance</h2>
                  <p className="text-xs text-slate-400">AI-Powered Analysis</p>
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

            {/* Case Summary */}
            <div className="p-4 border-t border-slate-700">
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">Active Cases</span>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Total Cases:</span>
                    <span className="text-cyan-400">{cases.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Priority:</span>
                    <span className="text-red-400">{cases.filter(c => c.priority === 'High').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due This Week:</span>
                    <span className="text-yellow-400">3</span>
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
                  Case Files: 247 documents
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
                <h1 className="text-xl font-expert text-white">VA Claim Guidance</h1>
                <p className="text-sm text-slate-400">AI-powered step-by-step claim analysis and guidance</p>
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
                  <Target className="h-6 w-6 text-cyan-400" />
                  <span>Claim Analysis Workflow</span>
                </h2>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-4 py-2 rounded-lg font-expert transition-colors ${
                      activeTab === 'upload' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Upload & Analyze
                  </button>
                  <button
                    onClick={() => setActiveTab('cases')}
                    className={`px-4 py-2 rounded-lg font-expert transition-colors ${
                      activeTab === 'cases' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Active Cases
                  </button>
                  <button
                    onClick={() => setActiveTab('guidance')}
                    className={`px-4 py-2 rounded-lg font-expert transition-colors ${
                      activeTab === 'guidance' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Step-by-Step
                  </button>
                </div>
              </div>

              {/* Upload & Analyze Tab */}
              {activeTab === 'upload' && (
                <div className="space-y-6">
                  {/* Document Upload Area */}
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Upload className="h-12 w-12 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-expert text-white mb-2">Upload VA Documents</h3>
                    <p className="text-slate-400 mb-4">
                      Upload VA forms, medical records, or supporting documents for AI analysis
                    </p>
                    
                    <div className="flex items-center justify-center space-x-4">
                      <motion.button
                        className="gradient-trust px-6 py-3 rounded-lg font-expert flex items-center space-x-2 hover-expert"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.multiple = true
                          input.accept = '.pdf,.doc,.docx,.jpg,.png'
                          input.onchange = (e) => handleDocumentUpload(e.target.files)
                          input.click()
                        }}
                      >
                        <Upload className="h-4 w-4" />
                        <span>Choose Files</span>
                      </motion.button>
                      
                      <motion.button
                        className="glass-expert border border-cyan-500/30 hover:border-cyan-500/50 px-6 py-3 rounded-lg font-expert flex items-center space-x-2 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Camera className="h-4 w-4" />
                        <span>Use Camera</span>
                      </motion.button>
                    </div>
                    
                    <p className="text-xs text-slate-500 mt-4">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
                    </p>
                  </div>

                  {/* Processing Status */}
                  {processingStatus === 'processing' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-800 rounded-lg p-6"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
                        <span className="text-white font-expert">Processing Documents...</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3 }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Uploaded Documents */}
                  {uploadedDocuments.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-800 rounded-lg p-6"
                    >
                      <h3 className="text-lg font-expert text-white mb-4 flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-cyan-400" />
                        <span>Uploaded Documents</span>
                      </h3>
                      
                      <div className="space-y-3">
                        {uploadedDocuments.map((doc, index) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-cyan-400" />
                              <div>
                                <h4 className="text-white font-medium">{doc.name}</h4>
                                <p className="text-sm text-slate-400">{doc.formType} • {doc.category}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 text-sm">{doc.confidence}%</span>
                              </div>
                              <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors">
                                <Eye className="h-4 w-4 text-slate-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Analysis Results */}
                  {analysisResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-800 rounded-lg p-6"
                    >
                      <h3 className="text-lg font-expert text-white mb-4 flex items-center space-x-2">
                        <Target className="h-5 w-5 text-cyan-400" />
                        <span>AI Analysis Results</span>
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-white font-expert mb-3 flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Strengths Identified</span>
                          </h4>
                          <ul className="space-y-2">
                            {analysisResults.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-300 text-sm">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-white font-expert mb-3 flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-400" />
                            <span>Evidence Gaps</span>
                          </h4>
                          <ul className="space-y-2">
                            {analysisResults.gaps.map((gap, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-300 text-sm">{gap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-expert">Overall Claim Strength</span>
                          <span className="text-cyan-400 font-bold">{analysisResults.overallScore}%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${analysisResults.overallScore}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Active Cases Tab */}
              {activeTab === 'cases' && (
                <div className="space-y-4">
                  {cases.map((caseItem, index) => (
                    <motion.div
                      key={caseItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedCase(caseItem)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-expert text-white">{caseItem.veteranName}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                              {caseItem.priority} Priority
                            </span>
                          </div>
                          
                          <p className="text-cyan-400 font-medium mb-2">{caseItem.claimType}</p>
                          <p className="text-slate-300 text-sm mb-3">{caseItem.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-slate-400">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Due: {caseItem.nextDeadline}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <FileText className="h-3 w-3" />
                              <span>{caseItem.documentsUploaded} docs</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <AlertTriangle className="h-3 w-3" />
                              <span>{caseItem.evidenceGaps} gaps</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-cyan-400 mb-1">{caseItem.progress}%</div>
                          <div className="text-xs text-slate-400 mb-2">Complete</div>
                          <div className="w-20 bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                              style={{ width: `${caseItem.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Step-by-Step Guidance Tab */}
              {activeTab === 'guidance' && selectedCase && (
                <div className="space-y-6">
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h3 className="text-lg font-expert text-white mb-4 flex items-center space-x-2">
                      <User className="h-5 w-5 text-cyan-400" />
                      <span>{selectedCase.veteranName} - {selectedCase.claimType}</span>
                    </h3>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-white font-expert mb-3">Current Evidence</h4>
                        <div className="space-y-2">
                          {selectedCase.currentEvidence.map((evidence, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                              <span className="text-slate-300 text-sm">{evidence.type}</span>
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(evidence.status)}`}>
                                {evidence.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-expert mb-3">Recommendations</h4>
                        <div className="space-y-3">
                          {selectedCase.recommendations.map((rec, index) => (
                            <div key={index} className="p-3 bg-slate-700 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(rec.priority)}`}>
                                  {rec.priority}
                                </span>
                                <span className="text-xs text-slate-400">{rec.deadline}</span>
                              </div>
                              <p className="text-white text-sm font-medium mb-1">{rec.action}</p>
                              <p className="text-slate-400 text-xs">{rec.impact}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-expert mb-3">Timeline</h4>
                        <div className="space-y-2">
                          {selectedCase.timeline.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                item.status === 'Complete' ? 'bg-green-400' :
                                item.status === 'In Progress' ? 'bg-blue-400' : 'bg-slate-500'
                              }`} />
                              <div className="flex-1">
                                <p className="text-white text-sm">{item.event}</p>
                                <p className="text-slate-400 text-xs">{item.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
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
                      Start Analyzing
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

export default ClaimGuidance

