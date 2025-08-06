/**
 * @fileoverview Transcript Card - Individual transcript display component
 * @author QBit-Claude Refactor Agent
 * @version 1.0.0
 */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import {
  Clock,
  User,
  Star,
  Scale,
  BarChart3,
  Archive,
  FileText,
  Eye,
  Download,
  Copy,
  Trash2,
  Calendar,
  Zap,
  Users,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react'
import Button from '../../../ui/Button'
import Card from '../../../ui/Card'
import { type Transcript } from '../../../../stores/audioTranscriptionStore'

interface TranscriptCardProps {
  transcript: Transcript
  viewMode: 'grid' | 'list'
  onView: () => void
  onExport: (format: string) => void
  onCopy: () => void
  onDelete: () => void
}

const TRANSCRIPT_TYPE_CONFIG = {
  cp_exam: {
    label: 'C&P Exam',
    icon: Star,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    tagColor: 'bg-yellow-100 text-yellow-800'
  },
  deposition: {
    label: 'Deposition',
    icon: Scale,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
    tagColor: 'bg-purple-100 text-purple-800'
  },
  hearing: {
    label: 'Hearing',
    icon: BarChart3,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    tagColor: 'bg-blue-100 text-blue-800'
  },
  consultation: {
    label: 'Consultation',
    icon: User,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    tagColor: 'bg-green-100 text-green-800'
  },
  other: {
    label: 'Other',
    icon: Archive,
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    iconColor: 'text-gray-600',
    tagColor: 'bg-gray-100 text-gray-800'
  }
}

const TranscriptCard: React.FC<TranscriptCardProps> = ({
  transcript,
  viewMode,
  onView,
  onExport,
  onCopy,
  onDelete
}) => {
  const typeConfig = TRANSCRIPT_TYPE_CONFIG[transcript.type]
  const TypeIcon = typeConfig.icon

  const getStatusIcon = () => {
    switch (transcript.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'processing':
        return <Loader className="w-4 h-4 text-blue-600 animate-spin" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100'
    if (confidence >= 0.75) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (viewMode === 'list') {
    // List view layout
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`p-4 hover:shadow-md transition-shadow ${typeConfig.bgColor} ${typeConfig.borderColor}`}>
          <div className="flex items-center justify-between">
            {/* Left section - Main info */}
            <div className="flex items-center space-x-4 flex-1">
              <div className={`p-2 rounded-lg ${typeConfig.bgColor}`}>
                <TypeIcon className={`w-5 h-5 ${typeConfig.iconColor}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {transcript.title}
                  </h3>
                  {getStatusIcon()}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.tagColor}`}>
                    {typeConfig.label}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(transcript.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{transcript.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{transcript.speakers.length} speaker{transcript.speakers.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3" />
                    <span className={`px-1 py-0.5 rounded text-xs ${getConfidenceColor(transcript.confidence)}`}>
                      {Math.round(transcript.confidence * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {truncateText(transcript.summary, 120)}
                </p>
              </div>
            </div>

            {/* Right section - Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <Button
                onClick={onView}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </Button>
              
              <div className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </Button>
                <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button
                    onClick={() => onExport('txt')}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    Text (.txt)
                  </button>
                  <button
                    onClick={() => onExport('docx')}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    Word (.docx)
                  </button>
                  <button
                    onClick={() => onExport('json')}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    JSON (.json)
                  </button>
                </div>
              </div>

              <Button
                onClick={onCopy}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Copy className="w-4 h-4" />
              </Button>

              <Button
                onClick={onDelete}
                variant="outline"
                size="sm"
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  // Grid view layout
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`p-6 hover:shadow-lg transition-shadow ${typeConfig.bgColor} ${typeConfig.borderColor} h-full`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2 rounded-lg ${typeConfig.bgColor}`}>
            <TypeIcon className={`w-6 h-6 ${typeConfig.iconColor}`} />
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.tagColor}`}>
              {typeConfig.label}
            </span>
          </div>
        </div>

        {/* Title and Summary */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {transcript.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            {transcript.summary}
          </p>
        </div>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(transcript.date)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-3 h-3" />
            <span>{transcript.duration}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-3 h-3" />
            <span>{transcript.speakers.length} speaker{transcript.speakers.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Zap className="w-3 h-3 text-gray-600" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(transcript.confidence)}`}>
              {Math.round(transcript.confidence * 100)}% Quality
            </span>
          </div>
        </div>

        {/* Key Findings Preview */}
        {transcript.keyFindings.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Key Findings:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              {transcript.keyFindings.slice(0, 2).map((finding, index) => (
                <li key={index} className="flex items-start space-x-1">
                  <span className="text-gray-400 mt-1">•</span>
                  <span className="line-clamp-2">{finding}</span>
                </li>
              ))}
              {transcript.keyFindings.length > 2 && (
                <li className="text-gray-400 italic">
                  +{transcript.keyFindings.length - 2} more findings...
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Button
            onClick={onView}
            variant="primary"
            size="sm"
            className="flex items-center space-x-1 flex-1 mr-2"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </Button>

          <div className="flex items-center space-x-1">
            <div className="relative group">
              <Button
                variant="outline"
                size="sm"
                className="p-2"
              >
                <Download className="w-4 h-4" />
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => onExport('txt')}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-t-md"
                >
                  Text (.txt)
                </button>
                <button
                  onClick={() => onExport('docx')}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Word (.docx)
                </button>
                <button
                  onClick={() => onExport('json')}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-b-md"
                >
                  JSON (.json)
                </button>
              </div>
            </div>

            <Button
              onClick={onCopy}
              variant="outline"
              size="sm"
              className="p-2"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </Button>

            <Button
              onClick={onDelete}
              variant="outline"
              size="sm"
              className="p-2 text-red-600 hover:text-red-700 hover:border-red-300"
              title="Delete transcript"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default memo(TranscriptCard)