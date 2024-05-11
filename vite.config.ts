import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [sveltekit(), SvelteKitPWA({
    srcDir: './src',
    mode: 'development',
    scope: '/',
    base: '/',
    selfDestroying: true,
    pwaAssets: {
      config: true,
    },
    manifest: {
      short_name: 'Meal Planner',
      name: 'Meal Planner',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      theme_color: "#ffffff",
      background_color: "#ffffff"
    },
    injectManifest: {
      globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
    },
    workbox: {
      globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
    },
    devOptions: {
      enabled: true,
      suppressWarnings: false,
      type: 'module',
      navigateFallback: '/',
    },
    // if you have shared info in svelte config file put in a separate module and use it also here
    // kit: {
    //   includeVersionFile: true,
    // }




    // registerType: 'prompt',
    // injectRegister: false,
    //
    // pwaAssets: {
    //   disabled: false,
    //   config: true,
    // },

  })],
})
