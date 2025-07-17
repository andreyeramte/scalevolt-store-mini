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
const t = (key) => {
  const translations = {
    'header.categories.batteries': 'Batteries',
    'common.home': 'Home',
    'common.categories': 'Categories'
  };
  return translations[key] || key;
};

// Mock stores - replace with your actual state management
const useProductsStore = () => ({
  getProducts: [
    {
      id: 1,
      categoryId: 2,
      nameKey: 'product.battery.lithium',
      defaultName: 'Lithium Battery 12V',
      price: 299.99,
      image: '/api/placeholder/300/200',
      brand: 'PowerMax'
    },
    {
      id: 2,
      categoryId: 2,
      nameKey: 'product.battery.solar',
      defaultName: 'Solar Battery 24V',
      price: 459.99,
      image: '/api/placeholder/300/200',
      brand: 'SolarTech'
    },
    {
      id: 3,
      categoryId: 2,
      nameKey: 'product.battery.marine',
      defaultName: 'Marine Battery 12V',
      price: 189.99,
      image: '/api/placeholder/300/200',
      brand: 'AquaPower'
    },
    {
      id: 4,
      categoryId: 2,
      nameKey: 'product.battery.automotive',
      defaultName: 'Automotive Battery',
      price: 129.99,
      image: '/api/placeholder/300/200',
      brand: 'AutoMax'
    },
    {
      id: 5,
      categoryId: 2,
      nameKey: 'product.battery.ups',
      defaultName: 'UPS Battery 48V',
      price: 349.99,
      image: '/api/placeholder/300/200',
      brand: 'BackupPro'
    }
  ]
});

const useCartStore = () => ({
  // Mock cart store methods
  addToCart: (product) => console.log('Added to cart:', product)
});

const BatteriesView = () => {
  const location = useLocation();
  const region = location.pathname.split('/')[1] || 'ua';
  const categoryId = 2;
  const store = useProductsStore();
  const cartStore = useCartStore();

  // Filter products by category
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
    return t(product.nameKey) + " " + product.defaultName;
  };

  // Define localized breadcrumbs
  const localizedBreadcrumbs = useMemo(() => [
    { name: t("common.home"), link: "/" },
    { name: t("common.categories"), link: "/catalogue" },
    { name: t("header.categories.batteries") }
  ], []);

  const handleProductClick = (productId) => {
    // Replace with your actual navigation logic
    console.log('Navigate to product:', productId);
    // For React Router: navigate(`/product/${productId}`);
  };

  return (
    <div className="catalogue-view">
      <Breadcrumb
        breadcrumbs={localizedBreadcrumbs}
        className="breadcrumb-spacing"
      />
      <h1>{t("header.categories.batteries")}</h1>

      <div className="products-container">
        {products.map(product => {
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
        }

        .product-card-wrapper {
          transition: transform 0.2s ease;
        }

        .product-card-wrapper:hover {
          transform: translateY(-2px);
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

        h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
          margin: 0 0 20px 0;
          padding: 0 20px;
        }
      `}</style>
    </div>
  );
};

export default BatteriesView;