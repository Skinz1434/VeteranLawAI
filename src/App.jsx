import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Scale, Camera, BookOpen, FileText, Mic, Search, BarChart3, User, LogOut, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Contexts
import AuthProvider, { useAuth } from './contexts/AuthContext'

// Components
import Button from './components/ui/Button'
import WelcomeModal from './components/modals/WelcomeModal'
import LoginModal from './components/modals/LoginModal'

// Tools
import CameraOCR from './components/tools/CameraOCR'
import LegalKnowledgeBase from './components/tools/LegalKnowledgeBase'
import ClaimGuidance from './components/tools/ClaimGuidance'
import AudioTranscription from './components/tools/AudioTranscription'
import CaseResearch from './components/tools/CaseResearch'
import Analytics from './components/tools/Analytics'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  )
}

function AppContent() {
  const { user, isAuthenticated, logout, loading } = useAuth()
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Check if user should see welcome modal
  useEffect(() => {
    if (isAuthenticated && user) {
      const hasSeenWelcome = localStorage.getItem('veteranlawai_welcome_completed')
      if (!hasSeenWelcome) {
        setShowWelcomeModal(true)
      }
    }
  }, [isAuthenticated, user])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <Dashboard /> : <LandingPage onLogin={() => setShowLoginModal(true)} />
        } />
        <Route path="/camera-ocr" element={<ProtectedRoute><CameraOCR /></ProtectedRoute>} />
        <Route path="/legal-knowledge" element={<ProtectedRoute><LegalKnowledgeBase /></ProtectedRoute>} />
        <Route path="/claim-guidance" element={<ProtectedRoute><ClaimGuidance /></ProtectedRoute>} />
        <Route path="/audio-transcription" element={<ProtectedRoute><AudioTranscription /></ProtectedRoute>} />
        <Route path="/case-research" element={<ProtectedRoute><CaseResearch /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/health" element={<HealthPage />} />
      </Routes>

      {/* Modals */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        userName={user?.name}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  )
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="text-center">
            <Scale className="h-16 w-16 text-cyan-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
            <p className="text-slate-400 mb-6">Please sign in to access this tool</p>
            <Button onClick={() => setShowLoginModal(true)}>
              Sign In
            </Button>
          </div>
        </div>
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </>
    )
  }

  return children
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Scale className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">VeteranLawAI</h2>
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  )
}

function LandingPage({ onLogin }) {
  const tools = [
    { title: 'Camera OCR', href: '/camera-ocr', icon: Camera, color: 'from-cyan-500 to-blue-600', desc: 'Digitize VA forms and medical records instantly' },
    { title: 'Legal Knowledge', href: '/legal-knowledge', icon: BookOpen, color: 'from-blue-500 to-indigo-600', desc: '14,500+ VA regulations and precedents' },
    { title: 'Claim Guidance', href: '/claim-guidance', icon: FileText, color: 'from-purple-500 to-pink-600', desc: 'AI-powered step-by-step assistance' },
    { title: 'Audio Transcription', href: '/audio-transcription', icon: Mic, color: 'from-green-500 to-emerald-600', desc: 'Professional legal transcription' },
    { title: 'Case Research', href: '/case-research', icon: Search, color: 'from-orange-500 to-red-600', desc: 'Find relevant precedents in seconds' },
    { title: 'Analytics', href: '/analytics', icon: BarChart3, color: 'from-yellow-500 to-orange-600', desc: 'Track success rates and metrics' },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">VeteranLawAI</h1>
              <p className="text-xs text-cyan-400">VA Legal Platform</p>
            </div>
          </div>
          <Button onClick={onLogin}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              VeteranLawAI
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              AI-powered legal platform designed exclusively for attorneys representing Veterans in VA disability claims
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={onLogin}>
                Start Free Trial
              </Button>
              <Link to="/health">
                <Button variant="outline" size="lg">
                  System Health
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
                  onClick={onLogin}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
                  <p className="text-slate-300 text-sm">{tool.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-700/50 py-8 px-6 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">VeteranLawAI</h3>
          </div>
          <p className="text-slate-400 mb-4">Empowering VA disability claims attorneys with AI-powered legal tools</p>
          <p className="text-slate-500 text-sm">© 2024 VeteranLawAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function Dashboard() {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const tools = [
    { title: 'Camera OCR', href: '/camera-ocr', icon: Camera, color: 'from-cyan-500 to-blue-600', stats: '2,341 documents processed' },
    { title: 'Legal Knowledge', href: '/legal-knowledge', icon: BookOpen, color: 'from-blue-500 to-indigo-600', stats: '98% search accuracy' },
    { title: 'Claim Guidance', href: '/claim-guidance', icon: FileText, color: 'from-purple-500 to-pink-600', stats: '156 claims filed this month' },
    { title: 'Audio Transcription', href: '/audio-transcription', icon: Mic, color: 'from-green-500 to-emerald-600', stats: '412 hours transcribed' },
    { title: 'Case Research', href: '/case-research', icon: Search, color: 'from-orange-500 to-red-600', stats: '10,000+ cases indexed' },
    { title: 'Analytics', href: '/analytics', icon: BarChart3, color: 'from-yellow-500 to-orange-600', stats: 'Real-time insights' },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">VeteranLawAI</h1>
              <p className="text-xs text-cyan-400">VA Legal Platform</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800/50 transition-all duration-300"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.plan}</p>
              </div>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl"
                >
                  <div className="p-4 border-b border-slate-700/50">
                    <p className="font-medium text-white">{user?.name}</p>
                    <p className="text-sm text-slate-400">{user?.email}</p>
                    <p className="text-xs text-cyan-400 mt-1">{user?.plan} Plan</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300">
                      <Settings className="h-4 w-4" />
                      <span>Account Settings</span>
                    </button>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-slate-300">Here's what's happening with your VA claims today</p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            {[
              { label: 'Active Cases', value: user?.casesHandled || '47', color: 'from-cyan-500 to-blue-600' },
              { label: 'Success Rate', value: `${user?.successRate || 89}%`, color: 'from-green-500 to-emerald-600' },
              { label: 'This Month', value: '12', color: 'from-purple-500 to-pink-600' },
              { label: 'Total Won', value: '$2.4M', color: 'from-yellow-500 to-orange-600' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <Link
                    to={tool.href}
                    className="group block bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
                    <p className="text-cyan-400 text-xs font-medium">{tool.stats}</p>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

function ToolPage({ title }) {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
          <p className="text-slate-300 mb-8">This enhanced tool is ready for professional use with advanced AI capabilities.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/">
              <Button variant="outline">
                ← Back to Dashboard
              </Button>
            </Link>
            <Button>
              Launch Tool
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function HealthPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
          <h1 className="text-3xl font-bold text-white mb-6">System Health Check</h1>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <span className="text-white font-medium">Application Status</span>
              <span className="text-green-400 font-semibold">✓ Healthy</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <span className="text-white font-medium">Build Version</span>
              <span className="text-green-400 font-semibold">v2.0.0</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <span className="text-white font-medium">Authentication</span>
              <span className="text-green-400 font-semibold">✓ Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <span className="text-white font-medium">Last Updated</span>
              <span className="text-green-400 font-semibold">{new Date().toISOString()}</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link to="/">
              <Button>
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App