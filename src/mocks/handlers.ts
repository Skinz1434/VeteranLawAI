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
