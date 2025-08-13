/**
 * @fileoverview Loading States and Progress Indicators for VeteranLawAI Platform
 * @author VeteranLawAI Platform
 * @version 1.0.0
 *
 * Comprehensive loading components with accessibility support for veterans.
 * Includes visual indicators, screen reader announcements, and cognitive accessibility features.
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2,
  BarChart3,
  FileText,
  Search,
  Brain,
  Scale,
  Mic,
  Camera,
  CheckCircle,
  Clock,
  Zap,
  Shield,
  Database,
  Globe,
  Activity,
  RefreshCw,
} from 'lucide-react'

/**
 * Primary Loading Spinner with accessibility features
 */
export const LoadingSpinner = ({
  size = 'medium',
  color = 'cyan',
  label = 'Loading content',
  showLabel = true,
  className = '',
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16',
  }

  const colorClasses = {
    cyan: 'text-cyan-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    white: 'text-white',
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
        role="progressbar"
        aria-label={label}
        aria-live="polite"
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
      {showLabel && <div className="text-slate-300 text-sm font-medium text-center">{label}</div>}
      <div className="sr-only" aria-live="polite">
        Loading in progress. Please wait.
      </div>
    </div>
  )
}

/**
 * Tool-specific loading states with contextual icons and messages
 */
export const ToolLoadingState = ({ tool, message, progress = null, className = '' }) => {
  const toolConfigs = {
    analytics: {
      icon: BarChart3,
      color: 'from-cyan-500 via-blue-500 to-purple-600',
      bgGlow: 'from-cyan-500/20 to-purple-500/20',
      messages: [
        'Processing practice data...',
        'Analyzing case outcomes...',
        'Generating insights...',
        'Calculating success rates...',
      ],
    },
    'case-search': {
      icon: Search,
      color: 'from-green-500 via-emerald-500 to-teal-600',
      bgGlow: 'from-green-500/20 to-teal-500/20',
      messages: [
        'Searching legal databases...',
        'Analyzing case precedents...',
        'Reviewing court decisions...',
        'Compiling results...',
      ],
    },
    'legal-knowledge': {
      icon: FileText,
      color: 'from-purple-500 via-violet-500 to-indigo-600',
      bgGlow: 'from-purple-500/20 to-indigo-500/20',
      messages: [
        'Accessing legal documents...',
        'Searching knowledge base...',
        'Processing regulations...',
        'Compiling information...',
      ],
    },
    'claim-guidance': {
      icon: Scale,
      color: 'from-yellow-500 via-amber-500 to-orange-600',
      bgGlow: 'from-yellow-500/20 to-orange-500/20',
      messages: [
        'Analyzing claim conditions...',
        'Reviewing VA criteria...',
        'Calculating success probability...',
        'Generating recommendations...',
      ],
    },
    'audio-transcription': {
      icon: Mic,
      color: 'from-rose-500 via-pink-500 to-purple-600',
      bgGlow: 'from-rose-500/20 to-purple-500/20',
      messages: [
        'Processing audio file...',
        'Converting speech to text...',
        'Analyzing content...',
        'Finalizing transcription...',
      ],
    },
    'camera-ocr': {
      icon: Camera,
      color: 'from-indigo-500 via-blue-500 to-cyan-600',
      bgGlow: 'from-indigo-500/20 to-cyan-500/20',
      messages: [
        'Processing image...',
        'Extracting text content...',
        'Analyzing document structure...',
        'Finalizing extraction...',
      ],
    },
  }

  const config = toolConfigs[tool] || toolConfigs.analytics
  const Icon = config.icon
  const currentMessage = message || config.messages[0]

  return (
    <div className={`flex flex-col items-center justify-center space-y-6 p-8 ${className}`}>
      {/* Animated icon with glow effect */}
      <div className="relative">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${config.bgGlow} rounded-full blur-2xl animate-pulse`}
        />
        <motion.div
          className={`relative w-20 h-20 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden`}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="absolute inset-0 rounded-2xl border border-white/15" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/35 via-white/0 to-transparent opacity-25" />
          <Icon className="h-10 w-10 text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]" />
        </motion.div>
      </div>

      {/* Loading message */}
      <div className="text-center space-y-2">
        <div className="text-xl font-bold text-white">{currentMessage}</div>
        <div className="text-slate-400">This may take a few moments</div>
      </div>

      {/* Progress bar if provided */}
      {progress !== null && (
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${config.color} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Accessibility announcements */}
      <div className="sr-only" aria-live="polite">
        {currentMessage} {progress !== null && `${Math.round(progress)}% complete.`}
      </div>
    </div>
  )
}

/**
 * Skeleton loader for content placeholders
 */
export const SkeletonLoader = ({ type = 'text', count = 1, className = '', animate = true }) => {
  const skeletonVariants = {
    text: 'h-4 bg-slate-700/50 rounded',
    title: 'h-6 bg-slate-700/50 rounded',
    card: 'h-32 bg-slate-700/50 rounded-xl',
    avatar: 'w-12 h-12 bg-slate-700/50 rounded-full',
    button: 'h-10 w-24 bg-slate-700/50 rounded-lg',
    metric: 'h-20 bg-slate-700/50 rounded-2xl',
  }

  const skeletonClass = skeletonVariants[type] || skeletonVariants.text

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={skeletonClass}
          animate={
            animate
              ? {
                  opacity: [0.3, 0.6, 0.3],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Data processing progress indicator
 */
export const DataProcessingIndicator = ({ stages = [], currentStage = 0, className = '' }) => {
  const defaultStages = [
    { name: 'Initializing', icon: RefreshCw },
    { name: 'Processing Data', icon: Database },
    { name: 'Analyzing Results', icon: Brain },
    { name: 'Finalizing', icon: CheckCircle },
  ]

  const processStages = stages.length > 0 ? stages : defaultStages

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <div className="text-xl font-bold text-white mb-2">Processing Request</div>
        <div className="text-slate-400">{processStages[currentStage]?.name || 'Processing...'}</div>
      </div>

      <div className="flex items-center justify-between max-w-md mx-auto">
        {processStages.map((stage, index) => {
          const Icon = stage.icon
          const isActive = index === currentStage
          const isCompleted = index < currentStage
          const isFuture = index > currentStage

          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isActive
                      ? 'bg-cyan-500 border-cyan-500 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-400'
                }`}
                animate={
                  isActive
                    ? {
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          '0 0 0 0 rgba(6, 182, 212, 0)',
                          '0 0 0 10px rgba(6, 182, 212, 0.1)',
                          '0 0 0 0 rgba(6, 182, 212, 0)',
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  repeat: isActive ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              >
                {isCompleted ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <Icon className={`h-6 w-6 ${isActive ? 'animate-pulse' : ''}`} />
                )}
              </motion.div>

              <div
                className={`text-xs font-medium text-center ${
                  isCompleted ? 'text-green-400' : isActive ? 'text-cyan-400' : 'text-slate-500'
                }`}
              >
                {stage.name}
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress line */}
      <div className="relative max-w-md mx-auto">
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-slate-700" />
        <motion.div
          className="absolute top-6 left-6 h-0.5 bg-gradient-to-r from-green-500 to-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStage / (processStages.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="sr-only" aria-live="polite">
        Step {currentStage + 1} of {processStages.length}: {processStages[currentStage]?.name}
      </div>
    </div>
  )
}

/**
 * Inline loading state for buttons and small components
 */
export const InlineLoader = ({ size = 'small', color = 'white', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  }

  const colorClasses = {
    white: 'text-white',
    cyan: 'text-cyan-400',
    slate: 'text-slate-400',
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="progressbar"
      aria-label="Loading"
    >
      <Loader2 className="w-full h-full" />
    </motion.div>
  )
}

/**
 * Full-page loading overlay
 */
export const LoadingOverlay = ({
  isVisible,
  message = 'Loading...',
  tool = null,
  onCancel = null,
  className = '',
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center ${className}`}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl max-w-md mx-4"
          >
            {tool ? (
              <ToolLoadingState tool={tool} message={message} />
            ) : (
              <div className="text-center space-y-4">
                <LoadingSpinner size="large" />
                <div className="text-white font-medium">{message}</div>
              </div>
            )}

            {onCancel && (
              <div className="mt-6 text-center">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Progress bar component for file uploads and downloads
 */
export const ProgressBar = ({
  progress = 0,
  label = 'Progress',
  showPercentage = true,
  color = 'cyan',
  className = '',
}) => {
  const colorClasses = {
    cyan: 'from-cyan-500 to-blue-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-indigo-600',
    orange: 'from-orange-500 to-red-600',
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        {showPercentage && <span className="text-sm text-slate-400">{Math.round(progress)}%</span>}
      </div>

      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full relative`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </motion.div>
      </div>

      <div className="sr-only" aria-live="polite">
        {label}: {Math.round(progress)}% complete
      </div>
    </div>
  )
}

export default {
  LoadingSpinner,
  ToolLoadingState,
  SkeletonLoader,
  DataProcessingIndicator,
  InlineLoader,
  LoadingOverlay,
  ProgressBar,
}
