import create from 'zustand';

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
    set({ loading: true, error: null });
    try {
      // TODO: Replace with real API call
      const mockProducts = [
        {
          id: 1,
          name: 'Solar Panel 100W',
          description: 'High efficiency solar panel',
          price: 150,
          category: 'solar-panels',
          brand: 'ScaleVolt',
          stock: 10,
          image: '/images/solar-panel-1.jpg'
        },
        {
          id: 2,
          name: 'Battery Pack 24V',
          description: 'Lithium battery pack',
          price: 200,
          category: 'batteries',
          brand: 'ScaleVolt',
          stock: 5,
          image: '/images/battery-1.jpg'
        },
        {
          id: 3,
          name: 'Inverter 1000W',
          description: 'Pure sine wave inverter',
          price: 300,
          category: 'inverters',
          brand: 'ScaleVolt',
          stock: 8,
          image: '/images/inverter-1.jpg'
        }
      ];
      
      set({ products: mockProducts, loading: false });
    } catch (error) {
      set({ error: error.message || 'Failed to fetch products', loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      // TODO: Replace with real API call
      const product = get().getProductById(id);
      if (product) {
        set({ loading: false });
        return product;
      } else {
        set({ error: 'Product not found', loading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message || 'Failed to fetch product', loading: false });
      return null;
    }
  }
}));

export default useProductsStore;