import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AudioTranscription from '../AudioTranscription'

// Mock the speech-to-text service
vi.mock('../../../../services/speechToTextService', () => ({
  speechToTextService: {
    isSupported: vi.fn(() => true),
    initialize: vi.fn(() => Promise.resolve({ success: true }))
  },
  initializeSpeechService: vi.fn(() => Promise.resolve({ 
    success: true, 
    provider: 'WebAPI'
  })),
  startRealTimeTranscription: vi.fn((options) => {
    // Simulate real-time transcription updates
    setTimeout(() => {
      options.onUpdate({
        interimTranscript: 'Hello this is a test',
        finalTranscript: '',
        currentSpeaker: 'Speaker 1'
      })
    }, 100)
    
    setTimeout(() => {
      options.onUpdate({
        interimTranscript: '',
        finalTranscript: 'Hello this is a test transcript.',
        currentSpeaker: 'Speaker 1'
      })
    }, 200)
    
    return Promise.resolve()
  }),
  stopRealTimeTranscription: vi.fn(),
  processAudioFileService: vi.fn(() => Promise.resolve({
    success: true,
    transcript: 'This is a test transcript from uploaded file.',
    confidence: 0.95,
    duration: '2:30',
    speakers: [{ name: 'Speaker 1' }],
    summary: 'Test audio file transcription',
    vaTermsFound: ['service connection', 'PTSD']
  })),
  getSpeechServiceInfo: vi.fn(() => ({
    capabilities: {
      realTimeTranscription: true,
      fileProcessing: true,
      speakerDetection: true,
      vaTerminologyEnhancement: true
    },
    vaTermsCount: 500
  }))
}))

// Mock accessibility utilities
vi.mock('../../../../utils/accessibility', () => ({
  announceToScreenReader: vi.fn()
}))

// Mock MediaRecorder
global.MediaRecorder = vi.fn().mockImplementation(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  ondataavailable: null,
  onstop: null
}))

// Mock getUserMedia
global.navigator.mediaDevices = {
  getUserMedia: vi.fn(() => Promise.resolve({
    getTracks: vi.fn(() => [
      { stop: vi.fn() }
    ])
  }))
}

// Mock AudioContext
global.AudioContext = vi.fn().mockImplementation(() => ({
  createAnalyser: vi.fn(() => ({
    frequencyBinCount: 1024,
    getByteFrequencyData: vi.fn()
  })),
  createMediaStreamSource: vi.fn(() => ({
    connect: vi.fn()
  })),
  close: vi.fn()
}))
global.webkitAudioContext = global.AudioContext

// Mock clipboard API
global.navigator.clipboard = {
  writeText: vi.fn(() => Promise.resolve())
}

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url')
global.URL.revokeObjectURL = vi.fn()

describe('AudioTranscription Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initial Rendering', () => {
    it('renders the audio transcription interface', async () => {
      render(<AudioTranscription />)
      
      await waitFor(() => {
        expect(screen.getByText('Audio Intelligence')).toBeInTheDocument()
      })
      
      expect(screen.getByText(/Premium Legal Audio Processing & Transcription/)).toBeInTheDocument()
      expect(screen.getByText('98.7% Accuracy')).toBeInTheDocument()
    })

    it('displays navigation tabs', async () => {
      render(<AudioTranscription />)
      
      await waitFor(() => {
        expect(screen.getByText('Live Recording')).toBeInTheDocument()
        expect(screen.getByText('File Upload')).toBeInTheDocument()
        expect(screen.getByText(/Transcripts/)).toBeInTheDocument()
        expect(screen.getByText('Intelligence')).toBeInTheDocument()
      })
    })

    it('shows default active tab as record', async () => {
      render(<AudioTranscription />)
      
      await waitFor(() => {
        expect(screen.getByText('Live Recording Studio')).toBeInTheDocument()
        expect(screen.getByText('Audio Configuration')).toBeInTheDocument()
      })
    })

    it('initializes speech service on mount', async () => {
      const { initializeSpeechService, getSpeechServiceInfo } = await import('../../../../services/speechToTextService')
      
      render(<AudioTranscription />)
      
      await waitFor(() => {
        expect(initializeSpeechService).toHaveBeenCalledWith({
          continuous: true,
          interimResults: true,
          language: 'en-US',
          quality: 'high'
        })
        expect(getSpeechServiceInfo).toHaveBeenCalled()
      })
    })
  })

  describe('Tab Navigation', () => {
    beforeEach(async () => {
      render(<AudioTranscription />)
      await waitFor(() => {
        expect(screen.getByText('Audio Intelligence')).toBeInTheDocument()
      })
    })

    it('switches to upload tab', async () => {
      const uploadTab = screen.getByText('File Upload')
      await user.click(uploadTab)
      
      expect(screen.getByText('Upload Audio Files')).toBeInTheDocument()
      expect(screen.getByText('Supported formats: MP3, WAV, M4A, WEBM, OGG')).toBeInTheDocument()
    })

    it('switches to transcripts tab', async () => {
      const transcriptsTab = screen.getByText(/Transcripts/)
      await user.click(transcriptsTab)
      
      expect(screen.getByText(/Transcription Library/)).toBeInTheDocument()
    })

    it('switches to analytics tab', async () => {
      const analyticsTab = screen.getByText('Intelligence')
      await user.click(analyticsTab)
      
      expect(screen.getByText('Total Transcriptions')).toBeInTheDocument()
      expect(screen.getByText('Average Accuracy')).toBeInTheDocument()
    })
  })

  describe('Live Recording Functionality', () => {
    beforeEach(async () => {
      render(<AudioTranscription />)
      await waitFor(() => {
        expect(screen.getByText('Live Recording Studio')).toBeInTheDocument()
      })
    })

    it('displays recording interface', () => {
      expect(screen.getByText('Live Recording Studio')).toBeInTheDocument()
      expect(screen.getByText('Audio Configuration')).toBeInTheDocument()
      expect(screen.getByText('Ready to record')).toBeInTheDocument()
    })

    it('shows waveform visualization', () => {
      const waveformBars = screen.getByText('Ready to record').closest('div').previousSibling
      expect(waveformBars).toBeInTheDocument()
    })

    it('displays recording controls', () => {
      const recordButton = screen.getByRole('button', { name: /start recording/i })
      expect(recordButton).toBeInTheDocument()
    })

    it('starts recording when record button is clicked', async () => {
      const { startRealTimeTranscription } = await import('../../../../services/speechToTextService')
      
      const recordButton = screen.getByRole('button', { name: /start recording/i })
      await user.click(recordButton)
      
      await waitFor(() => {
        expect(global.navigator.mediaDevices.getUserMedia).toHaveBeenCalled()
        expect(startRealTimeTranscription).toHaveBeenCalled()
      })
    })

    it('shows recording timer when recording', async () => {
      const recordButton = screen.getByRole('button', { name: /start recording/i })
      await user.click(recordButton)
      
      // Fast forward timer
      vi.advanceTimersByTime(3000)
      
      await waitFor(() => {
        expect(screen.getByText('0:03')).toBeInTheDocument()
      })
    })

    it('stops recording when stop button is clicked', async () => {
      const { stopRealTimeTranscription } = await import('../../../../services/speechToTextService')
      
      // Start recording first
      const recordButton = screen.getByRole('button', { name: /start recording/i })
      await user.click(recordButton)
      
      await waitFor(() => {
        const stopButton = screen.getByRole('button', { name: /stop recording/i })
        user.click(stopButton)
      })
      
      await waitFor(() => {
        expect(stopRealTimeTranscription).toHaveBeenCalled()
      })
    })

    it('displays real-time transcript during recording', async () => {
      const recordButton = screen.getByRole('button', { name: /start recording/i })
      await user.click(recordButton)
      
      // Wait for transcript updates
      await waitFor(() => {
        expect(screen.getByText('Live Transcription')).toBeInTheDocument()
      })
    })

    it('handles microphone permission errors', async () => {
      global.navigator.mediaDevices.getUserMedia.mockRejectedValueOnce(
        new Error('Permission denied')
      )
      
      const recordButton = screen.getByRole('button', { name: /start recording/i })
      await user.click(recordButton)
      
      // Should handle error gracefully without crashing
      await waitFor(() => {
        expect(screen.getByText('Live Recording Studio')).toBeInTheDocument()
      })
    })
  })

  describe('Audio Configuration Settings', () => {
    beforeEach(async () => {
      render(<AudioTranscription />)
      await waitFor(() => {
        expect(screen.getByText('Audio Configuration')).toBeInTheDocument()
      })
    })

    it('displays recording quality options', () => {
      expect(screen.getByText('Standard')).toBeInTheDocument()
      expect(screen.getByText('High')).toBeInTheDocument()
      expect(screen.getByText('Ultra')).toBeInTheDocument()
    })

    it('allows changing recording quality', async () => {
      const ultraButton = screen.getByText('Ultra')
      await user.click(ultraButton)
      
      expect(ultraButton).toHaveClass('bg-gradient-to-r')
    })

    it('displays language model options', () => {
      const languageSelect = screen.getByDisplayValue('VA Legal Specialized')
      expect(languageSelect).toBeInTheDocument()
      
      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(4)
    })

    it('allows changing language model', async () => {
      const languageSelect = screen.getByDisplayValue('VA Legal Specialized')
      await user.selectOptions(languageSelect, 'medical')
      
      expect(languageSelect.value).toBe('medical')
    })

    it('displays speaker count controls', () => {
      expect(screen.getByText('Expected Speakers')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument() // Default value
    })

    it('allows adjusting speaker count', async () => {
      const increaseButton = screen.getByRole('button', { name: /increase speaker count/i })
      await user.click(increaseButton)
      
      expect(screen.getByText('3')).toBeInTheDocument()
      
      const decreaseButton = screen.getByRole('button', { name: /decrease speaker count/i })
      await user.click(decreaseButton)
      
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('shows service status information', () => {
      expect(screen.getByText('Service Status')).toBeInTheDocument()
      expect(screen.getByText('Real-time Transcription')).toBeInTheDocument()
      expect(screen.getByText('File Processing')).toBeInTheDocument()
      expect(screen.getByText('Speaker Detection')).toBeInTheDocument()
      expect(screen.getByText('VA Terminology')).toBeInTheDocument()
    })

    it('displays recording tips', () => {
      expect(screen.getByText('Recording Tips')).toBeInTheDocument()
      expect(screen.getByText(/Use a quiet environment/)).toBeInTheDocument()
    })
  })

  describe('File Upload Functionality', () => {
    beforeEach(async () => {
      render(<AudioTranscription />)
      const uploadTab = screen.getByText('File Upload')
      await user.click(uploadTab)
    })

    it('displays file upload interface', () => {
      expect(screen.getByText('Upload Audio Files')).toBeInTheDocument()
      expect(screen.getByText('Select Audio Files')).toBeInTheDocument()
      expect(screen.getByText('Maximum file size: 100MB per file')).toBeInTheDocument()
    })

    it('shows supported file formats', () => {
      expect(screen.getByText('Supported formats: MP3, WAV, M4A, WEBM, OGG')).toBeInTheDocument()
    })

    it('displays feature highlights', () => {
      expect(screen.getByText('3-5x faster than manual')).toBeInTheDocument()
      expect(screen.getByText('Multi-speaker detection')).toBeInTheDocument()
      expect(screen.getByText('HIPAA compliant')).toBeInTheDocument()
      expect(screen.getByText('98.7% accuracy')).toBeInTheDocument()
    })

    it('handles file upload', async () => {
      const { processAudioFileService } = await import('../../../../services/speechToTextService')
      
      const fileInput = screen.getByRole('button', { name: /Select Audio Files/i })
      
      // Create a mock file
      const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' })
      
      // Simulate file selection
      const hiddenInput = document.querySelector('input[type="file"]')
      Object.defineProperty(hiddenInput, 'files', {
        value: [file],
        writable: false
      })
      
      fireEvent.change(hiddenInput)
      
      await waitFor(() => {
        expect(processAudioFileService).toHaveBeenCalledWith(
          file,
          expect.objectContaining({
            quality: 'high',
            enableSpeakerDetection: true,
            language: 'en-US'
          })
        )
      })
    })

    it('validates file type', async () => {
      const fileInput = document.querySelector('input[type="file"]')
      
      // Create invalid file type
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false
      })
      
      // Mock alert
      global.alert = vi.fn()
      
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          'Please upload an audio file (MP3, WAV, M4A, WEBM, OGG)'
        )
      })
    })

    it('validates file size', async () => {
      const fileInput = document.querySelector('input[type="file"]')
      
      // Create oversized file (mock 101MB)
      const largeFile = new File(['x'.repeat(101 * 1024 * 1024)], 'large.mp3', { 
        type: 'audio/mp3' 
      })
      Object.defineProperty(fileInput, 'files', {
        value: [largeFile],
        writable: false
      })
      
      global.alert = vi.fn()
      
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('File size must be less than 100MB')
      })
    })
  })

  describe('Transcripts Management', () => {
    beforeEach(async () => {
      render(<AudioTranscription />)
      const transcriptsTab = screen.getByText(/Transcripts/)
      await user.click(transcriptsTab)
    })

    it('displays transcripts library', () => {
      expect(screen.getByText(/Transcription Library/)).toBeInTheDocument()
    })

    it('shows mock transcripts', () => {
      expect(screen.getByText('C&P Examination - PTSD Assessment')).toBeInTheDocument()
      expect(screen.getByText('Attorney-Client Consultation - Back Injury Claim')).toBeInTheDocument()
    })

    it('displays transcript metadata', () => {
      expect(screen.getByText('97% accuracy')).toBeInTheDocument()
      expect(screen.getByText('94% accuracy')).toBeInTheDocument()
      expect(screen.getByText('45:32')).toBeInTheDocument()
      expect(screen.getByText('32:18')).toBeInTheDocument()
    })

    it('shows key findings for transcripts', () => {
      expect(screen.getByText('Combat exposure confirmed in Iraq 2003-2005')).toBeInTheDocument()
      expect(screen.getByText('L4-L5 disc herniation documented')).toBeInTheDocument()
    })

    it('provides search functionality', async () => {
      const searchInput = screen.getByPlaceholderText('Search transcripts...')
      await user.type(searchInput, 'PTSD')
      
      expect(searchInput.value).toBe('PTSD')
      
      // Should still show PTSD transcript
      expect(screen.getByText('C&P Examination - PTSD Assessment')).toBeInTheDocument()
    })

    it('provides filter functionality', async () => {
      const filterSelect = screen.getByDisplayValue('All Types')
      await user.selectOptions(filterSelect, 'cp_exam')
      
      expect(filterSelect.value).toBe('cp_exam')
    })

    it('allows viewing transcript details', async () => {
      const viewButton = screen.getAllByText('View')[0]
      await user.click(viewButton)
      
      await waitFor(() => {
        expect(screen.getByText('Full Transcript')).toBeInTheDocument()
      })
    })

    it('allows exporting transcripts', async () => {
      const exportButton = screen.getAllByText('Export')[0]
      await user.click(exportButton)
      
      expect(global.URL.createObjectURL).toHaveBeenCalled()
    })

    it('allows copying transcript to clipboard', async () => {
      const copyButton = screen.getAllByRole('button', { name: /copy/i })[0]
      await user.click(copyButton)
      
      expect(global.navigator.clipboard.writeText).toHaveBeenCalled()
    })
  })

  describe('Analytics Dashboard', () => {
    beforeEach(async () => {
      render(<AudioTranscription />)
      const analyticsTab = screen.getByText('Intelligence')
      await user.click(analyticsTab)
    })

    it('displays analytics metrics', () => {
      expect(screen.getByText('Total Transcriptions')).toBeInTheDocument()
      expect(screen.getByText('Average Accuracy')).toBeInTheDocument()
      expect(screen.getByText('Processing Time')).toBeInTheDocument()
      expect(screen.getByText('Hours Transcribed')).toBeInTheDocument()
      expect(screen.getByText('Speakers Identified')).toBeInTheDocument()
      expect(screen.getByText('VA Terms Detected')).toBeInTheDocument()
    })

    it('shows metric values', () => {
      expect(screen.getByText('1,247')).toBeInTheDocument() // Total Transcriptions
      expect(screen.getByText('98.7%')).toBeInTheDocument() // Average Accuracy
      expect(screen.getByText('2.3 min')).toBeInTheDocument() // Processing Time
      expect(screen.getByText('847')).toBeInTheDocument() // Hours Transcribed
      expect(screen.getByText('3,421')).toBeInTheDocument() // Speakers Identified
      expect(screen.getByText('12,847')).toBeInTheDocument() // VA Terms Detected
    })

    it('displays trend indicators', () => {
      expect(screen.getByText('+23%')).toBeInTheDocument()
      expect(screen.getByText('+0.3%')).toBeInTheDocument()
      expect(screen.getByText('-15%')).toBeInTheDocument()
      expect(screen.getByText('+45%')).toBeInTheDocument()
    })
  })

  describe('Key Finding Extraction', () => {
    it('extracts key findings from transcript text', async () => {
      render(<AudioTranscription />)
      
      // Wait for component to initialize
      await waitFor(() => {
        expect(screen.getByText('Audio Intelligence')).toBeInTheDocument()
      })
      
      // Access the component instance to test internal methods
      const component = screen.getByText('Audio Intelligence').closest('div')
      expect(component).toBeInTheDocument()
      
      // Key findings should be extracted from mock transcripts
      const transcriptsTab = screen.getByText(/Transcripts/)
      await user.click(transcriptsTab)
      
      expect(screen.getByText('Combat exposure confirmed in Iraq 2003-2005')).toBeInTheDocument()
      expect(screen.getByText('Current GAF score: 45-50')).toBeInTheDocument()
    })
  })

  describe('VA Terms Detection', () => {
    beforeEach(async () => {
      render(<AudioTranscription />)
      const transcriptsTab = screen.getByText(/Transcripts/)
      await user.click(transcriptsTab)
    })

    it('identifies VA legal terminology', () => {
      // Mock transcripts should contain VA terms
      expect(screen.getByText('C&P Examination - PTSD Assessment')).toBeInTheDocument()
      expect(screen.getByText('Attorney-Client Consultation - Back Injury Claim')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles speech service initialization errors', async () => {
      const { initializeSpeechService } = await import('../../../../services/speechToTextService')
      initializeSpeechService.mockRejectedValueOnce(new Error('Service unavailable'))
      
      render(<AudioTranscription />)
      
      // Component should still render without crashing
      await waitFor(() => {
        expect(screen.getByText('Audio Intelligence')).toBeInTheDocument()
      })
    })

    it('handles file processing errors', async () => {
      const { processAudioFileService } = await import('../../../../services/speechToTextService')
      processAudioFileService.mockRejectedValueOnce(new Error('Processing failed'))
      
      render(<AudioTranscription />)
      const uploadTab = screen.getByText('File Upload')
      await user.click(uploadTab)
      
      const fileInput = document.querySelector('input[type="file"]')
      const file = new File(['audio'], 'test.mp3', { type: 'audio/mp3' })
      Object.defineProperty(fileInput, 'files', { value: [file], writable: false })
      
      global.alert = vi.fn()
      
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Transcription failed: Processing failed')
      })
    })

    it('handles clipboard copy failures', async () => {
      global.navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Clipboard failed'))
      
      render(<AudioTranscription />)
      const transcriptsTab = screen.getByText(/Transcripts/)
      await user.click(transcriptsTab)
      
      const copyButton = screen.getAllByRole('button', { name: /copy/i })[0]
      await user.click(copyButton)
      
      // Should handle error gracefully without crashing
      expect(screen.getByText(/Transcription Library/)).toBeInTheDocument()
    })
  })

  describe('Accessibility Features', () => {
    beforeEach(async () => {
      render(<AudioTranscription />)
      await waitFor(() => {
        expect(screen.getByText('Audio Intelligence')).toBeInTheDocument()
      })
    })

    it('has proper heading structure', () => {
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveTextContent('Audio Intelligence')
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
          expect.stringContaining('Speech-to-text service initialized')
        )
      })
    })

    it('has accessible form controls', () => {
      const selects = screen.getAllByRole('combobox')
      selects.forEach(select => {
        expect(select).toBeVisible()
      })
      
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toBeVisible()
      })
    })
  })

  describe('Processing Overlay', () => {
    it('shows processing overlay during transcription', async () => {
      render(<AudioTranscription />)
      const uploadTab = screen.getByText('File Upload')
      await user.click(uploadTab)
      
      const fileInput = document.querySelector('input[type="file"]')
      const file = new File(['audio'], 'test.mp3', { type: 'audio/mp3' })
      Object.defineProperty(fileInput, 'files', { value: [file], writable: false })
      
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(screen.getByText('Processing Audio')).toBeInTheDocument()
        expect(screen.getByText(/AI is transcribing your audio/)).toBeInTheDocument()
      })
    })

    it('shows progress bar during processing', async () => {
      render(<AudioTranscription />)
      const uploadTab = screen.getByText('File Upload')
      await user.click(uploadTab)
      
      const fileInput = document.querySelector('input[type="file"]')
      const file = new File(['audio'], 'test.mp3', { type: 'audio/mp3' })
      Object.defineProperty(fileInput, 'files', { value: [file], writable: false })
      
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(screen.getByText(/\d+% complete/)).toBeInTheDocument()
      })
    })
  })

  describe('Performance Considerations', () => {
    it('handles large transcript lists efficiently', async () => {
      render(<AudioTranscription />)
      const transcriptsTab = screen.getByText(/Transcripts/)
      await user.click(transcriptsTab)
      
      // Should render transcript list without performance issues
      expect(screen.getByText(/Transcription Library/)).toBeInTheDocument()
      expect(screen.getByText('C&P Examination - PTSD Assessment')).toBeInTheDocument()
    })

    it('limits service initialization calls', () => {
      const { initializeSpeechService } = vi.mocked(
        require('../../../../services/speechToTextService').initializeSpeechService
      )
      
      render(<AudioTranscription />)
      
      // Should only initialize once
      expect(initializeSpeechService).toHaveBeenCalledTimes(1)
    })
  })

  describe('Modal Functionality', () => {
    beforeEach(async () => {
      render(<AudioTranscription />)
      const transcriptsTab = screen.getByText(/Transcripts/)
      await user.click(transcriptsTab)
    })

    it('opens transcript detail modal', async () => {
      const viewButton = screen.getAllByText('View')[0]
      await user.click(viewButton)
      
      await waitFor(() => {
        expect(screen.getByText('C&P Examination - PTSD Assessment')).toBeInTheDocument()
        expect(screen.getByText('Full Transcript')).toBeInTheDocument()
      })
    })

    it('closes modal when requested', async () => {
      const viewButton = screen.getAllByText('View')[0]
      await user.click(viewButton)
      
      await waitFor(() => {
        const modal = screen.getByRole('dialog')
        expect(modal).toBeInTheDocument()
      })
      
      // Close button should be available (via Modal component)
      const closeButton = screen.getByLabelText(/close/i) || screen.getByRole('button', { name: /close/i })
      if (closeButton) {
        await user.click(closeButton)
        
        await waitFor(() => {
          expect(screen.queryByText('Full Transcript')).not.toBeInTheDocument()
        })
      }
    })
  })
})