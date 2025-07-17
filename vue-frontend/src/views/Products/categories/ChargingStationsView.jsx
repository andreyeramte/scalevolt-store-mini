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

const ChargingStations = ({ categoryId = null }) => {
  const location = useLocation();
  const region = location.pathname.split('/')[1] || 'ua';
  // Get route parameters as props (you can integrate with your routing solution)

  // Sample products with categoryId (if needed)
  const products = [
    { 
      id: 11, 
      name: "Octa Wall 2 Plug", 
      price: 500, 
      image: "/images/dvushka_connectors0001_white.png", 
      brand: "Delta",
      categoryId: 2 // Example category ID
    },
    { 
      id: 12, 
      name: "Octa Wall 3 Plug", 
      price: 700, 
      image: "/images/treshka_connectors0001_white.png", 
      brand: "ABB",
      categoryId: 2 
    },
  ];

  // Optional: Filter products by category (like SolarPanels)
  const displayedProducts = useMemo(() => {
    if (categoryId) {
      return products.filter(
        (product) => product.categoryId === Number(categoryId)
      );
    }
    return products;
  }, [categoryId]);

  // Breadcrumbs
  const breadcrumbs = [
    { name: "Головна", link: "/" },
    { name: "Низьковольтна Продукція", link: "/low-voltage" },
    { name: "Зарядки" },
  ];

  const pageTitle = "Зарядки";

  const handleProductClick = (productId) => {
    // Replace with your actual navigation logic
    console.log('Navigate to product:', productId);
    // For React Router: navigate(`/product/${productId}`);
  };

  return (
    <div className="catalogue-view">
      <Breadcrumb breadcrumbs={breadcrumbs} className="breadcrumb-spacing" />

      <h1>{pageTitle}</h1>

      {/* Updated Product Listing with productId */}
      <div className="products-container">
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            className="product-card-wrapper"
          >
            <Link to={`/${region}/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ProductCard
                productId={product.id}
                title={product.name}
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

        /* Optional spacing for the breadcrumb. */
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

        @media (max-width: 1600px) {
          .products-container {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        @media (max-width: 1200px) {
          .products-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 992px) {
          .products-container {
            grid-template-columns: repeat(2, 1fr);
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

export default ChargingStations;