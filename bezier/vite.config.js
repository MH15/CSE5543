

import { defineConfig } from 'vite'
const config = defineConfig({
    // base: "/CSE5543/bezier/dist/",
    build: {
        minify: false,
        brotliSize: false,
        target: "es6",
        polyfillModulePreload: false,
        rollupOptions: {
            output: {

                preserveModules: true,
                // format: 'es',
                entryFileNames: `[name].js`,
                // chunkFileNames: `assets/[name].js`,
                // assetFileNames: `assets/[name].[ext]`,
                manualChunks: undefined
            },

            preserveEntrySignatures: "exports-only"
        }
    },
    esbuild: {
        minify: false
    },
})

export default config