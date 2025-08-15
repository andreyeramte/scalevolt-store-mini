// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh for better development experience
      fastRefresh: true,
      // Optimize JSX for better performance
      jsxRuntime: 'automatic',
    }),
    tailwindcss(),
  ],

  server: {
    host: "localhost",
    port: 5179,
    open: true,
    watch: { 
      usePolling: true,
      // Optimize file watching
      interval: 1000,
    },
    historyApiFallback: true,

    // Performance optimizations
    hmr: {
      overlay: false, // Disable error overlay for better performance
    },

    proxy: {
      '^/api': {
        target: "http://localhost:4242",
        changeOrigin: true,
        secure: false,
        // Add timeout for better performance
        timeout: 10000,
      },
      '^/health': {
        target: "http://localhost:4242",
        changeOrigin: true,
        secure: false,
        timeout: 5000,
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
    
    // Performance optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Enable source maps for debugging (disable in production)
    sourcemap: false,
    
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        // Optimize file naming for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'state-vendor': ['zustand'],
          'i18n-vendor': ['react-i18next', 'i18next'],
        },
      },
    },
    
    // Optimize build performance
    target: 'esnext',
    cssCodeSplit: true,
    reportCompressedSize: false, // Disable for faster builds
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'zustand',
      'react-i18next',
      'i18next',
    ],
    exclude: ['@tailwindcss/vite'],
  },

  // Enable CSS optimizations
  css: {
    devSourcemap: false,
  },

  base: "./",
});