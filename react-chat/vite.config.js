import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
const c={
  plugins: [react()],
  base: "/2024-2-VK-EDU-Frontend-I-Chernovalov",
  resolve: {
    alias: {
      'screens': '/src/screens',
      'components': '/src/components',
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
