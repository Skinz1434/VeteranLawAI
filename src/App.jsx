import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import {
  Scale,
  Camera,
  BookOpen,
  FileText,
  Mic,
  Search,
  BarChart3,
  User,
  ChevronRight,
  Activity,
} from 'lucide-react'
import { motion } from 'framer-motion'

// Contexts - Using SimpleAuth for immediate functionality
import { SimpleAuthProvider as AuthProvider, useAuth } from './contexts/SimpleAuthContext'

// Components
import { Button, Tooltip, LoadingSpinner, PageShell, SectionHeader, IconTile } from './shared/ui'
import WelcomeModal from './components/modals/WelcomeModal'
import LoginModal from './components/modals/QuickLoginModal'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import SkipLinks from './components/ui/SkipLinks'
// LoadingSpinner re-exported from shared UI

// Tools (lazy-loaded for faster initial paint)
const CameraOCR = lazy(() => import('./components/tools/CameraOCR'))
const LegalKnowledgeBase = lazy(() => import('./components/tools/LegalKnowledgeBase'))
const ClaimGuidance = lazy(() => import('./components/tools/ClaimGuidance'))
const AudioTranscription = lazy(
  () => import('./components/tools/AudioTranscription/AudioTranscription')
)
const CaseResearch = lazy(() => import('./components/tools/CaseResearch'))
const Analytics = lazy(() => import('./components/tools/Analytics'))

// Accessibility utilities
// import { announceToScreenReader } from './utils/accessibility'

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
  const { user, isAuthenticated, loading } = useAuth()
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [autoDemo, setAutoDemo] = useState(false)

  // Show welcome modal until completed, regardless of auth
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('veteranlawai_welcome_completed')
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true)
    }
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <>
      <SkipLinks />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false)
          setAutoDemo(false)
        }}
      />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <LandingPage
                onLogin={() => {
                  setAutoDemo(false)
                  setShowLoginModal(true)
                }}
                onDemo={() => {
                  setAutoDemo(true)
                  setShowLoginModal(true)
                }}
              />
            )
          }
        />
        <Route
          path="/camera-ocr"
          element={
            <ProtectedRoute>
              <Layout>
                <ErrorBoundary errorType="cameraocr" supportEmail="support@veteranlawai.com">
                  <Suspense
                    fallback={
                      <div className="min-h-screen flex items-center justify-center p-8">
                        <LoadingSpinner size="large" label="Loading Document Scanner" />
                      </div>
                    }
                  >
                    <CameraOCR />
                  </Suspense>
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/legal-knowledge"
          element={
            <ProtectedRoute>
              <Layout>
                <ErrorBoundary errorType="legalknowledge" supportEmail="support@veteranlawai.com">
                  <Suspense
                    fallback={
                      <div className="min-h-screen flex items-center justify-center p-8">
                        <LoadingSpinner size="large" label="Loading Legal Knowledge" />
                      </div>
                    }
                  >
                    <LegalKnowledgeBase />
                  </Suspense>
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/claim-guidance"
          element={
            <ProtectedRoute>
              <Layout>
                <ErrorBoundary errorType="claimguidance" supportEmail="support@veteranlawai.com">
                  <Suspense
                    fallback={
                      <div className="min-h-screen flex items-center justify-center p-8">
                        <LoadingSpinner size="large" label="Loading Claim Assistant" />
                      </div>
                    }
                  >
                    <ClaimGuidance />
                  </Suspense>
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/audio-transcription"
          element={
            <ProtectedRoute>
              <Layout>
                <ErrorBoundary
                  errorType="audiotranscription"
                  supportEmail="support@veteranlawai.com"
                >
                  <Suspense
                    fallback={
                      <div className="min-h-screen flex items-center justify-center p-8">
                        <LoadingSpinner size="large" label="Loading Audio Intelligence" />
                      </div>
                    }
                  >
                    <AudioTranscription />
                  </Suspense>
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/case-research"
          element={
            <ProtectedRoute>
              <Layout>
                <ErrorBoundary errorType="caseresearch" supportEmail="support@veteranlawai.com">
                  <Suspense
                    fallback={
                      <div className="min-h-screen flex items-center justify-center p-8">
                        <LoadingSpinner size="large" label="Loading Case Research" />
                      </div>
                    }
                  >
                    <CaseResearch />
                  </Suspense>
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <ErrorBoundary errorType="analytics" supportEmail="support@veteranlawai.com">
                  <Suspense
                    fallback={
                      <div className="min-h-screen flex items-center justify-center p-8">
                        <LoadingSpinner size="large" label="Loading Analytics" />
                      </div>
                    }
                  >
                    <Analytics />
                  </Suspense>
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/health" element={<HealthPage />} />
      </Routes>

      {/* Modals */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => {
          setShowWelcomeModal(false)
          setShowLoginModal(true)
        }}
        userName={user?.name}
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
            <Button onClick={() => setShowLoginModal(true)}>Sign In</Button>
          </div>
        </div>
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </>
    )
  }

  return children
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="text-center">
        <LoadingSpinner
          size="xlarge"
          color="cyan"
          label="Loading VeteranLawAI Platform"
          showLabel={true}
        />
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-white mb-2">VeteranLawAI</h2>
          <p className="text-slate-400">Initializing your legal workspace...</p>
        </div>
      </div>
    </div>
  )
}

function LandingPage({ onLogin, onDemo }) {
  const tools = [
    {
      title: 'Camera OCR',
      href: '/camera-ocr',
      icon: Camera,
      color: 'from-cyan-500 to-blue-600',
      desc: 'Digitize VA forms and medical records instantly',
    },
    {
      title: 'Legal Knowledge',
      href: '/legal-knowledge',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      desc: '14,500+ VA regulations and precedents',
    },
    {
      title: 'Claim Guidance',
      href: '/claim-guidance',
      icon: FileText,
      color: 'from-purple-500 to-pink-600',
      desc: 'AI-powered step-by-step assistance',
    },
    {
      title: 'Audio Transcription',
      href: '/audio-transcription',
      icon: Mic,
      color: 'from-green-500 to-emerald-600',
      desc: 'Professional legal transcription',
    },
    {
      title: 'Case Research',
      href: '/case-research',
      icon: Search,
      color: 'from-orange-500 to-red-600',
      desc: 'Find relevant precedents in seconds',
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      color: 'from-yellow-500 to-orange-600',
      desc: 'Track success rates and metrics',
    },
  ]

  return (
    <PageShell
      header={
        <SectionHeader
          title={<span className="display-hero gradient-text-primary">VeteranLawAI</span>}
          subtitle={
            <span className="display-subtitle">
              AI platform for attorneys representing Veterans in VA disability claims
            </span>
          }
          icon={Scale}
          gradient="from-cyan-500 via-blue-500 to-purple-600"
          actions={
            <div className="flex items-center space-x-3">
              <Tooltip content="Sign in to start your trial" side="top">
                <Button size="lg" onClick={onLogin}>
                  Start Free Trial
                </Button>
              </Tooltip>
              <Link to="/health" className="focus-ring">
                <Tooltip content="View build and service status" side="top">
                  <Button variant="outline" size="lg">
                    System Health
                  </Button>
                </Tooltip>
              </Link>
            </div>
          }
        />
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => {
          const Icon = tool.icon
          return (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group glass-card gradient-outline rounded-2xl p-6 hover:border-cyan-500/30 motion-normal cursor-pointer"
              onClick={tool.title === 'Analytics' ? onDemo : onLogin}
            >
              <Tooltip content={tool.desc} side="top">
                <IconTile
                  icon={Icon}
                  gradient={tool.color}
                  size="lg"
                  className="mb-4 group-hover:scale-110 transition-transform duration-300"
                />
              </Tooltip>
              <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
              <p className="text-slate-300 text-sm">{tool.desc}</p>
            </motion.div>
          )
        })}
      </div>
    </PageShell>
  )
}

function Dashboard() {
  const { user, userProfile, logout } = useAuth()
  const [hoveredTool, setHoveredTool] = useState(null)

  const tools = [
    {
      title: 'Document Scanner',
      href: '/camera-ocr',
      icon: Camera,
      color: 'from-emerald-500 via-teal-500 to-cyan-600',
      stats: '2,341 documents processed',
      badge: 'AI',
      glow: 'shadow-emerald-500/25',
      description: '99.7% VA form accuracy with OCR',
    },
    {
      title: 'Legal Intelligence',
      href: '/legal-knowledge',
      icon: BookOpen,
      color: 'from-amber-500 via-yellow-500 to-orange-600',
      stats: '18,500+ regulations indexed',
      badge: 'PRO',
      glow: 'shadow-amber-500/25',
      description: 'Advanced legal research database',
    },
    {
      title: 'Claim Assistant',
      href: '/claim-guidance',
      icon: FileText,
      color: 'from-rose-500 via-pink-500 to-purple-600',
      stats: '156 claims filed this month',
      badge: 'NEW',
      glow: 'shadow-rose-500/25',
      description: 'AI-powered step-by-step guidance',
    },
    {
      title: 'Audio Intelligence',
      href: '/audio-transcription',
      icon: Mic,
      color: 'from-green-500 via-emerald-500 to-teal-600',
      stats: '412 hours transcribed',
      badge: 'BETA',
      glow: 'shadow-green-500/25',
      description: 'Legal transcription & analysis',
    },
    {
      title: 'Case Research',
      href: '/case-research',
      icon: Search,
      color: 'from-indigo-500 via-purple-500 to-blue-600',
      stats: '15,000+ case precedents',
      badge: null,
      glow: 'shadow-indigo-500/25',
      description: 'Comprehensive precedent analysis',
    },
    {
      title: 'Success Analytics',
      href: '/analytics',
      icon: BarChart3,
      color: 'from-violet-500 via-purple-500 to-indigo-600',
      stats: '94.2% success rate tracked',
      badge: null,
      glow: 'shadow-violet-500/25',
      description: 'Performance metrics & insights',
    },
  ]

  return (
    <PageShell
      header={
        <SectionHeader
          title="Command Center"
          subtitle={
            <span className="text-slate-300">
              Welcome back,{' '}
              {userProfile?.displayName?.split(' ')[0] ||
                user?.displayName?.split(' ')[0] ||
                'Attorney'}
              !
            </span>
          }
          icon={Scale}
          gradient="from-cyan-500 via-blue-500 to-purple-600"
          actions={
            <Button variant="outline" onClick={logout}>
              Sign Out
            </Button>
          }
        />
      }
    >
      <main id="main-content" className="relative px-0 py-0">
        <div className="max-w-7xl mx-auto">
          {/* Premium Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mb-16 text-center"
          >
            <div className="relative inline-block">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent mb-4">
                Welcome back,{' '}
                {userProfile?.displayName?.split(' ')[0] ||
                  user?.displayName?.split(' ')[0] ||
                  'Attorney'}
                !
              </h1>
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-2xl rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Your AI-powered command center for VA disability claims is ready.
              <span className="text-cyan-400 font-medium">Here&apos;s what&apos;s happening today.</span>
            </p>

            {/* Floating stats pills */}
            <div className="flex justify-center items-center space-x-6 mt-8">
              {[
                {
                  label: 'Active Cases',
                  value: '47',
                  icon: FileText,
                  color: 'from-cyan-500 to-blue-600',
                },
                {
                  label: 'Success Rate',
                  value: '94.2%',
                  icon: BarChart3,
                  color: 'from-green-500 to-emerald-600',
                },
                {
                  label: 'This Month',
                  value: '12',
                  icon: Scale,
                  color: 'from-purple-500 to-pink-600',
                },
              ].map((stat, index) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className={`flex items-center space-x-3 px-6 py-4 bg-gradient-to-r ${stat.color}/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300`}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <IconTile icon={StatIcon} gradient={stat.color} size="sm" />
                    <div>
                      <div
                        className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                      >
                        {stat.value}
                      </div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Enhanced Performance Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {[
              {
                label: 'Total Cases',
                value: userProfile?.casesHandled || '247',
                color: 'from-cyan-500 via-blue-500 to-indigo-600',
                icon: FileText,
                change: '+12 this week',
                glow: 'shadow-cyan-500/20',
              },
              {
                label: 'Success Rate',
                value: `${userProfile?.successRate || 94.2}%`,
                color: 'from-green-500 via-emerald-500 to-teal-600',
                icon: BarChart3,
                change: '+2.3% vs last month',
                glow: 'shadow-cyan-500/20',
              },
              {
                label: 'This Month',
                value: '28',
                color: 'from-purple-500 via-violet-500 to-indigo-600',
                icon: Scale,
                change: '18 pending review',
                glow: 'shadow-purple-500/20',
              },
              {
                label: 'Total Awarded',
                value: '$4.2M',
                color: 'from-yellow-500 via-orange-500 to-red-600',
                icon: User,
                change: '+$240K this quarter',
                glow: 'shadow-yellow-500/20',
              },
            ].map((stat, index) => {
              const StatIcon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className={`relative glass-card gradient-outline bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 cursor-pointer group overflow-hidden ${stat.glow} hover:shadow-2xl`}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  {/* Background glow effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  {/* Subtle shine overlay */}
                  <div className="absolute inset-px rounded-[inherit] pointer-events-none bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon with enhanced styling */}
                  <IconTile
                    icon={StatIcon}
                    gradient={stat.color}
                    size="lg"
                    className={`mb-6 ${stat.glow} group-hover:scale-110 transition-transform duration-300`}
                  />

                  {/* Value with gradient text */}
                  <h3
                    className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                  >
                    {stat.value}
                  </h3>

                  {/* Label */}
                  <p className="text-slate-300 font-medium mb-2">{stat.label}</p>

                  {/* Change indicator */}
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                    {stat.change}
                  </p>

                  {/* Floating orb effect */}
                  <motion.div
                    className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${stat.color}/20 rounded-full blur-xl`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.5,
                    }}
                  />
                </motion.div>
              )
            })}
          </motion.div>

          {/* Premium Tools Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-2 text-center">
              Professional AI Tools Suite
            </h2>
            <p className="text-slate-300 text-center mb-12 max-w-2xl mx-auto">
              Enterprise-grade legal tools powered by advanced artificial intelligence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => {
              const Icon = tool.icon
              const isHovered = hoveredTool === tool.title

              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.7 + index * 0.1 }}
                  onHoverStart={() => setHoveredTool(tool.title)}
                  onHoverEnd={() => setHoveredTool(null)}
                >
                  <Link to={tool.href} className="focus-ring">
                    <motion.div
                      className={`relative glass-card gradient-outline bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 cursor-pointer overflow-hidden ${tool.glow} hover:shadow-2xl`}
                      whileHover={{ scale: 1.02, y: -6 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Background texture overlay */}
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.02'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      />

                      {/* Gradient glow effect */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${tool.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                        animate={{
                          opacity: isHovered ? 0.15 : 0,
                        }}
                      />
                      {/* Subtle shine overlay */}
                      <div className="absolute inset-px rounded-[inherit] pointer-events-none bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Icon container with enhanced styling */}
                      <div className="relative mb-6">
                        <IconTile
                          icon={Icon}
                          gradient={tool.color}
                          size="xl"
                          className={`${tool.glow} mb-4`}
                        />

                        {/* Premium badge */}
                        {tool.badge && (
                          <motion.div
                            className="absolute -top-2 -right-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-xl border border-white/20"
                            animate={{
                              scale: isHovered ? 1.1 : 1,
                              rotate: isHovered ? 5 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            {tool.badge}
                          </motion.div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors duration-300">
                          {tool.title}
                        </h3>

                        <p className="text-slate-300 text-sm mb-4 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                          {tool.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-semibold bg-gradient-to-r ${tool.color} bg-clip-text text-transparent`}
                          >
                            {tool.stats}
                          </p>

                          <Tooltip content="Open tool" side="top">
                            <motion.div
                              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300"
                              whileHover={{ scale: 1.1 }}
                            >
                              <motion.div
                                animate={{ x: isHovered ? 2 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight className="h-4 w-4 text-white" />
                              </motion.div>
                            </motion.div>
                          </Tooltip>
                        </div>
                      </div>

                      {/* Floating orb effects */}
                      <motion.div
                        className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${tool.color}/20 rounded-full blur-2xl`}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: index * 0.7,
                        }}
                      />

                      <motion.div
                        className={`absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br ${tool.color}/15 rounded-full blur-xl`}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 1 + index * 0.5,
                        }}
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </main>
    </PageShell>
  )
}

// ToolPage component removed - no longer used

function HealthPage() {
  return (
    <PageShell
      header={
        <SectionHeader
          title="System Health"
          subtitle={
            <span className="text-slate-300">Build and service status for the platform</span>
          }
          icon={Activity}
          gradient="from-emerald-500 via-teal-500 to-cyan-600"
        />
      }
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
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
            <Link to="/" className="focus-ring">
              <Button>← Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}

export default App
