import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import ClaimGuidance from '../ClaimGuidance'

// Mock the service imports
vi.mock('../../../../services/databases/VAConditionsDatabase', () => ({
  vaConditionsDatabase: {
    getCategories: () => ['Musculoskeletal', 'Mental Health', 'Cardiovascular'],
    searchConditions: (query) => [
      { id: '1', name: 'Lower Back Pain', category: 'Musculoskeletal', successRate: 0.85, averageRating: 20 }
    ],
    conditions: {
      1: { id: '1', name: 'Lower Back Pain', category: 'Musculoskeletal', successRate: 0.85, averageRating: 20 }
    },
    getConditionsByCategory: (category) => [
      { id: '1', name: 'Lower Back Pain', category: 'Musculoskeletal', successRate: 0.85, averageRating: 20 }
    ],
    calculateSuccessProbability: () => 85,
    getCombinedRating: () => 20,
    getAverageProcessingTime: () => 120
  }
}))

vi.mock('../../../../services/engines/FormGenerator', () => ({
  formGenerator: {
    generateForm: vi.fn(() => ({ formType: '21-526EZ', content: 'Generated form' })),
    generateStatement: vi.fn(() => 'Generated statement')
  }
}))

vi.mock('../../../../services/engines/AIAnalysisEngine', () => ({
  aiAnalysisEngine: {
    analyzeClaim: vi.fn(() => ({
      overallSuccessProbability: 78,
      conditionAnalysis: [
        {
          conditionName: 'Lower Back Pain',
          successProbability: 85,
          strengths: ['Strong medical evidence'],
          weaknesses: ['Missing nexus letter']
        }
      ],
      evidenceGaps: [
        {
          type: 'Medical',
          condition: 'Lower Back Pain',
          description: 'Missing recent MRI',
          action: 'Obtain MRI within last 6 months',
          severity: 'high'
        }
      ],
      recommendations: [
        {
          recommendation: 'Obtain nexus letter',
          details: 'Get medical professional to establish service connection',
          priority: 'high',
          category: 'Medical Evidence',
          timeframe: '2-4 weeks'
        }
      ],
      secondaryConditions: [],
      strategicAdvice: []
    }))
  }
}))

// Wrapper component for React Router
const Wrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('ClaimGuidance Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial Rendering', () => {
    it('renders the welcome screen on first load', () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      expect(screen.getByText('AI-Powered Claim Guidance')).toBeInTheDocument()
      expect(screen.getByText(/Let our AI assistant guide you/)).toBeInTheDocument()
      expect(screen.getByText('Smart Guidance')).toBeInTheDocument()
      expect(screen.getByText('89% Success Rate')).toBeInTheDocument()
      expect(screen.getByText('Save Time')).toBeInTheDocument()
    })

    it('displays correct step information', () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      expect(screen.getByText('Step 1 of 6')).toBeInTheDocument()
      expect(screen.getByText('0% Complete')).toBeInTheDocument()
    })

    it('shows step indicators with correct states', () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      const stepIndicators = screen.getAllByRole('generic').filter(el => 
        el.className.includes('flex flex-col items-center space-y-2')
      )
      
      // First step should be active (cyan color)
      expect(stepIndicators[0]).toHaveClass('text-cyan-400')
      // Other steps should be inactive (slate color)
      expect(stepIndicators[1]).toHaveClass('text-slate-600')
    })
  })

  describe('Navigation', () => {
    it('advances to next step when Next button is clicked', async () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      await waitFor(() => {
        expect(screen.getByText('Step 2 of 6')).toBeInTheDocument()
      })
    })

    it('goes back to previous step when Previous button is clicked', async () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      // Go to step 2
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      // Go back to step 1
      const previousButton = screen.getByRole('button', { name: /previous/i })
      await user.click(previousButton)
      
      await waitFor(() => {
        expect(screen.getByText('Step 1 of 6')).toBeInTheDocument()
      })
    })

    it('hides Previous button on first step', () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      const previousButton = screen.getByRole('button', { name: /previous/i })
      expect(previousButton).toHaveClass('invisible')
    })
  })

  describe('Veteran Information Step', () => {
    beforeEach(async () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
    })

    it('renders veteran information form', () => {
      expect(screen.getByText('Veteran Information')).toBeInTheDocument()
      expect(screen.getByLabelText('First Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Social Security Number')).toBeInTheDocument()
      expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument()
      expect(screen.getByLabelText('Military Branch')).toBeInTheDocument()
    })

    it('updates form data when user types', async () => {
      const firstNameInput = screen.getByLabelText('First Name')
      await user.type(firstNameInput, 'John')
      
      expect(firstNameInput.value).toBe('John')
    })

    it('allows selecting military branch', async () => {
      const branchSelect = screen.getByLabelText('Military Branch')
      await user.selectOptions(branchSelect, 'army')
      
      expect(branchSelect.value).toBe('army')
    })
  })

  describe('Medical Conditions Step', () => {
    beforeEach(async () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      // Navigate to conditions step (step 3)
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton) // Step 2
      await user.click(nextButton) // Step 3
    })

    it('renders medical conditions interface', () => {
      expect(screen.getByText('Medical Conditions')).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Search conditions by name/)).toBeInTheDocument()
      expect(screen.getByText('All Conditions')).toBeInTheDocument()
    })

    it('allows searching for conditions', async () => {
      const searchInput = screen.getByPlaceholderText(/Search conditions by name/)
      await user.type(searchInput, 'back pain')
      
      expect(searchInput.value).toBe('back pain')
      await waitFor(() => {
        expect(screen.getByText('Search Results')).toBeInTheDocument()
      })
    })

    it('displays category filters', () => {
      expect(screen.getByText('All Conditions')).toBeInTheDocument()
      expect(screen.getByText('Musculoskeletal')).toBeInTheDocument()
      expect(screen.getByText('Mental Health')).toBeInTheDocument()
      expect(screen.getByText('Cardiovascular')).toBeInTheDocument()
    })

    it('allows selecting conditions', async () => {
      const searchInput = screen.getByPlaceholderText(/Search conditions by name/)
      await user.type(searchInput, 'back')
      
      await waitFor(() => {
        const conditionCard = screen.getByText('Lower Back Pain')
        fireEvent.click(conditionCard.closest('.cursor-pointer'))
      })
      
      await waitFor(() => {
        expect(screen.getByText('Selected Conditions (1)')).toBeInTheDocument()
      })
    })
  })

  describe('AI Analysis Integration', () => {
    it('triggers AI analysis before final step', async () => {
      const { aiAnalysisEngine } = await import('../../../../services/engines/AIAnalysisEngine')
      
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      // Navigate to analysis step
      const nextButton = screen.getByRole('button', { name: /next/i })
      for (let i = 0; i < 4; i++) {
        await user.click(nextButton)
      }
      
      await waitFor(() => {
        expect(aiAnalysisEngine.analyzeClaim).toHaveBeenCalled()
      })
    })

    it('displays analysis loading state', async () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      // Navigate to analysis step
      const nextButton = screen.getByRole('button', { name: /next/i })
      for (let i = 0; i < 4; i++) {
        await user.click(nextButton)
      }
      
      // Should show loading during analysis
      expect(screen.getByText('AI Analyzing Your Claim')).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('handles empty form fields gracefully', async () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      // Navigate to veteran info step
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      // Try to proceed without filling required fields
      await user.click(nextButton)
      
      // Should still advance (no validation implemented yet)
      await waitFor(() => {
        expect(screen.getByText('Medical Conditions')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility Features', () => {
    it('has proper heading structure', () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveTextContent('Claim Intelligence')
      
      const subHeading = screen.getByRole('heading', { level: 2 })
      expect(subHeading).toHaveTextContent('AI-Powered Claim Guidance')
    })

    it('has keyboard accessible navigation buttons', () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      expect(nextButton).toHaveAttribute('tabIndex', '0')
    })

    it('provides progress information to screen readers', () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      expect(screen.getByText('Step 1 of 6')).toBeInTheDocument()
      expect(screen.getByText('0% Complete')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles service errors gracefully', async () => {
      const { aiAnalysisEngine } = await import('../../../../services/engines/AIAnalysisEngine')
      aiAnalysisEngine.analyzeClaim.mockImplementation(() => {
        throw new Error('Service unavailable')
      })
      
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      // Navigate to analysis step
      const nextButton = screen.getByRole('button', { name: /next/i })
      for (let i = 0; i < 4; i++) {
        await user.click(nextButton)
      }
      
      // Should handle error without crashing
      await waitFor(() => {
        // Component should still be rendered
        expect(screen.getByText('AI Analysis')).toBeInTheDocument()
      })
    })
  })

  describe('Success Modal', () => {
    it('opens success modal when claim is complete', async () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      // Navigate to final step
      const nextButton = screen.getByRole('button', { name: /next/i })
      for (let i = 0; i < 5; i++) {
        await user.click(nextButton)
      }
      
      // Click view complete claim button
      const viewButton = screen.getByRole('button', { name: /view complete claim/i })
      await user.click(viewButton)
      
      await waitFor(() => {
        expect(screen.getByText('Claim Successfully Prepared!')).toBeInTheDocument()
      })
    })

    it('closes success modal when close button is clicked', async () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      // Navigate to final step and open modal
      const nextButton = screen.getByRole('button', { name: /next/i })
      for (let i = 0; i < 5; i++) {
        await user.click(nextButton)
      }
      
      const viewButton = screen.getByRole('button', { name: /view complete claim/i })
      await user.click(viewButton)
      
      // Close modal by pressing Escape
      await user.keyboard('{Escape}')
      
      await waitFor(() => {
        expect(screen.queryByText('Claim Successfully Prepared!')).not.toBeInTheDocument()
      })
    })
  })

  describe('State Management', () => {
    it('maintains form data across step navigation', async () => {
      render(<ClaimGuidance />, { wrapper: Wrapper })
      
      // Go to veteran info step and fill data
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      const firstNameInput = screen.getByLabelText('First Name')
      await user.type(firstNameInput, 'John')
      
      // Navigate away and back
      await user.click(nextButton) // To conditions step
      const previousButton = screen.getByRole('button', { name: /previous/i })
      await user.click(previousButton) // Back to veteran info
      
      // Data should be preserved
      const preservedInput = screen.getByLabelText('First Name')
      expect(preservedInput.value).toBe('John')
    })
  })
})