// File: CableProductDetail.jsx 

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext'; // Assuming you have a CartContext

const CableProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [productCount, setProductCount] = useState(1);
  const [showInstallationPopup, setShowInstallationPopup] = useState(false);
  const [addInstallation, setAddInstallation] = useState(false);
  const [installationDetails, setInstallationDetails] = useState({
    companyName: '',
    address: '',
    notes: '',
  });

  // Breadcrumb path
  const breadcrumbs = [
    { name: 'Головна', link: '/' },
    { name: 'Кабелі електричні та дроти', link: '/cables' },
    { name: product?.name || 'Деталі продукту' },
  ];

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/cables/${id}`);
        setProduct(response.data);
        
        // Set the first image as selected
        if (response.data.images && response.data.images.length > 0) {
          setSelectedImage(response.data.images[0].url);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.market_data.price,
        image: selectedImage || (product.images && product.images.length > 0 ? product.images[0].url : '/images/placeholder.png'),
        quantity: productCount,
        installation: addInstallation ? installationDetails : null,
      });
      
      alert(`Added ${productCount} ${product.name} to cart${addInstallation ? " with installation" : ""}`);
    }
  };

  const handleQuantityChange = (action) => {
    if (action === '+') {
      setProductCount(prev => prev + 1);
    } else if (action === '-' && productCount > 1) {
      setProductCount(prev => prev - 1);
    }
  };

  const toggleInstallationPopup = () => {
    setShowInstallationPopup(prev => !prev);
  };

  const confirmInstallation = () => {
    if (addInstallation && (!installationDetails.companyName || !installationDetails.address)) {
      alert('Please fill in the required fields');
      return;
    }
    
    setShowInstallationPopup(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Product not found.
      </div>
    );
  }

  return (
    <div className="product-page-container flex flex-col justify-center items-center">
      {/* Breadcrumb */}
      <nav className="breadcrumb ml-8 w-full">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="breadcrumb-separator">/</span>}
            {crumb.link ? (
              <Link to={crumb.link}>{crumb.name}</Link>
            ) : (
              <span className="current-page">{crumb.name}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className="flex flex-col xl:flex-row">
        {/* Product Gallery */}
        <div className="product-containew p-4">
          <div className="product-content">
            <div className="product-gallery">
              {/* Thumbnail Gallery */}
              <div className="thumbnail-list">
                {product.images && product.images.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === img.url ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img.url)}
                  >
                    <img src={img.url} alt={`Product Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>

              {/* Main Product Image */}
              <div className="main-image-container">
                <img
                  src={selectedImage || (product.images && product.images.length > 0 ? product.images[0].url : '/images/placeholder.png')}
                  alt={product.name}
                  className="main-image"
                />
              </div>
            </div>
          </div>

          <div className="p-4 diviwer mt-6 mb-6"></div>

          {/* Product Characteristics */}
          <div className="product-characteristics">
            {product.specifications && Object.entries(product.specifications).map(([key, value], index) => (
              value && (
                <div key={index} className="product-characteristic p-[17px] flex gap-3 my-2">
                  <img src={`/images/${key}.svg`} alt="" />
                  <div>
                    <div className="characteristics-name">{formatSpecName(key)}</div>
                    <div className="characteristics-description">{formatSpecValue(key, value)}</div>
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Installation Button */}
          <div className="button-instaletion mt-4">
            <button
              className="flex gap-2 items-center justify-center w-full h-[50px] rounded-[12px] border border-blue-500 text-blue-500"
              onClick={toggleInstallationPopup}
            >
              <img src="/images/service.svg" alt="" />
              <p>Замовити встановлення</p>
            </button>
          </div>

          <div className="p-4 diviwer mt-6 mb-6"></div>
          
          {/* Social Share */}
          <div className="social flex gap-1">
            <button><img src="/images/facebook.svg" alt="" /></button>
            <button><img src="/images/tg.svg" alt="" /></button>
            <button><img src="/images/soc.svg" alt="" /></button>
          </div>
        </div>

        {/* Product Info */}
        <div className="about-product p-4">
          <div className="about-product-head flex justify-between">
            <div className={`availability ${product.market_data.is_available ? '' : 'text-red-600 bg-red-100'}`}>
              {product.market_data.is_available ? 'В наявності' : 'Немає в наявності'}
            </div>
            <div className="code">Код: <span>{product.id}</span></div>
          </div>

          <h2 className="product-name mt-3">{product.name}</h2>
          
          {/* Technical Specifications */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Технічні характеристики</h3>
            <table className="info-table">
              <tbody>
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  value && (
                    <tr key={key}>
                      <th>{formatSpecName(key)}</th>
                      <td>{formatSpecValue(key, value)}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>

          {/* Price Information */}
          {product.market_data.is_available && (
            <div className="product-price mt-6">
              <div className="real-price mt-1">{product.market_data.price} PLN</div>
              <div className="lead-time mt-2">
                Час доставки: {product.market_data.lead_time_days ? `${product.market_data.lead_time_days} днів` : 'Уточнюйте'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add to Cart Section */}
      {product.market_data.is_available && (
        <div className="relative">
          <div className="add-to-card mt-5 flex items-center justify-between xl:justify-start">
            <div className="product-counter flex items-center justify-between">
              <button onClick={() => handleQuantityChange('-')}>
                <img src="/images/dash.svg" alt="" />
              </button>
              <input 
                value={productCount} 
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0) {
                    setProductCount(value);
                  }
                }}
              />
              <button onClick={() => handleQuantityChange('+')}>
                <img src="/images/plus.svg" alt="" />
              </button>
            </div>
            <div className="add-to-card-button xl:ml-4">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center xl:w-[580px]"
              >
                <img className="mr-2" src="/images/cart-2.svg" alt="" width="20" height="17" />
                <p>Додати в кошик</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Installation Popup */}
      {showInstallationPopup && (
        <div className="installation-popup-overlay" onClick={() => setShowInstallationPopup(false)}>
          <div className="installation-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Замовлення встановлення</h3>
              <button className="close-btn" onClick={() => setShowInstallationPopup(false)}>×</button>
            </div>
            <div className="popup-content">
              <div className="installation-toggle">
                <input 
                  type="checkbox" 
                  id="addInstallation" 
                  checked={addInstallation}
                  onChange={(e) => setAddInstallation(e.target.checked)}
                />
                <label htmlFor="addInstallation">Додати встановлення до замовлення</label>
              </div>
              
              {addInstallation && (
                <div className="installation-form">
                  <div className="form-group">
                    <label>Назва компанії <span className="required-indicator">*</span></label>
                    <input 
                      type="text" 
                      value={installationDetails.companyName}
                      onChange={(e) => setInstallationDetails({...installationDetails, companyName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Адреса <span className="required-indicator">*</span></label>
                    <input 
                      type="text" 
                      value={installationDetails.address}
                      onChange={(e) => setInstallationDetails({...installationDetails, address: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Примітки</label>
                    <textarea 
                      value={installationDetails.notes}
                      onChange={(e) => setInstallationDetails({...installationDetails, notes: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <div className="installation-provider">
                    <img src="/images/certification-Icon.svg" alt="Installation Provider" className="provider-logo" />
                    <div>
                      <div className="provider-name">Сертифікований монтажник</div>
                      <div className="provider-rating">★★★★★ (4.9)</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="popup-footer">
              <button className="cancel-btn" onClick={() => setShowInstallationPopup(false)}>Скасувати</button>
              <button className="confirm-btn" onClick={confirmInstallation}>Підтвердити</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for formatting
function formatSpecName(key) {
  const nameMap = {
    conductor_type: 'Тип провідника',
    conductor_material: 'Матеріал провідника',
    conductor_cross_sectional_area: 'Поперечний переріз',
    insulation_type: 'Тип ізоляції',
    voltage_rating: 'Номінальна напруга',
    diameter: 'Діаметр',
    weight_per_km: 'Вага на км',
    min_bending_radius: 'Мін. радіус вигину',
    max_pulling_force: 'Макс. сила натягу',
    standards: 'Стандарти'
  };
  
  return nameMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatSpecValue(key, value) {
  const unitMap = {
    conductor_cross_sectional_area: `${value} мм²`,
    diameter: `${value} мм`,
    weight_per_km: `${value} кг/км`,
    min_bending_radius: `${value} м`,
    max_pulling_force: `${value} кН`,
  };
  
  return unitMap[key] || value;
}

export default CableProductDetail;