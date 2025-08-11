import React, { useState } from 'react';
import { Mic } from 'lucide-react'
import { PageShell, SectionHeader, Button } from '../../shared/ui'

export default function TranscribeTool() {
  const [result, setResult] = useState<any>(null);
  async function runMock(){ const res = await fetch('/api/transcribe', { method:'POST' }); setResult(await res.json()); }
  return (
    <PageShell
      header={(
        <SectionHeader
          title="Audio Transcription"
          subtitle={<span className="text-slate-300">Upload or record audio. Demo shows recognized entities.</span>}
          icon={Mic as any}
          gradient="from-green-500 via-emerald-500 to-teal-600"
          actions={<Button onClick={runMock}>Run Demo</Button>}
          className="mb-8"
        />
      )}
    >
      <div className="rounded-2xl p-5 bg-slate-800/50 border border-white/10">
        {result && (
          <pre className="mt-2 p-3 rounded-xl overflow-auto bg-slate-800/70 border border-white/10 text-slate-200">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </PageShell>
  );
}
