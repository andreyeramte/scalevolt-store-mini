import React, { useMemo } from 'react';

// Mock components - replace with your actual components
const ProductCard = ({ productId, title, price, imageSrc, brand, onClick }) => (
  <div 
    onClick={onClick}
    style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }
    }}
  >
    <img 
      src={imageSrc || '/placeholder-product.jpg'} 
      alt={title}
      style={{
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginBottom: '12px'
      }}
    />
    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
      {title}
    </h3>
    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
      {brand}
    </p>
    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0066cc' }}>
      ${price}
    </p>
  </div>
);

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
  // Get category ID from the route and ensure it's correctly parsed
  const categoryId = 4;
  const store = useProductsStore();
  const cartStore = useCartStore();

  // Filter products by category and add uniqueKey
  const products = useMemo(() => {
    return store.getProducts
      .filter(product => +product.categoryId === categoryId)
      .map(product => ({
        ...product,
        uniqueKey: product.id
      }));
  }, [store.getProducts, categoryId]);

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
        {products.map((product) => (
          <div
            key={product.uniqueKey}
            className="product-card-wrapper"
          >
            {/* Wrap ProductCard to navigate to /product/:id */}
            <ProductCard
              productId={product.id}
              title={getTranslatedProductName(product)}
              price={product.price}
              imageSrc={product.image}
              brand={product.brand}
              onClick={() => handleProductClick(product.id)}
            />
          </div>
        ))}
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