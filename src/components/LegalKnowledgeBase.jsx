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

  const sidebarNavigation = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Camera, label: "Camera OCR", path: "/camera-ocr" },
    { icon: BookOpen, label: "Legal Knowledge", path: "/legal-knowledge", active: true },
    { icon: FileText, label: "Claim Guidance", path: "/claim-guidance" },
    { icon: Mic, label: "Audio Transcription", path: "/audio-transcription" },
    { icon: Scale, label: "Case Research", path: "/case-research" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" }
  ]

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

  // Comprehensive legal knowledge base data
  const [knowledgeBase, setKnowledgeBase] = useState([
    {
      id: 1,
      title: "38 CFR § 3.303 - Principles relating to service connection",
      category: "CFR Regulations",
      type: "regulation",
      date: "2024-01-15",
      lastUpdated: "2024-01-15",
      citations: 1247,
      relevanceScore: 98,
      tags: ["Service Connection", "Evidence", "Reasonable Doubt"],
      summary: "Service connection may be granted for disability resulting from disease or injury incurred in or aggravated by active military service.",
      content: `§ 3.303 Principles relating to service connection.

(a) General. Service connection may be granted for disability resulting from disease or injury incurred in or aggravated by active military service. Service connection may also be granted for certain diseases first manifested to a degree of 10 percent or more within one year after separation from a period of active military service of 90 days or more.

(b) Reasonable doubt. When there is an approximate balance of positive and negative evidence regarding any issue material to the determination of a matter, the benefit of the doubt shall be given to the claimant.

(c) Chronicity and continuity. With chronic disease shown as such in service (or within the presumptive period under § 3.307) so as to permit a finding of service connection, subsequent manifestations of the same chronic disease at any later date, however remote, are service connected, unless clearly attributable to intercurrent causes.`,
      expertCommentary: "This regulation is fundamental to all VA disability claims. The 'benefit of the doubt' provision in subsection (b) is particularly important when evidence is equally balanced.",
      practicalTips: [
        "Always argue reasonable doubt when evidence is close",
        "Establish chronicity in service records when possible",
        "Look for continuity of symptoms post-service"
      ],
      relatedDocuments: [2, 3, 15],
      officialLink: "https://www.ecfr.gov/current/title-38/chapter-I/part-3/section-3.303"
    },
    {
      id: 2,
      title: "38 CFR § 3.102 - Reasonable doubt",
      category: "CFR Regulations",
      type: "regulation",
      date: "2024-01-08",
      lastUpdated: "2024-01-08",
      citations: 1156,
      relevanceScore: 97,
      tags: ["Reasonable Doubt", "Evidence", "Benefit of Doubt"],
      summary: "When there is an approximate balance of positive and negative evidence regarding any issue material to the determination of a matter, the benefit of the doubt shall be given to the claimant.",
      content: `§ 3.102 Reasonable doubt.

It is the defined and consistently applied policy of the Department of Veterans Affairs to administer the law under a broad interpretation, consistent with the facts shown in every case. When, after careful consideration of all procurable and assembled evidence, a reasonable doubt arises regarding service origin of a disease or injury, such doubt will be resolved in favor of the claimant. By reasonable doubt is meant one which exists because of an approximate balance of positive and negative evidence which does not satisfactorily prove or disprove the claim.`,
      expertCommentary: "The reasonable doubt standard is veteran-friendly and should be invoked whenever evidence is approximately balanced. This is not a 'tie goes to the runner' situation - it requires careful analysis.",
      practicalTips: [
        "Document why evidence is approximately balanced",
        "Distinguish from preponderance of evidence standard",
        "Use in appeals when RO failed to apply reasonable doubt"
      ],
      relatedDocuments: [1, 4, 12],
      officialLink: "https://www.ecfr.gov/current/title-38/chapter-I/part-3/section-3.102"
    },
    {
      id: 3,
      title: "VASRD § 4.130 - Mental Disorders Rating Schedule",
      category: "VASRD Ratings",
      type: "rating",
      date: "2024-01-18",
      lastUpdated: "2024-01-18",
      citations: 1834,
      relevanceScore: 99,
      tags: ["VASRD", "Mental Health", "PTSD", "Rating"],
      summary: "Mental disorders are rated under the General Rating Formula for Mental Disorders, considering occupational and social impairment levels from 0% to 100%.",
      content: `§ 4.130 Schedule of ratings—Mental disorders.

General Rating Formula for Mental Disorders:

Total occupational and social impairment, due to such symptoms as: suicidal ideation, obsessional rituals which interfere with routine activities, speech intermittently illogical, obscene, or irrelevant, near-continuous panic or depression affecting the ability to function independently, appropriately and effectively, impaired impulse control (such as unprovoked irritability with periods of violence), spatial disorientation, neglect of personal appearance and hygiene, difficulty in adapting to stressful circumstances (including work or a work-like setting), inability to establish and maintain effective relationships - 100%

Occupational and social impairment, with deficiencies in most areas, such as work, school, family relations, judgment, thinking, or mood, due to such symptoms as: suicidal ideation, obsessional rituals which interfere with routine activities, speech intermittently illogical, obscene, or irrelevant, near-continuous panic or depression affecting the ability to function independently, appropriately and effectively, impaired impulse control (such as unprovoked irritability with periods of violence), spatial disorientation, neglect of personal appearance and hygiene, difficulty in adapting to stressful circumstances (including work or a work-like setting), inability to establish and maintain effective relationships - 70%`,
      expertCommentary: "The GAF scale is no longer used. Focus on specific symptoms and their impact on occupational and social functioning. Document real-world examples.",
      practicalTips: [
        "Obtain detailed mental health records",
        "Document specific functional impairments",
        "Consider individual unemployability (TDIU)"
      ],
      relatedDocuments: [8, 9, 16],
      officialLink: "https://www.ecfr.gov/current/title-38/chapter-I/part-4/section-4.130"
    },
    {
      id: 4,
      title: "M21-1 III.iv.4.D.1.a - PTSD Claims Development",
      category: "M21 Manual",
      type: "procedure",
      date: "2024-01-12",
      lastUpdated: "2024-01-12",
      citations: 743,
      relevanceScore: 96,
      tags: ["PTSD", "Claims Development", "M21", "Stressor"],
      summary: "When developing PTSD claims, obtain sufficient evidence to establish: current diagnosis of PTSD, in-service stressor event, and medical nexus linking current PTSD to the in-service stressor.",
      content: `M21-1, Part III, Subpart iv, Chapter 4, Section D - Post-Traumatic Stress Disorder (PTSD)

1. General Information About PTSD Claims

a. PTSD Claims Development Requirements

When developing PTSD claims, obtain sufficient evidence to establish:
- current diagnosis of PTSD that conforms to DSM-5 criteria
- occurrence of an in-service stressor event, and  
- medical nexus linking current PTSD to the in-service stressor.

Note: A stressor is the traumatic event that causes PTSD. The stressor must be related to the Veteran's fear of hostile military or terrorist activity.

b. Types of PTSD Stressors

Combat stressors are incidents that occurred during combat with the enemy, including:
- actual combat with the enemy
- friendly fire incidents  
- artillery or mortar attacks
- IED explosions
- sniper fire
- vehicle accidents during combat operations`,
      expertCommentary: "PTSD claims require careful development of the stressor event. Combat veterans have relaxed stressor verification requirements under 38 CFR 3.304(f)(2).",
      practicalTips: [
        "Verify combat service through personnel records",
        "Obtain detailed stressor statements",
        "Consider multiple stressor events"
      ],
      relatedDocuments: [3, 10, 17],
      officialLink: "https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018/content/554400000014088/M21-1-Part-III-Subpart-iv-Chapter-4-Section-D-Post-Traumatic-Stress-Disorder-PTSD"
    },
    {
      id: 5,
      title: "Nehmer v. U.S. Department of Veterans Affairs",
      category: "Case Law",
      type: "case",
      date: "2024-01-20",
      lastUpdated: "2024-01-20",
      citations: 892,
      relevanceScore: 94,
      tags: ["Agent Orange", "Presumptive", "Class Action"],
      summary: "Landmark class action establishing presumptive service connection for Agent Orange exposure and related diseases for Vietnam veterans.",
      content: `Nehmer v. U.S. Department of Veterans Affairs
Class Action Settlement

Background:
The Nehmer class action lawsuit challenged the VA's handling of Agent Orange disability claims by Vietnam veterans. The case resulted in a comprehensive settlement requiring the VA to readjudicate thousands of previously denied claims.

Key Holdings:
1. Established presumptive service connection for specific diseases related to Agent Orange exposure
2. Required VA to provide automatic reopening for previously denied claims
3. Created the "Nehmer presumption" for certain conditions
4. Mandated retroactive benefits for qualifying veterans

Covered Conditions:
- Chloracne
- Type 2 Diabetes
- Hodgkin's Disease
- Multiple Myeloma
- Non-Hodgkin's Lymphoma
- Peripheral Neuropathy
- Porphyria Cutanea Tarda
- Prostate Cancer
- Respiratory Cancers
- Soft Tissue Sarcomas`,
      expertCommentary: "Nehmer claims provide automatic reopening rights for Vietnam veterans with covered conditions. Check for potential Nehmer eligibility in all Vietnam veteran cases.",
      practicalTips: [
        "Verify Vietnam service dates and locations",
        "Check for covered conditions list updates",
        "File Nehmer reopening requests when applicable"
      ],
      relatedDocuments: [6, 11, 18],
      officialLink: "https://www.va.gov/disability/eligibility/hazardous-materials-exposure/agent-orange/nehmer/"
    }
  ])

  const categories = [
    { id: 'all', label: 'All Categories', count: knowledgeBase.length, icon: BookOpen },
    { id: 'CFR Regulations', label: 'CFR Regulations', count: 3, icon: Shield },
    { id: 'M21 Manual', label: 'M21 Manual', count: 2, icon: FileText },
    { id: 'VASRD Ratings', label: 'VASRD Ratings', count: 2, icon: Award },
    { id: 'Case Law', label: 'Case Law', count: 3, icon: Scale }
  ]

  const recentUpdates = [
    { title: "VASRD § 4.130 - Mental Disorders Rating Schedule", date: "2024-01-18", type: "update" },
    { title: "38 CFR § 3.303 - Principles relating to service connection", date: "2024-01-15", type: "revision" },
    { title: "M21-1 III.iv.4.D.1.a - PTSD Claims Development", date: "2024-01-12", type: "new" }
  ]

  useEffect(() => {
    if (showWelcomeModal && currentStep < 4) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, showWelcomeModal])

  const filteredKnowledgeBase = knowledgeBase.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const toggleBookmark = (itemId) => {
    setBookmarkedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (term && !recentSearches.includes(term)) {
      setRecentSearches(prev => [term, ...prev.slice(0, 4)])
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'regulation': return Shield
      case 'procedure': return FileText
      case 'rating': return Award
      case 'case': return Scale
      default: return BookOpen
    }
  }

  const getTypeColor = (type) => {
    switch(type) {
      case 'regulation': return 'text-blue-400 bg-blue-500/20'
      case 'procedure': return 'text-green-400 bg-green-500/20'
      case 'rating': return 'text-purple-400 bg-purple-500/20'
      case 'case': return 'text-orange-400 bg-orange-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  const currentTool = {
    name: 'Legal Knowledge',
    description: 'VA Legal Database',
    icon: BookOpen,
    gradient: 'from-blue-500 to-purple-600'
  }

  const toolStats = [
    { icon: FileText, label: 'Total Documents', value: '2,847' },
    { icon: TrendingUp, label: 'Recent Updates', value: '15' },
    { icon: Bookmark, label: 'Saved Research', value: '847' },
    { icon: History, label: 'Search History', value: '1,234' }
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
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
          {/* Knowledge base content will go here */}
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Legal Knowledge Base</h3>
            <p className="text-slate-400">Access comprehensive VA regulations and case law</p>
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
                  Saved Research: 847 documents
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
                <h1 className="text-xl font-expert text-white">VA Legal Knowledge Base</h1>
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
          <div className="max-w-7xl mx-auto">
            {/* Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-expert p-6 rounded-xl mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-expert text-white flex items-center space-x-3">
                  <Search className="h-6 w-6 text-cyan-400" />
                  <span>Legal Research</span>
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
                    onClick={() => setActiveTab('recent')}
                    className={`px-4 py-2 rounded-lg font-expert transition-colors ${
                      activeTab === 'recent' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Recent
                  </button>
                </div>
              </div>

              {/* Search Interface */}
              <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <div className="relative mb-4">
                    <Search className="h-5 w-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search regulations, procedures, cases, and legal precedents..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-slate-400 mb-2">Recent searches:</p>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setSearchTerm(search)}
                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-full text-sm text-slate-300 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {search}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Categories Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              {categories.slice(1).map((category, index) => (
                <motion.div
                  key={category.id}
                  className="glass-expert p-4 rounded-lg cursor-pointer hover:border-cyan-500/50 transition-colors"
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <category.icon className="h-5 w-5 text-cyan-400" />
                    <span className="font-expert text-white">{category.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-cyan-400 mb-1">{category.count}</div>
                  <div className="text-xs text-slate-400">documents</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Recent Updates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-expert p-6 rounded-xl mb-6"
            >
              <h3 className="text-lg font-expert text-white mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-cyan-400" />
                <span>Recent Updates</span>
              </h3>
              
              <div className="space-y-3">
                {recentUpdates.map((update, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{update.title}</h4>
                      <p className="text-sm text-slate-400">{update.date}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      update.type === 'new' ? 'bg-green-500/20 text-green-400' :
                      update.type === 'update' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {update.type}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Knowledge Base Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-expert p-6 rounded-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-expert text-white">
                  {activeTab === 'search' && `Search Results (${filteredKnowledgeBase.length})`}
                  {activeTab === 'bookmarks' && `Bookmarked Items (${bookmarkedItems.length})`}
                  {activeTab === 'recent' && 'Recently Viewed'}
                </h3>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                    <Filter className="h-4 w-4 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                    <Download className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {filteredKnowledgeBase.map((item, index) => {
                  const TypeIcon = getTypeIcon(item.type)
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedDocument(item)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <TypeIcon className="h-5 w-5 text-cyan-400" />
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                              {item.category}
                            </span>
                            <span className="text-slate-400 text-sm">{item.citations} citations</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400" />
                              <span className="text-yellow-400 text-sm">{item.relevanceScore}%</span>
                            </div>
                          </div>
                          
                          <h4 className="text-lg font-expert text-white mb-2">{item.title}</h4>
                          <p className="text-slate-300 text-sm mb-3">{item.summary}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-slate-400">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Updated {item.lastUpdated}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <ExternalLink className="h-3 w-3" />
                              <span>Official Link</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleBookmark(item.id)
                            }}
                            className={`p-2 rounded-lg transition-colors ${
                              bookmarkedItems.includes(item.id)
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'hover:bg-slate-700 text-slate-400'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Bookmark className="h-4 w-4" />
                          </motion.button>
                          
                          <motion.button
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Download className="h-4 w-4 text-slate-400" />
                          </motion.button>
                          
                          <motion.button
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ExternalLink className="h-4 w-4 text-slate-400" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
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
                      Start Researching
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDocument(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-expert text-white">{selectedDocument.title}</h2>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <div className="bg-slate-900 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-expert text-white mb-3">Full Text</h3>
                    <div className="max-h-96 overflow-y-auto">
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                        {selectedDocument.content}
                      </pre>
                    </div>
                  </div>
                  
                  {selectedDocument.expertCommentary && (
                    <div className="bg-slate-900 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-expert text-white mb-3 flex items-center space-x-2">
                        <User className="h-5 w-5 text-cyan-400" />
                        <span>Expert Commentary</span>
                      </h3>
                      <p className="text-slate-300 text-sm">{selectedDocument.expertCommentary}</p>
                    </div>
                  )}
                  
                  {selectedDocument.practicalTips && (
                    <div className="bg-slate-900 rounded-lg p-6">
                      <h3 className="text-lg font-expert text-white mb-3 flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-yellow-400" />
                        <span>Practical Tips</span>
                      </h3>
                      <ul className="space-y-2">
                        {selectedDocument.practicalTips.map((tip, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-white font-expert mb-3">Document Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type:</span>
                        <span className="text-white">{selectedDocument.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Citations:</span>
                        <span className="text-white">{selectedDocument.citations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Relevance:</span>
                        <span className="text-green-400">{selectedDocument.relevanceScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Updated:</span>
                        <span className="text-white">{selectedDocument.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-white font-expert mb-3">Actions</h4>
                    <div className="space-y-2">
                      <motion.button
                        className="w-full gradient-trust px-4 py-2 rounded-lg font-expert flex items-center justify-center space-x-2 hover-expert"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Cloud className="h-4 w-4" />
                        <span>Save to Drive</span>
                      </motion.button>
                      
                      <motion.button
                        className="w-full glass-expert border border-cyan-500/30 hover:border-cyan-500/50 px-4 py-2 rounded-lg font-expert flex items-center justify-center space-x-2 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Official Source</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => toggleBookmark(selectedDocument.id)}
                        className={`w-full px-4 py-2 rounded-lg font-expert flex items-center justify-center space-x-2 transition-colors ${
                          bookmarkedItems.includes(selectedDocument.id)
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'glass-expert border border-slate-600 hover:border-slate-500'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Bookmark className="h-4 w-4" />
                        <span>{bookmarkedItems.includes(selectedDocument.id) ? 'Bookmarked' : 'Bookmark'}</span>
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="text-white font-expert mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDocument.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LegalKnowledgeBase

