import { create } from 'zustand';

const useProductsStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  filters: {
    category: '',
    search: '',
    priceRange: { min: 0, max: 100000 },
    inStock: false
  },

  // Actions
  setProducts: (products) => set({ products }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  
  clearFilters: () => set({ 
    filters: {
      category: '',
      search: '',
      priceRange: { min: 0, max: 100000 },
      inStock: false
    }
  }),

  // Computed getters
  getProducts: () => {
    const { products, filters } = get();
    let filteredProducts = [...products];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category === filters.category
      );
    }

    // Apply price range filter
    filteredProducts = filteredProducts.filter(product => 
      product.price >= filters.priceRange.min && 
      product.price <= filters.priceRange.max
    );

    // Apply stock filter
    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(product => 
        product.stock > 0
      );
    }

    return filteredProducts;
  },

  getProductById: (id) => {
    const { products } = get();
    return products.find(product => product.id === id);
  },

  getProductsByCategory: (category) => {
    const { products } = get();
    return products.filter(product => product.category === category);
  },

  // Async actions
  fetchProducts: async () => {
    // Check if we're already loading to prevent multiple calls
    const { loading } = get();
    if (loading) {
      console.log('🔄 Already loading products, skipping...');
      return;
    }

    console.log('🔄 Starting to fetch products...');
    set({ loading: true, error: null });
    
    try {
      console.log('📡 Making API call to http://localhost:3002/api/products');
      const response = await fetch('http://localhost:3002/api/products');
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const products = await response.json();
      console.log('✅ Products fetched successfully:', products.length, 'products');
      console.log('📦 First product:', products[0]);
      
      // Add default images for products that don't have them
      const productsWithImages = products.map(product => ({
        ...product,
        image: product.image || `/api/placeholder/300/200?text=${encodeURIComponent(product.name)}`
      }));
      
      console.log('🎨 Products with images:', productsWithImages.length);
      set({ products: productsWithImages, loading: false });
      console.log('✅ Products store updated successfully');
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      set({ error: error.message || 'Failed to fetch products', loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3002/api/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const product = await response.json();
      
      // Add default image if product doesn't have one
      const productWithImage = {
        ...product,
        image: product.image || `/api/placeholder/300/200?text=${encodeURIComponent(product.name)}`
      };
      
      set({ loading: false });
      return productWithImage;
    } catch (error) {
      console.error('Error fetching product:', error);
      set({ error: error.message || 'Failed to fetch product', loading: false });
      return null;
    }
  }
}));

export default useProductsStore;