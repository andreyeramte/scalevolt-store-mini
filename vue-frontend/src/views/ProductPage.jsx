
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import "../components/Product/ProductDetail.css";
import useProductsStore from '../stores/products';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = useProductsStore();
  
  // State management
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [productCount, setProductCount] = useState(1);
  const [sizeButton, setSizeButton] = useState({ id: 1, size: "1722×1134×30" });
  
  // Installation popup state
  const [showInstallationPopup, setShowInstallationPopup] = useState(false);
  const [addInstallation, setAddInstallation] = useState(false);
  const [installationDetails, setInstallationDetails] = useState({
    companyName: "",
    address: "",
    notes: "",
  });

  // Static data
  const productSizes = [
    { id: 1, size: "1722×1134×30" },
    { id: 2, size: "2600×1134×30" },
    { id: 3, size: "2600×1134×30" },
  ];

  const productCharacteristics = [
    { 
      src: '/images/manufactury.svg',
      name: "Виробник",
      description: "Victron Energy (Китай)",
    },
    {
      src: '/images/core_1.svg',
      name: "Номінальна потужність",
      description: "435 Вт",
    },
    {
      src: '/images/core.svg',
      name: "Маса",
      description: "1.9 Кг",
    },
    {
      src: '/images/selfie.svg',
      name: "Номінальна напруга",
      description: "18.4 В",
    },
    {
      src: '/images/battery.svg',
      name: "Струм короткого замикання",
      description: "1.18 А",
    },
  ];

  const productBoxes = [
    {
      img: "/images/np.svg",
      title: "Доставка за 1 грн.",
    },
    {
      img: "/images/krash.svg",
      title: "Кращ",
    },
    {
      img: "/images/trade-in.svg",
      title: "Trade-In",
    }
  ];

  const garantyData = [
    {
      img: "/images/truck.svg",
      title: "Безкоштовна доставка у магазин та відділення Нової Пошти.",
    },
    {
      img: "/images/shield-tick.svg",
      title: "Офіційна гарантія від виробника",
    },
    {
      img: "/images/3d-rotate.svg",
      title: "Швидкий обмін та повернення протягом 14 днів.",
    }
  ];

  const mainCharacters = [
    {
      name: "Номінальна потужність, (Вт)",
      description: "435",
    },
    {
      name: "Тип кристала",
      description: "Монокристал",
    },
    {
      name: "Напруга при максимальній потужності, (В)",
      description: "33,04",
    },
    {
      name: "Струм при максимальній потужності, (A)",
      description: "13,17 А",
    },
    {
      name: "Напруга холостого ходу, (В)",
      description: "39,33",
    },
    {
      name: "Струм короткого замикання Iк.з. (A) ",
      description: "1722х1134х30",
    },
    {
      name: "Рама",
      description: "Анодований алюміній",
    },
    {
      name: "Вага, (кг)",
      description: "120 Гц",
    },
    {
      name: "Напруга холостого ходу, (В)",
      description: "20,8",
    },
  ];

  const paymantData = [
    {
      img: "/images/paymants/google.svg",
      title: "google",
    },
    {
      img: "/images/paymants/apple.svg",
      title: "apple",
    },
    {
      img: "/images/paymants/privat.svg",
      title: "privat",
    },
    {
      img: "/images/paymants/visa.svg",
      title: "УкрСиббанк",
    },
    {
      img: "/images/paymants/master.svg",
      title: "УкрСиббанк",
    },
    {
      img: "/images/paymants/green.svg",
      title: "УкрСиббанк",
    },
    {
      img: "/images/paymants/yellow.svg",
      title: "УкрСиббанк",
    },
  ];

  // Computed values
  const productImages = useMemo(() => {
    if (!product) return [];
    if (product.images) return product.images;
    if (product.image) {
      return Array.isArray(product.image) ? product.image : [product.image];
    }
    return ["/images/placeholder.png"];
  }, [product]);

  // Functions
  const toggleInstallationPopup = () => {
    setShowInstallationPopup(!showInstallationPopup);
  };

  const closeInstallationPopup = () => {
    setShowInstallationPopup(false);
  };

  const confirmInstallation = () => {
    if (addInstallation) {
      if (!installationDetails.companyName || !installationDetails.address) {
        alert("Будь ласка, заповніть обов'язкові поля");
        return;
      }
    }
    setShowInstallationPopup(false);
  };

  const changeProductCount = (action) => {
    if (action === "+") {
      setProductCount(prev => prev + 1);
    } else if (action === "-") {
      if (productCount > 1) {
        setProductCount(prev => prev - 1);
      }
    }
  };

  const getTypeRoute = (type) => {
    const typeToRoute = {
      "Сонячні Панелі": "/solar-panels",
      Батареї: "/batteries",
      "Cables, Chargers & Powerbanks": "/cables",
      Інвертори: "/inverters",
      SolarSets: "/solar-sets",
      "Система монтажу сонячних панелей": "/mounting-systems",
      "Швидкі Зарядні Станції (DC)": "/dc-charging-stations",
      "Зарядні Станції Рівня 2 (AC)": "/ac-charging-stations",
      "Портативні/Мобільні Зарядні Пристрої": "/portable-charging-devices",
      "Портативна електростанція": "/portable-power-stations",
    };
    return typeToRoute[type] || "/catalogue";
  };

  const addToCart = () => {
    if (product) {
      const cartItem = {
        id: product.id,
        title: product.defaultName || product.name,
        price: product.price,
        image: productImages[0] || "/images/placeholder.png",
        quantity: productCount,
        installation: addInstallation ? installationDetails : null,
      };
      
      // Replace with your cart store logic
      console.log('Adding to cart:', cartItem);
      alert(
        `Added ${productCount} ${
          product.title || product.defaultName
        } to cart${addInstallation ? " with installation" : ""}`
      );
    }
  };

  // Replace getProduct with store-based logic
  const getProduct = async () => {
    let foundProduct = store.getProductById(Number(id));
    if (foundProduct) {
      setProduct(foundProduct);
      if (foundProduct.images && foundProduct.images.length > 0) {
        setSelectedImage(foundProduct.images[0]);
      } else if (foundProduct.image) {
        setSelectedImage(Array.isArray(foundProduct.image) 
          ? foundProduct.image[0] 
          : foundProduct.image);
      } else {
        setSelectedImage("/images/placeholder.png");
      }
    } else {
      // Try to fetch from API if not in store
      const fetched = await store.fetchProductById(Number(id));
      if (fetched) {
        setProduct(fetched);
        if (fetched.images && fetched.images.length > 0) {
          setSelectedImage(fetched.images[0]);
        } else if (fetched.image) {
          setSelectedImage(Array.isArray(fetched.image) 
            ? fetched.image[0] 
            : fetched.image);
        } else {
          setSelectedImage("/images/placeholder.png");
        }
      } else {
        setProduct(null);
        setSelectedImage("/images/placeholder.png");
        console.warn(`Product with ID ${id} not found.`);
      }
    }
  };

  const updatePageLayout = () => {
    document.documentElement.style.setProperty('--header-offset', '150px');
  };

  // Effects
  useEffect(() => {
    getProduct();
    updatePageLayout();
    
    setTimeout(() => {
      const breadcrumb = document.querySelector('.breadcrumb');
      if (breadcrumb) {
        breadcrumb.style.visibility = 'visible';
        breadcrumb.style.opacity = '1';
      }
    }, 100);
  }, [id]);

  const handleInstallationDetailsChange = (field, value) => {
    setInstallationDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <nav className="breadcrumb ml-8 w-full">
        <Link to="/">Головна</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to={getTypeRoute(product?.type)}>
          {product?.type || "Категорії"}
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="current-page">
          {product?.title || "Інформація про товар"}
        </span>
      </nav>

      <div className="product-container">
        {/* Image Gallery */}
        <div className="product-image-section">
          {product && (
            <>
              <div className="product-gallery">
                <div className="thumbnail-list">
                  {productImages.map((img, index) => (
                    <div
                      key={index}
                      className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <img src={img} alt={`Product Thumbnail ${index + 1}`} />
                    </div>
                  ))}
                </div>
                <div className="main-image-container">
                  <img
                    src={selectedImage || productImages[0] || '/images/placeholder.png'}
                    alt={product.title || product.name}
                    className="product-image"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Product Info Section */}
        {product && (
          <div className="product-info-section">
            <div className="about-product-head flex justify-between">
              <div className="product-availability in-stock">В наявності</div>
              <div className="code">Код: <span>12743</span></div>
            </div>
            <h1 className="product-title mt-3">{product.defaultName}</h1>
            <div className="product-meta">
              <div className="product-brand">
                <span className="meta-label">Бренд:</span>
                <span className="meta-value">{product.brand}</span>
              </div>
              <div className="product-model">
                <span className="meta-label">Модель:</span>
                <span className="meta-value">{product.model || product.defaultName}</span>
              </div>
            </div>
            <div className="product-price">
              <span className="product-price-discount">64 543 ₴</span>
              <span className="discount ml-2">-5%</span>
              <div className="real-price mt-1">57 999 ₴</div>
              <div className="credits-price flex items-center">
                <img src="/images/calender.svg" alt="" />
                <span className="credit-price ml-2 mr-2">від 580 ₴/міс</span>
                <span className="credit">в кредит</span>
              </div>
            </div>
            <div className="add-to-cart-section">
              <div className="quantity-controls">
                <button onClick={() => changeProductCount('-')} className="quantity-btn">-</button>
                <span className="quantity-display">{productCount}</span>
                <button onClick={() => changeProductCount('+')} className="quantity-btn">+</button>
              </div>
              <button onClick={addToCart} className="add-to-cart-btn mt-3">
                <img className="mr-2" src="/images/cart-2.svg" alt="" width="20" height="17" />
                Додати в кошик
              </button>
            </div>
            <div className="product-tabs">
              <div className="tab-headers">
                <button className="tab-btn active">Опис</button>
                <button className="tab-btn">Характеристики</button>
              </div>
              <div className="tab-content">
                <div className="description-tab">
                  <p>Опис продукту тут...</p>
                </div>
                <div className="specifications-tab">
                  <div className="spec-item">
                    <span className="spec-label">Номінальна потужність, (Вт):</span>
                    <span className="spec-value">435</span>
                  </div>
                  {/* Add more spec items as needed */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Installation Popup (Modal) */}
      {showInstallationPopup && (
        <div className="installation-popup-overlay" onClick={closeInstallationPopup}>
          <div className="installation-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Замовлення встановлення</h3>
              <button className="close-btn" onClick={closeInstallationPopup}>×</button>
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
                      onChange={(e) => handleInstallationDetailsChange('companyName', e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Адреса <span className="required-indicator">*</span></label>
                    <input 
                      type="text" 
                      value={installationDetails.address}
                      onChange={(e) => handleInstallationDetailsChange('address', e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Примітки</label>
                    <textarea 
                      value={installationDetails.notes}
                      onChange={(e) => handleInstallationDetailsChange('notes', e.target.value)}
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
              <button className="cancel-btn" onClick={closeInstallationPopup}>Скасувати</button>
              <button className="confirm-btn" onClick={confirmInstallation}>Підтвердити</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
