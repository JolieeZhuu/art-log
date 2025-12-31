import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
    assetsDir: "static",   // put JS/CSS into /static folder
    rollupOptions: {
      output: {
        entryFileNames: `js/[name].js`,
        chunkFileNames: `js/[name].js`,
        assetFileNames: `css/[name].[ext]`
      }
    }
  },
    plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
