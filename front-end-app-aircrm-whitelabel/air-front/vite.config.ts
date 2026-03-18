import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import fs from 'fs'
import path from 'path'

const useHttps = process.env.VITE_DEV_HTTPS !== 'false'
const apiProxyTarget = process.env.VITE_DEV_API_PROXY_TARGET || 'http://127.0.0.1:8000'

const COPYRIGHT_BANNER = `/*!
 * AIR Ecosystem — Store Management Platform (AIR Dashboard)
 * Copyright (c) 2024–2026 AIR Ecosystem. All Rights Reserved.
 * Proprietary and confidential — do not copy, modify, or distribute.
 * https://air-ecosystem.com
 */`

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgr({
      include: './public/**/*.svg?react',
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        banner: COPYRIGHT_BANNER,
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['react-query'],
          'vendor-mui': [
            '@mui/material',
            '@mui/system',
            '@mui/icons-material',
            '@mui/lab',
            '@mui/x-data-grid',
            '@mui/x-date-pickers',
          ],
          'vendor-mui-charts': ['@mui/x-charts'],
          'vendor-utils': ['axios', 'axios-retry', 'dayjs', 'zustand'],
        },
      },
    },
  },
  server: {
    https: useHttps
      ? {
          key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem')),
          cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.pem')),
        }
      : false,
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
