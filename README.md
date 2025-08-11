VeteranLawAI — Enterprise UI/UX + Feature Structure

Quickstart
- npm ci
- npm run dev (or npm run build && npm run preview)

Deploy (Vercel)
- Framework: Vite
- Install: npm ci
- Build: npm run build
- Output: dist

Structure
- src/shared/ui: reusable UI primitives (Button, Card, Input, Modal, LoadingOverlay, Tabs, Tooltip, SectionHeader, PageShell)
- src/features/*: facades mapping to existing tool components for gradual migration
- src/components/tools/*: current tools (Audio, OCR, Legal Knowledge, Case Research, Claim Guidance, Analytics)

Design system highlights
- Subtle textures, thin gradient outlines, consistent shadows, hover glows
- Reduced-motion support and screen reader announcements
- Consistent overlay loaders and Suspense fallbacks

Roadmap
- Move each tool under src/features/{tool}/components|hooks|services
- Unify Tabs/PageShell usage across all tools
- Add screenshots and per-tool docs, with usage tips and keyboard shortcuts
