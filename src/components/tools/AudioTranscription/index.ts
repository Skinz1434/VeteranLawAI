/**
 * @fileoverview Audio Transcription - Export refactored component architecture
 * @author QBit-Claude Refactor Agent
 * @version 2.0.0
 */

// Export the refactored component as the main export
export { default } from './AudioTranscriptionRefactored'

// Export individual components for use elsewhere if needed
export { default as AudioRecordingStudio } from './components/AudioRecordingStudio'
export { default as FileUploadManager } from './components/FileUploadManager' 
export { default as TranscriptLibrary } from './components/TranscriptLibrary'
export { default as AnalyticsDashboard } from './components/AnalyticsDashboard'
export { default as WaveformVisualizer } from './components/WaveformVisualizer'
export { default as TranscriptCard } from './components/TranscriptCard'
export { default as TranscriptViewer } from './components/TranscriptViewer'
export { default as TabNavigation } from './components/TabNavigation'

// Export hooks and store for advanced usage
export { useAudioRecording } from '../../hooks/useAudioRecording'
export { useTranscription } from '../../hooks/useTranscription'
export { 
  useAudioTranscriptionStore,
  useRecordingState,
  useTranscriptionState,
  usePlaybackState,
  useConfigurationState,
  useUIState,
  useRecordingActions,
  useTranscriptionActions,
  usePlaybackActions,
  useConfigurationActions,
  useUIActions,
  type Transcript,
  type ServiceInfo
} from '../../stores/audioTranscriptionStore'

// Export component types
export type { UseAudioRecordingReturn } from '../../hooks/useAudioRecording'
export type { UseTranscriptionReturn } from '../../hooks/useTranscription'