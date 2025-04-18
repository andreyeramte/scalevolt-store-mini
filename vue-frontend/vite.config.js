import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss(), ],

  server: {
    host: "localhost",
    port: 5177, // Changed from 5176 to 5177
    open: true,
    // Removed strictPort: true to allow Vite to find an available port
    watch: {
      usePolling: true,
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "~public": path.resolve(__dirname, "public"),
    },
  },

  // To this:
  build: {
    outDir: "dist", // Changed to use local 'dist' folder
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
