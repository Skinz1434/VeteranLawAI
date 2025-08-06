/**
 * @fileoverview File Upload Manager - Handles audio file uploads with drag & drop
 * @author QBit-Claude Refactor Agent
 * @version 1.0.0
 */

import React, { memo, useCallback, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileAudio,
  AlertCircle,
  CheckCircle,
  Loader,
  X,
  File,
  Clock,
  HardDrive
} from 'lucide-react'
import Button from '../../../ui/Button'
import Card from '../../../ui/Card'
import { useTranscription } from '../../../../hooks/useTranscription'
import { useTranscriptionState } from '../../../../stores/audioTranscriptionStore'

interface FileUploadManagerProps {
  className?: string
  onUploadComplete?: (success: boolean) => void
}

interface FileValidationResult {
  isValid: boolean
  error?: string
  warnings?: string[]
}

const SUPPORTED_FORMATS = [
  'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/wave', 
  'audio/ogg', 'audio/webm', 'audio/m4a', 'audio/aac', 'audio/flac'
]

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const RECOMMENDED_MAX_DURATION = 3600 // 1 hour in seconds

const FileUploadManager: React.FC<FileUploadManagerProps> = ({ 
  className = '', 
  onUploadComplete 
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { processAudioFile } = useTranscription()
  const { isTranscribing, transcriptionProgress } = useTranscriptionState()

  // File validation
  const validateFile = useCallback((file: File): FileValidationResult => {
    const result: FileValidationResult = { isValid: true, warnings: [] }

    // Check file type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      result.isValid = false
      result.error = `Unsupported file format: ${file.type}. Supported formats: MP3, WAV, OGG, WebM, M4A, AAC, FLAC`
      return result
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      result.isValid = false
      result.error = `File size (${formatFileSize(file.size)}) exceeds maximum allowed size of ${formatFileSize(MAX_FILE_SIZE)}`
      return result
    }

    // Add warnings for large files
    if (file.size > MAX_FILE_SIZE * 0.7) {
      result.warnings?.push(`Large file detected (${formatFileSize(file.size)}). Processing may take longer.`)
    }

    // Estimate duration and warn if very long
    const estimatedDuration = estimateAudioDuration(file)
    if (estimatedDuration > RECOMMENDED_MAX_DURATION) {
      result.warnings?.push(`Long audio file detected (~${Math.round(estimatedDuration / 60)} minutes). Consider splitting into smaller segments for better accuracy.`)
    }

    return result
  }, [])

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const validation = validateFile(file)

    if (!validation.isValid) {
      setUploadError(validation.error || 'Invalid file')
      setSelectedFile(null)
      return
    }

    setUploadError(null)
    setSelectedFile(file)

    // Show warnings if any
    if (validation.warnings && validation.warnings.length > 0) {
      console.warn('File upload warnings:', validation.warnings)
    }
  }, [validateFile])

  // Handle file upload and processing
  const handleUpload = useCallback(async () => {
    if (!selectedFile) return

    try {
      await processAudioFile(selectedFile)
      setSelectedFile(null)
      onUploadComplete?.(true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadError(errorMessage)
      onUploadComplete?.(false)
    }
  }, [selectedFile, processAudioFile, onUploadComplete])

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  // File input click handler
  const handleFileInputClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedFile(null)
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  // Helper functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const estimateAudioDuration = (file: File): number => {
    // Rough estimation based on file size and format
    const avgBitrate = file.type.includes('mp3') ? 128000 : 256000 // bits per second
    return (file.size * 8) / avgBitrate
  }

  const getFileIcon = (file: File) => {
    if (file.type.includes('mp3') || file.type.includes('mpeg')) return '🎵'
    if (file.type.includes('wav')) return '🌊'
    if (file.type.includes('ogg')) return '🎼'
    return '🎵'
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className={`relative transition-all duration-200 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50 shadow-lg' 
            : selectedFile 
              ? 'border-green-500 bg-green-50'
              : 'border-dashed border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <AnimatePresence mode="wait">
            {isTranscribing ? (
              // Processing State
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <Loader className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
                <div>
                  <p className="text-lg font-semibold text-blue-700">
                    Processing Audio File...
                  </p>
                  <p className="text-gray-600 mt-1">
                    This may take several minutes depending on file size
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="bg-blue-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${transcriptionProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {transcriptionProgress}% complete
                </p>
              </motion.div>
            ) : selectedFile ? (
              // File Selected State
              <motion.div
                key="selected"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <span className="text-2xl">{getFileIcon(selectedFile)}</span>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedFile.name}
                  </p>
                  <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <HardDrive className="w-4 h-4" />
                      <span>{formatFileSize(selectedFile.size)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>~{Math.round(estimateAudioDuration(selectedFile) / 60)} min</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Button onClick={handleUpload} variant="primary" size="lg">
                    <Upload className="w-4 h-4 mr-2" />
                    Start Transcription
                  </Button>
                  <Button onClick={clearSelection} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </motion.div>
            ) : (
              // Upload State
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FileAudio className="w-16 h-16 text-gray-400" />
                  </motion.div>
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-700">
                    {isDragging ? 'Drop your audio file here' : 'Upload Audio File'}
                  </p>
                  <p className="text-gray-500 mt-2">
                    Drag & drop or click to select an audio file for transcription
                  </p>
                </div>
                <Button 
                  onClick={handleFileInputClick}
                  variant="outline"
                  size="lg"
                  className="mx-auto"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_FORMATS.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </Card>

      {/* Error Display */}
      <AnimatePresence>
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Upload Error</p>
                  <p className="text-red-700 text-sm mt-1">{uploadError}</p>
                </div>
                <Button
                  onClick={() => setUploadError(null)}
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Supported Formats Info */}
      <Card className="p-4 bg-gray-50">
        <div className="flex items-start space-x-3">
          <File className="w-5 h-5 text-gray-600 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-800 text-sm">Supported Formats</p>
            <p className="text-gray-600 text-xs mt-1">
              MP3, WAV, OGG, WebM, M4A, AAC, FLAC (Max: {formatFileSize(MAX_FILE_SIZE)})
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default memo(FileUploadManager)