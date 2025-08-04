/**
 * @fileoverview Document Database for Legal Knowledge Base
 * @author VeteranLawAI Platform
 * @version 1.0.0
 */

// Comprehensive document database with search functionality
export class DocumentDatabase {
  constructor() {
    this.documents = this.initializeDocuments()
    this.searchIndex = this.buildSearchIndex()
  }

  initializeDocuments() {
    return [
      {
        id: 'reg-001',
        title: '38 CFR 4.130 - Mental Health Rating Schedule',
        type: 'regulation',
        category: 'Mental Health',
        summary: 'Rating criteria for mental health conditions including diagnostic codes and percentage ratings',
        content: 'Regulation content for mental health disability ratings...',
        keywords: ['mental health', 'PTSD', 'depression', 'rating schedule', 'diagnostic code'],
        lastUpdated: '2024-01-15',
        section: '38 CFR 4.130',
        relevanceScore: 0.95
      },
      {
        id: 'case-001',
        title: 'Veteran Benefits Case Precedent #1',
        type: 'case_law',
        category: 'Service Connection',
        summary: 'Important precedent case regarding service connection requirements',
        content: 'Case law content regarding service connection standards...',
        keywords: ['service connection', 'evidence', 'nexus', 'medical opinion'],
        lastUpdated: '2023-12-20',
        section: 'Federal Circuit',
        relevanceScore: 0.92
      },
      {
        id: 'manual-001',
        title: 'M21-1 Claims Processing Manual',
        type: 'manual',
        category: 'Claims Processing',
        summary: 'Official VA manual for processing disability claims',
        content: 'Manual content for claims processing procedures...',
        keywords: ['claims processing', 'evidence development', 'rating decisions'],
        lastUpdated: '2024-02-01',
        section: 'M21-1 Part IV',
        relevanceScore: 0.89
      },
      {
        id: 'guide-001',
        title: 'VA Disability Benefits Guide',
        type: 'guidance',
        category: 'General Information',
        summary: 'Comprehensive guide to VA disability benefits',
        content: 'Guide content for understanding VA disability benefits...',
        keywords: ['disability benefits', 'eligibility', 'application process'],
        lastUpdated: '2024-01-30',
        section: 'VA Guidance',
        relevanceScore: 0.87
      }
    ]
  }

  buildSearchIndex() {
    const index = new Map()
    
    this.documents.forEach(doc => {
      // Index by keywords
      doc.keywords.forEach(keyword => {
        if (!index.has(keyword)) {
          index.set(keyword, [])
        }
        index.get(keyword).push(doc.id)
      })
      
      // Index by title words
      const titleWords = doc.title.toLowerCase().split(' ')
      titleWords.forEach(word => {
        if (word.length > 2) {
          if (!index.has(word)) {
            index.set(word, [])
          }
          index.get(word).push(doc.id)
        }
      })
    })
    
    return index
  }

  search(query, filters = {}) {
    if (!query || query.trim().length === 0) {
      return this.getAllDocuments(filters)
    }

    const searchTerms = query.toLowerCase().split(' ')
    const matchedDocIds = new Set()
    const relevanceScores = new Map()

    // Search through index
    searchTerms.forEach(term => {
      if (this.searchIndex.has(term)) {
        this.searchIndex.get(term).forEach(docId => {
          matchedDocIds.add(docId)
          const currentScore = relevanceScores.get(docId) || 0
          relevanceScores.set(docId, currentScore + 1)
        })
      }
    })

    // Get matched documents
    let results = Array.from(matchedDocIds)
      .map(id => this.documents.find(doc => doc.id === id))
      .filter(doc => doc)

    // Apply filters
    if (filters.type && filters.type !== 'all') {
      results = results.filter(doc => doc.type === filters.type)
    }

    if (filters.category) {
      results = results.filter(doc => 
        doc.category.toLowerCase().includes(filters.category.toLowerCase())
      )
    }

    // Sort by relevance
    results.sort((a, b) => {
      const scoreA = relevanceScores.get(a.id) || 0
      const scoreB = relevanceScores.get(b.id) || 0
      return scoreB - scoreA
    })

    return results
  }

  getAllDocuments(filters = {}) {
    let results = [...this.documents]

    if (filters.type && filters.type !== 'all') {
      results = results.filter(doc => doc.type === filters.type)
    }

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  getDocumentById(id) {
    return this.documents.find(doc => doc.id === id)
  }

  getDocumentTypes() {
    const types = new Set(this.documents.map(doc => doc.type))
    return Array.from(types)
  }

  getCategories() {
    const categories = new Set(this.documents.map(doc => doc.category))
    return Array.from(categories)
  }

  addBookmark(docId) {
    const bookmarks = this.getBookmarks()
    if (!bookmarks.includes(docId)) {
      bookmarks.push(docId)
      localStorage.setItem('legal_bookmarks', JSON.stringify(bookmarks))
    }
  }

  removeBookmark(docId) {
    const bookmarks = this.getBookmarks()
    const updated = bookmarks.filter(id => id !== docId)
    localStorage.setItem('legal_bookmarks', JSON.stringify(updated))
  }

  getBookmarks() {
    const stored = localStorage.getItem('legal_bookmarks')
    return stored ? JSON.parse(stored) : []
  }

  isBookmarked(docId) {
    return this.getBookmarks().includes(docId)
  }
}

// Create singleton instance
export const documentDatabase = new DocumentDatabase()