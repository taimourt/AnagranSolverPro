import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        es: resolve(__dirname, 'es/index.html'),
        fr: resolve(__dirname, 'fr/index.html'),
        de: resolve(__dirname, 'de/index.html'),
        it: resolve(__dirname, 'it/index.html'),
        pt: resolve(__dirname, 'pt/index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        disclaimer: resolve(__dirname, 'disclaimer.html'),
        cookies: resolve(__dirname, 'cookies.html')
      }
    }
  }
});
