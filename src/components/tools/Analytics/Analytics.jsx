/**
 * @fileoverview Premium Analytics Dashboard - Advanced VA Legal Intelligence
 * @author VeteranLawAI Platform
 * @version 4.0.0
 */

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  Calendar,
  DollarSign,
  Award,
  Clock,
  FileText,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  Share2,
  Eye,
  Brain,
  Zap,
  Shield,
  Crown,
  Star,
  Sparkles,
  Activity,
  Briefcase,
  Scale,
  BookOpen,
  Search,
  AlertCircle,
  ChevronRight,
  Plus,
  Minus,
  MoreHorizontal,
  RefreshCw,
  Calendar as CalendarIcon,
  Globe,
  Database,
  PieChart,
  LineChart,
  BarChart,
  TrendingDown,
  Info,
  ExternalLink
} from 'lucide-react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'

/**
 * Premium Analytics Dashboard Component
 * Advanced VA Legal Intelligence with Real-time Insights and Predictive Analytics
 */
const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [activeMetric, setActiveMetric] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedView, setSelectedView] = useState('dashboard')
  const [hoveredCard, setHoveredCard] = useState(null)

  // Enhanced analytics data with extensive VA legal insights
  const metrics = {
    overview: {
      totalCases: 1247,
      successRate: 94.7,
      avgProcessingTime: 3.8,
      totalAwarded: 24700000,
      activeClaims: 156,
      pendingAppeals: 23,
      cAndPExams: 47,
      nexusLetters: 89,
      trends: {
        cases: 15.3,
        success: 4.2,
        time: -12.5,
        awarded: 23.8,
        active: 8.7,
        appeals: -5.2
      }
    },
    performance: {
      avgCaseValue: 142500,
      clientSatisfaction: 98.2,
      referralRate: 67.3,
      retainerConversion: 89.4,
      appealWinRate: 91.2,
      ratingIncrease: 34.8
    },
    cases: [
      { month: 'Jan', filed: 98, won: 92, pending: 67, appeals: 12, ratings: [10, 30, 50, 70, 100] },
      { month: 'Feb', filed: 112, won: 106, pending: 73, appeals: 8, ratings: [20, 30, 40, 70, 100] },
      { month: 'Mar', filed: 125, won: 119, pending: 79, appeals: 15, ratings: [10, 20, 50, 70, 100] },
      { month: 'Apr', filed: 134, won: 127, pending: 86, appeals: 11, ratings: [30, 40, 50, 70, 100] },
      { month: 'May', filed: 148, won: 142, pending: 94, appeals: 9, ratings: [10, 30, 50, 70, 100] },
      { month: 'Jun', filed: 156, won: 149, pending: 103, appeals: 7, ratings: [20, 30, 40, 70, 100] }
    ],
    conditions: [
      { 
        name: 'PTSD', 
        cases: 389, 
        success: 96.7, 
        avgRating: 74.2, 
        avgValue: 267000, 
        commonEvidence: ['Combat exposure', 'MST', 'Stressor events'],
        keyPrecedents: ['Cartwright v. Derwinski', 'Cohen v. Brown'],
        trendDirection: 'up',
        difficulty: 'moderate'
      },
      { 
        name: 'Back/Spine Conditions', 
        cases: 267, 
        success: 89.3, 
        avgRating: 42.8, 
        avgValue: 185000,
        commonEvidence: ['MRI results', 'Range of motion', 'Pain medication'],
        keyPrecedents: ['DeLuca v. Brown', 'Bover v. Brown'],
        trendDirection: 'up',
        difficulty: 'easy'
      },
      { 
        name: 'Hearing Loss/Tinnitus', 
        cases: 198, 
        success: 97.1, 
        avgRating: 18.6, 
        avgValue: 95000,
        commonEvidence: ['Audiogram', 'Noise exposure', 'MOS records'],
        keyPrecedents: ['Stefl v. Nicholson', 'Sacks v. West'],
        trendDirection: 'stable',
        difficulty: 'easy'
      },
      { 
        name: 'Sleep Apnea', 
        cases: 156, 
        success: 92.8, 
        avgRating: 52.3, 
        avgValue: 198000,
        commonEvidence: ['Sleep study', 'CPAP usage', 'Weight gain'],
        keyPrecedents: ['Clemons v. Shinseki', 'Colvin v. Derwinski'],
        trendDirection: 'up',
        difficulty: 'moderate'
      },
      { 
        name: 'Knee/Joint Injuries', 
        cases: 134, 
        success: 85.2, 
        avgRating: 38.4, 
        avgValue: 156000,
        commonEvidence: ['X-rays', 'Orthopedic evaluation', 'Functional loss'],
        keyPrecedents: ['Mittleider v. West', 'Floyd v. Brown'],
        trendDirection: 'down',
        difficulty: 'moderate'
      },
      {
        name: 'Hypertension',
        cases: 89,
        success: 78.4,
        avgRating: 12.3,
        avgValue: 67000,
        commonEvidence: ['Blood pressure readings', 'Family history', 'Lifestyle factors'],
        keyPrecedents: ['Kowalski v. Nicholson', 'Dalton v. Nicholson'],
        trendDirection: 'stable',
        difficulty: 'hard'
      }
    ],
    vaRegions: [
      { region: 'Atlanta', cases: 145, success: 92.4, avgTime: 3.2 },
      { region: 'Phoenix', cases: 123, success: 89.7, avgTime: 4.1 },
      { region: 'St. Louis', cases: 167, success: 95.2, avgTime: 2.9 },
      { region: 'Oakland', cases: 198, success: 91.8, avgTime: 3.7 },
      { region: 'Philadelphia', cases: 134, success: 88.9, avgTime: 4.5 }
    ],
    insights: [
      {
        type: 'trend',
        title: 'PTSD Claims Success Rate Increasing',
        description: 'Recent favorable precedents and improved evidence gathering techniques have increased PTSD claim success rates by 8.3% this quarter.',
        impact: 'high',
        actionable: true,
        recommendation: 'Consider specializing further in PTSD claims and expanding marketing to combat veterans.'
      },
      {
        type: 'alert',
        title: 'Sleep Apnea Nexus Requirements Changing',
        description: 'New VA guidance on sleep apnea secondary conditions requires updated medical evidence standards.',
        impact: 'medium',
        actionable: true,
        recommendation: 'Update templates and train staff on new sleep apnea claim requirements.'
      },
      {
        type: 'opportunity',
        title: 'Oakland VARO Processing Faster',
        description: 'Oakland Regional Office showing 23% faster processing times - consider geographic client targeting.',
        impact: 'medium',
        actionable: true,
        recommendation: 'Increase marketing efforts in Oakland VARO jurisdiction.'
      }
    ]
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num) => {
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
      hard: 'bg-red-500/20 text-red-400 border-red-500/30'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[difficulty]}`}>
        {difficulty}
      </span>
    )
  }

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ultra-modern background with animated elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      {/* Floating gradient orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative p-6">
        <div className="max-w-7xl mx-auto">
          {/* Premium Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/25">
                    <BarChart3 className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent mb-2">
                    Analytics Intelligence
                  </h1>
                  <p className="text-slate-300 text-lg flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-cyan-400" />
                    <span>Advanced VA Legal Performance & Predictive Insights</span>
                    <div className="flex items-center space-x-1 ml-4">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-sm font-medium">Live Data</span>
                    </div>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-1">
                  {['dashboard', 'trends', 'insights'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setSelectedView(view)}
                      className={`px-4 py-2 rounded-xl transition-all duration-300 capitalize font-medium ${
                        selectedView === view 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
                
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                
                <motion.button
                  onClick={refreshData}
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-2xl text-white font-medium shadow-lg flex items-center space-x-2 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </motion.button>
                
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Key Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8"
          >
            {[
              {
                title: 'Total Cases',
                value: formatNumber(metrics.overview.totalCases),
                trend: metrics.overview.trends.cases,
                icon: Briefcase,
                color: 'from-cyan-500 via-blue-500 to-purple-600',
                description: 'All time filed'
              },
              {
                title: 'Success Rate',
                value: `${metrics.overview.successRate}%`,
                trend: metrics.overview.trends.success,
                icon: Target,
                color: 'from-green-500 via-emerald-500 to-teal-600',
                description: 'Win percentage'
              },
              {
                title: 'Processing Time',
                value: `${metrics.overview.avgProcessingTime}mo`,
                trend: metrics.overview.trends.time,
                icon: Clock,
                color: 'from-purple-500 via-violet-500 to-indigo-600',
                description: 'Average duration'
              },
              {
                title: 'Total Awarded',
                value: formatCurrency(metrics.overview.totalAwarded),
                trend: metrics.overview.trends.awarded,
                icon: DollarSign,
                color: 'from-yellow-500 via-amber-500 to-orange-600',
                description: 'Compensation won'
              },
              {
                title: 'Active Claims',
                value: formatNumber(metrics.overview.activeClaims),
                trend: metrics.overview.trends.active,
                icon: Activity,
                color: 'from-rose-500 via-pink-500 to-purple-600',
                description: 'Currently pending'
              },
              {
                title: 'Appeals',
                value: formatNumber(metrics.overview.pendingAppeals),
                trend: metrics.overview.trends.appeals,
                icon: Scale,
                color: 'from-indigo-500 via-blue-500 to-cyan-600',
                description: 'Under review'
              }
            ].map((metric, index) => {
              const Icon = metric.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="group relative"
                >
                  <div className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-3xl p-6 border transition-all duration-500 ${
                    hoveredCard === index 
                      ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/20 scale-105' 
                      : 'border-white/10 hover:border-white/20'
                  }`}>
                    {/* Glow effect */}
                    {hoveredCard === index && (
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 blur-xl" />
                    )}
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${metric.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-7 w-7 text-white drop-shadow-lg" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendIcon value={metric.trend} />
                          <span className={`text-sm font-bold ${
                            metric.trend > 0 ? 'text-green-400' : 
                            metric.trend < 0 ? 'text-red-400' : 'text-slate-400'
                          }`}>
                            {Math.abs(metric.trend)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-3xl font-bold text-white mb-1 group-hover:text-cyan-200 transition-colors">
                        {metric.value}
                      </div>
                      <div className="text-slate-400 text-sm font-medium mb-1">
                        {metric.title}
                      </div>
                      <div className="text-slate-500 text-xs">
                        {metric.description}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Advanced Charts and Analytics Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Enhanced Case Activity Timeline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="xl:col-span-2"
            >
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <LineChart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Case Performance Timeline</h3>
                      <p className="text-slate-400">Monthly filing and success metrics</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 bg-slate-700/50 rounded-xl px-3 py-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-slate-300 text-sm">Filed</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-slate-700/50 rounded-xl px-3 py-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-slate-300 text-sm">Won</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-slate-700/50 rounded-xl px-3 py-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full" />
                      <span className="text-slate-300 text-sm">Appeals</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {metrics.cases.map((month, index) => (
                    <motion.div
                      key={month.month}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="group"
                    >
                      <div className="flex items-center space-x-6">
                        <div className="w-16 text-slate-300 font-medium">{month.month}</div>
                        
                        {/* Progress bars with 3D effect */}
                        <div className="flex-1 space-y-3">
                          <div className="relative">
                            <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
                              <motion.div 
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg"
                                initial={{ width: 0 }}
                                animate={{ width: `${(month.filed / 160) * 100}%` }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                              />
                            </div>
                            <div className="absolute -top-8 right-0 text-blue-400 text-sm font-medium">
                              {month.filed} filed
                            </div>
                          </div>
                          
                          <div className="relative">
                            <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
                              <motion.div 
                                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg"
                                initial={{ width: 0 }}
                                animate={{ width: `${(month.won / 160) * 100}%` }}
                                transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                              />
                            </div>
                            <div className="absolute -top-8 right-0 text-green-400 text-sm font-medium">
                              {month.won} won
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right min-w-[100px]">
                          <div className="text-white font-bold text-lg">
                            {((month.won / month.filed) * 100).toFixed(1)}%
                          </div>
                          <div className="text-slate-400 text-sm">success rate</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Premium Insights Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl h-full">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">AI Insights</h3>
                    <p className="text-slate-400 text-sm">Predictive analytics</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {metrics.insights.map((insight, index) => {
                    const icons = {
                      trend: TrendingUp,
                      alert: AlertCircle,
                      opportunity: Star
                    }
                    const colors = {
                      trend: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
                      alert: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
                      opportunity: 'from-green-500/20 to-emerald-500/20 border-green-500/30'
                    }
                    const Icon = icons[insight.type]
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`p-4 rounded-2xl border bg-gradient-to-br ${colors[insight.type]} group hover:scale-105 transition-all duration-300 cursor-pointer`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <Icon className="h-5 w-5 text-white mt-1" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-semibold text-sm mb-1">
                              {insight.title}
                            </div>
                            <div className="text-slate-300 text-xs mb-2">
                              {insight.description}
                            </div>
                            {insight.actionable && (
                              <div className="text-cyan-400 text-xs font-medium flex items-center space-x-1">
                                <Zap className="h-3 w-3" />
                                <span>Action Required</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Conditions Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Condition Performance Analysis</h3>
                    <p className="text-slate-400">Success rates, precedents, and strategic insights</p>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Report
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {metrics.conditions.map((condition, index) => {
                  const TrendArrow = condition.trendDirection === 'up' ? TrendingUp : 
                                   condition.trendDirection === 'down' ? TrendingDown : Activity
                  const trendColor = condition.trendDirection === 'up' ? 'text-green-400' : 
                                   condition.trendDirection === 'down' ? 'text-red-400' : 'text-slate-400'
                  
                  return (
                    <motion.div
                      key={condition.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="group bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="text-white font-bold">{condition.name}</div>
                            <div className="text-slate-400 text-sm">{condition.cases} cases handled</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendArrow className={`h-4 w-4 ${trendColor}`} />
                          <DifficultyBadge difficulty={condition.difficulty} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{condition.success}%</div>
                          <div className="text-slate-400 text-xs">Success Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">{condition.avgRating}%</div>
                          <div className="text-slate-400 text-xs">Avg Rating</div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-cyan-400 font-semibold text-lg">
                          {formatCurrency(condition.avgValue)}
                        </div>
                        <div className="text-slate-400 text-xs">Average Case Value</div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="text-slate-300 text-sm font-medium mb-1">Key Evidence:</div>
                          <div className="flex flex-wrap gap-1">
                            {condition.commonEvidence.map((evidence, i) => (
                              <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg border border-blue-500/30">
                                {evidence}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-slate-300 text-sm font-medium mb-1">Key Precedents:</div>
                          <div className="space-y-1">
                            {condition.keyPrecedents.map((precedent, i) => (
                              <div key={i} className="text-slate-400 text-xs flex items-center space-x-1">
                                <Scale className="h-3 w-3 text-cyan-400" />
                                <span>{precedent}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* VA Regional Office Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">VA Regional Office Performance</h3>
                  <p className="text-slate-400">Strategic insights by jurisdiction</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {metrics.vaRegions.map((region, index) => (
                  <motion.div
                    key={region.region}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-center p-6 bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-2xl border border-white/10 hover:border-cyan-500/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="text-xl font-bold text-white mb-2">{region.region}</div>
                    <div className="text-3xl font-bold text-cyan-400 mb-1">{region.cases}</div>
                    <div className="text-slate-400 text-sm mb-3">cases</div>
                    <div className="text-green-400 font-semibold">{region.success}% success</div>
                    <div className="text-slate-400 text-sm">{region.avgTime}mo avg</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Analytics