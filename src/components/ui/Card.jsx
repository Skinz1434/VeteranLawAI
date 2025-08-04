import React from 'react'
import { motion } from 'framer-motion'

export const Card = React.forwardRef(({ 
  children, 
  className = '', 
  hover = true,
  gradient = false,
  blur = true,
  animate = true,
  delay = 0,
  ...props 
}, ref) => {
  const baseClasses = `
    rounded-2xl p-6 border border-slate-700/50
    ${blur ? 'backdrop-blur-sm' : ''}
    ${gradient ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80' : 'bg-slate-800/50'}
    ${hover ? 'hover:border-cyan-500/30 transition-all duration-300' : ''}
    ${className}
  `.trim()

  if (animate) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        className={baseClasses}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div ref={ref} className={baseClasses} {...props}>
      {children}
    </div>
  )
})

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-6 ${className}`}>
    {children}
  </div>
)

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-white ${className}`}>
    {children}
  </h3>
)

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-slate-300 mt-2 ${className}`}>
    {children}
  </p>
)

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 pt-6 border-t border-slate-700/50 ${className}`}>
    {children}
  </div>
)

Card.displayName = 'Card'

export default Card