import React, { useState } from 'react'
type Draft = { veteranName: string; condition: string; onset: string }
export default function ClaimWizard() {
  const [draft, setDraft] = useState<Draft>({ veteranName: '', condition: '', onset: '' })
  const [summary, setSummary] = useState<string>('')
  async function submit() {
    const res = await fetch('/api/claim/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    })
    const json = await res.json()
    setSummary(json.summary)
    localStorage.setItem('claimDraft', JSON.stringify(draft))
  }
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
    >
      <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
        Claim Wizard
      </h2>
      <div className="grid sm:grid-cols-3 gap-3 mt-3">
        <input
          placeholder="Veteran Name"
          value={draft.veteranName}
          onChange={e => setDraft({ ...draft, veteranName: e.target.value })}
          className="rounded-xl p-2 bg-transparent border"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        />
        <input
          placeholder="Condition"
          value={draft.condition}
          onChange={e => setDraft({ ...draft, condition: e.target.value })}
          className="rounded-xl p-2 bg-transparent border"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        />
        <input
          placeholder="Onset (YYYY-MM-DD)"
          value={draft.onset}
          onChange={e => setDraft({ ...draft, onset: e.target.value })}
          className="rounded-xl p-2 bg-transparent border"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        />
      </div>
      <button
        onClick={submit}
        className="mt-3 rounded-xl px-4 py-2"
        style={{
          background: 'var(--panel-hi)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
        }}
      >
        Create Summary
      </button>
      {summary && (
        <div
          className="mt-4 p-3 rounded-xl text-sm"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
          }}
        >
          {summary}
        </div>
      )}
    </div>
  )
}
