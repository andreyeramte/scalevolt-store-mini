import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import productService from '../../services/productService';
import Breadcrumb from '../common/Breadcrumb/Breadcrumb';
import { CartContext } from '../../contexts/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, getItemQuantity } = useContext(CartContext);

  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [activeTab, setActiveTab] = useState('description');

  // Get cart quantity for this product
  const cartQuantity = getItemQuantity(id ? Number(id) : 0);
  const itemInCart = cartQuantity > 0;

  // Helper function to get absolute image URL
  const getAbsoluteImageUrl = (imageData) => {
    if (!imageData || !imageData.attributes || !imageData.attributes.url) return '';
    const baseUrl = window.location.origin;
    const apiBase = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:1337';
    const imagePath = `${apiBase}${imageData.attributes.url}`;
    // In production, adjust this to your domain
    return imagePath.replace('http://localhost:1337', baseUrl);
  };

  // Helper function to get image URL
  const getImageUrl = (imageData) => {
    if (!imageData || !imageData.attributes || !imageData.attributes.url) return '';
    return `http://localhost:1337${imageData.attributes.url}`;
  };

  // Generate structured data for SEO
  const generateStructuredData = () => {
    if (!product) return null;

    const productData = product;
    const imageData = productData.attributes.general_information.images.data[0];
    const imageUrl = imageData ? getAbsoluteImageUrl(imageData) : '';

    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": productData.attributes.general_information.name,
      "image": imageUrl,
      "description": productData.attributes.general_information.description || "",
      "brand": {
        "@type": "Brand",
        "name": productData.attributes.general_information.brand || "ScaleVolt"
      },
      "sku": productData.id.toString(),
      "mpn": productData.attributes.general_information.model || productData.id.toString(),
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "UAH",
        "price": productData.attributes.pricing_and_inventory.price.toString(),
        "availability": productData.attributes.pricing_and_inventory.in_stock 
          ? "https://schema.org/InStock" 
          : "https://schema.org/OutOfStock"
      }
    };
  };

  // Memoized meta tags for SEO
  const metaTags = useMemo(() => {
    if (!product) return {};

    const productData = product;
    const imageData = productData.attributes.general_information.images.data[0];
    const imageUrl = imageData ? getAbsoluteImageUrl(imageData) : '';
    const productName = productData.attributes.general_information.name;
    const productDescription = productData.attributes.general_information.description || 
      `${productName} - ${t('common.productDefaultDescription')}`;
    const strippedDescription = productDescription.replace(/<[^>]*>/g, '').substring(0, 160);

    return {
      title: productName,
      description: strippedDescription,
      imageUrl,
      productName,
      price: productData.attributes.pricing_and_inventory.price.toString()
    };
  }, [product, t]);

  // Format price
  const formatPrice = (price) => {
    return price ? price.toLocaleString() : '0';
  };

  // Format specification key
  const formatSpecKey = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Fetch product data
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id, {
        populate: {
          general_information: {
            populate: ['images'],
          },
          pricing_and_inventory: true,
          specifications: true,
          category: true,
        },
      });
      
      const productData = response.data.data;
      setProduct(productData);

      // Set up breadcrumbs after fetching the product
      if (productData && productData.attributes) {
        const productName = productData.attributes.general_information.name;
        const categoryData = productData.attributes.category && productData.attributes.category.data;

        if (categoryData && categoryData.attributes) {
          const categoryName = categoryData.attributes.name || t('common.category');
          const categoryId = categoryData.id || '';

          setBreadcrumbs([
            { name: t('common.home'), link: '/' },
            { name: categoryName, link: `/category/${categoryId}` },
            { name: productName, link: '' },
          ]);
        } else {
          // If category data is missing
          setBreadcrumbs([
            { name: t('common.home'), link: '/' },
            { name: t('common.category'), link: '' },
            { name: productName, link: '' },
          ]);
        }
      } else {
        setBreadcrumbs([{ name: t('common.home'), link: '/' }]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
      setBreadcrumbs([{ name: t('common.home'), link: '/' }]);
    } finally {
      setLoading(false);
    }
  };

  // Cart functions
  const handleAddToCart = () => {
    if (product && product.attributes.pricing_and_inventory.in_stock) {
      const imageData = product.attributes.general_information.images.data[0];
      const imageUrl = imageData ? getImageUrl(imageData) : '';
      
      const productData = {
        id: product.id,
        name: product.attributes.general_information.name,
        price: product.attributes.pricing_and_inventory.price,
        image: imageUrl,
        brand: product.attributes.general_information.brand || '',
        model: product.attributes.general_information.model || '',
      };
      
      addToCart({ ...productData, quantity: 1 });
    }
  };

  const handleIncreaseQuantity = () => {
    if (product) {
      increaseQuantity(product.id);
    }
  };

  const handleDecreaseQuantity = () => {
    if (product) {
      if (cartQuantity === 1) {
        removeFromCart(product.id);
      } else {
        decreaseQuantity(product.id);
      }
    }
  };

  // Fetch product when component mounts or ID changes
  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Render loading or error state
  if (loading) {
    return (
      <div className="product-detail">
        <div className="loading-state">
          <p className="loading-message">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="loading-state">
          <p className="error-message">{t('product.notFound')}</p>
        </div>
      </div>
    );
  }

  const structuredData = generateStructuredData();

  return (
    <div className="product-detail">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content={metaTags.productName} />
        <meta property="og:description" content={metaTags.description} />
        <meta property="og:image" content={metaTags.imageUrl} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="ScaleVolt" />
        <meta property="og:price:amount" content={metaTags.price} />
        <meta property="og:price:currency" content="UAH" />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="product" />
        <meta name="twitter:title" content={metaTags.productName} />
        <meta name="twitter:description" content={metaTags.description} />
        <meta name="twitter:image" content={metaTags.imageUrl} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
        
        {/* Structured Data */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>

      {/* Breadcrumb Component */}
      <Breadcrumb breadcrumbs={breadcrumbs} />

      {/* Product Details */}
      <div className="product-container">
        <div className="product-image-section">
          <img
            src={getImageUrl(product.attributes.general_information.images.data[0])}
            alt="Product Image"
            className="product-image"
          />
        </div>
        
        <div className="product-info-section">
          <h1 className="product-title">
            {product.attributes.general_information.name}
          </h1>
          
          <div className="product-meta">
            {product.attributes.general_information.brand && (
              <div className="product-brand">
                <span className="meta-label">{t('product.brand')}:</span> 
                <span className="meta-value">{product.attributes.general_information.brand}</span>
              </div>
            )}
            
            {product.attributes.general_information.model && (
              <div className="product-model">
                <span className="meta-label">{t('product.model')}:</span> 
                <span className="meta-value">{product.attributes.general_information.model}</span>
              </div>
            )}
          </div>
          
          <div className="product-price">
            {formatPrice(product.attributes.pricing_and_inventory.price)} грн
          </div>
          
          <div className={`product-availability ${
            product.attributes.pricing_and_inventory.in_stock ? 'in-stock' : 'out-of-stock'
          }`}>
            {product.attributes.pricing_and_inventory.in_stock ? 
              t('product.available') : t('product.outOfStock')}
          </div>

          {/* Add to Cart Section */}
          <div className="add-to-cart-section">
            {product.attributes.pricing_and_inventory.in_stock ? (
              itemInCart ? (
                <div className="quantity-controls">
                  <button onClick={handleDecreaseQuantity} className="quantity-btn">-</button>
                  <span className="quantity-display">{cartQuantity}</span>
                  <button onClick={handleIncreaseQuantity} className="quantity-btn">+</button>
                </div>
              ) : (
                <button onClick={handleAddToCart} className="add-to-cart-btn">
                  {t('product.addToCart')}
                </button>
              )
            ) : (
              <button disabled className="out-of-stock-btn">
                {t('product.outOfStock')}
              </button>
            )}
          </div>
          
          {/* Product Details Tabs */}
          <div className="product-tabs">
            <div className="tab-headers">
              <button 
                onClick={() => setActiveTab('description')} 
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              >
                {t('product.description')}
              </button>
              <button 
                onClick={() => setActiveTab('specifications')} 
                className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              >
                {t('product.specifications')}
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'description' && (
                <div 
                  className="description-tab"
                  dangerouslySetInnerHTML={{ 
                    __html: product.attributes.general_information.description 
                  }}
                />
              )}
              
              {activeTab === 'specifications' && (
                <div className="specifications-tab">
                  {product.attributes.specifications ? (
                    Object.entries(product.attributes.specifications).map(([key, value]) => (
                      <div key={key} className="spec-item">
                        <span className="spec-label">{formatSpecKey(key)}:</span>
                        <span className="spec-value">{value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="no-specs">
                      {t('product.noSpecifications')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;