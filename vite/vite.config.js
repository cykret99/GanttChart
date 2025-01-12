import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build:{
    outDir: '../src/main/resources/static',
    rollupOptions:{
      input:{
        'scripts/main':'./src/main.js'
      },
      output:{
        entryFileNames:'js/main.bundle.js',
        assetFileNames:'css/main.bundle.css'
      },
    },
  },
});

