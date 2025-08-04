import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import NavigationSidebar from './NavigationSidebar'
import { BookOpen, Search, Filter, Star, Download, Eye, ExternalLink, Tag, Calendar, User, Clock, CheckCircle, AlertCircle, Zap, Cloud, Settings, X, Play, ChevronRight, Home, Camera, Mic, Scale, BarChart3, Menu, Bell, HelpCircle, HardDrive, Users, FileText, Shield, Bookmark, History, TrendingUp, Award } from 'lucide-react'

const LegalKnowledgeBase = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [bookmarkedItems, setBookmarkedItems] = useState([])
  const [recentSearches, setRecentSearches] = useState(['PTSD reasonable doubt', 'Service connection nexus', 'VASRD rating criteria'])
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeTab, setActiveTab] = useState('search')

  const currentTool = {
    name: "Legal Knowledge Base",
    stats: {
      totalDocuments: 2847,
      recentUpdates: 15,
      bookmarked: 0
    },
    googleDrive: {
      connected: true,
      email: "legal@lawfirm.com",
      savedDocuments: 847
    }
  }

  const toolStats = {
    totalDocuments: 2847,
    recentUpdates: 15,
    bookmarked: 0
  }

  const welcomeSteps = [
    {
      title: "Welcome to Legal Knowledge Base",
      description: "Access the most comprehensive VA legal database designed specifically for disability claims attorneys.",
      features: ["2,500+ CFR regulations", "1,200+ M21 procedures", "800+ VASRD codes", "10,000+ case precedents"]
    },
    {
      title: "Advanced Search & Research",
      description: "Find relevant legal information instantly with AI-powered search and intelligent categorization.",
      features: ["Smart search suggestions", "Legal citation formatting", "Cross-reference linking", "Relevance scoring"]
    },
    {
      title: "Expert Annotations",
      description: "Every document includes expert commentary and practical guidance from VA legal specialists.",
      features: ["Expert insights", "Practice tips", "Common pitfalls", "Success strategies"]
    },
    {
      title: "Stay Updated",
      description: "Automatic updates ensure you always have access to the latest regulations and legal developments.",
      features: ["Real-time updates", "Change notifications", "Version tracking", "Historical comparisons"]
    }
  ]

  const legalDatabase = [
    {
      id: 1,
      title: "38 CFR § 3.303 - Principles relating to service connection",
      category: "CFR",
      type: "Regulation",
      confidence: 98,
      lastUpdated: "2024-01-15",
      tags: ["Service Connection", "Evidence", "Presumption"],
      summary: "Establishes the fundamental principles for determining service connection for disabilities and deaths.",
      link: "https://www.ecfr.gov/current/title-38/chapter-I/part-3/subpart-A/section-3.303",
      expertCommentary: "Critical regulation for establishing the foundation of any VA disability claim. Pay special attention to the three ways to establish service connection.",
      bookmarked: false
    },
    {
      id: 2,
      title: "M21-1 IV.ii.1.D.1.a - Development of PTSD Claims",
      category: "M21",
      type: "Procedure",
      confidence: 95,
      lastUpdated: "2024-01-10",
      tags: ["PTSD", "Development", "Evidence"],
      summary: "Provides detailed procedures for developing PTSD claims including stressor verification requirements.",
      link: "https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018/content/554400000014088/M21-1-Part-IV-Subpart-ii-Chapter-1-Section-D-Rating-Disabilities",
      expertCommentary: "Essential for PTSD claims. Note the different evidence requirements for combat vs. non-combat stressors.",
      bookmarked: false
    },
    {
      id: 3,
      title: "38 CFR § 4.16 - Total disability ratings for compensation based on unemployability",
      category: "VASRD",
      type: "Rating",
      confidence: 92,
      lastUpdated: "2024-01-08",
      tags: ["TDIU", "Unemployability", "Rating"],
      summary: "Criteria for awarding total disability ratings based on individual unemployability (TDIU).",
      link: "https://www.ecfr.gov/current/title-38/chapter-I/part-4/section-4.16",
      expertCommentary: "Key regulation for TDIU claims. Remember the 60/70 rule and the importance of vocational evidence.",
      bookmarked: false
    },
    {
      id: 4,
      title: "Shedden v. Principi, 381 F.3d 1163 (Fed. Cir. 2004)",
      category: "Case Law",
      type: "Precedent",
      confidence: 89,
      lastUpdated: "2024-01-05",
      tags: ["Effective Date", "Clear and Unmistakable Error"],
      summary: "Federal Circuit decision on effective dates for claims involving clear and unmistakable error.",
      link: "https://casetext.com/case/shedden-v-principi",
      expertCommentary: "Important precedent for CUE claims. Establishes that effective date should be the date entitlement arose, not the date of the CUE decision.",
      bookmarked: false
    },
    {
      id: 5,
      title: "38 CFR § 3.159 - Department of Veterans Affairs assistance in developing claims",
      category: "CFR",
      type: "Regulation",
      confidence: 96,
      lastUpdated: "2024-01-12",
      tags: ["Duty to Assist", "Development", "Evidence"],
      summary: "Outlines VA's duty to assist veterans in developing their claims and obtaining evidence.",
      link: "https://www.ecfr.gov/current/title-38/chapter-I/part-3/subpart-A/section-3.159",
      expertCommentary: "Fundamental regulation establishing VA's duty to assist. Critical for ensuring proper claim development.",
      bookmarked: false
    }
  ]

  const categories = [
    { id: 'all', name: 'All Documents', count: 14500 },
    { id: 'cfr', name: 'CFR Regulations', count: 2500 },
    { id: 'm21', name: 'M21 Procedures', count: 1200 },
    { id: 'vasrd', name: 'VASRD Codes', count: 800 },
    { id: 'case-law', name: 'Case Law', count: 10000 }
  ]

  const filteredDocuments = legalDatabase.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || 
                           doc.category.toLowerCase() === selectedCategory.replace('-', ' ')
    
    return matchesSearch && matchesCategory
  })

  const toggleBookmark = (docId) => {
    setBookmarkedItems(prev => {
      const isBookmarked = prev.includes(docId)
      if (isBookmarked) {
        return prev.filter(id => id !== docId)
      } else {
        return [...prev, docId]
      }
    })
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (term && !recentSearches.includes(term)) {
      setRecentSearches(prev => [term, ...prev.slice(0, 4)])
    }
  }

  const nextStep = () => {
    if (currentStep < welcomeSteps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowWelcomeModal(false)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-slate-700 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{welcomeSteps[currentStep - 1].title}</h2>
                    <p className="text-slate-400">Step {currentStep} of {welcomeSteps.length}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <div className="mb-8">
                <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                  {welcomeSteps[currentStep - 1].description}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {welcomeSteps[currentStep - 1].features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {welcomeSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index + 1 === currentStep ? 'bg-cyan-500' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  {currentStep > 1 && (
                    <button
                      onClick={prevStep}
                      className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-colors"
                  >
                    {currentStep === welcomeSteps.length ? 'Get Started' : 'Next'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Sidebar */}
      <NavigationSidebar 
        currentTool={currentTool}
        toolStats={toolStats}
        showSidebar={showSidebar}
      />

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
                <h1 className="text-xl font-bold text-white">VA Legal Knowledge Base</h1>
                <p className="text-sm text-slate-400">Comprehensive legal database for VA disability claims</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Bell className="h-5 w-5 text-slate-400" />
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
          {/* Search Section */}
          <div className="mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search CFR regulations, M21 procedures, VASRD codes, case law..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(search)}
                      className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {category.name} ({category.count.toLocaleString()})
                </button>
              ))}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Search Results ({filteredDocuments.length.toLocaleString()})
              </h2>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Document Cards */}
            <div className="grid gap-6">
              {filteredDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          doc.category === 'CFR' ? 'bg-cyan-500/20 text-cyan-400' :
                          doc.category === 'M21' ? 'bg-blue-500/20 text-blue-400' :
                          doc.category === 'VASRD' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {doc.category}
                        </span>
                        <span className="text-xs text-slate-400">{doc.type}</span>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            doc.confidence >= 95 ? 'bg-green-400' :
                            doc.confidence >= 90 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}></div>
                          <span className="text-xs text-slate-400">{doc.confidence}% confidence</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2 hover:text-cyan-400 transition-colors cursor-pointer">
                        {doc.title}
                      </h3>
                      
                      <p className="text-slate-300 mb-4 leading-relaxed">
                        {doc.summary}
                      </p>
                      
                      <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
                        <div className="flex items-start space-x-2">
                          <Award className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-yellow-400 mb-1">Expert Commentary</p>
                            <p className="text-sm text-slate-300">{doc.expertCommentary}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {doc.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-slate-600/50 text-slate-300 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Last updated: {doc.lastUpdated}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => toggleBookmark(doc.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          bookmarkedItems.includes(doc.id)
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }`}
                      >
                        <Star className={`h-4 w-4 ${bookmarkedItems.includes(doc.id) ? 'fill-current' : ''}`} />
                      </button>
                      
                      <a
                        href={doc.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-700 text-slate-400 rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      
                      <button className="p-2 bg-slate-700 text-slate-400 rounded-lg hover:bg-slate-600 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LegalKnowledgeBase

