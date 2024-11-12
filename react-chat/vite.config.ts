import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'

// https://vite.dev/config/
const c = {
  base: '/2024-2-VK-EDU-Frontend-I-Chernovalov',
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      'components': '/src/components',
      'screens': '/src/screens',
      '~': '/src',
    },
  }
}
export default defineConfig(({command}) => {
  if (command === 'serve') {
    c.base = ''
    return c
  } else {
    // command === 'build'
    return c
  }
})
