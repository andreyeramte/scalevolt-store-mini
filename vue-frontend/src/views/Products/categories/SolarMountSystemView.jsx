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
    'product.mount.roof': 'Roof Mount System',
    'product.mount.ground': 'Ground Mount System',
    'product.mount.carport': 'Carport Mount System',
    'product.mount.tracker': 'Solar Tracker Mount'
  };
  return translations[key] || defaultName || key;
};

// Mock stores - replace with your actual state management
const useProductsStore = () => ({
  getProducts: [
    {
      id: 1,
      categoryId: 5,
      nameKey: 'product.mount.roof',
      defaultName: 'Roof Mount Kit Standard',
      price: 299.99,
      image: '/api/placeholder/300/200',
      brand: 'SolarMount Pro'
    },
    {
      id: 2,
      categoryId: 5,
      nameKey: 'product.mount.ground',
      defaultName: 'Ground Mount System',
      price: 599.99,
      image: '/api/placeholder/300/200',
      brand: 'TerraMount'
    },
    {
      id: 3,
      categoryId: 5,
      nameKey: 'product.mount.carport',
      defaultName: 'Carport Mount Structure',
      price: 1299.99,
      image: '/api/placeholder/300/200',
      brand: 'CarSolar'
    },
    {
      id: 4,
      categoryId: 5,
      nameKey: 'product.mount.tracker',
      defaultName: 'Single Axis Tracker',
      price: 2199.99,
      image: '/api/placeholder/300/200',
      brand: 'TrackerTech'
    }
  ]
});

const useCartStore = () => ({
  // Mock cart store methods
  addToCart: (product) => console.log('Added to cart:', product)
});

const SolarMountSystem = () => {
  const location = useLocation();
  const region = location.pathname.split('/')[1] || 'ua';
  const categoryId = 5;
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
    { name: "Система монтажу сонячних панелей" },
  ];

  const pageTitle = "Система монтажу сонячних панелей";

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
            <Link to={`/${region}/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ProductCard
                productId={product.id}
                title={getTranslatedProductName(product)}
                price={product.price}
                imageSrc={product.image}
                brand={product.brand}
                region={region}
                // Add other props as needed
              />
            </Link>
          </div>
        ))}
      </div>

      <style jsx>{`
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

        /* Same class used in Breadcrumb.vue for consistent spacing */
        .breadcrumb-spacing {
          margin-bottom: 1rem;
          padding: 0 20px;
          /* margin-top: 1rem; /* If you want additional top spacing above the breadcrumb */
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

        /* Responsive styles */
        @media (max-width: 1600px) {
          .products-container {
            grid-template-columns: repeat(5, 1fr); /* Five columns */
          }
        }

        @media (max-width: 1200px) {
          .products-container {
            grid-template-columns: repeat(3, 1fr); /* Three columns */
          }
        }

        @media (max-width: 992px) {
          .products-container {
            grid-template-columns: repeat(2, 1fr); /* Two columns */
          }
        }

        @media (max-width: 600px) {
          .products-container {
            grid-template-columns: 1fr; /* One column */
          }
        }
      `}</style>
    </div>
  );
};

export default SolarMountSystem;