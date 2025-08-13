/**
 * @fileoverview Premium Layout Wrapper - Ultra-modern layout with sidebar and enhanced visuals
 * @author VeteranLawAI Platform
 * @version 3.0.0
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import QBitChat from '../chat/QBitChat'
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation'

/**
 * Premium Layout Component
 * Provides ultra-modern layout with sidebar navigation and enhanced visual design
 */
const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Enable keyboard navigation for the layout
  useKeyboardNavigation({
    enableGlobalShortcuts: true,
    enableEscapeHandling: true,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background texture and effects */}
      <div
        className="fixed inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.01'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating gradient orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse" />
      <div
        className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="fixed top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-emerald-500/3 to-teal-500/3 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: '4s' }}
      />

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />

      {/* Main Content */}
      <motion.div
        className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 80 : 320 }}
      >
        {/* Content wrapper with enhanced styling */}
        <div className="relative">
          {/* Top gradient bar */}
          <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 shadow-lg shadow-cyan-500/20" />

          {/* Main content area */}
          <main className="relative min-h-screen">{children}</main>
        </div>
      </motion.div>

      {/* QBit AI Chatbot */}
      <QBitChat />

      {/* Spotlight effects for interaction areas */}
      <div className="fixed pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full blur-2xl animate-pulse" />
        <div
          className="absolute bottom-32 left-32 w-24 h-24 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: '3s' }}
        />
      </div>
    </div>
  )
}

export default Layout
