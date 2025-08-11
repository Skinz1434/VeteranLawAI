import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Scale, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { IconTile } from '../../shared/ui'
import { useAuth } from '../../contexts/AuthContext'

const LoginModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submitted!', formData)

    if (!validateForm()) return

    setLoading(true)
    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        onClose()
        // Show success message or redirect
      } else {
        setErrors({ general: result.error || 'Login failed' })
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' })
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    console.log('Demo login clicked!')
    setLoading(true)
    try {
      const result = await login('demo@veteranlawai.com', 'demo123')
      if (result.success) {
        onClose()
      }
    } catch (error) {
      setErrors({ general: 'Demo login failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      className="max-w-md"
    >
      <div className="text-center mb-8">
        <IconTile 
          icon={Scale} 
          gradient="from-cyan-500 to-blue-600" 
          size="lg" 
          className="mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-slate-400">Sign in to your VeteranLawAI account</p>
      </div>

      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3"
        >
          <AlertCircle className="h-5 w-5 text-red-400" />
          <span className="text-red-400 text-sm">{errors.general}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@lawfirm.com"
          icon={Mail}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          icon={Lock}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <span className="text-slate-300">Remember me</span>
          </label>
          <button
            type="button"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
            onClick={handleSubmit}
          >
            Sign In
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800 text-slate-400">Or try demo</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleDemoLogin}
            disabled={loading}
          >
            Demo Login
          </Button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
        <p className="text-slate-400 text-sm">
          Don't have an account?{' '}
          <button className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            Request Access
          </button>
        </p>
      </div>

      {/* Demo Credentials Helper */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex items-start space-x-2">
          <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-400">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>Email: demo@veteranlawai.com</p>
            <p>Password: demo123</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default LoginModal