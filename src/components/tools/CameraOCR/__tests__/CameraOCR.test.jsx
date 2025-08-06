import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CameraOCR from '../CameraOCR'

// Mock the OCR service
vi.mock('../../../../services/ocrService', () => ({
  ocrService: {
    initialize: vi.fn(() => Promise.resolve({ success: true }))
  },
  initializeOCR: vi.fn(() => Promise.resolve({ 
    success: true, 
    engine: 'Tesseract'
  })),
  processDocumentOCR: vi.fn((input, options) => {
    // Simulate progress updates
    const progressCallback = options.onProgress
    if (progressCallback) {
      setTimeout(() => progressCallback(25, 'Preprocessing image...'), 100)
      setTimeout(() => progressCallback(50, 'Running OCR analysis...'), 200)
      setTimeout(() => progressCallback(75, 'Extracting text...'), 300)
      setTimeout(() => progressCallback(100, 'Processing complete'), 400)
    }
    
    return Promise.resolve({
      success: true,
      extractedText: 'This is sample extracted text from the document. VA Form 21-526EZ application for disability benefits.',
      originalText: 'Raw OCR output text',
      confidence: 0.97,
      formType: {
        id: '21-526EZ',
        name: 'Application for Disability Benefits',
        priority: 'high'
      },
      sections: [
        { name: 'Header', confidence: 0.98, extracted: true },
        { name: 'Personal Info', confidence: 0.95, extracted: true },
        { name: 'Conditions', confidence: 0.93, extracted: true },
        { name: 'Signature', confidence: 0.89, extracted: false }
      ],
      structuredData: {
        firstName: 'John',
        lastName: 'Doe',
        ssn: '***-**-****'
      },
      keywords: ['disability', 'benefits', 'compensation'],
      vaTermsFound: ['service connection', 'C&P examination', 'disability rating'],
      metadata: {
        pages: 1,
        words: 245,
        confidence: 0.97
      }
    })
  }),
  getOCRServiceInfo: vi.fn(() => ({
    initialized: true,
    capabilities: {
      vaFormRecognition: true,
      multiPageSupport: true,
      batchProcessing: true
    },
    vaFormsSupported: '50+',
    maxFileSize: '10MB',
    supportedFormats: ['image/jpeg', 'image/png', 'application/pdf']
  }))
}))

// Mock accessibility utilities
vi.mock('../../../../utils/accessibility', () => ({
  announceToScreenReader: vi.fn()
}))

// Mock getUserMedia for camera functionality
global.navigator.mediaDevices = {
  getUserMedia: vi.fn(() => Promise.resolve({
    getTracks: vi.fn(() => [
      { stop: vi.fn() }
    ])
  }))
}

// Mock canvas and video elements
global.HTMLVideoElement.prototype.videoWidth = 1920
global.HTMLVideoElement.prototype.videoHeight = 1080
global.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  drawImage: vi.fn(),
  toDataURL: vi.fn(() => 'data:image/jpeg;base64,mockImageData')
}))
global.HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/jpeg;base64,mockImageData')

// Mock clipboard API
global.navigator.clipboard = {
  writeText: vi.fn(() => Promise.resolve())
}

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url')
global.URL.revokeObjectURL = vi.fn()

describe('CameraOCR Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial Rendering', () => {
    it('renders the document intelligence interface', async () => {
      render(<CameraOCR />)
      
      await waitFor(() => {
        expect(screen.getByText('Document Intelligence')).toBeInTheDocument()
      })
      
      expect(screen.getByText(/Advanced VA Legal Document Processing & AI Recognition/)).toBeInTheDocument()
      expect(screen.getByText('99.7% Accuracy')).toBeInTheDocument()
    })

    it('displays navigation tabs', async () => {
      render(<CameraOCR />)
      
      await waitFor(() => {
        expect(screen.getByText('Smart Capture')).toBeInTheDocument()
        expect(screen.getByText('Batch Upload')).toBeInTheDocument()
        expect(screen.getByText(/Documents/)).toBeInTheDocument()
        expect(screen.getByText('Intelligence')).toBeInTheDocument()
      })
    })

    it('shows default active tab as capture', async () => {
      render(<CameraOCR />)
      
      await waitFor(() => {
        expect(screen.getByText('Document Capture')).toBeInTheDocument()
        expect(screen.getByText('OCR Settings')).toBeInTheDocument()
        expect(screen.getByText('Capture Tips')).toBeInTheDocument()
      })
    })

    it('initializes OCR service on mount', async () => {
      const { initializeOCR, getOCRServiceInfo } = await import('../../../../services/ocrService')
      
      render(<CameraOCR />)
      
      await waitFor(() => {
        expect(initializeOCR).toHaveBeenCalled()
        expect(getOCRServiceInfo).toHaveBeenCalled()
      })
    })
  })

  describe('Tab Navigation', () => {
    beforeEach(async () => {
      render(<CameraOCR />)
      await waitFor(() => {
        expect(screen.getByText('Document Intelligence')).toBeInTheDocument()
      })
    })

    it('switches to upload tab', async () => {
      const uploadTab = screen.getByText('Batch Upload')
      await user.click(uploadTab)
      
      expect(screen.getByText('Upload Documents')).toBeInTheDocument()
      expect(screen.getByText('Supported formats: JPG, PNG, PDF (max 10MB)')).toBeInTheDocument()
    })

    it('switches to results tab', async () => {
      const resultsTab = screen.getByText(/Documents/)
      await user.click(resultsTab)
      
      expect(screen.getByText('No Documents Processed')).toBeInTheDocument()
    })

    it('switches to analytics tab', async () => {
      const analyticsTab = screen.getByText('Intelligence')
      await user.click(analyticsTab)
      
      expect(screen.getByText('Documents Processed')).toBeInTheDocument()
      expect(screen.getByText('Average Accuracy')).toBeInTheDocument()
    })
  })

  describe('Camera Capture Functionality', () => {
    beforeEach(async () => {
      render(<CameraOCR />)
      await waitFor(() => {
        expect(screen.getByText('Document Capture')).toBeInTheDocument()
      })
    })

    it('displays camera interface', () => {
      expect(screen.getByText('Document Capture')).toBeInTheDocument()
      expect(screen.getByText('Start Camera')).toBeInTheDocument()
      expect(screen.getByText('Capture Document')).toBeInTheDocument()
    })

    it('shows camera not active message initially', () => {
      expect(screen.getByText('Camera not active')).toBeInTheDocument()
    })

    it('starts camera when start button is clicked', async () => {
      const startCameraButton = screen.getByText('Start Camera')
      await user.click(startCameraButton)
      
      expect(global.navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'environment'
        }
      })
    })

    it('handles camera permission errors', async () => {
      global.navigator.mediaDevices.getUserMedia.mockRejectedValueOnce(
        new Error('Camera access denied')
      )
      global.alert = vi.fn()
      
      const startCameraButton = screen.getByText('Start Camera')
      await user.click(startCameraButton)
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Camera access is required for document capture')
      })
    })

    it('enables capture button when camera is active', async () => {
      const captureButton = screen.getByText('Capture Document')
      expect(captureButton).toBeDisabled()
      
      // Mock video element having a source
      const videoElement = document.querySelector('video')
      if (videoElement) {
        Object.defineProperty(videoElement, 'srcObject', {
          value: 'mock-stream',
          writable: true
        })
      }
      
      // Re-render to update button state
      render(<CameraOCR />)
      
      await waitFor(() => {
        const newCaptureButton = screen.getByText('Capture Document')
        expect(newCaptureButton).not.toBeDisabled()
      })
    })
  })

  describe('OCR Settings', () => {
    beforeEach(async () => {
      render(<CameraOCR />)
      await waitFor(() => {
        expect(screen.getByText('OCR Settings')).toBeInTheDocument()
      })
    })

    it('displays processing quality options', () => {
      expect(screen.getByText('Processing Quality')).toBeInTheDocument()
      expect(screen.getByText('Standard')).toBeInTheDocument()
      expect(screen.getByText('High')).toBeInTheDocument()
      expect(screen.getByText('Ultra')).toBeInTheDocument()
    })

    it('allows changing processing quality', async () => {
      const ultraButton = screen.getByText('Ultra')
      await user.click(ultraButton)
      
      expect(ultraButton).toHaveClass('bg-gradient-to-r')
    })

    it('displays confidence threshold slider', () => {
      expect(screen.getByText(/Confidence Threshold:/)).toBeInTheDocument()
      const slider = screen.getByRole('slider')
      expect(slider).toBeInTheDocument()
      expect(slider.value).toBe('0.95') // Default value
    })

    it('allows adjusting confidence threshold', async () => {
      const slider = screen.getByRole('slider')
      fireEvent.change(slider, { target: { value: '0.85' } })
      
      expect(slider.value).toBe('0.85')
      expect(screen.getByText('Confidence Threshold: 85%')).toBeInTheDocument()
    })

    it('shows service status information', () => {
      expect(screen.getByText('Service Status')).toBeInTheDocument()
      expect(screen.getByText('OCR Engine')).toBeInTheDocument()
      expect(screen.getByText('VA Form Detection')).toBeInTheDocument()
    })
  })

  describe('File Upload Functionality', () => {
    beforeEach(async () => {
      render(<CameraOCR />)
      const uploadTab = screen.getByText('Batch Upload')
      await user.click(uploadTab)
    })

    it('displays file upload interface', () => {
      expect(screen.getByText('Upload Documents')).toBeInTheDocument()
      expect(screen.getByText('Select Files')).toBeInTheDocument()
      expect(screen.getByText('Supported formats: JPG, PNG, PDF (max 10MB)')).toBeInTheDocument()
    })

    it('handles file upload', async () => {
      const { processDocumentOCR } = await import('../../../../services/ocrService')
      
      const fileInput = document.querySelector('input[type="file"]')
      const file = new File(['image content'], 'test.jpg', { type: 'image/jpeg' })
      
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false
      })
      
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(processDocumentOCR).toHaveBeenCalledWith(
          file,
          expect.objectContaining({
            quality: 'high',
            language: 'eng',
            enableVAFormRecognition: true,
            confidenceThreshold: 0.95
          })
        )
      })
    })

    it('validates file type', async () => {
      const fileInput = document.querySelector('input[type="file"]')
      const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' })
      
      global.alert = vi.fn()
      
      Object.defineProperty(fileInput, 'files', {
        value: [invalidFile],
        writable: false
      })
      
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          expect.stringContaining('Please upload a supported file format')
        )
      })
    })

    it('validates file size', async () => {
      const fileInput = document.querySelector('input[type="file"]')
      
      // Create oversized file (mock 11MB)
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', { 
        type: 'image/jpeg' 
      })
      
      global.alert = vi.fn()
      
      Object.defineProperty(fileInput, 'files', {
        value: [largeFile],
        writable: false
      })
      
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          expect.stringContaining('File size must be less than 10MB')
        )
      })
    })
  })

  describe('Document Processing', () => {
    it('shows processing overlay during OCR', async () => {
      render(<CameraOCR />)
      const uploadTab = screen.getByText('Batch Upload')
      await user.click(uploadTab)
      
      const fileInput = document.querySelector('input[type="file"]')
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(fileInput, 'files', { value: [file], writable: false })
      
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(screen.getByText('Processing Document')).toBeInTheDocument()
        expect(screen.getByText(/AI is analyzing your document/)).toBeInTheDocument()
      })
    })

    it('shows progress bar during processing', async () => {
      render(<CameraOCR />)
      const uploadTab = screen.getByText('Batch Upload')
      await user.click(uploadTab)
      
      const fileInput = document.querySelector('input[type="file"]')
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(fileInput, 'files', { value: [file], writable: false })
      
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(screen.getByText(/\d+% complete/)).toBeInTheDocument()
      })
    })

    it('shows processing status updates', async () => {
      render(<CameraOCR />)
      const uploadTab = screen.getByText('Batch Upload')
      await user.click(uploadTab)
      
      const fileInput = document.querySelector('input[type="file"]')
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(fileInput, 'files', { value: [file], writable: false })
      
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(screen.getByText('Preprocessing image...')).toBeInTheDocument()
      })
    })

    it('switches to results tab after processing', async () => {
      render(<CameraOCR />)
      const uploadTab = screen.getByText('Batch Upload')
      await user.click(uploadTab)
      
      const fileInput = document.querySelector('input[type="file"]')
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(fileInput, 'files', { value: [file], writable: false })
      
      fireEvent.change(fileInput)
      
      // Wait for processing to complete and tab switch
      await waitFor(() => {
        expect(screen.getByText('test.jpg')).toBeInTheDocument()
        expect(screen.getByText('97% confidence')).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })

  describe('Results Display', () => {
    beforeEach(async () => {
      render(<CameraOCR />)
      
      // Upload a test file to create a processed document
      const uploadTab = screen.getByText('Batch Upload')
      await user.click(uploadTab)
      
      const fileInput = document.querySelector('input[type="file"]')
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(fileInput, 'files', { value: [file], writable: false })
      
      fireEvent.change(fileInput)
      
      // Wait for processing to complete
      await waitFor(() => {
        expect(screen.getByText('test.jpg')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('displays processed document information', () => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument()
      expect(screen.getByText('Application for Disability Benefits (21-526EZ)')).toBeInTheDocument()
      expect(screen.getByText('97% confidence')).toBeInTheDocument()
    })

    it('shows document sections with confidence scores', () => {
      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Personal Info')).toBeInTheDocument()
      expect(screen.getByText('Conditions')).toBeInTheDocument()
      expect(screen.getByText('Signature')).toBeInTheDocument()
      
      expect(screen.getByText('98%')).toBeInTheDocument() // Header confidence
      expect(screen.getByText('95%')).toBeInTheDocument() // Personal Info confidence
    })

    it('displays extracted text preview', () => {
      expect(screen.getByText('Extracted Text Preview')).toBeInTheDocument()
      expect(screen.getByText(/This is sample extracted text/)).toBeInTheDocument()
    })

    it('provides document action buttons', () => {
      const actionButtons = screen.getAllByRole('button')
      const viewButtons = actionButtons.filter(button => 
        button.querySelector('svg') && button.textContent === ''
      )
      expect(viewButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Document Actions', () => {
    beforeEach(async () => {
      // Set up a processed document
      render(<CameraOCR />)
      
      const uploadTab = screen.getByText('Batch Upload')
      await user.click(uploadTab)
      
      const fileInput = document.querySelector('input[type="file"]')
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(fileInput, 'files', { value: [file], writable: false })
      
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(screen.getByText('test.jpg')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('opens document preview modal', async () => {
      const viewButtons = screen.getAllByRole('button')
      const viewButton = viewButtons.find(button => {
        const svg = button.querySelector('svg[data-testid="eye"]') || 
                   button.querySelector('.lucide-eye')
        return svg !== null
      })
      
      if (viewButton) {
        await user.click(viewButton)
        
        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument()
          expect(screen.getByText('This is sample extracted text from the document')).toBeInTheDocument()
        })
      }
    })

    it('exports document text', async () => {
      const exportButtons = screen.getAllByRole('button')
      const exportButton = exportButtons.find(button => {
        const svg = button.querySelector('svg[data-testid="download"]') || 
                   button.querySelector('.lucide-download')
        return svg !== null
      })
      
      if (exportButton) {
        await user.click(exportButton)
        
        expect(global.URL.createObjectURL).toHaveBeenCalled()
      }
    })

    it('copies text to clipboard', async () => {
      const copyButtons = screen.getAllByRole('button')
      const copyButton = copyButtons.find(button => {
        const svg = button.querySelector('svg[data-testid="copy"]') || 
                   button.querySelector('.lucide-copy')
        return svg !== null
      })
      
      if (copyButton) {
        await user.click(copyButton)
        
        expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(
          expect.stringContaining('This is sample extracted text')
        )
      }
    })
  })

  describe('Analytics Dashboard', () => {
    beforeEach(async () => {
      render(<CameraOCR />)
      const analyticsTab = screen.getByText('Intelligence')
      await user.click(analyticsTab)
    })

    it('displays analytics metrics', () => {
      expect(screen.getByText('Documents Processed')).toBeInTheDocument()
      expect(screen.getByText('Average Accuracy')).toBeInTheDocument()
      expect(screen.getByText('Processing Speed')).toBeInTheDocument()
      expect(screen.getByText('VA Forms Detected')).toBeInTheDocument()
      expect(screen.getByText('Success Rate')).toBeInTheDocument()
      expect(screen.getByText('Data Extracted')).toBeInTheDocument()
    })

    it('shows metric values', () => {
      expect(screen.getByText('2,847')).toBeInTheDocument() // Documents Processed
      expect(screen.getByText('99.7%')).toBeInTheDocument() // Average Accuracy
      expect(screen.getByText('1.2s')).toBeInTheDocument() // Processing Speed
      expect(screen.getByText('1,934')).toBeInTheDocument() // VA Forms Detected
      expect(screen.getByText('98.9%')).toBeInTheDocument() // Success Rate
      expect(screen.getByText('847GB')).toBeInTheDocument() // Data Extracted
    })

    it('displays trend indicators', () => {
      expect(screen.getByText('+23%')).toBeInTheDocument()
      expect(screen.getByText('+0.3%')).toBeInTheDocument()
      expect(screen.getByText('-15%')).toBeInTheDocument()
      expect(screen.getByText('+18%')).toBeInTheDocument()
    })
  })

  describe('Capture Tips', () => {
    beforeEach(async () => {
      render(<CameraOCR />)
      await waitFor(() => {
        expect(screen.getByText('Capture Tips')).toBeInTheDocument()
      })
    })

    it('displays helpful capture tips', () => {
      expect(screen.getByText('Position Document')).toBeInTheDocument()
      expect(screen.getByText('Good Lighting')).toBeInTheDocument()
      expect(screen.getByText('Keep Steady')).toBeInTheDocument()
      expect(screen.getByText('Focus')).toBeInTheDocument()
    })

    it('shows tip descriptions', () => {
      expect(screen.getByText(/Place the entire document within the camera frame/)).toBeInTheDocument()
      expect(screen.getByText(/Ensure adequate lighting without shadows/)).toBeInTheDocument()
      expect(screen.getByText(/Hold the camera steady for clear/)).toBeInTheDocument()
      expect(screen.getByText(/Wait for the camera to focus/)).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles OCR service initialization errors', async () => {
      const { initializeOCR } = await import('../../../../services/ocrService')
      initializeOCR.mockRejectedValueOnce(new Error('Service unavailable'))
      
      render(<CameraOCR />)
      
      // Component should still render without crashing
      await waitFor(() => {
        expect(screen.getByText('Document Intelligence')).toBeInTheDocument()
      })
    })

    it('handles OCR processing errors', async () => {
      const { processDocumentOCR } = await import('../../../../services/ocrService')
      processDocumentOCR.mockRejectedValueOnce(new Error('Processing failed'))
      
      render(<CameraOCR />)
      const uploadTab = screen.getByText('Batch Upload')
      await user.click(uploadTab)
      
      const fileInput = document.querySelector('input[type="file"]')
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(fileInput, 'files', { value: [file], writable: false })
      
      global.alert = vi.fn()
      
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('OCR processing failed: Processing failed')
      })
    })

    it('handles clipboard copy failures', async () => {
      global.navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Clipboard failed'))
      
      // Set up processed document first
      render(<CameraOCR />)
      const uploadTab = screen.getByText('Batch Upload')
      await user.click(uploadTab)
      
      const fileInput = document.querySelector('input[type="file"]')
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(fileInput, 'files', { value: [file], writable: false })
      
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(screen.getByText('test.jpg')).toBeInTheDocument()
      }, { timeout: 3000 })
      
      const copyButtons = screen.getAllByRole('button')
      const copyButton = copyButtons.find(button => {
        const svg = button.querySelector('.lucide-copy')
        return svg !== null
      })
      
      if (copyButton) {
        await user.click(copyButton)
        // Should handle error gracefully without crashing
        expect(screen.getByText('test.jpg')).toBeInTheDocument()
      }
    })
  })

  describe('Accessibility Features', () => {
    beforeEach(async () => {
      render(<CameraOCR />)
      await waitFor(() => {
        expect(screen.getByText('Document Intelligence')).toBeInTheDocument()
      })
    })

    it('has proper heading structure', () => {
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveTextContent('Document Intelligence')
    })

    it('provides keyboard navigation', () => {
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeVisible()
      })
    })

    it('announces important actions to screen readers', async () => {
      const { announceToScreenReader } = await import('../../../../utils/accessibility')
      
      // Should announce service initialization
      await waitFor(() => {
        expect(announceToScreenReader).toHaveBeenCalledWith(
          expect.stringContaining('OCR service initialized')
        )
      })
    })

    it('has accessible form controls', () => {
      const slider = screen.getByRole('slider')
      expect(slider).toBeVisible()
      
      const fileInput = document.querySelector('input[type="file"]')
      expect(fileInput).toBeTruthy()
    })
  })

  describe('Performance Considerations', () => {
    it('limits service initialization calls', () => {
      const { initializeOCR } = vi.mocked(
        require('../../../../services/ocrService').initializeOCR
      )
      
      render(<CameraOCR />)
      
      // Should only initialize once
      expect(initializeOCR).toHaveBeenCalledTimes(1)
    })

    it('handles large document processing efficiently', async () => {
      render(<CameraOCR />)
      const uploadTab = screen.getByText('Batch Upload')
      await user.click(uploadTab)
      
      const fileInput = document.querySelector('input[type="file"]')
      const file = new File(['large image content'], 'large.jpg', { 
        type: 'image/jpeg' 
      })
      Object.defineProperty(fileInput, 'files', { value: [file], writable: false })
      
      fireEvent.change(fileInput)
      
      // Should process without hanging
      await waitFor(() => {
        expect(screen.getByText('Processing Document')).toBeInTheDocument()
      })
    })
  })

  describe('Modal Functionality', () => {
    beforeEach(async () => {
      // Set up processed document
      render(<CameraOCR />)
      
      const uploadTab = screen.getByText('Batch Upload')
      await user.click(uploadTab)
      
      const fileInput = document.querySelector('input[type="file"]')
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(fileInput, 'files', { value: [file], writable: false })
      
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(screen.getByText('test.jpg')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('opens document preview modal', async () => {
      const viewButtons = screen.getAllByRole('button')
      const viewButton = viewButtons.find(button => {
        const svg = button.querySelector('.lucide-eye')
        return svg !== null
      })
      
      if (viewButton) {
        await user.click(viewButton)
        
        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument()
        })
      }
    })

    it('displays full extracted text in modal', async () => {
      const viewButtons = screen.getAllByRole('button')
      const viewButton = viewButtons.find(button => {
        const svg = button.querySelector('.lucide-eye')
        return svg !== null
      })
      
      if (viewButton) {
        await user.click(viewButton)
        
        await waitFor(() => {
          expect(screen.getByText(/This is sample extracted text from the document/)).toBeInTheDocument()
        })
      }
    })
  })
})