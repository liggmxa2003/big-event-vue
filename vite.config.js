import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  //配置代理
  server: {
    proxy: {
      '/api': { //获取路径中包含api的请求
        target: 'http://localhost:8081', //后台服务所在的源
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 将路径中的api替换为空
      }
    }
  }
})
