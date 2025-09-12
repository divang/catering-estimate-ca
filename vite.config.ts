import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const projectRoot = process.env.PROJECT_ROOT || fileURLToPath(new URL('.', import.meta.url))

// Production config for external deployment (Azure, Netlify, etc.)
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
      // Map specific spark hooks to mock implementation
      '@github/spark/hooks': resolve(projectRoot, 'src/lib/mock-spark-hooks.ts'),
      // Ensure any other imports of the Spark package resolve to the local packaged build
      // so CI / external deployments don't try to import from node_modules/@github/spark
      '@github/spark': resolve(projectRoot, 'packages/spark-tools/dist/index.js'),
    }
  },
  define: {
    // Define global spark object as mock for production builds
    'window.spark': 'globalThis.spark'
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
        }
      }
    }
  },
});
