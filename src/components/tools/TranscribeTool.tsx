import React, { useState } from 'react';
export default function TranscribeTool() {
  const [result, setResult] = useState<any>(null);
  async function runMock(){ const res = await fetch('/api/transcribe', { method:'POST' }); setResult(await res.json()); }
  return (
    <div className="rounded-2xl p-5" style={{ background:'var(--panel)', border:'1px solid var(--border)' }}>
      <h2 className="text-lg font-semibold" style={{ color:'var(--text)' }}>Audio Transcription</h2>
      <p className="text-sm mt-1" style={{ color:'var(--muted)' }}>Upload or record. Demo shows entities.</p>
      <button onClick={runMock} className="mt-3 rounded-xl px-4 py-2" style={{ background:'var(--panel-hi)', color:'var(--text)', border:'1px solid var(--border)' }}>Run Demo</button>
      {result && <pre className="mt-4 p-3 rounded-xl overflow-auto" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
