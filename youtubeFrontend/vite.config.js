import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     "/": {
  //       target: "https//localhost:8000",
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => `/api/v1${path}`,
  //     },
  //   },
  // },
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
