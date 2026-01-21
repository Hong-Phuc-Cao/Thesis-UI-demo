import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
    resolve: {
    // Cấu hình ký tự @ 
    alias: {
      '@': path.resolve(__dirname, './src'), // Cấu hình @ → src/
    },
  },
  base: '/Thesis-UI-demo/'
})





