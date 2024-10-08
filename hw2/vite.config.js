import {resolve} from 'path'
import {defineConfig} from 'vite'

export default defineConfig({
    root: resolve(__dirname, './src'),
    build: {
    minify: false, // Disable minification
    sourcemap: true, // Enable source maps
    rollupOptions: {
        preserveEntrySignatures: true,
      output: {
        // Preserve module structure similar to dev mode
        preserveModules: true,
        // manualChunks: {}, // Disable code splitting
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true, // If you have mixed modules (optional)
    },
  },
})