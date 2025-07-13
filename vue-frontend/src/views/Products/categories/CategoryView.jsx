import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Mock ProductCard component - replace with your actual component
const ProductCard = ({ productId, title, price, imageSrc, brand, isRentalItem, rentalPrices, onClick }) => (
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
    {isRentalItem && rentalPrices ? (
      <div style={{ marginBottom: '8px' }}>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
          Day: ${rentalPrices.day} | Week: ${rentalPrices.week} | Month: ${rentalPrices.month}
        </p>
      </div>
    ) : (
      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0066cc' }}>
        ${price}
      </p>
    )}
  </div>
);

const CategoryView = ({ categoryName = '', currentPath = '', categoryId = null }) => {
  const { t } = useTranslation();
  const params = useParams();
  const location = useLocation();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCategoryName, setCurrentCategoryName] = useState('');

  // Map routes to translation keys instead of hardcoded strings
  const routeToTypeKey = {
    '/generators': 'homeView.generators',
    '/industrial-generators': 'homeView.industrialGenerators',
    '/solar-lighting-towers': 'homeView.solarLightingTowers',
    '/lifts-and-cranes': 'homeView.liftsAndCranes',
    '/dc-charging-stations': 'homeView.dcChargingStations',
    '/ac-charging-stations': 'homeView.acChargingStations',
    '/portable-charging-devices': 'homeView.portableChargingDevices',
    '/solar-panels': 'homeView.solarPanels',
    '/batteries': 'homeView.batteries',
    '/inverters': 'homeView.inverters',
    '/solar-sets': 'homeView.solarSets',
    '/mounting-systems': 'homeView.mountingSystems'
  };

  // Map for untranslated type values that need to match the database
  const typeMapping = {
    'homeView.generators': 'Генератори',
    'homeView.industrialGenerators': 'Промислові генератори для важких навантажень (100 кВт+)',
    'homeView.solarLightingTowers': 'Освітлювальні вежі на сонячних батареях',
    'homeView.liftsAndCranes': 'Підйомники та Крани',
    'homeView.dcChargingStations': 'Швидкі Зарядні Станції (DC)',
    'homeView.acChargingStations': 'Зарядні Станції Рівня 2 (AC)',
    'homeView.portableChargingDevices': 'Портативні/Мобільні Зарядні Пристрої',
    'homeView.solarPanels': 'Сонячні Панелі',
    'homeView.batteries': 'Батареї',
    'homeView.inverters': 'Інвертори',
    'homeView.solarSets': 'SolarSets',
    'homeView.mountingSystems': 'Система монтажу сонячних панелей'
  };

  // Rental categories that should use rental item display (using translation keys)
  const rentalCategoryKeys = [
    'homeView.generators', 
    'homeView.industrialGenerators', 
    'homeView.solarLightingTowers',
    'homeView.liftsAndCranes'
  ];

  // Mock products (replace with your actual mock data import)
  const mockProducts = [
    {
      id: 1,
      name: 'Дизельний генератор 50кВт',
      type: 'Генератори',
      price: 25000,
      image: '/images/generator-1.jpg',
      brand: 'ScaleVolt',
      rentalPrices: { day: 150, week: 800, month: 2500 }
    },
    {
      id: 2,
      name: 'Промисловий генератор 150кВт',
      type: 'Промислові генератори для важких навантажень (100 кВт+)',
      price: 85000,
      image: '/images/generator-2.jpg',
      brand: 'ScaleVolt Pro',
      rentalPrices: { day: 350, week: 2000, month: 7500 }
    }
  ];

  // Mock product service (replace with your actual service)
  const productService = {
    getProducts: async (options = {}) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        data: {
          data: mockProducts // For category ID response structure
        }
      };
    }
  };

  // Determine if we should use API or mock data based on route
  const isCustomRoute = useMemo(() => {
    return currentPath && Object.keys(routeToTypeKey).includes(currentPath);
  }, [currentPath]);

  // Get display name - from props or route mapping (now translated)
  const displayCategoryName = useMemo(() => {
    if (categoryName) {
      return categoryName;
    }
    
    if (isCustomRoute) {
      const translationKey = routeToTypeKey[currentPath];
      return translationKey ? t(translationKey) : currentCategoryName;
    }
    
    return currentCategoryName;
  }, [categoryName, isCustomRoute, currentPath, t, currentCategoryName]);

  // Fetch products by type
  const fetchProductsByType = async (typeKey) => {
    setLoading(true);
    
    // Get the database type from the translation key
    const databaseType = typeMapping[typeKey];
    
    try {
      // First, try API
      try {
        const response = await productService.getProducts({ 
          filters: { 
            type: { $eq: databaseType } 
          },
          populate: ['general_information.images', 'pricing_and_inventory']
        });
        
        if (response.data && response.data.length > 0) {
          const processedProducts = response.data.map(product => {
            const isRental = rentalCategoryKeys.includes(typeKey);
            return {
              id: product.id,
              name: product.attributes?.name || product.name,
              price: product.attributes?.pricing_and_inventory?.price || product.price,
              image: product.attributes?.general_information?.images?.data?.[0]?.attributes?.url || product.image,
              brand: product.attributes?.general_information?.brand || product.brand,
              // Add rental-specific properties
              isRentalItem: isRental,
              rentalPrices: isRental ? {
                day: product.attributes?.pricing_and_inventory?.day_price || 150,
                week: product.attributes?.pricing_and_inventory?.week_price || 300,
                month: product.attributes?.pricing_and_inventory?.month_price || 600
              } : {}
            };
          });
          setProducts(processedProducts);
          return;
        }
      } catch (apiError) {
        console.warn('API fetch failed, falling back to mock products', apiError);
      }

      // Fallback to mock data with rental information
      const mockFilteredProducts = mockProducts
        .filter(product => 
          product.type === databaseType || 
          product.type?.toLowerCase() === databaseType.toLowerCase()
        )
        .map(product => {
          const isRental = rentalCategoryKeys.includes(typeKey);
          return {
            ...product,
            isRentalItem: isRental,
            rentalPrices: isRental ? (product.rentalPrices || {
              day: 150,
              week: 300,
              month: 600
            }) : {}
          };
        });
      
      setProducts(mockFilteredProducts);
    } catch (error) {
      console.error('Error fetching products by type:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products by category ID
  const fetchProductsByCategory = async (catId) => {
    setLoading(true);
    try {
      const response = await productService.getProducts({
        populate: ['general_information.images', 'pricing_and_inventory'],
        filters: {
          categoryId: {
            $eq: catId,
          },
        },
      });

      const processedProducts = response.data.data.map((product) => ({
        id: product.id,
        name: product.attributes.name,
        price: product.attributes.pricing_and_inventory?.price || 0,
        image: product.attributes.general_information.images?.data?.[0]?.attributes?.url || '/default-image.jpg',
        brand: product.attributes.general_information.brand || 'No Brand',
      }));

      setProducts(processedProducts);
      setCurrentCategoryName(processedProducts.length > 0 ? processedProducts[0].attributes.categoryName : t('common.category'));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get product image
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    } else if (product.image) {
      return Array.isArray(product.image) ? product.image[0] : product.image;
    }
    return '/images/placeholder.png';
  };

  // Watch for route changes and fetch appropriate products
  useEffect(() => {
    if (isCustomRoute) {
      const typeKey = routeToTypeKey[currentPath];
      if (typeKey) {
        fetchProductsByType(typeKey);
      }
    } else {
      if (categoryId) {
        fetchProductsByCategory(categoryId);
      }
    }
  }, [isCustomRoute, currentPath, categoryId]);

  const handleProductClick = (productId) => {
    // Replace with your actual navigation logic
    console.log('Navigate to product:', productId);
    // For React Router: navigate(`/product/${productId}`);
  };

  return (
    <div className="category-view">
      <h1>{displayCategoryName}</h1>

      {/* Show Loading Indicator */}
      {loading && (
        <div className="loading-indicator">
          {t('common.loading')}
        </div>
      )}

      {/* Show Products Only When Data is Loaded */}
      {!loading && products.length > 0 && (
        <div className="products-container">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              title={product.name || product.title}
              price={product.price}
              imageSrc={getProductImage(product)}
              brand={product.brand}
              isRentalItem={product.isRentalItem}
              rentalPrices={product.rentalPrices}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </div>
      )}
      
      {/* No products found message */}
      {!loading && products.length === 0 && (
        <div className="no-products">
          <p>{t('common.noProductsFound')}</p>
        </div>
      )}

      <style jsx>{`
        .category-view {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .category-view h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }

        .loading-indicator {
          text-align: center;
          padding: 40px;
          font-size: 18px;
          color: #666;
        }

        .products-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .no-products {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .no-products p {
          font-size: 18px;
          margin: 0;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .category-view {
            padding: 15px;
          }
          
          .category-view h1 {
            font-size: 1.5rem;
          }
          
          .products-container {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
          }
        }

        @media (max-width: 480px) {
          .products-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryView;