import React, { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { PageShell, SectionHeader, Button } from '../../shared/ui'

export default function KbChatTool() {
  const [results, setResults] = useState<any[]>([])
  async function run() {
    const res = await fetch('/api/kb/search', { method: 'POST' })
    setResults(await res.json())
  }
  return (
    <PageShell
      header={
        <SectionHeader
          title="KB Chat"
          subtitle={
            <span className="text-slate-300">Ask questions and view knowledge base citations</span>
          }
          icon={MessageCircle as any}
          gradient="from-indigo-500 via-purple-500 to-blue-600"
          actions={<Button onClick={run}>Run Demo</Button>}
          className="mb-8"
        />
      }
    >
      <div className="rounded-2xl p-5 bg-slate-800/50 border border-white/10">
        <ul className="mt-2 space-y-2">
          {results.map((r: any) => (
            <li key={r.id} className="p-3 rounded-xl bg-slate-800/70 border border-white/10">
              <div className="text-sm text-white">{r.title}</div>
              <div className="text-xs mt-1 text-slate-400">{r.snippet}</div>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  )
}
