import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { env } from 'node:process';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  base: env.BASE_PATH || '/',
  integrations: [react()],
  server: { host: '127.0.0.1', port: 5173 },
});
