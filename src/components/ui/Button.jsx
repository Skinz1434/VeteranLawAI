import React from 'react'
import { motion } from 'framer-motion'

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  animate = true,
  className = '',
  onClick,
  ...props
}, ref) => {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-glow',
    secondary: 'bg-slate-700/50 text-white hover:bg-slate-700/70 border border-slate-600 hover:border-slate-500',
    outline: 'bg-transparent text-cyan-400 border border-cyan-400/50 hover:bg-cyan-400/10 hover:border-cyan-400',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/50',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500'
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3',
    lg: 'px-6 py-4 text-lg'
  }

  const baseClasses = `
    font-medium rounded-xl motion-normal focus-ring
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
    ${fullWidth ? 'w-full' : ''}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim()

  const buttonContent = (
    <>
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="h-4 w-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="h-4 w-4" />}
        </>
      )}
    </>
  )

  const handleClick = (e) => {
    console.log('Button clicked:', children, 'onClick:', !!onClick, 'disabled:', disabled, 'loading:', loading)
    
    if (disabled || loading) {
      console.log('Button is disabled or loading, ignoring click')
      return
    }
    
    if (onClick) {
      console.log('Calling onClick handler')
      onClick(e)
    } else {
      console.log('No onClick handler provided')
    }
  }

  if (animate && !disabled) {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={baseClasses}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {buttonContent}
      </motion.button>
    )
  }

  return (
    <button
      ref={ref}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {buttonContent}
    </button>
  )
})

Button.displayName = 'Button'

export default Button