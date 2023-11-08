import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 10_000,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'PokeTeamStreamWidget',
      fileName: 'poke-team-stream-widget'
    }
  }
});
