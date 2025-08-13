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
  glossy?: boolean
}

export default function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  gradient = 'from-cyan-500 via-blue-500 to-purple-600',
  badge,
  actions,
  className = '',
  glossy = true,
}: SectionHeaderProps) {
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
              <div
                className={`relative w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden`}
              >
                {glossy && <div className="absolute inset-0 rounded-2xl border border-white/15" />}
                {glossy && (
                  <>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/35 via-white/0 to-transparent opacity-25" />
                    <motion.div
                      aria-hidden
                      className="absolute -inset-6 rotate-12"
                      initial={{ x: -80, opacity: 0.0 }}
                      animate={{ x: 80, opacity: 0.15 }}
                      transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5 }}
                    >
                      <div className="h-full w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    </motion.div>
                  </>
                )}
                <Icon className="h-8 w-8 text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]" />
              </div>
              {badge && <div className="absolute -top-1 -right-1">{badge}</div>}
            </div>
          )}
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            {subtitle && <div className="text-slate-300 text-lg">{subtitle}</div>}
          </div>
        </div>
        {actions && <div className="flex items-center space-x-3">{actions}</div>}
      </div>
    </motion.div>
  )
}
