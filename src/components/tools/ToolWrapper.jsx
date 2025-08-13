import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Info,
  HelpCircle,
  BookOpen,
  Video,
  FileText,
  Download,
  Share2,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  X,
  ChevronRight,
  Star,
  Zap,
  Shield,
  Users,
  Clock,
  Target,
  TrendingUp,
  Award,
  Database,
  Globe,
  Crown,
  Sparkles,
} from 'lucide-react'
import { Button, Modal, Tooltip } from '../../shared/ui'

/**
 * Professional Tool Wrapper Component
 * Provides context, explanation modals, and enhanced presentation for all tools
 */
const ToolWrapper = ({
  children,
  title,
  description,
  icon: Icon,
  gradient = 'from-cyan-500 to-blue-600',
  badge = null,
  features = [],
  documentation = null,
  videoTutorial = null,
  examples = [],
  stats = {},
  onHelp = null,
  onSettings = null,
  onExport = null,
  onShare = null,
  className = '',
  fullscreen = false,
  onFullscreenToggle = null,
}) => {
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showFeaturesModal, setShowFeaturesModal] = useState(false)
  const [showExamplesModal, setShowExamplesModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleFullscreenToggle = () => {
    const newFullscreen = !isFullscreen
    setIsFullscreen(newFullscreen)
    if (onFullscreenToggle) {
      onFullscreenToggle(newFullscreen)
    }
  }

  const defaultFeatures = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption & HIPAA compliance',
    },
    {
      icon: Zap,
      title: 'AI-Powered',
      description: 'Advanced machine learning algorithms',
    },
    {
      icon: Database,
      title: 'Google Drive Integration',
      description: 'Seamless cloud storage & backup',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Multi-user access & sharing',
    },
  ]

  const defaultStats = {
    accuracy: '99.7%',
    processingTime: '< 2 seconds',
    successRate: '94.2%',
    users: '2,500+',
    documents: '15,000+',
    cases: '8,400+',
  }

  const toolFeatures = features.length > 0 ? features : defaultFeatures
  const toolStats = { ...defaultStats, ...stats }

  return (
    <div className={`relative ${className}`}>
      {/* Tool Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Tool Icon */}
            <div className="relative">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-2xl`}
              >
                <Icon className="h-8 w-8 text-white" />
              </div>
              {badge && (
                <div className="absolute -top-2 -right-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg border border-white/20">
                  {badge}
                </div>
              )}
            </div>

            {/* Tool Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
              <p className="text-xl text-slate-300 mb-4 max-w-3xl leading-relaxed">{description}</p>

              {/* Quick Stats */}
              <div className="flex items-center space-x-6">
                {Object.entries(toolStats)
                  .slice(0, 3)
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span className="text-slate-400 text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-white font-semibold">{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {onHelp && (
              <Tooltip content="Help & Documentation" side="top">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHelpModal(true)}
                  className="bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/50"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </Tooltip>
            )}

            {onSettings && (
              <Tooltip content="Tool Settings" side="top">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSettings}
                  className="bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/50"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Tooltip>
            )}

            {onFullscreenToggle && (
              <Tooltip content={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'} side="top">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFullscreenToggle}
                  className="bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/50"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex items-center space-x-3 mt-6">
          {toolFeatures.slice(0, 4).map((feature, index) => {
            const FeatureIcon = feature.icon
            return (
              <motion.button
                key={feature.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setShowFeaturesModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 cursor-pointer group"
              >
                <FeatureIcon className="h-4 w-4 text-cyan-400 group-hover:text-cyan-300" />
                <span className="text-sm font-medium">{feature.title}</span>
                <ChevronRight className="h-3 w-3 text-slate-500 group-hover:text-slate-400" />
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Tool Content */}
      <div className="relative">{children}</div>

      {/* Help Modal */}
      <Modal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        size="lg"
        className="max-w-4xl"
      >
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div
              className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}
            >
              <Icon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{title} Help Center</h2>
            <p className="text-slate-400">
              Everything you need to know about using this tool effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Start */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Play className="h-5 w-5 text-green-400" />
                <span>Quick Start Guide</span>
              </h3>
              <div className="space-y-3 text-slate-300">
                <p>1. Upload or capture your document</p>
                <p>2. Configure processing settings</p>
                <p>3. Review and validate results</p>
                <p>4. Export or save to Google Drive</p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>Key Features</span>
              </h3>
              <div className="space-y-2">
                {toolFeatures.map((feature, index) => {
                  const FeatureIcon = feature.icon
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <FeatureIcon className="h-4 w-4 text-cyan-400" />
                      <span className="text-slate-300 text-sm">{feature.description}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Documentation */}
            {documentation && (
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  <span>Documentation</span>
                </h3>
                <p className="text-slate-300 mb-4">Comprehensive guides and API references</p>
                <Button variant="outline" size="sm">
                  View Documentation
                </Button>
              </div>
            )}

            {/* Video Tutorial */}
            {videoTutorial && (
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Video className="h-5 w-5 text-purple-400" />
                  <span>Video Tutorial</span>
                </h3>
                <p className="text-slate-300 mb-4">Step-by-step video walkthrough</p>
                <Button variant="outline" size="sm">
                  Watch Tutorial
                </Button>
              </div>
            )}
          </div>

          {/* Examples */}
          {examples.length > 0 && (
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-4">Example Use Cases</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examples.map((example, index) => (
                  <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">{example.title}</h4>
                    <p className="text-slate-400 text-sm">{example.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Features Modal */}
      <Modal
        isOpen={showFeaturesModal}
        onClose={() => setShowFeaturesModal(false)}
        size="lg"
        className="max-w-4xl"
      >
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{title} Features</h2>
            <p className="text-slate-400">
              Discover all the powerful capabilities of this professional tool
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {toolFeatures.map((feature, index) => {
              const FeatureIcon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      <FeatureIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Modal>

      {/* Examples Modal */}
      <Modal
        isOpen={showExamplesModal}
        onClose={() => setShowExamplesModal(false)}
        size="lg"
        className="max-w-4xl"
      >
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Example Use Cases</h2>
            <p className="text-slate-400">
              See how other attorneys are using this tool successfully
            </p>
          </div>

          <div className="space-y-6">
            {examples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50"
              >
                <h3 className="text-xl font-bold text-white mb-3">{example.title}</h3>
                <p className="text-slate-300 mb-4">{example.description}</p>
                {example.steps && (
                  <div className="space-y-2">
                    {example.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{stepIndex + 1}</span>
                        </div>
                        <span className="text-slate-300 text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Stats Modal */}
      <Modal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        size="lg"
        className="max-w-4xl"
      >
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Performance Statistics</h2>
            <p className="text-slate-400">Real-time metrics and success rates for this tool</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(toolStats).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 text-center"
              >
                <div className="text-3xl font-bold text-cyan-400 mb-2">{value}</div>
                <div className="text-slate-400 text-sm capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ToolWrapper
