
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
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

  // Mock data - replace with your actual store/API calls
  const mockProducts = [
    {
      id: 1,
      defaultName: "Сонячна панель Victron Energy 435W",
      name: "Сонячна панель Victron Energy 435W",
      type: "Сонячні Панелі",
      price: 57999,
      brand: "Victron Energy",
      model: "435W Solar Panel",
      quantity: 1,
      images: [
        "/images/solar-panel-1.jpg",
        "/images/solar-panel-2.jpg",
        "/images/solar-panel-3.jpg"
      ]
    }
  ];

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

  const getProduct = () => {
    const foundProduct = mockProducts.find(product => +product.id === +id);
    
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
      console.warn(`Product with ID ${id} not found.`);
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
    <div className="product-page-container flex flex-col justify-center items-center">
      {/* Fixed Breadcrumb */}
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

      <div className="flex flex-col xl:flex-row">
        <div className="product-containew p-4">
          {product && (
            <div className="product-content">
              <div className="product-gallery">
                {/* Thumbnail Gallery */}
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

                {/* Main Product Image */}
                <div className="main-image-container">
                  <img
                    src={selectedImage || productImages[0] || '/images/placeholder.png'}
                    alt={product.title || product.name}
                    className="main-image"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="p-4 diviwer mt-6 mb-6"></div>

          <div className="product-characteristics">
            {productCharacteristics.map((item, i) => (
              <div key={i} className="">
                <div className="product-characteristic p-[17px] flex gap-3 my-2">
                  <img src={item.src} alt="" />
                  <div className="">
                    <div className="characteristics-name">{item.name}</div>
                    <div className="characteristics-description">
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Installation Button with Popup */}
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
          <div className="social flex gap-1">
            <button><img src="/images/facebook.svg" alt="" /></button>
            <button><img src="/images/tg.svg" alt="" /></button>
            <button><img src="/images/soc.svg" alt="" /></button>
          </div>
        </div>

        {product && (
          <div className="about-product p-4">
            <div className="about-product-head flex justify-between">
              <div className="availability">В наявності</div>
              <div className="code">Код: <span>12743</span></div>
            </div>
            
            <h2 className="product-name mt-3">{product.defaultName}</h2>
            
            <div className="certification flex items-center mt-6">
              <img src="/images/certification-Icon.svg" alt="" />
              <div className="ml-2">Сертифікований товар.</div>
              <a href="/">Дивитись сертифікат</a>
            </div>

            <div className="product-boxes flex flex-wrap mt-6">
              {productBoxes.map((box, index) => (
                <div key={index} className="product-boxe flex items-center mt-2 mr-2">
                  <img className="mr-2" src={box.img} alt="" />
                  <div className="">{box.title}</div>
                </div>
              ))}
            </div>

            <div className="p-4 diviwer mt-6 mb-6"></div>
            
            <div className="product-price">
              <div className="flex items-center">
                <span className="product-price-discount">64 543 ₴</span>
                <span className="discount ml-2">-5%</span>
              </div>
              <div className="real-price mt-1">57 999 ₴</div>
              <div className="credits-price flex items-center">
                <img src="/images/calender.svg" alt="" />
                <span className="credit-price ml-2 mr-2">від 580 ₴/міс</span>
                <span className="credit">в кредит</span>
              </div>
            </div>

            <div className="p-4 diviwer mt-6 mb-6"></div>
            
            <div className="product-sizes">
              <span>Разміри сонячної батареї, (мм)</span>
              <div className="mt-3 product-sizes-buttons">
                {productSizes.map((size, i) => (
                  <button
                    key={size.id}
                    onClick={() => setSizeButton(size)}
                    className={sizeButton.id === size.id ? 'active' : ''}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
            </div>

            <div className="garanty">
              <h4 className="h4">Гарантія та доставка:</h4>
              <div className="garanty-data mt-3">
                {garantyData.map((garanty, i) => (
                  <div key={i} className="flex items-center mt-6">
                    <img className="mr-3" src={garanty.img} alt="" />
                    <span>{garanty.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="payments-data mt-6">
              <h3>Оплату можна здійснити:</h3>
              <div className="flex flex-wrap">
                {paymantData.map((item, i) => (
                  <div key={i} className="paymant">
                    <button><img src={item.img} alt="" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="main-characters mt-[63px]">
              <h3>Основні характеристики</h3>
              <div className="main-characters-data mt-8">
                {mainCharacters.map((item, i) => (
                  <div
                    key={i}
                    className="characters-data p-8 flex items-center justify-between xl:justify-start flex-wrap"
                  >
                    <span>{item.name}</span>
                    <div>{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product Information Section */}
            <div className="product-info-section mt-8">
              <h3>Інформація про товар</h3>
              <table className="info-table">
                <tbody>
                  <tr>
                    <th>Кількість</th>
                    <td>{product.quantity || "1"}</td>
                  </tr>
                  <tr>
                    <th>Бренд</th>
                    <td>{product.brand}</td>
                  </tr>
                  <tr>
                    <th>Модель</th>
                    <td>{product.model || product.defaultName}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="add-to-card mt-5 flex items-center justify-between xl:justify-start">
          <div className="product-counter flex items-center justify-between">
            <button onClick={() => changeProductCount('-')}>
              <img src="/images/dash.svg" alt="" />
            </button>
            <input 
              value={productCount} 
              onChange={(e) => setProductCount(parseInt(e.target.value) || 1)}
            />
            <button onClick={() => changeProductCount('+')}>
              <img src="/images/plus.svg" alt="" />
            </button>
          </div>
          <div className="add-to-card-button xl:ml-4">
            <button
              onClick={addToCart}
              className="flex items-center justify-center xl:w-[580px]"
            >
              <img
                className="mr-2"
                src="/images/cart-2.svg"
                alt=""
                width="20"
                height="17"
              />
              <p>Додати в кошик</p>
            </button>
          </div>
        </div>
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
