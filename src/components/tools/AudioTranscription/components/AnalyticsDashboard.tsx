/**
 * @fileoverview Analytics Dashboard - Statistics and insights for transcription usage
 * @author QBit-Claude Refactor Agent
 * @version 1.0.0
 */

import React, { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Clock,
  Zap,
  TrendingUp,
  PieChart,
  BarChart3,
  Star,
  Scale,
  User,
  Archive,
  Calendar,
  Award,
  Target
} from 'lucide-react'
import Card from '../../../ui/Card'
import { useTranscriptionState, type Transcript } from '../../../../stores/audioTranscriptionStore'

interface AnalyticsDashboardProps {
  className?: string
}

interface AnalyticsData {
  totalTranscripts: number
  totalDuration: string
  avgConfidence: number
  typeBreakdown: Record<string, number>
  monthlyTrends: Array<{ month: string; count: number }>
  qualityDistribution: { high: number; medium: number; low: number }
  topFindings: Array<{ finding: string; count: number }>
}

const TYPE_CONFIG = {
  cp_exam: { label: 'C&P Exams', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  deposition: { label: 'Depositions', icon: Scale, color: 'text-purple-600', bg: 'bg-purple-100' },
  hearing: { label: 'Hearings', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-100' },
  consultation: { label: 'Consultations', icon: User, color: 'text-green-600', bg: 'bg-green-100' },
  other: { label: 'Other', icon: Archive, color: 'text-gray-600', bg: 'bg-gray-100' }
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {
  const { transcripts } = useTranscriptionState()

  // Calculate analytics data
  const analytics = useMemo((): AnalyticsData => {
    if (transcripts.length === 0) {
      return {
        totalTranscripts: 0,
        totalDuration: '0:00',
        avgConfidence: 0,
        typeBreakdown: {},
        monthlyTrends: [],
        qualityDistribution: { high: 0, medium: 0, low: 0 },
        topFindings: []
      }
    }

    // Calculate total duration
    const totalSeconds = transcripts.reduce((acc, transcript) => {
      const parts = transcript.duration.split(':')
      const seconds = parts.length === 3 
        ? parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
        : parseInt(parts[0]) * 60 + parseInt(parts[1] || '0')
      return acc + seconds
    }, 0)

    const formatDuration = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:00` : `${minutes}:00`
    }

    // Calculate average confidence
    const avgConfidence = transcripts.reduce((sum, t) => sum + t.confidence, 0) / transcripts.length

    // Type breakdown
    const typeBreakdown = transcripts.reduce((acc, transcript) => {
      acc[transcript.type] = (acc[transcript.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Monthly trends (last 6 months)
    const monthlyTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      const count = transcripts.filter(t => {
        const transcriptDate = new Date(t.date)
        return transcriptDate.getMonth() === date.getMonth() && 
               transcriptDate.getFullYear() === date.getFullYear()
      }).length
      
      monthlyTrends.push({ month, count })
    }

    // Quality distribution
    const qualityDistribution = transcripts.reduce((acc, transcript) => {
      if (transcript.confidence >= 0.9) acc.high++
      else if (transcript.confidence >= 0.75) acc.medium++
      else acc.low++
      return acc
    }, { high: 0, medium: 0, low: 0 })

    // Top findings (most common key findings)
    const findingsCount: Record<string, number> = {}
    transcripts.forEach(transcript => {
      transcript.keyFindings.forEach(finding => {
        const key = finding.substring(0, 50) // Truncate for grouping
        findingsCount[key] = (findingsCount[key] || 0) + 1
      })
    })

    const topFindings = Object.entries(findingsCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([finding, count]) => ({ finding, count }))

    return {
      totalTranscripts: transcripts.length,
      totalDuration: formatDuration(totalSeconds),
      avgConfidence,
      typeBreakdown,
      monthlyTrends,
      qualityDistribution,
      topFindings
    }
  }, [transcripts])

  if (transcripts.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-12 text-center">
          <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Analytics Available
          </h3>
          <p className="text-gray-500">
            Create some transcripts to view analytics and insights
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600 mt-1">
          Insights and statistics from your transcription activity
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transcripts</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalTranscripts}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Duration</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalDuration}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Average Quality</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round(analytics.avgConfidence * 100)}%
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.monthlyTrends[analytics.monthlyTrends.length - 1]?.count || 0}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Transcript Types</span>
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics.typeBreakdown).map(([type, count]) => {
                const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG]
                const TypeIcon = config.icon
                const percentage = (count / analytics.totalTranscripts * 100).toFixed(1)
                
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${config.bg}`}>
                        <TypeIcon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <span className="text-gray-700">{config.label}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${config.bg.replace('bg-', 'bg-').replace('-100', '-500')}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8">
                        {count}
                      </span>
                      <span className="text-xs text-gray-500 w-10">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </motion.div>

        {/* Quality Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Quality Distribution</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-700">High Quality (90%+)</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {analytics.qualityDistribution.high}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-gray-700">Medium Quality (75-89%)</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {analytics.qualityDistribution.medium}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-gray-700">Low Quality (&lt;75%)</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {analytics.qualityDistribution.low}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Monthly Activity</span>
          </h3>
          <div className="flex items-end justify-between space-x-2 h-32">
            {analytics.monthlyTrends.map((month, index) => {
              const maxCount = Math.max(...analytics.monthlyTrends.map(m => m.count))
              const height = maxCount > 0 ? (month.count / maxCount) * 100 : 0
              
              return (
                <div key={month.month} className="flex flex-col items-center space-y-2">
                  <div
                    className="bg-blue-500 rounded-t w-8 min-h-1 flex items-end justify-center text-xs text-white font-medium transition-all duration-300"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  >
                    {month.count > 0 ? month.count : ''}
                  </div>
                  <span className="text-xs text-gray-600 transform rotate-45 origin-bottom">
                    {month.month}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
      </motion.div>

      {/* Top Findings */}
      {analytics.topFindings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Most Common Findings</span>
            </h3>
            <div className="space-y-3">
              {analytics.topFindings.map((finding, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {finding.finding}...
                    </p>
                  </div>
                  <span className="flex-shrink-0 ml-4 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {finding.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default memo(AnalyticsDashboard)