/**
 * @fileoverview Analytics Dashboard - VA Legal Intelligence
 * @author VeteranLawAI Platform
 * @version 3.0.0
 */

import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  FileText,
  ArrowUp,
  ArrowDown,
  Download,
  Brain,
  Zap,
  Crown,
  Star,
  AlertCircle,
  RefreshCw,
  Globe,
  Database,
  LineChart,
  TrendingDown,
  ExternalLink,
  DollarSign,
  Activity,
  Briefcase,
  Scale,
  X,
} from 'lucide-react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import { announceToScreenReader } from '../../../utils/accessibility'

/**
 * Analytics Dashboard Component
 * VA Legal Intelligence with Real-time Insights and Predictive Analytics
 */
const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedView, setSelectedView] = useState('dashboard')
  const [hoveredCard, setHoveredCard] = useState(null)
  const [metrics, setMetrics] = useState(null)

  // Mock analytics data
  const mockMetrics = {
    overview: {
      totalCases: 1247,
      successRate: 89.3,
      averageRating: 67.8,
      totalCompensation: 2847500,
      activeClaims: 156,
      pendingDecisions: 89,
    },
    performance: {
      monthlyCases: [45, 52, 48, 61, 58, 67, 72, 69, 78, 85, 82, 91],
      successTrend: [82, 85, 87, 86, 88, 89, 91, 90, 92, 93, 91, 94],
      averageRating: [62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74],
      processingTime: [180, 175, 170, 165, 160, 155, 150, 145, 140, 135, 130, 125],
    },
    cases: {
      byCondition: [
        { condition: 'PTSD', count: 342, successRate: 92.1 },
        { condition: 'Back Pain', count: 289, successRate: 87.3 },
        { condition: 'Hearing Loss', count: 156, successRate: 94.2 },
        { condition: 'Knee Problems', count: 134, successRate: 85.7 },
        { condition: 'Depression', count: 98, successRate: 89.8 },
        { condition: 'Sleep Apnea', count: 87, successRate: 91.2 },
      ],
      byRegion: [
        { region: 'Northeast', count: 234, successRate: 88.5 },
        { region: 'Southeast', count: 198, successRate: 90.2 },
        { region: 'Midwest', count: 167, successRate: 87.8 },
        { region: 'Southwest', count: 145, successRate: 89.1 },
        { region: 'West', count: 123, successRate: 91.7 },
      ],
    },
    insights: [
      {
        type: 'success',
        title: 'PTSD Claims Success Rate Increased',
        description: 'PTSD claims success rate improved by 8.2% this quarter',
        impact: '+8.2%',
        trend: 'up',
      },
      {
        type: 'warning',
        title: 'Processing Time Alert',
        description: 'Average processing time increased by 12 days',
        impact: '+12 days',
        trend: 'down',
      },
      {
        type: 'info',
        title: 'New Evidence Strategy',
        description: 'Implementing new evidence gathering strategy',
        impact: 'New',
        trend: 'neutral',
      },
    ],
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = num => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const TrendIcon = ({ value }) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-400" />
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-400" />
    return <div className="h-4 w-4" />
  }

  const DifficultyBadge = ({ difficulty }) => {
    const colors = {
      easy: 'bg-green-500/20 text-green-400 border-green-500/30',
      moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      hard: 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[difficulty]}`}>
        {difficulty}
      </span>
    )
  }

  const refreshData = useCallback(() => {
    setIsLoading(true)
    announceToScreenReader('Refreshing analytics data')

    setTimeout(() => {
      setMetrics(mockMetrics)
      setIsLoading(false)
      announceToScreenReader('Analytics data refreshed')
    }, 1200)
  }, [])

  // Initialize component
  useEffect(() => {
    setMetrics(mockMetrics)
    announceToScreenReader('Analytics dashboard loaded')
  }, [])

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      announceToScreenReader('Copied to clipboard')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [])

  // Export data
  const exportData = useCallback((format = 'json') => {
    try {
      let content = JSON.stringify(metrics, null, 2)
      let mimeType = 'application/json'
      let filename = `analytics_report_${new Date().toISOString().split('T')[0]}.${format}`

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      announceToScreenReader(`Exported ${filename}`)
    } catch (error) {
      console.error('Export failed:', error)
      announceToScreenReader('Export failed')
    }
  }, [metrics])

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ]

  const views = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'cases', label: 'Cases', icon: FileText },
    { id: 'insights', label: 'Insights', icon: Brain },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
                <p className="text-slate-400">VA Legal Intelligence & Performance Metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-purple-400 text-sm font-medium">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-8">
          <div className="flex space-x-2">
            {views.map(view => {
              const Icon = view.icon
              return (
                <button
                  key={view.id}
                  onClick={() => setSelectedView(view.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedView === view.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{view.label}</span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            <Button
              onClick={refreshData}
              disabled={isLoading}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              onClick={() => exportData('json')}
              className="bg-gradient-to-r from-purple-500 to-pink-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <RefreshCw className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-bold text-white mb-2">Loading Analytics</h3>
                <p className="text-slate-400">Refreshing data and generating insights...</p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {selectedView === 'dashboard' && metrics && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Total Cases',
                  value: formatNumber(metrics.overview.totalCases),
                  change: '+12.5%',
                  trend: 'up',
                  icon: FileText,
                  color: 'text-blue-400',
                },
                {
                  title: 'Success Rate',
                  value: `${metrics.overview.successRate}%`,
                  change: '+2.1%',
                  trend: 'up',
                  icon: Target,
                  color: 'text-green-400',
                },
                {
                  title: 'Average Rating',
                  value: `${metrics.overview.averageRating}%`,
                  change: '+1.8%',
                  trend: 'up',
                  icon: Star,
                  color: 'text-yellow-400',
                },
                {
                  title: 'Total Compensation',
                  value: formatCurrency(metrics.overview.totalCompensation),
                  change: '+15.3%',
                  trend: 'up',
                  icon: DollarSign,
                  color: 'text-emerald-400',
                },
                {
                  title: 'Active Claims',
                  value: formatNumber(metrics.overview.activeClaims),
                  change: '-5.2%',
                  trend: 'down',
                  icon: Activity,
                  color: 'text-purple-400',
                },
                {
                  title: 'Processing Time',
                  value: '145 days',
                  change: '-8.1%',
                  trend: 'up',
                  icon: Clock,
                  color: 'text-cyan-400',
                },
              ].map((metric, index) => {
                const Icon = metric.icon
                return (
                  <Card key={index} className="p-6 hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className={`h-8 w-8 ${metric.color}`} />
                      <TrendIcon value={metric.trend === 'up' ? 1 : -1} />
                    </div>
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-white">{metric.value}</div>
                      <div className="text-slate-400 text-sm">{metric.title}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {metric.change}
                      </span>
                      <span className="text-slate-400 text-sm">vs last period</span>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Monthly Cases</h3>
                <div className="h-64 flex items-end justify-between space-x-1">
                  {metrics.performance.monthlyCases.map((value, index) => (
                    <div key={index} className="flex-1 bg-gradient-to-t from-purple-500 to-pink-600 rounded-t"
                         style={{ height: `${(value / 100) * 100}%` }}>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-slate-400 text-sm">
                  Cases processed per month
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Success Rate Trend</h3>
                <div className="h-64 flex items-end justify-between space-x-1">
                  {metrics.performance.successTrend.map((value, index) => (
                    <div key={index} className="flex-1 bg-gradient-to-t from-green-500 to-emerald-600 rounded-t"
                         style={{ height: `${value}%` }}>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-slate-400 text-sm">
                  Success rate percentage
                </div>
              </Card>
            </div>

            {/* Insights */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Key Insights</h3>
              <div className="space-y-4">
                {metrics.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded-lg">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'success' ? 'bg-green-500/20' :
                      insight.type === 'warning' ? 'bg-yellow-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      {insight.type === 'success' ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : insight.type === 'warning' ? (
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                      ) : (
                        <Brain className="h-4 w-4 text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{insight.title}</h4>
                      <p className="text-slate-400 text-sm">{insight.description}</p>
                    </div>
                    <div className={`text-sm font-medium ${
                      insight.trend === 'up' ? 'text-green-400' : 
                      insight.trend === 'down' ? 'text-red-400' : 
                      'text-blue-400'
                    }`}>
                      {insight.impact}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Performance View */}
        {selectedView === 'performance' && metrics && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Cases This Month', value: metrics.performance.monthlyCases[11] },
                  { label: 'Success Rate', value: `${metrics.performance.successTrend[11]}%` },
                  { label: 'Avg Rating', value: `${metrics.performance.averageRating[11]}%` },
                  { label: 'Processing Days', value: metrics.performance.processingTime[11] },
                ].map((metric, index) => (
                  <div key={index} className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                    <div className="text-slate-400 text-sm">{metric.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Cases View */}
        {selectedView === 'cases' && metrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Cases by Condition</h3>
                <div className="space-y-3">
                  {metrics.cases.byCondition.map((condition, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{condition.condition}</div>
                        <div className="text-slate-400 text-sm">{condition.count} cases</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-medium">{condition.successRate}%</div>
                        <div className="text-slate-400 text-sm">success rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Cases by Region</h3>
                <div className="space-y-3">
                  {metrics.cases.byRegion.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{region.region}</div>
                        <div className="text-slate-400 text-sm">{region.count} cases</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-medium">{region.successRate}%</div>
                        <div className="text-slate-400 text-sm">success rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Insights View */}
        {selectedView === 'insights' && metrics && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">AI-Generated Insights</h3>
              <div className="space-y-4">
                {metrics.insights.map((insight, index) => (
                  <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        insight.type === 'success' ? 'bg-green-500/20' :
                        insight.type === 'warning' ? 'bg-yellow-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        {insight.type === 'success' ? (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        ) : insight.type === 'warning' ? (
                          <AlertCircle className="h-4 w-4 text-yellow-400" />
                        ) : (
                          <Brain className="h-4 w-4 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-2">{insight.title}</h4>
                        <p className="text-slate-400 text-sm mb-3">{insight.description}</p>
                        <div className="flex items-center space-x-4">
                          <span className={`text-sm font-medium ${
                            insight.trend === 'up' ? 'text-green-400' : 
                            insight.trend === 'down' ? 'text-red-400' : 
                            'text-blue-400'
                          }`}>
                            Impact: {insight.impact}
                          </span>
                          <DifficultyBadge difficulty="moderate" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analytics
