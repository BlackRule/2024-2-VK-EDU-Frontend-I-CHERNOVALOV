import basicSsl from '@vitejs/plugin-basic-ssl'
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
  },
  server:{
    host: true
  },

}
export default defineConfig(({command}) => {
  if (command === 'serve') {
    c.base = ''
    // @ts-expect-error
    c.plugins.push(basicSsl())
    return c
  } else {
    // command === 'build'
    return c
  }
})
