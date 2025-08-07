import React from 'react';
import { Link } from 'react-router-dom';
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="sticky top-0 z-50 border-b" style={{ borderColor:'var(--border)' }}>
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
          <div className="text-lg font-semibold tracking-wide" style={{ color:'var(--text)' }}>VeteranLawAI</div>
          <nav className="flex items-center gap-4 text-sm" style={{ color:'var(--muted)' }}>
            <Link to="/">Dashboard</Link>
            <Link to="/ocr">OCR</Link>
            <Link to="/transcribe">Transcribe</Link>
            <Link to="/kb">KB Chat</Link>
            <Link to="/wizard">Claim Wizard</Link>
            <Link to="/analytics">Analytics</Link>
            <Link to="/agent">Agent Console</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
