/**
 * @fileoverview Case Analysis Engine for Legal Research
 * @author VeteranLawAI Platform
 * @version 1.0.0
 *
 * Provides intelligent analysis of case law relevance, precedential value,
 * and strategic application for VA disability claims.
 */

export class CaseAnalysisEngine {
  constructor() {
    this.analysisFactors = this.initializeAnalysisFactors()
    this.precedenceHierarchy = this.initializePrecedenceHierarchy()
  }

  initializeAnalysisFactors() {
    return {
      relevanceFactors: {
        exactIssueMatch: 0.4,
        categoryMatch: 0.25,
        factualSimilarity: 0.2,
        legalPrincipleMatch: 0.15,
      },
      precedentialWeights: {
        'Federal Circuit': 1.0,
        'Court of Appeals for Veterans Claims': 0.9,
        'Board of Veterans Appeals': 0.3,
        'Regional Office': 0.1,
      },
      temporalWeights: {
        current: 1.0, // Last 5 years
        recent: 0.8, // 5-10 years
        dated: 0.6, // 10-20 years
        old: 0.4, // 20+ years
      },
    }
  }

  initializePrecedenceHierarchy() {
    return {
      'Federal Circuit': {
        level: 1,
        binding: ['Court of Appeals for Veterans Claims', 'Board of Veterans Appeals'],
        description: 'Highest authority for VA law',
      },
      'Court of Appeals for Veterans Claims': {
        level: 2,
        binding: ['Board of Veterans Appeals'],
        description: 'Primary VA appellate court',
      },
      'Board of Veterans Appeals': {
        level: 3,
        binding: [],
        description: 'Administrative tribunal',
      },
    }
  }

  /**
   * Analyzes case relevance to a specific legal issue
   * @param {Object} targetCase - The case being analyzed
   * @param {Object} userIssue - The user's legal issue
   * @returns {Object} Relevance analysis
   */
  analyzeCaseRelevance(targetCase, userIssue) {
    const analysis = {
      overallRelevance: 0,
      relevanceFactors: {},
      precedentialValue: 0,
      temporalRelevance: 0,
      practicalApplication: '',
      strengths: [],
      limitations: [],
      recommendedUse: '',
    }

    // Calculate relevance factors
    analysis.relevanceFactors.exactIssueMatch = this.calculateExactIssueMatch(targetCase, userIssue)
    analysis.relevanceFactors.categoryMatch = this.calculateCategoryMatch(targetCase, userIssue)
    analysis.relevanceFactors.factualSimilarity = this.calculateFactualSimilarity(
      targetCase,
      userIssue
    )
    analysis.relevanceFactors.legalPrincipleMatch = this.calculateLegalPrincipleMatch(
      targetCase,
      userIssue
    )

    // Calculate overall relevance
    analysis.overallRelevance = Object.entries(analysis.relevanceFactors).reduce(
      (sum, [factor, score]) => {
        return sum + score * this.analysisFactors.relevanceFactors[factor]
      },
      0
    )

    // Calculate precedential value
    analysis.precedentialValue = this.calculatePrecedentialValue(targetCase)

    // Calculate temporal relevance
    analysis.temporalRelevance = this.calculateTemporalRelevance(targetCase)

    // Generate practical application guidance
    analysis.practicalApplication = this.generatePracticalApplication(
      targetCase,
      userIssue,
      analysis
    )

    // Identify strengths and limitations
    analysis.strengths = this.identifyStrengths(targetCase, analysis)
    analysis.limitations = this.identifyLimitations(targetCase, analysis)

    // Generate usage recommendation
    analysis.recommendedUse = this.generateRecommendedUse(targetCase, analysis)

    return analysis
  }

  calculateExactIssueMatch(targetCase, userIssue) {
    if (!userIssue.keyIssues) return 0

    const targetIssue = targetCase.keyIssue?.toLowerCase() || ''
    const userIssues = userIssue.keyIssues.map(issue => issue.toLowerCase())

    let maxMatch = 0
    userIssues.forEach(issue => {
      const commonWords = this.getCommonWords(targetIssue, issue)
      const matchScore =
        commonWords.length / Math.max(targetIssue.split(' ').length, issue.split(' ').length)
      maxMatch = Math.max(maxMatch, matchScore)
    })

    return Math.min(maxMatch, 1.0)
  }

  calculateCategoryMatch(targetCase, userIssue) {
    if (!userIssue.category) return 0

    const targetCategory = targetCase.category?.toLowerCase()
    const userCategory = userIssue.category?.toLowerCase()

    if (targetCategory === userCategory) return 1.0
    if (targetCase.subcategory?.toLowerCase() === userIssue.subcategory?.toLowerCase()) return 0.8

    // Check for related categories
    const relatedCategories = {
      ptsd: ['mental health', 'depression', 'anxiety'],
      'mental health': ['ptsd', 'depression', 'anxiety'],
      musculoskeletal: ['back pain', 'knee', 'shoulder'],
      tbi: ['neurological', 'cognitive', 'headaches'],
    }

    const related = relatedCategories[userCategory] || []
    if (related.includes(targetCategory)) return 0.6

    return 0
  }

  calculateFactualSimilarity(targetCase, userIssue) {
    if (!userIssue.facts) return 0

    const targetFacts = targetCase.facts?.toLowerCase() || ''
    const userFacts = userIssue.facts?.toLowerCase() || ''

    if (!targetFacts || !userFacts) return 0

    const commonWords = this.getCommonWords(targetFacts, userFacts)
    const totalWords = new Set([...targetFacts.split(' '), ...userFacts.split(' ')]).size

    return Math.min(commonWords.length / totalWords, 1.0)
  }

  calculateLegalPrincipleMatch(targetCase, userIssue) {
    if (!userIssue.legalPrinciples || !targetCase.legalPrinciples) return 0

    const targetPrinciples = targetCase.legalPrinciples.map(p => p.toLowerCase())
    const userPrinciples = userIssue.legalPrinciples.map(p => p.toLowerCase())

    let matches = 0
    userPrinciples.forEach(principle => {
      if (targetPrinciples.some(tp => tp.includes(principle) || principle.includes(tp))) {
        matches++
      }
    })

    return Math.min(matches / Math.max(targetPrinciples.length, userPrinciples.length), 1.0)
  }

  calculatePrecedentialValue(targetCase) {
    const courtWeight = this.analysisFactors.precedentialWeights[targetCase.court] || 0.1
    const precedenceScore =
      {
        high: 1.0,
        medium: 0.7,
        low: 0.4,
      }[targetCase.precedentialValue] || 0.4

    let bonuses = 0
    if (targetCase.stillGoodLaw) bonuses += 0.2
    if (targetCase.winRate > 0.8) bonuses += 0.1

    return Math.min(courtWeight * precedenceScore + bonuses, 1.0)
  }

  calculateTemporalRelevance(targetCase) {
    const currentYear = new Date().getFullYear()
    const caseAge = currentYear - targetCase.year

    if (caseAge <= 5) return this.analysisFactors.temporalWeights.current
    if (caseAge <= 10) return this.analysisFactors.temporalWeights.recent
    if (caseAge <= 20) return this.analysisFactors.temporalWeights.dated
    return this.analysisFactors.temporalWeights.old
  }

  generatePracticalApplication(targetCase, userIssue, analysis) {
    const relevance = analysis.overallRelevance
    const precedence = analysis.precedentialValue

    if (relevance > 0.8 && precedence > 0.8) {
      return `Strong precedent directly applicable to your case. ${targetCase.practicalApplication}`
    } else if (relevance > 0.6 && precedence > 0.6) {
      return `Solid supporting precedent. Use to strengthen legal arguments. ${targetCase.practicalApplication}`
    } else if (relevance > 0.4) {
      return `Relevant case for general legal principles. Consider for background authority.`
    } else {
      return `Limited direct application. May be useful for broader legal context.`
    }
  }

  identifyStrengths(targetCase, analysis) {
    const strengths = []

    if (analysis.precedentialValue > 0.8) {
      strengths.push(`High precedential authority from ${targetCase.court}`)
    }

    if (analysis.overallRelevance > 0.7) {
      strengths.push('Direct factual and legal similarity to your case')
    }

    if (targetCase.stillGoodLaw) {
      strengths.push('Current good law - not overruled or distinguished')
    }

    if (targetCase.winRate > 0.8) {
      strengths.push(
        `High success rate (${Math.round(targetCase.winRate * 100)}%) in similar cases`
      )
    }

    if (analysis.temporalRelevance > 0.8) {
      strengths.push('Recent decision reflecting current legal standards')
    }

    if (targetCase.practitionerNotes) {
      strengths.push('Well-established in practice with clear application guidance')
    }

    return strengths
  }

  identifyLimitations(targetCase, analysis) {
    const limitations = []

    if (analysis.precedentialValue < 0.5) {
      limitations.push('Limited precedential authority')
    }

    if (analysis.overallRelevance < 0.5) {
      limitations.push('Limited factual similarity to your specific case')
    }

    if (!targetCase.stillGoodLaw) {
      limitations.push('May be outdated or superseded by newer law')
    }

    if (targetCase.winRate < 0.5) {
      limitations.push('Lower success rate in practice')
    }

    if (analysis.temporalRelevance < 0.5) {
      limitations.push('Older decision - may not reflect current standards')
    }

    if (targetCase.court === 'Board of Veterans Appeals') {
      limitations.push('Administrative decision - not binding precedent')
    }

    return limitations
  }

  generateRecommendedUse(targetCase, analysis) {
    const relevance = analysis.overallRelevance
    const precedence = analysis.precedentialValue

    if (relevance > 0.8 && precedence > 0.8) {
      return 'PRIMARY_AUTHORITY'
    } else if (relevance > 0.6 && precedence > 0.6) {
      return 'SUPPORTING_AUTHORITY'
    } else if (relevance > 0.4 || precedence > 0.6) {
      return 'BACKGROUND_AUTHORITY'
    } else {
      return 'REFERENCE_ONLY'
    }
  }

  /**
   * Performs comparative analysis between multiple cases
   * @param {Array} cases - Array of cases to compare
   * @param {Object} userIssue - User's legal issue
   * @returns {Object} Comparative analysis
   */
  performComparativeAnalysis(cases, userIssue) {
    const analyses = cases.map(caseItem => ({
      case: caseItem,
      analysis: this.analyzeCaseRelevance(caseItem, userIssue),
    }))

    // Sort by overall utility (relevance + precedential value)
    analyses.sort((a, b) => {
      const scoreA = a.analysis.overallRelevance * 0.6 + a.analysis.precedentialValue * 0.4
      const scoreB = b.analysis.overallRelevance * 0.6 + b.analysis.precedentialValue * 0.4
      return scoreB - scoreA
    })

    return {
      rankedCases: analyses,
      bestCase: analyses[0],
      recommendedCitation: this.generateCitationStrategy(analyses.slice(0, 5)),
      argumentStructure: this.generateArgumentStructure(analyses.slice(0, 3)),
    }
  }

  generateCitationStrategy(topCases) {
    const strategy = {
      primaryAuthority: [],
      supportingAuthority: [],
      backgroundAuthority: [],
    }

    topCases.forEach(({ case: caseItem, analysis }) => {
      const useType = analysis.recommendedUse

      switch (useType) {
        case 'PRIMARY_AUTHORITY':
          strategy.primaryAuthority.push({
            case: caseItem,
            reason: 'Direct precedent with high relevance and authority',
          })
          break
        case 'SUPPORTING_AUTHORITY':
          strategy.supportingAuthority.push({
            case: caseItem,
            reason: 'Supporting precedent reinforcing legal principles',
          })
          break
        case 'BACKGROUND_AUTHORITY':
          strategy.backgroundAuthority.push({
            case: caseItem,
            reason: 'Background authority for legal context',
          })
          break
      }
    })

    return strategy
  }

  generateArgumentStructure(topCases) {
    if (topCases.length === 0) return null

    const primaryCase = topCases[0]
    const supportingCases = topCases.slice(1)

    return {
      openingStatement: `Based on established precedent, particularly ${primaryCase.case.title}, the legal standard requires...`,
      primaryArgument: {
        case: primaryCase.case,
        application: primaryCase.analysis.practicalApplication,
        keyQuote: primaryCase.case.holding,
      },
      supportingArguments: supportingCases.map(({ case: caseItem, analysis }) => ({
        case: caseItem,
        application: analysis.practicalApplication,
        supportiveRole: 'Reinforces the principle that...',
      })),
      conclusion: this.generateArgumentConclusion(topCases),
    }
  }

  generateArgumentConclusion(cases) {
    const primaryAuthorities = cases.filter(
      c => c.analysis.recommendedUse === 'PRIMARY_AUTHORITY'
    ).length

    if (primaryAuthorities > 1) {
      return 'Multiple binding precedents establish a clear legal framework supporting this position.'
    } else if (primaryAuthorities === 1) {
      return 'Binding precedent clearly supports this legal position with additional authority providing reinforcement.'
    } else {
      return 'While direct precedent may be limited, the weight of authority supports this interpretation.'
    }
  }

  getCommonWords(text1, text2) {
    const words1 = new Set(
      text1
        .toLowerCase()
        .split(' ')
        .filter(w => w.length > 3)
    )
    const words2 = new Set(
      text2
        .toLowerCase()
        .split(' ')
        .filter(w => w.length > 3)
    )

    return Array.from(words1).filter(word => words2.has(word))
  }

  /**
   * Generates strategic litigation advice
   * @param {Array} cases - Relevant cases
   * @param {Object} userIssue - User's legal issue
   * @returns {Object} Strategic advice
   */
  generateStrategicAdvice(cases, userIssue) {
    const comparative = this.performComparativeAnalysis(cases, userIssue)

    const advice = {
      litigationStrategy: '',
      keyRisks: [],
      strengthAreas: [],
      recommendedApproach: '',
      alternativeTheories: [],
    }

    // Analyze win rates and success factors
    const averageWinRate = cases.reduce((sum, c) => sum + c.winRate, 0) / cases.length
    const highValueCases = cases.filter(c => c.precedentialValue === 'high')

    if (averageWinRate > 0.7 && highValueCases.length > 0) {
      advice.litigationStrategy =
        'AGGRESSIVE - Strong precedential support with high success probability'
      advice.recommendedApproach = 'Lead with strongest precedents and build comprehensive argument'
    } else if (averageWinRate > 0.5) {
      advice.litigationStrategy =
        'MODERATE - Reasonable precedential support requiring careful argument construction'
      advice.recommendedApproach = 'Focus on best cases and distinguish adverse precedent'
    } else {
      advice.litigationStrategy =
        'CONSERVATIVE - Limited precedential support, consider alternative approaches'
      advice.recommendedApproach = 'Emphasize unique facts and policy arguments'
    }

    // Identify key risks
    const lowWinRateCases = cases.filter(c => c.winRate < 0.5)
    if (lowWinRateCases.length > 0) {
      advice.keyRisks.push('Some similar cases have low success rates')
    }

    const oldCases = cases.filter(c => new Date().getFullYear() - c.year > 15)
    if (oldCases.length > cases.length * 0.6) {
      advice.keyRisks.push('Precedent may be dated - verify current applicability')
    }

    // Identify strength areas
    if (highValueCases.length > 0) {
      advice.strengthAreas.push('Strong precedential authority available')
    }

    if (averageWinRate > 0.8) {
      advice.strengthAreas.push('High historical success rate in similar cases')
    }

    return advice
  }
}

// Create singleton instance
export const caseAnalysisEngine = new CaseAnalysisEngine()
