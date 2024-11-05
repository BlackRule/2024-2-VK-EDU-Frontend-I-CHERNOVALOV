import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
const c={
  base: '/2024-2-VK-EDU-Frontend-I-Chernovalov',
  plugins: [react()],
  resolve: {
    alias: {
      'components': '/src/components',
      'screens': '/src/screens',
    },
  },
}
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    c.base=''
    return c
  } else {
    // command === 'build'
    return c
  }
})
