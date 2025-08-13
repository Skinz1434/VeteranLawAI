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
  ArrowRight,
  Award,
  Database,
} from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { IconTile } from '../../shared/ui'
import { useAuth } from '../../contexts/SimpleAuthContext'

const SimpleLoginModal = ({ isOpen, onClose, autoDemo = false }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loginWithEmail } = useAuth()

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // For demo, accept any email/password
      const result = await loginWithEmail(email || 'demo@veteranlawai.com', password || 'demo')
      if (result.success) {
        onClose()
      } else {
        setError('Login failed. Please try again.')
      }
    } catch (error) {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await login()
      if (result.success) {
        onClose()
      } else {
        setError('Login failed. Please try again.')
      }
    } catch (error) {
      setError('An unexpected error occurred.')
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
              Sign in to access your legal workspace
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-red-400">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@veteranlawai.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter any password (demo mode)"
                  className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full border-slate-700 hover:border-cyan-500"
            disabled={loading}
          >
            <Chrome className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>

          {/* Demo Mode Notice */}
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-green-400 font-medium">Demo Mode Active</p>
                <p className="text-green-400/80 text-sm mt-1">
                  Use any email/password or click "Sign in with Google" to access the platform instantly!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Features */}
        <div className="hidden lg:block space-y-6">
          <h3 className="text-xl font-bold text-white mb-4">Why Choose VeteranLawAI?</h3>
          
          {[
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
              title: 'Cloud Storage',
              description: 'Automatic backup & organization',
            },
            {
              icon: Award,
              title: 'Proven Results',
              description: '94% success rate for VA claims',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <div className="flex-shrink-0">
                <feature.icon className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">{feature.title}</h4>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}

          <div className="mt-8 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-xl border border-cyan-500/20">
            <Crown className="h-6 w-6 text-yellow-400 mb-2" />
            <p className="text-white font-medium">Enterprise Plan Included</p>
            <p className="text-slate-400 text-sm mt-1">
              Full access to all premium features
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SimpleLoginModal