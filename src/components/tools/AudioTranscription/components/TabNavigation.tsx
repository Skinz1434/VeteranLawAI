/**
 * @fileoverview Tab Navigation - Navigation component for AudioTranscription tabs
 * @author QBit-Claude Refactor Agent
 * @version 1.0.0
 */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import {
  Mic,
  Upload,
  FileText,
  BarChart3,
  Radio,
  Clock,
  Database
} from 'lucide-react'
import { 
  useUIState, 
  useUIActions,
  useTranscriptionState,
  useRecordingState
} from '../../../../stores/audioTranscriptionStore'

interface TabNavigationProps {
  className?: string
}

const TABS = [
  {
    id: 'record' as const,
    label: 'Record',
    icon: Mic,
    description: 'Live audio recording with real-time transcription'
  },
  {
    id: 'upload' as const,
    label: 'Upload',
    icon: Upload,
    description: 'Upload and process audio files'
  },
  {
    id: 'transcripts' as const,
    label: 'Library',
    icon: FileText,
    description: 'Browse and manage transcript collection'
  },
  {
    id: 'analytics' as const,
    label: 'Analytics',
    icon: BarChart3,
    description: 'View usage statistics and insights'
  }
]

const TabNavigation: React.FC<TabNavigationProps> = ({ className = '' }) => {
  const { activeTab } = useUIState()
  const { setActiveTab } = useUIActions()
  const { isRecording } = useRecordingState()
  const { transcripts, isTranscribing } = useTranscriptionState()

  const getTabStatus = (tabId: string) => {
    switch (tabId) {
      case 'record':
        return isRecording ? 'active' : 'idle'
      case 'upload':
        return isTranscribing ? 'processing' : 'idle'
      case 'transcripts':
        return transcripts.length > 0 ? 'available' : 'empty'
      case 'analytics':
        return transcripts.length >= 3 ? 'available' : 'limited'
      default:
        return 'idle'
    }
  }

  const getTabBadge = (tabId: string) => {
    switch (tabId) {
      case 'transcripts':
        return transcripts.length > 0 ? transcripts.length : null
      case 'record':
        return isRecording ? 'REC' : null
      case 'upload':
        return isTranscribing ? 'PROCESSING' : null
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-red-500'
      case 'processing':
        return 'text-blue-500'
      case 'available':
        return 'text-green-500'
      case 'limited':
        return 'text-yellow-500'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="flex items-center space-x-1 p-1">
        {TABS.map((tab) => {
          const TabIcon = tab.icon
          const isActive = activeTab === tab.id
          const status = getTabStatus(tab.id)
          const badge = getTabBadge(tab.id)
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-gray-50 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title={tab.description}
            >
              {/* Active tab background */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-50 border border-blue-200 rounded-lg"
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Tab content */}
              <div className="relative flex items-center space-x-2">
                <div className="relative">
                  <TabIcon className={`w-4 h-4 ${
                    isActive ? 'text-blue-600' : getStatusColor(status)
                  }`} />
                  
                  {/* Status indicator */}
                  {status === 'active' && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                    />
                  )}
                  
                  {status === 'processing' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </div>

                <span className="font-medium">{tab.label}</span>

                {/* Badge */}
                {badge && (
                  <div className={`flex items-center justify-center min-w-5 h-5 text-xs font-medium rounded-full px-1.5 ${
                    typeof badge === 'number'
                      ? 'bg-gray-100 text-gray-700'
                      : badge === 'REC'
                      ? 'bg-red-100 text-red-700 animate-pulse'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {badge}
                  </div>
                )}
              </div>
            </button>
          )
        })}

        {/* Live status indicators */}
        <div className="flex items-center space-x-4 ml-auto">
          {isRecording && (
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex items-center space-x-2 text-red-600"
            >
              <Radio className="w-4 h-4" />
              <span className="text-sm font-medium">LIVE</span>
            </motion.div>
          )}

          {isTranscribing && (
            <div className="flex items-center space-x-2 text-blue-600">
              <Clock className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">PROCESSING</span>
            </div>
          )}

          {transcripts.length > 0 && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Database className="w-4 h-4" />
              <span className="text-sm font-medium">
                {transcripts.length} transcript{transcripts.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(TabNavigation)