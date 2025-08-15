import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standard, clean Vite configuration. No aliases.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5175,
  },
});
