import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle, AlertCircle, Clock, ArrowRight, Download, ExternalLink, Calendar, User, MapPin, Stethoscope, Scale, Gavel, Target, TrendingUp } from 'lucide-react'

// Simple Progress component
const Progress = ({ value, className = "" }) => (
  <div className={`w-full bg-slate-700 rounded-full h-2 ${className}`}>
    <div 
      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${value}%` }}
    ></div>
  </div>
)

const ClaimGuidanceSystem = () => {
  const [uploadedDocument, setUploadedDocument] = useState(null)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleDocumentUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploadedDocument(file)
    setIsAnalyzing(true)

    // Simulate document analysis
    await new Promise(resolve => setTimeout(resolve, 3000))

    const mockAnalysis = {
      documentType: 'VA Form 21-526EZ',
      claimType: 'Disability Compensation',
      conditions: [
        {
          condition: 'PTSD',
          serviceConnection: 'Direct',
          evidence: 'Strong',
          priority: 'High',
          estimatedRating: '70%',
          confidence: 92
        },
        {
          condition: 'Tinnitus',
          serviceConnection: 'Secondary',
          evidence: 'Moderate',
          priority: 'Medium',
          estimatedRating: '10%',
          confidence: 85
        },
        {
          condition: 'Lower Back Strain',
          serviceConnection: 'Direct',
          evidence: 'Weak',
          priority: 'Low',
          estimatedRating: '20%',
          confidence: 68
        }
      ],
      missingDocuments: [
        'Current medical records for PTSD treatment',
        'Buddy statements from service members',
        'Service medical records from deployment'
      ],
      recommendedActions: [
        'Schedule C&P examination for PTSD',
        'Obtain nexus letter from treating psychiatrist',
        'File Intent to File to preserve effective date',
        'Gather service personnel records'
      ],
      timeline: {
        estimated: '6-8 months',
        criticalDeadlines: [
          { task: 'Submit Intent to File', deadline: '2024-02-15', status: 'pending' },
          { task: 'Complete C&P Exam', deadline: '2024-03-01', status: 'pending' },
          { task: 'Submit Final Evidence', deadline: '2024-04-15', status: 'pending' }
        ]
      }
    }

    setAnalysisResults(mockAnalysis)
    setIsAnalyzing(false)
  }

  const guidanceSteps = [
    {
      title: 'Document Analysis',
      description: 'Upload and analyze VA paperwork',
      icon: Upload,
      status: uploadedDocument ? 'completed' : 'current',
      details: 'Upload your VA correspondence, medical records, or claim forms for AI-powered analysis.'
    },
    {
      title: 'Claim Strategy',
      description: 'Develop optimal claim approach',
      icon: Target,
      status: analysisResults ? 'completed' : uploadedDocument ? 'current' : 'pending',
      details: 'AI analyzes your case and recommends the best strategy for maximum success.'
    },
    {
      title: 'Evidence Gathering',
      description: 'Collect required documentation',
      icon: FileText,
      status: analysisResults && currentStep >= 2 ? 'completed' : analysisResults ? 'current' : 'pending',
      details: 'Get specific guidance on what evidence to gather and how to obtain it.'
    },
    {
      title: 'Form Preparation',
      description: 'Complete necessary VA forms',
      icon: CheckCircle,
      status: currentStep >= 3 ? 'completed' : currentStep === 2 ? 'current' : 'pending',
      details: 'Step-by-step assistance with filling out VA forms correctly.'
    },
    {
      title: 'Submission & Tracking',
      description: 'Submit claim and monitor progress',
      icon: TrendingUp,
      status: currentStep >= 4 ? 'completed' : currentStep === 3 ? 'current' : 'pending',
      details: 'Submit your claim and track its progress through the VA system.'
    }
  ]

  const renderAnalysisResults = () => {
    if (!analysisResults) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Claim Overview */}
        <div className="legal-document p-6 rounded-xl">
          <h4 className="text-xl font-expert text-gradient mb-4">Claim Analysis Results</h4>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-heading text-cyan-400 mb-1">{analysisResults.documentType}</div>
              <div className="text-sm text-slate-400">Document Type</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading text-cyan-400 mb-1">{analysisResults.claimType}</div>
              <div className="text-sm text-slate-400">Claim Type</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading text-cyan-400 mb-1">{analysisResults.timeline.estimated}</div>
              <div className="text-sm text-slate-400">Est. Timeline</div>
            </div>
          </div>
        </div>

        {/* Conditions Analysis */}
        <div className="legal-document p-6 rounded-xl">
          <h5 className="text-lg font-expert text-white mb-4">Claimed Conditions</h5>
          <div className="space-y-4">
            {analysisResults.conditions.map((condition, index) => (
              <motion.div
                key={index}
                className="glass-legal p-4 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      condition.priority === 'High' ? 'bg-red-500' :
                      condition.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <h6 className="font-expert text-white">{condition.condition}</h6>
                    <span className="badge-legal px-2 py-1 rounded text-xs">{condition.serviceConnection}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-heading text-cyan-400">{condition.estimatedRating}</div>
                    <div className="text-xs text-slate-400">{condition.confidence}% confidence</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Evidence:</span>
                    <span className={`ml-2 ${
                      condition.evidence === 'Strong' ? 'text-green-400' :
                      condition.evidence === 'Moderate' ? 'text-yellow-400' : 'text-red-400'
                    }`}>{condition.evidence}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Priority:</span>
                    <span className="ml-2 text-white">{condition.priority}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Service Connection:</span>
                    <span className="ml-2 text-white">{condition.serviceConnection}</span>
                  </div>
                </div>
                
                <Progress value={condition.confidence} className="mt-3" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Missing Documents */}
        <div className="legal-document p-6 rounded-xl">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <h5 className="text-lg font-expert text-white">Missing Evidence</h5>
          </div>
          <div className="space-y-3">
            {analysisResults.missingDocuments.map((doc, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 p-3 glass-legal rounded-lg"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-slate-300 font-legal">{doc}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="legal-document p-6 rounded-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-cyan-400" />
            <h5 className="text-lg font-expert text-white">Recommended Next Steps</h5>
          </div>
          <div className="space-y-3">
            {analysisResults.recommendedActions.map((action, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 p-3 glass-legal rounded-lg hover-expert cursor-pointer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-expert text-cyan-400">{index + 1}</span>
                </div>
                <span className="text-slate-300 font-legal">{action}</span>
                <ArrowRight className="h-4 w-4 text-cyan-400 ml-auto" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline & Deadlines */}
        <div className="legal-document p-6 rounded-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-5 w-5 text-cyan-400" />
            <h5 className="text-lg font-expert text-white">Critical Deadlines</h5>
          </div>
          <div className="space-y-3">
            {analysisResults.timeline.criticalDeadlines.map((deadline, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 glass-legal rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-slate-300 font-legal">{deadline.task}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-expert">{deadline.deadline}</div>
                  <div className="text-xs text-yellow-400">Pending</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Form Downloads */}
        <div className="legal-document p-6 rounded-xl">
          <h5 className="text-lg font-expert text-white mb-4">Required Forms</h5>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { form: 'VA Form 21-526EZ', title: 'Application for Disability Compensation', url: '#' },
              { form: 'VA Form 21-4138', title: 'Statement in Support of Claim', url: '#' },
              { form: 'VA Form 21-0781', title: 'Statement in Support of Claim for PTSD', url: '#' },
              { form: 'VA Form 21-8940', title: 'Veterans Application for Increased Compensation', url: '#' }
            ].map((form, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 glass-legal rounded-lg hover-expert cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <div className="font-expert text-cyan-400">{form.form}</div>
                  <div className="text-sm text-slate-300">{form.title}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-cyan-400 hover:text-cyan-300">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="text-cyan-400 hover:text-cyan-300">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="glass-expert p-8 rounded-xl">
      <div className="flex items-center space-x-3 mb-6">
        <Target className="h-8 w-8 text-cyan-400" />
        <h3 className="text-2xl font-expert text-gradient">Step-by-Step Claim Guidance</h3>
      </div>
      
      <p className="text-slate-300 font-legal mb-8">
        Upload your VA paperwork for intelligent analysis and receive personalized step-by-step guidance for your claim.
      </p>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          {guidanceSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                step.status === 'completed' ? 'bg-green-500' :
                step.status === 'current' ? 'bg-cyan-500' : 'bg-slate-600'
              }`}>
                <step.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm font-expert text-white">{step.title}</div>
                <div className="text-xs text-slate-400">{step.description}</div>
              </div>
              {index < guidanceSteps.length - 1 && (
                <div className={`h-1 w-full mt-4 ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-slate-600'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Document Upload */}
      {!uploadedDocument && (
        <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-12 text-center hover:border-cyan-500/50 transition-colors mb-8">
          <Upload className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
          <h4 className="text-xl font-expert text-white mb-2">Upload VA Document</h4>
          <p className="text-slate-400 mb-4">
            Upload VA correspondence, medical records, or claim forms for AI analysis
          </p>
          <input
            type="file"
            onChange={handleDocumentUpload}
            className="hidden"
            id="document-upload"
            accept=".pdf,.jpg,.png,.doc,.docx"
          />
          <label
            htmlFor="document-upload"
            className="gradient-trust px-6 py-3 rounded-lg font-expert hover-expert cursor-pointer inline-block"
          >
            Select Document
          </label>
          <p className="text-xs text-slate-400 mt-2">
            Supports PDF, JPG, PNG, DOC, DOCX files up to 10MB
          </p>
        </div>
      )}

      {/* Analysis Loading */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h4 className="text-lg font-expert text-white mb-2">Analyzing Document...</h4>
          <p className="text-slate-400">AI is reviewing your document and generating personalized guidance</p>
        </motion.div>
      )}

      {/* Analysis Results */}
      {renderAnalysisResults()}

      {/* Expert Tips */}
      <div className="mt-8 p-6 glass-legal rounded-xl">
        <h4 className="text-lg font-expert text-gradient mb-4">Expert Tips</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h5 className="font-expert text-white mb-1">File Intent to File Early</h5>
              <p className="text-sm text-slate-300">Preserve your effective date by filing an Intent to File before gathering all evidence.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h5 className="font-expert text-white mb-1">Get Nexus Letters</h5>
              <p className="text-sm text-slate-300">Medical opinions linking your condition to service are crucial for service connection.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h5 className="font-expert text-white mb-1">Document Everything</h5>
              <p className="text-sm text-slate-300">Keep detailed records of all symptoms, treatments, and how conditions affect daily life.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h5 className="font-expert text-white mb-1">Use Buddy Statements</h5>
              <p className="text-sm text-slate-300">Statements from fellow service members can provide crucial evidence for your claim.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClaimGuidanceSystem

