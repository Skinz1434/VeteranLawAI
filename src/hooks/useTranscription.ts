/**
 * @fileoverview Transcription Hook - Manages file transcription and transcript operations
 * @author QBit-Claude Refactor Agent
 * @version 1.0.0
 */

import { useCallback } from 'react'
import {
  useTranscriptionState,
  useTranscriptionActions,
  useConfigurationState,
  type Transcript,
} from '../stores/audioTranscriptionStore'
import { processAudioFile as processAudioFileService } from '../services/speechToTextService'
import { announceToScreenReader } from '../utils/accessibility'

export interface UseTranscriptionReturn {
  // State
  transcripts: Transcript[]
  selectedTranscript: Transcript | null
  isTranscribing: boolean
  transcriptionProgress: number

  // Actions
  processAudioFile: (file: File) => Promise<void>
  selectTranscript: (transcript: Transcript | null) => void
  deleteTranscript: (id: string) => void
  exportTranscript: (transcript: Transcript, format: string) => Promise<void>
  copyTranscriptToClipboard: (transcript: Transcript) => Promise<void>

  // Filters and search
  filteredTranscripts: Transcript[]
  searchTranscripts: (query: string) => Transcript[]

  // Analytics
  extractKeyFindings: (transcript: string) => string[]
  extractVATerms: (transcript: string) => string[]
  generateSummary: (transcript: string) => string
  calculateConfidenceScore: (transcript: string) => number
}

// VA legal terms for detection
const VA_LEGAL_TERMS = [
  'service-connected',
  'disability rating',
  'C&P exam',
  'compensation',
  'pension',
  'VA medical center',
  'veteran',
  'combat veteran',
  'Purple Heart',
  'disability compensation',
  'individual unemployability',
  'TDIU',
  'PTSD',
  'TBI',
  'traumatic brain injury',
  'Gulf War syndrome',
  'Agent Orange',
  'burn pit',
  'military sexual trauma',
  'MST',
  'buddy statement',
  'lay evidence',
  'nexus letter',
  'DBQ',
  'disability benefits questionnaire',
  'effective date',
  'clear and unmistakable error',
  'CUE',
  'secondary service connection',
  'aggravation',
  'presumptive condition',
  'combat stressor',
  'chronicity',
  'continuity',
  'in-service injury',
  'service medical records',
  'SMR',
  'private medical evidence',
  'vocational rehabilitation',
  'Chapter 31',
  'Chapter 35',
  'dependents education',
  'burial benefits',
  'DIC',
  'dependency and indemnity compensation',
  'CHAMPVA',
  'fiduciary',
  'representative payee',
  'power of attorney',
  'accredited representative',
]

export const useTranscription = (searchQuery = '', filterType = 'all'): UseTranscriptionReturn => {
  const transcriptionState = useTranscriptionState()
  const transcriptionActions = useTranscriptionActions()
  const { qualitySettings, languageModel, speakerCount, exportFormat } = useConfigurationState()

  // Process audio file for transcription
  const processAudioFile = useCallback(
    async (file: File) => {
      try {
        // Validate file
        if (!file.type.startsWith('audio/')) {
          throw new Error('Please select a valid audio file')
        }

        const maxSize = 100 * 1024 * 1024 // 100MB
        if (file.size > maxSize) {
          throw new Error('File size must be less than 100MB')
        }

        transcriptionActions.setTranscribing(true)
        transcriptionActions.updateTranscriptionProgress(0)

        announceToScreenReader(`Starting transcription of ${file.name}`)

        // Process the file with the service
        const result = await processAudioFileService(file, {
          quality: qualitySettings,
          language: 'en-US',
          speakerCount,
          onProgress: (progress: number) => {
            transcriptionActions.updateTranscriptionProgress(progress)

            // Announce progress at key milestones
            if (progress === 25 || progress === 50 || progress === 75) {
              announceToScreenReader(`Transcription ${progress}% complete`)
            }
          },
        })

        if (result.success && result.transcript) {
          // Create transcript object
          const transcript: Transcript = {
            id: `file-${Date.now()}`,
            title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
            type: detectTranscriptType(result.transcript),
            date: new Date().toISOString(),
            duration: result.duration || 'Unknown',
            speakers: result.speakers || [`Speaker 1`, `Speaker 2`],
            status: 'completed',
            confidence: calculateConfidenceScore(result.transcript),
            language: 'en-US',
            summary: generateSummary(result.transcript),
            keyFindings: extractKeyFindings(result.transcript),
            transcript: result.transcript,
          }

          transcriptionActions.addTranscript(transcript)
          announceToScreenReader(
            `Transcription completed with ${Math.round(transcript.confidence * 100)}% confidence`
          )
        } else {
          throw new Error(result.error || 'Transcription failed')
        }
      } catch (error) {
        console.error('Transcription error:', error)
        const message = error instanceof Error ? error.message : 'Transcription failed'
        announceToScreenReader(`Transcription failed: ${message}`)
        throw error
      } finally {
        transcriptionActions.setTranscribing(false)
        transcriptionActions.updateTranscriptionProgress(0)
      }
    },
    [qualitySettings, speakerCount, transcriptionActions]
  )

  // Export transcript in various formats
  const exportTranscript = useCallback(async (transcript: Transcript, format: string) => {
    try {
      let content: string
      let mimeType: string
      let fileName: string

      switch (format) {
        case 'txt':
          content = formatAsText(transcript)
          mimeType = 'text/plain'
          fileName = `${transcript.title}.txt`
          break

        case 'docx':
          content = formatAsWord(transcript)
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          fileName = `${transcript.title}.docx`
          break

        case 'json':
          content = JSON.stringify(transcript, null, 2)
          mimeType = 'application/json'
          fileName = `${transcript.title}.json`
          break

        case 'srt':
          content = formatAsSubtitles(transcript, 'srt')
          mimeType = 'text/srt'
          fileName = `${transcript.title}.srt`
          break

        default:
          throw new Error(`Unsupported export format: ${format}`)
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)

      announceToScreenReader(`Exported transcript as ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Export error:', error)
      announceToScreenReader(
        `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      throw error
    }
  }, [])

  // Copy transcript to clipboard
  const copyTranscriptToClipboard = useCallback(async (transcript: Transcript) => {
    try {
      const text = formatAsText(transcript)
      await navigator.clipboard.writeText(text)
      announceToScreenReader('Transcript copied to clipboard')
    } catch (error) {
      console.error('Copy error:', error)
      announceToScreenReader('Failed to copy transcript to clipboard')
      throw error
    }
  }, [])

  // Filter transcripts based on search and type
  const filteredTranscripts = useCallback(() => {
    let filtered = transcriptionState.transcripts

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        t =>
          t.title.toLowerCase().includes(query) ||
          t.transcript.toLowerCase().includes(query) ||
          t.summary.toLowerCase().includes(query) ||
          t.keyFindings.some(finding => finding.toLowerCase().includes(query))
      )
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transcriptionState.transcripts, searchQuery, filterType])()

  // Search transcripts function
  const searchTranscripts = useCallback(
    (query: string): Transcript[] => {
      if (!query.trim()) return transcriptionState.transcripts

      const searchTerm = query.toLowerCase()
      return transcriptionState.transcripts.filter(
        t =>
          t.title.toLowerCase().includes(searchTerm) ||
          t.transcript.toLowerCase().includes(searchTerm) ||
          t.summary.toLowerCase().includes(searchTerm) ||
          t.keyFindings.some(finding => finding.toLowerCase().includes(searchTerm)) ||
          t.speakers.some(speaker => speaker.toLowerCase().includes(searchTerm))
      )
    },
    [transcriptionState.transcripts]
  )

  // Extract key findings from transcript
  const extractKeyFindings = useCallback((transcript: string): string[] => {
    const findings: string[] = []
    const lines = transcript.split('\n')

    lines.forEach(line => {
      // Look for important phrases
      if (
        line.toLowerCase().includes('service-connected') ||
        line.toLowerCase().includes('disability rating') ||
        line.toLowerCase().includes('ptsd') ||
        line.toLowerCase().includes('depression') ||
        line.toLowerCase().includes('anxiety') ||
        line.toLowerCase().includes('pain') ||
        line.toLowerCase().includes('medication') ||
        line.toLowerCase().includes('treatment')
      ) {
        findings.push(line.trim())
      }
    })

    return findings.slice(0, 10) // Limit to top 10 findings
  }, [])

  // Extract VA-specific terms from transcript
  const extractVATerms = useCallback((transcript: string): string[] => {
    const foundTerms: string[] = []
    const lowerTranscript = transcript.toLowerCase()

    VA_LEGAL_TERMS.forEach(term => {
      if (lowerTranscript.includes(term.toLowerCase())) {
        foundTerms.push(term)
      }
    })

    return [...new Set(foundTerms)] // Remove duplicates
  }, [])

  // Generate summary from transcript
  const generateSummary = useCallback((transcript: string): string => {
    if (transcript.length < 100) return transcript

    // Simple extractive summarization
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 20)
    const importantSentences = sentences.filter(sentence => {
      const lower = sentence.toLowerCase()
      return VA_LEGAL_TERMS.some(term => lower.includes(term.toLowerCase()))
    })

    if (importantSentences.length > 0) {
      return importantSentences.slice(0, 3).join('. ') + '.'
    }

    return sentences.slice(0, 2).join('. ') + '.'
  }, [])

  // Calculate confidence score based on transcript quality
  const calculateConfidenceScore = useCallback(
    (transcript: string): number => {
      if (!transcript || transcript.length < 10) return 0

      let score = 0.8 // Base score

      // Increase score for longer transcripts
      if (transcript.length > 500) score += 0.1
      if (transcript.length > 1000) score += 0.05

      // Decrease score for many unclear sections
      const unclearCount = (transcript.match(/\[unclear\]|\[inaudible\]/gi) || []).length
      score -= unclearCount * 0.05

      // Increase score for VA legal terms
      const vaTermCount = extractVATerms(transcript).length
      score += Math.min(vaTermCount * 0.01, 0.1)

      return Math.max(0.1, Math.min(1.0, score))
    },
    [extractVATerms]
  )

  // Helper functions for formatting
  const formatAsText = (transcript: Transcript): string => {
    return `
TRANSCRIPT: ${transcript.title}
Date: ${new Date(transcript.date).toLocaleDateString()}
Duration: ${transcript.duration}
Type: ${transcript.type.replace('_', ' ').toUpperCase()}
Speakers: ${transcript.speakers.join(', ')}
Confidence: ${Math.round(transcript.confidence * 100)}%

SUMMARY:
${transcript.summary}

KEY FINDINGS:
${transcript.keyFindings.map(finding => `• ${finding}`).join('\n')}

FULL TRANSCRIPT:
${transcript.transcript}
    `.trim()
  }

  const formatAsWord = (transcript: Transcript): string => {
    // Simplified Word format (would need actual DOCX library for full implementation)
    return formatAsText(transcript)
  }

  const formatAsSubtitles = (transcript: Transcript, format: 'srt' | 'vtt'): string => {
    // Simple subtitle format (would need timing data for proper implementation)
    const lines = transcript.transcript.split('\n')
    let result = ''

    lines.forEach((line, index) => {
      const startTime = formatTime(index * 5) // Assume 5 seconds per line
      const endTime = formatTime((index + 1) * 5)

      if (format === 'srt') {
        result += `${index + 1}\n${startTime} --> ${endTime}\n${line}\n\n`
      }
    })

    return result
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    const ms = 0 // Simplified

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`
  }

  // Detect transcript type based on content
  const detectTranscriptType = (transcript: string): Transcript['type'] => {
    const lower = transcript.toLowerCase()

    if (lower.includes('c&p exam') || lower.includes('compensation and pension')) {
      return 'cp_exam'
    }
    if (lower.includes('deposition') || lower.includes('sworn testimony')) {
      return 'deposition'
    }
    if (lower.includes('hearing') || lower.includes('administrative law judge')) {
      return 'hearing'
    }

    return 'consultation'
  }

  return {
    // State
    transcripts: transcriptionState.transcripts,
    selectedTranscript: transcriptionState.selectedTranscript,
    isTranscribing: transcriptionState.isTranscribing,
    transcriptionProgress: transcriptionState.transcriptionProgress,

    // Actions
    processAudioFile,
    selectTranscript: transcriptionActions.selectTranscript,
    deleteTranscript: transcriptionActions.deleteTranscript,
    exportTranscript,
    copyTranscriptToClipboard,

    // Filters and search
    filteredTranscripts,
    searchTranscripts,

    // Analytics
    extractKeyFindings,
    extractVATerms,
    generateSummary,
    calculateConfidenceScore,
  }
}
