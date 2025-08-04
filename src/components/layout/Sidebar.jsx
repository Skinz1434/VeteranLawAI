/**
 * @fileoverview Premium Left Navigation Sidebar - Ultra-modern design with 3D effects
 * @author VeteranLawAI Platform
 * @version 3.0.0
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  Scale, 
  Camera, 
  BookOpen, 
  FileText, 
  Mic, 
  Search, 
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Star,
  Target,
  User,
  Bell,
  Globe,
  Crown,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

/**
 * Premium Sidebar Navigation Component
 * Features ultra-modern design with 3D effects, gradients, glows, and animations
 */
const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [hoveredItem, setHoveredItem] = useState(null)

  // Navigation items with enhanced styling data
  const navigationItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: '/',
      icon: Target,
      gradient: 'from-cyan-500 via-blue-500 to-purple-600',
      description: 'Command center with AI insights',
      badge: null
    },
    {
      id: 'camera-ocr',
      title: 'Camera OCR',
      path: '/camera-ocr',
      icon: Camera,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      description: 'AI document digitization',
      badge: 'NEW'
    },
    {
      id: 'legal-knowledge',
      title: 'Legal Knowledge',
      path: '/legal-knowledge',
      icon: BookOpen,
      gradient: 'from-violet-500 via-purple-500 to-indigo-600',
      description: '14,500+ VA regulations',
      badge: null
    },
    {
      id: 'claim-guidance',
      title: 'Claim Guidance',
      path: '/claim-guidance',
      icon: FileText,
      gradient: 'from-rose-500 via-pink-500 to-purple-600',
      description: 'Step-by-step AI assistance',
      badge: null
    },
    {
      id: 'audio-transcription',
      title: 'Audio Transcription',
      path: '/audio-transcription',
      icon: Mic,
      gradient: 'from-orange-500 via-amber-500 to-yellow-600',
      description: 'Legal audio processing',
      badge: 'PRO'
    },
    {
      id: 'case-research',
      title: 'Case Research',
      path: '/case-research',
      icon: Search,
      gradient: 'from-green-500 via-emerald-500 to-teal-600',
      description: '10,000+ case precedents',
      badge: null
    },
    {
      id: 'analytics',
      title: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
      gradient: 'from-blue-500 via-indigo-500 to-purple-600',
      description: 'Success metrics & insights',
      badge: null
    }
  ]

  const bottomItems = [
    {
      id: 'settings',
      title: 'Settings',
      path: '/settings',
      icon: Settings,
      gradient: 'from-slate-500 via-gray-500 to-zinc-600',
      description: 'Platform configuration'
    },
    {
      id: 'help',
      title: 'Help & Support',
      path: '/help',
      icon: HelpCircle,
      gradient: 'from-blue-500 via-cyan-500 to-teal-600',
      description: '24/7 expert assistance'
    }
  ]

  /**
   * Checks if current path matches navigation item
   */
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  /**
   * Navigation item component with premium styling
   */
  const NavItem = ({ item, isBottom = false }) => {
    const active = isActive(item.path)
    const Icon = item.icon
    const isHovered = hoveredItem === item.id

    return (
      <motion.div
        onHoverStart={() => setHoveredItem(item.id)}
        onHoverEnd={() => setHoveredItem(null)}
        className="relative"
      >
        <Link to={item.path} className="block">
          <motion.div
            className={`relative flex items-center px-4 py-3 mx-3 mb-2 rounded-2xl transition-all duration-300 group ${
              active 
                ? 'bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-2xl backdrop-blur-xl' 
                : 'hover:bg-gradient-to-r hover:from-white/5 hover:to-white/2 hover:border hover:border-white/10 hover:shadow-xl hover:backdrop-blur-lg'
            }`}
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Active indicator */}
            {active && (
              <motion.div
                className="absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full shadow-lg shadow-cyan-500/50"
                layoutId="activeIndicator"
                initial={false}
                style={{ y: '-50%' }}
              />
            )}

            {/* Icon with gradient background */}
            <div className={`relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} p-2 mr-3 shadow-lg group-hover:shadow-xl transition-all duration-300 ${
              active ? 'shadow-2xl' : ''
            }`}>
              <Icon className="w-full h-full text-white drop-shadow-sm" />
              
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md`} />
              
              {/* Badge */}
              {item.badge && (
                <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                  {item.badge}
                </div>
              )}
            </div>

            {/* Text content */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <div className={`font-semibold transition-colors duration-200 ${
                    active ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {item.title}
                  </div>
                  <div className={`text-xs transition-colors duration-200 ${
                    active ? 'text-cyan-200' : 'text-slate-400 group-hover:text-slate-300'
                  }`}>
                    {item.description}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hover glow effect */}
            {isHovered && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-transparent opacity-50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.div>
        </Link>

        {/* Tooltip for collapsed state */}
        {isCollapsed && isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.9 }}
            className="absolute left-full top-2 ml-2 px-3 py-2 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50"
          >
            <div className="font-semibold text-white text-sm">{item.title}</div>
            <div className="text-xs text-slate-300">{item.description}</div>
            {/* Tooltip arrow */}
            <div className="absolute left-0 top-4 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-900/95 -translate-x-1" />
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border-r border-white/10 shadow-2xl z-40 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-80'
      }`}
      initial={false}
      animate={{ width: isCollapsed ? 80 : 320 }}
    >
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      {/* Header */}
      <div className="relative p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center space-x-3"
            >
              {/* Premium Logo */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/25">
                  <Scale className="h-7 w-7 text-white drop-shadow-lg" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
                </div>
                {/* Premium badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="h-3 w-3 text-white" />
                </div>
              </div>
              
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                  VeteranLawAI
                </div>
                <div className="text-xs text-cyan-400 font-medium flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Enterprise Platform</span>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Collapse toggle */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-white" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-white" />
            )}
          </motion.button>
        </div>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 mx-3 my-4 bg-gradient-to-r from-white/5 to-white/2 rounded-2xl border border-white/10 backdrop-blur-xl"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 shadow-lg" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm truncate">
                {user?.name || 'Attorney'}
              </div>
              <div className="text-xs text-emerald-400 flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Online • Enterprise</span>
              </div>
            </div>
            
            <div className="relative">
              <Bell className="h-5 w-5 text-slate-400 hover:text-white transition-colors cursor-pointer" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-6 my-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Bottom Items */}
        <nav className="space-y-1">
          {bottomItems.map((item) => (
            <NavItem key={item.id} item={item} isBottom />
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="relative p-4 border-t border-white/10">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-2 border border-green-500/20">
                <div className="text-lg font-bold text-green-400">89%</div>
                <div className="text-xs text-slate-400">Success</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-2 border border-blue-500/20">
                <div className="text-lg font-bold text-blue-400">247</div>
                <div className="text-xs text-slate-400">Cases</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-2 border border-purple-500/20">
                <div className="text-lg font-bold text-purple-400">4.2m</div>
                <div className="text-xs text-slate-400">Saved</div>
              </div>
            </div>

            {/* Logout Button */}
            <motion.button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-600/30 rounded-xl text-red-400 hover:text-red-300 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Sign Out</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Floating glow effects */}
      <div className="absolute top-1/4 left-4 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
    </motion.div>
  )
}

export default Sidebar