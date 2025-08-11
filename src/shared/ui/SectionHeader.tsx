import React from 'react'
import { motion } from 'framer-motion'

type SectionHeaderProps = {
  title: string
  subtitle?: React.ReactNode
  icon?: React.ComponentType<any>
  gradient?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export default function SectionHeader({ title, subtitle, icon: Icon, gradient = 'from-cyan-500 via-blue-500 to-purple-600', badge, actions, className = '' }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-8 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {Icon && (
            <div className="relative">
              <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-2xl`}>
                <Icon className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              {badge && (
                <div className="absolute -top-1 -right-1">{badge}</div>
              )}
            </div>
          )}
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            {subtitle && (
              <div className="text-slate-300 text-lg">
                {subtitle}
              </div>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center space-x-3">{actions}</div>
        )}
      </div>
    </motion.div>
  )
}


