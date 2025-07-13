import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

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

const PortableSolarPanelsView = () => {
  const params = useParams();
  const categoryId = params.id || null;

  const products = [
    {
      id: 1,
      name: 'Портативні-Сонячні-панелі-Jackery-SolarSaga-100W',
      price: 1000,
      image: '/images/Categories/solar.panels/Портативні-Сонячні-панелі-Jackery-SolarSaga-100W.png',
      brand: 'Longi',
      categoryId: 12,
    },
    {
      id: 2,
      name: 'Сонячна Панель Longi-420-Black',
      price: 1200,
      image: '/images/Categories/solar.panels/Longi-420-Black.png',
      brand: 'Longi',
      categoryId: 12,
    },
    {
      id: 3,
      name: 'Сонячна Панель Longi-425-Black',
      price: 1000,
      image: '/images/Categories/solar.panels/Longi-425-Black.png',
      brand: 'Longi',
      categoryId: 12,
    },
    {
      id: 4,
      name: 'Сонячна Панель Longi-530-Black',
      price: 1200,
      image: '/images/Categories/solar.panels/Longi-530-Black.png',
      brand: 'Longi',
      categoryId: 12,
    },
    {
      id: 5,
      name: 'Сонячна Панель Longi-630-Bifacial',
      price: 1000,
      image: '/images/Categories/solar.panels/Longi-630-Bifacial.png',
      brand: 'Longi',
      categoryId: 12,
    },
    {
      id: 6,
      name: 'Сонячна Панель Longi-430',
      price: 1200,
      image: '/images/Categories/solar.panels/Longi-430.png',
      brand: 'Longi',
      categoryId: 13,
    },
    {
      id: 7,
      name: 'Сонячна Панель Longi-580',
      price: 1000,
      image: '/images/Categories/solar.panels/Longi-580.png',
      brand: 'Longi',
      categoryId: 14,
    },
    {
      id: 8,
      name: 'Сонячна Панель Longi-585',
      price: 1200,
      image: '/images/Categories/solar.panels/Longi-585.png',
      brand: 'Longi',
      categoryId: 15,
    },
    {
      id: 9,
      name: 'Сонячна Панель Longi-440',
      price: 1000,
      image: '/images/Categories/solar.panels/Longi-440.png',
      brand: 'Longi-440',
      categoryId: 16,
    },
    {
      id: 10,
      name: 'Сонячна Панель Longi-455',
      price: 1200,
      image: '/images/Categories/solar.panels/Longi-455.png',
      brand: 'Longi',
      categoryId: 17,
    },
  ];

  // Add uniqueKey to each product
  const productsWithKeys = products.map(product => ({
    ...product,
    uniqueKey: product.id
  }));

  // Filter products by categoryId if present
  const displayedProducts = useMemo(() => {
    if (categoryId) {
      return productsWithKeys.filter(
        (product) => product.categoryId === categoryId
      );
    }
    return productsWithKeys;
  }, [categoryId, productsWithKeys]);

  // Define breadcrumbs
  const breadcrumbs = [
    { name: 'Home', link: '/' },
    { name: 'Каталог', link: '/catalogue' },
    { name: 'Портативні сонячні панелі' },
  ];

  const pageTitle = 'Портативні сонячні панелі';

  const handleProductClick = (productId) => {
    // Replace with your actual navigation logic
    console.log('Navigate to product:', productId);
    // For React Router: navigate(`/product/${productId}`);
  };

  return (
    <div className="catalogue-view">
      <Breadcrumb breadcrumbs={breadcrumbs} className="breadcrumb-spacing" />
      
      <h1>{pageTitle}</h1>

      <div className="products-container">
        {displayedProducts.map((product) => (
          <div key={product.uniqueKey} className="product-card-wrapper">
            <ProductCard
              productId={product.id}
              title={product.name}
              price={product.price}
              imageSrc={product.image}
              brand={product.brand}
              onClick={() => handleProductClick(product.id)}
            />
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

        /* Match other pages so breadcrumb isn't hidden by a fixed header */
        .catalogue-view {
          margin-top: 80px;
        }

        /* Same class used in Breadcrumb.vue for consistent spacing */
        .breadcrumb-spacing {
          margin-bottom: 1rem;
          /* margin-top: 1rem; /* If you want additional top spacing above the breadcrumb */
        }

        /* Your existing styles */
        .products-container {
          display: grid;
          grid-template-columns: repeat(5, 1fr); /* Five columns */
          gap: 15px;
          padding: 20px;
          background-color: #f9fafb;
        }

        /* Responsive styles */
        @media (max-width: 1600px) {
          .products-container {
            grid-template-columns: repeat(5, 1fr); /* Four columns */
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

export default PortableSolarPanelsView;