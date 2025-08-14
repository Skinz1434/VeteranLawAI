/**
 * @fileoverview Premium Left Navigation Sidebar - Ultra-modern design with 3D effects
 * @author VeteranLawAI Platform
 * @version 4.0.0
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
  Sparkles,
  Activity,
  TrendingUp,
  Award,
  Database,
} from 'lucide-react'
import { Tooltip } from '../../shared/ui'
import { useAuth } from '../../contexts/AuthContext'

/**
 * Premium Sidebar Navigation Component
 * Features ultra-modern design with 3D effects, gradients, glows, and animations
 */
const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, userProfile, logout } = useAuth()
  const location = useLocation()
  const [hoveredItem, setHoveredItem] = useState(null)

  // Navigation items with enhanced styling data
  const navigationItems = [
    {
      id: 'dashboard',
      title: 'Command Center',
      path: '/',
      icon: Target,
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      description: 'AI-powered insights & analytics',
      badge: null,
      glow: 'shadow-slate-400/10',
    },
    {
      id: 'camera-ocr',
      title: 'Document Scanner',
      path: '/camera-ocr',
      icon: Camera,
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      description: '99.7% VA form accuracy',
      badge: 'AI',
      glow: 'shadow-slate-400/10',
    },
    {
      id: 'legal-knowledge',
      title: 'Legal Database',
      path: '/legal-knowledge',
      icon: Database,
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      description: '18,500+ regulations & precedents',
      badge: null,
      glow: 'shadow-slate-400/10',
    },
    {
      id: 'claim-guidance',
      title: 'Claim Assistant',
      path: '/claim-guidance',
      icon: FileText,
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      description: 'Step-by-step AI guidance',
      badge: 'PRO',
      glow: 'shadow-slate-400/10',
    },
    {
      id: 'audio-transcription',
      title: 'Audio Intelligence',
      path: '/audio-transcription',
      icon: Mic,
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      description: 'Legal transcription & analysis',
      badge: 'NEW',
      glow: 'shadow-slate-400/10',
    },
    {
      id: 'case-research',
      title: 'Case Research',
      path: '/case-research',
      icon: Search,
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      description: '15,000+ case precedents',
      badge: null,
      glow: 'shadow-slate-400/10',
    },
    {
      id: 'analytics',
      title: 'Success Analytics',
      path: '/analytics',
      icon: BarChart3,
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      description: 'Performance metrics & trends',
      badge: null,
      glow: 'shadow-slate-400/10',
    },
  ]

  const bottomItems = [
    {
      id: 'settings',
      title: 'Platform Settings',
      path: '/settings',
      icon: Settings,
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      description: 'Configuration & preferences',
      glow: 'shadow-slate-400/10',
    },
    {
      id: 'help',
      title: 'Help Center',
      path: '/help',
      icon: HelpCircle,
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      description: '24/7 expert assistance',
      glow: 'shadow-slate-400/10',
    },
  ]

  /**
   * Checks if current path matches navigation item
   */
  const isActive = path => {
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
      <div
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        className="relative group"
      >
        <Link to={item.path} className="block focus-ring">
          <div
            className={`relative flex items-center px-4 py-4 mx-3 mb-3 rounded-2xl transition-all duration-300 cursor-pointer ${
              active
                ? `bg-gradient-to-r from-white/15 to-white/5 border border-white/20 ${item.glow} shadow-2xl backdrop-blur-xl`
                : 'hover:bg-gradient-to-r hover:from-white/6 hover:to-white/2 hover:border hover:border-white/8 hover:shadow-lg hover:backdrop-blur-lg'
            }`}
          >
            {/* Active indicator */}
            {active && (
              <motion.div
                className="absolute left-0 top-1/2 w-1.5 h-10 bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600 rounded-r-full shadow-lg shadow-slate-500/30"
                layoutId="activeIndicator"
                initial={false}
                style={{ y: '-50%' }}
              />
            )}

            {/* Icon with gradient background */}
            <Tooltip content={item.description} side="right">
              <div
                className={`relative flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} p-2.5 mr-4 shadow-lg transition-all duration-700 ease-out ${
                  active
                    ? `${item.glow} shadow-2xl`
                    : `group-hover:${item.glow} group-hover:shadow-lg`
                }`}
              >
                <Icon className="w-full h-full text-white drop-shadow-lg" />

                {/* Subtle glow effect */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} blur-lg transition-opacity duration-300 ${
                    isHovered ? 'opacity-15' : 'opacity-0'
                  }`}
                />

                {/* Premium badge */}
                {item.badge && (
                  <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white text-xs font-bold rounded-full shadow-lg border border-white/20">
                    {item.badge}
                  </div>
                )}
              </div>
            </Tooltip>

            {/* Text content */}
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-semibold text-base transition-colors duration-500 ${
                      active ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {item.title}
                  </div>
                  <div
                    className={`text-xs mt-1 transition-colors duration-500 ${
                      active ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-400'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* Hover glow effect */}
            {isHovered && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 via-white/3 to-transparent pointer-events-none" style={{ zIndex: 0 }} />
            )}
          </div>
        </Link>

        {/* Enhanced tooltip for collapsed state */}
        <AnimatePresence>
          {isCollapsed && isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 px-4 py-3 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 min-w-[200px]"
            >
              <div className="font-semibold text-white text-sm mb-1">{item.title}</div>
              <div className="text-xs text-slate-300">{item.description}</div>
              {item.badge && (
                <div className="inline-block mt-2 px-2 py-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white text-xs font-bold rounded-full">
                  {item.badge}
                </div>
              )}
              {/* Enhanced tooltip arrow */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
                <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-gray-900/95" />
                <div className="absolute top-0.5 left-0 w-0 h-0 border-t-6 border-b-6 border-r-6 border-t-transparent border-b-transparent border-r-white/20" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <motion.div
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-2xl border-r border-white/10 shadow-2xl z-40 transition-all duration-700 ease-in-out gradient-outline ${
        isCollapsed ? 'w-20' : 'w-80'
      }`}
      initial={false}
      animate={{ width: isCollapsed ? 80 : 320 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* Enhanced texture overlay */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Cpath d='M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm36 36c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Premium Header */}
      <div className="relative p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                key="expanded-header"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="flex items-center space-x-4"
              >
                {/* Enhanced Premium Logo */}
                <div className="relative group">
                  <div className="w-14 h-14 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-700/30 transition-transform duration-300 hover:scale-105">
                    <Scale className="h-8 w-8 text-white drop-shadow-lg" />
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 blur-xl transition-opacity duration-500"
                      animate={{ opacity: hoveredItem ? 0.4 : 0.2 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </motion.div>

                  {/* Premium crown badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg border border-white/20">
                    <Crown className="h-3.5 w-3.5 text-white" />
                  </motion.div>
                </div>

                <div>
                  <div className="text-xl font-bold text-white">
                    VeteranLawAI
                  </div>
                  <div className="text-xs text-slate-400 font-medium flex items-center space-x-1.5">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    <span>Enterprise Suite</span>
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-10 h-10 bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/90 hover:to-slate-500/90 backdrop-blur-lg rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10 hover:scale-105"
          >
            <div className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
              <ChevronLeft className="h-5 w-5 text-white" />
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced User Profile Section */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-4 mx-3 my-4 bg-gradient-to-r from-white/8 to-white/3 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105">
                  <User className="h-6 w-6 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm truncate">
                  {userProfile?.displayName || user?.displayName || 'Attorney'}
                </div>
                <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span>Online • Enterprise</span>
                </div>
              </div>

              <div className="relative">
                <div className="cursor-pointer transition-transform duration-300 hover:scale-110">
                  <Bell className="h-5 w-5 text-slate-400 hover:text-white transition-colors" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Items */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className="absolute inset-0 overflow-y-auto py-4 px-1"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
          }}
        >
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </nav>

          {/* Enhanced Divider */}
          <motion.div
            className="mx-6 my-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent relative"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-white/20 to-purple-500/20 blur-sm" />
          </motion.div>

          {/* Bottom Items */}
          <nav className="space-y-1">
            {bottomItems.map((item) => (
              <NavItem key={item.id} item={item} isBottom />
            ))}
          </nav>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="relative p-4 border-t border-white/10">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Enhanced Quick Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  {
                    label: 'Success',
                    value: userProfile?.successRate || '94%',
                    color: 'from-slate-600 to-slate-700',
                    icon: TrendingUp,
                  },
                  {
                    label: 'Cases',
                    value: userProfile?.casesHandled || '247',
                    color: 'from-slate-600 to-slate-700',
                    icon: Award,
                  },
                  {
                    label: 'Saved',
                    value: userProfile?.totalAwarded
                      ? `$${(userProfile.totalAwarded / 1000000).toFixed(1)}M`
                      : '$4.2M',
                    color: 'from-slate-600 to-slate-700',
                    icon: Star,
                  },
                ].map((stat, index) => {
                  const StatIcon = stat.icon
                  return (
                    <div
                      key={stat.label}
                      className={`bg-gradient-to-r ${stat.color}/20 rounded-xl p-3 border border-white/10 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105 hover:-translate-y-0.5`}
                    >
                      <StatIcon
                        className={`h-4 w-4 mx-auto mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}
                      />
                      <div
                        className={`text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                    </div>
                  )
                })}
              </div>

              {/* Enhanced Logout Button */}
              <button
                onClick={logout}
                className="w-full flex items-center justify-center space-x-3 py-4 bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-600/30 rounded-2xl text-red-400 hover:text-red-300 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-lg group hover:scale-[1.01]"
              >
                <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-500" />
                <span className="font-medium">Sign Out</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle floating glow effects */}
      <motion.div
        className="absolute top-1/4 left-4 w-32 h-32 bg-slate-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-4 w-24 h-24 bg-slate-600/5 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
    </motion.div>
  )
}

export default Sidebar
