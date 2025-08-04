import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { TrendingUp, TrendingDown, Users, FileText, Calendar, DollarSign, Award, Target, Clock, CheckCircle, AlertCircle, Zap, Cloud, Settings, X, ChevronRight, Home, BarChart3, Menu, Bell, HelpCircle, Filter, Download, Share2, RefreshCw, Eye, ArrowUp, ArrowDown, Minus, Plus, Activity, Briefcase, Scale, Mic, BookOpen, Camera, Database, PieChart as PieChartIcon, LineChart as LineChartIcon, BarChart as BarChartIcon } from 'lucide-react'

const ClaimAnalytics = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedTimeRange, setSelectedTimeRange] = useState('12months')
  const [selectedMetric, setSelectedMetric] = useState('success_rate')

  const sidebarNavigation = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Camera, label: "Camera OCR", path: "/camera-ocr" },
    { icon: BookOpen, label: "Legal Knowledge", path: "/legal-knowledge" },
    { icon: Target, label: "Claim Guidance", path: "/claim-guidance" },
    { icon: Mic, label: "Audio Transcription", path: "/audio-transcription" },
    { icon: Scale, label: "Case Research", path: "/case-research" },
    { icon: BarChart3, label: "Analytics", path: "/analytics", active: true }
  ]

  const welcomeSteps = [
    {
      title: "Welcome to Analytics Dashboard",
      description: "Comprehensive analytics and reporting to track your VA claims success, analyze patterns, and optimize your legal strategies.",
      features: ["Real-time performance metrics", "Success rate tracking", "Pattern analysis", "Custom report generation"]
    },
    {
      title: "Performance Insights",
      description: "Advanced analytics powered by AI to identify trends, predict outcomes, and provide actionable insights for your practice.",
      features: ["Predictive analytics", "Trend identification", "Outcome forecasting", "Strategy recommendations"]
    },
    {
      title: "Custom Reporting",
      description: "Generate professional reports for clients, partners, and stakeholders with comprehensive data visualization and insights.",
      features: ["Professional report templates", "Custom data visualization", "Export capabilities", "Automated reporting"]
    },
    {
      title: "Data-Driven Optimization",
      description: "Use comprehensive analytics to optimize your practice, improve success rates, and deliver better outcomes for Veterans.",
      features: ["Practice optimization", "Success rate improvement", "Resource allocation", "Performance benchmarking"]
    }
  ]

  // Sample analytics data
  const overviewMetrics = [
    { label: "Total Claims", value: "1,247", change: "+12%", trend: "up", icon: FileText, color: "text-blue-400" },
    { label: "Success Rate", value: "94.2%", change: "+2.1%", trend: "up", icon: Award, color: "text-green-400" },
    { label: "Active Cases", value: "156", change: "-8", trend: "down", icon: Clock, color: "text-yellow-400" },
    { label: "Avg. Processing Time", value: "127 days", change: "-15 days", trend: "up", icon: Calendar, color: "text-cyan-400" }
  ]

  const monthlySuccessData = [
    { month: 'Jan', success: 92, total: 45, denied: 8 },
    { month: 'Feb', success: 89, total: 52, denied: 11 },
    { month: 'Mar', success: 95, total: 48, denied: 5 },
    { month: 'Apr', success: 91, total: 58, denied: 9 },
    { month: 'May', success: 97, total: 62, denied: 3 },
    { month: 'Jun', success: 93, total: 55, denied: 7 },
    { month: 'Jul', success: 96, total: 67, denied: 4 },
    { month: 'Aug', success: 94, total: 71, denied: 6 },
    { month: 'Sep', success: 98, total: 64, denied: 2 },
    { month: 'Oct', success: 92, total: 59, denied: 8 },
    { month: 'Nov', success: 95, total: 73, denied: 5 },
    { month: 'Dec', success: 94, total: 68, denied: 6 }
  ]

  const claimTypeData = [
    { name: 'PTSD', value: 342, percentage: 27.4, color: '#06b6d4' },
    { name: 'Musculoskeletal', value: 289, percentage: 23.2, color: '#3b82f6' },
    { name: 'Hearing Loss', value: 187, percentage: 15.0, color: '#8b5cf6' },
    { name: 'TBI', value: 156, percentage: 12.5, color: '#10b981' },
    { name: 'Respiratory', value: 134, percentage: 10.7, color: '#f59e0b' },
    { name: 'Other', value: 139, percentage: 11.2, color: '#ef4444' }
  ]

  const processingTimeData = [
    { stage: 'Initial Filing', avgDays: 15, benchmark: 21, status: 'excellent' },
    { stage: 'Evidence Collection', avgDays: 45, benchmark: 60, status: 'good' },
    { stage: 'Medical Examination', avgDays: 32, benchmark: 45, status: 'excellent' },
    { stage: 'Decision Review', avgDays: 28, benchmark: 30, status: 'good' },
    { stage: 'Appeal Process', avgDays: 89, benchmark: 120, status: 'excellent' }
  ]

  const revenueData = [
    { month: 'Jan', revenue: 125000, cases: 45, avgValue: 2778 },
    { month: 'Feb', revenue: 142000, cases: 52, avgValue: 2731 },
    { month: 'Mar', revenue: 138000, cases: 48, avgValue: 2875 },
    { month: 'Apr', revenue: 165000, cases: 58, avgValue: 2845 },
    { month: 'May', revenue: 178000, cases: 62, avgValue: 2871 },
    { month: 'Jun', revenue: 159000, cases: 55, avgValue: 2891 },
    { month: 'Jul', revenue: 195000, cases: 67, avgValue: 2910 },
    { month: 'Aug', revenue: 208000, cases: 71, avgValue: 2930 },
    { month: 'Sep', revenue: 187000, cases: 64, avgValue: 2922 },
    { month: 'Oct', revenue: 172000, cases: 59, avgValue: 2915 },
    { month: 'Nov', revenue: 215000, cases: 73, avgValue: 2945 },
    { month: 'Dec', revenue: 198000, cases: 68, avgValue: 2912 }
  ]

  const topPerformingAttorneys = [
    { name: "Sarah Mitchell", cases: 89, successRate: 97.8, revenue: 245000, specialization: "PTSD Claims" },
    { name: "Michael Rodriguez", cases: 76, successRate: 96.1, revenue: 198000, specialization: "Appeals" },
    { name: "Jennifer Chen", cases: 82, successRate: 95.1, revenue: 212000, specialization: "TBI Claims" },
    { name: "David Thompson", cases: 71, successRate: 94.4, revenue: 186000, specialization: "Musculoskeletal" },
    { name: "Lisa Anderson", cases: 68, successRate: 93.8, revenue: 175000, specialization: "Hearing Loss" }
  ]

  useEffect(() => {
    if (showWelcomeModal && currentStep < 4) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, showWelcomeModal])

  const getStatusColor = (status) => {
    switch(status) {
      case 'excellent': return 'text-green-400 bg-green-500/20'
      case 'good': return 'text-blue-400 bg-blue-500/20'
      case 'warning': return 'text-yellow-400 bg-yellow-500/20'
      case 'poor': return 'text-red-400 bg-red-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'success' ? '%' : ''}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Left Sidebar Navigation */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-expert text-white">Analytics</h2>
                  <p className="text-xs text-slate-400">Performance Dashboard</p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {sidebarNavigation.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      item.active 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.a>
                ))}
              </div>
            </nav>

            {/* Analytics Summary */}
            <div className="p-4 border-t border-slate-700">
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">Quick Stats</span>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>This Month:</span>
                    <span className="text-green-400">68 cases</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="text-cyan-400">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <span className="text-blue-400">$198K</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Drive Integration */}
            <div className="p-4 border-t border-slate-700">
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Cloud className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">Google Drive</span>
                </div>
                <div className="text-xs text-slate-300 mb-2">
                  Connected: legal@lawfirm.com
                </div>
                <div className="text-xs text-slate-400">
                  Reports: 89 documents
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div>
                <h1 className="text-xl font-expert text-white">Claim Success Analytics</h1>
                <p className="text-sm text-slate-400">Comprehensive performance insights and reporting</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="12months">Last 12 Months</option>
                <option value="all">All Time</option>
              </select>
              
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <RefreshCw className="h-5 w-5 text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Download className="h-5 w-5 text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Settings className="h-5 w-5 text-slate-400" />
              </button>
              <button 
                onClick={() => setShowWelcomeModal(true)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <HelpCircle className="h-5 w-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-expert p-6 rounded-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-expert text-white flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-cyan-400" />
                  <span>Performance Analytics Dashboard</span>
                </h2>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 rounded-lg font-expert transition-colors ${
                      activeTab === 'overview' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('performance')}
                    className={`px-4 py-2 rounded-lg font-expert transition-colors ${
                      activeTab === 'performance' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Performance
                  </button>
                  <button
                    onClick={() => setActiveTab('revenue')}
                    className={`px-4 py-2 rounded-lg font-expert transition-colors ${
                      activeTab === 'revenue' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Revenue
                  </button>
                  <button
                    onClick={() => setActiveTab('team')}
                    className={`px-4 py-2 rounded-lg font-expert transition-colors ${
                      activeTab === 'team' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Team
                  </button>
                </div>
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid md:grid-cols-4 gap-6">
                    {overviewMetrics.map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-2 rounded-lg bg-slate-700 ${metric.color}`}>
                            <metric.icon className="h-5 w-5" />
                          </div>
                          <div className={`flex items-center space-x-1 text-sm ${
                            metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {metric.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            <span>{metric.change}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-expert text-white">{metric.value}</p>
                          <p className="text-sm text-slate-400">{metric.label}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Charts Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Success Rate Trend */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-expert text-white">Success Rate Trend</h3>
                        <LineChartIcon className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={monthlySuccessData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="success" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Claim Types Distribution */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-expert text-white">Claim Types Distribution</h3>
                        <PieChartIcon className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={claimTypeData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                              label={({ name, percentage }) => `${name} ${percentage}%`}
                            >
                              {claimTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Processing Time Analysis */}
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-expert text-white">Processing Time Analysis</h3>
                      <Clock className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div className="space-y-4">
                      {processingTimeData.map((stage, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-white">{stage.stage}</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(stage.status)}`}>
                                {stage.status}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-400">
                              <span>Avg: {stage.avgDays} days</span>
                              <span>Benchmark: {stage.benchmark} days</span>
                              <span className={stage.avgDays < stage.benchmark ? 'text-green-400' : 'text-yellow-400'}>
                                {stage.avgDays < stage.benchmark ? 'Under' : 'Over'} by {Math.abs(stage.avgDays - stage.benchmark)} days
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div className="space-y-6">
                  {/* Monthly Performance Chart */}
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-expert text-white">Monthly Performance Overview</h3>
                      <BarChartIcon className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlySuccessData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="total" fill="#3b82f6" name="Total Cases" />
                          <Bar dataKey="denied" fill="#ef4444" name="Denied Cases" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Performance Metrics Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Award className="h-6 w-6 text-green-400" />
                        <h3 className="text-lg font-expert text-white">Win Rate</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-expert text-green-400">94.2%</div>
                        <div className="text-sm text-slate-400">12-month average</div>
                        <div className="flex items-center space-x-2 text-sm">
                          <ArrowUp className="h-3 w-3 text-green-400" />
                          <span className="text-green-400">+2.1% from last year</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Clock className="h-6 w-6 text-cyan-400" />
                        <h3 className="text-lg font-expert text-white">Avg. Case Duration</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-expert text-cyan-400">127 days</div>
                        <div className="text-sm text-slate-400">From filing to decision</div>
                        <div className="flex items-center space-x-2 text-sm">
                          <ArrowDown className="h-3 w-3 text-green-400" />
                          <span className="text-green-400">-15 days improvement</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Target className="h-6 w-6 text-blue-400" />
                        <h3 className="text-lg font-expert text-white">Appeal Success</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-expert text-blue-400">87.5%</div>
                        <div className="text-sm text-slate-400">Appeals won</div>
                        <div className="flex items-center space-x-2 text-sm">
                          <ArrowUp className="h-3 w-3 text-green-400" />
                          <span className="text-green-400">+5.2% improvement</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Revenue Tab */}
              {activeTab === 'revenue' && (
                <div className="space-y-6">
                  {/* Revenue Trend Chart */}
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-expert text-white">Revenue Trend</h3>
                      <DollarSign className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${value/1000}K`} />
                          <Tooltip 
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
                                    <p className="text-white font-medium">{label}</p>
                                    <p className="text-green-400">Revenue: {formatCurrency(payload[0].value)}</p>
                                    <p className="text-blue-400">Cases: {payload[0].payload.cases}</p>
                                    <p className="text-cyan-400">Avg Value: {formatCurrency(payload[0].payload.avgValue)}</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.3} strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Revenue Metrics */}
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <DollarSign className="h-6 w-6 text-green-400" />
                        <h3 className="text-lg font-expert text-white">Total Revenue</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-expert text-green-400">$2.1M</div>
                        <div className="text-sm text-slate-400">12-month total</div>
                        <div className="flex items-center space-x-2 text-sm">
                          <ArrowUp className="h-3 w-3 text-green-400" />
                          <span className="text-green-400">+18.5% YoY</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Activity className="h-6 w-6 text-blue-400" />
                        <h3 className="text-lg font-expert text-white">Avg Case Value</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-expert text-blue-400">$2,875</div>
                        <div className="text-sm text-slate-400">Per successful case</div>
                        <div className="flex items-center space-x-2 text-sm">
                          <ArrowUp className="h-3 w-3 text-green-400" />
                          <span className="text-green-400">+$125 increase</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <TrendingUp className="h-6 w-6 text-cyan-400" />
                        <h3 className="text-lg font-expert text-white">Monthly Growth</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-expert text-cyan-400">12.3%</div>
                        <div className="text-sm text-slate-400">Average monthly</div>
                        <div className="flex items-center space-x-2 text-sm">
                          <ArrowUp className="h-3 w-3 text-green-400" />
                          <span className="text-green-400">Consistent growth</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Briefcase className="h-6 w-6 text-yellow-400" />
                        <h3 className="text-lg font-expert text-white">Active Value</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-expert text-yellow-400">$448K</div>
                        <div className="text-sm text-slate-400">156 active cases</div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Minus className="h-3 w-3 text-yellow-400" />
                          <span className="text-yellow-400">Pending resolution</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Team Tab */}
              {activeTab === 'team' && (
                <div className="space-y-6">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-expert text-white">Top Performing Attorneys</h3>
                      <Users className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div className="space-y-4">
                      {topPerformingAttorneys.map((attorney, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-expert text-lg">
                                {attorney.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-expert text-white">{attorney.name}</h4>
                              <p className="text-sm text-slate-400">{attorney.specialization}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-8">
                            <div className="text-center">
                              <div className="text-lg font-expert text-white">{attorney.cases}</div>
                              <div className="text-xs text-slate-400">Cases</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-expert text-green-400">{attorney.successRate}%</div>
                              <div className="text-xs text-slate-400">Success</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-expert text-blue-400">{formatCurrency(attorney.revenue)}</div>
                              <div className="text-xs text-slate-400">Revenue</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Team Performance Summary */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Users className="h-6 w-6 text-cyan-400" />
                        <h3 className="text-lg font-expert text-white">Team Size</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-expert text-cyan-400">12</div>
                        <div className="text-sm text-slate-400">Active attorneys</div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Plus className="h-3 w-3 text-green-400" />
                          <span className="text-green-400">2 new hires</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Award className="h-6 w-6 text-green-400" />
                        <h3 className="text-lg font-expert text-white">Team Average</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-expert text-green-400">95.1%</div>
                        <div className="text-sm text-slate-400">Success rate</div>
                        <div className="flex items-center space-x-2 text-sm">
                          <ArrowUp className="h-3 w-3 text-green-400" />
                          <span className="text-green-400">Above industry</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Activity className="h-6 w-6 text-blue-400" />
                        <h3 className="text-lg font-expert text-white">Productivity</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-expert text-blue-400">73</div>
                        <div className="text-sm text-slate-400">Cases per attorney</div>
                        <div className="flex items-center space-x-2 text-sm">
                          <ArrowUp className="h-3 w-3 text-green-400" />
                          <span className="text-green-400">+8% efficiency</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-8 max-w-2xl w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-expert text-white">
                  {welcomeSteps[currentStep - 1].title}
                </h2>
                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <p className="text-slate-300 mb-6">
                {welcomeSteps[currentStep - 1].description}
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {welcomeSteps[currentStep - 1].features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-cyan-400" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {welcomeSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index + 1 === currentStep ? 'bg-cyan-400' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  {currentStep < 4 ? (
                    <motion.button
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="gradient-trust px-6 py-2 rounded-lg font-expert flex items-center space-x-2 hover-expert"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => setShowWelcomeModal(false)}
                      className="gradient-trust px-6 py-2 rounded-lg font-expert hover-expert"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Analytics
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ClaimAnalytics

