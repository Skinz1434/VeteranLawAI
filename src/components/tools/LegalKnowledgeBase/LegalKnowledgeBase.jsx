/**
 * @fileoverview Legal Knowledge Base - Comprehensive VA Legal Research Tool
 * @author VeteranLawAI Platform
 * @version 2.0.0
 */

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Search,
  Filter,
  Bookmark,
  BookmarkPlus,
  FileText,
  Scale,
  Database,
  Calendar,
  Star,
  ExternalLink,
  Download,
  Copy,
  X,
  ChevronDown,
  ChevronUp,
  Tag,
  Clock,
  TrendingUp,
  Award,
  Shield,
  Info,
  Settings,
} from 'lucide-react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import { announceToScreenReader } from '../../../utils/accessibility'
import { legalDatabase } from '../../../services/databases/ComprehensiveVALegalDatabase'
import { VAConditionsDatabase } from '../../../services/databases/VAConditionsDatabase'

/**
 * Legal Knowledge Base Component
 * Comprehensive VA Legal Research Tool with integrated databases
 */
const LegalKnowledgeBase = () => {
  // Core state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('search')
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [bookmarks, setBookmarks] = useState(new Set())
  
  // Filter state
  const [documentType, setDocumentType] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)
  
  // Database state
  const [conditionsDatabase] = useState(new VAConditionsDatabase())
  const [recentSearches, setRecentSearches] = useState([])
  const [searchStats, setSearchStats] = useState({
    totalDocuments: 0,
    totalConditions: 0,
    totalCases: 0,
    totalRegulations: 0,
  })

  // Initialize component
  useEffect(() => {
    initializeDatabase()
    loadBookmarks()
    announceToScreenReader('Legal Knowledge Base loaded')
  }, [])

  const initializeDatabase = () => {
    const stats = {
      totalDocuments: legalDatabase.getDocumentCount(),
      totalConditions: Object.keys(conditionsDatabase.conditions).length,
      totalCases: legalDatabase.getAllDocuments({ type: 'case_law' }).length,
      totalRegulations: legalDatabase.getAllDocuments({ type: 'regulation' }).length,
    }
    setSearchStats(stats)
  }

  const loadBookmarks = () => {
    const savedBookmarks = localStorage.getItem('legalKnowledgeBookmarks')
    if (savedBookmarks) {
      setBookmarks(new Set(JSON.parse(savedBookmarks)))
    }
  }

  const saveBookmarks = useCallback((newBookmarks) => {
    localStorage.setItem('legalKnowledgeBookmarks', JSON.stringify([...newBookmarks]))
    setBookmarks(newBookmarks)
  }, [])

  // Search functionality
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    announceToScreenReader('Searching legal database')

    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // Search legal database
      const legalResults = legalDatabase.search(query, { type: documentType === 'all' ? undefined : documentType })
      
      // Search conditions database
      const conditionsResults = searchConditions(query)
      
      // Combine and sort results
      const allResults = [...legalResults, ...conditionsResults]
      const sortedResults = sortResults(allResults, sortBy)
      
      setSearchResults(sortedResults)
      
      // Add to recent searches
      if (query.trim()) {
        setRecentSearches(prev => {
          const newSearches = [query, ...prev.filter(s => s !== query)].slice(0, 5)
          return newSearches
        })
      }

      announceToScreenReader(`Found ${sortedResults.length} results`)
    } catch (error) {
      console.error('Search failed:', error)
      announceToScreenReader('Search failed')
    } finally {
      setIsSearching(false)
    }
  }, [documentType, sortBy, conditionsDatabase])

  const searchConditions = (query) => {
    const lowerQuery = query.toLowerCase()
    const conditions = conditionsDatabase.conditions
    const results = []

    Object.values(conditions).forEach(condition => {
      if (
        condition.name.toLowerCase().includes(lowerQuery) ||
        condition.description.toLowerCase().includes(lowerQuery) ||
        condition.commonSymptoms.some(symptom => 
          symptom.toLowerCase().includes(lowerQuery)
        ) ||
        condition.requiredEvidence.some(evidence => 
          evidence.toLowerCase().includes(lowerQuery)
        )
      ) {
        results.push({
          ...condition,
          type: 'condition',
          relevanceScore: 0.9,
          lastUpdated: new Date().toISOString(),
        })
      }
    })

    return results
  }

  const sortResults = (results, sortBy) => {
    switch (sortBy) {
      case 'relevance':
        return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      case 'date':
        return results.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      case 'title':
        return results.sort((a, b) => a.title?.localeCompare(b.title) || a.name?.localeCompare(b.name))
      default:
        return results
    }
  }

  const handleSearch = useCallback(() => {
    performSearch(searchQuery)
  }, [searchQuery, performSearch])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }, [handleSearch])

  // Bookmark functionality
  const toggleBookmark = useCallback((docId) => {
    const newBookmarks = new Set(bookmarks)
    if (newBookmarks.has(docId)) {
      newBookmarks.delete(docId)
      announceToScreenReader('Removed from bookmarks')
    } else {
      newBookmarks.add(docId)
      announceToScreenReader('Added to bookmarks')
    }
    saveBookmarks(newBookmarks)
  }, [bookmarks, saveBookmarks])

  const isBookmarked = useCallback((docId) => {
    return bookmarks.has(docId)
  }, [bookmarks])

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      announceToScreenReader('Copied to clipboard')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [])

  // Tab configuration
  const tabs = [
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      description: 'Legal research'
    },
    {
      id: 'conditions',
      label: 'Conditions',
      icon: Database,
      description: 'VA conditions database'
    },
    {
      id: 'bookmarks',
      label: `Bookmarks (${bookmarks.size})`,
      icon: Bookmark,
      description: 'Saved documents'
    },
    {
      id: 'recent',
      label: 'Recent',
      icon: Clock,
      description: 'Recent searches'
    }
  ]

  const documentTypes = [
    { id: 'all', label: 'All Documents', icon: FileText },
    { id: 'regulation', label: 'Regulations', icon: Scale },
    { id: 'case_law', label: 'Case Law', icon: BookOpen },
    { id: 'manual', label: 'Manuals', icon: Database },
    { id: 'condition', label: 'Conditions', icon: Shield },
  ]

  const sortOptions = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'date', label: 'Date' },
    { id: 'title', label: 'Title' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Legal Knowledge Base</h1>
                <p className="text-slate-400">Comprehensive VA Legal Research & Database</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
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
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
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
        {activeTab === 'search' && (
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
                    placeholder="Search VA regulations, case law, conditions, or manuals..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-8"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Document Type
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    {documentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    {sortOptions.map(option => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      setDocumentType('all')
                      setSortBy('relevance')
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
          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {searchResults.length === 0 && !isSearching ? (
                <Card className="p-8 text-center">
                  <Search className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Start Your Research</h3>
                  <p className="text-slate-400 mb-6">
                    Search for VA regulations, case law, conditions, or manuals to find relevant legal information.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    {Object.entries(searchStats).map(([key, value]) => (
                      <div key={key} className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-400">{value}</div>
                        <div className="text-slate-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((result, index) => (
                    <Card key={result.id || index} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {result.type === 'condition' ? (
                              <Shield className="h-5 w-5 text-green-400" />
                            ) : result.type === 'case_law' ? (
                              <Scale className="h-5 w-5 text-blue-400" />
                            ) : result.type === 'regulation' ? (
                              <BookOpen className="h-5 w-5 text-purple-400" />
                            ) : (
                              <Database className="h-5 w-5 text-cyan-400" />
                            )}
                            <h3 className="font-bold text-white">
                              {result.title || result.name}
                            </h3>
                            <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                              {result.type}
                            </span>
                            {result.relevanceScore && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                                {Math.round(result.relevanceScore * 100)}% match
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm mb-2">
                            {result.summary || result.description}
                          </p>
                          {result.type === 'condition' && (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-xs text-slate-400">
                                <Tag className="h-3 w-3" />
                                <span>DC: {result.diagnosticCode}</span>
                                <span>•</span>
                                <span>Success Rate: {Math.round(result.successRate * 100)}%</span>
                                <span>•</span>
                                <span>Avg Rating: {result.averageRating}%</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {result.commonSymptoms?.slice(0, 3).map((symptom, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                                    {symptom}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {result.lastUpdated && (
                            <p className="text-slate-400 text-xs mt-2">
                              Updated: {new Date(result.lastUpdated).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleBookmark(result.id)}
                          >
                            {isBookmarked(result.id) ? (
                              <Bookmark className="h-4 w-4 text-purple-400" />
                            ) : (
                              <BookmarkPlus className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDocument(result)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'conditions' && (
            <motion.div
              key="conditions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(conditionsDatabase.conditions).map((condition) => (
                  <Card key={condition.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-2">{condition.name}</h3>
                        <p className="text-slate-300 text-sm mb-3">{condition.description}</p>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center space-x-2 text-slate-400">
                            <Tag className="h-3 w-3" />
                            <span>DC: {condition.diagnosticCode}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-400">
                            <TrendingUp className="h-3 w-3" />
                            <span>Success: {Math.round(condition.successRate * 100)}%</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-400">
                            <Award className="h-3 w-3" />
                            <span>Avg Rating: {condition.averageRating}%</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDocument(condition)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {condition.commonSymptoms?.slice(0, 3).map((symptom, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'bookmarks' && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {bookmarks.size === 0 ? (
                <Card className="p-8 text-center">
                  <Bookmark className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Bookmarks Yet</h3>
                  <p className="text-slate-400">
                    Bookmark important documents and conditions for quick access.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {Array.from(bookmarks).map((docId) => {
                    const doc = legalDatabase.documents.find(d => d.id === docId) ||
                               Object.values(conditionsDatabase.conditions).find(c => c.id === docId)
                    if (!doc) return null
                    
                    return (
                      <Card key={docId} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Bookmark className="h-5 w-5 text-purple-400" />
                              <h3 className="font-bold text-white">
                                {doc.title || doc.name}
                              </h3>
                            </div>
                            <p className="text-slate-300 text-sm">
                              {doc.summary || doc.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleBookmark(docId)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDocument(doc)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'recent' && (
            <motion.div
              key="recent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {recentSearches.length === 0 ? (
                <Card className="p-8 text-center">
                  <Clock className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Recent Searches</h3>
                  <p className="text-slate-400">
                    Your recent searches will appear here for quick access.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {recentSearches.map((search, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-slate-400" />
                          <span className="text-white">{search}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchQuery(search)
                            setActiveTab('search')
                            performSearch(search)
                          }}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Document Preview Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">
                  {selectedDocument.title || selectedDocument.name}
                </h2>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedDocument.summary || selectedDocument.description}
                    </p>
                  </div>

                  {selectedDocument.type === 'condition' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-white mb-2">Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Diagnostic Code:</span>
                              <span className="text-white">{selectedDocument.diagnosticCode}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Success Rate:</span>
                              <span className="text-white">{Math.round(selectedDocument.successRate * 100)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Average Rating:</span>
                              <span className="text-white">{selectedDocument.averageRating}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Processing Time:</span>
                              <span className="text-white">{selectedDocument.processingTimeDays} days</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-2">Common Symptoms</h4>
                          <div className="space-y-1">
                            {selectedDocument.commonSymptoms?.map((symptom, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm">
                                <div className="w-1 h-1 bg-purple-400 rounded-full" />
                                <span className="text-slate-300">{symptom}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2">Required Evidence</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedDocument.requiredEvidence?.map((evidence, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                              {evidence.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>

                      {selectedDocument.specialConsiderations && (
                        <div>
                          <h4 className="font-semibold text-white mb-2">Special Considerations</h4>
                          <div className="space-y-2">
                            {selectedDocument.specialConsiderations.map((consideration, index) => (
                              <div key={index} className="flex items-start space-x-2 text-sm">
                                <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-300">{consideration}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selectedDocument.content && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Full Content</h4>
                      <div className="bg-slate-900 rounded-lg p-4">
                        <pre className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                          {selectedDocument.content}
                        </pre>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4 border-t border-slate-700">
                    <Button
                      onClick={() => copyToClipboard(selectedDocument.summary || selectedDocument.description)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Summary
                    </Button>
                    <Button
                      onClick={() => toggleBookmark(selectedDocument.id)}
                      variant="outline"
                      className="flex-1"
                    >
                      {isBookmarked(selectedDocument.id) ? (
                        <>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Remove Bookmark
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="h-4 w-4 mr-2" />
                          Add Bookmark
                        </>
                      )}
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

export default LegalKnowledgeBase
