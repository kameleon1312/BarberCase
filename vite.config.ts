import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [
    react(),
    imagetools({
      defaultDirectives: new URLSearchParams('format=webp&quality=80'),
    }),
  ],

  build: {
    // Warn if a chunk exceeds 500 kB (Vite default is 500)
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // Split vendor (react, emailjs) from app code
        manualChunks: {
          react: ['react', 'react-dom'],
          emailjs: ['@emailjs/browser'],
        },
      },
    },
  },
})
