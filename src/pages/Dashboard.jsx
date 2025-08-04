import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Camera, BookOpen, FileText, Mic, Search, BarChart3,
  TrendingUp, Users, Clock, CheckCircle, AlertCircle,
  Calendar, DollarSign, Briefcase, Award
} from 'lucide-react'
import Layout from '../components/Layout'

const Dashboard = () => {
  // Mock data for dashboard stats
  const stats = [
    { label: 'Active Cases', value: '47', icon: Briefcase, trend: '+12%', color: 'from-cyan-500 to-blue-600' },
    { label: 'Success Rate', value: '89%', icon: TrendingUp, trend: '+5%', color: 'from-green-500 to-emerald-600' },
    { label: 'Avg. Processing Time', value: '18 days', icon: Clock, trend: '-3 days', color: 'from-purple-500 to-pink-600' },
    { label: 'Total Compensation', value: '$2.4M', icon: DollarSign, trend: '+$450K', color: 'from-yellow-500 to-orange-600' },
  ]

  const recentCases = [
    { id: 1, client: 'John Smith', type: 'PTSD Claim', status: 'In Progress', date: '2024-01-15', completion: 75 },
    { id: 2, client: 'Mary Johnson', type: 'Disability Increase', status: 'Under Review', date: '2024-01-14', completion: 60 },
    { id: 3, client: 'Robert Davis', type: 'Appeal', status: 'Submitted', date: '2024-01-13', completion: 90 },
    { id: 4, client: 'Patricia Wilson', type: 'Initial Claim', status: 'Gathering Evidence', date: '2024-01-12', completion: 40 },
  ]

  const tools = [
    { 
      title: 'Camera OCR', 
      description: 'Digitize VA forms and medical records instantly',
      icon: Camera, 
      href: '/camera-ocr',
      color: 'from-cyan-500 to-blue-600',
      stats: '2,341 documents processed'
    },
    { 
      title: 'Legal Knowledge Base', 
      description: 'Access 14,500+ VA regulations and precedents',
      icon: BookOpen, 
      href: '/legal-knowledge',
      color: 'from-blue-500 to-indigo-600',
      stats: '98% search accuracy'
    },
    { 
      title: 'Claim Guidance', 
      description: 'AI-powered step-by-step filing assistance',
      icon: FileText, 
      href: '/claim-guidance',
      color: 'from-purple-500 to-pink-600',
      stats: '156 claims filed this month'
    },
    { 
      title: 'Audio Transcription', 
      description: 'Convert consultations to searchable text',
      icon: Mic, 
      href: '/audio-transcription',
      color: 'from-green-500 to-emerald-600',
      stats: '412 hours transcribed'
    },
    { 
      title: 'Case Research', 
      description: 'Find relevant precedents in seconds',
      icon: Search, 
      href: '/case-research',
      color: 'from-orange-500 to-red-600',
      stats: '10,000+ cases indexed'
    },
    { 
      title: 'Analytics', 
      description: 'Track success rates and performance metrics',
      icon: BarChart3, 
      href: '/analytics',
      color: 'from-yellow-500 to-orange-600',
      stats: 'Real-time insights'
    },
  ]

  return (
    <Layout>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Sarah</h1>
            <p className="text-slate-300">Here's what's happening with your VA claims today</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-green-400 text-sm font-medium">{stat.trend}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </motion.div>
              )
            })}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Cases */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Recent Cases</h2>
                <Link to="/cases" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                  View all cases
                </Link>
              </div>
              <div className="space-y-4">
                {recentCases.map((case_item) => (
                  <div key={case_item.id} className="bg-slate-700/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-white font-medium">{case_item.client}</h3>
                        <p className="text-slate-400 text-sm">{case_item.type}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          case_item.status === 'Submitted' ? 'bg-green-500/20 text-green-400' :
                          case_item.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                          case_item.status === 'Under Review' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {case_item.status}
                        </span>
                        <p className="text-slate-500 text-xs mt-1">{case_item.date}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{case_item.completion}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${case_item.completion}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
            >
              <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium py-3 px-4 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 flex items-center justify-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Start New Claim</span>
                </button>
                <button className="w-full bg-slate-700/50 text-white font-medium py-3 px-4 rounded-xl hover:bg-slate-700/70 transition-all duration-300 flex items-center justify-center space-x-2 border border-slate-600">
                  <Camera className="h-5 w-5" />
                  <span>Upload Documents</span>
                </button>
                <button className="w-full bg-slate-700/50 text-white font-medium py-3 px-4 rounded-xl hover:bg-slate-700/70 transition-all duration-300 flex items-center justify-center space-x-2 border border-slate-600">
                  <Calendar className="h-5 w-5" />
                  <span>Schedule Consultation</span>
                </button>
                <button className="w-full bg-slate-700/50 text-white font-medium py-3 px-4 rounded-xl hover:bg-slate-700/70 transition-all duration-300 flex items-center justify-center space-x-2 border border-slate-600">
                  <Search className="h-5 w-5" />
                  <span>Search Precedents</span>
                </button>
              </div>

              {/* Upcoming Deadlines */}
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <h3 className="text-white font-medium mb-3">Upcoming Deadlines</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-white">Smith Appeal Response</p>
                      <p className="text-xs text-slate-400">Due in 2 days</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-4 w-4 text-yellow-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-white">Johnson Evidence Submission</p>
                      <p className="text-xs text-slate-400">Due in 5 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tools Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">AI-Powered Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => {
                const Icon = tool.icon
                return (
                  <motion.div
                    key={tool.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    <Link
                      to={tool.href}
                      className="group block bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300"
                    >
                      <div className={`w-14 h-14 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
                      <p className="text-slate-300 text-sm mb-3">{tool.description}</p>
                      <p className="text-cyan-400 text-xs font-medium">{tool.stats}</p>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard