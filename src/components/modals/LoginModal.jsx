import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Scale,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Chrome,
  Shield,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Users,
  Award,
  Database,
  Globe,
} from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { IconTile } from '../../shared/ui'
import { useAuth } from '../../contexts/AuthContext'

const LoginModal = ({ isOpen, onClose, autoDemo = false }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await login()
      if (result.success) {
        onClose()
      } else {
        setError(result.error || 'Login failed. Please try again.')
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-trigger demo when the modal opens with autoDemo flag
  React.useEffect(() => {
    if (isOpen && autoDemo) {
      handleGoogleLogin()
    }
  }, [isOpen, autoDemo])

  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption & HIPAA compliance',
    },
    {
      icon: Zap,
      title: 'AI-Powered Tools',
      description: 'Advanced legal document processing',
    },
    {
      icon: Database,
      title: 'Google Drive Integration',
      description: 'Seamless cloud storage & collaboration',
    },
    {
      icon: Award,
      title: 'Proven Results',
      description: '94% success rate for VA claims',
    },
  ]

  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" className="max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Login Form */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <IconTile
              icon={Scale}
              gradient="from-cyan-500 to-blue-600"
              size="lg"
              className="mx-auto lg:mx-0 mb-4"
            />
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to VeteranLawAI</h2>
            <p className="text-slate-400 text-lg">
              The professional AI platform for VA disability claims attorneys
            </p>
            {isDemoMode && (
              <div className="mt-3 px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm font-medium">
                  🎮 Demo Mode Active - No Firebase configuration required
                </p>
              </div>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3"
            >
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              size="lg"
              fullWidth
              className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Chrome className="h-5 w-5" />
                  <span>Continue with Google</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800 text-slate-400">Secure & Professional</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-slate-400 text-sm">
                By continuing, you agree to our{' '}
                <button className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-6 border-t border-slate-700/50">
            <div className="flex items-center justify-center space-x-6 text-slate-400">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="text-xs">SOC 2 Type II</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span className="text-xs">GDPR Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Features & Benefits */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full mb-4">
              <Crown className="h-4 w-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">Enterprise Platform</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Why Choose VeteranLawAI?</h3>
            <p className="text-slate-300 mb-6">
              Join thousands of attorneys who trust our AI-powered platform for their VA disability
              claims practice.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-700/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">2,500+</div>
              <div className="text-xs text-slate-400">Attorneys</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">$12M+</div>
              <div className="text-xs text-slate-400">Claims Won</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">94%</div>
              <div className="text-xs text-slate-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">15,000+</div>
              <div className="text-xs text-slate-400">Documents</div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start Free Trial
            </Button>
            <p className="text-slate-400 text-xs mt-2">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default LoginModal
