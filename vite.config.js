import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Manual chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // React vendor bundle (changes rarely)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI components vendor bundle
          'ui-vendor': ['lucide-react'],
          // Helmet vendor (for SEO)
          'seo-vendor': ['react-helmet']
        }
      }
    },
    // Minification settings (using default esbuild - faster and included)
    minify: 'esbuild',
    // Remove console.logs in production
    esbuild: {
      drop: ['console', 'debugger']
    },
    // Increase chunk size warning limit (we're code splitting properly now)
    chunkSizeWarningLimit: 600,
    // Enable CSS code splitting
    cssCodeSplit: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react']
  }
})
