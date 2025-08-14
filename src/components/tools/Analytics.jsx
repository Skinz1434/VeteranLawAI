import React, { useState } from 'react'
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, Filter, ChevronUp, ChevronDown, Activity, Target, Award, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('success_rate')

  // Chart data
  const successRateData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Success Rate',
      data: [65, 68, 72, 71, 74, 78],
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  }

  const claimTypesData = {
    labels: ['PTSD', 'TBI', 'Hearing Loss', 'Back Pain', 'MST', 'Other'],
    datasets: [{
      label: 'Claims by Type',
      data: [342, 256, 198, 167, 89, 234],
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(107, 114, 128, 0.8)',
      ],
    }]
  }

  const processingTimeData = {
    labels: ['0-30 days', '31-60 days', '61-90 days', '91-120 days', '120+ days'],
    datasets: [{
      label: 'Processing Time',
      data: [45, 78, 112, 89, 34],
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'rgb(203, 213, 225)'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleColor: 'rgb(203, 213, 225)',
        bodyColor: 'rgb(203, 213, 225)',
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: 'rgb(148, 163, 184)'
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: 'rgb(148, 163, 184)'
        }
      }
    }
  }

  const keyMetrics = [
    {
      title: 'Total Cases',
      value: '1,286',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Success Rate',
      value: '78%',
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Avg. Award',
      value: '$45,230',
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Avg. Processing',
      value: '62 days',
      change: '-15%',
      trend: 'down',
      icon: Clock,
      color: 'from-orange-500 to-red-600'
    }
  ]

  const recentActivity = [
    { case: 'Smith v. VA', status: 'Won', amount: '$52,000', date: '2024-03-15' },
    { case: 'Johnson v. VA', status: 'Pending', amount: '-', date: '2024-03-14' },
    { case: 'Williams v. VA', status: 'Won', amount: '$38,500', date: '2024-03-13' },
    { case: 'Davis v. VA', status: 'Lost', amount: '-', date: '2024-03-12' },
    { case: 'Miller v. VA', status: 'Won', amount: '$67,200', date: '2024-03-11' },
  ]

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600/80 to-violet-800/80 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Success Analytics</h1>
                <p className="text-slate-400">Track performance metrics and case outcomes</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {keyMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center`}>
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <span>{metric.change}</span>
                  {metric.trend === 'up' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
              <h3 className="text-slate-400 text-sm mb-1">{metric.title}</h3>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Success Rate Trend */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Success Rate Trend</h3>
            <div style={{ height: '300px' }}>
              <Line data={successRateData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Claims by Type */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Claims by Type</h3>
            <div style={{ height: '300px' }}>
              <Doughnut data={claimTypesData} options={{...chartOptions, maintainAspectRatio: false}} />
            </div>
          </motion.div>
        </div>

        {/* Processing Time Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Processing Time Distribution</h3>
          <div style={{ height: '250px' }}>
            <Bar data={processingTimeData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Recent Activity Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Case Activity</h3>
            <button className="text-violet-400 hover:text-violet-300 transition-colors">
              View All Cases
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Case</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Award</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity, index) => (
                  <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                    <td className="py-3 px-4 text-white">{activity.case}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        activity.status === 'Won' ? 'bg-green-500/20 text-green-400' :
                        activity.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white">{activity.amount}</td>
                    <td className="py-3 px-4 text-slate-400">{activity.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-green-400 font-semibold">Top Performance</p>
                <p className="text-white text-sm">PTSD claims showing 85% success rate</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-xl rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-semibold">Needs Attention</p>
                <p className="text-white text-sm">TBI cases taking 25% longer to process</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-purple-400 font-semibold">Achievement</p>
                <p className="text-white text-sm">$4.2M total awarded this quarter</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics