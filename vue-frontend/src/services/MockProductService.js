// vue-frontend/src/services/mockProductService.js
import mockProducts from '@/data/mockProducts.js';

export async function fetchProducts() {
  // In reality this would be an axios call.
  // Here, we just return the array so the UI can render.
  return mockProducts;
}

export async function fetchProductById(id) {
  return mockProducts.find(p => p.id === Number(id));
}
