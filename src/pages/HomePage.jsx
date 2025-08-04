import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, Settings, User, LogOut, Scale, Camera, BookOpen, 
  FileText, Mic, Search, BarChart3, ArrowRight
} from 'lucide-react'

function HomePage({ scrollToSection, showMobileMenu, setShowMobileMenu, showUserMenu, setShowUserMenu, user }) {
  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="group relative flex items-center space-x-4">
              <div className="relative">
                <div className="h-12 w-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Scale className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity blur"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                  VeteranLawAI
                </h1>
                <p className="text-sm text-cyan-400 font-medium tracking-wide">VA Legal Specialists</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              <button 
                onClick={() => scrollToSection('features')}
                className="group relative px-6 py-3 text-gray-300 hover:text-white transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 border border-transparent hover:border-cyan-500/20"
              >
                <span className="relative z-10 font-medium">Features</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button 
                onClick={() => scrollToSection('tools')}
                className="group relative px-6 py-3 text-gray-300 hover:text-white transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 border border-transparent hover:border-blue-500/20"
              >
                <span className="relative z-10 font-medium">Tools</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="group relative px-6 py-3 text-gray-300 hover:text-white transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 border border-transparent hover:border-purple-500/20"
              >
                <span className="relative z-10 font-medium">Pricing</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </nav>

            {/* User Profile & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800/50 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white">{user?.name || 'Sarah Mitchell'}</p>
                    <p className="text-xs text-slate-400">Enterprise</p>
                  </div>
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-64 bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4 border-b border-slate-700/50">
                        <p className="font-medium text-white">{user?.name || 'Sarah Mitchell'}</p>
                        <p className="text-sm text-slate-400">{user?.email || 'sarah.mitchell@lawfirm.com'}</p>
                        <p className="text-xs text-cyan-400 mt-1">Enterprise Plan</p>
                      </div>
                      <div className="p-2">
                        <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300">
                          <Settings className="h-4 w-4" />
                          <span>Account Settings</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300">
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300">
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-xl hover:bg-slate-800/50 transition-all duration-300"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6 text-white" />
                ) : (
                  <Menu className="h-6 w-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              className="lg:hidden bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-2">
                <button
                  onClick={() => {
                    scrollToSection('features')
                    setShowMobileMenu(false)
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 rounded-xl transition-all duration-300 font-medium"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    scrollToSection('tools')
                    setShowMobileMenu(false)
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 rounded-xl transition-all duration-300 font-medium"
                >
                  Tools
                </button>
                <button
                  onClick={() => {
                    scrollToSection('pricing')
                    setShowMobileMenu(false)
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 rounded-xl transition-all duration-300 font-medium"
                >
                  Pricing
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-slate-900/50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center">
              {/* Professional Badge */}
              <motion.div
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-cyan-400 font-semibold text-sm tracking-wide">Built by VA Legal Experts</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                  VeteranLawAI
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                The most advanced AI-powered legal platform designed exclusively for 
                attorneys representing Veterans in VA disability claims. Built by VA legal 
                experts, fine-tuned by specialists.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-4 px-8 rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transform hover:scale-105">
                  Start Free Trial
                </button>
                <button 
                  onClick={() => scrollToSection('tools')}
                  className="w-full sm:w-auto bg-slate-800/50 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-2xl border border-slate-600 hover:bg-slate-700/50 transition-all duration-300 hover:border-slate-500"
                >
                  Try Tools Now
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>256-bit Encryption</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Professional VA Legal Tools
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Comprehensive suite of AI-powered tools designed specifically for VA disability claims
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Camera OCR Tool */}
              <motion.div
                className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Camera OCR Processing</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  AI-powered document digitization and text extraction with 99% accuracy for VA forms and medical records.
                </p>
                <Link 
                  to="/camera-ocr"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 group"
                >
                  Launch Tool
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Legal Knowledge Base */}
              <motion.div
                className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">VA Legal Knowledge Base</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Comprehensive legal database with 14,500+ documents including CFR regulations, M21 procedures, and case law.
                </p>
                <Link 
                  to="/legal-knowledge"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-400 hover:to-indigo-500 transition-all duration-300 group"
                >
                  Launch Tool
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Claim Guidance */}
              <motion.div
                className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Step-by-Step Claim Guidance</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  AI-powered case analysis with evidence gap identification and step-by-step filing guidance.
                </p>
                <Link 
                  to="/claim-guidance"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-3 rounded-xl hover:from-purple-400 hover:to-pink-500 transition-all duration-300 group"
                >
                  Launch Tool
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Audio Transcription */}
              <motion.div
                className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-green-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Legal Audio Transcription</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Professional transcription service optimized for legal terminology and VA claim consultations.
                </p>
                <Link 
                  to="/audio-transcription"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 group"
                >
                  Launch Tool
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Case Research */}
              <motion.div
                className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-orange-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Case Precedent Research</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Advanced search through 10,000+ legal precedents with AI-powered relevance scoring and citation management.
                </p>
                <Link 
                  to="/case-research"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 rounded-xl hover:from-orange-400 hover:to-red-500 transition-all duration-300 group"
                >
                  Launch Tool
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Analytics */}
              <motion.div
                className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Claim Success Analytics</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Comprehensive analytics dashboard tracking success rates, performance metrics, and case outcomes.
                </p>
                <Link 
                  to="/analytics"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold py-3 rounded-xl hover:from-yellow-400 hover:to-orange-500 transition-all duration-300 group"
                >
                  Launch Tool
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900/50 border-t border-slate-700/50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">VeteranLawAI</h3>
              </div>
              <p className="text-slate-400 mb-6">
                Empowering VA disability claims attorneys with AI-powered legal tools
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
                <span>© 2024 VeteranLawAI. All rights reserved.</span>
                <span>•</span>
                <span>Privacy Policy</span>
                <span>•</span>
                <span>Terms of Service</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}

export default HomePage