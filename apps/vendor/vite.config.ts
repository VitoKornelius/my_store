import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mercurDashboardPlugin } from '@mercurjs/dashboard-sdk'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['@medusajs/dashboard'],
  },
  plugins: [
    react(),
    mercurDashboardPlugin({
      medusaConfigPath: '../../packages/api/medusa-config.ts',
    }),
    {
      name: 'exclude-medusa-dashboard-prebundle',
      enforce: 'post',
      configResolved(config) {
        config.optimizeDeps.include = config.optimizeDeps.include?.filter(
          (dependency) => dependency !== '@medusajs/dashboard'
        )
      },
    },
  ],
})
