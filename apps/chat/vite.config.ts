import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'chat',
      filename: 'remoteEntry.js',
      exposes: {
        './ChatApp': './src/App',
        './ChatProvider': './src/providers/ChatProvider',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5001,
    cors: true,
  },
});
