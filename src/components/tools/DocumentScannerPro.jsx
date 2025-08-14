import React, { useState, useRef, useCallback, useEffect } from 'react'
import { 
  Camera, Upload, FileText, Download, CheckCircle, Eye, Copy, Trash2, 
  Loader, X, Save, Cloud, Brain, Zap, Shield, AlertCircle, 
  FileCheck, FolderOpen, Search, Filter, ChevronRight, Info,
  Clock, Calendar, User, Star, TrendingUp, Award, Database,
  BookOpen, Scale, Briefcase, FileSearch, Settings, HelpCircle,
  ArrowRight, ChevronDown, Plus, Layers, RefreshCw, Share2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Document types specific to VA claims
const VA_DOCUMENT_TYPES = {
  'VA_FORM_21_526EZ': { name: 'VA Form 21-526EZ', category: 'Disability Claim', priority: 'high' },
  'VA_FORM_21_4142': { name: 'VA Form 21-4142', category: 'Medical Release', priority: 'high' },
  'VA_FORM_21_0966': { name: 'VA Form 21-0966', category: 'Intent to File', priority: 'critical' },
  'DD_214': { name: 'DD Form 214', category: 'Service Record', priority: 'critical' },
  'DBQ': { name: 'Disability Benefits Questionnaire', category: 'Medical Evidence', priority: 'high' },
  'C_AND_P_EXAM': { name: 'C&P Exam Report', category: 'Medical Evidence', priority: 'high' },
  'MEDICAL_RECORDS': { name: 'Medical Records', category: 'Medical Evidence', priority: 'medium' },
  'NEXUS_LETTER': { name: 'Nexus Letter', category: 'Medical Opinion', priority: 'critical' },
  'BUDDY_STATEMENT': { name: 'Buddy Statement', category: 'Lay Evidence', priority: 'medium' },
  'BVA_DECISION': { name: 'BVA Decision', category: 'Legal Document', priority: 'high' },
  'RATING_DECISION': { name: 'Rating Decision', category: 'VA Decision', priority: 'high' },
  'NOD': { name: 'Notice of Disagreement', category: 'Appeal', priority: 'critical' },
}

const DocumentScannerPro = () => {
  // State Management
  const [activeView, setActiveView] = useState('upload') // upload, processing, library
  const [documents, setDocuments] = useState([])
  const [processingQueue, setProcessingQueue] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [selectedDocuments, setSelectedDocuments] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [batchMode, setBatchMode] = useState(false)
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [driveConnected, setDriveConnected] = useState(false)
  const [autoAnalyze, setAutoAnalyze] = useState(true)
  const [ocrProgress, setOcrProgress] = useState({})
  
  // Refs
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  // Simulate Google Drive connection
  useEffect(() => {
    // In production, this would connect to actual Google Drive API
    setTimeout(() => setDriveConnected(true), 1000)
  }, [])

  // Real-time OCR Processing
  const processDocumentOCR = useCallback(async (file, docId) => {
    // Update progress in real-time
    const updateProgress = (progress) => {
      setOcrProgress(prev => ({ ...prev, [docId]: progress }))
    }

    // Simulate OCR processing stages
    updateProgress(10)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    updateProgress(30)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    updateProgress(60)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    updateProgress(90)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    updateProgress(100)

    // Simulate OCR results
    return {
      text: `Extracted text from ${file.name}...`,
      confidence: 0.97,
      language: 'en',
      pages: 1,
      formType: detectFormType(file.name),
    }
  }, [])

  // AI Document Analysis
  const analyzeDocument = useCallback(async (document) => {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1000))

    const formType = document.metadata?.formType || 'MEDICAL_RECORDS'
    const docType = VA_DOCUMENT_TYPES[formType] || VA_DOCUMENT_TYPES.MEDICAL_RECORDS

    return {
      summary: `This is a ${docType.name} document that contains critical information for the veteran's claim.`,
      keyFindings: [
        'Service-connected disability identified',
        'Medical nexus established',
        'Symptoms documented over time',
        'Treatment history recorded'
      ],
      nextSteps: [
        {
          action: 'Review for completeness',
          description: 'Ensure all required fields are properly filled',
          priority: 'high',
          deadline: '48 hours'
        },
        {
          action: 'Cross-reference with medical records',
          description: 'Verify consistency with existing medical documentation',
          priority: 'medium',
          deadline: '1 week'
        },
        {
          action: 'Submit to VA',
          description: 'Include in next claim submission package',
          priority: 'high',
          deadline: '2 weeks'
        }
      ],
      legalInsights: {
        relevantStatutes: ['38 CFR § 3.159', '38 CFR § 3.303'],
        caseLaw: ['Shedden v. Principi', 'Walker v. Shinseki'],
        strengthOfEvidence: 85,
        recommendations: 'This document provides strong evidence for service connection. Consider obtaining additional buddy statements to corroborate.'
      },
      riskAssessment: {
        level: 'low',
        factors: ['Document is complete', 'Medical evidence is strong', 'Timeline is consistent'],
        mitigations: ['Obtain additional lay evidence', 'Request C&P examination']
      }
    }
  }, [])

  // Detect VA form type from filename or content
  const detectFormType = useCallback((filename) => {
    const lowercaseName = filename.toLowerCase()
    if (lowercaseName.includes('21-526')) return 'VA_FORM_21_526EZ'
    if (lowercaseName.includes('21-4142')) return 'VA_FORM_21_4142'
    if (lowercaseName.includes('21-0966')) return 'VA_FORM_21_0966'
    if (lowercaseName.includes('dd214') || lowercaseName.includes('dd 214')) return 'DD_214'
    if (lowercaseName.includes('dbq')) return 'DBQ'
    if (lowercaseName.includes('c&p') || lowercaseName.includes('comp')) return 'C_AND_P_EXAM'
    if (lowercaseName.includes('nexus')) return 'NEXUS_LETTER'
    if (lowercaseName.includes('buddy') || lowercaseName.includes('statement')) return 'BUDDY_STATEMENT'
    if (lowercaseName.includes('bva')) return 'BVA_DECISION'
    if (lowercaseName.includes('rating')) return 'RATING_DECISION'
    if (lowercaseName.includes('nod') || lowercaseName.includes('disagreement')) return 'NOD'
    return 'MEDICAL_RECORDS'
  }, [])

  // Handle file upload (single or batch)
  const handleFileUpload = useCallback(async (files) => {
    const fileArray = Array.from(files)
    
    // Validate files
    const validFiles = fileArray.filter(file => {
      const isValid = file.size <= 50 * 1024 * 1024 // 50MB limit
      const isSupported = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)
      return isValid && isSupported
    })

    if (validFiles.length === 0) {
      alert('Please upload valid files (JPG, PNG, or PDF, max 50MB each)')
      return
    }

    setIsProcessing(true)
    setActiveView('processing')
    
    // Process each file
    for (const file of validFiles) {
      const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Add to processing queue
      setProcessingQueue(prev => [...prev, { id: docId, file, status: 'processing' }])
      
      // Process OCR
      const ocrResult = await processDocumentOCR(file, docId)
      
      // Create document object
      const newDocument = {
        id: docId,
        filename: file.name,
        fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        uploadDate: new Date().toISOString(),
        type: file.type,
        status: 'processed',
        metadata: {
          formType: ocrResult.formType,
          confidence: ocrResult.confidence,
          pages: ocrResult.pages,
          language: ocrResult.language,
        },
        extractedText: ocrResult.text,
        analysis: null,
        driveLink: driveConnected ? `https://drive.google.com/file/${docId}` : null,
        tags: [],
        notes: '',
        category: VA_DOCUMENT_TYPES[ocrResult.formType]?.category || 'Other',
        priority: VA_DOCUMENT_TYPES[ocrResult.formType]?.priority || 'low',
      }

      // Auto-analyze if enabled
      if (autoAnalyze) {
        const analysis = await analyzeDocument(newDocument)
        newDocument.analysis = analysis
      }

      // Add to documents
      setDocuments(prev => [newDocument, ...prev])
      
      // Remove from processing queue
      setProcessingQueue(prev => prev.filter(item => item.id !== docId))
    }

    setIsProcessing(false)
    setActiveView('library')
  }, [processDocumentOCR, analyzeDocument, autoAnalyze, driveConnected])

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-emerald-500', 'bg-emerald-500/10')
    }
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-emerald-500', 'bg-emerald-500/10')
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-emerald-500', 'bg-emerald-500/10')
    }
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [handleFileUpload])

  // Export document or batch
  const exportDocuments = useCallback((docs) => {
    const exportData = docs.map(doc => ({
      filename: doc.filename,
      formType: doc.metadata?.formType,
      extractedText: doc.extractedText,
      analysis: doc.analysis,
      uploadDate: doc.uploadDate,
    }))

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `VA_Documents_Export_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  // Filter documents based on search and category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.extractedText?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Get statistics
  const stats = {
    total: documents.length,
    processed: documents.filter(d => d.status === 'processed').length,
    analyzed: documents.filter(d => d.analysis).length,
    highPriority: documents.filter(d => d.priority === 'critical' || d.priority === 'high').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileSearch className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Document Intelligence Pro</h1>
                <p className="text-slate-400 text-sm">AI-Powered VA Document Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Google Drive Status */}
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                driveConnected ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                <Cloud className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {driveConnected ? 'Drive Connected' : 'Connecting...'}
                </span>
              </div>
              
              {/* Stats */}
              <div className="flex items-center space-x-6 px-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-xs text-slate-400">Documents</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{stats.analyzed}</p>
                  <p className="text-xs text-slate-400">Analyzed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">{stats.highPriority}</p>
                  <p className="text-xs text-slate-400">Priority</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* View Tabs */}
        <div className="flex space-x-2 mb-6">
          {[
            { id: 'upload', label: 'Upload', icon: Upload },
            { id: 'processing', label: 'Processing', icon: Loader, count: processingQueue.length },
            { id: 'library', label: 'Library', icon: Database, count: documents.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeView === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-emerald-500/30 text-emerald-400 text-xs rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Upload View */}
          {activeView === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Area */}
                <div className="lg:col-span-2">
                  <div
                    ref={dropZoneRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-dashed border-slate-600 p-12 text-center transition-all duration-300 hover:border-emerald-500/50"
                  >
                    <Upload className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Drop VA Documents Here</h3>
                    <p className="text-slate-400 mb-6">
                      Support for VA Forms, DD-214, Medical Records, C&P Exams, and more
                    </p>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                    
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300"
                      >
                        <FolderOpen className="inline-block h-5 w-5 mr-2" />
                        Select Files
                      </button>
                      <button
                        onClick={() => {
                          setBatchMode(!batchMode)
                          fileInputRef.current?.click()
                        }}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all duration-300"
                      >
                        <Layers className="inline-block h-5 w-5 mr-2" />
                        Batch Upload
                      </button>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <CheckCircle className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                        <p className="text-slate-400">Auto-Classification</p>
                      </div>
                      <div className="text-center">
                        <Zap className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                        <p className="text-slate-400">Real-time OCR</p>
                      </div>
                      <div className="text-center">
                        <Brain className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                        <p className="text-slate-400">AI Analysis</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings Panel */}
                <div className="space-y-6">
                  {/* Processing Settings */}
                  <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-emerald-400" />
                      Processing Settings
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <span className="text-slate-300">Auto-Analyze Documents</span>
                        <input
                          type="checkbox"
                          checked={autoAnalyze}
                          onChange={(e) => setAutoAnalyze(e.target.checked)}
                          className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-slate-300">Save to Google Drive</span>
                        <input
                          type="checkbox"
                          checked={driveConnected}
                          onChange={(e) => setDriveConnected(e.target.checked)}
                          className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-slate-300">Extract Tables & Forms</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Supported Documents */}
                  <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
                    <h3 className="text-lg font-bold text-white mb-4">Supported Documents</h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(VA_DOCUMENT_TYPES).slice(0, 6).map(([key, type]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-slate-400">{type.name}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            type.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                            type.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {type.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Processing View */}
          {activeView === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {processingQueue.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-12 text-center border border-slate-700">
                  <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">All Documents Processed</h3>
                  <p className="text-slate-400">No documents in processing queue</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {processingQueue.map(item => (
                    <div key={item.id} className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Loader className="h-5 w-5 text-emerald-400 animate-spin" />
                          <span className="font-medium text-white">{item.file.name}</span>
                        </div>
                        <span className="text-sm text-slate-400">Processing...</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${ocrProgress[item.id] || 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        OCR Progress: {ocrProgress[item.id] || 0}%
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Library View */}
          {activeView === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Filters and Search */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 mb-6 border border-slate-700">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search documents..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="Disability Claim">Disability Claims</option>
                    <option value="Medical Evidence">Medical Evidence</option>
                    <option value="Service Record">Service Records</option>
                    <option value="Appeal">Appeals</option>
                    <option value="Legal Document">Legal Documents</option>
                  </select>
                  <button
                    onClick={() => exportDocuments(selectedDocuments.length > 0 ? 
                      documents.filter(d => selectedDocuments.includes(d.id)) : documents)}
                    className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Documents Grid */}
              {filteredDocuments.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-12 text-center border border-slate-700">
                  <Database className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Documents Found</h3>
                  <p className="text-slate-400">Upload documents to see them here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredDocuments.map(doc => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 hover:border-emerald-500/30 transition-all duration-300"
                    >
                      {/* Document Header */}
                      <div className="p-6 border-b border-slate-700">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedDocuments.includes(doc.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDocuments([...selectedDocuments, doc.id])
                                } else {
                                  setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id))
                                }
                              }}
                              className="mt-1 w-4 h-4 rounded bg-slate-700 border-slate-600 text-emerald-500"
                            />
                            <div>
                              <h3 className="font-bold text-white">{doc.filename}</h3>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="text-xs text-slate-400">{doc.fileSize}</span>
                                <span className="text-xs text-slate-400">
                                  {new Date(doc.uploadDate).toLocaleDateString()}
                                </span>
                                {doc.driveLink && (
                                  <Cloud className="h-3 w-3 text-green-400" />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              doc.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                              doc.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                              doc.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {doc.priority}
                            </span>
                          </div>
                        </div>

                        {/* Document Type Badge */}
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full">
                            {VA_DOCUMENT_TYPES[doc.metadata?.formType]?.name || 'Unknown Document'}
                          </span>
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                            {doc.category}
                          </span>
                          {doc.metadata?.confidence && (
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                              {Math.round(doc.metadata.confidence * 100)}% OCR Confidence
                            </span>
                          )}
                        </div>
                      </div>

                      {/* AI Analysis Summary */}
                      {doc.analysis && (
                        <div className="p-6 border-b border-slate-700">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-white flex items-center">
                              <Brain className="h-4 w-4 mr-2 text-purple-400" />
                              AI Analysis
                            </h4>
                            <button
                              onClick={() => setSelectedDocument(doc)}
                              className="text-xs text-emerald-400 hover:text-emerald-300"
                            >
                              View Full Analysis →
                            </button>
                          </div>
                          <p className="text-sm text-slate-300 mb-3">{doc.analysis.summary}</p>
                          
                          {/* Key Findings */}
                          <div className="mb-3">
                            <p className="text-xs font-medium text-slate-400 mb-1">Key Findings:</p>
                            <div className="flex flex-wrap gap-2">
                              {doc.analysis.keyFindings.slice(0, 3).map((finding, idx) => (
                                <span key={idx} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                                  {finding}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Next Steps */}
                          <div>
                            <p className="text-xs font-medium text-slate-400 mb-1">Recommended Next Step:</p>
                            <div className="flex items-center space-x-2">
                              <ArrowRight className="h-4 w-4 text-emerald-400" />
                              <span className="text-sm text-emerald-400">
                                {doc.analysis.nextSteps[0]?.action}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedDocument(doc)}
                            className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                            title="View Document"
                          >
                            <Eye className="h-4 w-4 text-white" />
                          </button>
                          <button
                            className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="h-4 w-4 text-white" />
                          </button>
                          <button
                            className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Share"
                          >
                            <Share2 className="h-4 w-4 text-white" />
                          </button>
                        </div>
                        {!doc.analysis && (
                          <button
                            onClick={async () => {
                              const analysis = await analyzeDocument(doc)
                              setDocuments(docs => docs.map(d => 
                                d.id === doc.id ? { ...d, analysis } : d
                              ))
                            }}
                            className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm transition-colors flex items-center space-x-1"
                          >
                            <Brain className="h-4 w-4" />
                            <span>Analyze</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8 z-50"
              onClick={() => setSelectedDocument(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">{selectedDocument.filename}</h2>
                  <button
                    onClick={() => setSelectedDocument(null)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                  {selectedDocument.analysis && (
                    <div className="space-y-6">
                      {/* Summary */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                          <Info className="h-5 w-5 mr-2 text-blue-400" />
                          Document Summary
                        </h3>
                        <p className="text-slate-300">{selectedDocument.analysis.summary}</p>
                      </div>

                      {/* Key Findings */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-emerald-400" />
                          Key Findings
                        </h3>
                        <ul className="space-y-2">
                          {selectedDocument.analysis.keyFindings.map((finding, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <ChevronRight className="h-5 w-5 text-emerald-400 mt-0.5" />
                              <span className="text-slate-300">{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Next Steps */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                          <ArrowRight className="h-5 w-5 mr-2 text-orange-400" />
                          Recommended Next Steps
                        </h3>
                        <div className="space-y-3">
                          {selectedDocument.analysis.nextSteps.map((step, idx) => (
                            <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-white">{step.action}</h4>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  step.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                  step.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {step.priority}
                                </span>
                              </div>
                              <p className="text-sm text-slate-400 mb-2">{step.description}</p>
                              <div className="flex items-center space-x-2 text-xs text-slate-500">
                                <Clock className="h-3 w-3" />
                                <span>Complete within: {step.deadline}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Legal Insights */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                          <Scale className="h-5 w-5 mr-2 text-purple-400" />
                          Legal Insights
                        </h3>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs font-medium text-slate-400 mb-1">Relevant Statutes</p>
                              <div className="space-y-1">
                                {selectedDocument.analysis.legalInsights.relevantStatutes.map((statute, idx) => (
                                  <p key={idx} className="text-sm text-slate-300">{statute}</p>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-400 mb-1">Case Law</p>
                              <div className="space-y-1">
                                {selectedDocument.analysis.legalInsights.caseLaw.map((case_, idx) => (
                                  <p key={idx} className="text-sm text-slate-300">{case_}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-xs font-medium text-slate-400 mb-2">Evidence Strength</p>
                            <div className="flex items-center space-x-3">
                              <div className="flex-1 bg-slate-700 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
                                  style={{ width: `${selectedDocument.analysis.legalInsights.strengthOfEvidence}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-emerald-400">
                                {selectedDocument.analysis.legalInsights.strengthOfEvidence}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-400 mb-1">Recommendations</p>
                            <p className="text-sm text-slate-300">
                              {selectedDocument.analysis.legalInsights.recommendations}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Risk Assessment */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-red-400" />
                          Risk Assessment
                        </h3>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-slate-400">Risk Level:</span>
                            <span className={`px-3 py-1 rounded text-sm font-medium ${
                              selectedDocument.analysis.riskAssessment.level === 'low' ? 
                                'bg-green-500/20 text-green-400' :
                              selectedDocument.analysis.riskAssessment.level === 'medium' ? 
                                'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                              {selectedDocument.analysis.riskAssessment.level.toUpperCase()}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-medium text-slate-400 mb-1">Risk Factors:</p>
                              <ul className="space-y-1">
                                {selectedDocument.analysis.riskAssessment.factors.map((factor, idx) => (
                                  <li key={idx} className="text-sm text-slate-300">• {factor}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-400 mb-1">Mitigation Strategies:</p>
                              <ul className="space-y-1">
                                {selectedDocument.analysis.riskAssessment.mitigations.map((mitigation, idx) => (
                                  <li key={idx} className="text-sm text-slate-300">• {mitigation}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Extracted Text */}
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-slate-400" />
                      Extracted Text
                    </h3>
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                        {selectedDocument.extractedText}
                      </pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DocumentScannerPro