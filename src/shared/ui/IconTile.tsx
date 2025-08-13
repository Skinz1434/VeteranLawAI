import React from 'react'
import { motion } from 'framer-motion'

type IconTileProps = {
  icon: React.ComponentType<any>
  gradient?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  glossy?: boolean
}

export default function IconTile({
  icon: Icon,
  gradient = 'from-cyan-500 via-blue-500 to-purple-600',
  size = 'md',
  className = '',
  glossy = true,
}: IconTileProps) {
  const dimensions = {
    sm: { box: 'w-10 h-10 rounded-xl', icon: 'h-5 w-5', radius: 'rounded-xl' },
    md: { box: 'w-16 h-16 rounded-2xl', icon: 'h-8 w-8', radius: 'rounded-2xl' },
    lg: { box: 'w-20 h-20 rounded-2xl', icon: 'h-10 w-10', radius: 'rounded-2xl' },
  }[size]

  return (
    <div
      className={`relative bg-gradient-to-br ${gradient} ${dimensions.box} flex items-center justify-center shadow-2xl overflow-hidden ${className}`}
    >
      {glossy && <div className={`absolute inset-0 ${dimensions.radius} border border-white/15`} />}
      {glossy && (
        <>
          <div
            className={`absolute inset-0 ${dimensions.radius} bg-gradient-to-b from-white/35 via-transparent to-transparent opacity-25`}
          />
          <motion.div
            aria-hidden
            className="absolute -inset-8 rotate-12"
            initial={{ x: -90, opacity: 0.0 }}
            animate={{ x: 90, opacity: 0.15 }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5 }}
          >
            <div className="h-full w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </motion.div>
        </>
      )}
      <Icon className={`${dimensions.icon} text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]`} />
    </div>
  )
}
