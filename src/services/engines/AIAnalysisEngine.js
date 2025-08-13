/**
 * @fileoverview AI Analysis Engine for VA Claims
 * @author VeteranLawAI Platform
 * @version 1.0.0
 *
 * Provides intelligent analysis of VA disability claims including:
 * - Success probability calculations
 * - Evidence gap analysis
 * - Strategic recommendations
 * - Secondary condition identification
 */

export class AIAnalysisEngine {
  constructor() {
    this.analysisModels = this.initializeAnalysisModels()
    this.secondaryConnections = this.initializeSecondaryConnections()
    this.evidenceStrength = this.initializeEvidenceStrength()
  }

  initializeAnalysisModels() {
    return {
      successFactors: {
        evidenceCompleteness: 0.35,
        medicalNexus: 0.25,
        continuityOfSymptoms: 0.15,
        severityDocumentation: 0.15,
        serviceDocumentation: 0.1,
      },
      riskFactors: {
        gapInTreatment: -0.15,
        inconsistentSymptoms: -0.2,
        lackOfNexus: -0.3,
        preExistingCondition: -0.1,
        insufficientSeverity: -0.15,
      },
    }
  }

  initializeSecondaryConnections() {
    return {
      ptsd: [
        {
          condition: 'sleep_apnea',
          probability: 0.65,
          reason: 'Weight gain from medications and sleep disturbances',
        },
        { condition: 'major_depression', probability: 0.58, reason: 'Common comorbidity' },
        {
          condition: 'hypertension',
          probability: 0.42,
          reason: 'Stress and medication side effects',
        },
        { condition: 'gerd', probability: 0.38, reason: 'Medication side effects and stress' },
        { condition: 'migraines', probability: 0.45, reason: 'Stress and tension' },
        {
          condition: 'ibs',
          probability: 0.35,
          reason: 'Stress and anxiety effects on digestive system',
        },
      ],
      tbi: [
        { condition: 'migraines', probability: 0.72, reason: 'Post-concussive syndrome' },
        { condition: 'ptsd', probability: 0.48, reason: 'Traumatic event causing TBI' },
        { condition: 'major_depression', probability: 0.55, reason: 'Neurological changes' },
        { condition: 'sleep_apnea', probability: 0.35, reason: 'Central nervous system effects' },
      ],
      back_pain: [
        {
          condition: 'peripheral_neuropathy',
          probability: 0.42,
          reason: 'Nerve compression from spine issues',
        },
        { condition: 'major_depression', probability: 0.38, reason: 'Chronic pain effects' },
        {
          condition: 'sleep_apnea',
          probability: 0.28,
          reason: 'Pain medications and sleep position limitations',
        },
      ],
      major_depression: [
        {
          condition: 'sleep_apnea',
          probability: 0.45,
          reason: 'Sleep disturbances and weight gain',
        },
        { condition: 'gerd', probability: 0.32, reason: 'Medication side effects' },
        { condition: 'hypertension', probability: 0.35, reason: 'Stress and medication effects' },
      ],
      sleep_apnea: [
        {
          condition: 'hypertension',
          probability: 0.55,
          reason: 'Cardiovascular effects of sleep apnea',
        },
        {
          condition: 'heart_disease',
          probability: 0.35,
          reason: 'Long-term cardiovascular strain',
        },
        {
          condition: 'major_depression',
          probability: 0.42,
          reason: 'Chronic fatigue and sleep deprivation',
        },
      ],
    }
  }

  initializeEvidenceStrength() {
    return {
      medical_opinion: {
        specialist: 1.0,
        primary_care: 0.8,
        va_examiner: 0.9,
        private_physician: 0.85,
      },
      diagnostic_tests: {
        mri_ct_scan: 0.95,
        xray: 0.7,
        blood_tests: 0.6,
        psychological_testing: 0.9,
        sleep_study: 1.0,
        audiometric: 1.0,
        emg_nerve: 0.9,
      },
      documentation: {
        service_treatment_records: 0.9,
        combat_records: 1.0,
        performance_evaluations: 0.6,
        buddy_statements: 0.5,
        spouse_statement: 0.6,
        employer_statement: 0.7,
      },
      treatment_history: {
        continuous_treatment: 1.0,
        intermittent_treatment: 0.7,
        recent_treatment_only: 0.5,
        no_treatment: 0.2,
      },
    }
  }

  /**
   * Performs comprehensive analysis of a VA claim
   * @param {Object} claimData - Complete claim information
   * @returns {Object} Analysis results with recommendations
   */
  analyzeCliam(claimData) {
    const analysis = {
      overallSuccessProbability: 0,
      conditionAnalysis: [],
      evidenceGaps: [],
      recommendations: [],
      secondaryConditions: [],
      strategicAdvice: [],
      estimatedTimeline: null,
      potentialRating: null,
    }

    // Analyze each condition
    claimData.conditions.forEach(condition => {
      const conditionAnalysis = this.analyzeCondition(condition, claimData)
      analysis.conditionAnalysis.push(conditionAnalysis)
    })

    // Calculate overall success probability
    analysis.overallSuccessProbability = this.calculateOverallSuccess(analysis.conditionAnalysis)

    // Identify evidence gaps
    analysis.evidenceGaps = this.identifyEvidenceGaps(claimData)

    // Generate recommendations
    analysis.recommendations = this.generateRecommendations(claimData, analysis)

    // Identify secondary conditions
    analysis.secondaryConditions = this.identifySecondaryConditions(claimData.conditions)

    // Provide strategic advice
    analysis.strategicAdvice = this.generateStrategicAdvice(claimData, analysis)

    // Estimate timeline
    analysis.estimatedTimeline = this.estimateTimeline(claimData)

    // Calculate potential rating
    analysis.potentialRating = this.calculatePotentialRating(claimData.conditions)

    return analysis
  }

  /**
   * Analyzes individual condition
   */
  analyzeCondition(condition, claimData) {
    const factors = this.analysisModels.successFactors
    const risks = this.analysisModels.riskFactors

    let probability = condition.baseSuccessRate || 0.5

    // Apply positive factors
    if (condition.hasNexusLetter) {
      probability += factors.medicalNexus
    }

    if (condition.evidenceComplete) {
      probability += factors.evidenceCompleteness
    }

    if (condition.continuousSymptoms) {
      probability += factors.continuityOfSymptoms
    }

    // Apply risk factors
    if (condition.treatmentGap > 12) {
      probability += risks.gapInTreatment
    }

    if (!condition.hasNexusLetter) {
      probability += risks.lackOfNexus
    }

    // Ensure probability stays within bounds
    probability = Math.max(0.1, Math.min(0.95, probability))

    return {
      conditionId: condition.id,
      conditionName: condition.name,
      successProbability: Math.round(probability * 100),
      strengths: this.identifyStrengths(condition),
      weaknesses: this.identifyWeaknesses(condition),
      criticalActions: this.identifyCriticalActions(condition),
    }
  }

  /**
   * Calculates overall success probability
   */
  calculateOverallSuccess(conditionAnalyses) {
    if (conditionAnalyses.length === 0) return 0

    // Weight by condition severity/importance
    const totalProbability = conditionAnalyses.reduce((sum, analysis) => {
      return sum + analysis.successProbability
    }, 0)

    return Math.round(totalProbability / conditionAnalyses.length)
  }

  /**
   * Identifies missing evidence
   */
  identifyEvidenceGaps(claimData) {
    const gaps = []

    claimData.conditions.forEach(condition => {
      // Check for nexus letter
      if (!condition.hasNexusLetter) {
        gaps.push({
          condition: condition.name,
          type: 'Medical Nexus Opinion',
          severity: 'critical',
          description: 'Missing medical opinion connecting condition to service',
          action:
            'Obtain nexus letter from treating physician using "at least as likely as not" language',
        })
      }

      // Check for diagnosis
      if (!condition.currentDiagnosis) {
        gaps.push({
          condition: condition.name,
          type: 'Current Diagnosis',
          severity: 'critical',
          description: 'No current diagnosis on file',
          action: 'Schedule appointment for formal diagnosis with ICD-10 code',
        })
      }

      // Check for service documentation
      if (!condition.serviceDocumentation) {
        gaps.push({
          condition: condition.name,
          type: 'Service Documentation',
          severity: 'high',
          description: 'Limited documentation from service',
          action: 'Request complete service treatment records and unit records',
        })
      }

      // Check for continuity
      if (condition.treatmentGap > 12) {
        gaps.push({
          condition: condition.name,
          type: 'Treatment Continuity',
          severity: 'moderate',
          description: `${condition.treatmentGap} month gap in treatment`,
          action: 'Obtain statement explaining gap and document ongoing symptoms',
        })
      }
    })

    return gaps
  }

  /**
   * Generates strategic recommendations
   */
  generateRecommendations(claimData, analysis) {
    const recommendations = []

    // Evidence-based recommendations
    if (analysis.evidenceGaps.some(gap => gap.severity === 'critical')) {
      recommendations.push({
        priority: 'high',
        category: 'Evidence',
        recommendation: 'Address critical evidence gaps before filing',
        details: 'Missing critical evidence significantly reduces success probability',
        timeframe: '1-2 months',
      })
    }

    // Secondary conditions
    if (analysis.secondaryConditions.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'Strategy',
        recommendation: 'Consider claiming identified secondary conditions',
        details: `${analysis.secondaryConditions.length} secondary conditions identified with high connection probability`,
        timeframe: '2-3 months',
      })
    }

    // Filing strategy
    if (analysis.overallSuccessProbability < 60) {
      recommendations.push({
        priority: 'high',
        category: 'Strategy',
        recommendation: 'Strengthen claim before filing',
        details: 'Current success probability is below optimal threshold',
        timeframe: '2-4 months',
      })
    }

    // Rating optimization
    const potentialRating = analysis.potentialRating
    if (potentialRating.combined >= 70) {
      recommendations.push({
        priority: 'medium',
        category: 'Benefits',
        recommendation: 'Consider TDIU eligibility',
        details: 'Combined rating may qualify for Total Disability Individual Unemployability',
        timeframe: 'Concurrent with claim',
      })
    }

    return recommendations
  }

  /**
   * Identifies potential secondary conditions
   */
  identifySecondaryConditions(primaryConditions) {
    const secondaryConditions = []
    const identified = new Set()

    primaryConditions.forEach(primary => {
      const connections = this.secondaryConnections[primary.id] || []

      connections.forEach(secondary => {
        if (!identified.has(secondary.condition)) {
          identified.add(secondary.condition)
          secondaryConditions.push({
            condition: secondary.condition,
            primaryConnection: primary.name,
            probability: secondary.probability,
            reason: secondary.reason,
            recommendation: `Screen for ${secondary.condition} as secondary to ${primary.name}`,
          })
        }
      })
    })

    // Sort by probability
    return secondaryConditions.sort((a, b) => b.probability - a.probability)
  }

  /**
   * Generates strategic advice
   */
  generateStrategicAdvice(claimData, analysis) {
    const advice = []

    // Filing order strategy
    const highSuccessConditions = analysis.conditionAnalysis
      .filter(c => c.successProbability >= 70)
      .sort((a, b) => b.successProbability - a.successProbability)

    if (highSuccessConditions.length > 0) {
      advice.push({
        type: 'filing_strategy',
        title: 'Prioritize High-Success Conditions',
        description: `File ${highSuccessConditions[0].conditionName} first with ${highSuccessConditions[0].successProbability}% success probability`,
        impact: 'Establishes service connection for secondary claims',
      })
    }

    // Evidence strategy
    if (analysis.evidenceGaps.length > 3) {
      advice.push({
        type: 'evidence_strategy',
        title: 'Systematic Evidence Collection',
        description:
          'Multiple evidence gaps identified. Create checklist and timeline for collection.',
        impact: 'Increases overall success probability by 20-30%',
      })
    }

    // Medical opinion strategy
    const needsNexus = claimData.conditions.filter(c => !c.hasNexusLetter)
    if (needsNexus.length > 2) {
      advice.push({
        type: 'medical_strategy',
        title: 'Comprehensive Medical Opinion',
        description: 'Obtain single comprehensive nexus letter covering all conditions',
        impact: 'More cost-effective and presents unified medical theory',
      })
    }

    // Timing strategy
    if (claimData.recentSeparation) {
      advice.push({
        type: 'timing_strategy',
        title: 'BDD Claim Opportunity',
        description: 'File Benefits Delivery at Discharge claim 90-180 days before separation',
        impact: 'Receive benefits immediately upon discharge',
      })
    }

    return advice
  }

  /**
   * Identifies strengths in the claim
   */
  identifyStrengths(condition) {
    const strengths = []

    if (condition.combatRelated) {
      strengths.push('Combat-related presumption applicable')
    }

    if (condition.continuousTreatment) {
      strengths.push('Continuous treatment history')
    }

    if (condition.serviceRecords) {
      strengths.push('Strong service documentation')
    }

    if (condition.hasNexusLetter) {
      strengths.push('Medical nexus opinion available')
    }

    return strengths
  }

  /**
   * Identifies weaknesses in the claim
   */
  identifyWeaknesses(condition) {
    const weaknesses = []

    if (!condition.hasNexusLetter) {
      weaknesses.push('Missing medical nexus opinion')
    }

    if (condition.treatmentGap > 12) {
      weaknesses.push(`${condition.treatmentGap} month treatment gap`)
    }

    if (!condition.currentDiagnosis) {
      weaknesses.push('No current medical diagnosis')
    }

    if (!condition.serviceDocumentation) {
      weaknesses.push('Limited service documentation')
    }

    return weaknesses
  }

  /**
   * Identifies critical actions needed
   */
  identifyCriticalActions(condition) {
    const actions = []

    if (!condition.hasNexusLetter) {
      actions.push('Obtain medical nexus letter')
    }

    if (!condition.currentDiagnosis) {
      actions.push('Get current medical diagnosis')
    }

    if (condition.treatmentGap > 12) {
      actions.push('Document treatment gap explanation')
    }

    return actions
  }

  /**
   * Estimates processing timeline
   */
  estimateTimeline(claimData) {
    const baseProcessingTime = 120 // days
    let adjustments = 0

    // Complex conditions add time
    if (claimData.conditions.length > 3) {
      adjustments += 30
    }

    // Missing evidence adds time
    const criticalGaps = claimData.conditions.filter(c => !c.hasNexusLetter).length
    adjustments += criticalGaps * 20

    // Appeals add significant time
    if (claimData.hasAppeals) {
      adjustments += 90
    }

    const totalDays = baseProcessingTime + adjustments
    const months = Math.round(totalDays / 30)

    return {
      days: totalDays,
      months,
      description: `${months} months (${totalDays} days estimated)`,
    }
  }

  /**
   * Calculates potential disability rating
   */
  calculatePotentialRating(conditions) {
    if (!conditions || conditions.length === 0) {
      return { individual: [], combined: 0 }
    }

    const individualRatings = conditions.map(condition => ({
      condition: condition.name,
      rating: condition.averageRating || 0,
      confidence: condition.successRate || 0.5,
    }))

    // Calculate combined rating using VA formula
    const ratings = individualRatings.map(r => r.rating).sort((a, b) => b - a)
    let combined = ratings[0] || 0

    for (let i = 1; i < ratings.length; i++) {
      const remaining = 100 - combined
      combined = combined + (ratings[i] * remaining) / 100
    }

    // Round to nearest 10
    combined = Math.round(combined / 10) * 10

    return {
      individual: individualRatings,
      combined,
      description: `${combined}% combined rating`,
    }
  }
}

// Create singleton instance
export const aiAnalysisEngine = new AIAnalysisEngine()
