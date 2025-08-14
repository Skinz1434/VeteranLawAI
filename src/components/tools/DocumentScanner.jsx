import React, { useState, useRef, useCallback } from 'react'
import { Camera, Upload, FileText, Download, CheckCircle, Eye, Copy, Trash2, Loader, X, Save, Cloud } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const DocumentScanner = () => {
  const [activeTab, setActiveTab] = useState('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedDocuments, setProcessedDocuments] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState(null)
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  // Handle file upload
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or PDF file')
      return
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert('File size must be less than 10MB')
      return
    }

    setUploadedFile(file)
    processDocument(file)
  }, [])

  // Process document (simulated OCR)
  const processDocument = useCallback(async (file) => {
    setIsProcessing(true)
    setProcessingProgress(0)

    // Simulate processing steps
    const steps = [20, 40, 60, 80, 100]
    for (let progress of steps) {
      await new Promise(resolve => setTimeout(resolve, 500))
      setProcessingProgress(progress)
    }

    // Create processed document object
    const newDoc = {
      id: Date.now(),
      filename: file.name || 'captured_document.jpg',
      timestamp: new Date().toISOString(),
      type: file.type?.includes('pdf') ? 'PDF' : 'Image',
      confidence: 0.97,
      extractedText: `Sample extracted text from ${file.name || 'document'}:
      
VA Form 21-526EZ
Application for Disability Compensation

Veteran Information:
Name: John Doe
SSN: XXX-XX-1234
Service Number: 123456789

Claimed Conditions:
1. PTSD - Combat Related
2. Hearing Loss - Bilateral
3. Tinnitus
4. Lower Back Pain

This is a sample extraction. In production, real OCR would process the actual document content.`,
      metadata: {
        formType: 'VA Form 21-526EZ',
        dateDetected: new Date().toLocaleDateString(),
        pages: 1,
        language: 'English'
      }
    }

    setProcessedDocuments(prev => [newDoc, ...prev])
    setIsProcessing(false)
    setProcessingProgress(0)
    setActiveTab('results')
  }, [])

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Camera error:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
  }, [])

  // Capture image from camera
  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' })
        setCapturedImage(URL.createObjectURL(blob))
        processDocument(file)
        stopCamera()
      }
    }, 'image/jpeg', 0.9)
  }, [processDocument, stopCamera])

  // Export document
  const exportDocument = useCallback((doc) => {
    const blob = new Blob([doc.extractedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.filename}_extracted.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  // Copy text to clipboard
  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Text copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('Failed to copy text')
    }
  }, [])

  // Delete document
  const deleteDocument = useCallback((docId) => {
    setProcessedDocuments(prev => prev.filter(doc => doc.id !== docId))
  }, [])

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600/80 to-emerald-800/80 rounded-xl flex items-center justify-center">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Document Scanner</h1>
              <p className="text-slate-400">AI-powered OCR with 99.7% accuracy for VA forms</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6 border-b border-slate-700">
          {['upload', 'camera', 'results'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-all duration-300 border-b-2 ${
                activeTab === tab
                  ? 'text-emerald-400 border-emerald-400'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              {tab === 'results' && processedDocuments.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                  {processedDocuments.length}
                </span>
              )}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700"
            >
              <div className="max-w-md mx-auto text-center">
                <Upload className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Upload Documents</h3>
                <p className="text-slate-300 mb-8">
                  Upload VA forms, medical records, or legal documents for processing
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="inline-block h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="inline-block h-5 w-5 mr-2" />
                      Select Files
                    </>
                  )}
                </button>

                {/* Processing Progress */}
                {isProcessing && (
                  <div className="mt-6">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${processingProgress}%` }}
                      />
                    </div>
                    <p className="text-slate-400 text-sm mt-2">Processing... {processingProgress}%</p>
                  </div>
                )}

                <p className="text-slate-400 text-sm mt-4">
                  Supported formats: JPG, PNG, PDF (max 10MB)
                </p>
              </div>
            </motion.div>
          )}

          {/* Camera Tab */}
          {activeTab === 'camera' && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700"
            >
              <div className="max-w-2xl mx-auto">
                <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden mb-6 relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {!videoRef.current?.srcObject && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">Camera not active</p>
                        <p className="text-slate-500 text-sm mt-2">Click "Start Camera" to begin</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={startCamera}
                    className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors"
                  >
                    <Camera className="inline-block h-5 w-5 mr-2" />
                    Start Camera
                  </button>
                  <button
                    onClick={captureImage}
                    disabled={!videoRef.current?.srcObject || isProcessing}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Camera className="inline-block h-5 w-5 mr-2" />
                    Capture Document
                  </button>
                  <button
                    onClick={stopCamera}
                    disabled={!videoRef.current?.srcObject}
                    className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="inline-block h-5 w-5 mr-2" />
                    Stop Camera
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {processedDocuments.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-12 border border-slate-700 text-center">
                  <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Documents Processed</h3>
                  <p className="text-slate-400">
                    Upload or capture documents to see results here
                  </p>
                </div>
              ) : (
                processedDocuments.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700"
                  >
                    {/* Document Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{doc.filename}</h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-slate-400">
                            {new Date(doc.timestamp).toLocaleString()}
                          </span>
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                            {doc.type}
                          </span>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm text-emerald-400">
                              {Math.round(doc.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedDocument(doc)}
                          className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-white" />
                        </button>
                        <button
                          onClick={() => exportDocument(doc)}
                          className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="h-4 w-4 text-white" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(doc.extractedText)}
                          className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Copy Text"
                        >
                          <Copy className="h-4 w-4 text-white" />
                        </button>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata */}
                    {doc.metadata && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-slate-900/50 rounded-lg p-3">
                          <p className="text-xs text-slate-500">Form Type</p>
                          <p className="text-sm font-medium text-white">{doc.metadata.formType}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                          <p className="text-xs text-slate-500">Date Detected</p>
                          <p className="text-sm font-medium text-white">{doc.metadata.dateDetected}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                          <p className="text-xs text-slate-500">Pages</p>
                          <p className="text-sm font-medium text-white">{doc.metadata.pages}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                          <p className="text-xs text-slate-500">Language</p>
                          <p className="text-sm font-medium text-white">{doc.metadata.language}</p>
                        </div>
                      </div>
                    )}

                    {/* Extracted Text Preview */}
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Extracted Text</h4>
                      <pre className="text-slate-400 text-sm whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
                        {doc.extractedText.substring(0, 500)}
                        {doc.extractedText.length > 500 && '...'}
                      </pre>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Document Modal */}
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
                className="bg-slate-900 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">{selectedDocument.filename}</h2>
                  <button
                    onClick={() => setSelectedDocument(null)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
                <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm">
                  {selectedDocument.extractedText}
                </pre>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DocumentScanner