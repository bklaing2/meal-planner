import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [viteReact(), viteTsConfigPaths({ projects: ['./tsconfig.json'] })],
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
        { browser: 'firefox' },
        { browser: 'webkit' },
      ],
    },
    setupFiles: ["./test/setup.tsx"]
  },
})
