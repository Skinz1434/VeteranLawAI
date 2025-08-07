import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ title, metric, href, children }:{title:string; metric:string; href:string; children:React.ReactNode}) => (
  <div className="rounded-2xl p-5" style={{ background:'var(--panel)', boxShadow:'0 10px 30px rgba(0,0,0,0.35)', border:'1px solid var(--border)' }}>
    <div className="flex items-center justify-between">
      <h3 className="text-base font-medium" style={{ color:'var(--text)' }}>{title}</h3>
      <span className="text-sm" style={{ color:'var(--muted)' }}>{metric}</span>
    </div>
    <div className="mt-3 text-sm" style={{ color:'var(--muted)' }}>{children}</div>
    <Link to={href} className="inline-block mt-4 text-sm underline" style={{ color:'var(--accent)' }}>Open</Link>
  </div>
);

export default function Dashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card title="Camera OCR" metric="12 parsed today" href="/ocr">Drag and drop VA forms -> JSON/PDF export.</Card>
      <Card title="Audio Transcription" metric="5 recordings" href="/transcribe">Upload or record -> entities and timestamps.</Card>
      <Card title="KB Chat" metric="312 refs" href="/kb">Ask questions -> inline citations + open doc.</Card>
      <Card title="Claim Wizard" metric="7 drafts" href="/wizard">Guided steps -> validation -> final summary.</Card>
      <Card title="Analytics" metric="Live demo" href="/analytics">Outcomes and throughput (mocked).</Card>
      <Card title="Agent Console" metric="Tool calls" href="/agent">Show chain-of-events for credibility.</Card>
    </div>
  );
}
