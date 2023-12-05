/* eslint-disable import/no-default-export */
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import vitePluginFaviconsInject from 'vite-plugin-favicons-inject';
import tsconfigPaths from 'vite-tsconfig-paths';
import pkg from './package.json' assert { type: 'json' };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    basicSsl(),
    react(),
    tsconfigPaths(),
    process.env.NODE_ENV == 'production'
      ? vitePluginFaviconsInject('./src/assets/icon.png', {
          appName: 'PokeTeamStream',
          appDescription: '',
          developerName: pkg.author.name,
          developerURL: pkg.author.url
        })
      : false
  ],
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
