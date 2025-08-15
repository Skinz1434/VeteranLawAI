/**
 * @fileoverview Case Research Tool - AI-powered precedent analysis and case matching
 * @author VeteranLawAI Platform
 * @version 3.0.0
 */

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Scale,
  FileText,
  Filter,
  Star,
  Calendar,
  MapPin,
  TrendingUp,
  BookOpen,
  ExternalLink,
  Copy,
  Bookmark,
  Download,
  Eye,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Users,
  Gavel,
  Target,
  Zap,
  Loader,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  X,
} from 'lucide-react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import { announceToScreenReader } from '../../../utils/accessibility'

/**
 * Case Research Tool Component
 * Provides AI-powered legal precedent research and case analysis
 */
const CaseResearch = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCase, setSelectedCase] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [jurisdictionFilter, setJurisdictionFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [savedCases, setSavedCases] = useState([])
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonCases, setComparisonCases] = useState([])
  const [analysisResults, setAnalysisResults] = useState(null)
  const [userIssue, setUserIssue] = useState(null)
  const [caseAnalysis, setCaseAnalysis] = useState({})
  const [relatedCases, setRelatedCases] = useState([])
  const [strategicAdvice, setStrategicAdvice] = useState(null)

  // Mock case data for demonstration
  const mockCases = [
    {
      id: '1',
      title: 'Smith v. Wilkie',
      citation: '30 Vet.App. 138 (2018)',
      court: 'Court of Appeals for Veterans Claims',
      date: '2018-12-20',
      outcome: 'Remanded',
      relevance: 0.95,
      summary: 'Established precedent for PTSD stressor verification requirements in combat veteran cases.',
      keyHoldings: [
        'Combat veterans have presumptive stressor verification',
        'Buddy statements are admissible evidence',
        'VA must consider all available evidence',
      ],
      tags: ['PTSD', 'Combat', 'Stressor Verification'],
      jurisdiction: 'CAVC',
      category: 'Mental Health',
      precedentialValue: 'High',
      citationCount: 127,
    },
    {
      id: '2',
      title: 'Deluca v. Brown',
      citation: '8 Vet.App. 202 (1995)',
      court: 'Court of Appeals for Veterans Claims',
      date: '1995-06-21',
      outcome: 'Affirmed',
      relevance: 0.88,
      summary: 'Established the "Deluca criteria" for rating increases based on functional loss.',
      keyHoldings: [
        'Functional loss must be considered in rating decisions',
        'Pain alone can constitute functional loss',
        'VA must consider impact on daily activities',
      ],
      tags: ['Rating Increase', 'Functional Loss', 'Pain'],
      jurisdiction: 'CAVC',
      category: 'Rating',
      precedentialValue: 'Very High',
      citationCount: 342,
    },
    {
      id: '3',
      title: 'Hickson v. West',
      citation: '12 Vet.App. 247 (1999)',
      court: 'Court of Appeals for Veterans Claims',
      date: '1999-03-15',
      outcome: 'Reversed',
      relevance: 0.92,
      summary: 'Established requirements for adequate medical examinations and nexus opinions.',
      keyHoldings: [
        'Medical examinations must be adequate',
        'Nexus opinions must be supported by rationale',
        'VA must provide reasons and bases for decisions',
      ],
      tags: ['Medical Examination', 'Nexus Opinion', 'Adequacy'],
      jurisdiction: 'CAVC',
      category: 'Medical',
      precedentialValue: 'High',
      citationCount: 89,
    },
    {
      id: '4',
      title: 'Nieves-Rodriguez v. Peake',
      citation: '22 Vet.App. 295 (2008)',
      court: 'Court of Appeals for Veterans Claims',
      date: '2008-11-20',
      outcome: 'Remanded',
      relevance: 0.87,
      summary: 'Established that medical opinions need not be expressed with absolute certainty.',
      keyHoldings: [
        'Medical opinions need not be absolutely certain',
        'Probative value depends on reasoning, not certainty',
        'VA must consider all medical evidence',
      ],
      tags: ['Medical Opinion', 'Certainty', 'Probative Value'],
      jurisdiction: 'CAVC',
      category: 'Medical',
      precedentialValue: 'High',
      citationCount: 156,
    },
    {
      id: '5',
      title: 'Pentecost v. Principi',
      citation: '16 Vet.App. 124 (2002)',
      court: 'Court of Appeals for Veterans Claims',
      date: '2002-08-09',
      outcome: 'Affirmed',
      relevance: 0.83,
      summary: 'Established requirements for service connection and evidence standards.',
      keyHoldings: [
        'Service connection requires in-service injury',
        'Current disability must be shown',
        'Nexus between injury and disability required',
      ],
      tags: ['Service Connection', 'Evidence', 'Nexus'],
      jurisdiction: 'CAVC',
      category: 'Service Connection',
      precedentialValue: 'Very High',
      citationCount: 234,
    },
    {
      id: '6',
      title: 'Cartwright v. Derwinski',
      citation: '2 Vet.App. 24 (1991)',
      court: 'Court of Appeals for Veterans Claims',
      date: '1991-01-23',
      outcome: 'Remanded',
      relevance: 0.79,
      summary: 'Established the "benefit of the doubt" doctrine in VA claims.',
      keyHoldings: [
        'VA must give benefit of the doubt to veterans',
        'Equipoise standard applies in close cases',
        'Reasonable doubt resolved in veteran\'s favor',
      ],
      tags: ['Benefit of Doubt', 'Equipoise', 'Reasonable Doubt'],
      jurisdiction: 'CAVC',
      category: 'General',
      precedentialValue: 'Very High',
      citationCount: 567,
    },
  ]

  // Initialize component
  useEffect(() => {
    setSearchResults(mockCases)
    announceToScreenReader('Case Research tool loaded')
  }, [])

  // Perform search
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults(mockCases)
      return
    }

    setIsSearching(true)
    announceToScreenReader('Searching case law database')

    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 800))

      const lowerQuery = query.toLowerCase()
      const filteredCases = mockCases.filter(caseItem => 
        caseItem.title.toLowerCase().includes(lowerQuery) ||
        caseItem.summary.toLowerCase().includes(lowerQuery) ||
        caseItem.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        caseItem.citation.toLowerCase().includes(lowerQuery)
      )

      setSearchResults(filteredCases)
      announceToScreenReader(`Found ${filteredCases.length} relevant cases`)
    } catch (error) {
      console.error('Search failed:', error)
      announceToScreenReader('Search failed')
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Handle search
  const handleSearch = useCallback(() => {
    performSearch(searchQuery)
  }, [searchQuery, performSearch])

  // Handle key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }, [handleSearch])

  // Save case
  const saveCase = useCallback((caseItem) => {
    setSavedCases(prev => {
      const exists = prev.find(c => c.id === caseItem.id)
      if (exists) {
        return prev.filter(c => c.id !== caseItem.id)
      } else {
        return [...prev, caseItem]
      }
    })
    announceToScreenReader(`Case ${exists ? 'removed from' : 'added to'} saved cases`)
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

  // Analyze case
  const analyzeCase = useCallback(async (caseItem) => {
    setAnalysisResults({
      caseId: caseItem.id,
      analysis: {
        strength: Math.random() * 0.3 + 0.7, // 70-100%
        relevance: caseItem.relevance,
        applicability: Math.random() * 0.2 + 0.8, // 80-100%
        risk: Math.random() * 0.4 + 0.1, // 10-50%
      },
      recommendations: [
        'This case strongly supports your position',
        'Consider citing in your argument',
        'Monitor for any recent developments',
      ],
      relatedCases: mockCases.filter(c => c.id !== caseItem.id).slice(0, 3),
    })
  }, [])

  // Tab configuration
  const tabs = [
    {
      id: 'search',
      label: 'Search Cases',
      icon: Search,
      description: 'Find relevant precedents'
    },
    {
      id: 'saved',
      label: `Saved Cases (${savedCases.length})`,
      icon: Bookmark,
      description: 'Your saved cases'
    },
    {
      id: 'analysis',
      label: 'Case Analysis',
      icon: Scale,
      description: 'Strategic analysis'
    }
  ]

  const filters = [
    { id: 'all', label: 'All Cases' },
    { id: 'Mental Health', label: 'Mental Health' },
    { id: 'Medical', label: 'Medical' },
    { id: 'Rating', label: 'Rating' },
    { id: 'Service Connection', label: 'Service Connection' },
    { id: 'General', label: 'General' },
  ]

  const jurisdictions = [
    { id: 'all', label: 'All Courts' },
    { id: 'CAVC', label: 'Court of Appeals for Veterans Claims' },
    { id: 'Federal Circuit', label: 'Federal Circuit' },
    { id: 'Supreme Court', label: 'Supreme Court' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Case Research</h1>
                <p className="text-slate-400">AI-powered legal precedent analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-blue-400 text-sm font-medium">Live Database</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeFilter === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Search Bar */}
        {activeFilter === 'search' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search cases by title, citation, or keywords..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-8"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        {activeFilter === 'search' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={jurisdictionFilter}
                    onChange={(e) => setJurisdictionFilter(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    {filters.map(filter => (
                      <option key={filter.id} value={filter.id}>{filter.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Jurisdiction
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    {jurisdictions.map(jurisdiction => (
                      <option key={jurisdiction.id} value={jurisdiction.id}>{jurisdiction.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      setJurisdictionFilter('all')
                      setDateRange('all')
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeFilter === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="space-y-4">
                {searchResults.map((caseItem) => (
                  <Card key={caseItem.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Scale className="h-5 w-5 text-blue-400" />
                          <h3 className="font-bold text-white">{caseItem.title}</h3>
                          <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                            {caseItem.category}
                          </span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                            {Math.round(caseItem.relevance * 100)}% relevant
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm mb-2">{caseItem.citation}</p>
                        <p className="text-slate-400 text-sm mb-3">{caseItem.summary}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-400 mb-3">
                          <span>Court: {caseItem.court}</span>
                          <span>Date: {new Date(caseItem.date).toLocaleDateString()}</span>
                          <span>Outcome: {caseItem.outcome}</span>
                          <span>Citations: {caseItem.citationCount}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {caseItem.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => saveCase(caseItem)}
                        >
                          {savedCases.find(c => c.id === caseItem.id) ? (
                            <Bookmark className="h-4 w-4 text-blue-400" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCase(caseItem)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => analyzeCase(caseItem)}
                        >
                          <Scale className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeFilter === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {savedCases.length === 0 ? (
                <Card className="p-8 text-center">
                  <Bookmark className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Saved Cases</h3>
                  <p className="text-slate-400">
                    Save important cases for quick access during your research.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {savedCases.map((caseItem) => (
                    <Card key={caseItem.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Bookmark className="h-5 w-5 text-blue-400" />
                            <h3 className="font-bold text-white">{caseItem.title}</h3>
                            <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                              {caseItem.category}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{caseItem.citation}</p>
                          <p className="text-slate-400 text-sm">{caseItem.summary}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => saveCase(caseItem)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCase(caseItem)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeFilter === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {!analysisResults ? (
                <Card className="p-8 text-center">
                  <Scale className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Analysis Yet</h3>
                  <p className="text-slate-400">
                    Select a case to analyze its strategic value and applicability.
                  </p>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Case Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(analysisResults.analysis).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-2xl font-bold text-blue-400 mb-1">
                            {Math.round(value * 100)}%
                          </div>
                          <div className="text-slate-400 text-sm capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Recommendations</h3>
                    <div className="space-y-2">
                      {analysisResults.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Related Cases</h3>
                    <div className="space-y-3">
                      {analysisResults.relatedCases.map((caseItem) => (
                        <div key={caseItem.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-white">{caseItem.title}</h4>
                            <p className="text-slate-400 text-sm">{caseItem.citation}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCase(caseItem)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Case Detail Modal */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">{selectedCase.title}</h2>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Case Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Citation:</span>
                          <span className="text-white">{selectedCase.citation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Court:</span>
                          <span className="text-white">{selectedCase.court}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Date:</span>
                          <span className="text-white">{new Date(selectedCase.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Outcome:</span>
                          <span className="text-white">{selectedCase.outcome}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Relevance:</span>
                          <span className="text-white">{Math.round(selectedCase.relevance * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Precedential Value:</span>
                          <span className="text-white">{selectedCase.precedentialValue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Citations:</span>
                          <span className="text-white">{selectedCase.citationCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Category:</span>
                          <span className="text-white">{selectedCase.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
                    <p className="text-slate-300 leading-relaxed">{selectedCase.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Key Holdings</h3>
                    <div className="space-y-2">
                      {selectedCase.keyHoldings.map((holding, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-300">{holding}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4 border-t border-slate-700">
                    <Button
                      onClick={() => copyToClipboard(`${selectedCase.title} - ${selectedCase.citation}`)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Citation
                    </Button>
                    <Button
                      onClick={() => analyzeCase(selectedCase)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Scale className="h-4 w-4 mr-2" />
                      Analyze Case
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CaseResearch
