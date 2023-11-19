/* eslint-disable import/no-default-export */
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [basicSsl(), react(), tsconfigPaths()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 10_000
  },
  resolve: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc'
    }
  },
  server: {
    open: true
  }
});
