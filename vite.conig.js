import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/main.js'),
      name: 'Yale Component Library',
      fileName: 'yale-ui-cl',
    },
	rollupOptions: {
	      output: {
	        entryFileNames: `assets/[name].js`,
	        chunkFileNames: `assets/[name].js`,
	        assetFileNames: `assets/[name].[ext]`
	      },
  },
})