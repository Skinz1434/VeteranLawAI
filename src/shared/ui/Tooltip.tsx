import React, { useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type TooltipProps = {
  content: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  children: React.ReactNode
}

const sideToPosition: Record<NonNullable<TooltipProps['side']>, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2 origin-bottom',
  bottom: 'top-full left-1/2 -translate-x-1/2 translate-y-2 origin-top',
  left: 'right-full top-1/2 -translate-y-1/2 -translate-x-2 origin-right',
  right: 'left-full top-1/2 -translate-y-1/2 translate-x-2 origin-left',
}

export default function Tooltip({ content, side = 'top', className = '', children }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <div aria-describedby={open ? id : undefined}>{children}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            key="tooltip"
            id={id}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${sideToPosition[side]}`}
          >
            <div className="px-3 py-2 rounded-xl text-sm bg-gray-900/95 text-slate-200 border border-white/10 backdrop-blur-xl shadow-2xl">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
