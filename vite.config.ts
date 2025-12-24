import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/compat/app', 'firebase/compat/database', 'firebase/compat/auth', 'firebase/compat/storage', 'firebase/compat/messaging'],
          ui: ['@radix-ui/react-slot', '@radix-ui/react-label', 'lucide-react', 'clsx', 'tailwind-merge'],
          charts: ['recharts', 'chart.js', 'react-chartjs-2'],
          utils: ['date-fns', 'jspdf', 'jspdf-autotable', 'xlsx', 'file-saver'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
