/**
 * @fileoverview Audio Recording Studio - Real-time recording interface with waveform visualization
 * @author QBit-Claude Refactor Agent
 * @version 1.0.0
 */

import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  Square,
  Volume2,
  VolumeX,
  Clock,
  User,
  Activity,
  Headphones,
  Radio,
  Zap
} from 'lucide-react'
import Button from '../../../ui/Button'
import Card from '../../../ui/Card'
import { useAudioRecording } from '../../../../hooks/useAudioRecording'
import { useConfigurationState } from '../../../../stores/audioTranscriptionStore'
import WaveformVisualizer from './WaveformVisualizer'

interface AudioRecordingStudioProps {
  className?: string
}

const AudioRecordingStudio: React.FC<AudioRecordingStudioProps> = ({ className = '' }) => {
  const {
    isRecording,
    recordingTime,
    audioLevel,
    realTimeTranscript,
    interimTranscript,
    currentSpeaker,
    startRecording,
    stopRecording,
    toggleRecording,
    formatRecordingTime
  } = useAudioRecording()

  const { qualitySettings, speakerCount } = useConfigurationState()

  const handleStartRecording = async () => {
    try {
      await startRecording()
    } catch (error) {
      console.error('Failed to start recording:', error)
      // Error handling is managed in the hook
    }
  }

  const getQualityLabel = (quality: string) => {
    const labels = {
      low: 'Low (16kHz)',
      medium: 'Medium (22kHz)', 
      high: 'High (44kHz)',
      ultra: 'Ultra (48kHz)'
    }
    return labels[quality as keyof typeof labels] || 'High (44kHz)'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Recording Interface */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="text-center space-y-4">
          {/* Recording Status Header */}
          <div className="flex items-center justify-center space-x-3">
            <motion.div
              animate={isRecording ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
            >
              {isRecording ? (
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
              ) : (
                <div className="w-4 h-4 bg-gray-300 rounded-full" />
              )}
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-800">
              {isRecording ? 'Recording in Progress' : 'Ready to Record'}
            </h3>
          </div>

          {/* Recording Timer */}
          <div className="flex items-center justify-center space-x-2 text-2xl font-mono">
            <Clock className="w-6 h-6 text-blue-600" />
            <span className={isRecording ? 'text-red-600' : 'text-gray-600'}>
              {formatRecordingTime(recordingTime)}
            </span>
          </div>

          {/* Waveform Visualization */}
          <div className="h-24 bg-gray-900 rounded-lg overflow-hidden">
            <WaveformVisualizer 
              audioLevel={audioLevel}
              isActive={isRecording}
              className="w-full h-full"
            />
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={handleStartRecording}
              disabled={isRecording}
              variant={isRecording ? 'secondary' : 'primary'}
              size="lg"
              className="flex items-center space-x-2 px-6 py-3"
            >
              <Mic className="w-5 h-5" />
              <span>{isRecording ? 'Recording...' : 'Start Recording'}</span>
            </Button>

            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    size="lg"
                    className="flex items-center space-x-2 px-6 py-3"
                  >
                    <Square className="w-5 h-5" />
                    <span>Stop</span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>

      {/* Recording Status Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Audio Level */}
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              {audioLevel > 0.1 ? (
                <Volume2 className="w-5 h-5 text-green-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Audio Level</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-green-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${audioLevel * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {Math.round(audioLevel * 100)}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Current Speaker */}
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Current Speaker</p>
              <p className="text-lg font-semibold text-gray-900">{currentSpeaker}</p>
            </div>
          </div>
        </Card>

        {/* Quality Settings */}
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Headphones className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Quality</p>
              <p className="text-lg font-semibold text-gray-900">
                {getQualityLabel(qualitySettings)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Real-time Transcript Display */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-green-600" />
          <h4 className="text-lg font-semibold text-gray-800">Live Transcript</h4>
          {isRecording && (
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex items-center space-x-1"
            >
              <Radio className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">LIVE</span>
            </motion.div>
          )}
        </div>

        <div className="space-y-3">
          {/* Real-time transcript */}
          {realTimeTranscript && (
            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
              <p className="text-gray-800 leading-relaxed">{realTimeTranscript}</p>
            </div>
          )}

          {/* Interim transcript (what's currently being processed) */}
          {interimTranscript && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">Processing...</span>
              </div>
              <p className="text-gray-700 italic">{interimTranscript}</p>
            </motion.div>
          )}

          {/* Empty state */}
          {!realTimeTranscript && !interimTranscript && (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {isRecording 
                  ? 'Listening... Start speaking to see live transcript' 
                  : 'Click "Start Recording" to begin live transcription'
                }
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Technical Information */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Expected Speakers:</span>
                <span className="ml-2 text-gray-900">{speakerCount}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Sample Rate:</span>
                <span className="ml-2 text-gray-900">
                  {qualitySettings === 'ultra' ? '48kHz' : '44.1kHz'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Channels:</span>
                <span className="ml-2 text-gray-900">Stereo</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Format:</span>
                <span className="ml-2 text-gray-900">WebM/MP4</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

// Export memoized component to prevent unnecessary re-renders
export default memo(AudioRecordingStudio)