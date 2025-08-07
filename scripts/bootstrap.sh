\
#!/usr/bin/env bash
set -euo pipefail

echo "GPT-5 Overhaul Bootstrap"

touch .env
grep -q VITE_DEMO_MODE .env || echo "VITE_DEMO_MODE=true" >> .env

npm i -D typescript @types/node vite-plugin-checker eslint prettier \
  @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  vitest @testing-library/react @testing-library/user-event \
  playwright @playwright/test msw @mswjs/data

npm i class-variance-authority clsx tailwind-merge framer-motion \
  @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-tooltip \
  @tanstack/react-query zod recharts ai \
  @vercel/analytics @vercel/speed-insights

npx -y tsc --init --jsx react-jsx --allowJs true --checkJs true --skipLibCheck true || true

mkdir -p src/{pages,components/{layout,ui,tools},mocks,data,lib,styles}

cat > src/lib/demo.ts <<'TS'
export const isDemo = () => import.meta.env.VITE_DEMO_MODE === 'true';
TS

cat > src/styles/tokens.css <<'CSS'
:root { --bg:#0b0f1a; --panel:#121a2a; --panel-hi:#1a2340; --text:#dfe7ff; --muted:#9bb0ff; --accent:#7aa2ff; --ring:#89b4ff; --card:#0f1626; --border:rgba(255,255,255,0.08); }
* { scrollbar-width: thin; scrollbar-color: var(--accent) transparent; }
body { background: #0b0f1a; color: var(--text); }
CSS

cat > src/mocks/browser.ts <<'TS'
import { setupWorker } from 'msw';
import { handlers } from './handlers';
export const worker = setupWorker(...handlers);
TS

cat > src/mocks/handlers.ts <<'TS'
import { http, HttpResponse } from 'msw';
import { fixtures } from '../data/fixtures';
export const handlers = [
  http.post('/api/ocr', async () => HttpResponse.json(fixtures.ocrSample)),
  http.post('/api/transcribe', async () => HttpResponse.json(fixtures.transcriptSample)),
  http.post('/api/kb/search', async () => HttpResponse.json(fixtures.kbResults)),
  http.post('/api/claim/summary', async ({ request }) => {
    const body = await request.json().catch(()=>({}));
    return HttpResponse.json({ ok:true, summary:`Claim draft for ${body?.veteranName ?? 'Veteran'} created.` });
  }),
];
TS

cat > src/data/fixtures.ts <<'TS'
export const fixtures = {
  ocrSample: {
    form: 'VA Form 21-526EZ',
    fields: {
      veteranName: 'John Q. Example',
      fileNumber: '123456789',
      serviceBranch: 'US Army',
      conditionClaimed: 'Left knee osteoarthritis',
      onsetDate: '2009-05-14'
    }
  },
  transcriptSample: {
    text: 'Veteran reports chronic knee pain since 2009 after airborne training; pain worsened with activity. Uses brace; imaging shows osteophytes.',
    words: [],
    entities: [
      { type:'Condition', text:'knee pain' },
      { type:'Date', text:'2009' },
      { type:'Activity', text:'airborne training' }
    ]
  },
  kbResults: [
    { id: 'm21-1-v-iii-1', title: 'M21-1, Part V, Subpart iii, Chapter 1', snippet: 'Establishing service connection requires...'},
    { id: 'm21-1-v-iii-2', title: 'M21-1, Part V, Subpart iii, Chapter 2', snippet: 'When evaluating musculoskeletal conditions...'}
  ]
};
TS

cat > src/components/layout/AppShell.tsx <<'TSX'
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
TSX
