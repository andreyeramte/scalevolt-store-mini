import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Heart, Eye } from 'lucide-react';

const ProductGrid = ({ products, loading, title, subtitle }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const region = location.pathname.split('/')[1] || 'ua';

  const formatPrice = (price, currency = 'UAH') => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleProductClick = (product) => {
    navigate(`/${region}/product/${product.id}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', product);
  };

  const handleAddToWishlist = (e, product) => {
    e.stopPropagation();
    // TODO: Implement wishlist functionality
    console.log('Adding to wishlist:', product);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e3e3e3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p style={{ color: '#666' }}>{t('common.loading', 'Loading products...')}</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={{ 
        padding: '60px 20px', 
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        margin: '20px 0'
      }}>
        <h3 style={{ color: '#333', marginBottom: '10px' }}>
          {t('products.noProducts', 'No products found')}
        </h3>
        <p style={{ color: '#666' }}>
          {t('products.noProductsDescription', 'We couldn\'t find any products in this category.')}
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 15px' }}>
      {/* Header */}
      {(title || subtitle) && (
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          {title && (
            <h1 style={{ 
              fontSize: '2rem', 
              color: '#333', 
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#666',
              marginBottom: '20px'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '25px',
        marginBottom: '40px'
      }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
            onClick={() => handleProductClick(product)}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            {/* Product Image */}
            <div style={{
              position: 'relative',
              height: '200px',
              backgroundColor: '#f8f9fa',
              overflow: 'hidden'
            }}>
              <img
                src={product.image || '/images/placeholder-product.jpg'}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
                onError={(e) => {
                  e.target.src = '/images/placeholder-product.jpg';
                }}
              />
              
              {/* Action Buttons */}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <button
                  onClick={(e) => handleAddToWishlist(e, product)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '35px',
                    height: '35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <Heart size={16} color="#666" />
                </button>
                
                <button
                  onClick={(e) => handleProductClick(product)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '35px',
                    height: '35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <Eye size={16} color="#666" />
                </button>
              </div>

              {/* Stock Badge */}
              {product.stock > 0 ? (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {t('product.inStock', 'In Stock')}
                </div>
              ) : (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {t('product.outOfStock', 'Out of Stock')}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div style={{ padding: '20px' }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px',
                lineHeight: '1.3'
              }}>
                {product.name}
              </h3>
              
              <p style={{
                color: '#666',
                fontSize: '0.9rem',
                marginBottom: '15px',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {product.description}
              </p>

              {/* Price and Add to Cart */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '15px'
              }}>
                <div>
                  <span style={{
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    color: '#007bff'
                  }}>
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#999',
                      textDecoration: 'line-through',
                      marginLeft: '8px'
                    }}>
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={product.stock === 0}
                  style={{
                    backgroundColor: product.stock > 0 ? '#007bff' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (product.stock > 0) {
                      e.target.style.backgroundColor = '#0056b3';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (product.stock > 0) {
                      e.target.style.backgroundColor = '#007bff';
                    }
                  }}
                >
                  <ShoppingCart size={16} />
                  {t('product.addToCart', 'Add to Cart')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid; 