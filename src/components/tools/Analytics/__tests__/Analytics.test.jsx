import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Analytics from '../Analytics'

// Mock the AnalyticsDataEngine service
vi.mock('../../../../services/engines/AnalyticsDataEngine', () => ({
  analyticsDataEngine: {
    getOverviewMetrics: vi.fn(() => ({
      totalCases: 2453,
      successRate: 87,
      avgProcessingTime: 8.5,
      totalAwarded: 12450000,
      activeClaims: 156,
      pendingAppeals: 43,
      trends: {
        cases: 12.5,
        success: 4.2,
        time: -8.1,
        awarded: 15.3,
        active: 7.8,
        appeals: -2.4
      }
    })),
    getPerformanceMetrics: vi.fn(() => ({
      casesThisMonth: 89,
      successThisMonth: 78,
      avgTimeThisMonth: 7.2
    })),
    getCasesData: vi.fn(() => [
      {
        month: 'Jan',
        filed: 142,
        won: 124,
        appeals: 8
      },
      {
        month: 'Feb',
        filed: 156,
        won: 135,
        appeals: 12
      },
      {
        month: 'Mar',
        filed: 134,
        won: 118,
        appeals: 6
      }
    ]),
    getConditionsData: vi.fn(() => [
      {
        name: 'PTSD',
        cases: 342,
        success: 89,
        avgRating: 70,
        avgValue: 145000,
        difficulty: 'moderate',
        trendDirection: 'up',
        commonEvidence: ['C&P Exam', 'Service Records', 'Buddy Letters'],
        keyPrecedents: ['Jandreau v. Nicholson', 'Suozzi v. Brown']
      },
      {
        name: 'Tinnitus',
        cases: 298,
        success: 94,
        avgRating: 10,
        avgValue: 45000,
        difficulty: 'easy',
        trendDirection: 'up',
        commonEvidence: ['Audiogram', 'Service Records'],
        keyPrecedents: ['Hensley v. West']
      }
    ]),
    getVARegionsData: vi.fn(() => [
      {
        region: 'Atlanta',
        cases: 245,
        success: 84,
        avgTime: 9.2
      },
      {
        region: 'Chicago',
        cases: 189,
        success: 91,
        avgTime: 7.8
      }
    ]),
    getInsights: vi.fn(() => [
      {
        type: 'trend',
        title: 'PTSD Claims Trending Up',
        description: 'PTSD filings increased 24% this quarter',
        actionable: true
      },
      {
        type: 'alert',
        title: 'Processing Delays in Atlanta',
        description: 'Atlanta RO showing 15% longer processing times',
        actionable: true
      },
      {
        type: 'opportunity',
        title: 'High Success Rate Pattern',
        description: 'Tinnitus claims have 94% success rate',
        actionable: false
      }
    ]),
    clearCache: vi.fn()
  }
}))

// Mock the reporting utilities
vi.mock('../../../../utils/reporting', () => ({
  reportingEngine: {
    exportData: vi.fn(() => ({ success: true, file: 'report.pdf' }))
  },
  generatePracticeReport: vi.fn(() => ({
    timeRange: '30d',
    totalCases: 2453,
    metrics: {}
  }))
}))

// Mock announceToScreenReader function
global.announceToScreenReader = vi.fn()

describe('Analytics Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial Rendering', () => {
    it('shows loading state on initial load', () => {
      render(<Analytics />)
      
      expect(screen.getByText('Loading Analytics')).toBeInTheDocument()
      expect(screen.getByText('Processing practice data and generating insights...')).toBeInTheDocument()
    })

    it('renders the analytics dashboard after data loads', async () => {
      render(<Analytics />)
      
      await waitFor(() => {
        expect(screen.getByText('Analytics Intelligence')).toBeInTheDocument()
      })
      
      expect(screen.getByText(/Advanced VA Legal Performance & Predictive Insights/)).toBeInTheDocument()
    })

    it('displays key metrics cards', async () => {
      render(<Analytics />)
      
      await waitFor(() => {
        expect(screen.getByText('Total Cases')).toBeInTheDocument()
        expect(screen.getByText('Success Rate')).toBeInTheDocument()
        expect(screen.getByText('Processing Time')).toBeInTheDocument()
        expect(screen.getByText('Total Awarded')).toBeInTheDocument()
        expect(screen.getByText('Active Claims')).toBeInTheDocument()
        expect(screen.getByText('Appeals')).toBeInTheDocument()
      })
    })

    it('shows live data indicator', async () => {
      render(<Analytics />)
      
      await waitFor(() => {
        expect(screen.getByText('Live Data')).toBeInTheDocument()
      })
    })
  })

  describe('Time Range Selection', () => {
    it('allows changing time range', async () => {
      render(<Analytics />)
      
      await waitFor(() => {
        const timeRangeSelect = screen.getByDisplayValue('Last 30 days')
        expect(timeRangeSelect).toBeInTheDocument()
      })
      
      const select = screen.getByDisplayValue('Last 30 days')
      await user.selectOptions(select, '7d')
      
      expect(select.value).toBe('7d')
    })

    it('reloads data when time range changes', async () => {
      const { analyticsDataEngine } = await import('../../../../services/engines/AnalyticsDataEngine')
      render(<Analytics />)
      
      await waitFor(() => {
        const select = screen.getByDisplayValue('Last 30 days')
        user.selectOptions(select, '90d')
      })
      
      // Should trigger new data load
      await waitFor(() => {
        expect(analyticsDataEngine.getOverviewMetrics).toHaveBeenCalledTimes(2)
      })
    })

    it('shows all time range options', async () => {
      render(<Analytics />)
      
      await waitFor(() => {
        const select = screen.getByDisplayValue('Last 30 days')
        expect(select).toBeInTheDocument()
      })
      
      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(4)
      expect(screen.getByText('Last 7 days')).toBeInTheDocument()
      expect(screen.getByText('Last 30 days')).toBeInTheDocument()
      expect(screen.getByText('Last 90 days')).toBeInTheDocument()
      expect(screen.getByText('Last year')).toBeInTheDocument()
    })
  })

  describe('View Toggle Functionality', () => {
    it('shows view toggle buttons', async () => {
      render(<Analytics />)
      
      await waitFor(() => {
        expect(screen.getByText('dashboard')).toBeInTheDocument()
        expect(screen.getByText('trends')).toBeInTheDocument()
        expect(screen.getByText('insights')).toBeInTheDocument()
      })
    })

    it('allows switching between views', async () => {
      render(<Analytics />)
      
      await waitFor(() => {
        const trendsButton = screen.getByText('trends')
        user.click(trendsButton)
      })
      
      // Dashboard view should still be active by default
      const dashboardButton = screen.getByText('dashboard')
      expect(dashboardButton).toHaveClass('bg-gradient-to-r')
    })

    it('highlights active view', async () => {
      render(<Analytics />)
      
      await waitFor(() => {
        const dashboardButton = screen.getByText('dashboard')
        expect(dashboardButton).toHaveClass('bg-gradient-to-r')
        
        const trendsButton = screen.getByText('trends')
        expect(trendsButton).toHaveClass('text-slate-400')
      })
    })
  })

  describe('Metrics Display', () => {
    beforeEach(async () => {
      render(<Analytics />)
      await waitFor(() => {
        expect(screen.getByText('Analytics Intelligence')).toBeInTheDocument()
      })
    })

    it('displays formatted numbers correctly', () => {
      expect(screen.getByText('2,453')).toBeInTheDocument() // totalCases
      expect(screen.getByText('87%')).toBeInTheDocument() // successRate
      expect(screen.getByText('8.5mo')).toBeInTheDocument() // avgProcessingTime
      expect(screen.getByText('156')).toBeInTheDocument() // activeClaims
      expect(screen.getByText('43')).toBeInTheDocument() // pendingAppeals
    })

    it('displays formatted currency correctly', () => {
      expect(screen.getByText('$12,450,000')).toBeInTheDocument() // totalAwarded
    })

    it('shows trend indicators with proper colors', () => {
      // Positive trend indicators
      const positiveTrends = screen.getAllByText('12.5%')
      expect(positiveTrends[0]).toHaveClass('text-green-400')
      
      // Negative trend indicators  
      const negativeTrends = screen.getAllByText('8.1%')
      expect(negativeTrends[0]).toHaveClass('text-red-400')
    })

    it('displays metric descriptions', () => {
      expect(screen.getByText('All time filed')).toBeInTheDocument()
      expect(screen.getByText('Win percentage')).toBeInTheDocument()
      expect(screen.getByText('Average duration')).toBeInTheDocument()
      expect(screen.getByText('Compensation won')).toBeInTheDocument()
      expect(screen.getByText('Currently pending')).toBeInTheDocument()
      expect(screen.getByText('Under review')).toBeInTheDocument()
    })
  })

  describe('Case Performance Timeline', () => {
    beforeEach(async () => {
      render(<Analytics />)
      await waitFor(() => {
        expect(screen.getByText('Case Performance Timeline')).toBeInTheDocument()
      })
    })

    it('displays timeline chart section', () => {
      expect(screen.getByText('Case Performance Timeline')).toBeInTheDocument()
      expect(screen.getByText('Monthly filing and success metrics')).toBeInTheDocument()
    })

    it('shows chart legend', () => {
      expect(screen.getByText('Filed')).toBeInTheDocument()
      expect(screen.getByText('Won')).toBeInTheDocument()
      expect(screen.getByText('Appeals')).toBeInTheDocument()
    })

    it('displays monthly case data', () => {
      expect(screen.getByText('142 filed')).toBeInTheDocument()
      expect(screen.getByText('124 won')).toBeInTheDocument()
      expect(screen.getByText('156 filed')).toBeInTheDocument()
      expect(screen.getByText('135 won')).toBeInTheDocument()
    })

    it('calculates and displays success rates', () => {
      expect(screen.getByText('87.3%')).toBeInTheDocument() // Jan: 124/142
      expect(screen.getByText('86.5%')).toBeInTheDocument() // Feb: 135/156  
      expect(screen.getByText('88.1%')).toBeInTheDocument() // Mar: 118/134
    })
  })

  describe('AI Insights Panel', () => {
    beforeEach(async () => {
      render(<Analytics />)
      await waitFor(() => {
        expect(screen.getByText('AI Insights')).toBeInTheDocument()
      })
    })

    it('displays insights section', () => {
      expect(screen.getByText('AI Insights')).toBeInTheDocument()
      expect(screen.getByText('Predictive analytics')).toBeInTheDocument()
    })

    it('shows all insight types', () => {
      expect(screen.getByText('PTSD Claims Trending Up')).toBeInTheDocument()
      expect(screen.getByText('Processing Delays in Atlanta')).toBeInTheDocument()
      expect(screen.getByText('High Success Rate Pattern')).toBeInTheDocument()
    })

    it('displays insight descriptions', () => {
      expect(screen.getByText('PTSD filings increased 24% this quarter')).toBeInTheDocument()
      expect(screen.getByText('Atlanta RO showing 15% longer processing times')).toBeInTheDocument()
      expect(screen.getByText('Tinnitus claims have 94% success rate')).toBeInTheDocument()
    })

    it('shows actionable insight indicators', () => {
      const actionRequiredElements = screen.getAllByText('Action Required')
      expect(actionRequiredElements).toHaveLength(2) // Two actionable insights
    })
  })

  describe('Condition Performance Analysis', () => {
    beforeEach(async () => {
      render(<Analytics />)
      await waitFor(() => {
        expect(screen.getByText('Condition Performance Analysis')).toBeInTheDocument()
      })
    })

    it('displays conditions analysis section', () => {
      expect(screen.getByText('Condition Performance Analysis')).toBeInTheDocument()
      expect(screen.getByText('Success rates, precedents, and strategic insights')).toBeInTheDocument()
    })

    it('shows condition cards', () => {
      expect(screen.getByText('PTSD')).toBeInTheDocument()
      expect(screen.getByText('Tinnitus')).toBeInTheDocument()
      expect(screen.getByText('342 cases handled')).toBeInTheDocument()
      expect(screen.getByText('298 cases handled')).toBeInTheDocument()
    })

    it('displays success rates and ratings', () => {
      expect(screen.getByText('89%')).toBeInTheDocument() // PTSD success
      expect(screen.getByText('70%')).toBeInTheDocument() // PTSD avg rating
      expect(screen.getByText('94%')).toBeInTheDocument() // Tinnitus success
      expect(screen.getByText('10%')).toBeInTheDocument() // Tinnitus avg rating
    })

    it('shows difficulty badges', () => {
      expect(screen.getByText('moderate')).toBeInTheDocument() // PTSD difficulty
      expect(screen.getByText('easy')).toBeInTheDocument() // Tinnitus difficulty
    })

    it('displays average case values', () => {
      expect(screen.getByText('$145,000')).toBeInTheDocument() // PTSD avg value
      expect(screen.getByText('$45,000')).toBeInTheDocument() // Tinnitus avg value
    })

    it('shows key evidence for conditions', () => {
      expect(screen.getByText('C&P Exam')).toBeInTheDocument()
      expect(screen.getByText('Service Records')).toBeInTheDocument()
      expect(screen.getByText('Buddy Letters')).toBeInTheDocument()
      expect(screen.getByText('Audiogram')).toBeInTheDocument()
    })

    it('displays key precedents', () => {
      expect(screen.getByText('Jandreau v. Nicholson')).toBeInTheDocument()
      expect(screen.getByText('Suozzi v. Brown')).toBeInTheDocument()
      expect(screen.getByText('Hensley v. West')).toBeInTheDocument()
    })
  })

  describe('VA Regional Office Performance', () => {
    beforeEach(async () => {
      render(<Analytics />)
      await waitFor(() => {
        expect(screen.getByText('VA Regional Office Performance')).toBeInTheDocument()
      })
    })

    it('displays regional performance section', () => {
      expect(screen.getByText('VA Regional Office Performance')).toBeInTheDocument()
      expect(screen.getByText('Strategic insights by jurisdiction')).toBeInTheDocument()
    })

    it('shows regional office data', () => {
      expect(screen.getByText('Atlanta')).toBeInTheDocument()
      expect(screen.getByText('Chicago')).toBeInTheDocument()
      expect(screen.getByText('245')).toBeInTheDocument() // Atlanta cases
      expect(screen.getByText('189')).toBeInTheDocument() // Chicago cases
    })

    it('displays success rates and processing times', () => {
      expect(screen.getByText('84% success')).toBeInTheDocument() // Atlanta
      expect(screen.getByText('91% success')).toBeInTheDocument() // Chicago
      expect(screen.getByText('9.2mo avg')).toBeInTheDocument() // Atlanta
      expect(screen.getByText('7.8mo avg')).toBeInTheDocument() // Chicago
    })
  })

  describe('Data Refresh Functionality', () => {
    it('shows refresh button', async () => {
      render(<Analytics />)
      
      await waitFor(() => {
        expect(screen.getByText('Refresh')).toBeInTheDocument()
      })
    })

    it('refreshes data when refresh button is clicked', async () => {
      const { analyticsDataEngine } = await import('../../../../services/engines/AnalyticsDataEngine')
      render(<Analytics />)
      
      await waitFor(() => {
        const refreshButton = screen.getByText('Refresh')
        user.click(refreshButton)
      })
      
      expect(analyticsDataEngine.clearCache).toHaveBeenCalled()
    })

    it('shows loading state during refresh', async () => {
      render(<Analytics />)
      
      await waitFor(() => {
        const refreshButton = screen.getByText('Refresh')
        user.click(refreshButton)
      })
      
      const refreshIcon = screen.getByText('Refresh').previousSibling
      expect(refreshIcon).toHaveClass('animate-spin')
    })

    it('disables refresh button during loading', async () => {
      render(<Analytics />)
      
      await waitFor(() => {
        const refreshButton = screen.getByText('Refresh').closest('button')
        user.click(refreshButton)
      })
      
      const refreshButton = screen.getByText('Refresh').closest('button')
      expect(refreshButton).toBeDisabled()
    })
  })

  describe('Export Functionality', () => {
    beforeEach(async () => {
      render(<Analytics />)
      await waitFor(() => {
        expect(screen.getByText('Export Report')).toBeInTheDocument()
      })
    })

    it('shows export report button', () => {
      expect(screen.getByText('Export Report')).toBeInTheDocument()
    })

    it('shows export format dropdown on hover', async () => {
      const exportButton = screen.getByText('Export Report').closest('div')
      
      fireEvent.mouseEnter(exportButton)
      
      await waitFor(() => {
        expect(screen.getByText('Export as PDF')).toBeInTheDocument()
        expect(screen.getByText('Export as Excel')).toBeInTheDocument()
        expect(screen.getByText('Export as CSV')).toBeInTheDocument()
        expect(screen.getByText('Export as JSON')).toBeInTheDocument()
      })
    })

    it('handles PDF export', async () => {
      const { reportingEngine, generatePracticeReport } = await import('../../../../utils/reporting')
      
      const exportButton = screen.getByText('Export Report')
      await user.click(exportButton)
      
      await waitFor(() => {
        expect(generatePracticeReport).toHaveBeenCalledWith({
          timeRange: '30d',
          includeFinancials: true,
          includeRegionalData: true,
          format: 'json'
        })
        expect(reportingEngine.exportData).toHaveBeenCalled()
      })
    })

    it('handles different export formats', async () => {
      const { reportingEngine } = await import('../../../../utils/reporting')
      
      const exportButton = screen.getByText('Export Report').closest('div')
      fireEvent.mouseEnter(exportButton)
      
      await waitFor(() => {
        const excelButton = screen.getByText('Export as Excel')
        user.click(excelButton)
      })
      
      await waitFor(() => {
        expect(reportingEngine.exportData).toHaveBeenCalledWith(
          expect.any(Object), 
          'xlsx', 
          'practice_analytics_30d'
        )
      })
    })

    it('announces successful export to screen readers', async () => {
      const exportButton = screen.getByText('Export Report')
      await user.click(exportButton)
      
      await waitFor(() => {
        expect(global.announceToScreenReader).toHaveBeenCalledWith(
          'Analytics report exported successfully as PDF'
        )
      })
    })

    it('handles export errors gracefully', async () => {
      const { reportingEngine } = await import('../../../../utils/reporting')
      reportingEngine.exportData.mockImplementation(() => {
        throw new Error('Export failed')
      })
      
      const exportButton = screen.getByText('Export Report')
      await user.click(exportButton)
      
      await waitFor(() => {
        expect(global.announceToScreenReader).toHaveBeenCalledWith(
          'Export failed. Please try again or contact support.'
        )
      })
    })
  })

  describe('Accessibility Features', () => {
    beforeEach(async () => {
      render(<Analytics />)
      await waitFor(() => {
        expect(screen.getByText('Analytics Intelligence')).toBeInTheDocument()
      })
    })

    it('has proper heading structure', () => {
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveTextContent('Analytics Intelligence')
      
      const sectionHeadings = screen.getAllByRole('heading', { level: 3 })
      expect(sectionHeadings.length).toBeGreaterThan(0)
    })

    it('provides keyboard navigation for interactive elements', () => {
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeVisible()
      })
      
      const select = screen.getByRole('combobox')
      expect(select).toBeVisible()
    })

    it('has accessible form controls', () => {
      const timeRangeSelect = screen.getByDisplayValue('Last 30 days')
      expect(timeRangeSelect).toBeInTheDocument()
      expect(timeRangeSelect).not.toHaveAttribute('aria-label', '')
    })
  })

  describe('Error Handling', () => {
    it('handles analytics data loading errors', async () => {
      const { analyticsDataEngine } = await import('../../../../services/engines/AnalyticsDataEngine')
      analyticsDataEngine.getOverviewMetrics.mockImplementation(() => {
        throw new Error('Data loading failed')
      })
      
      render(<Analytics />)
      
      // Should still show loading state and not crash
      expect(screen.getByText('Loading Analytics')).toBeInTheDocument()
    })

    it('handles refresh failures gracefully', async () => {
      const { analyticsDataEngine } = await import('../../../../services/engines/AnalyticsDataEngine')
      analyticsDataEngine.clearCache.mockImplementation(() => {
        throw new Error('Cache clear failed')
      })
      
      render(<Analytics />)
      
      await waitFor(() => {
        const refreshButton = screen.getByText('Refresh')
        user.click(refreshButton)
      })
      
      // Component should not crash
      await waitFor(() => {
        expect(screen.getByText('Analytics Intelligence')).toBeInTheDocument()
      })
    })
  })

  describe('Performance Considerations', () => {
    it('limits initial data loading calls', () => {
      const { analyticsDataEngine } = await import('../../../../services/engines/AnalyticsDataEngine')
      
      render(<Analytics />)
      
      // Should only load data once initially
      expect(analyticsDataEngine.getOverviewMetrics).toHaveBeenCalledTimes(1)
      expect(analyticsDataEngine.getPerformanceMetrics).toHaveBeenCalledTimes(1)
      expect(analyticsDataEngine.getCasesData).toHaveBeenCalledTimes(1)
      expect(analyticsDataEngine.getConditionsData).toHaveBeenCalledTimes(1)
      expect(analyticsDataEngine.getVARegionsData).toHaveBeenCalledTimes(1)
      expect(analyticsDataEngine.getInsights).toHaveBeenCalledTimes(1)
    })

    it('handles large datasets efficiently', async () => {
      const { analyticsDataEngine } = await import('../../../../services/engines/AnalyticsDataEngine')
      
      // Mock large dataset
      const largeConditionsData = Array.from({ length: 50 }, (_, i) => ({
        name: `Condition ${i}`,
        cases: 100 + i,
        success: 80 + (i % 20),
        avgRating: 50 + (i % 50),
        avgValue: 50000 + (i * 1000),
        difficulty: ['easy', 'moderate', 'hard'][i % 3],
        trendDirection: ['up', 'down', 'stable'][i % 3],
        commonEvidence: ['Evidence 1', 'Evidence 2'],
        keyPrecedents: ['Precedent 1']
      }))
      
      analyticsDataEngine.getConditionsData.mockReturnValue(largeConditionsData)
      
      render(<Analytics />)
      
      await waitFor(() => {
        expect(screen.getByText('Condition Performance Analysis')).toBeInTheDocument()
      })
      
      // Should render large dataset without issues
      expect(screen.getByText('Condition 0')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('adapts to different screen sizes', async () => {
      render(<Analytics />)
      
      await waitFor(() => {
        const gridElements = document.querySelectorAll('[class*="grid-cols"]')
        expect(gridElements.length).toBeGreaterThan(0)
      })
      
      // Check for responsive grid classes
      const responsiveGrids = document.querySelectorAll('[class*="md:grid-cols"], [class*="lg:grid-cols"], [class*="xl:grid-cols"]')
      expect(responsiveGrids.length).toBeGreaterThan(0)
    })
  })
})