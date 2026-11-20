import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { getDocsResponse } from './server/docs-response.js';
import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';

function docsPreview(): Plugin {
  const serveDocs = (request: IncomingMessage, response: ServerResponse, next: () => void) => {
    if (request.url?.split('?')[0] !== '/api/docs') return next();
    void getDocsResponse(request.method).then(({ status, headers, body }) => {
      response.writeHead(status, headers).end(JSON.stringify(body));
    });
  };
  return {
    name: 'ramisa-docs-preview',
    configureServer(server) { server.middlewares.use(serveDocs); },
    configurePreviewServer(server) { server.middlewares.use(serveDocs); },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), docsPreview()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
