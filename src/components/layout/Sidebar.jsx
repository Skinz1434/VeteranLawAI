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
  Database
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
      title: 'Command Center',
      path: '/',
      icon: Target,
      gradient: 'from-cyan-500 via-blue-500 to-purple-600',
      description: 'AI-powered insights & analytics',
      badge: null,
      glow: 'shadow-cyan-500/20'
    },
    {
      id: 'camera-ocr',
      title: 'Document Scanner',
      path: '/camera-ocr',
      icon: Camera,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      description: '99.7% VA form accuracy',
      badge: 'AI',
      glow: 'shadow-emerald-500/20'
    },
    {
      id: 'legal-knowledge',
      title: 'Legal Database',
      path: '/legal-knowledge',
      icon: Database,
      gradient: 'from-amber-500 via-yellow-500 to-orange-600',
      description: '18,500+ regulations & precedents',
      badge: null,
      glow: 'shadow-amber-500/20'
    },
    {
      id: 'claim-guidance',
      title: 'Claim Assistant',
      path: '/claim-guidance',
      icon: FileText,
      gradient: 'from-rose-500 via-pink-500 to-purple-600',
      description: 'Step-by-step AI guidance',
      badge: 'PRO',
      glow: 'shadow-rose-500/20'
    },
    {
      id: 'audio-transcription',
      title: 'Audio Intelligence',
      path: '/audio-transcription',
      icon: Mic,
      gradient: 'from-green-500 via-emerald-500 to-teal-600',
      description: 'Legal transcription & analysis',
      badge: 'NEW',
      glow: 'shadow-green-500/20'
    },
    {
      id: 'case-research',
      title: 'Case Research',
      path: '/case-research',
      icon: Search,
      gradient: 'from-indigo-500 via-purple-500 to-blue-600',
      description: '15,000+ case precedents',
      badge: null,
      glow: 'shadow-indigo-500/20'
    },
    {
      id: 'analytics',
      title: 'Success Analytics',
      path: '/analytics',
      icon: BarChart3,
      gradient: 'from-violet-500 via-purple-500 to-indigo-600',
      description: 'Performance metrics & trends',
      badge: null,
      glow: 'shadow-violet-500/20'
    }
  ]

  const bottomItems = [
    {
      id: 'settings',
      title: 'Platform Settings',
      path: '/settings',
      icon: Settings,
      gradient: 'from-slate-500 via-gray-500 to-zinc-600',
      description: 'Configuration & preferences',
      glow: 'shadow-slate-500/20'
    },
    {
      id: 'help',
      title: 'Help Center',
      path: '/help',
      icon: HelpCircle,
      gradient: 'from-blue-500 via-cyan-500 to-teal-600',
      description: '24/7 expert assistance',
      glow: 'shadow-blue-500/20'
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
        className="relative group"
      >
        <Link to={item.path} className="block">
          <motion.div
            className={`relative flex items-center px-4 py-4 mx-3 mb-3 rounded-2xl transition-all duration-300 ${
              active 
                ? `bg-gradient-to-r from-white/15 to-white/5 border border-white/20 ${item.glow} shadow-2xl backdrop-blur-xl` 
                : 'hover:bg-gradient-to-r hover:from-white/8 hover:to-white/3 hover:border hover:border-white/10 hover:shadow-xl hover:backdrop-blur-lg'
            }`}
            whileHover={{ scale: 1.02, x: 3 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            {/* Active indicator */}
            {active && (
              <motion.div
                className="absolute left-0 top-1/2 w-1.5 h-10 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600 rounded-r-full shadow-lg shadow-cyan-500/50"
                layoutId="activeIndicator"
                initial={false}
                style={{ y: '-50%' }}
              />
            )}

            {/* Icon with gradient background */}
            <div className={`relative flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} p-2.5 mr-4 shadow-lg transition-all duration-300 ${
              active ? `${item.glow} shadow-2xl` : `group-hover:${item.glow} group-hover:shadow-xl`
            }`}>
              <Icon className="w-full h-full text-white drop-shadow-lg" />
              
              {/* Enhanced glow effect */}
              <motion.div 
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} blur-lg transition-opacity duration-300`}
                animate={{ 
                  opacity: isHovered ? 0.4 : 0,
                  scale: isHovered ? 1.1 : 1
                }}
              />
              
              {/* Premium badge */}
              {item.badge && (
                <motion.div 
                  className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg border border-white/20"
                  animate={{ 
                    scale: isHovered ? 1.1 : 1,
                    rotate: isHovered ? 5 : 0
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item.badge}
                </motion.div>
              )}
            </div>

            {/* Text content */}
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-1 min-w-0"
                >
                  <div className={`font-semibold text-base transition-colors duration-300 ${
                    active ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {item.title}
                  </div>
                  <div className={`text-xs mt-1 transition-colors duration-300 ${
                    active ? 'text-cyan-200' : 'text-slate-400 group-hover:text-slate-300'
                  }`}>
                    {item.description}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced hover glow effect */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 via-white/5 to-transparent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </Link>

        {/* Enhanced tooltip for collapsed state */}
        <AnimatePresence>
          {isCollapsed && isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 px-4 py-3 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 min-w-[200px]"
            >
              <div className="font-semibold text-white text-sm mb-1">{item.title}</div>
              <div className="text-xs text-slate-300">{item.description}</div>
              {item.badge && (
                <div className="inline-block mt-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
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
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-2xl border-r border-white/10 shadow-2xl z-40 transition-all duration-500 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-80'
      }`}
      initial={false}
      animate={{ width: isCollapsed ? 80 : 320 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Enhanced texture overlay */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Cpath d='M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm36 36c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
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
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex items-center space-x-4"
              >
                {/* Enhanced Premium Logo */}
                <div className="relative group">
                  <motion.div 
                    className="w-14 h-14 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Scale className="h-8 w-8 text-white drop-shadow-lg" />
                    <motion.div 
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 blur-xl transition-opacity duration-300"
                      animate={{ opacity: hoveredItem ? 0.6 : 0.3 }}
                    />
                  </motion.div>
                  
                  {/* Premium crown badge */}
                  <motion.div 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border border-white/20"
                    animate={{ 
                      scale: hoveredItem ? 1.2 : 1,
                      rotate: hoveredItem ? 15 : 0
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Crown className="h-3.5 w-3.5 text-white" />
                  </motion.div>
                </div>
                
                <div>
                  <div className="text-xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                    VeteranLawAI
                  </div>
                  <div className="text-xs text-cyan-400 font-medium flex items-center space-x-1.5">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    <span>Enterprise Suite</span>
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Enhanced collapse toggle */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-10 h-10 bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/90 hover:to-slate-500/90 backdrop-blur-lg rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
            whileHover={{ scale: 1.1, rotate: isCollapsed ? 180 : 0 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Enhanced User Profile Section */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-4 mx-3 my-4 bg-gradient-to-r from-white/8 to-white/3 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
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
                  {user?.name || 'Attorney'}
                </div>
                <div className="text-xs text-emerald-400 flex items-center space-x-1.5">
                  <motion.div 
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span>Online • Enterprise</span>
                </div>
              </div>
              
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                >
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

      {/* Enhanced Navigation Items with perfect scrolling */}
      <div className="flex-1 overflow-hidden">
        <div 
          className="h-full overflow-y-auto py-4 px-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20 transition-colors"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.1) transparent'
          }}
        >
          <nav className="space-y-1">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <NavItem item={item} />
              </motion.div>
            ))}
          </nav>

          {/* Enhanced Divider */}
          <motion.div 
            className="mx-6 my-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent relative"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-white/20 to-purple-500/20 blur-sm" />
          </motion.div>

          {/* Bottom Items */}
          <nav className="space-y-1">
            {bottomItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
              >
                <NavItem item={item} isBottom />
              </motion.div>
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
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Enhanced Quick Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Success', value: '94%', color: 'from-green-500 to-emerald-500', icon: TrendingUp },
                  { label: 'Cases', value: '247', color: 'from-blue-500 to-cyan-500', icon: Award },
                  { label: 'Saved', value: '$4.2M', color: 'from-purple-500 to-pink-500', icon: Star }
                ].map((stat, index) => {
                  const StatIcon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      className={`bg-gradient-to-r ${stat.color}/20 rounded-xl p-3 border border-white/10 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <StatIcon className={`h-4 w-4 mx-auto mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`} />
                      <div className={`text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Enhanced Logout Button */}
              <motion.button
                onClick={logout}
                className="w-full flex items-center justify-center space-x-3 py-4 bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-600/30 rounded-2xl text-red-400 hover:text-red-300 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-lg group"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">Sign Out</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced floating glow effects */}
      <motion.div 
        className="absolute top-1/4 left-4 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </motion.div>
  )
}

export default Sidebar