import path from "path"
import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    reactRouter(),
    tailwindcss(),
    federation({
      name: 'host',
      remotes: {
        chat: 'http://localhost:5001/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
