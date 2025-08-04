import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const AnimatedButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false)

  const variants = {
    primary: {
      base: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent',
      hover: 'from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/25',
      active: 'from-cyan-600 to-blue-700'
    },
    secondary: {
      base: 'bg-gradient-to-r from-slate-700 to-slate-600 text-white border-slate-600',
      hover: 'from-slate-600 to-slate-500 shadow-lg shadow-slate-500/25',
      active: 'from-slate-800 to-slate-700'
    },
    outline: {
      base: 'bg-transparent text-cyan-400 border-cyan-500/50',
      hover: 'bg-cyan-500/10 border-cyan-400 shadow-lg shadow-cyan-500/25',
      active: 'bg-cyan-500/20'
    },
    ghost: {
      base: 'bg-transparent text-slate-300 border-transparent',
      hover: 'bg-slate-700/50 text-white',
      active: 'bg-slate-700'
    },
    success: {
      base: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-transparent',
      hover: 'from-green-400 to-emerald-500 shadow-lg shadow-green-500/25',
      active: 'from-green-600 to-emerald-700'
    },
    danger: {
      base: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-transparent',
      hover: 'from-red-400 to-red-500 shadow-lg shadow-red-500/25',
      active: 'from-red-600 to-red-700'
    }
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6'
  }

  const isDisabled = disabled || loading

  const handleClick = (e) => {
    if (isDisabled) return
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)
    if (onClick) onClick(e)
  }

  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center font-semibold rounded-xl
        border transition-all duration-300 overflow-hidden
        ${variants[variant].base}
        ${sizes[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={handleClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? {
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={!isDisabled ? {
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 bg-white/10"
        initial={{ x: '-100%' }}
        animate={isPressed ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: variant === 'primary' 
            ? 'linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1))'
            : variant === 'success'
            ? 'linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))'
            : 'rgba(255, 255, 255, 0.05)'
        }}
      />

      {/* Content */}
      <div className="relative flex items-center space-x-2">
        {loading ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : Icon ? (
          <Icon className={iconSizes[size]} />
        ) : null}
        
        <motion.span
          animate={loading ? { opacity: 0.7 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
      </div>

      {/* Ripple Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={{ scale: 0, opacity: 0.5 }}
        animate={isPressed ? { scale: 1, opacity: 0 } : { scale: 0, opacity: 0.5 }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
        }}
      />
    </motion.button>
  )
}

export const FloatingActionButton = ({ 
  icon: Icon, 
  onClick, 
  className = '',
  position = 'bottom-right',
  tooltip = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  }

  return (
    <div className={`${positions[position]} z-50`}>
      <motion.button
        className={`
          w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 
          text-white rounded-full shadow-lg shadow-cyan-500/25
          flex items-center justify-center
          hover:shadow-xl hover:shadow-cyan-500/40
          transition-all duration-300
          ${className}
        `}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.5
        }}
      >
        <Icon className="h-6 w-6" />
      </motion.button>

      {/* Tooltip */}
      {tooltip && (
        <motion.div
          className="absolute bottom-full mb-2 right-0 bg-slate-800 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: showTooltip ? 1 : 0, 
            y: showTooltip ? 0 : 10 
          }}
          transition={{ duration: 0.2 }}
        >
          {tooltip}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800" />
        </motion.div>
      )}
    </div>
  )
}

export default AnimatedButton

