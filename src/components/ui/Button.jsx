import React from 'react'
import { motion } from 'framer-motion'

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  animate = true,
  className = '',
  onClick,
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40',
    secondary: 'bg-slate-700/50 text-white hover:bg-slate-700/70 border border-slate-600',
    outline: 'bg-transparent text-cyan-400 border border-cyan-400/50 hover:bg-cyan-400/10 hover:border-cyan-400',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/50',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500'
  }

  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3',
    large: 'px-6 py-4 text-lg'
  }

  const baseClasses = `
    font-medium rounded-xl transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
    ${fullWidth ? 'w-full' : ''}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim()

  const buttonContent = (
    <>
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="h-4 w-4" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="h-4 w-4" />}
    </>
  )

  if (animate && !disabled) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={baseClasses}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
        {buttonContent}
      </motion.button>
    )
  }

  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {buttonContent}
    </button>
  )
}

export const ButtonGroup = ({ children, className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    {children}
  </div>
)