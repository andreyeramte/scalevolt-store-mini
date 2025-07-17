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
    'product.inverter.solar': 'Solar Inverter',
    'product.inverter.grid': 'Grid Tie Inverter',
    'product.inverter.hybrid': 'Hybrid Inverter'
  };
  return translations[key] || key;
};

// Mock stores - replace with your actual state management
const useProductsStore = () => ({
  getProducts: [
    {
      id: 1,
      categoryId: 3,
      nameKey: 'product.inverter.solar',
      defaultName: '5kW MPPT',
      price: 1299.99,
      image: '/api/placeholder/300/200',
      brand: 'SolarMax'
    },
    {
      id: 2,
      categoryId: 3,
      nameKey: 'product.inverter.grid',
      defaultName: '10kW Grid Tie',
      price: 2199.99,
      image: '/api/placeholder/300/200',
      brand: 'PowerTech'
    },
    {
      id: 3,
      categoryId: 3,
      nameKey: 'product.inverter.hybrid',
      defaultName: '8kW Hybrid',
      price: 1899.99,
      image: '/api/placeholder/300/200',
      brand: 'EcoSolar'
    }
  ]
});

const useCartStore = () => ({
  // Mock cart store methods
  addToCart: (product) => console.log('Added to cart:', product)
});

const InvertersView = () => {
  const location = useLocation();
  const region = location.pathname.split('/')[1] || 'ua';
  const categoryId = 3;
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
    return t(product.nameKey) + " " + product.defaultName;
  };

  // Define breadcrumbs
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Каталог", link: "/catalogue" },
    { name: "Інвертори" },
  ];

  const pageTitle = "Inverters";

  return (
    <div className="catalogue-view">
      <Breadcrumb breadcrumbs={breadcrumbs} className="breadcrumb-spacing" />
      
      <h1>{pageTitle}</h1>

      <div className="products-container">
        {products.map((product) => {
          const imageSrc = product.image || '/images/placeholder.png';
          return (
            <div key={product.uniqueKey} className="product-card-wrapper">
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
    </div>
  );
};

export default InvertersView;
