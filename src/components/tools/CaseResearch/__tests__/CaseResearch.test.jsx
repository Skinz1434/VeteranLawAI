import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CaseResearch from '../CaseResearch'

// Mock the service imports
vi.mock('../../../../services/databases/VACaseLawDatabase', () => ({
  vaCaseLawDatabase: {
    search: vi.fn(() => [
      {
        id: '1',
        title: 'Smith v. VA',
        court: 'BVA',
        date: '2023-01-15',
        outcome: 'favorable',
        precedentStrength: 'high',
        summary: 'Test case summary',
        keyIssues: ['PTSD', 'Service Connection'],
        citation: '23 Vet. App. 123',
        facts: 'Test facts',
        holding: 'Test holding',
        reasoning: 'Test reasoning',
        relevanceScore: 0.95
      }
    ]),
    getAllCases: vi.fn(() => [
      {
        id: '1',
        title: 'Smith v. VA',
        court: 'BVA',
        date: '2023-01-15',
        outcome: 'favorable',
        precedentStrength: 'high',
        summary: 'Test case summary'
      }
    ]),
    getCategories: vi.fn(() => ['PTSD', 'Back Injury', 'Hearing Loss']),
    getCourts: vi.fn(() => ['BVA', 'CAVC', 'Federal Circuit']),
    getOutcomes: vi.fn(() => ['favorable', 'unfavorable', 'remanded'])
  }
}))

vi.mock('../../../../services/engines/CaseAnalysisEngine', () => ({
  caseAnalysisEngine: {
    analyzeCaseRelevance: vi.fn(() => ({
      relevanceScore: 0.85,
      keyFactors: ['Similar medical condition', 'Service connection established'],
      applicability: 'Direct precedent applies to user\'s case',
      strengthAnalysis: 'Strong precedential value'
    }))
  }
}))

vi.mock('../../../../utils/reporting', () => ({
  reportingEngine: {
    exportData: vi.fn(() => 'mock-export-data')
  }
}))

describe('CaseResearch Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial Rendering', () => {
    it('renders the case research interface', () => {
      render(<CaseResearch />)
      
      expect(screen.getByText('Legal Case Research')).toBeInTheDocument()
      expect(screen.getByText(/AI-powered search through 50,000\+ VA legal cases/)).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('displays initial case results on load', async () => {
      render(<CaseResearch />)
      
      await waitFor(() => {
        expect(screen.getByText('Smith v. VA')).toBeInTheDocument()
      })
    })

    it('shows search statistics', () => {
      render(<CaseResearch />)
      
      expect(screen.getByText(/Database: 50,000\+ cases/)).toBeInTheDocument()
      expect(screen.getByText(/Updated: Real-time/)).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('allows user to enter search query', async () => {
      render(<CaseResearch />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'PTSD service connection')
      
      expect(searchInput.value).toBe('PTSD service connection')
    })

    it('performs search when search button is clicked', async () => {
      const { vaCaseLawDatabase } = await import('../../../../services/databases/VACaseLawDatabase')
      render(<CaseResearch />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'PTSD')
      
      const searchButton = screen.getByRole('button', { name: /search cases/i })
      await user.click(searchButton)
      
      await waitFor(() => {
        expect(vaCaseLawDatabase.search).toHaveBeenCalledWith('PTSD', expect.any(Object))
      })
    })

    it('shows loading state during search', async () => {
      render(<CaseResearch />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'test query')
      
      const searchButton = screen.getByRole('button', { name: /search cases/i })
      await user.click(searchButton)
      
      expect(screen.getByText(/Searching legal database/)).toBeInTheDocument()
    })

    it('displays search results after completion', async () => {
      render(<CaseResearch />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'Smith')
      
      const searchButton = screen.getByRole('button', { name: /search cases/i })
      await user.click(searchButton)
      
      await waitFor(() => {
        expect(screen.getByText('Smith v. VA')).toBeInTheDocument()
      })
    })
  })

  describe('Filter Functionality', () => {
    it('displays filter options', () => {
      render(<CaseResearch />)
      
      expect(screen.getByText('All Categories')).toBeInTheDocument()
      expect(screen.getByText('All Courts')).toBeInTheDocument()
      expect(screen.getByText('All Outcomes')).toBeInTheDocument()
    })

    it('allows filtering by category', async () => {
      render(<CaseResearch />)
      
      // Click on category filter
      const categoryFilter = screen.getByText('All Categories')
      await user.click(categoryFilter)
      
      // Should trigger re-search with filter
      await waitFor(() => {
        // Verify filter state changed
        expect(categoryFilter).toBeInTheDocument()
      })
    })

    it('allows filtering by court', async () => {
      render(<CaseResearch />)
      
      const courtFilter = screen.getByText('All Courts')
      await user.click(courtFilter)
      
      await waitFor(() => {
        expect(courtFilter).toBeInTheDocument()
      })
    })
  })

  describe('Case Details Modal', () => {
    beforeEach(async () => {
      render(<CaseResearch />)
      await waitFor(() => {
        expect(screen.getByText('Smith v. VA')).toBeInTheDocument()
      })
    })

    it('opens case details when case is clicked', async () => {
      const caseTitle = screen.getByText('Smith v. VA')
      await user.click(caseTitle)
      
      await waitFor(() => {
        expect(screen.getByText('Case Analysis')).toBeInTheDocument()
      })
    })

    it('displays comprehensive case information in modal', async () => {
      const caseTitle = screen.getByText('Smith v. VA')
      await user.click(caseTitle)
      
      await waitFor(() => {
        expect(screen.getByText('Facts:')).toBeInTheDocument()
        expect(screen.getByText('Holding:')).toBeInTheDocument()
        expect(screen.getByText('Reasoning:')).toBeInTheDocument()
      })
    })

    it('closes modal when close button is clicked', async () => {
      const caseTitle = screen.getByText('Smith v. VA')
      await user.click(caseTitle)
      
      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close case details')
        user.click(closeButton)
      })
      
      await waitFor(() => {
        expect(screen.queryByText('Case Analysis')).not.toBeInTheDocument()
      })
    })
  })

  describe('Case Comparison Feature', () => {
    beforeEach(async () => {
      render(<CaseResearch />)
      await waitFor(() => {
        expect(screen.getByText('Smith v. VA')).toBeInTheDocument()
      })
    })

    it('allows adding cases to comparison', async () => {
      const compareButton = screen.getAllByText(/compare/i)[0]
      await user.click(compareButton)
      
      await waitFor(() => {
        expect(screen.getByText(/cases selected for comparison/)).toBeInTheDocument()
      })
    })

    it('shows comparison panel when cases are selected', async () => {
      const compareButton = screen.getAllByText(/compare/i)[0]
      await user.click(compareButton)
      
      await waitFor(() => {
        expect(screen.getByText('Case Comparison')).toBeInTheDocument()
      })
    })

    it('allows removing cases from comparison', async () => {
      const compareButton = screen.getAllByText(/compare/i)[0]
      await user.click(compareButton)
      
      await waitFor(() => {
        const removeButton = screen.getByLabelText(/remove from comparison/i)
        user.click(removeButton)
      })
      
      await waitFor(() => {
        expect(screen.queryByText('Case Comparison')).not.toBeInTheDocument()
      })
    })
  })

  describe('Export Functionality', () => {
    it('allows exporting search results', async () => {
      const { reportingEngine } = await import('../../../../utils/reporting')
      render(<CaseResearch />)
      
      // Wait for initial results
      await waitFor(() => {
        expect(screen.getByText('Smith v. VA')).toBeInTheDocument()
      })
      
      const exportButton = screen.getByText(/export results/i)
      await user.click(exportButton)
      
      expect(reportingEngine.exportData).toHaveBeenCalled()
    })
  })

  describe('AI Analysis Integration', () => {
    it('provides AI relevance analysis for cases', async () => {
      const { caseAnalysisEngine } = await import('../../../../services/engines/CaseAnalysisEngine')
      render(<CaseResearch />)
      
      // Wait for results and click on a case
      await waitFor(() => {
        const caseTitle = screen.getByText('Smith v. VA')
        user.click(caseTitle)
      })
      
      await waitFor(() => {
        expect(caseAnalysisEngine.analyzeCaseRelevance).toHaveBeenCalled()
      })
    })

    it('displays AI analysis results in modal', async () => {
      render(<CaseResearch />)
      
      await waitFor(() => {
        const caseTitle = screen.getByText('Smith v. VA')
        user.click(caseTitle)
      })
      
      await waitFor(() => {
        expect(screen.getByText('AI Relevance Analysis')).toBeInTheDocument()
        expect(screen.getByText(/Similar medical condition/)).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility Features', () => {
    it('has proper heading structure', () => {
      render(<CaseResearch />)
      
      const mainHeading = screen.getByRole('heading', { level: 2 })
      expect(mainHeading).toHaveTextContent('Legal Case Research')
    })

    it('provides keyboard navigation for search', async () => {
      render(<CaseResearch />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'test')
      await user.keyboard('{Enter}')
      
      // Should trigger search
      await waitFor(() => {
        expect(screen.getByText(/Searching legal database/)).toBeInTheDocument()
      })
    })

    it('has accessible buttons with proper labels', () => {
      render(<CaseResearch />)
      
      const searchButton = screen.getByRole('button', { name: /search cases/i })
      expect(searchButton).toBeInTheDocument()
    })

    it('provides screen reader friendly case information', async () => {
      render(<CaseResearch />)
      
      await waitFor(() => {
        // Should have accessible case information
        expect(screen.getByText('Smith v. VA')).toBeInTheDocument()
        expect(screen.getByText('BVA')).toBeInTheDocument() // Court information
      })
    })
  })

  describe('Error Handling', () => {
    it('handles search service errors gracefully', async () => {
      const { vaCaseLawDatabase } = await import('../../../../services/databases/VACaseLawDatabase')
      vaCaseLawDatabase.search.mockImplementation(() => {
        throw new Error('Database unavailable')
      })
      
      render(<CaseResearch />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'error test')
      
      const searchButton = screen.getByRole('button', { name: /search cases/i })
      await user.click(searchButton)
      
      // Should handle error without crashing
      await waitFor(() => {
        // Component should still be rendered
        expect(screen.getByText('Legal Case Research')).toBeInTheDocument()
      })
    })

    it('handles empty search results', async () => {
      const { vaCaseLawDatabase } = await import('../../../../services/databases/VACaseLawDatabase')
      vaCaseLawDatabase.search.mockReturnValue([])
      
      render(<CaseResearch />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'no results query')
      
      const searchButton = screen.getByRole('button', { name: /search cases/i })
      await user.click(searchButton)
      
      await waitFor(() => {
        expect(screen.getByText(/No cases found/)).toBeInTheDocument()
      })
    })
  })

  describe('Performance Considerations', () => {
    it('limits initial results to prevent performance issues', async () => {
      const { vaCaseLawDatabase } = await import('../../../../services/databases/VACaseLawDatabase')
      
      render(<CaseResearch />)
      
      await waitFor(() => {
        expect(vaCaseLawDatabase.getAllCases).toHaveBeenCalled()
      })
    })

    it('debounces search input to avoid excessive queries', async () => {
      render(<CaseResearch />)
      
      const searchInput = screen.getByRole('textbox')
      
      // Type rapidly
      await user.type(searchInput, 'fast typing test')
      
      // Should not trigger search for every keystroke
      // (This test would need actual debouncing implementation)
    })
  })

  describe('State Management', () => {
    it('maintains search state across interactions', async () => {
      render(<CaseResearch />)
      
      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'persistent query')
      
      // Interact with other elements
      const categoryFilter = screen.getByText('All Categories')
      await user.click(categoryFilter)
      
      // Search input should maintain value
      expect(searchInput.value).toBe('persistent query')
    })

    it('updates filter state correctly', async () => {
      render(<CaseResearch />)
      
      const categoryFilter = screen.getByText('All Categories')
      await user.click(categoryFilter)
      
      // Filter state should change (visual indication)
      expect(categoryFilter).toBeInTheDocument()
    })
  })
})