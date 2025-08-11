import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Scale, CheckCircle, ArrowRight, Star, Shield, Zap } from 'lucide-react'
import { Modal, Button, IconTile } from '../../shared/ui'

const WelcomeModal = ({ isOpen, onClose, userName = 'User' }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: 'Welcome to VeteranLawAI',
      subtitle: `Hello ${userName}! Ready to revolutionize your VA legal practice?`,
      content: (
        <div className="text-center">
          <IconTile 
            icon={Scale} 
            gradient="from-cyan-500 to-blue-600" 
            size="xl" 
            className="mx-auto mb-6"
          />
          <p className="text-slate-300 text-lg mb-6">
            You now have access to the most advanced AI-powered legal platform designed specifically for VA disability claims attorneys.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-700/30 rounded-xl p-4">
              <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm">Bank-Level Security</h3>
              <p className="text-slate-400 text-xs">256-bit encryption</p>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-4">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm">AI-Powered</h3>
              <p className="text-slate-400 text-xs">Latest GPT technology</p>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-4">
              <Star className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm">Expert Built</h3>
              <p className="text-slate-400 text-xs">By VA legal specialists</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Powerful AI Tools',
      subtitle: 'Discover the tools that will transform your practice',
      content: (
        <div className="space-y-4">
          {[
            { icon: '📷', title: 'Camera OCR', desc: 'Digitize VA forms and medical records instantly with 99% accuracy' },
            { icon: '📚', title: 'Legal Knowledge Base', desc: '14,500+ VA regulations, procedures, and case precedents at your fingertips' },
            { icon: '📝', title: 'Claim Guidance', desc: 'AI-powered step-by-step assistance for complex disability claims' },
            { icon: '🎙️', title: 'Audio Transcription', desc: 'Professional transcription optimized for legal terminology' },
            { icon: '🔍', title: 'Case Research', desc: 'Find relevant precedents in seconds with AI-powered search' },
            { icon: '📊', title: 'Analytics Dashboard', desc: 'Track success rates and performance metrics in real-time' }
          ].map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 bg-slate-700/20 rounded-xl"
            >
              <div className="text-2xl">{tool.icon}</div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{tool.title}</h3>
                <p className="text-slate-400 text-sm">{tool.desc}</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </motion.div>
          ))}
        </div>
      )
    },
    {
      title: 'Getting Started',
      subtitle: 'Your quick-start guide to success',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">📋 Quick Start Checklist</h3>
              {[
                'Upload your first VA form using Camera OCR',
                'Search the Legal Knowledge Base',
                'Try the Claim Guidance wizard',
                'Explore the Analytics dashboard'
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center">
                    <span className="text-cyan-400 text-sm font-medium">{index + 1}</span>
                  </div>
                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Use keyboard shortcuts for faster navigation</li>
                <li>• Set up your firm profile for personalized results</li>
                <li>• Enable notifications for case updates</li>
                <li>• Bookmark frequently used forms and precedents</li>
              </ul>
            </div>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4 text-center">
            <p className="text-slate-300 mb-2">
              <strong>Need help?</strong> Our support team is available 24/7
            </p>
            <p className="text-cyan-400 text-sm">support@veteranlawai.com | 1-800-VET-LAWS</p>
          </div>
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    // Mark welcome as completed
    localStorage.setItem('veteranlawai_welcome_completed', 'true')
    onClose()
  }

  const handleSkip = () => {
    localStorage.setItem('veteranlawai_welcome_completed', 'true')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleSkip}
      size="lg"
      closeOnOverlayClick={false}
      className="max-w-4xl"
    >
      <div className="min-h-[500px] flex flex-col">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Step {currentStep + 1} of {steps.length}</span>
            <button
              onClick={handleSkip}
              className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
              Skip tour
            </button>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-2">{steps[currentStep].title}</h2>
            <p className="text-xl text-slate-300 mb-8">{steps[currentStep].subtitle}</p>
            {steps[currentStep].content}
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-700/50">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={currentStep === 0 ? 'invisible' : ''}
          >
            ← Previous
          </Button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-cyan-500' 
                    : index < currentStep 
                      ? 'bg-green-400' 
                      : 'bg-slate-600'
                }`}
              />
            ))}
          </div>

          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} icon={ArrowRight} iconPosition="right">
              Next
            </Button>
          ) : (
            <Button onClick={handleFinish} variant="success">
              Get Started! 🚀
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default WelcomeModal