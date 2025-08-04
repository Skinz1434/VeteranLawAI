import React from 'react'

export const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  dot = false,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
    primary: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    secondary: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    gradient: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30'
  }

  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2'
  }

  const dotColors = {
    default: 'bg-slate-400',
    primary: 'bg-cyan-400',
    secondary: 'bg-blue-400',
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    danger: 'bg-red-400',
    purple: 'bg-purple-400',
    gradient: 'bg-cyan-400'
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        border backdrop-blur-sm
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `.trim()}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  )
}

export const BadgeGroup = ({ children, className = '' }) => (
  <div className={`flex flex-wrap items-center gap-2 ${className}`}>
    {children}
  </div>
)