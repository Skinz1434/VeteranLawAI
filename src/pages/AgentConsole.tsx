import React from 'react';
const events = [
  { step: 'User asks', detail: 'Parse this 21-526EZ PDF' },
  { step: 'Tool call', detail: 'ocr.extract -> fields' },
  { step: 'Reason', detail: 'Need structured data for wizard' },
  { step: 'Tool call', detail: 'kb.search -> rating rules' },
  { step: 'Answer', detail: 'Summarized guidance with citations' }
];
export default function AgentConsole(){
  return (
    <div className="rounded-2xl p-5" style={{ background:'var(--panel)', border:'1px solid var(--border)' }}>
      <h2 className="text-lg font-semibold" style={{ color:'var(--text)' }}>Agent Console</h2>
      <ul className="mt-3 space-y-2">
        {events.map((e,i)=>(
          <li key={i} className="p-3 rounded-xl text-sm" style={{ background:'var(--card)', border:'1px solid var(--border)', color:'var(--muted)' }}>
            <b style={{ color:'var(--text)' }}>{e.step}:</b> {e.detail}
          </li>
        ))}
      </ul>
    </div>
  );
}
