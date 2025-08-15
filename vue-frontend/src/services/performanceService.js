// FILE: src/services/performanceService.js
// Performance optimization service for better website speed

class PerformanceService {
  constructor() {
    this.cache = new Map();
    this.imageCache = new Map();
    this.apiCache = new Map();
    this.initialized = false;
  }

  // Initialize performance optimizations
  initialize() {
    if (this.initialized) return;
    
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Optimize images
    this.optimizeImages();
    
    // Setup intersection observer for lazy loading
    this.setupLazyLoading();
    
    // Setup service worker for caching
    this.setupServiceWorker();
    
    this.initialized = true;
    console.log('🚀 Performance optimizations initialized');
  }

  // Preload critical resources
  preloadCriticalResources() {
    const criticalResources = [
      '/images/header/scalevolt-logo.png',
      '/images/header/profile-logo.svg',
      '/images/header/cart.svg'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = resource.endsWith('.png') ? 'image' : 'image';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  // Optimize images with lazy loading
  optimizeImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Setup lazy loading for components
  setupLazyLoading() {
    // Lazy load non-critical components
    const lazyComponents = document.querySelectorAll('[data-lazy]');
    
    const componentObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const component = entry.target;
          this.loadComponent(component.dataset.lazy);
          observer.unobserve(component);
        }
      });
    });

    lazyComponents.forEach(component => componentObserver.observe(component));
  }

  // Load component dynamically
  async loadComponent(componentName) {
    try {
      const module = await import(`../components/${componentName}`);
      return module.default;
    } catch (error) {
      console.error(`Failed to load component: ${componentName}`, error);
    }
  }

  // Setup service worker for caching
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }

  // API caching with TTL
  async cachedApiCall(url, options = {}, ttl = 5 * 60 * 1000) { // 5 minutes default
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    const cached = this.apiCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      this.apiCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for performance
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Optimize search with debouncing
  debouncedSearch = this.debounce(async (query, callback) => {
    try {
      const results = await this.cachedApiCall(`/api/products/search?q=${query}`);
      callback(results);
    } catch (error) {
      console.error('Search failed:', error);
      callback([]);
    }
  }, 300);

  // Optimize scroll events
  throttledScroll = this.throttle((callback) => {
    callback();
  }, 16); // ~60fps

  // Optimize resize events
  throttledResize = this.throttle((callback) => {
    callback();
  }, 250);

  // Preload route for faster navigation
  preloadRoute(route) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  }

  // Optimize images with WebP support
  getOptimizedImageUrl(originalUrl, width = 800) {
    if (!originalUrl) return '';
    
    // Check if WebP is supported
    const supportsWebP = document.createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0;
    
    if (supportsWebP) {
      return `${originalUrl}?format=webp&w=${width}`;
    }
    
    return `${originalUrl}?w=${width}`;
  }

  // Memory management
  clearOldCache() {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes
    
    // Clear old API cache
    for (const [key, value] of this.apiCache.entries()) {
      if (now - value.timestamp > maxAge) {
        this.apiCache.delete(key);
      }
    }
    
    // Clear old image cache
    for (const [key, value] of this.imageCache.entries()) {
      if (now - value.timestamp > maxAge) {
        this.imageCache.delete(key);
      }
    }
  }

  // Performance monitoring
  measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    return result;
  }

  // Optimize bundle size
  async loadChunk(chunkName) {
    try {
      const chunk = await import(/* webpackChunkName: "[request]" */ `../chunks/${chunkName}`);
      return chunk.default;
    } catch (error) {
      console.error(`Failed to load chunk: ${chunkName}`, error);
    }
  }

  // Setup performance monitoring
  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`${entry.name}: ${entry.value}`);
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
  }

  // Optimize CSS delivery
  optimizeCSSDelivery() {
    // Inline critical CSS
    const criticalCSS = `
      /* Critical CSS for above-the-fold content */
      .header { display: flex; }
      .main-content { display: block; }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }

  // Cleanup on page unload
  cleanup() {
    this.clearOldCache();
    this.cache.clear();
  }
}

// Create singleton instance
const performanceService = new PerformanceService();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    performanceService.initialize();
  });
} else {
  performanceService.initialize();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  performanceService.cleanup();
});

export default performanceService; 