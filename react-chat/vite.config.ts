import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'

// https://vite.dev/config/
const c = {
  base: '/2024-2-VK-EDU-Frontend-I-Chernovalov',
  plugins: [react()],
  resolve: {
    alias: {
      '~': '/src',
      'components': '/src/components',
      'screens': '/src/screens',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
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
