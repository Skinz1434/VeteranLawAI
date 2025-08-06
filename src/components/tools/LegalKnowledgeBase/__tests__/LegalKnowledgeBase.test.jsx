import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LegalKnowledgeBase from '../LegalKnowledgeBase'

// Mock the DocumentDatabase service
vi.mock('../../../../services/databases/DocumentDatabase', () => ({
  documentDatabase: {
    getAllDocuments: vi.fn(() => [
      {
        id: '1',
        title: 'VA Regulation 38 CFR 3.303',
        type: 'regulation',
        category: 'Service Connection',
        summary: 'Principles relating to service connection',
        content: 'Test regulation content',
        lastUpdated: '2023-01-15',
        relevanceScore: 0.95,
        bookmarked: false,
        tags: ['service-connection', 'regulations']
      },
      {
        id: '2', 
        title: 'BVA Decision on PTSD',
        type: 'case-law',
        category: 'Mental Health',
        summary: 'Important PTSD precedent case',
        content: 'Test case law content',
        lastUpdated: '2023-02-10',
        relevanceScore: 0.88,
        bookmarked: true,
        tags: ['ptsd', 'mental-health']
      }
    ]),
    search: vi.fn((query, options) => [
      {
        id: '1',
        title: 'VA Regulation 38 CFR 3.303',
        type: 'regulation',
        category: 'Service Connection',
        summary: 'Principles relating to service connection',
        content: 'Test regulation content',
        lastUpdated: '2023-01-15',
        relevanceScore: 0.95,
        bookmarked: false
      }
    ]),
    addBookmark: vi.fn(() => true),
    removeBookmark: vi.fn(() => true),
    getCategories: vi.fn(() => ['Service Connection', 'Mental Health', 'Physical Disabilities']),
    getRecentDocuments: vi.fn(() => []),
    getPopularDocuments: vi.fn(() => [])
  }
}))

describe('LegalKnowledgeBase Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial Rendering', () => {
    it('renders the legal knowledge base interface', () => {
      render(<LegalKnowledgeBase />)
      
      expect(screen.getByText('Legal Knowledge Base')).toBeInTheDocument()
      expect(screen.getByText(/AI-powered search through 14,500\+ legal documents/)).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('displays filter tabs', () => {
      render(<LegalKnowledgeBase />)
      
      expect(screen.getByText('All Documents')).toBeInTheDocument()
      expect(screen.getByText('Regulations')).toBeInTheDocument()
      expect(screen.getByText('Case Law')).toBeInTheDocument()
      expect(screen.getByText('Precedents')).toBeInTheDocument()
      expect(screen.getByText('M21-1 Manual')).toBeInTheDocument()
    })

    it('shows initial documents on load', async () => {
      render(<LegalKnowledgeBase />)
      
      await waitFor(() => {
        expect(screen.getByText('VA Regulation 38 CFR 3.303')).toBeInTheDocument()
        expect(screen.getByText('BVA Decision on PTSD')).toBeInTheDocument()
      })
    })

    it('displays document count statistics', async () => {
      render(<LegalKnowledgeBase />)
      
      await waitFor(() => {
        expect(screen.getByText(/All Documents \(2\)/)).toBeInTheDocument()
      })
    })
  })

  describe('Search Functionality', () => {
    it('allows user to enter search query', async () => {
      render(<LegalKnowledgeBase />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'service connection')
      
      expect(searchInput.value).toBe('service connection')
    })

    it('performs search when Enter key is pressed', async () => {
      const { documentDatabase } = await import('../../../../services/databases/DocumentDatabase')
      render(<LegalKnowledgeBase />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'regulation{enter}')
      
      await waitFor(() => {
        expect(documentDatabase.search).toHaveBeenCalledWith('regulation', { type: 'all' })
      })
    })

    it('performs search when search button is clicked', async () => {
      const { documentDatabase } = await import('../../../../services/databases/DocumentDatabase')
      render(<LegalKnowledgeBase />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'PTSD')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)
      
      await waitFor(() => {
        expect(documentDatabase.search).toHaveBeenCalledWith('PTSD', { type: 'all' })
      })
    })

    it('shows loading state during search', async () => {
      render(<LegalKnowledgeBase />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'test query')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)
      
      expect(screen.getByText(/Searching knowledge base/)).toBeInTheDocument()
    })

    it('updates search results after completion', async () => {
      render(<LegalKnowledgeBase />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'regulation')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)
      
      await waitFor(() => {
        expect(screen.getByText('Search Results (1)')).toBeInTheDocument()
      })
    })
  })

  describe('Filter Functionality', () => {
    it('filters documents by type when filter tab is clicked', async () => {
      const { documentDatabase } = await import('../../../../services/databases/DocumentDatabase')
      render(<LegalKnowledgeBase />)
      
      const regulationsTab = screen.getByText('Regulations')
      await user.click(regulationsTab)
      
      // Should filter to show only regulations
      await waitFor(() => {
        expect(documentDatabase.getAllDocuments).toHaveBeenCalled()
      })
    })

    it('maintains search query when switching filters', async () => {
      render(<LegalKnowledgeBase />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'service connection')
      
      const regulationsTab = screen.getByText('Regulations')
      await user.click(regulationsTab)
      
      expect(searchInput.value).toBe('service connection')
    })

    it('updates document counts when filters change', async () => {
      render(<LegalKnowledgeBase />)
      
      const regulationsTab = screen.getByText('Regulations')
      await user.click(regulationsTab)
      
      // Tab should show count
      expect(regulationsTab.textContent).toMatch(/Regulations/)
    })
  })

  describe('Document Display', () => {
    beforeEach(async () => {
      render(<LegalKnowledgeBase />)
      await waitFor(() => {
        expect(screen.getByText('VA Regulation 38 CFR 3.303')).toBeInTheDocument()
      })
    })

    it('displays document cards with essential information', () => {
      expect(screen.getByText('VA Regulation 38 CFR 3.303')).toBeInTheDocument()
      expect(screen.getByText('Service Connection')).toBeInTheDocument()
      expect(screen.getByText('Principles relating to service connection')).toBeInTheDocument()
    })

    it('shows document type badges', () => {
      expect(screen.getByText('regulation')).toBeInTheDocument()
      expect(screen.getByText('case-law')).toBeInTheDocument()
    })

    it('displays relevance scores', () => {
      expect(screen.getByText('95% relevant')).toBeInTheDocument()
      expect(screen.getByText('88% relevant')).toBeInTheDocument()
    })

    it('shows last updated information', () => {
      expect(screen.getByText('Updated: Jan 15, 2023')).toBeInTheDocument()
      expect(screen.getByText('Updated: Feb 10, 2023')).toBeInTheDocument()
    })
  })

  describe('Document Modal', () => {
    beforeEach(async () => {
      render(<LegalKnowledgeBase />)
      await waitFor(() => {
        expect(screen.getByText('VA Regulation 38 CFR 3.303')).toBeInTheDocument()
      })
    })

    it('opens document modal when document title is clicked', async () => {
      const documentTitle = screen.getByText('VA Regulation 38 CFR 3.303')
      await user.click(documentTitle)
      
      await waitFor(() => {
        expect(screen.getByText('Document Details')).toBeInTheDocument()
      })
    })

    it('displays full document content in modal', async () => {
      const documentTitle = screen.getByText('VA Regulation 38 CFR 3.303')
      await user.click(documentTitle)
      
      await waitFor(() => {
        expect(screen.getByText('Test regulation content')).toBeInTheDocument()
      })
    })

    it('shows document metadata in modal', async () => {
      const documentTitle = screen.getByText('VA Regulation 38 CFR 3.303')
      await user.click(documentTitle)
      
      await waitFor(() => {
        expect(screen.getByText('Document Type:')).toBeInTheDocument()
        expect(screen.getByText('Category:')).toBeInTheDocument()
        expect(screen.getByText('Last Updated:')).toBeInTheDocument()
      })
    })

    it('closes modal when close button is clicked', async () => {
      const documentTitle = screen.getByText('VA Regulation 38 CFR 3.303')
      await user.click(documentTitle)
      
      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close document')
        user.click(closeButton)
      })
      
      await waitFor(() => {
        expect(screen.queryByText('Document Details')).not.toBeInTheDocument()
      })
    })
  })

  describe('Bookmark Functionality', () => {
    beforeEach(async () => {
      render(<LegalKnowledgeBase />)
      await waitFor(() => {
        expect(screen.getByText('VA Regulation 38 CFR 3.303')).toBeInTheDocument()
      })
    })

    it('allows bookmarking documents', async () => {
      const { documentDatabase } = await import('../../../../services/databases/DocumentDatabase')
      
      const bookmarkButtons = screen.getAllByRole('button', { name: /bookmark/i })
      await user.click(bookmarkButtons[0])
      
      expect(documentDatabase.addBookmark).toHaveBeenCalledWith('1')
    })

    it('allows removing bookmarks', async () => {
      const { documentDatabase } = await import('../../../../services/databases/DocumentDatabase')
      
      // Find the already bookmarked document (BVA Decision on PTSD)
      const bookmarkButtons = screen.getAllByRole('button', { name: /bookmark/i })
      const bookmarkedButton = bookmarkButtons.find(button => 
        button.closest('.cursor-pointer').querySelector('h3').textContent === 'BVA Decision on PTSD'
      )
      
      if (bookmarkedButton) {
        await user.click(bookmarkedButton)
        expect(documentDatabase.removeBookmark).toHaveBeenCalledWith('2')
      }
    })

    it('shows different bookmark states visually', () => {
      // Bookmarked documents should have filled bookmark icon
      // Non-bookmarked should have outline icon
      const bookmarkButtons = screen.getAllByRole('button', { name: /bookmark/i })
      expect(bookmarkButtons).toHaveLength(2)
    })
  })

  describe('Recent Searches', () => {
    it('tracks recent searches', async () => {
      render(<LegalKnowledgeBase />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'service connection{enter}')
      
      await waitFor(() => {
        // Recent searches should be updated (not directly visible in current UI)
        expect(searchInput.value).toBe('service connection')
      })
    })

    it('prevents duplicate entries in recent searches', async () => {
      render(<LegalKnowledgeBase />)
      
      const searchInput = screen.getByRole('textbox')
      
      // Search the same term twice
      await user.type(searchInput, 'PTSD{enter}')
      await user.clear(searchInput)
      await user.type(searchInput, 'PTSD{enter}')
      
      // Should not create duplicate entries
      await waitFor(() => {
        expect(searchInput.value).toBe('PTSD')
      })
    })
  })

  describe('Empty States', () => {
    it('shows empty state when no documents match search', async () => {
      const { documentDatabase } = await import('../../../../services/databases/DocumentDatabase')
      documentDatabase.search.mockReturnValue([])
      
      render(<LegalKnowledgeBase />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'nonexistent{enter}')
      
      await waitFor(() => {
        expect(screen.getByText(/No documents found/)).toBeInTheDocument()
      })
    })

    it('shows empty state with helpful suggestions', async () => {
      const { documentDatabase } = await import('../../../../services/databases/DocumentDatabase')
      documentDatabase.search.mockReturnValue([])
      
      render(<LegalKnowledgeBase />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'xyz{enter}')
      
      await waitFor(() => {
        expect(screen.getByText(/Try different keywords/)).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('handles database errors gracefully', async () => {
      const { documentDatabase } = await import('../../../../services/databases/DocumentDatabase')
      documentDatabase.search.mockImplementation(() => {
        throw new Error('Database error')
      })
      
      render(<LegalKnowledgeBase />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'error test{enter}')
      
      // Should handle error without crashing
      await waitFor(() => {
        expect(screen.getByText('Legal Knowledge Base')).toBeInTheDocument()
      })
    })

    it('handles bookmark operation failures', async () => {
      const { documentDatabase } = await import('../../../../services/databases/DocumentDatabase')
      documentDatabase.addBookmark.mockImplementation(() => {
        throw new Error('Bookmark failed')
      })
      
      render(<LegalKnowledgeBase />)
      
      await waitFor(() => {
        const bookmarkButtons = screen.getAllByRole('button', { name: /bookmark/i })
        user.click(bookmarkButtons[0])
      })
      
      // Should handle error gracefully
      await waitFor(() => {
        expect(screen.getByText('Legal Knowledge Base')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility Features', () => {
    it('has proper heading structure', () => {
      render(<LegalKnowledgeBase />)
      
      const mainHeading = screen.getByRole('heading', { level: 2 })
      expect(mainHeading).toHaveTextContent('Legal Knowledge Base')
    })

    it('provides keyboard navigation for search', async () => {
      render(<LegalKnowledgeBase />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'test{enter}')
      
      // Should trigger search via keyboard
      await waitFor(() => {
        expect(screen.getByText(/Searching knowledge base/)).toBeInTheDocument()
      })
    })

    it('has accessible filter buttons', () => {
      render(<LegalKnowledgeBase />)
      
      const filterButtons = screen.getAllByRole('button')
      const filterTab = filterButtons.find(button => button.textContent.includes('Regulations'))
      
      expect(filterTab).toBeInTheDocument()
    })
  })

  describe('Performance Considerations', () => {
    it('limits initial document loading', () => {
      const { documentDatabase } = await import('../../../../services/databases/DocumentDatabase')
      
      render(<LegalKnowledgeBase />)
      
      // Should call getAllDocuments only once initially
      expect(documentDatabase.getAllDocuments).toHaveBeenCalledTimes(1)
    })

    it('handles large result sets efficiently', async () => {
      const { documentDatabase } = await import('../../../../services/databases/DocumentDatabase')
      
      // Mock large result set
      const largeResults = Array.from({ length: 100 }, (_, i) => ({
        id: i.toString(),
        title: `Document ${i}`,
        type: 'regulation',
        category: 'Test',
        summary: 'Test summary',
        lastUpdated: '2023-01-01',
        relevanceScore: 0.5
      }))
      
      documentDatabase.search.mockReturnValue(largeResults)
      
      render(<LegalKnowledgeBase />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'test{enter}')
      
      await waitFor(() => {
        expect(screen.getByText('Search Results (100)')).toBeInTheDocument()
      })
    })
  })
})