import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProductCard from '../../../components/Product/ProductCard';

// Mock components - replace with your actual components
const Breadcrumb = ({ breadcrumbs, className }) => (
  <nav className={className}>
    <ol style={{ 
      display: 'flex', 
      listStyle: 'none', 
      padding: 0, 
      margin: 0,
      fontSize: '14px',
      color: '#666'
    }}>
      {breadcrumbs.map((crumb, index) => (
        <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
          {crumb.link ? (
            <a 
              href={crumb.link}
              style={{ 
                color: '#0066cc', 
                textDecoration: 'none',
                ':hover': { textDecoration: 'underline' }
              }}
              onClick={(e) => {
                e.preventDefault();
                // Replace with your actual navigation logic
                console.log('Navigate to:', crumb.link);
              }}
            >
              {crumb.name}
            </a>
          ) : (
            <span style={{ color: '#333' }}>{crumb.name}</span>
          )}
          {index < breadcrumbs.length - 1 && (
            <span style={{ margin: '0 8px', color: '#999' }}>/</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

// Mock translation function - replace with your actual i18n solution
const t = (key, defaultName) => {
  const translations = {
    'product.solarset.residential': 'Residential Solar Kit',
    'product.solarset.commercial': 'Commercial Solar System',
    'product.solarset.offgrid': 'Off-Grid Solar Package',
    'product.solarset.hybrid': 'Hybrid Solar System'
  };
  return translations[key] || defaultName || key;
};

// Mock stores - replace with your actual state management
const useProductsStore = () => ({
  getProducts: [
    {
      id: 1,
      categoryId: 4,
      nameKey: 'product.solarset.residential',
      defaultName: '5kW Complete Home Kit',
      price: 4999.99,
      image: '/api/placeholder/300/200',
      brand: 'SolarHome Pro'
    },
    {
      id: 2,
      categoryId: 4,
      nameKey: 'product.solarset.commercial',
      defaultName: '50kW Business System',
      price: 35999.99,
      image: '/api/placeholder/300/200',
      brand: 'CommercialSolar'
    },
    {
      id: 3,
      categoryId: 4,
      nameKey: 'product.solarset.offgrid',
      defaultName: '3kW Off-Grid Package',
      price: 3499.99,
      image: '/api/placeholder/300/200',
      brand: 'OffGrid Solutions'
    },
    {
      id: 4,
      categoryId: 4,
      nameKey: 'product.solarset.hybrid',
      defaultName: '8kW Hybrid System',
      price: 7999.99,
      image: '/api/placeholder/300/200',
      brand: 'HybridTech'
    }
  ]
});

const useCartStore = () => ({
  // Mock cart store methods
  addToCart: (product) => console.log('Added to cart:', product)
});

const SolarSets = () => {
  const location = useLocation();
  const region = location.pathname.split('/')[1] || 'ua';
  const store = useProductsStore();
  const cartStore = useCartStore();

  // Filter products by category and add uniqueKey
  const products = useMemo(() => {
    return store.getProducts
      .filter(product => +product.categoryId === 4) // Assuming categoryId 4 is SolarSets
      .map(product => ({
        ...product,
        uniqueKey: product.id
      }));
  }, [store.getProducts]);

  // Get translated product name based on current locale
  const getTranslatedProductName = (product) => {
    return t(product.nameKey, product.defaultName);
  };

  // Define breadcrumbs
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Каталог", link: "/catalogue" },
    { name: "SolarSets" },
  ];

  const pageTitle = "SolarSets";

  const handleProductClick = (productId) => {
    // Replace with your actual navigation logic
    console.log('Navigate to product:', productId);
    // For React Router: navigate(`/product/${productId}`);
  };

  return (
    <div className="catalogue-view">
      {/* Breadcrumb Component with same design classes */}
      <Breadcrumb breadcrumbs={breadcrumbs} className="breadcrumb-spacing" />

      <h1>{pageTitle}</h1>

      {/* Product Listing */}
      <div className="products-container">
        {products.map((product) => {
          const imageSrc = product.image || '/images/placeholder.png';
          return (
            <div
              key={product.uniqueKey}
              className="product-card-wrapper"
            >
              <Link to={`/${region}/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ProductCard
                  productId={product.id}
                  title={getTranslatedProductName(product)}
                  price={product.price}
                  imageSrc={imageSrc}
                  brand={product.brand}
                  region={region}
                  // Add other props as needed
                />
              </Link>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          max-width: 1200px;
          margin: 2rem auto;
          padding: 20px;
        }

        .catalogue-view {
          padding-top: 120px; /* Header height + 10px buffer */
          margin-top: 0 !important;
        }

        .products-container {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 15px;
          padding: 20px;
          background-color: #f9fafb;
        }

        .breadcrumb-spacing {
          margin-bottom: 1rem;
          padding: 0 20px;
        }

        .product-card-wrapper {
          transition: transform 0.2s ease;
        }

        .product-card-wrapper:hover {
          transform: translateY(-2px);
        }

        h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
          margin: 0 0 20px 0;
          padding: 0 20px;
        }

        .product-item {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }

        .product-header {
          position: relative;
          padding: 1rem;
          background: #f8f9fa;
        }

        .product-checkbox {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 2;
          transform: scale(1.2);
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: contain;
          display: block;
        }

        .product-details {
          padding: 1rem;
        }

        .brand {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .product-title {
          font-size: 1.1rem;
          margin: 0.5rem 0;
          color: #333;
        }

        .price {
          font-size: 1.2rem;
          font-weight: bold;
          color: #2c3e50;
          margin: 1rem 0;
        }

        .add-to-cart {
          width: 100%;
          padding: 0.8rem;
          background-color: #42b983;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .add-to-cart:hover {
          background-color: #359c6d;
        }

        @media (max-width: 1200px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .products-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 992px) {
          .products-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .products-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SolarSets;