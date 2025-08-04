/**
 * @fileoverview Claim Guidance - AI-powered step-by-step VA disability claim assistance
 * @author VeteranLawAI Platform
 * @version 2.0.0
 */

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  User, 
  Shield, 
  Stethoscope,
  Calendar,
  Upload,
  Download,
  Lightbulb,
  Star,
  Clock,
  Target,
  Zap
} from 'lucide-react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import Input from '../../ui/Input'
import Modal from '../../ui/Modal'

/**
 * Claim Guidance Wizard Component
 * Provides AI-powered step-by-step assistance for VA disability claims
 * 
 * Features:
 * - Interactive step-by-step wizard
 * - AI-powered recommendations
 * - Evidence gathering checklist
 * - Form auto-population
 * - Success probability analysis
 * - Timeline estimation
 * - Document templates
 * 
 * @component
 * @example
 * <ClaimGuidance />
 */
const ClaimGuidance = () => {
  // State management
  const [currentStep, setCurrentStep] = useState(0)
  const [claimData, setClaimData] = useState({
    veteran: {
      name: '',
      ssn: '',
      dateOfBirth: '',
      serviceInfo: {
        branch: '',
        startDate: '',
        endDate: '',
        dischargeType: ''
      }
    },
    conditions: [],
    evidence: [],
    timeline: null,
    successProbability: null,
    recommendations: []
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Wizard steps configuration
  const steps = [
    {
      id: 'intro',
      title: 'Welcome to Claim Guidance',
      subtitle: 'AI-powered assistance for your VA disability claim',
      icon: Target,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'veteran_info',
      title: 'Veteran Information',
      subtitle: 'Basic information and service history',
      icon: User,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'conditions',
      title: 'Medical Conditions',
      subtitle: 'Conditions you want to claim',
      icon: Stethoscope,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'evidence',
      title: 'Evidence Gathering',
      subtitle: 'Required documentation and evidence',
      icon: FileText,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'analysis',
      title: 'AI Analysis',
      subtitle: 'Success probability and recommendations',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'completion',
      title: 'Claim Ready',
      subtitle: 'Your claim package is complete',
      icon: CheckCircle,
      color: 'from-emerald-500 to-green-600'
    }
  ]

  // Mock medical conditions data
  const commonConditions = [
    { 
      name: 'PTSD', 
      category: 'Mental Health', 
      evidenceRequired: ['Psychological evaluation', 'Stressor documentation', 'Treatment records'],
      successRate: 89,
      averageRating: 70
    },
    { 
      name: 'Chronic Back Pain', 
      category: 'Musculoskeletal', 
      evidenceRequired: ['X-rays/MRI', 'Range of motion tests', 'Treatment history'],
      successRate: 78,
      averageRating: 40
    },
    { 
      name: 'Hearing Loss', 
      category: 'Sensory', 
      evidenceRequired: ['Audiogram', 'Service medical records', 'Noise exposure evidence'],
      successRate: 92,
      averageRating: 10
    },
    { 
      name: 'Sleep Apnea', 
      category: 'Respiratory', 
      evidenceRequired: ['Sleep study', 'Nexus letter', 'Treatment records'],
      successRate: 85,
      averageRating: 50
    }
  ]

  /**
   * Handles form field updates
   */
  const updateClaimData = useCallback((path, value) => {
    setClaimData(prev => {
      const updated = { ...prev }
      const keys = path.split('.')
      let current = updated
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return updated
    })
  }, [])

  /**
   * Adds a medical condition to the claim
   */
  const addCondition = useCallback((condition) => {
    setClaimData(prev => ({
      ...prev,
      conditions: [...prev.conditions, {
        ...condition,
        id: Date.now().toString(),
        serviceConnection: '',
        symptoms: [],
        severity: 'moderate'
      }]
    }))
  }, [])

  /**
   * Removes a condition from the claim
   */
  const removeCondition = useCallback((conditionId) => {
    setClaimData(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c.id !== conditionId)
    }))
  }, [])

  /**
   * Performs AI analysis of the claim
   */
  const performAIAnalysis = useCallback(async () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const analysis = {
      successProbability: 0.87,
      timeline: '4-6 months',
      recommendations: [
        {
          type: 'critical',
          title: 'Obtain Current Medical Records',
          description: 'Recent medical records within the last 6 months will strengthen your claim significantly.',
          impact: 'high'
        },
        {
          type: 'important',
          title: 'Nexus Letter Recommended',
          description: 'Consider obtaining a nexus letter from your treating physician linking your conditions to military service.',
          impact: 'medium'
        },
        {
          type: 'suggestion',
          title: 'Additional Buddy Statements',
          description: 'Buddy statements from fellow service members can provide valuable corroborating evidence.',
          impact: 'low'
        }
      ]
    }
    
    setClaimData(prev => ({
      ...prev,
      ...analysis
    }))
    
    setIsAnalyzing(false)
  }, [])

  /**
   * Navigates to next step
   */
  const nextStep = useCallback(async () => {
    if (currentStep === steps.length - 2) {
      // Trigger AI analysis before final step
      await performAIAnalysis()
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep, performAIAnalysis, steps.length])

  /**
   * Navigates to previous step
   */
  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  /**
   * Renders step content
   */
  const renderStepContent = () => {
    const step = steps[currentStep]

    switch (step.id) {
      case 'intro':
        return (
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Target className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              AI-Powered Claim Guidance
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Let our AI assistant guide you through creating a successful VA disability claim with step-by-step instructions and personalized recommendations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: Lightbulb, title: 'Smart Guidance', desc: 'AI-powered recommendations' },
                { icon: Star, title: '89% Success Rate', desc: 'Proven track record' },
                { icon: Clock, title: 'Save Time', desc: 'Streamlined process' }
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="bg-slate-800/50 rounded-xl p-4">
                    <Icon className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                    <h3 className="font-bold text-white text-sm">{feature.title}</h3>
                    <p className="text-slate-400 text-xs">{feature.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'veteran_info':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <User className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Veteran Information</h2>
              <p className="text-slate-300">Basic information to get started</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="John A. Veteran"
                value={claimData.veteran.name}
                onChange={(e) => updateClaimData('veteran.name', e.target.value)}
              />
              <Input
                label="Social Security Number"
                placeholder="XXX-XX-XXXX"
                value={claimData.veteran.ssn}
                onChange={(e) => updateClaimData('veteran.ssn', e.target.value)}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={claimData.veteran.dateOfBirth}
                onChange={(e) => updateClaimData('veteran.dateOfBirth', e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Military Branch
                </label>
                <select
                  value={claimData.veteran.serviceInfo.branch}
                  onChange={(e) => updateClaimData('veteran.serviceInfo.branch', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="">Select Branch</option>
                  <option value="army">Army</option>
                  <option value="navy">Navy</option>
                  <option value="air_force">Air Force</option>
                  <option value="marines">Marines</option>
                  <option value="coast_guard">Coast Guard</option>
                  <option value="space_force">Space Force</option>
                </select>
              </div>
              <Input
                label="Service Start Date"
                type="date"
                value={claimData.veteran.serviceInfo.startDate}
                onChange={(e) => updateClaimData('veteran.serviceInfo.startDate', e.target.value)}
              />
              <Input
                label="Service End Date"
                type="date"
                value={claimData.veteran.serviceInfo.endDate}
                onChange={(e) => updateClaimData('veteran.serviceInfo.endDate', e.target.value)}
              />
            </div>
          </div>
        )

      case 'conditions':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Stethoscope className="h-16 w-16 text-purple-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Medical Conditions</h2>
              <p className="text-slate-300">Select conditions you want to claim</p>
            </div>

            {claimData.conditions.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-4">Selected Conditions</h3>
                <div className="space-y-3">
                  {claimData.conditions.map((condition) => (
                    <Card key={condition.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">{condition.name}</h4>
                          <p className="text-slate-400 text-sm">{condition.category}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-green-400 text-sm">
                            {condition.successRate}% success rate
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeCondition(condition.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold text-white mb-4">Common Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commonConditions.map((condition, index) => (
                  <Card
                    key={index}
                    className="p-4 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
                    onClick={() => addCondition(condition)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">{condition.name}</h4>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                        {condition.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-400">{condition.successRate}% success</span>
                      <span className="text-slate-400">Avg: {condition.averageRating}% rating</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case 'evidence':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <FileText className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Evidence Gathering</h2>
              <p className="text-slate-300">Required documentation for your conditions</p>
            </div>

            {claimData.conditions.map((condition) => (
              <Card key={condition.id} className="p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">{condition.name}</h3>
                <div className="space-y-3">
                  {condition.evidenceRequired.map((evidence, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-white font-medium">{evidence}</span>
                      <div className="flex-1"></div>
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            ))}

            <Card className="p-6 bg-blue-500/10 border-blue-500/20">
              <div className="flex items-start space-x-3">
                <Lightbulb className="h-6 w-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-blue-400 mb-2">Pro Tip</h3>
                  <p className="text-slate-300">
                    The more evidence you provide, the stronger your claim becomes. Consider getting nexus letters 
                    from medical professionals to establish the connection between your condition and military service.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )

      case 'analysis':
        return (
          <div className="max-w-3xl mx-auto text-center">
            {isAnalyzing ? (
              <div>
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <Zap className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Analyzing Your Claim</h2>
                <p className="text-xl text-slate-300 mb-8">
                  Our AI is evaluating your claim strength and generating personalized recommendations...
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                </div>
              </div>
            ) : (
              <div>
                <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-8" />
                <h2 className="text-3xl font-bold text-white mb-4">Analysis Complete</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card className="p-6">
                    <h3 className="text-2xl font-bold text-green-400 mb-2">
                      {Math.round(claimData.successProbability * 100)}%
                    </h3>
                    <p className="text-white font-medium">Success Probability</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-2xl font-bold text-blue-400 mb-2">
                      {claimData.timeline}
                    </h3>
                    <p className="text-white font-medium">Expected Timeline</p>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4">AI Recommendations</h3>
                  {claimData.recommendations.map((rec, index) => (
                    <Card key={index} className="p-4 text-left">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          rec.type === 'critical' ? 'bg-red-500/20' :
                          rec.type === 'important' ? 'bg-yellow-500/20' :
                          'bg-blue-500/20'
                        }`}>
                          <AlertTriangle className={`h-4 w-4 ${
                            rec.type === 'critical' ? 'text-red-400' :
                            rec.type === 'important' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{rec.title}</h4>
                          <p className="text-slate-300 text-sm">{rec.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'completion':
        return (
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Claim Package Ready!</h2>
            <p className="text-xl text-slate-300 mb-8">
              Your VA disability claim has been prepared with AI-powered optimization for maximum success probability.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="p-4">
                <FileText className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                <h3 className="font-bold text-white text-sm">Forms Ready</h3>
                <p className="text-slate-400 text-xs">Auto-populated VA forms</p>
              </Card>
              <Card className="p-4">
                <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-bold text-white text-sm">Evidence Organized</h3>
                <p className="text-slate-400 text-xs">Properly categorized docs</p>
              </Card>
              <Card className="p-4">
                <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="font-bold text-white text-sm">AI Optimized</h3>
                <p className="text-slate-400 text-xs">Maximum success chance</p>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Download className="h-5 w-5 mr-2" />
                Download Claim Package
              </Button>
              <Button size="lg" variant="outline" onClick={() => setShowSuccessModal(true)}>
                <FileText className="h-5 w-5 mr-2" />
                View Summary
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Progress Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">Step-by-Step Claim Guidance</h1>
            <div className="text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep
              
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center space-y-2 ${
                    isActive ? 'text-cyan-400' :
                    isCompleted ? 'text-green-400' :
                    'text-slate-600'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-cyan-500/20 border-2 border-cyan-500' :
                    isCompleted ? 'bg-green-500/20 border-2 border-green-500' :
                    'bg-slate-800'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium text-center hidden md:block max-w-20">
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
        
        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Card className="p-8 min-h-[500px]">
            {renderStepContent()}
          </Card>
        </motion.div>
        
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between"
        >
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={currentStep === 0}
            className={currentStep === 0 ? 'invisible' : ''}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-slate-400 text-sm">
            {currentStep === steps.length - 1 ? 'Claim Complete' : 'Continue to proceed'}
          </div>
          
          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep} disabled={isAnalyzing}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => setShowSuccessModal(true)} variant="success">
              View Complete Claim
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          )}
        </motion.div>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          size="lg"
        >
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Claim Successfully Prepared!
            </h2>
            <p className="text-slate-300 mb-6">
              Your VA disability claim has been optimized with AI assistance and is ready for submission.
            </p>
            <div className="bg-slate-800/50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-bold text-white mb-4">Claim Summary:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Conditions:</span>
                  <span className="text-white">{claimData.conditions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Success Probability:</span>
                  <span className="text-green-400">{Math.round(claimData.successProbability * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Timeline:</span>
                  <span className="text-blue-400">{claimData.timeline}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 justify-center">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download Package
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Print Summary
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default ClaimGuidance