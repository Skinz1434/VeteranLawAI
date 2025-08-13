/**
 * @fileoverview Data Export and Reporting Utilities for VeteranLawAI Platform
 * @author VeteranLawAI Platform
 * @version 1.0.0
 *
 * Comprehensive reporting and data export functionality for veteran law practice management.
 * Supports multiple formats and veteran-specific reporting requirements.
 *
 * Features:
 * - PDF report generation
 * - Excel/CSV data export
 * - Legal document formatting
 * - Client-ready reports
 * - Practice analytics export
 * - Compliance reporting
 */

import { analyticsDataEngine } from '../services/engines/AnalyticsDataEngine'
import { vaCaseLawDatabase } from '../services/databases/VACaseLawDatabase'
import { vaConditionsDatabase } from '../services/databases/VAConditionsDatabase'

/**
 * Report Generation Engine
 * Creates professional reports for veteran law practice
 */
export class ReportingEngine {
  constructor() {
    this.reportTemplates = this.initializeReportTemplates()
    this.exportFormats = ['pdf', 'xlsx', 'csv', 'docx', 'json']
  }

  /**
   * Initialize report templates for different use cases
   */
  initializeReportTemplates() {
    return {
      practiceAnalytics: {
        name: 'Practice Analytics Report',
        description: 'Comprehensive practice performance analysis',
        sections: ['overview', 'conditions', 'regions', 'trends', 'recommendations'],
        clientFacing: false,
        confidential: true,
      },
      caseResearch: {
        name: 'Legal Research Report',
        description: 'Case law analysis and precedent research',
        sections: ['summary', 'precedents', 'analysis', 'strategy', 'citations'],
        clientFacing: true,
        confidential: false,
      },
      claimAnalysis: {
        name: 'VA Claim Analysis Report',
        description: 'Detailed claim analysis with recommendations',
        sections: ['claimSummary', 'evidence', 'analysis', 'recommendations', 'timeline'],
        clientFacing: true,
        confidential: true,
      },
      conditionReport: {
        name: 'Condition Success Rate Report',
        description: 'Success rates and strategies by condition type',
        sections: ['conditions', 'statistics', 'evidence', 'precedents', 'strategies'],
        clientFacing: false,
        confidential: true,
      },
      clientSummary: {
        name: 'Client Case Summary',
        description: 'Client-friendly case status and next steps',
        sections: ['status', 'progress', 'nextSteps', 'timeline', 'contact'],
        clientFacing: true,
        confidential: false,
      },
    }
  }

  /**
   * Generate comprehensive practice analytics report
   * @param {Object} options - Report configuration
   * @returns {Object} Generated report data
   */
  generatePracticeAnalyticsReport(options = {}) {
    const {
      timeRange = '30d',
      includeFinancials = true,
      includeRegionalData = true,
      format = 'json',
    } = options

    const analytics = analyticsDataEngine.getOverviewMetrics()
    const performance = analyticsDataEngine.getPerformanceMetrics()
    const conditions = analyticsDataEngine.getConditionsData()
    const regions = analyticsDataEngine.getVARegionsData()
    const insights = analyticsDataEngine.getInsights()

    const report = {
      metadata: {
        title: 'VeteranLawAI Practice Analytics Report',
        generatedAt: new Date().toISOString(),
        timeRange,
        reportId: this.generateReportId(),
        confidential: true,
      },
      executiveSummary: {
        totalCases: analytics.totalCases,
        successRate: `${analytics.successRate}%`,
        totalAwarded: this.formatCurrency(analytics.totalAwarded),
        avgProcessingTime: `${analytics.avgProcessingTime} months`,
        activeClaims: analytics.activeClaims,
        keyInsights: insights.slice(0, 3).map(insight => ({
          type: insight.type,
          title: insight.title,
          impact: insight.impact || 'medium',
        })),
      },
      performanceMetrics: {
        caseMetrics: {
          totalFiled: analytics.totalCases,
          successRate: analytics.successRate,
          averageCaseValue: this.formatCurrency(performance.avgCaseValue),
          processingTime: analytics.avgProcessingTime,
        },
        clientSatisfaction: {
          satisfactionRate: `${performance.clientSatisfaction}%`,
          referralRate: `${performance.referralRate}%`,
          retainerConversion: `${performance.retainerConversion}%`,
        },
        appeals: {
          pendingAppeals: analytics.pendingAppeals,
          appealWinRate: `${performance.appealWinRate}%`,
          avgAppealTime: '8.2 months',
        },
      },
      conditionAnalysis: conditions.map(condition => ({
        name: condition.name,
        cases: condition.cases,
        successRate: `${condition.success}%`,
        averageRating: `${condition.avgRating}%`,
        averageValue: this.formatCurrency(condition.avgValue),
        difficulty: condition.difficulty,
        trend: condition.trendDirection,
        keyEvidence: condition.commonEvidence,
        precedents: condition.keyPrecedents,
      })),
      regionalPerformance: includeRegionalData
        ? regions.map(region => ({
            office: region.region,
            cases: region.cases,
            successRate: `${region.success}%`,
            avgProcessingTime: `${region.avgTime} months`,
            trend: region.trends || { speed: 0, approval: 0 },
          }))
        : null,
      insights: insights.map(insight => ({
        type: insight.type,
        priority: insight.priority || 'medium',
        title: insight.title,
        description: insight.description,
        recommendation: insight.recommendation,
        actionable: insight.actionable,
        impact: insight.impact || 'medium',
        timeframe: insight.timeframe || 'Unknown',
      })),
      recommendations: this.generatePracticeRecommendations(analytics, conditions, insights),
      appendix: {
        methodology: 'Data aggregated from case management system and VA databases',
        dataQuality: 'High - based on actual case outcomes and VA statistics',
        limitations: 'Report based on available data within specified time range',
        lastUpdated: new Date().toISOString(),
      },
    }

    return this.formatReport(report, format)
  }

  /**
   * Generate case research report
   * @param {Array} cases - Selected cases
   * @param {Object} analysis - Case analysis results
   * @param {Object} options - Report options
   * @returns {Object} Case research report
   */
  generateCaseResearchReport(cases, analysis, options = {}) {
    const { clientName, issueDescription, format = 'json' } = options

    const report = {
      metadata: {
        title: 'Legal Research Analysis Report',
        generatedAt: new Date().toISOString(),
        clientName: clientName || 'Confidential Client',
        reportId: this.generateReportId(),
        confidential: true,
      },
      executiveSummary: {
        issueDescription: issueDescription || 'Legal research analysis',
        casesAnalyzed: cases.length,
        primaryPrecedents: cases.filter(c => c.precedentStrength === 'high').length,
        overallAssessment: this.assessOverallStrength(analysis),
        keyFindings: this.extractKeyFindings(cases, analysis),
      },
      caseAnalysis: cases.map(caseItem => ({
        title: caseItem.title,
        citation: caseItem.citation,
        court: caseItem.court,
        year: new Date(caseItem.date).getFullYear(),
        precedentStrength: caseItem.precedentStrength,
        relevanceScore: `${Math.round(caseItem.relevanceScore * 100)}%`,
        keyHolding: caseItem.keyHoldings?.[0] || caseItem.holding,
        factPattern: caseItem.factPattern,
        practicalApplication: caseItem.practicalApplication,
        strengths: this.analyzeCaseStrengths(caseItem),
        limitations: this.analyzeCaseLimitations(caseItem),
      })),
      legalStrategy: {
        recommendedApproach:
          analysis?.recommendedStrategy ||
          'Develop comprehensive legal strategy based on identified precedents',
        primaryAuthority: cases.filter(c => c.precedentStrength === 'high').map(c => c.title),
        supportingAuthority: cases.filter(c => c.precedentStrength === 'medium').map(c => c.title),
        riskFactors: this.identifyRiskFactors(cases),
        successProbability: this.calculateSuccessProbability(cases, analysis),
      },
      citationStrategy: this.generateCitationStrategy(cases),
      nextSteps: this.generateNextSteps(cases, analysis),
      appendix: {
        searchMethodology: 'Comprehensive search of VA case law database and federal precedents',
        databasesCovered: ['VA Case Law Database', 'Federal Circuit Decisions', 'CAVC Opinions'],
        lastUpdated: new Date().toISOString(),
      },
    }

    return this.formatReport(report, format)
  }

  /**
   * Generate claim analysis report for veterans
   * @param {Object} claimData - Claim information
   * @param {Object} analysis - AI analysis results
   * @param {Object} options - Report options
   * @returns {Object} Claim analysis report
   */
  generateClaimAnalysisReport(claimData, analysis, options = {}) {
    const { veteranName, format = 'json', clientFacing = true } = options

    const report = {
      metadata: {
        title: clientFacing ? 'VA Disability Claim Analysis' : 'Internal Claim Analysis Report',
        generatedAt: new Date().toISOString(),
        veteranName: veteranName || 'Veteran',
        reportId: this.generateReportId(),
        confidential: true,
        clientFacing,
      },
      claimSummary: {
        conditions: claimData.conditions?.map(c => c.name) || [],
        overallSuccessProbability: `${analysis.overallSuccessProbability || 75}%`,
        estimatedTimeline: analysis.estimatedTimeline?.description || '4-6 months',
        potentialRating: analysis.potentialRating?.description || 'To be determined',
        estimatedValue: this.calculateEstimatedClaimValue(claimData, analysis),
      },
      conditionAnalysis: (analysis.conditionAnalysis || []).map(condition => ({
        condition: condition.conditionName,
        successProbability: `${condition.successProbability}%`,
        strengths: condition.strengths,
        weaknesses: condition.weaknesses,
        criticalActions: condition.criticalActions,
        evidenceNeeded: this.getEvidenceRequirements(condition.conditionId),
      })),
      evidenceGaps: (analysis.evidenceGaps || []).map(gap => ({
        condition: gap.condition,
        type: gap.type,
        severity: gap.severity,
        description: gap.description,
        action: gap.action,
        priority: gap.severity === 'critical' ? 'High' : gap.severity === 'high' ? 'Medium' : 'Low',
      })),
      recommendations: (analysis.recommendations || []).map(rec => ({
        priority: rec.priority,
        category: rec.category,
        recommendation: rec.recommendation,
        details: rec.details,
        timeframe: rec.timeframe,
        actionable: true,
      })),
      secondaryConditions: (analysis.secondaryConditions || []).map(secondary => ({
        condition: secondary.condition,
        primaryConnection: secondary.primaryConnection,
        probability: `${Math.round(secondary.probability * 100)}%`,
        reason: secondary.reason,
        recommendation: secondary.recommendation,
      })),
      strategicAdvice: (analysis.strategicAdvice || []).map(advice => ({
        type: advice.type,
        title: advice.title,
        description: advice.description,
        impact: advice.impact,
        timeframe: advice.timeframe || 'Ongoing',
      })),
      nextSteps: this.generateClaimNextSteps(analysis),
      timeline: this.generateClaimTimeline(analysis),
      resources: this.getVeteranResources(),
    }

    return this.formatReport(report, format)
  }

  /**
   * Export data to various formats
   * @param {Object} data - Data to export
   * @param {string} format - Export format
   * @param {string} filename - Output filename
   * @returns {Object} Export result
   */
  exportData(data, format = 'json', filename = null) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
    const defaultFilename = filename || `veteranlawai_export_${timestamp}`

    switch (format.toLowerCase()) {
      case 'json':
        return this.exportJSON(data, `${defaultFilename}.json`)
      case 'csv':
        return this.exportCSV(data, `${defaultFilename}.csv`)
      case 'xlsx':
        return this.exportExcel(data, `${defaultFilename}.xlsx`)
      case 'pdf':
        return this.exportPDF(data, `${defaultFilename}.pdf`)
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  }

  /**
   * Export data as JSON
   */
  exportJSON(data, filename) {
    const jsonData = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    this.downloadFile(blob, filename)

    return {
      success: true,
      format: 'json',
      filename,
      size: blob.size,
    }
  }

  /**
   * Export data as CSV
   */
  exportCSV(data, filename) {
    let csvContent = ''

    if (Array.isArray(data)) {
      // Handle array of objects
      if (data.length > 0) {
        const headers = Object.keys(data[0])
        csvContent = headers.join(',') + '\n'

        data.forEach(row => {
          const values = headers.map(header => {
            let value = row[header]
            if (typeof value === 'object') {
              value = JSON.stringify(value)
            }
            return `"${String(value).replace(/"/g, '""')}"`
          })
          csvContent += values.join(',') + '\n'
        })
      }
    } else {
      // Handle single object - flatten to key-value pairs
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          // Nested object
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            csvContent += `"${key}.${nestedKey}","${String(nestedValue).replace(/"/g, '""')}"\n`
          })
        } else {
          csvContent += `"${key}","${String(value).replace(/"/g, '""')}"\n`
        }
      })
    }

    const blob = new Blob([csvContent], { type: 'text/csv' })
    this.downloadFile(blob, filename)

    return {
      success: true,
      format: 'csv',
      filename,
      size: blob.size,
    }
  }

  /**
   * Export data as PDF (simplified text-based PDF)
   */
  exportPDF(data, filename) {
    // This is a simplified PDF export - in production, use a library like jsPDF
    let pdfContent = `VeteranLawAI Report\n\n`
    pdfContent += `Generated: ${new Date().toLocaleString()}\n\n`
    pdfContent += JSON.stringify(data, null, 2)

    const blob = new Blob([pdfContent], { type: 'application/pdf' })
    this.downloadFile(blob, filename)

    return {
      success: true,
      format: 'pdf',
      filename,
      size: blob.size,
    }
  }

  /**
   * Download file to user's computer
   */
  downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  /**
   * Format currency values
   */
  formatCurrency(amount) {
    if (typeof amount !== 'number') return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  /**
   * Generate unique report ID
   */
  generateReportId() {
    return 'RPT-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase()
  }

  /**
   * Format report based on requested format
   */
  formatReport(report, format) {
    switch (format.toLowerCase()) {
      case 'json':
        return report
      case 'csv':
        return this.convertToCSVFormat(report)
      case 'pdf':
        return this.convertToPDFFormat(report)
      default:
        return report
    }
  }

  /**
   * Helper methods for report generation
   */
  generatePracticeRecommendations(analytics, conditions, insights) {
    const recommendations = []

    // High-success conditions
    const highSuccessConditions = conditions.filter(c => c.success > 90)
    if (highSuccessConditions.length > 0) {
      recommendations.push({
        type: 'growth',
        priority: 'medium',
        title: 'Focus on High-Success Conditions',
        description: `Conditions with >90% success rate: ${highSuccessConditions.map(c => c.name).join(', ')}`,
        action: 'Increase marketing and capacity for these condition types',
      })
    }

    // Processing time improvements
    if (analytics.trends.time < -10) {
      recommendations.push({
        type: 'efficiency',
        priority: 'high',
        title: 'Processing Time Improvement',
        description: `Processing times improved by ${Math.abs(analytics.trends.time)}%`,
        action: 'Document and replicate successful process improvements',
      })
    }

    return recommendations
  }

  assessOverallStrength(analysis) {
    if (!analysis) return 'Analysis pending'

    const strengthScore = analysis.strengthAssessment?.overall || 0.5
    if (strengthScore > 0.8) return 'Strong case with favorable precedents'
    if (strengthScore > 0.6) return 'Moderate case with some supporting authority'
    return 'Challenging case requiring careful strategy'
  }

  extractKeyFindings(cases, analysis) {
    return [
      `${cases.filter(c => c.precedentStrength === 'high').length} high-value precedents identified`,
      `Average relevance score: ${Math.round((cases.reduce((sum, c) => sum + (c.relevanceScore || 0.5), 0) / cases.length) * 100)}%`,
      `Primary jurisdiction: ${cases[0]?.court || 'Federal courts'}`,
    ]
  }

  analyzeCaseStrengths(caseItem) {
    const strengths = []
    if (caseItem.precedentStrength === 'high') strengths.push('High precedential value')
    if (caseItem.relevanceScore > 0.8) strengths.push('Highly relevant to case facts')
    if (caseItem.winRate > 0.8) strengths.push('Strong success rate in practice')
    return strengths
  }

  analyzeCaseLimitations(caseItem) {
    const limitations = []
    if (caseItem.precedentStrength === 'low') limitations.push('Limited precedential authority')
    if (caseItem.relevanceScore < 0.5) limitations.push('Limited factual similarity')
    return limitations
  }

  identifyRiskFactors(cases) {
    const risks = []
    const oldCases = cases.filter(
      c => new Date().getFullYear() - new Date(c.date).getFullYear() > 10
    )
    if (oldCases.length > cases.length * 0.5) {
      risks.push('Many precedents are over 10 years old - verify current applicability')
    }
    return risks
  }

  calculateSuccessProbability(cases, analysis) {
    const avgRelevance = cases.reduce((sum, c) => sum + (c.relevanceScore || 0.5), 0) / cases.length
    const highPrecedents = cases.filter(c => c.precedentStrength === 'high').length / cases.length
    return `${Math.round((avgRelevance * 0.6 + highPrecedents * 0.4) * 100)}%`
  }

  generateCitationStrategy(cases) {
    return {
      primary: cases.filter(c => c.precedentStrength === 'high').map(c => c.citation),
      supporting: cases.filter(c => c.precedentStrength === 'medium').map(c => c.citation),
      order: 'Lead with strongest precedent, use supporting cases to build comprehensive argument',
    }
  }

  generateNextSteps(cases, analysis) {
    return [
      'Review complete case holdings and factual patterns',
      'Develop legal argument structure based on precedent hierarchy',
      'Identify and address potential counterarguments',
      'Draft legal brief incorporating identified precedents',
    ]
  }

  calculateEstimatedClaimValue(claimData, analysis) {
    const potentialRating = analysis.potentialRating?.combined || 50
    const monthlyRate = this.getRateForRating(potentialRating)
    const annualValue = monthlyRate * 12
    const retroactiveMonths = 12 // Assume 12 months retroactive
    const total = annualValue + monthlyRate * retroactiveMonths
    return this.formatCurrency(total)
  }

  getRateForRating(rating) {
    const rates = {
      10: 171,
      20: 338,
      30: 524,
      40: 755,
      50: 1075,
      60: 1362,
      70: 1716,
      80: 1995,
      90: 2242,
      100: 3738,
    }
    const roundedRating = Math.round(rating / 10) * 10
    return rates[roundedRating] || rates[50]
  }

  getEvidenceRequirements(conditionId) {
    // This would integrate with the conditions database
    return ['Current medical diagnosis', 'Nexus letter', 'Service treatment records']
  }

  generateClaimNextSteps(analysis) {
    const steps = []

    if (analysis.evidenceGaps?.some(gap => gap.severity === 'critical')) {
      steps.push('Address critical evidence gaps before filing')
    }

    steps.push('Gather all required medical evidence')
    steps.push('Obtain nexus letter from treating physician')
    steps.push('File VA disability compensation claim')
    steps.push('Attend C&P examination if scheduled')
    steps.push('Monitor claim status and respond to VA requests')

    return steps
  }

  generateClaimTimeline(analysis) {
    const timeline = analysis.estimatedTimeline || { months: 4 }
    return {
      filing: '0-2 weeks',
      initialReview: '2-4 weeks',
      examination: '1-3 months',
      decision: `${timeline.months} months`,
      appeal: 'If needed: +6-12 months',
    }
  }

  getVeteranResources() {
    return [
      'VA.gov - Official VA website',
      'VA Regional Office locator',
      'Veterans Service Organizations (VSOs)',
      'VA disability compensation rates',
      'Appeal process information',
    ]
  }

  convertToCSVFormat(report) {
    // Simplified CSV conversion - flattens the report structure
    const flatData = []
    this.flattenObject(report, '', flatData)
    return flatData
  }

  flattenObject(obj, prefix, result) {
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      const newKey = prefix ? `${prefix}.${key}` : key

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        this.flattenObject(value, newKey, result)
      } else {
        result.push({ key: newKey, value: String(value) })
      }
    })
  }

  convertToPDFFormat(report) {
    // Simplified PDF format - would use proper PDF library in production
    return {
      title: report.metadata?.title || 'VeteranLawAI Report',
      content: JSON.stringify(report, null, 2),
      generated: new Date().toISOString(),
    }
  }
}

// Create singleton instance
export const reportingEngine = new ReportingEngine()

// Export convenience functions
export const generatePracticeReport = options =>
  reportingEngine.generatePracticeAnalyticsReport(options)
export const generateCaseReport = (cases, analysis, options) =>
  reportingEngine.generateCaseResearchReport(cases, analysis, options)
export const generateClaimReport = (claimData, analysis, options) =>
  reportingEngine.generateClaimAnalysisReport(claimData, analysis, options)
export const exportData = (data, format, filename) =>
  reportingEngine.exportData(data, format, filename)
