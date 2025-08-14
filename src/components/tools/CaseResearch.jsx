import React, { useState } from 'react'
import { Search, FileText, Scale, Calendar, Filter, Download, BookOpen, TrendingUp, ChevronRight, Clock, User } from 'lucide-react'
import { motion } from 'framer-motion'

const CaseResearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [searchResults, setSearchResults] = useState([])

  const categories = [
    { id: 'all', label: 'All Categories', count: 15234 },
    { id: 'ptsd', label: 'PTSD Claims', count: 3456 },
    { id: 'tbi', label: 'TBI Cases', count: 2145 },
    { id: 'hearing', label: 'Hearing Loss', count: 1892 },
    { id: 'mst', label: 'MST Claims', count: 1234 },
    { id: 'secondary', label: 'Secondary Conditions', count: 2987 },
  ]

  const recentCases = [
    {
      id: 1,
      title: 'Smith v. Secretary of Veterans Affairs',
      court: 'CAVC',
      date: '2024-03-15',
      summary: 'Established new precedent for PTSD stressor verification in combat veterans',
      outcome: 'Remanded',
      relevance: 94,
      citations: 234,
    },
    {
      id: 2,
      title: 'Johnson v. Wilkie',
      court: 'Federal Circuit',
      date: '2024-02-28',
      summary: 'Clarified the standard for secondary service connection in TBI cases',
      outcome: 'Reversed',
      relevance: 89,
      citations: 189,
    },
    {
      id: 3,
      title: 'Davis v. McDonough',
      court: 'BVA',
      date: '2024-03-01',
      summary: 'Addressed the adequacy of C&P examinations for hearing loss claims',
      outcome: 'Granted',
      relevance: 86,
      citations: 145,
    },
    {
      id: 4,
      title: 'Williams v. Secretary of VA',
      court: 'CAVC',
      date: '2024-02-15',
      summary: 'Set guidelines for evaluating lay evidence in MST claims',
      outcome: 'Remanded',
      relevance: 82,
      citations: 98,
    },
  ]

  const handleSearch = () => {
    // Simulate search
    setSearchResults(recentCases.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600/80 to-indigo-800/80 rounded-xl flex items-center justify-center">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Case Research</h1>
              <p className="text-slate-400">Search through 15,000+ VA case precedents and decisions</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 mb-6"
        >
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search cases by name, keyword, or citation..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
            >
              Search Cases
            </button>
          </div>

          {/* Filters */}
          <div className="flex space-x-4 mt-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors">
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
            </button>
          </div>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Cases', value: '15,234', icon: Scale, color: 'from-blue-500 to-cyan-600' },
            { label: 'Success Rate', value: '67%', icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
            { label: 'Recent Updates', value: '342', icon: Clock, color: 'from-purple-500 to-pink-600' },
            { label: 'Saved Searches', value: '12', icon: BookOpen, color: 'from-orange-500 to-red-600' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Cases */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Precedential Cases</h2>
            <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
              View All Cases
            </button>
          </div>

          <div className="space-y-4">
            {recentCases.map((caseItem, index) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 hover:border-indigo-500 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {caseItem.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        caseItem.outcome === 'Granted' ? 'bg-green-500/20 text-green-400' :
                        caseItem.outcome === 'Remanded' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {caseItem.outcome}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">{caseItem.summary}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Scale className="h-3 w-3" />
                        <span>{caseItem.court}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{caseItem.date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>{caseItem.citations} citations</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Relevance</p>
                      <p className="text-lg font-bold text-indigo-400">{caseItem.relevance}%</p>
                    </div>
                    <button className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors group-hover:bg-indigo-600">
                      <ChevronRight className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-xl rounded-xl border border-slate-700 transition-all duration-300">
            <Download className="h-5 w-5 text-indigo-400" />
            <span className="text-white">Export Results</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-xl rounded-xl border border-slate-700 transition-all duration-300">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            <span className="text-white">Citation Builder</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-xl rounded-xl border border-slate-700 transition-all duration-300">
            <User className="h-5 w-5 text-indigo-400" />
            <span className="text-white">Expert Analysis</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CaseResearch