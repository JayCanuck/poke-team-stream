/* eslint-disable import/no-default-export */
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 10_000,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PokeTeamStreamWidget',
      fileName: 'poke-team-stream-widget'
    }
  }
});
