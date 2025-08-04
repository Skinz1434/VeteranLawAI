/**
 * @fileoverview Analytics Dashboard - Real-time metrics and insights
 * @author VeteranLawAI Platform
 * @version 2.0.0
 */

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
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
  Filter
} from 'lucide-react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'

/**
 * Analytics Dashboard Component
 * Provides comprehensive metrics and insights for VA legal practice
 */
const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [activeMetric, setActiveMetric] = useState('overview')

  // Mock analytics data
  const metrics = {
    overview: {
      totalCases: 247,
      successRate: 89,
      avgProcessingTime: 4.2,
      totalAwarded: 2400000,
      trends: {
        cases: 12,
        success: 3,
        time: -8,
        awarded: 18
      }
    },
    cases: [
      { month: 'Jan', filed: 18, won: 16, pending: 12 },
      { month: 'Feb', filed: 22, won: 19, pending: 15 },
      { month: 'Mar', filed: 25, won: 23, pending: 18 },
      { month: 'Apr', filed: 21, won: 18, pending: 21 },
      { month: 'May', filed: 28, won: 25, pending: 24 },
      { month: 'Jun', filed: 24, won: 22, pending: 26 }
    ],
    conditions: [
      { name: 'PTSD', cases: 89, success: 94, avgRating: 70 },
      { name: 'Back Pain', cases: 67, success: 82, avgRating: 40 },
      { name: 'Hearing Loss', cases: 45, success: 96, avgRating: 10 },
      { name: 'Sleep Apnea', cases: 32, success: 88, avgRating: 50 },
      { name: 'Knee Injury', cases: 28, success: 76, avgRating: 30 }
    ]
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const TrendIcon = ({ value }) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-400" />
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-400" />
    return <div className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-slate-300">
                Real-time insights and performance metrics for your VA legal practice
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-xl text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: 'Total Cases',
              value: metrics.overview.totalCases,
              trend: metrics.overview.trends.cases,
              icon: FileText,
              color: 'from-blue-500 to-blue-600'
            },
            {
              title: 'Success Rate',
              value: `${metrics.overview.successRate}%`,
              trend: metrics.overview.trends.success,
              icon: Target,
              color: 'from-green-500 to-green-600'
            },
            {
              title: 'Avg Processing',
              value: `${metrics.overview.avgProcessingTime} mo`,
              trend: metrics.overview.trends.time,
              icon: Clock,
              color: 'from-purple-500 to-purple-600'
            },
            {
              title: 'Total Awarded',
              value: formatCurrency(metrics.overview.totalAwarded),
              trend: metrics.overview.trends.awarded,
              icon: DollarSign,
              color: 'from-yellow-500 to-yellow-600'
            }
          ].map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendIcon value={metric.trend} />
                    <span className={`text-sm font-medium ${
                      metric.trend > 0 ? 'text-green-400' : 
                      metric.trend < 0 ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {Math.abs(metric.trend)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {metric.title}
                  </div>
                </div>
              </Card>
            )
          })}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Case Activity Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Case Activity</h3>
              <div className="space-y-4">
                {metrics.cases.map((month, index) => (
                  <div key={month.month} className="flex items-center space-x-4">
                    <div className="w-12 text-slate-400 text-sm">{month.month}</div>
                    <div className="flex-1 flex items-center space-x-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-2 relative">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(month.filed / 30) * 100}%` }}
                        />
                        <div 
                          className="bg-green-500 h-2 rounded-full absolute top-0"
                          style={{ width: `${(month.won / 30) * 100}%` }}
                        />
                      </div>
                      <div className="text-slate-300 text-sm w-16">
                        {month.won}/{month.filed}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-slate-400 text-sm">Filed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-slate-400 text-sm">Won</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Top Conditions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Top Conditions</h3>
              <div className="space-y-4">
                {metrics.conditions.map((condition, index) => (
                  <div key={condition.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-purple-400 font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{condition.name}</div>
                        <div className="text-slate-400 text-sm">{condition.cases} cases</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">{condition.success}%</div>
                      <div className="text-slate-400 text-sm">{condition.avgRating}% avg</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { type: 'success', message: 'PTSD claim approved - 70% rating', time: '2 hours ago', icon: CheckCircle },
                { type: 'warning', message: 'C&P exam scheduled for Johnson case', time: '4 hours ago', icon: AlertTriangle },
                { type: 'success', message: 'Back pain claim - 40% rating awarded', time: '1 day ago', icon: CheckCircle },
                { type: 'info', message: 'New evidence received for Martinez case', time: '2 days ago', icon: FileText },
                { type: 'success', message: 'Sleep apnea claim approved - 50% rating', time: '3 days ago', icon: CheckCircle }
              ].map((activity, index) => {
                const Icon = activity.icon
                const colors = {
                  success: 'text-green-400 bg-green-500/20',
                  warning: 'text-yellow-400 bg-yellow-500/20',
                  info: 'text-blue-400 bg-blue-500/20'
                }
                
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[activity.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white">{activity.message}</div>
                      <div className="text-slate-400 text-sm">{activity.time}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics