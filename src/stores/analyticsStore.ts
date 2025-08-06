import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type { AnalyticsData, AnalyticsMetric, OverviewMetrics } from '../types'

interface AnalyticsState {
  // Data
  timeRange: '7d' | '30d' | '90d' | '1y'
  activeMetric: string
  selectedView: 'dashboard' | 'trends' | 'insights'
  isLoading: boolean
  metrics: AnalyticsData | null
  hoveredCard: number | null
  error: string | null

  // UI State
  isExporting: boolean
  exportProgress: number
}

interface AnalyticsActions {
  // Data actions
  setTimeRange: (range: '7d' | '30d' | '90d' | '1y') => void
  setActiveMetric: (metric: string) => void
  setSelectedView: (view: 'dashboard' | 'trends' | 'insights') => void
  setMetrics: (metrics: AnalyticsData) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // UI actions
  setHoveredCard: (cardIndex: number | null) => void
  setExporting: (exporting: boolean) => void
  setExportProgress: (progress: number) => void

  // Computed actions
  refreshData: () => Promise<void>
  exportData: (format: 'pdf' | 'xlsx' | 'csv' | 'json') => Promise<void>
  
  // Reset
  reset: () => void
}

type AnalyticsStore = AnalyticsState & AnalyticsActions

const initialState: AnalyticsState = {
  timeRange: '30d',
  activeMetric: 'overview',
  selectedView: 'dashboard',
  isLoading: false,
  metrics: null,
  hoveredCard: null,
  error: null,
  isExporting: false,
  exportProgress: 0
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // Data actions
      setTimeRange: (timeRange) => {
        set({ timeRange })
        // Trigger data refresh when time range changes
        get().refreshData()
      },

      setActiveMetric: (activeMetric) => set({ activeMetric }),
      
      setSelectedView: (selectedView) => set({ selectedView }),

      setMetrics: (metrics) => set({ metrics, isLoading: false, error: null }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      // UI actions
      setHoveredCard: (hoveredCard) => set({ hoveredCard }),

      setExporting: (isExporting) => set({ isExporting }),

      setExportProgress: (exportProgress) => set({ exportProgress }),

      // Complex actions
      refreshData: async () => {
        const { timeRange } = get()
        set({ isLoading: true, error: null })

        try {
          // Import analytics engine dynamically to avoid circular dependencies
          const { analyticsDataEngine } = await import('../services/engines/AnalyticsDataEngine')
          
          // Clear cache for fresh data
          if (analyticsDataEngine.clearCache) {
            analyticsDataEngine.clearCache()
          }

          // Simulate realistic loading time
          await new Promise(resolve => setTimeout(resolve, 800))

          const data: AnalyticsData = {
            overview: analyticsDataEngine.getOverviewMetrics(),
            performance: analyticsDataEngine.getPerformanceMetrics(),
            cases: analyticsDataEngine.getCasesData(),
            conditions: analyticsDataEngine.getConditionsData(),
            vaRegions: analyticsDataEngine.getVARegionsData(),
            insights: analyticsDataEngine.getInsights()
          }

          set({ metrics: data, isLoading: false, error: null })
        } catch (error) {
          console.error('Failed to refresh analytics data:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load analytics data',
            isLoading: false 
          })
        }
      },

      exportData: async (format) => {
        const { metrics, timeRange } = get()
        if (!metrics) return

        set({ isExporting: true, exportProgress: 0 })

        try {
          // Import reporting utilities dynamically
          const { reportingEngine, generatePracticeReport } = await import('../utils/reporting')

          // Simulate progress updates
          set({ exportProgress: 25 })
          await new Promise(resolve => setTimeout(resolve, 500))

          const report = generatePracticeReport({
            timeRange,
            includeFinancials: true,
            includeRegionalData: true,
            format: 'json'
          })

          set({ exportProgress: 75 })
          await new Promise(resolve => setTimeout(resolve, 300))

          const result = reportingEngine.exportData(report, format, `analytics_${timeRange}`)

          set({ exportProgress: 100 })
          await new Promise(resolve => setTimeout(resolve, 200))

          // Announce success for screen readers
          if (typeof window !== 'undefined' && 'announceToScreenReader' in window) {
            (window as any).announceToScreenReader(`Analytics report exported successfully as ${format.toUpperCase()}`)
          }

          console.log('Export completed:', result)
        } catch (error) {
          console.error('Export failed:', error)
          set({ error: 'Export failed. Please try again.' })

          // Announce error for screen readers
          if (typeof window !== 'undefined' && 'announceToScreenReader' in window) {
            (window as any).announceToScreenReader('Export failed. Please try again or contact support.')
          }
        } finally {
          set({ isExporting: false, exportProgress: 0 })
        }
      },

      reset: () => set(initialState)
    })),
    {
      name: 'analytics-store',
      partialize: (state) => ({
        timeRange: state.timeRange,
        activeMetric: state.activeMetric,
        selectedView: state.selectedView
      })
    }
  )
)

// Selectors for optimized subscriptions
export const useAnalyticsMetrics = () => useAnalyticsStore(state => state.metrics)
export const useAnalyticsLoading = () => useAnalyticsStore(state => state.isLoading)
export const useAnalyticsError = () => useAnalyticsStore(state => state.error)
export const useAnalyticsTimeRange = () => useAnalyticsStore(state => state.timeRange)
export const useAnalyticsSelectedView = () => useAnalyticsStore(state => state.selectedView)
export const useAnalyticsHoveredCard = () => useAnalyticsStore(state => state.hoveredCard)
export const useAnalyticsExporting = () => useAnalyticsStore(state => ({
  isExporting: state.isExporting,
  progress: state.exportProgress
}))

// Action selectors
export const useAnalyticsActions = () => useAnalyticsStore(state => ({
  setTimeRange: state.setTimeRange,
  setActiveMetric: state.setActiveMetric,
  setSelectedView: state.setSelectedView,
  setHoveredCard: state.setHoveredCard,
  refreshData: state.refreshData,
  exportData: state.exportData,
  reset: state.reset
}))

// Computed selectors
export const useAnalyticsOverview = () => useAnalyticsStore(state => state.metrics?.overview)
export const useAnalyticsCases = () => useAnalyticsStore(state => state.metrics?.cases)
export const useAnalyticsConditions = () => useAnalyticsStore(state => state.metrics?.conditions)
export const useAnalyticsInsights = () => useAnalyticsStore(state => state.metrics?.insights)