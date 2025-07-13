import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SliderProductCard = ({ product, region = 'ua' }) => {
  const { t } = useTranslation();

  if (!product) {
    return (
      <div className="slider-product-card bg-white rounded-lg shadow-md p-4 min-h-[200px] flex items-center justify-center">
        <p className="text-gray-500">No product data</p>
      </div>
    );
  }

  const {
    id,
    name,
    price,
    image,
    brand,
    stock = 0,
    discount,
    isNew = false
  } = product;

  return (
    <div className="slider-product-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="relative">
        <Link to={`/${region}/product/${id}`}>
          <img
            src={image || '/api/placeholder/300/200'}
            alt={name}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/api/placeholder/300/200';
            }}
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
              {t('product.new', 'New')}
            </span>
          )}
          {discount && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
        </div>
        
        {/* Stock indicator */}
        <div className="absolute top-2 right-2">
          {stock > 0 ? (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              {t('product.in_stock', 'In Stock')}
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
              {t('product.out_of_stock', 'Out of Stock')}
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <p className="text-sm text-gray-500 mb-1">{brand}</p>
          <Link 
            to={`/${region}/product/${id}`}
            className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
          >
            {name}
          </Link>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {price} ₴
            </span>
            {discount && (
              <span className="text-sm text-gray-500 line-through">
                {Math.round(price * (1 + discount / 100))} ₴
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={stock <= 0}
        >
          {stock > 0 ? t('product.add_to_cart', 'Add to Cart') : t('product.out_of_stock', 'Out of Stock')}
        </button>
      </div>
    </div>
  );
};

export default SliderProductCard; 