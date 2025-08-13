import React, { useState, useEffect } from 'react'
import { X, Chrome } from 'lucide-react'
import { useAuth } from '../../contexts/SimpleAuthContext'

const QuickLoginModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false)
  const { loginWithEmail } = useAuth()

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleQuickLogin = async () => {
    setLoading(true)
    
    // Instant login - no validation needed
    await loginWithEmail('demo@veteranlawai.com', 'demo')
    
    // Close modal after short delay to show success
    setTimeout(() => {
      onClose()
      setLoading(false)
    }, 500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-cyan-500/20 shadow-2xl p-8 max-w-md w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
            <span className="text-3xl font-bold text-white">VA</span>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome to VeteranLawAI
            </h2>
            <p className="text-slate-400">
              AI-Powered Legal Platform for VA Claims
            </p>
          </div>

          {/* Quick Login Button - THIS WILL WORK */}
          <button
            onClick={handleQuickLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <Chrome className="h-5 w-5" />
                <span>Quick Login with Demo Access</span>
              </>
            )}
          </button>

          {/* Info */}
          <div className="text-sm text-slate-400">
            <p>✓ No account needed</p>
            <p>✓ Full platform access</p>
            <p>✓ All tools unlocked</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickLoginModal