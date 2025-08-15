import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Target, Camera, Database, FileText, Mic, Search, BarChart3, Zap } from 'lucide-react'

const navigationItems = [
  { id: 'dashboard', title: 'Command Center', path: '/dashboard', icon: Target },
  { id: 'document-scanner', title: 'Document Scanner', path: '/document-scanner', icon: Camera },
  { id: 'legal-knowledge', title: 'Legal Database', path: '/legal-knowledge', icon: Database },
  { id: 'audio-transcription', title: 'Audio Transcription', path: '/audio-transcription', icon: Mic },
  { id: 'case-research', title: 'Case Research', path: '/case-research', icon: Search },
  { id: 'claim-guidance', title: 'Claim Guidance', path: '/claim-guidance', icon: FileText },
  { id: 'analytics', title: 'Analytics', path: '/analytics', icon: BarChart3 },
  { id: 'camera-ocr', title: 'Camera OCR', path: '/camera-ocr', icon: Zap },
]

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation()

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-slate-900/80 backdrop-blur border-r border-slate-800 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-80'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
        <span className="text-white font-semibold">{isCollapsed ? 'VL' : 'VeteranLawAI'}</span>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-300 hover:text-white"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? '›' : '‹'}
        </button>
      </div>

      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          {navigationItems.map(({ id, title, path, icon: Icon }) => {
            const active = location.pathname.startsWith(path)
            return (
              <li key={id}>
                <Link
                  to={path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 ${
                    active ? 'bg-slate-800 text-white' : 'text-slate-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && <span>{title}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
