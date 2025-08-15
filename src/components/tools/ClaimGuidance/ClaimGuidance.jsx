/**
 * @fileoverview Claim Guidance Tool - VA Disability Claim Optimization
 * @author VeteranLawAI Platform
 * @version 3.0.0
 */

import React, { useState, useCallback, useEffect } from 'react'
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
  Upload,
  Download,
  Lightbulb,
  Star,
  Clock,
  Target,
  Zap,
  Brain,
  Crown,
  Search,
  BarChart3,
  X,
  Plus,
  Copy,
} from 'lucide-react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import { announceToScreenReader } from '../../../utils/accessibility'

/**
 * Claim Guidance Tool Component
 * VA Disability Claim Optimization with AI-Powered Success Prediction
 */
const ClaimGuidance = () => {
  // State management
  const [currentStep, setCurrentStep] = useState(0)
  const [claimData, setClaimData] = useState({
    veteran: {
      firstName: '',
      lastName: '',
      ssn: '',
      dateOfBirth: '',
      email: '',
      phoneNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
    military: {
      branch: '',
      serviceNumber: '',
      servicePeriods: [
        {
          startDate: '',
          endDate: '',
          location: '',
        },
      ],
    },
    conditions: [
      {
        name: '',
        description: '',
        serviceConnection: '',
        evidence: [],
        rating: '',
      },
    ],
    evidence: {
      medicalRecords: [],
      buddyStatements: [],
      nexusLetters: [],
      otherDocuments: [],
    },
  })
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Mock conditions database
  const mockConditions = [
    {
      id: '1',
      name: 'Post-Traumatic Stress Disorder (PTSD)',
      category: 'Mental Health',
      ratingRange: '0-100%',
      commonSymptoms: ['Nightmares', 'Hypervigilance', 'Avoidance', 'Flashbacks'],
      serviceConnection: 'Combat exposure, Military Sexual Trauma, Fear of hostile activity',
      evidenceRequired: ['Combat records', 'Buddy statements', 'Medical diagnosis', 'Nexus letter'],
    },
    {
      id: '2',
      name: 'Traumatic Brain Injury (TBI)',
      category: 'Neurological',
      ratingRange: '0-100%',
      commonSymptoms: ['Headaches', 'Memory problems', 'Balance issues', 'Concentration difficulties'],
      serviceConnection: 'Blast exposure, Vehicle accidents, Falls, Combat injuries',
      evidenceRequired: ['Medical records', 'Incident reports', 'Neurological exams', 'Cognitive testing'],
    },
    {
      id: '3',
      name: 'Degenerative Arthritis',
      category: 'Musculoskeletal',
      ratingRange: '10-100%',
      commonSymptoms: ['Joint pain', 'Stiffness', 'Limited range of motion', 'Swelling'],
      serviceConnection: 'Repetitive stress, Injuries, Heavy lifting, Physical training',
      evidenceRequired: ['X-rays', 'MRI reports', 'Physical therapy records', 'Pain diaries'],
    },
    {
      id: '4',
      name: 'Hearing Loss',
      category: 'Sensory',
      ratingRange: '0-100%',
      commonSymptoms: ['Difficulty hearing', 'Tinnitus', 'Balance problems'],
      serviceConnection: 'Weapons fire, Aircraft noise, Explosions, Loud machinery',
      evidenceRequired: ['Audiograms', 'Medical records', 'Service records', 'Buddy statements'],
    },
    {
      id: '5',
      name: 'Sleep Apnea',
      category: 'Respiratory',
      ratingRange: '0-100%',
      commonSymptoms: ['Loud snoring', 'Gasping for air', 'Daytime fatigue', 'Morning headaches'],
      serviceConnection: 'Weight gain, Stress, Respiratory conditions, Sleep disorders',
      evidenceRequired: ['Sleep study', 'CPAP prescription', 'Medical records', 'Spouse statements'],
    },
  ]

  // Wizard steps
  const steps = [
    {
      id: 0,
      title: 'Veteran Information',
      description: 'Basic personal and contact information',
      icon: User,
    },
    {
      id: 1,
      title: 'Military Service',
      description: 'Service history and deployment information',
      icon: Shield,
    },
    {
      id: 2,
      title: 'Medical Conditions',
      description: 'Conditions and symptoms you\'re claiming',
      icon: Stethoscope,
    },
    {
      id: 3,
      title: 'Evidence Review',
      description: 'Review and organize your evidence',
      icon: FileText,
    },
    {
      id: 4,
      title: 'Analysis & Strategy',
      description: 'AI-powered claim analysis and recommendations',
      icon: Brain,
    },
  ]

  // Initialize component
  useEffect(() => {
    announceToScreenReader('Claim Guidance tool loaded')
  }, [])

  // Update claim data
  const updateClaimData = useCallback((section, field, value) => {
    setClaimData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }, [])

  // Add condition
  const addCondition = useCallback(() => {
    setClaimData(prev => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        {
          name: '',
          description: '',
          serviceConnection: '',
          evidence: [],
          rating: '',
        },
      ],
    }))
  }, [])

  // Remove condition
  const removeCondition = useCallback((index) => {
    setClaimData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }))
  }, [])

  // Update condition
  const updateCondition = useCallback((index, field, value) => {
    setClaimData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) =>
        i === index ? { ...condition, [field]: value } : condition
      ),
    }))
  }, [])

  // Analyze claim
  const analyzeClaim = useCallback(async () => {
    setIsAnalyzing(true)
    announceToScreenReader('Analyzing claim data')

    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      const analysisResult = {
        successProbability: 0.75 + Math.random() * 0.2, // 75-95%
        estimatedRating: Math.floor(Math.random() * 80) + 20, // 20-100%
        timeline: '6-12 months',
        strengths: [
          'Strong medical evidence available',
          'Clear service connection established',
          'Comprehensive documentation provided',
        ],
        weaknesses: [
          'Missing nexus letter for secondary condition',
          'Incomplete medical records',
          'Need additional buddy statements',
        ],
        recommendations: [
          'Obtain nexus letter from treating physician',
          'Gather additional medical records',
          'Submit buddy statements for combat exposure',
          'Consider secondary conditions',
        ],
        forms: [
          'VA Form 21-526EZ (Application for Disability Compensation)',
          'VA Form 21-4142 (Authorization to Disclose Information)',
          'VA Form 21-0781 (Statement in Support of Claim for PTSD)',
        ],
        nextSteps: [
          'Complete all required forms',
          'Gather missing evidence',
          'Submit claim to VA Regional Office',
          'Schedule C&P examination',
        ],
      }

      setAnalysis(analysisResult)
      setCurrentStep(4)
      announceToScreenReader(`Analysis complete. Success probability: ${Math.round(analysisResult.successProbability * 100)}%`)
    } catch (error) {
      console.error('Analysis failed:', error)
      announceToScreenReader('Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  // Next step
  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      announceToScreenReader(`Moving to step ${currentStep + 2}: ${steps[currentStep + 1].title}`)
    }
  }, [currentStep, steps])

  // Previous step
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      announceToScreenReader(`Moving to step ${currentStep}: ${steps[currentStep - 1].title}`)
    }
  }, [currentStep, steps])

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      announceToScreenReader('Copied to clipboard')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Claim Guidance</h1>
                <p className="text-slate-400">VA Disability Claim Optimization</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-yellow-400 text-sm font-medium">AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </h2>
            <span className="text-slate-400 text-sm">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-500 to-orange-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex space-x-2 mb-8 overflow-x-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                  currentStep === index
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
                    : index < currentStep
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            )
          })}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="veteran-info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                  <User className="h-6 w-6 text-yellow-400" />
                  <span>Veteran Information</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={claimData.veteran.firstName}
                      onChange={(e) => updateClaimData('veteran', 'firstName', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={claimData.veteran.lastName}
                      onChange={(e) => updateClaimData('veteran', 'lastName', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={claimData.veteran.dateOfBirth}
                      onChange={(e) => updateClaimData('veteran', 'dateOfBirth', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={claimData.veteran.email}
                      onChange={(e) => updateClaimData('veteran', 'email', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={claimData.veteran.phoneNumber}
                      onChange={(e) => updateClaimData('veteran', 'phoneNumber', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={claimData.veteran.address.street}
                      onChange={(e) => updateClaimData('veteran', 'address', { ...claimData.veteran.address, street: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Enter street address"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="military-service"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-yellow-400" />
                  <span>Military Service</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Branch of Service *
                    </label>
                    <select
                      value={claimData.military.branch}
                      onChange={(e) => updateClaimData('military', 'branch', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="">Select branch</option>
                      <option value="Army">Army</option>
                      <option value="Navy">Navy</option>
                      <option value="Air Force">Air Force</option>
                      <option value="Marine Corps">Marine Corps</option>
                      <option value="Coast Guard">Coast Guard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Service Number
                    </label>
                    <input
                      type="text"
                      value={claimData.military.serviceNumber}
                      onChange={(e) => updateClaimData('military', 'serviceNumber', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Enter service number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Service Start Date *
                    </label>
                    <input
                      type="date"
                      value={claimData.military.servicePeriods[0].startDate}
                      onChange={(e) => updateClaimData('military', 'servicePeriods', [{ ...claimData.military.servicePeriods[0], startDate: e.target.value }])}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Service End Date *
                    </label>
                    <input
                      type="date"
                      value={claimData.military.servicePeriods[0].endDate}
                      onChange={(e) => updateClaimData('military', 'servicePeriods', [{ ...claimData.military.servicePeriods[0], endDate: e.target.value }])}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="medical-conditions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                    <Stethoscope className="h-6 w-6 text-yellow-400" />
                    <span>Medical Conditions</span>
                  </h3>
                  <Button onClick={addCondition} className="bg-gradient-to-r from-yellow-500 to-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Condition
                  </Button>
                </div>

                <div className="space-y-6">
                  {claimData.conditions.map((condition, index) => (
                    <div key={index} className="border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white">Condition {index + 1}</h4>
                        {claimData.conditions.length > 1 && (
                          <button
                            onClick={() => removeCondition(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Condition Name *
                          </label>
                          <select
                            value={condition.name}
                            onChange={(e) => updateCondition(index, 'name', e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          >
                            <option value="">Select condition</option>
                            {mockConditions.map(cond => (
                              <option key={cond.id} value={cond.name}>{cond.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Service Connection *
                          </label>
                          <input
                            type="text"
                            value={condition.serviceConnection}
                            onChange={(e) => updateCondition(index, 'serviceConnection', e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="How is this connected to service?"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Description of Symptoms
                          </label>
                          <textarea
                            value={condition.description}
                            onChange={(e) => updateCondition(index, 'description', e.target.value)}
                            rows={3}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Describe your symptoms and how they affect you..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="evidence-review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-yellow-400" />
                  <span>Evidence Review</span>
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Required Evidence</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: 'Medical Records', icon: FileText, status: 'pending' },
                        { title: 'Service Records', icon: Shield, status: 'pending' },
                        { title: 'Buddy Statements', icon: User, status: 'pending' },
                        { title: 'Nexus Letters', icon: Stethoscope, status: 'pending' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-lg">
                          <item.icon className="h-5 w-5 text-slate-400" />
                          <span className="text-slate-300">{item.title}</span>
                          <span className="ml-auto px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Evidence Checklist</h4>
                    <div className="space-y-3">
                      {[
                        'DD-214 (Certificate of Release or Discharge from Active Duty)',
                        'Medical records from service',
                        'Current medical records',
                        'Buddy statements (if applicable)',
                        'Nexus letters from doctors',
                        'Photographs or other supporting evidence',
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-yellow-500 bg-slate-700 border-slate-600 rounded focus:ring-yellow-500"
                          />
                          <span className="text-slate-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {!analysis ? (
                <Card className="p-8 text-center">
                  <Brain className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Ready for Analysis</h3>
                  <p className="text-slate-400 mb-6">
                    Click the button below to analyze your claim and get personalized recommendations.
                  </p>
                  <Button
                    onClick={analyzeClaim}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Claim'}
                  </Button>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Success Probability */}
                  <Card className="p-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">
                        {Math.round(analysis.successProbability * 100)}%
                      </div>
                      <div className="text-slate-400">Success Probability</div>
                    </div>
                  </Card>

                  {/* Analysis Results */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Strengths</h4>
                      <div className="space-y-2">
                        {analysis.strengths.map((strength, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Areas for Improvement</h4>
                      <div className="space-y-2">
                        {analysis.weaknesses.map((weakness, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">{weakness}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Recommendations */}
                  <Card className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Recommendations</h4>
                    <div className="space-y-3">
                      {analysis.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Lightbulb className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Next Steps */}
                  <Card className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Next Steps</h4>
                    <div className="space-y-3">
                      {analysis.nextSteps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="text-slate-300">{step}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            className="px-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              className="px-6 bg-gradient-to-r from-yellow-500 to-orange-600"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setShowPreview(true)}
              className="px-6 bg-gradient-to-r from-green-500 to-emerald-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Forms
            </Button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Claim Summary</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Veteran Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Name:</span>
                      <span className="text-white ml-2">{claimData.veteran.firstName} {claimData.veteran.lastName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Branch:</span>
                      <span className="text-white ml-2">{claimData.military.branch}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Conditions</h3>
                  <div className="space-y-2">
                    {claimData.conditions.map((condition, index) => (
                      <div key={index} className="p-3 bg-slate-700/50 rounded-lg">
                        <div className="font-medium text-white">{condition.name}</div>
                        <div className="text-slate-400 text-sm">{condition.serviceConnection}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-slate-700">
                  <Button
                    onClick={() => copyToClipboard(JSON.stringify(claimData, null, 2))}
                    variant="outline"
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Data
                  </Button>
                  <Button
                    onClick={() => setShowPreview(false)}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClaimGuidance
