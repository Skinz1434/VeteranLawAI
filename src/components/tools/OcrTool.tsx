import React, { useState } from 'react'
import { Scan } from 'lucide-react'
import { PageShell, SectionHeader, Button } from '../../shared/ui'

export default function OcrTool() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function runMock() {
    setLoading(true)
    const res = await fetch('/api/ocr', { method: 'POST' })
    const json = await res.json()
    setResult(json)
    setLoading(false)
  }

  return (
    <PageShell
      header={
        <SectionHeader
          title="Camera OCR"
          subtitle={
            <span className="text-slate-300">
              Demo mode returns a sample parse of VA Form 21-526EZ
            </span>
          }
          icon={Scan as any}
          gradient="from-blue-500 via-cyan-500 to-indigo-600"
          actions={
            <Button onClick={runMock} disabled={loading}>
              {loading ? 'Parsing…' : 'Run Demo'}
            </Button>
          }
          className="mb-8"
        />
      }
    >
      <div className="rounded-2xl p-5 bg-slate-800/50 border border-white/10">
        {result && (
          <pre className="mt-2 p-3 rounded-xl overflow-auto bg-slate-800/70 border border-white/10 text-slate-200">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </PageShell>
  )
}
