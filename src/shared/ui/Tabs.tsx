import React, { createContext, useContext, useMemo } from 'react'
import { motion } from 'framer-motion'

type TabsContextType = {
  value: string
  onValueChange?: (v: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

type TabsProps = {
  value: string
  onValueChange: (v: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ value, onValueChange, children, className = '' }: TabsProps) {
  const ctx = useMemo(() => ({ value, onValueChange }), [value, onValueChange])
  return (
    <TabsContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-white/10 p-2 ${className}`}>
      {children}
    </div>
  )
}

type TabsTriggerProps = {
  value: string
  children?: React.ReactNode
  icon?: React.ComponentType<any>
  label?: string
  description?: string
  gradient?: string
}

export function TabsTrigger({ value, children, icon: Icon, label, description, gradient = 'from-cyan-500 to-blue-600' }: TabsTriggerProps) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsTrigger must be used within Tabs')
  const isActive = ctx.value === value

  return (
    <motion.button
      onClick={() => ctx.onValueChange && ctx.onValueChange(value)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex-1 flex flex-col items-center space-y-2 px-6 py-4 rounded-2xl font-medium transition-all duration-300 group ${
        isActive ? `bg-gradient-to-r ${gradient} text-white shadow-2xl shadow-cyan-500/20` : 'text-slate-300 hover:text-white hover:bg-white/5'
      }`}
    >
      {Icon ? (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isActive ? 'bg-white/20 shadow-lg' : `bg-gradient-to-br ${gradient} opacity-60 group-hover:opacity-100`
        }`}>
          <Icon className="h-6 w-6" />
        </div>
      ) : null}
      <div className="text-center">
        {label && <div className="font-semibold text-sm">{label}</div>}
        {description && <div className="text-xs opacity-70">{description}</div>}
        {children}
      </div>
    </motion.button>
  )
}

export function TabsContent({ value, children, className = '' }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsContent must be used within Tabs')
  const isActive = ctx.value === value
  if (!isActive) return null
  return <div className={className}>{children}</div>
}

export default {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
}


