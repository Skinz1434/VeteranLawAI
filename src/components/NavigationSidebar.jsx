import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Camera, 
  BookOpen, 
  FileText, 
  Mic, 
  Search, 
  BarChart3,
  Cloud,
  HardDrive,
  Users,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

const NavigationSidebar = ({ currentTool, toolStats, showSidebar = true, onToggle }) => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('connected')
  const [syncStatus, setSyncStatus] = useState('synced')
  
  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: Home,
      path: '/',
      gradient: 'from-slate-500 to-slate-600',
      description: 'Main dashboard overview'
    },
    {
      id: 'camera-ocr',
      name: 'Camera OCR',
      icon: Camera,
      path: '/camera-ocr',
      gradient: 'from-cyan-500 to-blue-600',
      description: 'Document processing'
    },
    {
      id: 'legal-knowledge',
      name: 'Legal Knowledge',
      icon: BookOpen,
      path: '/legal-knowledge',
      gradient: 'from-blue-500 to-purple-600',
      description: 'VA legal database'
    },
    {
      id: 'claim-guidance',
      name: 'Claim Guidance',
      icon: FileText,
      path: '/claim-guidance',
      gradient: 'from-purple-500 to-pink-600',
      description: 'Step-by-step guidance'
    },
    {
      id: 'audio-transcription',
      name: 'Audio Transcription',
      icon: Mic,
      path: '/audio-transcription',
      gradient: 'from-pink-500 to-red-600',
      description: 'Legal audio processing'
    },
    {
      id: 'case-research',
      name: 'Case Research',
      icon: Search,
      path: '/case-research',
      gradient: 'from-green-500 to-emerald-600',
      description: 'Legal precedent search'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      gradient: 'from-orange-500 to-yellow-600',
      description: 'Performance metrics'
    }
  ]

  // Simulate connection status updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional sync activity
      if (Math.random() > 0.9) {
        setSyncStatus('syncing')
        setTimeout(() => setSyncStatus('synced'), 2000)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
    if (onToggle) onToggle(!isCollapsed)
  }

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-400" />
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-red-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
    }
  }

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'synced':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'syncing':
        return <Clock className="h-4 w-4 text-blue-400 animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
    }
  }

  if (!showSidebar) return null

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ 
        x: 0,
        width: isCollapsed ? 80 : 256
      }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 flex flex-col h-screen sticky top-0 overflow-hidden"
    >
      {/* Collapse Toggle Button */}
      <div className="absolute top-4 -right-3 z-10">
        <button
          onClick={toggleCollapse}
          className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center border border-slate-600 transition-colors duration-200"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3 text-white" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-white" />
          )}
        </button>
      </div>

      {/* Current Tool Header */}
      <AnimatePresence>
        {currentTool && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 border-b border-slate-700/50"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${currentTool.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <currentTool.icon className="h-7 w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold text-lg truncate">{currentTool.name}</h3>
                <p className="text-slate-400 text-sm truncate">{currentTool.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tool Statistics */}
      <AnimatePresence>
        {toolStats && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 border-b border-slate-700/50"
          >
            <div className="space-y-4">
              {toolStats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <stat.icon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm truncate">{stat.label}</span>
                  </div>
                  <span className="text-white font-semibold text-sm flex-shrink-0">{stat.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  className={`group relative flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-xl transition-all duration-300 ${
                    active 
                      ? `bg-gradient-to-r ${item.gradient} shadow-lg` 
                      : 'hover:bg-slate-700/50 hover:shadow-md'
                  }`}
                  title={isCollapsed ? item.name : ''}
                >
                  <div className={`relative ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                    <Icon className="h-5 w-5" />
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -inset-1 bg-white/20 rounded-lg blur-sm"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className={`font-medium whitespace-nowrap ${active ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId="activeBackground"
                      className="absolute inset-0 bg-white/5 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </nav>

      {/* Enhanced Google Drive Integration Status */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 border-t border-slate-700/50"
          >
            <div className="bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Cloud className="h-5 w-5 text-green-400" />
                <span className="text-white font-medium text-sm">Google Drive</span>
                <div className="flex items-center space-x-1 ml-auto">
                  {getConnectionIcon()}
                  {getSyncIcon()}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Connected Account</span>
                  <span className="text-green-400 truncate ml-2">legal@lawfirm.com</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Storage Used</span>
                  <span className="text-cyan-400">2.4GB / 15GB</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-1.5 mt-2">
                  <motion.div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '16%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-slate-400">Last Sync</span>
                  <span className="text-slate-300">
                    {syncStatus === 'syncing' ? 'Syncing...' : '2 min ago'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed State Google Drive Indicator */}
      {isCollapsed && (
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex flex-col items-center space-y-2">
            <Cloud className="h-5 w-5 text-green-400" />
            <div className="flex space-x-1">
              {getConnectionIcon()}
              {getSyncIcon()}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default NavigationSidebar

