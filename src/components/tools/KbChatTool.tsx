import React, { useState } from 'react';
export default function KbChatTool() {
  const [results, setResults] = useState<any[]>([]);
  async function run(){ const res = await fetch('/api/kb/search', { method:'POST' }); setResults(await res.json()); }
  return (
    <div className="rounded-2xl p-5" style={{ background:'var(--panel)', border:'1px solid var(--border)' }}>
      <h2 className="text-lg font-semibold" style={{ color:'var(--text)' }}>KB Chat (Mocked)</h2>
      <p className="text-sm mt-1" style={{ color:'var(--muted)' }}>Ask a question → citations appear here.</p>
      <button onClick={run} className="mt-3 rounded-xl px-4 py-2" style={{ background:'var(--panel-hi)', color:'var(--text)', border:'1px solid var(--border)' }}>Run Demo</button>
      <ul className="mt-4 space-y-2">
        {results.map(r => (
          <li key={r.id} className="p-3 rounded-xl" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
            <div className="text-sm" style={{ color:'var(--text)' }}>{r.title}</div>
            <div className="text-xs mt-1" style={{ color:'var(--muted)' }}>{r.snippet}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
