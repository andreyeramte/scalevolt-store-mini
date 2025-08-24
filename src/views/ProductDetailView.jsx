import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function ProductDetailView() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/products`)
        if (!res.ok) throw new Error('Failed to load product')
        const all = await res.json()
        const p = all.find((x) => String(x.id) === String(id))
        if (!p) throw new Error('Product not found')
        setProduct(p)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading product...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image placeholder */}
          <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
            <span className="text-gray-400">Product image</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center gap-6 mb-6">
              <span className="text-3xl font-bold text-green-600">${product.price}</span>
              <span className="text-gray-500">SKU: {product.sku}</span>
              <span className="text-gray-500">Stock: {product.stock}</span>
            </div>

            <div className="space-y-2 mb-6">
              <div><span className="text-gray-500">Brand:</span> <span className="font-medium">{product.brand}</span></div>
              <div><span className="text-gray-500">Category:</span> <span className="font-medium capitalize">{product.category.replace('-', ' ')}</span></div>
              {product.dimensions_cm && (
                <div><span className="text-gray-500">Dimensions:</span> <span className="font-medium">{product.dimensions_cm}</span></div>
              )}
              {product.weight_kg && (
                <div><span className="text-gray-500">Weight:</span> <span className="font-medium">{product.weight_kg} kg</span></div>
              )}
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Add to Cart</button>
              <button className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Add to Wishlist</button>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Details</h2>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailView
