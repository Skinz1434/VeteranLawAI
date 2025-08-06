/**
 * @fileoverview Transcript Viewer - Modal for viewing full transcript details
 * @author QBit-Claude Refactor Agent
 * @version 1.0.0
 */

import React, { memo, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Download,
  Copy,
  Search,
  Calendar,
  Clock,
  Users,
  Zap,
  Star,
  Scale,
  BarChart3,
  User,
  Archive,
  FileText,
  BookOpen,
  Target,
  CheckCircle,
  Maximize2,
  Minimize2,
  Volume2,
  Play,
  Pause
} from 'lucide-react'
import Button from '../../../ui/Button'
import Input from '../../../ui/Input'
import { type Transcript } from '../../../../stores/audioTranscriptionStore'

interface TranscriptViewerProps {
  isOpen: boolean
  transcript: Transcript | null
  onClose: () => void
  onExport: (transcript: Transcript, format: string) => void
  onCopy: (transcript: Transcript) => void
}

const TRANSCRIPT_TYPE_CONFIG = {
  cp_exam: { label: 'C&P Exam', icon: Star, color: 'text-yellow-600' },
  deposition: { label: 'Deposition', icon: Scale, color: 'text-purple-600' },
  hearing: { label: 'Hearing', icon: BarChart3, color: 'text-blue-600' },
  consultation: { label: 'Consultation', icon: User, color: 'text-green-600' },
  other: { label: 'Other', icon: Archive, color: 'text-gray-600' }
}

const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  isOpen,
  transcript,
  onClose,
  onExport,
  onCopy
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'transcript' | 'summary' | 'findings'>('transcript')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Highlight search terms in transcript
  const highlightedTranscript = useMemo(() => {
    if (!transcript || !searchTerm.trim()) return transcript?.transcript || ''

    const regex = new RegExp(`(${searchTerm.trim()})`, 'gi')
    return transcript.transcript.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
  }, [transcript?.transcript, searchTerm])

  // Count search matches
  const searchMatches = useMemo(() => {
    if (!transcript || !searchTerm.trim()) return 0
    const regex = new RegExp(searchTerm.trim(), 'gi')
    return (transcript.transcript.match(regex) || []).length
  }, [transcript?.transcript, searchTerm])

  if (!transcript) return null

  const typeConfig = TRANSCRIPT_TYPE_CONFIG[transcript.type]
  const TypeIcon = typeConfig.icon

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600'
    if (confidence >= 0.75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleExport = (format: string) => {
    onExport(transcript, format)
  }

  const handleCopy = () => {
    onCopy(transcript)
  }

  const handlePlayAudio = () => {
    if (transcript.audioUrl) {
      // This would integrate with audio playback functionality
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black bg-opacity-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative h-full flex items-center justify-center p-4 ${
              isFullscreen ? '' : 'max-w-6xl mx-auto'
            }`}
          >
            <div className={`bg-white rounded-lg shadow-2xl ${
              isFullscreen 
                ? 'w-full h-full max-h-screen' 
                : 'w-full max-w-4xl max-h-[90vh]'
            } flex flex-col overflow-hidden`}>
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <TypeIcon className={`w-6 h-6 ${typeConfig.color}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {transcript.title}
                    </h2>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(transcript.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{transcript.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span className={getConfidenceColor(transcript.confidence)}>
                          {Math.round(transcript.confidence * 100)}% Quality
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Audio playback (if available) */}
                  {transcript.audioUrl && (
                    <Button
                      onClick={handlePlayAudio}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Export dropdown */}
                  <div className="relative group">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <button
                        onClick={() => handleExport('txt')}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-t-md"
                      >
                        Text File (.txt)
                      </button>
                      <button
                        onClick={() => handleExport('docx')}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        Word Document (.docx)
                      </button>
                      <button
                        onClick={() => handleExport('json')}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        JSON Data (.json)
                      </button>
                      <button
                        onClick={() => handleExport('srt')}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-b-md"
                      >
                        Subtitles (.srt)
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>

                  <Button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    variant="outline"
                    size="sm"
                    className="p-2"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>

                  <Button
                    onClick={onClose}
                    variant="outline"
                    size="sm"
                    className="p-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center space-x-1 p-4 border-b border-gray-200 bg-gray-50">
                <Button
                  onClick={() => setActiveTab('transcript')}
                  variant={activeTab === 'transcript' ? 'primary' : 'ghost'}
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <FileText className="w-4 h-4" />
                  <span>Transcript</span>
                </Button>
                <Button
                  onClick={() => setActiveTab('summary')}
                  variant={activeTab === 'summary' ? 'primary' : 'ghost'}
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Summary</span>
                </Button>
                <Button
                  onClick={() => setActiveTab('findings')}
                  variant={activeTab === 'findings' ? 'primary' : 'ghost'}
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Target className="w-4 h-4" />
                  <span>Key Findings ({transcript.keyFindings.length})</span>
                </Button>

                {/* Search (only show on transcript tab) */}
                {activeTab === 'transcript' && (
                  <div className="flex-1 max-w-md ml-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search transcript..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 text-sm"
                      />
                      {searchMatches > 0 && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                          {searchMatches} match{searchMatches !== 1 ? 'es' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeTab === 'transcript' && (
                    <motion.div
                      key="transcript"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full overflow-y-auto p-6"
                    >
                      <div className="prose max-w-none">
                        <div
                          className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{
                            __html: highlightedTranscript
                          }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'summary' && (
                    <motion.div
                      key="summary"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full overflow-y-auto p-6 space-y-6"
                    >
                      {/* Metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Users className="w-4 h-4 text-gray-600" />
                            <span className="font-medium text-gray-800">Speakers</span>
                          </div>
                          <ul className="space-y-1">
                            {transcript.speakers.map((speaker, index) => (
                              <li key={index} className="text-sm text-gray-600">
                                {speaker}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-gray-600" />
                            <span className="font-medium text-gray-800">Status</span>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transcript.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : transcript.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transcript.status}
                          </span>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Archive className="w-4 h-4 text-gray-600" />
                            <span className="font-medium text-gray-800">Type</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {typeConfig.label}
                          </span>
                        </div>
                      </div>

                      {/* Summary */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-800 leading-relaxed">
                            {transcript.summary}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'findings' && (
                    <motion.div
                      key="findings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full overflow-y-auto p-6"
                    >
                      {transcript.keyFindings.length > 0 ? (
                        <div className="space-y-3">
                          {transcript.keyFindings.map((finding, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500"
                            >
                              <div className="flex items-start space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </span>
                                <p className="text-gray-800 leading-relaxed">
                                  {finding}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No key findings identified in this transcript.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default memo(TranscriptViewer)