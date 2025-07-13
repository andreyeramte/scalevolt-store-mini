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
        {products.map((product) => (
          <div key={product.uniqueKey} className="product-card-wrapper">
            <ProductCard
              productId={product.id}
              title={getTranslatedProductName(product)}
              price={product.price}
              imageSrc={product.image}
              brand={product.brand}
              onClick={() => cartStore.addToCart(product)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvertersView;
