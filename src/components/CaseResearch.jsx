import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, BookOpen, ExternalLink, Calendar, User, Clock, CheckCircle, AlertCircle, Zap, Cloud, Settings, X, ChevronRight, Home, FileText, Scale, BarChart3, Menu, Bell, HelpCircle, Tag, Bookmark, History, TrendingUp, Award, Shield, Target, ArrowRight, Plus, Edit, Trash2, AlertTriangle, Info, ChevronDown, ChevronUp, Star, Eye, Download, Copy, Share2, Mic, Users, MessageSquare, FileSearch, Gavel, BookMarked, Archive, Link, Quote, Layers, Database } from 'lucide-react'

const CaseResearch = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    court: 'all',
    year: 'all',
    category: 'all',
    outcome: 'all'
  })
  const [selectedCase, setSelectedCase] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeTab, setActiveTab] = useState('search')
  const [bookmarkedCases, setBookmarkedCases] = useState([])
  const [searchHistory, setSearchHistory] = useState([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const sidebarNavigation = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: FileText, label: "Camera OCR", path: "/camera-ocr" },
    { icon: BookOpen, label: "Legal Knowledge", path: "/legal-knowledge" },
    { icon: Target, label: "Claim Guidance", path: "/claim-guidance" },
    { icon: Mic, label: "Audio Transcription", path: "/audio-transcription" },
    { icon: Scale, label: "Case Research", path: "/case-research", active: true },
    { icon: BarChart3, label: "Analytics", path: "/analytics" }
  ]

  const welcomeSteps = [
    {
      title: "Welcome to Case Research",
      description: "Access the most comprehensive database of VA legal precedents with AI-powered search and analysis capabilities.",
      features: ["10,000+ legal precedents", "AI-powered relevance matching", "Advanced citation management", "Real-time case updates"]
    },
    {
      title: "Research Methodology",
      description: "Our advanced search algorithms analyze case facts, legal principles, and outcomes to find the most relevant precedents.",
      features: ["Semantic search technology", "Legal principle matching", "Outcome prediction", "Citation network analysis"]
    },
    {
      title: "Citation Management",
      description: "Professional citation tools with automatic formatting and bibliography generation for legal briefs and motions.",
      features: ["Bluebook citation format", "Automatic bibliography", "Export to legal software", "Version tracking"]
    },
    {
      title: "Collaboration Tools",
      description: "Share research findings with your team, add annotations, and maintain collaborative research workflows.",
      features: ["Team sharing", "Research annotations", "Collaborative bookmarks", "Research history tracking"]
    }
  ]

  // Sample case data
  const [cases, setCases] = useState([
    {
      id: 1,
      title: "Smith v. Department of Veterans Affairs",
      citation: "32 Vet.App. 123 (2020)",
      court: "Court of Appeals for Veterans Claims",
      date: "2020-03-15",
      category: "PTSD Service Connection",
      outcome: "Veteran Prevailed",
      relevanceScore: 98,
      keyFacts: [
        "Combat veteran with PTSD symptoms",
        "Multiple stressor events during deployment", 
        "Nexus opinion from treating psychiatrist",
        "VA examination found insufficient evidence"
      ],
      legalPrinciples: [
        "Benefit of the doubt standard",
        "Lay testimony competency for PTSD symptoms",
        "Nexus requirement for service connection",
        "Duty to assist in obtaining evidence"
      ],
      holding: "The Board erred in failing to apply the benefit of the doubt rule when the evidence was in approximate balance regarding the nexus between the veteran's PTSD and military service.",
      summary: "Veteran appealed Board decision denying service connection for PTSD. The Court found that the Board failed to properly weigh lay testimony and medical evidence, and remanded for proper application of the benefit of the doubt standard.",
      tags: ["PTSD", "Service Connection", "Benefit of Doubt", "Nexus", "Lay Testimony"],
      bookmarked: false,
      downloadUrl: "/cases/smith_v_dva_2020.pdf",
      relatedCases: [2, 3, 5],
      citedBy: 47,
      shepardSignal: "positive"
    },
    {
      id: 2,
      title: "Rodriguez v. Wilkie",
      citation: "31 Vet.App. 456 (2019)",
      court: "Court of Appeals for Veterans Claims",
      date: "2019-11-22",
      category: "Effective Date",
      outcome: "Veteran Prevailed",
      relevanceScore: 94,
      keyFacts: [
        "Informal claim filed in 2015",
        "Formal claim filed in 2017",
        "VA granted service connection in 2018",
        "Effective date assigned as 2017"
      ],
      legalPrinciples: [
        "Informal claim doctrine",
        "Effective date rules",
        "Intent to file application",
        "Duty to assist in claim development"
      ],
      holding: "An informal claim that reasonably identifies a benefit sought and a medical condition can establish an earlier effective date when the formal claim is later granted.",
      summary: "The Court held that the veteran's 2015 correspondence constituted an informal claim for PTSD benefits, establishing an effective date two years earlier than the VA's assignment.",
      tags: ["Effective Date", "Informal Claim", "PTSD", "Intent to File"],
      bookmarked: true,
      downloadUrl: "/cases/rodriguez_v_wilkie_2019.pdf",
      relatedCases: [1, 4, 6],
      citedBy: 32,
      shepardSignal: "positive"
    },
    {
      id: 3,
      title: "Johnson v. McDonough",
      citation: "33 Vet.App. 789 (2021)",
      court: "Court of Appeals for Veterans Claims",
      date: "2021-07-08",
      category: "Individual Unemployability",
      outcome: "VA Prevailed",
      relevanceScore: 91,
      keyFacts: [
        "Veteran with 70% combined rating",
        "Unable to maintain substantially gainful employment",
        "History of part-time work attempts",
        "Medical evidence of functional limitations"
      ],
      legalPrinciples: [
        "Total disability individual unemployability",
        "Substantially gainful employment standard",
        "Marginal employment doctrine",
        "Functional impact of disabilities"
      ],
      holding: "The ability to perform marginal employment does not preclude entitlement to TDIU when the veteran cannot maintain substantially gainful employment due to service-connected disabilities.",
      summary: "Veteran appealed denial of TDIU benefits. The Court clarified the standard for substantially gainful employment and remanded for proper consideration of the veteran's work history and functional limitations.",
      tags: ["TDIU", "Individual Unemployability", "Substantially Gainful Employment"],
      bookmarked: false,
      downloadUrl: "/cases/johnson_v_mcdonough_2021.pdf",
      relatedCases: [1, 7, 8],
      citedBy: 28,
      shepardSignal: "positive"
    },
    {
      id: 4,
      title: "Williams v. Shulkin",
      citation: "30 Vet.App. 234 (2018)",
      court: "Court of Appeals for Veterans Claims",
      date: "2018-05-14",
      category: "Clear and Unmistakable Error",
      outcome: "Veteran Prevailed",
      relevanceScore: 89,
      keyFacts: [
        "Prior final Board decision in 2010",
        "New medical evidence submitted in 2016",
        "VA denied CUE motion",
        "Evidence clearly contradicted prior findings"
      ],
      legalPrinciples: [
        "Clear and unmistakable error standard",
        "Finality of Board decisions",
        "Undebatable error requirement",
        "Factual versus legal error"
      ],
      holding: "A Board decision contains clear and unmistakable error when it is based on an incorrect factual finding that is undebatable and outcome-determinative.",
      summary: "The Court found that the Board's 2010 decision contained CUE because it relied on a medical opinion that was clearly contradicted by the veteran's service medical records.",
      tags: ["Clear and Unmistakable Error", "CUE", "Board Decision", "Medical Evidence"],
      bookmarked: true,
      downloadUrl: "/cases/williams_v_shulkin_2018.pdf",
      relatedCases: [2, 5, 9],
      citedBy: 41,
      shepardSignal: "positive"
    },
    {
      id: 5,
      title: "Davis v. Principi",
      citation: "19 Vet.App. 567 (2006)",
      court: "Court of Appeals for Veterans Claims",
      date: "2006-02-28",
      category: "Duty to Assist",
      outcome: "Veteran Prevailed",
      relevanceScore: 87,
      keyFacts: [
        "Veteran claimed service connection for hearing loss",
        "VA failed to obtain service medical records",
        "Private medical records showed in-service treatment",
        "VA examination found no service connection"
      ],
      legalPrinciples: [
        "Duty to assist in obtaining evidence",
        "Adequate VA examination requirement",
        "Service medical records importance",
        "Prejudicial error standard"
      ],
      holding: "The VA's failure to obtain relevant service medical records constitutes a breach of the duty to assist that requires remand when the error is prejudicial.",
      summary: "The Court found that VA's failure to obtain complete service medical records was prejudicial error requiring remand for proper development of the claim.",
      tags: ["Duty to Assist", "Service Medical Records", "VA Examination", "Hearing Loss"],
      bookmarked: false,
      downloadUrl: "/cases/davis_v_principi_2006.pdf",
      relatedCases: [1, 4, 10],
      citedBy: 156,
      shepardSignal: "positive"
    }
  ])

  const courts = ["All Courts", "Court of Appeals for Veterans Claims", "Federal Circuit", "Supreme Court"]
  const years = ["All Years", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"]
  const categories = ["All Categories", "PTSD Service Connection", "Effective Date", "Individual Unemployability", "Clear and Unmistakable Error", "Duty to Assist", "Rating Criteria", "Presumptive Conditions"]
  const outcomes = ["All Outcomes", "Veteran Prevailed", "VA Prevailed", "Remanded", "Dismissed"]

  useEffect(() => {
    if (showWelcomeModal && currentStep < 4) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, showWelcomeModal])

  const handleSearch = (query) => {
    if (query.trim()) {
      setSearchHistory(prev => [query, ...prev.filter(h => h !== query)].slice(0, 10))
    }
  }

  const toggleBookmark = (caseId) => {
    setCases(prev => prev.map(c => 
      c.id === caseId ? { ...c, bookmarked: !c.bookmarked } : c
    ))
    
    const case_ = cases.find(c => c.id === caseId)
    if (case_ && !case_.bookmarked) {
      setBookmarkedCases(prev => [...prev, case_])
    } else {
      setBookmarkedCases(prev => prev.filter(c => c.id !== caseId))
    }
  }

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = searchQuery === '' || 
      case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      case_.summary.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCourt = selectedFilters.court === 'all' || case_.court === selectedFilters.court
    const matchesYear = selectedFilters.year === 'all' || case_.date.startsWith(selectedFilters.year)
    const matchesCategory = selectedFilters.category === 'all' || case_.category === selectedFilters.category
    const matchesOutcome = selectedFilters.outcome === 'all' || case_.outcome === selectedFilters.outcome
    
    return matchesSearch && matchesCourt && matchesYear && matchesCategory && matchesOutcome
  }).sort((a, b) => b.relevanceScore - a.relevanceScore)

  const getShepardColor = (signal) => {
    switch(signal) {
      case 'positive': return 'text-green-400 bg-green-500/20'
      case 'negative': return 'text-red-400 bg-red-500/20'
      case 'questioned': return 'text-yellow-400 bg-yellow-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  const getOutcomeColor = (outcome) => {
    switch(outcome) {
      case 'Veteran Prevailed': return 'text-green-400 bg-green-500/20'
      case 'VA Prevailed': return 'text-red-400 bg-red-500/20'
      case 'Remanded': return 'text-blue-400 bg-blue-500/20'
      case 'Dismissed': return 'text-slate-400 bg-slate-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
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
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-expert text-white">Case Research</h2>
                  <p className="text-xs text-slate-400">Legal Precedent Database</p>
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

            {/* Research Stats */}
            <div className="p-4 border-t border-slate-700">
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Scale className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">Research Stats</span>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Total Cases:</span>
                    <span className="text-cyan-400">10,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bookmarked:</span>
                    <span className="text-green-400">{bookmarkedCases.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recent Searches:</span>
                    <span className="text-blue-400">{searchHistory.length}</span>
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
                  Research Files: 234 documents
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
                <h1 className="text-xl font-expert text-white">Case Precedent Research</h1>
                <p className="text-sm text-slate-400">AI-powered legal research and citation management</p>
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
          <div className="max-w-7xl mx-auto">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-expert p-6 rounded-xl mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-expert text-white flex items-center space-x-3">
                  <Scale className="h-6 w-6 text-cyan-400" />
                  <span>Legal Precedent Research</span>
                </h2>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActiveTab('search')}
                    className={`px-4 py-2 rounded-lg font-expert transition-colors ${
                      activeTab === 'search' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Search
                  </button>
                  <button
                    onClick={() => setActiveTab('bookmarks')}
                    className={`px-4 py-2 rounded-lg font-expert transition-colors ${
                      activeTab === 'bookmarks' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Bookmarks
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 rounded-lg font-expert transition-colors ${
                      activeTab === 'history' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    History
                  </button>
                  {selectedCase && (
                    <button
                      onClick={() => setActiveTab('case')}
                      className={`px-4 py-2 rounded-lg font-expert transition-colors ${
                        activeTab === 'case' 
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Case Details
                    </button>
                  )}
                </div>
              </div>

              {/* Search Tab */}
              {activeTab === 'search' && (
                <div className="space-y-6">
                  {/* Search Interface */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search cases, legal principles, or key facts..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                      
                      <motion.button
                        onClick={() => handleSearch(searchQuery)}
                        className="gradient-trust px-6 py-3 rounded-lg font-expert flex items-center space-x-2 hover-expert"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Search className="h-4 w-4" />
                        <span>Search</span>
                      </motion.button>
                      
                      <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        <Filter className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Advanced Filters */}
                    <AnimatePresence>
                      {showAdvancedFilters && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-slate-800 rounded-lg p-4"
                        >
                          <div className="grid md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Court</label>
                              <select
                                value={selectedFilters.court}
                                onChange={(e) => setSelectedFilters(prev => ({ ...prev, court: e.target.value }))}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                              >
                                {courts.map((court, index) => (
                                  <option key={index} value={court === 'All Courts' ? 'all' : court}>{court}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Year</label>
                              <select
                                value={selectedFilters.year}
                                onChange={(e) => setSelectedFilters(prev => ({ ...prev, year: e.target.value }))}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                              >
                                {years.map((year, index) => (
                                  <option key={index} value={year === 'All Years' ? 'all' : year}>{year}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                              <select
                                value={selectedFilters.category}
                                onChange={(e) => setSelectedFilters(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                              >
                                {categories.map((category, index) => (
                                  <option key={index} value={category === 'All Categories' ? 'all' : category}>{category}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Outcome</label>
                              <select
                                value={selectedFilters.outcome}
                                onChange={(e) => setSelectedFilters(prev => ({ ...prev, outcome: e.target.value }))}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                              >
                                {outcomes.map((outcome, index) => (
                                  <option key={index} value={outcome === 'All Outcomes' ? 'all' : outcome}>{outcome}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Recent Searches */}
                    {searchHistory.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-400">Recent:</span>
                        {searchHistory.slice(0, 5).map((query, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchQuery(query)}
                            className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm hover:bg-slate-600 transition-colors"
                          >
                            {query}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search Results */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-expert text-white">
                        Search Results ({filteredCases.length} cases)
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-slate-400">
                        <span>Sorted by relevance</span>
                      </div>
                    </div>

                    {filteredCases.map((case_, index) => (
                      <motion.div
                        key={case_.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 
                                className="text-lg font-expert text-white hover:text-cyan-400 cursor-pointer transition-colors"
                                onClick={() => {
                                  setSelectedCase(case_)
                                  setActiveTab('case')
                                }}
                              >
                                {case_.title}
                              </h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getOutcomeColor(case_.outcome)}`}>
                                {case_.outcome}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getShepardColor(case_.shepardSignal)}`}>
                                {case_.shepardSignal}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                              <span className="flex items-center space-x-1">
                                <Gavel className="h-3 w-3" />
                                <span>{case_.citation}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{case_.date}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>{case_.relevanceScore}% relevance</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Quote className="h-3 w-3" />
                                <span>Cited by {case_.citedBy}</span>
                              </span>
                            </div>
                            
                            <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                              {case_.summary}
                            </p>
                            
                            <div className="flex items-center space-x-2">
                              {case_.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleBookmark(case_.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                case_.bookmarked 
                                  ? 'bg-yellow-500/20 text-yellow-400' 
                                  : 'hover:bg-slate-700 text-slate-400'
                              }`}
                            >
                              <Bookmark className="h-4 w-4" />
                            </button>
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                              <Download className="h-4 w-4 text-slate-400" />
                            </button>
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                              <Share2 className="h-4 w-4 text-slate-400" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bookmarks Tab */}
              {activeTab === 'bookmarks' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-expert text-white">
                      Bookmarked Cases ({cases.filter(c => c.bookmarked).length})
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {cases.filter(c => c.bookmarked).map((case_, index) => (
                      <motion.div
                        key={case_.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 
                              className="text-lg font-expert text-white hover:text-cyan-400 cursor-pointer transition-colors mb-2"
                              onClick={() => {
                                setSelectedCase(case_)
                                setActiveTab('case')
                              }}
                            >
                              {case_.title}
                            </h4>
                            <p className="text-slate-400 text-sm mb-2">{case_.citation}</p>
                            <p className="text-slate-300 text-sm">{case_.summary}</p>
                          </div>
                          
                          <button
                            onClick={() => toggleBookmark(case_.id)}
                            className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                          >
                            <Bookmark className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}

                    {cases.filter(c => c.bookmarked).length === 0 && (
                      <div className="text-center py-12">
                        <Bookmark className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">No bookmarked cases yet</p>
                        <p className="text-slate-500 text-sm">Bookmark cases while researching to save them here</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-expert text-white">
                      Search History ({searchHistory.length})
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {searchHistory.map((query, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <span className="text-slate-300">{query}</span>
                        <button
                          onClick={() => setSearchQuery(query)}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <Search className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}

                    {searchHistory.length === 0 && (
                      <div className="text-center py-12">
                        <History className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">No search history yet</p>
                        <p className="text-slate-500 text-sm">Your searches will appear here for quick access</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Case Details Tab */}
              {activeTab === 'case' && selectedCase && (
                <div className="space-y-6">
                  {/* Case Header */}
                  <div className="bg-slate-800 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-expert text-white mb-2">{selectedCase.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span>{selectedCase.citation}</span>
                          <span>{selectedCase.court}</span>
                          <span>{selectedCase.date}</span>
                          <span className={`px-2 py-1 rounded ${getOutcomeColor(selectedCase.outcome)}`}>
                            {selectedCase.outcome}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleBookmark(selectedCase.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            selectedCase.bookmarked 
                              ? 'bg-yellow-500/20 text-yellow-400' 
                              : 'hover:bg-slate-700 text-slate-400'
                          }`}
                        >
                          <Bookmark className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Download className="h-4 w-4 text-slate-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Share2 className="h-4 w-4 text-slate-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Copy className="h-4 w-4 text-slate-400" />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="text-slate-400 mb-1">Relevance Score</div>
                        <div className="text-cyan-400 font-expert text-lg">{selectedCase.relevanceScore}%</div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="text-slate-400 mb-1">Citations</div>
                        <div className="text-green-400 font-expert text-lg">{selectedCase.citedBy}</div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="text-slate-400 mb-1">Shepard Signal</div>
                        <div className={`font-expert text-lg capitalize ${getShepardColor(selectedCase.shepardSignal).split(' ')[0]}`}>
                          {selectedCase.shepardSignal}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Case Content */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Key Facts */}
                    <div className="bg-slate-800 rounded-lg p-6">
                      <h4 className="text-lg font-expert text-white mb-4 flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-cyan-400" />
                        <span>Key Facts</span>
                      </h4>
                      <ul className="space-y-2">
                        {selectedCase.keyFacts.map((fact, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Legal Principles */}
                    <div className="bg-slate-800 rounded-lg p-6">
                      <h4 className="text-lg font-expert text-white mb-4 flex items-center space-x-2">
                        <Scale className="h-5 w-5 text-cyan-400" />
                        <span>Legal Principles</span>
                      </h4>
                      <ul className="space-y-2">
                        {selectedCase.legalPrinciples.map((principle, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">{principle}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Holding */}
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h4 className="text-lg font-expert text-white mb-4 flex items-center space-x-2">
                      <Gavel className="h-5 w-5 text-cyan-400" />
                      <span>Holding</span>
                    </h4>
                    <p className="text-slate-300 leading-relaxed">{selectedCase.holding}</p>
                  </div>

                  {/* Summary */}
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h4 className="text-lg font-expert text-white mb-4 flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-cyan-400" />
                      <span>Case Summary</span>
                    </h4>
                    <p className="text-slate-300 leading-relaxed">{selectedCase.summary}</p>
                  </div>

                  {/* Tags */}
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h4 className="text-lg font-expert text-white mb-4 flex items-center space-x-2">
                      <Tag className="h-5 w-5 text-cyan-400" />
                      <span>Tags</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
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
                      Start Research
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

export default CaseResearch

