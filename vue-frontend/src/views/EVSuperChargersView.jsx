import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const EVSuperChargersView = () => {
  const { t } = useTranslation();
  const { region } = useParams();
  const currentRegion = region || 'ua';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate loading products
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Mock data for EV Super Chargers
        const mockProducts = [
          {
            id: 1,
            name: t('products.ev_super_charger_350kw', 'EV Super Charger 350kW'),
            price: 45000,
            image: '/api/placeholder/300/200',
            brand: 'ScaleVolt',
            stock: 5,
            category: 'ev-super-chargers',
            power: '350kW',
            voltage: '800V',
            connector: 'CCS'
          },
          {
            id: 2,
            name: t('products.ev_super_charger_250kw', 'EV Super Charger 250kW'),
            price: 35000,
            image: '/api/placeholder/300/200',
            brand: 'ScaleVolt',
            stock: 8,
            category: 'ev-super-chargers',
            power: '250kW',
            voltage: '800V',
            connector: 'CCS'
          },
          {
            id: 3,
            name: t('products.ev_super_charger_150kw', 'EV Super Charger 150kW'),
            price: 25000,
            image: '/api/placeholder/300/200',
            brand: 'ScaleVolt',
            stock: 12,
            category: 'ev-super-chargers',
            power: '150kW',
            voltage: '400V',
            connector: 'CCS'
          }
        ];
        
        setProducts(mockProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [t]);

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    if (filter === 'in-stock') return product.stock > 0;
    if (filter === 'high-power') return product.power && parseInt(product.power) >= 250;
    return true;
  });

  if (loading) {
    return (
      <div className="ev-super-chargers-view min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('common.loading', 'Loading...')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ev-super-chargers-view min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('categories.ev_super_chargers', 'EV Super Chargers')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('categories.ev_super_chargers_description', 'High-power electric vehicle super chargers for fast charging stations')}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('filters.all', 'All')}
            </button>
            <button
              onClick={() => setFilter('in-stock')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'in-stock' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('filters.in_stock', 'In Stock')}
            </button>
            <button
              onClick={() => setFilter('high-power')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'high-power' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('filters.high_power', 'High Power (250kW+)')}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/300/200';
                  }}
                />
                {product.stock > 0 ? (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    {t('product.in_stock', 'In Stock')}
                  </span>
                ) : (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {t('product.out_of_stock', 'Out of Stock')}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                
                {/* Specifications */}
                <div className="space-y-1 mb-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{t('product.power', 'Power')}:</span> {product.power}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{t('product.voltage', 'Voltage')}:</span> {product.voltage}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{t('product.connector', 'Connector')}:</span> {product.connector}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-gray-900">{product.price} ₴</span>
                </div>

                {/* Add to Cart Button */}
                <button
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 
                    ? t('product.add_to_cart', 'Add to Cart') 
                    : t('product.out_of_stock', 'Out of Stock')
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('common.no_products_found', 'No products found')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EVSuperChargersView; 