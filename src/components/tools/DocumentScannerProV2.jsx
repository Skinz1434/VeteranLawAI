/**
 * @fileoverview Document Scanner - Advanced VA Legal Document Processing
 * @author VeteranLawAI Platform
 * @version 4.0.0
 */

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createWorker } from 'tesseract.js'
import { PDFDocument } from 'pdf-lib'
import {
	Camera,
	Upload,
	FileText,
	Download,
	Zap,
	Eye,
	Copy,
	Trash2,
	Loader,
	Shield,
	Info,
	BarChart3,
	Scan,
	Settings,
	X,
	FileDown,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

// Simple components to avoid import issues
const Button = ({ children, onClick, disabled, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500',
    outline: 'bg-transparent text-cyan-400 border border-cyan-400/50 hover:bg-cyan-400/10 hover:border-cyan-400',
  }
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3',
    lg: 'px-6 py-4 text-lg',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-slate-800/50 rounded-xl border border-slate-700 ${className}`} {...props}>
    {children}
  </div>
)

const announceToScreenReader = (message) => {
  // Simple accessibility announcement
  console.log('Screen reader:', message)
}

/**
 * Document Scanner Component
 * Advanced VA Legal Document Processing with AI-powered Recognition and Analysis
 */
const DocumentScannerProV2 = () => {
  const { currentUser } = useAuth()
  
  // Core state
  const [activeTab, setActiveTab] = useState('capture')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedDocuments, setProcessedDocuments] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [, setCapturedImage] = useState(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [currentProcessingStatus, setCurrentProcessingStatus] = useState('')

  // Camera state
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState(null)

  // Processing settings (actually used)
  const [psmMode, setPsmMode] = useState('3') // 3:auto, 6:single block, 7:single line, 11:sparse
  const [scaleFactor, setScaleFactor] = useState(1.5) // 1.0 - 2.0
  const [contrastAdjust, setContrastAdjust] = useState(0) // -50 .. 50
  const [binarize, setBinarize] = useState(true)
  const [denoise, setDenoise] = useState(true)
  const [preprocessPreset, setPreprocessPreset] = useState('text') // text | low-contrast | photo | none
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.9)

  	// Modal state
	const [showSettingsModal, setShowSettingsModal] = useState(false)
	const [showWelcome, setShowWelcome] = useState(false)

  // OCR state
  const [ocrWorker, setOcrWorker] = useState(null)
  const [isInitializingOCR, setIsInitializingOCR] = useState(false)

  // Refs
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  // Load from local storage on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('vla_docscanner_documents')
      if (raw) {
        const docs = JSON.parse(raw)
        if (Array.isArray(docs)) setProcessedDocuments(docs)
      }
      const welcomeDismissed = localStorage.getItem('vla_docscanner_welcome_dismissed')
      if (!welcomeDismissed) setShowWelcome(true)
    } catch {}
  }, [])

  // Persist to local storage whenever documents change
  useEffect(() => {
    try {
      localStorage.setItem('vla_docscanner_documents', JSON.stringify(processedDocuments))
    } catch {}
  }, [processedDocuments])

  // Initialize services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        setIsInitializingOCR(true)
        announceToScreenReader('Initializing OCR engine...')
        
        // Initialize Tesseract OCR worker
        const worker = await createWorker('eng')
        await worker.setParameters({ tessedit_pageseg_mode: psmMode })
        setOcrWorker(worker)
        
        setIsInitializingOCR(false)
        announceToScreenReader('Document Scanner ready')
      } catch (error) {
        console.error('Service initialization failed:', error)
        setIsInitializingOCR(false)
        announceToScreenReader('Service initialization failed')
      }
    }

    initializeServices()
    
    // Cleanup OCR worker on unmount
    return () => {
      if (ocrWorker) {
        ocrWorker.terminate()
      }
    }
  }, [currentUser, psmMode])



  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true)
        }
      }
    } catch (err) {
      setCameraError('Camera access denied. Please check permissions.')
      announceToScreenReader('Camera access failed')
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setCameraReady(false)
    }
  }, [])

  // Preprocess an image blob according to settings and return a canvas
  const preprocessImage = useCallback(async (fileOrBlob) => {
    return await new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const w = Math.round(img.width * scaleFactor)
        const h = Math.round(img.height * scaleFactor)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')

        // Draw base
        ctx.drawImage(img, 0, 0, w, h)

        // Get pixels
        let imageData = ctx.getImageData(0, 0, w, h)
        const data = imageData.data

        // Convert to grayscale
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2]
          const gray = 0.299 * r + 0.587 * g + 0.114 * b
          data[i] = data[i + 1] = data[i + 2] = gray
        }

        // Contrast adjust (-50..50)
        if (contrastAdjust !== 0) {
          const factor = (259 * (contrastAdjust + 255)) / (255 * (259 - contrastAdjust))
          for (let i = 0; i < data.length; i += 4) {
            const v = data[i]
            const nv = Math.max(0, Math.min(255, factor * (v - 128) + 128))
            data[i] = data[i + 1] = data[i + 2] = nv
          }
        }

        // Binarize (simple threshold)
        if (binarize || preprocessPreset === 'text' || preprocessPreset === 'low-contrast') {
          const threshold = preprocessPreset === 'low-contrast' ? 170 : 140
          for (let i = 0; i < data.length; i += 4) {
            const v = data[i]
            const nv = v > threshold ? 255 : 0
            data[i] = data[i + 1] = data[i + 2] = nv
          }
        }

        // Simple denoise: 1px median (cheap approximation)
        if (denoise && (preprocessPreset === 'photo' || preprocessPreset === 'low-contrast')) {
          // box blur 1 pass
          for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
              const idx = (y * w + x) * 4
              const sum = (
                data[idx - w * 4 - 4] + data[idx - w * 4] + data[idx - w * 4 + 4] +
                data[idx - 4] + data[idx] + data[idx + 4] +
                data[idx + w * 4 - 4] + data[idx + w * 4] + data[idx + w * 4 + 4]
              ) / 9
              data[idx] = data[idx + 1] = data[idx + 2] = sum
            }
          }
        }

        ctx.putImageData(imageData, 0, 0)
        resolve(canvas)
      }
      img.src = URL.createObjectURL(fileOrBlob)
    })
  }, [scaleFactor, contrastAdjust, binarize, denoise, preprocessPreset])

  // Process document with real OCR
  const processDocument = useCallback(async (input, filename) => {
    if (isProcessing || !ocrWorker) {
      if (!ocrWorker) announceToScreenReader('OCR engine not ready. Please wait.')
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)
    setCurrentProcessingStatus('Preparing document...')

    try {
      announceToScreenReader('Starting document processing')

      	// Convert input to image if needed and preprocess
	let imageSource = input
	if (input instanceof File && input.type === 'application/pdf') {
		setCurrentProcessingStatus('Converting PDF to image...')
		setProcessingProgress(10)
		const pdfImage = await convertPdfToImage(input)
		imageSource = pdfImage
	}

      setCurrentProcessingStatus('Preprocessing image...')
      setProcessingProgress(20)
      const processedCanvas = await preprocessImage(imageSource)

      // Update worker params from settings
      await ocrWorker.setParameters({ tessedit_pageseg_mode: psmMode })

      // Perform OCR with progress tracking
      setCurrentProcessingStatus('Recognizing text...')
      const { data: { text, confidence } } = await ocrWorker.recognize(processedCanvas, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 70) + 20 // 20-90%
            setProcessingProgress(progress)
            setCurrentProcessingStatus(`Recognizing text: ${Math.round(m.progress * 100)}%`)
          }
        }
      })

      setCurrentProcessingStatus('Analyzing content...')
      setProcessingProgress(92)

      // Analyze the extracted text for VA-specific content
      const vaTerms = detectVATerms(text)
      const formType = detectFormType(text)
      const confidence_score = confidence / 100

      // Create processed document with real data
      const processedDoc = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        filename: filename || 'document',
        type: formType,
        confidence: confidence_score,
        extractedText: text,
        metadata: {
          formType: formType,
          priority: confidence_score >= confidenceThreshold ? 'high' : 'normal',
          vaTermsFound: vaTerms.length,
          wordCount: text.split(/\s+/).length,
          characterCount: text.length,
          settings: { psmMode, scaleFactor, contrastAdjust, binarize, denoise, preprocessPreset }
        },
        googleDriveId: null,
        googleDriveUrl: null,
      }

      setProcessedDocuments(prev => [processedDoc, ...prev])
      setSelectedDocument(processedDoc)
      setActiveTab('documents')
      setProcessingProgress(100)
      announceToScreenReader(`Document processed. Confidence: ${Math.round(confidence_score * 100)}%`)
    } catch (error) {
      console.error('Processing failed:', error)
      let errorMessage = 'Document processing failed'
      if (error.message.includes('PDF processing')) errorMessage = 'PDF not supported. Convert to JPG/PNG first.'
      else if (error.message.includes('recognize')) errorMessage = 'OCR failed. Ensure image is clear and well-lit.'
      else if (error.message.includes('network') || error.message.includes('fetch')) errorMessage = 'Network error. Check connection.'
      announceToScreenReader(errorMessage)
      const errorDoc = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        filename: filename || 'error',
        type: 'Error',
        confidence: 0,
        extractedText: `Error: ${errorMessage}\n\nDetails: ${error.message}`,
        metadata: { formType: 'Error', priority: 'high', vaTermsFound: 0, isError: true },
        googleDriveId: null,
        googleDriveUrl: null,
      }
      setProcessedDocuments(prev => [errorDoc, ...prev])
      setSelectedDocument(errorDoc)
      setActiveTab('documents')
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
      setCurrentProcessingStatus('')
    }
  }, [isProcessing, ocrWorker, psmMode, scaleFactor, contrastAdjust, binarize, denoise, preprocessPreset, confidenceThreshold, preprocessImage])

  // Detect VA-specific terms in text
  const detectVATerms = (text) => {
    const vaTerms = [
      'VA Form', 'Veterans Affairs', 'Service Connected', 'Disability Rating',
      'C&P Exam', 'VR&E', 'GI Bill', 'Chapter 31', 'Chapter 33', 'Chapter 35',
      'DIC', 'Dependency', 'Agent Orange', 'PTSD', 'TBI', 'MST',
      '21-526EZ', '21-4138', '21-0781', '21-8940', 'BVA', 'CAVC'
    ]
    return vaTerms.filter(term => 
      text.toUpperCase().includes(term.toUpperCase())
    )
  }

  // Detect form type from extracted text
  const detectFormType = (text) => {
    const upperText = text.toUpperCase()
    
    if (upperText.includes('21-526EZ') || upperText.includes('DISABILITY COMPENSATION')) {
      return 'VA Form 21-526EZ (Disability Compensation)'
    }
    if (upperText.includes('21-4138') || upperText.includes('STATEMENT IN SUPPORT')) {
      return 'VA Form 21-4138 (Statement in Support)'
    }
    if (upperText.includes('21-0781') || upperText.includes('PTSD')) {
      return 'VA Form 21-0781 (PTSD Statement)'
    }
    if (upperText.includes('MEDICAL') || upperText.includes('DOCTOR') || upperText.includes('PHYSICIAN')) {
      return 'Medical Document'
    }
    if (upperText.includes('MILITARY') || upperText.includes('SERVICE RECORD')) {
      return 'Military Service Record'
    }
    
    	return 'General Document'
}

// Convert PDF to image using canvas
const convertPdfToImage = async (pdfFile) => {
	try {
		const arrayBuffer = await pdfFile.arrayBuffer()
		const pdfDoc = await PDFDocument.load(arrayBuffer)
		const page = pdfDoc.getPages()[0] // Get first page
		
		// Create canvas to render PDF
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		const { width, height } = page.getSize()
		
		// Set canvas size
		canvas.width = width * 2 // 2x scale for better quality
		canvas.height = height * 2
		
		// Convert PDF page to image data
		const pdfBytes = await pdfDoc.save()
		const blob = new Blob([pdfBytes], { type: 'application/pdf' })
		const url = URL.createObjectURL(blob)
		
		// Create image from PDF
		return new Promise((resolve) => {
			const img = new Image()
			img.onload = () => {
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
				canvas.toBlob(resolve, 'image/png')
			}
			img.src = url
		})
	} catch (error) {
		console.error('PDF conversion failed:', error)
		throw new Error('PDF conversion failed. Please try a different file.')
	}
}

// Export document to PDF
const exportToPDF = async (doc) => {
	try {
		const pdfDoc = await PDFDocument.create()
		const page = pdfDoc.addPage([595, 842]) // A4 size
		const { width, height } = page.getSize()
		
		// Add title
		page.drawText(`Document: ${doc.filename}`, {
			x: 50,
			y: height - 50,
			size: 16,
			color: { r: 0, g: 0, b: 0 }
		})
		
		// Add metadata
		page.drawText(`Type: ${doc.type}`, { x: 50, y: height - 80, size: 12 })
		page.drawText(`Confidence: ${Math.round(doc.confidence * 100)}%`, { x: 50, y: height - 100, size: 12 })
		page.drawText(`VA Terms Found: ${doc.metadata.vaTermsFound}`, { x: 50, y: height - 120, size: 12 })
		page.drawText(`Processed: ${new Date(doc.timestamp).toLocaleString()}`, { x: 50, y: height - 140, size: 12 })
		
		// Add extracted text
		const text = doc.extractedText
		const lines = text.split('\n')
		let y = height - 180
		
		for (const line of lines) {
			if (y < 50) break // Don't go off page
			page.drawText(line, { x: 50, y, size: 10 })
			y -= 15
		}
		
		const pdfBytes = await pdfDoc.save()
		const blob = new Blob([pdfBytes], { type: 'application/pdf' })
		const url = URL.createObjectURL(blob)
		
		const a = document.createElement('a')
		a.href = url
		a.download = `${doc.filename}_extracted.pdf`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
		
		announceToScreenReader('PDF exported successfully')
	} catch (error) {
		console.error('PDF export failed:', error)
		announceToScreenReader('PDF export failed')
	}
}



  // Stop camera
  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext('2d')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    canvas.toBlob(blob => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob)
        setCapturedImage(imageUrl)
        processDocument(blob, `camera_capture_${Date.now()}.jpg`)
        stopCamera()
      }
    }, 'image/jpeg', 0.8)
  }, [stopCamera, processDocument])

  	// Handle file upload (single or batch)
	const handleFileUpload = useCallback(event => {
		const files = Array.from(event.target.files || [])
		if (files.length === 0) return

		// Validate files
		const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
		const validFiles = files.filter(file => {
			if (!allowedTypes.includes(file.type)) {
				console.warn(`Skipping ${file.name}: unsupported file type`)
				return false
			}
			if (file.size > 50 * 1024 * 1024) {
				console.warn(`Skipping ${file.name}: file too large`)
				return false
			}
			return true
		})

		if (validFiles.length === 0) {
			alert('No valid files found. Please upload JPG, PNG, or PDF files under 50MB.')
			return
		}

		// Process files sequentially
		validFiles.forEach((file, index) => {
			setTimeout(() => {
				processDocument(file, file.name)
			}, index * 1000) // Stagger processing by 1 second
		})
		
		// Reset file input
		if (event.target) {
			event.target.value = ''
		}
	}, [processDocument])

  // Download document
  const downloadDocument = useCallback((doc, format = 'txt') => {
    try {
      let content = doc.extractedText
      let mimeType = 'text/plain'
      const filename = `${doc.filename.split('.')[0]}_processed.${format}`

      if (format === 'json') {
        content = JSON.stringify({
          filename: doc.filename,
          type: doc.type,
          confidence: doc.confidence,
          extractedText: doc.extractedText,
          metadata: doc.metadata,
        }, null, 2)
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

  // Copy to clipboard
  const copyToClipboard = useCallback(async text => {
    try {
      await navigator.clipboard.writeText(text)
      announceToScreenReader('Text copied to clipboard')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [])

  // Delete document
  const deleteDocument = useCallback((docId) => {
    setProcessedDocuments(prev => prev.filter(doc => doc.id !== docId))
    announceToScreenReader('Document deleted')
  }, [])

  // Clear all documents
  const clearAllDocuments = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all processed documents? This cannot be undone.')) {
      setProcessedDocuments([])
      setSelectedDocument(null)
      announceToScreenReader('All documents cleared')
    }
  }, [])

  // Export all documents as batch
  const exportAllDocuments = useCallback(async () => {
    try {
      const pdfDoc = await PDFDocument.create()
      let currentPage = null
      let y = 0
      const pageHeight = 842
      const margin = 50
      const lineHeight = 15

      for (const doc of processedDocuments) {
        if (!currentPage || y < margin + 200) {
          currentPage = pdfDoc.addPage([595, pageHeight])
          y = pageHeight - margin
        }

        // Add document header
        currentPage.drawText(`Document: ${doc.filename}`, {
          x: margin,
          y: y,
          size: 14,
          color: { r: 0, g: 0, b: 0 }
        })
        y -= 20

        currentPage.drawText(`Type: ${doc.type} | Confidence: ${Math.round(doc.confidence * 100)}% | VA Terms: ${doc.metadata.vaTermsFound}`, {
          x: margin,
          y: y,
          size: 10,
          color: { r: 0.5, g: 0.5, b: 0.5 }
        })
        y -= 20

        // Add extracted text
        const text = doc.extractedText
        const lines = text.split('\n')
        
        for (const line of lines) {
          if (y < margin + 50) {
            currentPage = pdfDoc.addPage([595, pageHeight])
            y = pageHeight - margin
          }
          currentPage.drawText(line, { x: margin, y, size: 9 })
          y -= lineHeight
        }
        
        y -= 30 // Space between documents
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `all_documents_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      announceToScreenReader('All documents exported successfully')
    } catch (error) {
      console.error('Batch export failed:', error)
      announceToScreenReader('Batch export failed')
    }
  }, [processedDocuments])

  // Tab configuration
  const tabs = [
    {
      id: 'capture',
      label: 'Smart Capture',
      icon: Camera,
      description: 'AI-powered scanning'
    },
    {
      id: 'upload',
      label: 'Upload',
      icon: Upload,
      description: 'File processing'
    },
    {
      id: 'documents',
      label: `Documents (${processedDocuments.length})`,
      icon: FileText,
      description: 'Processed files'
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
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Scan className="h-8 w-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Document Scanner</h1>
              <p className="text-slate-300">Capture, process, and analyze VA documents with precision.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
                         <Button variant="outline" size="sm" onClick={() => setShowWelcome(true)} title="View help and tips">
               <Info className="h-4 w-4" /> Help
             </Button>
            <Button size="sm" onClick={() => setShowSettingsModal(true)} title="Processing settings">
              <Settings className="h-4 w-4" /> Settings
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === t.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
              title={t.label}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'capture' && (
            <motion.div
              key="capture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* OCR Status */}
              {isInitializingOCR && (
                <Card className="p-4 bg-blue-900/20 border-blue-500/50">
                  <div className="flex items-center gap-3">
                    <Loader className="h-5 w-5 text-blue-400 animate-spin" />
                    <span className="text-blue-400">Initializing OCR engine...</span>
                  </div>
                </Card>
              )}

              {!isInitializingOCR && ocrWorker && (
                <Card className="p-4 bg-green-900/20 border-green-500/50">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span className="text-green-400">OCR engine ready - Real document processing available</span>
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Camera View */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Document Capture</h3>
                  <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden mb-4 relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                      title="Live camera preview"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={startCamera} className="flex-1" disabled={cameraReady} title="Start camera">
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                    <Button 
                      onClick={handleCapture} 
                      className="flex-1"
                      disabled={!cameraReady || isProcessing || !ocrWorker}
                      title="Capture and process document"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Capture
                    </Button>
                    <Button onClick={stopCamera} className="flex-1" disabled={!cameraReady} variant="outline" title="Stop camera">
                      <Camera className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  </div>

                  {cameraError && (
                    <p className="text-red-400 text-sm mt-3">{cameraError}</p>
                  )}
                </Card>

                {/* Settings Panel */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Processing Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="preset" className="block text-sm font-medium text-slate-300 mb-2" title="Choose a preset tuned for typical document types">
                          Preset
                        </label>
                        <select id="preset" value={preprocessPreset} onChange={e => setPreprocessPreset(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                          <option value="text">Text-heavy (forms, print)</option>
                          <option value="low-contrast">Low-contrast</option>
                          <option value="photo">Photo of paper</option>
                          <option value="none">None</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="psm" className="block text-sm font-medium text-slate-300 mb-2" title="Page segmentation mode guides OCR layout assumptions">
                          Page Segmentation (PSM)
                        </label>
                        <select id="psm" value={psmMode} onChange={e => setPsmMode(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                          <option value="3">Auto (default)</option>
                          <option value="6">Single uniform block of text</option>
                          <option value="7">Single text line</option>
                          <option value="11">Sparse</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="scale" className="block text-sm font-medium text-slate-300 mb-2" title="Upscale improves recognition on small text">
                          Scale: {scaleFactor.toFixed(1)}x
                        </label>
                        <input id="scale" type="range" min="1" max="2" step="0.1" value={scaleFactor} onChange={e => setScaleFactor(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                      </div>

                      <div>
                        <label htmlFor="contrast" className="block text-sm font-medium text-slate-300 mb-2" title="Adjust contrast before OCR (-50..50)">
                          Contrast: {contrastAdjust}
                        </label>
                        <input id="contrast" type="range" min="-50" max="50" step="1" value={contrastAdjust} onChange={e => setContrastAdjust(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-slate-300 text-sm" title="Convert to black/white for clearer text">
                          <input type="checkbox" checked={binarize} onChange={e => setBinarize(e.target.checked)} className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded" />
                          Binarize
                        </label>
                        <label className="flex items-center gap-2 text-slate-300 text-sm" title="Reduce noise in photos and low-contrast scans">
                          <input type="checkbox" checked={denoise} onChange={e => setDenoise(e.target.checked)} className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded" />
                          Denoise
                        </label>
                      </div>

                      <div>
                        <label htmlFor="conf" className="block text-sm font-medium text-slate-300 mb-2" title="Flag results above/below this confidence">
                          Confidence Threshold: {Math.round(confidenceThreshold * 100)}%
                        </label>
                        <input id="conf" type="range" min="0.5" max="0.99" step="0.01" value={confidenceThreshold} onChange={e => setConfidenceThreshold(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Capture Guidance</h3>
                    <div className="space-y-3">
                      {[
                        { icon: '🧭', title: 'Align & Fill', desc: 'Align edges; fill the frame without cutting information.' },
                        { icon: '💡', title: 'Diffuse Lighting', desc: 'Avoid glare; use even lighting to prevent hotspots.' },
                        { icon: '🔍', title: 'Increase Sharpness', desc: 'Steady the device or rest on a surface for crisp text.' },
                        { icon: '⬆️', title: 'Upscale Small Text', desc: 'Use Scale setting to 1.6–2.0x for small fonts.' },
                      ].map((tip, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="text-2xl" aria-hidden>{tip.icon}</div>
                          <div>
                            <h4 className="font-medium text-white">{tip.title}</h4>
                            <p className="text-slate-400 text-sm">{tip.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
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
                  <Upload className="h-16 w-16 text-cyan-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">Upload Documents</h3>
                  <p className="text-slate-300 mb-8">
                    Upload VA forms, medical records, or legal documents for AI-powered processing
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <Button onClick={() => fileInputRef.current?.click()} size="lg" className="mb-6" disabled={isProcessing || !ocrWorker}>
                    <Upload className="h-5 w-5 mr-2" />
                    {!ocrWorker ? 'OCR Engine Loading...' : isProcessing ? 'Processing...' : 'Choose Files (Multiple)'}
                  </Button>

                  <div className="text-slate-400 text-sm">
                    <p>Supported formats: JPG, PNG, PDF</p>
                    <p>Maximum file size: 50MB</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

                     {activeTab === 'documents' && (
             <motion.div
               key="results"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
             >
               {processedDocuments.length === 0 ? (
                 <Card className="p-8 text-center">
                   <p className="text-slate-300">
                     Start by capturing or uploading documents to see them here
                   </p>
                 </Card>
               ) : (
                 <div className="space-y-4">
                   {/* Batch Actions */}
                   <Card className="p-4">
                     <div className="flex items-center justify-between">
                       <div className="text-slate-300">
                         <span className="font-medium">{processedDocuments.length}</span> documents processed
                       </div>
                       <div className="flex items-center gap-2">
                         <Button variant="outline" size="sm" onClick={exportAllDocuments} title="Export all documents as PDF">
                           <FileDown className="h-4 w-4" /> Export All
                         </Button>
                         <Button variant="outline" size="sm" onClick={clearAllDocuments} title="Clear all documents">
                           <Trash2 className="h-4 w-4" /> Clear All
                         </Button>
                       </div>
                     </div>
                   </Card>
                  {processedDocuments.map(doc => (
                    <Card key={doc.id} className={`p-6 ${doc.metadata?.isError ? 'border-red-500/50 bg-red-900/10' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <FileText className={`h-5 w-5 ${doc.metadata?.isError ? 'text-red-400' : 'text-cyan-400'}`} />
                            <h3 className="font-bold text-white">{doc.filename}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${doc.metadata?.isError ? 'bg-red-500/20 text-red-400' : doc.confidence >= 0.9 ? 'bg-green-500/20 text-green-400' : doc.confidence >= 0.7 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                              {doc.metadata?.isError ? 'Error' : `${Math.round(doc.confidence * 100)}% confidence`}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{doc.type}</p>
                          <p className="text-slate-400 text-sm">{new Date(doc.timestamp).toLocaleString()}</p>
                        </div>
                        												<div className="flex items-center space-x-2">
													<Button variant="outline" size="sm" onClick={() => setSelectedDocument(doc)} title="Preview extracted text">
														<Eye className="h-4 w-4" /> Preview
													</Button>
													<Button variant="outline" size="sm" onClick={() => downloadDocument(doc)} title="Download extracted text">
														<Download className="h-4 w-4" /> Download
													</Button>
													<Button variant="outline" size="sm" onClick={() => exportToPDF(doc)} title="Export to PDF">
														<FileDown className="h-4 w-4" /> PDF
													</Button>
													<Button variant="outline" size="sm" onClick={() => copyToClipboard(doc.extractedText)} title="Copy text to clipboard">
														<Copy className="h-4 w-4" /> Copy
													</Button>
													<Button variant="outline" size="sm" onClick={() => deleteDocument(doc.id)} title="Remove from list">
														<Trash2 className="h-4 w-4" /> Delete
													</Button>
												</div>
                      </div>
                      {selectedDocument?.id === doc.id && (
                        <div className="mt-4 bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                          <h4 className="text-white font-semibold mb-2">Extracted Text</h4>
                          <pre className="whitespace-pre-wrap text-slate-300 text-sm">{doc.extractedText}</pre>
                        </div>
                      )}
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
              <Card className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Session Analytics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <div className="text-2xl font-bold text-white">{processedDocuments.length}</div>
                    <div className="text-slate-400 text-xs mt-1">Documents</div>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <div className="text-2xl font-bold text-white">{Math.round(processedDocuments.filter(d => !d.metadata?.isError).reduce((acc, d) => acc + (d.confidence || 0), 0) / Math.max(1, processedDocuments.filter(d => !d.metadata?.isError).length) * 100)}%</div>
                    <div className="text-slate-400 text-xs mt-1">Avg. Confidence</div>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <div className="text-2xl font-bold text-white">{processedDocuments.reduce((acc, d) => acc + (d.metadata?.vaTermsFound || 0), 0)}</div>
                    <div className="text-slate-400 text-xs mt-1">VA Terms Found</div>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <div className="text-2xl font-bold text-white">{processedDocuments.reduce((acc, d) => acc + (d.metadata?.wordCount || 0), 0)}</div>
                    <div className="text-slate-400 text-xs mt-1">Total Words</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
              <h3 className="text-white font-semibold mb-2">{currentProcessingStatus || 'Processing...'}</h3>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="h-2 bg-cyan-500" style={{ width: `${processingProgress}%` }} />
              </div>
              <p className="text-slate-400 text-sm mt-2">Do not close this tab</p>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-lg w-full overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">Processing Settings</h2>
                <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-white transition-colors" aria-label="Close settings">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="modal-psm" className="block text-sm font-medium text-slate-300 mb-2">Page Segmentation</label>
                    <select id="modal-psm" value={psmMode} onChange={e => setPsmMode(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                      <option value="3">Auto</option>
                      <option value="6">Single Block</option>
                      <option value="7">Single Line</option>
                      <option value="11">Sparse</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="modal-scale" className="block text-sm font-medium text-slate-300 mb-2">Scale</label>
                    <input id="modal-scale" type="range" min="1" max="2" step="0.1" value={scaleFactor} onChange={e => setScaleFactor(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div>
                    <label htmlFor="modal-contrast" className="block text-sm font-medium text-slate-300 mb-2">Contrast</label>
                    <input id="modal-contrast" type="range" min="-50" max="50" step="1" value={contrastAdjust} onChange={e => setContrastAdjust(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-slate-300 text-sm">
                      <input type="checkbox" checked={binarize} onChange={e => setBinarize(e.target.checked)} className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded" />
                      Binarize
                    </label>
                    <label className="flex items-center gap-2 text-slate-300 text-sm">
                      <input type="checkbox" checked={denoise} onChange={e => setDenoise(e.target.checked)} className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded" />
                      Denoise
                    </label>
                  </div>
                  <div>
                    <label htmlFor="modal-conf" className="block text-sm font-medium text-slate-300 mb-2">Confidence Threshold</label>
                    <input id="modal-conf" type="range" min="0.5" max="0.99" step="0.01" value={confidenceThreshold} onChange={e => setConfidenceThreshold(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Modal */}
        {showWelcome && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-xl w-full overflow-hidden border border-slate-700">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">Welcome to Document Scanner</h2>
                <button onClick={() => { setShowWelcome(false); localStorage.setItem('vla_docscanner_welcome_dismissed', '1') }} className="text-slate-400 hover:text-white transition-colors" aria-label="Close welcome">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 space-y-3 text-slate-300">
                <p>Use Smart Capture for live scanning or Upload to process existing files.</p>
                <p>For best results: ensure even lighting, fill the frame, and use the Processing Settings to tune recognition.</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Set Page Segmentation for forms vs. lines of text</li>
                  <li>Increase Scale for small fonts; adjust Contrast for faint scans</li>
                  <li>Enable Binarize and Denoise for photos or low-contrast documents</li>
                </ul>
              </div>
              <div className="p-6 border-t border-slate-700 flex justify-end">
                <Button onClick={() => { setShowWelcome(false); localStorage.setItem('vla_docscanner_welcome_dismissed', '1') }}>Got it</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentScannerProV2
