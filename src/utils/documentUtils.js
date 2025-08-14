/**
 * Document utility functions for the VA Legal Database
 */

/**
 * Generate a unique document ID
 */
export function generateDocumentId(prefix = 'doc') {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `${prefix}-${timestamp}-${random}`
}

/**
 * Calculate relevance score based on search criteria
 */
export function calculateRelevanceScore(document, searchTerms) {
  let score = 0
  const maxScore = searchTerms.length * 3

  searchTerms.forEach(term => {
    const termLower = term.toLowerCase()
    
    // Check title (highest weight)
    if (document.title?.toLowerCase().includes(termLower)) {
      score += 3
    }
    
    // Check summary (medium weight)
    if (document.summary?.toLowerCase().includes(termLower)) {
      score += 2
    }
    
    // Check content (lower weight)
    if (document.content?.toLowerCase().includes(termLower)) {
      score += 1
    }
    
    // Check keywords (high weight for exact match)
    if (document.keywords?.some(k => k.toLowerCase() === termLower)) {
      score += 3
    }
  })

  return Math.min(score / maxScore, 1)
}

/**
 * Format citation based on document type
 */
export function formatCitation(document) {
  switch (document.type) {
    case 'regulation':
      return document.citationFormat || document.citation
    case 'case_law':
      return document.citation
    case 'manual':
      return `${document.title}, ${document.lastUpdated}`
    case 'form':
      return document.formNumber
    default:
      return document.title
  }
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text, minLength = 4) {
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'from', 'this', 'that', 'have', 'been',
    'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall'
  ])

  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length >= minLength && !stopWords.has(word))

  // Count word frequency
  const frequency = {}
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1
  })

  // Return top keywords by frequency
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)
}

/**
 * Highlight search terms in text
 */
export function highlightSearchTerms(text, searchTerms) {
  let highlightedText = text
  
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi')
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>')
  })
  
  return highlightedText
}

/**
 * Parse legal citation
 */
export function parseCitation(citation) {
  // Parse CFR citations
  const cfrMatch = citation.match(/(\d+)\s+CFR\s+§?\s*([\d.]+)/)
  if (cfrMatch) {
    return {
      type: 'regulation',
      title: cfrMatch[1],
      section: cfrMatch[2],
      fullCitation: citation
    }
  }

  // Parse case citations
  const caseMatch = citation.match(/(.+?)\s+v\.\s+(.+?),\s+(\d+.+)/)
  if (caseMatch) {
    return {
      type: 'case',
      plaintiff: caseMatch[1],
      defendant: caseMatch[2],
      reporter: caseMatch[3],
      fullCitation: citation
    }
  }

  // Parse USC citations
  const uscMatch = citation.match(/(\d+)\s+U\.S\.C\.\s+§?\s*([\d.]+)/)
  if (uscMatch) {
    return {
      type: 'statute',
      title: uscMatch[1],
      section: uscMatch[2],
      fullCitation: citation
    }
  }

  return {
    type: 'unknown',
    fullCitation: citation
  }
}

/**
 * Generate document summary
 */
export function generateSummary(content, maxLength = 200) {
  if (!content) return ''
  
  // Get first paragraph or sentences
  const sentences = content.match(/[^.!?]+[.!?]+/g) || []
  let summary = ''
  
  for (const sentence of sentences) {
    if (summary.length + sentence.length <= maxLength) {
      summary += sentence + ' '
    } else {
      break
    }
  }
  
  return summary.trim() || content.substring(0, maxLength) + '...'
}

/**
 * Sort documents by relevance
 */
export function sortByRelevance(documents) {
  return documents.sort((a, b) => {
    // First sort by relevance score
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore
    }
    
    // Then by date (most recent first)
    const dateA = new Date(a.lastUpdated || 0)
    const dateB = new Date(b.lastUpdated || 0)
    return dateB - dateA
  })
}

/**
 * Group documents by category
 */
export function groupByCategory(documents) {
  const grouped = {}
  
  documents.forEach(doc => {
    const category = doc.category || 'Uncategorized'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(doc)
  })
  
  return grouped
}

/**
 * Filter documents by date range
 */
export function filterByDateRange(documents, startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return documents.filter(doc => {
    const docDate = new Date(doc.lastUpdated || doc.decisionDate || doc.effectiveDate)
    return docDate >= start && docDate <= end
  })
}

/**
 * Get related documents
 */
export function getRelatedDocuments(document, allDocuments, limit = 5) {
  if (!document.keywords || document.keywords.length === 0) {
    return []
  }

  const related = []
  
  allDocuments.forEach(doc => {
    if (doc.id === document.id) return
    
    // Calculate similarity based on shared keywords
    const sharedKeywords = doc.keywords?.filter(k => 
      document.keywords.includes(k)
    ).length || 0
    
    if (sharedKeywords > 0) {
      related.push({
        ...doc,
        similarity: sharedKeywords / document.keywords.length
      })
    }
  })
  
  return related
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}

/**
 * Validate document structure
 */
export function validateDocument(document) {
  const required = ['id', 'title', 'type', 'content']
  const missing = required.filter(field => !document[field])
  
  if (missing.length > 0) {
    return {
      valid: false,
      errors: missing.map(field => `Missing required field: ${field}`)
    }
  }
  
  return { valid: true, errors: [] }
}

/**
 * Export documents to various formats
 */
export function exportDocuments(documents, format = 'json') {
  switch (format) {
    case 'json':
      return JSON.stringify(documents, null, 2)
    
    case 'csv':
      const headers = ['ID', 'Title', 'Type', 'Category', 'Summary', 'Last Updated']
      const rows = documents.map(doc => [
        doc.id,
        doc.title,
        doc.type,
        doc.category,
        doc.summary?.substring(0, 100),
        doc.lastUpdated
      ])
      
      const csv = [headers, ...rows]
        .map(row => row.map(cell => `"${cell || ''}"`).join(','))
        .join('\n')
      
      return csv
    
    case 'text':
      return documents.map(doc => 
        `${doc.title}\n${doc.citation || ''}\n${doc.summary}\n\n`
      ).join('---\n\n')
    
    default:
      return JSON.stringify(documents)
  }
}

/**
 * Import documents from various formats
 */
export function importDocuments(data, format = 'json') {
  try {
    switch (format) {
      case 'json':
        return JSON.parse(data)
      
      case 'csv':
        // Basic CSV parsing (would need more robust solution in production)
        const lines = data.split('\n')
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''))
        
        return lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.replace(/"/g, ''))
          const doc = {}
          headers.forEach((header, index) => {
            doc[header.toLowerCase().replace(/\s+/g, '_')] = values[index]
          })
          return doc
        })
      
      default:
        return JSON.parse(data)
    }
  } catch (error) {
    console.error('Import error:', error)
    return []
  }
}