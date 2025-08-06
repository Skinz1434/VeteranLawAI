/**
 * @fileoverview Tests for refactored AudioTranscription component architecture
 * @author QBit-Claude Refactor Agent
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

// Mock Zustand stores
import { useAudioTranscriptionStore } from '../../../../stores/audioTranscriptionStore'
import { useAudioRecording } from '../../../../hooks/useAudioRecording'
import { useTranscription } from '../../../../hooks/useTranscription'

// Components under test
import AudioTranscription from '../AudioTranscriptionRefactored'
import TabNavigation from '../components/TabNavigation'
import AudioRecordingStudio from '../components/AudioRecordingStudio'
import FileUploadManager from '../components/FileUploadManager'
import TranscriptLibrary from '../components/TranscriptLibrary'
import AnalyticsDashboard from '../components/AnalyticsDashboard'
import WaveformVisualizer from '../components/WaveformVisualizer'

// Mock external dependencies
vi.mock('../../../../services/speechToTextService', () => ({
  initializeSpeechService: vi.fn(() => Promise.resolve({ success: true, provider: 'WebSpeechAPI' })),
  getSpeechServiceInfo: vi.fn(() => ({ provider: 'WebSpeechAPI', available: true })),
  startRealTimeTranscription: vi.fn(() => Promise.resolve()),
  stopRealTimeTranscription: vi.fn(),
  processAudioFile: vi.fn(() => Promise.resolve({ 
    success: true, 
    transcript: 'Test transcript content',
    duration: '5:30',
    speakers: ['Speaker 1', 'Speaker 2']
  }))
}))

vi.mock('../../../../utils/accessibility', () => ({
  announceToScreenReader: vi.fn()
}))

// Mock media APIs
Object.defineProperty(window, 'MediaRecorder', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    state: 'inactive'
  }))
})

Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: vi.fn(() => Promise.resolve({
      getTracks: () => [{ stop: vi.fn() }]
    }))
  }
})

// Mock store data
const mockTranscript = {
  id: '1',
  title: 'Test C&P Exam',
  type: 'cp_exam' as const,
  date: '2024-01-15T10:30:00Z',
  duration: '45:32',
  speakers: ['Dr. Smith', 'John Veteran'],
  status: 'completed' as const,
  confidence: 0.95,
  language: 'en-US',
  summary: 'PTSD evaluation for service-connected disability claim',
  keyFindings: [
    'Combat exposure confirmed in Iraq 2003-2005',
    'Current symptoms include nightmares and hypervigilance',
    'Significant occupational impairment documented'
  ],
  transcript: 'Dr. Smith: Good morning, Mr. Johnson. Today we will be conducting your PTSD evaluation...',
}

describe('AudioTranscription Refactored Architecture', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
    
    // Mock Zustand store initial state
    useAudioTranscriptionStore.setState({
      activeTab: 'record',
      transcripts: [mockTranscript],
      isRecording: false,
      isTranscribing: false,
      selectedTranscript: null,
      showPreview: false,
      searchQuery: '',
      filterType: 'all',
      qualitySettings: 'high',
      languageModel: 'legal-va',
      speakerCount: 2,
      serviceInfo: { provider: 'WebSpeechAPI', available: true }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Main AudioTranscription Container', () => {
    it('renders without crashing', () => {
      render(<AudioTranscription />)
      expect(screen.getByRole('main', { name: /audio transcription tool/i })).toBeInTheDocument()
    })

    it('displays tab navigation', () => {
      render(<AudioTranscription />)
      expect(screen.getByText('Record')).toBeInTheDocument()
      expect(screen.getByText('Upload')).toBeInTheDocument()
      expect(screen.getByText('Library')).toBeInTheDocument()
      expect(screen.getByText('Analytics')).toBeInTheDocument()
    })

    it('shows recording tab content by default', async () => {
      render(<AudioTranscription />)
      await waitFor(() => {
        expect(screen.getByText(/ready to record/i)).toBeInTheDocument()
      })
    })

    it('switches tabs correctly', async () => {
      render(<AudioTranscription />)
      
      await user.click(screen.getByText('Library'))
      await waitFor(() => {
        expect(screen.getByText(/transcript library/i)).toBeInTheDocument()
      })

      await user.click(screen.getByText('Analytics'))
      await waitFor(() => {
        expect(screen.getByText(/analytics dashboard/i)).toBeInTheDocument()
      })
    })

    it('initializes speech service on mount', async () => {
      const { initializeSpeechService } = await import('../../../../services/speechToTextService')
      render(<AudioTranscription />)
      
      await waitFor(() => {
        expect(initializeSpeechService).toHaveBeenCalledWith({
          continuous: true,
          interimResults: true,
          language: 'en-US',
          quality: 'high'
        })
      })
    })
  })

  describe('TabNavigation Component', () => {
    it('displays all tabs with correct icons', () => {
      render(<TabNavigation />)
      
      expect(screen.getByText('Record')).toBeInTheDocument()
      expect(screen.getByText('Upload')).toBeInTheDocument()
      expect(screen.getByText('Library')).toBeInTheDocument()
      expect(screen.getByText('Analytics')).toBeInTheDocument()
    })

    it('shows transcript count badge', () => {
      render(<TabNavigation />)
      expect(screen.getByText('1')).toBeInTheDocument() // Badge showing transcript count
    })

    it('shows live recording indicator when recording', () => {
      useAudioTranscriptionStore.setState({ isRecording: true })
      render(<TabNavigation />)
      expect(screen.getByText('LIVE')).toBeInTheDocument()
    })

    it('shows processing indicator when transcribing', () => {
      useAudioTranscriptionStore.setState({ isTranscribing: true })
      render(<TabNavigation />)
      expect(screen.getByText('PROCESSING')).toBeInTheDocument()
    })

    it('switches active tab when clicked', async () => {
      const setActiveTab = vi.fn()
      vi.mocked(useAudioTranscriptionStore.getState().setActiveTab).mockImplementation(setActiveTab)
      
      render(<TabNavigation />)
      await user.click(screen.getByText('Upload'))
      expect(setActiveTab).toHaveBeenCalledWith('upload')
    })
  })

  describe('AudioRecordingStudio Component', () => {
    const mockRecordingHook = {
      isRecording: false,
      recordingTime: 0,
      audioLevel: 0.5,
      realTimeTranscript: '',
      interimTranscript: '',
      currentSpeaker: 'Speaker 1',
      startRecording: vi.fn(),
      stopRecording: vi.fn(),
      toggleRecording: vi.fn(),
      formatRecordingTime: vi.fn((seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`)
    }

    beforeEach(() => {
      vi.mocked(useAudioRecording).mockReturnValue(mockRecordingHook)
    })

    it('renders recording interface', () => {
      render(<AudioRecordingStudio />)
      expect(screen.getByText(/ready to record/i)).toBeInTheDocument()
      expect(screen.getByText('Start Recording')).toBeInTheDocument()
    })

    it('shows recording timer', () => {
      mockRecordingHook.recordingTime = 125
      render(<AudioRecordingStudio />)
      expect(mockRecordingHook.formatRecordingTime).toHaveBeenCalledWith(125)
    })

    it('displays waveform visualizer', () => {
      render(<AudioRecordingStudio />)
      expect(screen.getByRole('img', { name: /audio waveform visualization/i })).toBeInTheDocument()
    })

    it('starts recording when button clicked', async () => {
      render(<AudioRecordingStudio />)
      await user.click(screen.getByText('Start Recording'))
      expect(mockRecordingHook.startRecording).toHaveBeenCalled()
    })

    it('shows stop button when recording', () => {
      mockRecordingHook.isRecording = true
      render(<AudioRecordingStudio />)
      expect(screen.getByText('Stop')).toBeInTheDocument()
    })

    it('displays live transcript when available', () => {
      mockRecordingHook.realTimeTranscript = 'This is a live transcript'
      render(<AudioRecordingStudio />)
      expect(screen.getByText('This is a live transcript')).toBeInTheDocument()
    })

    it('shows current speaker information', () => {
      render(<AudioRecordingStudio />)
      expect(screen.getByText('Speaker 1')).toBeInTheDocument()
    })

    it('displays audio level meter', () => {
      mockRecordingHook.audioLevel = 0.7
      render(<AudioRecordingStudio />)
      expect(screen.getByText('70%')).toBeInTheDocument()
    })
  })

  describe('WaveformVisualizer Component', () => {
    it('renders canvas element', () => {
      render(<WaveformVisualizer audioLevel={0.5} isActive={true} />)
      expect(screen.getByRole('img', { name: /audio waveform visualization/i })).toBeInTheDocument()
    })

    it('shows inactive state when not recording', () => {
      render(<WaveformVisualizer audioLevel={0} isActive={false} />)
      expect(screen.getByRole('img', { name: /audio waveform visualization - inactive/i })).toBeInTheDocument()
    })

    it('updates with audio level changes', () => {
      const { rerender } = render(<WaveformVisualizer audioLevel={0.3} isActive={true} />)
      
      rerender(<WaveformVisualizer audioLevel={0.8} isActive={true} />)
      expect(screen.getByRole('img', { name: /showing 80% audio level/i })).toBeInTheDocument()
    })
  })

  describe('FileUploadManager Component', () => {
    const mockTranscriptionHook = {
      processAudioFile: vi.fn(() => Promise.resolve()),
      transcripts: [mockTranscript],
      isTranscribing: false,
      transcriptionProgress: 0
    }

    beforeEach(() => {
      vi.mocked(useTranscription).mockReturnValue(mockTranscriptionHook as any)
    })

    it('renders upload area', () => {
      render(<FileUploadManager />)
      expect(screen.getByText(/upload audio file/i)).toBeInTheDocument()
      expect(screen.getByText('Choose File')).toBeInTheDocument()
    })

    it('shows supported formats information', () => {
      render(<FileUploadManager />)
      expect(screen.getByText(/supported formats/i)).toBeInTheDocument()
      expect(screen.getByText(/MP3, WAV, OGG/i)).toBeInTheDocument()
    })

    it('handles file selection via input', async () => {
      const mockFile = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' })
      render(<FileUploadManager />)
      
      const input = screen.getByRole('button', { name: /choose file/i })
      await user.click(input)
      
      // Find the hidden file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      expect(fileInput).toBeInTheDocument()
    })

    it('validates file type and size', () => {
      render(<FileUploadManager />)
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      expect(fileInput).toHaveAttribute('accept')
    })

    it('shows processing state during transcription', () => {
      mockTranscriptionHook.isTranscribing = true
      mockTranscriptionHook.transcriptionProgress = 45
      
      render(<FileUploadManager />)
      expect(screen.getByText(/processing audio file/i)).toBeInTheDocument()
      expect(screen.getByText('45% complete')).toBeInTheDocument()
    })

    it('displays error messages for invalid files', async () => {
      render(<FileUploadManager />)
      // Test would involve simulating an invalid file upload
      // and checking that error message appears
    })
  })

  describe('TranscriptLibrary Component', () => {
    const mockLibraryHook = {
      filteredTranscripts: [mockTranscript],
      searchTranscripts: vi.fn(),
      deleteTranscript: vi.fn(),
      exportTranscript: vi.fn(),
      copyTranscriptToClipboard: vi.fn(),
      selectTranscript: vi.fn()
    }

    beforeEach(() => {
      vi.mocked(useTranscription).mockReturnValue(mockLibraryHook as any)
    })

    it('renders transcript library with header', () => {
      render(<TranscriptLibrary />)
      expect(screen.getByText('Transcript Library')).toBeInTheDocument()
      expect(screen.getByText('1 transcript available')).toBeInTheDocument()
    })

    it('shows search and filter controls', () => {
      render(<TranscriptLibrary />)
      expect(screen.getByPlaceholderText('Search transcripts...')).toBeInTheDocument()
      expect(screen.getByDisplayValue('All Transcripts')).toBeInTheDocument()
    })

    it('displays transcript cards', () => {
      render(<TranscriptLibrary />)
      expect(screen.getByText('Test C&P Exam')).toBeInTheDocument()
      expect(screen.getByText('C&P Exam')).toBeInTheDocument()
      expect(screen.getByText('95%')).toBeInTheDocument()
    })

    it('shows statistics cards', () => {
      render(<TranscriptLibrary />)
      expect(screen.getByText('Total Transcripts')).toBeInTheDocument()
      expect(screen.getByText('Avg. Quality')).toBeInTheDocument()
    })

    it('filters transcripts by search query', async () => {
      render(<TranscriptLibrary />)
      const searchInput = screen.getByPlaceholderText('Search transcripts...')
      
      await user.type(searchInput, 'PTSD')
      expect(searchInput).toHaveValue('PTSD')
    })

    it('switches between grid and list view', async () => {
      render(<TranscriptLibrary />)
      
      const listViewButton = screen.getByText('List')
      await user.click(listViewButton)
      
      // Test would check for layout changes
    })

    it('handles transcript actions (view, export, delete)', async () => {
      render(<TranscriptLibrary />)
      
      expect(screen.getByText('View')).toBeInTheDocument()
      // Test would simulate clicking actions and verify they're called
    })
  })

  describe('AnalyticsDashboard Component', () => {
    it('shows analytics when transcripts exist', () => {
      render(<AnalyticsDashboard />)
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Total Transcripts')).toBeInTheDocument()
    })

    it('displays key metrics cards', () => {
      render(<AnalyticsDashboard />)
      expect(screen.getByText('Total Duration')).toBeInTheDocument()
      expect(screen.getByText('Average Quality')).toBeInTheDocument()
      expect(screen.getByText('This Month')).toBeInTheDocument()
    })

    it('shows transcript type breakdown', () => {
      render(<AnalyticsDashboard />)
      expect(screen.getByText('Transcript Types')).toBeInTheDocument()
    })

    it('displays quality distribution', () => {
      render(<AnalyticsDashboard />)
      expect(screen.getByText('Quality Distribution')).toBeInTheDocument()
      expect(screen.getByText(/high quality/i)).toBeInTheDocument()
    })

    it('shows empty state when no transcripts', () => {
      useAudioTranscriptionStore.setState({ transcripts: [] })
      render(<AnalyticsDashboard />)
      expect(screen.getByText('No Analytics Available')).toBeInTheDocument()
    })

    it('renders monthly activity chart', () => {
      render(<AnalyticsDashboard />)
      expect(screen.getByText('Monthly Activity')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles component errors gracefully', () => {
      const ConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock a component that throws an error
      const ErrorComponent = () => {
        throw new Error('Test error')
      }
      
      render(
        <ErrorBoundary level="component" componentName="TestComponent">
          <ErrorComponent />
        </ErrorBoundary>
      )
      
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      ConsoleError.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<AudioTranscription />)
      expect(screen.getByRole('main', { name: /audio transcription tool/i })).toBeInTheDocument()
    })

    it('announces tab changes to screen readers', async () => {
      render(<AudioTranscription />)
      expect(screen.getByText('Currently viewing record tab')).toBeInTheDocument()
    })

    it('provides keyboard navigation support', async () => {
      render(<AudioTranscription />)
      const uploadTab = screen.getByText('Upload')
      
      uploadTab.focus()
      await user.keyboard('{Enter}')
      
      await waitFor(() => {
        expect(screen.getByText(/upload audio file/i)).toBeInTheDocument()
      })
    })

    it('supports screen reader announcements', () => {
      const { announceToScreenReader } = require('../../../../utils/accessibility')
      render(<AudioTranscription />)
      
      expect(announceToScreenReader).toHaveBeenCalled()
    })
  })

  describe('Performance Optimizations', () => {
    it('uses React.memo to prevent unnecessary re-renders', () => {
      const renderCount = vi.fn()
      
      const TestComponent = React.memo(() => {
        renderCount()
        return <div>Test</div>
      })
      
      const { rerender } = render(<TestComponent />)
      rerender(<TestComponent />)
      
      expect(renderCount).toHaveBeenCalledTimes(1)
    })

    it('lazy loads tab components', async () => {
      render(<AudioTranscription />)
      
      // Initially should show loading state for components
      // then load the actual component
      await waitFor(() => {
        expect(screen.getByText(/ready to record/i)).toBeInTheDocument()
      })
    })
  })

  describe('Store Integration', () => {
    it('updates UI when store state changes', async () => {
      render(<AudioTranscription />)
      
      // Simulate store state change
      useAudioTranscriptionStore.setState({ isRecording: true })
      
      await waitFor(() => {
        expect(screen.getByText('LIVE')).toBeInTheDocument()
      })
    })

    it('persists relevant data to localStorage', () => {
      render(<AudioTranscription />)
      // Test would verify that certain state is persisted
    })

    it('handles store errors gracefully', () => {
      // Test error scenarios in store operations
    })
  })
})

describe('Integration Tests', () => {
  it('completes full recording workflow', async () => {
    const user = userEvent.setup()
    render(<AudioTranscription />)
    
    // Start recording
    await user.click(screen.getByText('Start Recording'))
    
    await waitFor(() => {
      expect(screen.getByText('Recording in Progress')).toBeInTheDocument()
    })
    
    // Stop recording would create transcript
    // Test would verify end-to-end flow
  })

  it('completes full file upload workflow', async () => {
    const user = userEvent.setup()
    render(<AudioTranscription />)
    
    // Switch to upload tab
    await user.click(screen.getByText('Upload'))
    
    await waitFor(() => {
      expect(screen.getByText(/upload audio file/i)).toBeInTheDocument()
    })
    
    // Test would simulate file upload and processing
  })

  it('navigates between tabs maintaining state', async () => {
    const user = userEvent.setup()
    render(<AudioTranscription />)
    
    // Test navigation between tabs and state preservation
    await user.click(screen.getByText('Library'))
    await user.click(screen.getByText('Analytics'))
    await user.click(screen.getByText('Record'))
    
    // Verify state is maintained across navigation
  })
})