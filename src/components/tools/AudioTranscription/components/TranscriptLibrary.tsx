/**
 * @fileoverview Transcript Library - Displays and manages transcript collection
 * @author QBit-Claude Refactor Agent
 * @version 1.0.0
 */

import React, { memo, useMemo, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Clock,
  User,
  FileText,
  Download,
  Copy,
  Trash2,
  Eye,
  Calendar,
  Zap,
  Star,
  BarChart3,
  Archive,
  Tag
} from 'lucide-react'
import Button from '../../../ui/Button'
import Card from '../../../ui/Card'
import Input from '../../../ui/Input'
import Modal from '../../../ui/Modal'
import { 
  useUIState, 
  useUIActions, 
  useTranscriptionState,
  type Transcript 
} from '../../../../stores/audioTranscriptionStore'
import { useTranscription } from '../../../../hooks/useTranscription'
import TranscriptCard from './TranscriptCard'
import TranscriptViewer from './TranscriptViewer'

interface TranscriptLibraryProps {
  className?: string
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Transcripts', icon: FileText },
  { value: 'cp_exam', label: 'C&P Exams', icon: Star },
  { value: 'deposition', label: 'Depositions', icon: Scale },
  { value: 'hearing', label: 'Hearings', icon: BarChart3 },
  { value: 'consultation', label: 'Consultations', icon: User },
  { value: 'other', label: 'Other', icon: Archive }
]

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Newest First' },
  { value: 'date_asc', label: 'Oldest First' },
  { value: 'title_asc', label: 'Title A-Z' },
  { value: 'title_desc', label: 'Title Z-A' },
  { value: 'duration_desc', label: 'Longest First' },
  { value: 'confidence_desc', label: 'Highest Quality First' }
]

const TranscriptLibrary: React.FC<TranscriptLibraryProps> = ({ className = '' }) => {
  const { searchQuery, filterType, showPreview } = useUIState()
  const { setSearchQuery, setFilterType, setShowPreview } = useUIActions()
  const { selectedTranscript } = useTranscriptionState()
  const { 
    filteredTranscripts,
    searchTranscripts, 
    deleteTranscript,
    exportTranscript,
    copyTranscriptToClipboard,
    selectTranscript
  } = useTranscription(searchQuery, filterType)
  
  const [sortBy, setSortBy] = useState('date_desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Memoized sorted and filtered transcripts
  const sortedTranscripts = useMemo(() => {
    const sorted = [...filteredTranscripts]
    
    switch (sortBy) {
      case 'date_desc':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      case 'date_asc':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      case 'title_asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case 'title_desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title))
      case 'duration_desc':
        return sorted.sort((a, b) => {
          const getDurationSeconds = (duration: string) => {
            const parts = duration.split(':')
            return parts.length === 3 
              ? parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
              : parseInt(parts[0]) * 60 + parseInt(parts[1] || '0')
          }
          return getDurationSeconds(b.duration) - getDurationSeconds(a.duration)
        })
      case 'confidence_desc':
        return sorted.sort((a, b) => b.confidence - a.confidence)
      default:
        return sorted
    }
  }, [filteredTranscripts, sortBy])

  // Handle search input
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
  }, [setSearchQuery])

  // Handle filter change
  const handleFilterChange = useCallback((filter: string) => {
    setFilterType(filter as any)
  }, [setFilterType])

  // Handle transcript actions
  const handleViewTranscript = useCallback((transcript: Transcript) => {
    selectTranscript(transcript)
    setShowPreview(true)
  }, [selectTranscript, setShowPreview])

  const handleExportTranscript = useCallback(async (transcript: Transcript, format: string) => {
    try {
      await exportTranscript(transcript, format)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }, [exportTranscript])

  const handleCopyTranscript = useCallback(async (transcript: Transcript) => {
    try {
      await copyTranscriptToClipboard(transcript)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }, [copyTranscriptToClipboard])

  const handleDeleteTranscript = useCallback((transcriptId: string) => {
    if (confirm('Are you sure you want to delete this transcript? This action cannot be undone.')) {
      deleteTranscript(transcriptId)
    }
  }, [deleteTranscript])

  // Get statistics
  const stats = useMemo(() => {
    const total = filteredTranscripts.length
    const byType = filteredTranscripts.reduce((acc, transcript) => {
      acc[transcript.type] = (acc[transcript.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const avgConfidence = total > 0 
      ? filteredTranscripts.reduce((sum, t) => sum + t.confidence, 0) / total
      : 0

    return { total, byType, avgConfidence }
  }, [filteredTranscripts])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transcript Library</h2>
          <p className="text-gray-600 mt-1">
            {stats.total} transcript{stats.total !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              onClick={() => setViewMode('grid')}
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              className="px-3"
            >
              Grid
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              className="px-3"
            >
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search transcripts..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select
              value={filterType}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {FILTER_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Statistics Cards */}
      {stats.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transcripts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Quality</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(stats.avgConfidence * 100)}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">C&P Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.byType.cp_exam || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Hearings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.byType.hearing || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Transcripts Grid/List */}
      <AnimatePresence mode="wait">
        {sortedTranscripts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No transcripts found
              </h3>
              <p className="text-gray-500">
                {searchQuery || filterType !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Upload an audio file or start recording to create your first transcript'
                }
              </p>
              {(searchQuery || filterType !== 'all') && (
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setFilterType('all')
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="transcripts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {sortedTranscripts.map((transcript, index) => (
              <motion.div
                key={transcript.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TranscriptCard
                  transcript={transcript}
                  viewMode={viewMode}
                  onView={() => handleViewTranscript(transcript)}
                  onExport={(format) => handleExportTranscript(transcript, format)}
                  onCopy={() => handleCopyTranscript(transcript)}
                  onDelete={() => handleDeleteTranscript(transcript.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript Viewer Modal */}
      <TranscriptViewer
        isOpen={showPreview}
        transcript={selectedTranscript}
        onClose={() => setShowPreview(false)}
        onExport={handleExportTranscript}
        onCopy={handleCopyTranscript}
      />
    </div>
  )
}

export default memo(TranscriptLibrary)