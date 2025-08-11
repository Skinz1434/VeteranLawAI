import React from 'react'

type PageShellProps = {
  header?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export default function PageShell({ header, children, className = '' }: PageShellProps) {
  return (
    <div className={`min-h-screen relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-0" />
      <div
        className="absolute inset-0 opacity-30 z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/8 to-blue-500/8 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-full blur-2xl animate-pulse z-0" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-emerald-500/7 to-teal-500/7 rounded-full blur-2xl animate-pulse z-0" style={{ animationDelay: '3s' }} />
      <div className="relative p-6 z-10">
        <div className="max-w-7xl mx-auto">
          {header}
          {children}
        </div>
      </div>
    </div>
  )
}


