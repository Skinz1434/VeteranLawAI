/**
 * @fileoverview Audio Transcription - Refactored modular component with modern architecture
 * @author QBit-Claude Refactor Agent
 * @version 2.0.0 (Refactored from 1,352-line monolithic component)
 * 
 * ARCHITECTURAL IMPROVEMENTS:
 * - Broken down from 1 massive component into 10+ focused components
 * - Reduced from 25+ useState to centralized Zustand store
 * - Separated concerns: UI, business logic, state management
 * - Added TypeScript support with comprehensive types
 * - Implemented performance optimizations (React.memo, selective subscriptions)
 * - Modern error handling with ErrorBoundary system
 * - Accessibility improvements throughout
 */

import React, { memo, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  useUIState, 
  useConfigurationActions,
  useConfigurationState
} from '../../../stores/audioTranscriptionStore'
import { 
  initializeSpeechService, 
  getSpeechServiceInfo 
} from '../../../services/speechToTextService'
import { announceToScreenReader } from '../../../utils/accessibility'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'

// Lazy load components for better performance
const TabNavigation = React.lazy(() => import('./components/TabNavigation'))
const AudioRecordingStudio = React.lazy(() => import('./components/AudioRecordingStudio'))
const FileUploadManager = React.lazy(() => import('./components/FileUploadManager'))
const TranscriptLibrary = React.lazy(() => import('./components/TranscriptLibrary'))
const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard'))

interface AudioTranscriptionProps {
  className?: string
}

// Loading component
const TabContentLoader: React.FC = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

/**
 * AudioTranscription - Main container component
 * 
 * This refactored component replaces the original 1,352-line monolithic component
 * with a modular, maintainable architecture that separates concerns and improves performance.
 */
const AudioTranscription: React.FC<AudioTranscriptionProps> = ({ className = '' }) => {
  const { activeTab } = useUIState()
  const { qualitySettings, languageModel } = useConfigurationState()
  const { setServiceInfo } = useConfigurationActions()

  // Initialize speech service on mount and when configuration changes
  useEffect(() => {
    const initializeService = async () => {
      try {
        const result = await initializeSpeechService({
          continuous: true,
          interimResults: true,
          language: 'en-US',
          quality: qualitySettings
        })
        
        const info = getSpeechServiceInfo()
        setServiceInfo(info)
        
        if (result.success) {
          announceToScreenReader(`Speech-to-text service initialized using ${result.provider}`)
        }
      } catch (error) {
        console.error('Failed to initialize speech service:', error)
        announceToScreenReader('Speech service initialization failed. Some features may be limited.')
      }
    }
    
    initializeService()
  }, [qualitySettings, languageModel, setServiceInfo])

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'record':
        return (
          <ErrorBoundary level="component" componentName="AudioRecordingStudio">
            <Suspense fallback={<TabContentLoader />}>
              <AudioRecordingStudio />
            </Suspense>
          </ErrorBoundary>
        )
      
      case 'upload':
        return (
          <ErrorBoundary level="component" componentName="FileUploadManager">
            <Suspense fallback={<TabContentLoader />}>
              <FileUploadManager />
            </Suspense>
          </ErrorBoundary>
        )
      
      case 'transcripts':
        return (
          <ErrorBoundary level="component" componentName="TranscriptLibrary">
            <Suspense fallback={<TabContentLoader />}>
              <TranscriptLibrary />
            </Suspense>
          </ErrorBoundary>
        )
      
      case 'analytics':
        return (
          <ErrorBoundary level="component" componentName="AnalyticsDashboard">
            <Suspense fallback={<TabContentLoader />}>
              <AnalyticsDashboard />
            </Suspense>
          </ErrorBoundary>
        )
      
      default:
        return <div className="p-8 text-center text-gray-500">Invalid tab selected</div>
    }
  }

  return (
    <ErrorBoundary level="page" componentName="AudioTranscription">
      <div 
        className={`min-h-screen bg-gray-50 ${className}`}
        role="main"
        aria-label="Audio Transcription Tool"
      >
        {/* Tab Navigation */}
        <ErrorBoundary level="component" componentName="TabNavigation">
          <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200 animate-pulse" />}>
            <TabNavigation />
          </Suspense>
        </ErrorBoundary>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
              className="w-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Accessibility announcements for tab changes */}
        <div 
          aria-live="polite" 
          aria-atomic="true" 
          className="sr-only"
          id="tab-announcement"
        >
          {`Currently viewing ${activeTab} tab`}
        </div>
      </div>
    </ErrorBoundary>
  )
}

// Export memoized component to prevent unnecessary re-renders
export default memo(AudioTranscription)