// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // keep this if it's working for you
  ],

  server: {
    host: "localhost",
    port: 5177,
    open: true,
    watch: { usePolling: true },

    // ←—— ADD THIS:
    proxy: {
      // proxy /api/* to your backend
      '^/api': {
        target: "http://localhost:3002",
        changeOrigin: true,
        secure: false,
      },
      // if you ever hit /health in dev from the front-end:
      '^/health': {
        target: "http://localhost:3002",
        changeOrigin: true,
        secure: false,
      }
    }
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "~public": path.resolve(__dirname, "public"),
    },
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },

  base: "./",
});