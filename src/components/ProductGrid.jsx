import React from 'react'
import ProductCard from './ProductCard'

function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No products available</div>
      </div>
    )
  }

  return (
    <div id="products" className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Our Products
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductGrid
