import React, { useState } from 'react';

export default function OcrTool() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function runMock() {
    setLoading(true);
    const res = await fetch('/api/ocr', { method:'POST' });
    const json = await res.json();
    setResult(json);
    setLoading(false);
  }

  return (
    <div className="rounded-2xl p-5" style={{ background:'var(--panel)', border:'1px solid var(--border)' }}>
      <h2 className="text-lg font-semibold" style={{ color:'var(--text)' }}>Camera OCR</h2>
      <p className="text-sm mt-1" style={{ color:'var(--muted)' }}>Demo Mode returns a synthetic parse of VA Form 21-526EZ.</p>
      <button onClick={runMock} className="mt-3 rounded-xl px-4 py-2" style={{ background:'var(--panel-hi)', color:'var(--text)', border:'1px solid var(--border)' }} disabled={loading}>
        {loading ? 'Parsing…' : 'Run Demo'}
      </button>
      {result && <pre className="mt-4 p-3 rounded-xl overflow-auto" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
