import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useNavigate, useLocation } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const HomeView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Get current region from URL or default to 'ua'
  const region = location.pathname.split('/')[1] || 'ua';
  
  // State management
  const [ads, setAds] = useState([]);
  const [promotionCategories, setPromotionCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Mock data for categories
  const solarCategories = [
    {
      id: 1,
      name: t("homeView.solarPanels"),
      slug: "solar-panels",
      image: "/images/HomeView/solar-farm.png",
    },
    {
      id: 2,
      name: t("homeView.batteries"),
      slug: "batteries",
      image: "/images/HomeView/solar-battery.png",
    },
    {
      id: 3,
      name: t("homeView.inverters"),
      slug: "inverters",
      image: "/images/HomeView/інвертер.png",
    },
    {
      id: 4,
      name: t("homeView.solarSets"),
      slug: "Sets-of-solar-power-plants",
      image: "/images/HomeView/комплект-сонячних.png",
    },
    {
      id: 5,
      name: t("homeView.mountingSystems"),
      slug: "mounting-systems",
      image: "/images/HomeView/solar-mount-system.png",
    },
  ];

  const evChargerItems = [
    {
      id: 1,
      name: t("homeView.dcChargingStations"),
      slug: "dc-charging-stations",
      image: "/images/HomeView/ev-charger-city.png",
    },
    {
      id: 2,
      name: t("homeView.acChargingStations"),
      slug: "ac-charging-stations",
      image: "/images/HomeView/otcta-стійка-02.png",
    },
    {
      id: 3,
      name: t("homeView.portableChargingDevices"),
      slug: "portable-charging-devices",
      image: "/images/HomeView/ev-charger-city.png",
    },
  ];

  const newCategories = [
    {
      id: 1,
      name: t("homeView.portablePowerStation"),
      slug: "Портативна електростанція",
      image: "/images/HomeView/solar-panel.png",
    },
    {
      id: 2,
      name: t("homeView.solarGenerators"),
      slug: "charging",
      image: "/images/HomeView/Charging-station-ND-EVC-UR40.jpg",
    },
    {
      id: 3,
      name: t("homeView.portableSolarPanels"),
      slug: "portable-solar-panels",
      image: "/images/Categories/portable.solar.panels/Портативні-Сонячні-панелі-Jackery-SolarSaga-100W.png",
    },
    {
      id: 4,
      name: t("homeView.cablesAndWires"),
      slug: "cables-wires",
      image: "/images/HomeView/Electrical-cables-and-wires.jpg",
    },
  ];

  const categories = [
    {
      id: 1,
      name: t("homeView.generators"),
      slug: "generators",
      image: "/images/HomeView/генератори.png",
    },
    {
      id: 2,
      name: t("homeView.industrialGenerators"),
      slug: "industrial-generators",
      image: "/images/HomeView/Промислові-генератори-для-важких-навантажень.png",
    },
    {
      id: 3,
      name: t("homeView.solarLightingTowers"),
      slug: "solar-lighting-towers",
      image: "/images/HomeView/Освітлювальні-вежі-на-сонячних-батареях.png",
    },
    {
      id: 4,
      name: t("homeView.liftsAndCranes"),
      slug: "lifts-and-cranes",
      image: "/images/Categories/rent/lifts.png",
    },
  ];

  // Methods
  const handleCategoryClick = (slug) => {
    // Map specific categories to new consistent routes
    const categoryMap = {
      'solar-panels': 'solar-systems',
      'batteries': 'solar-systems',
      'inverters': 'solar-systems',
      'Sets-of-solar-power-plants': 'solar-systems',
      'mounting-systems': 'solar-systems',
      'dc-charging-stations': 'ev-chargers',
      'ac-charging-stations': 'ev-chargers',
      'portable-charging-devices': 'ev-chargers',
      'Портативна електростанція': 'new-categories',
      'charging': 'new-categories',
      'portable-solar-panels': 'new-categories',
      'cables-wires': 'new-categories'
    };
    
    const mappedSlug = categoryMap[slug] || slug.toLowerCase().replace(/ /g, '-');
    navigate(`/${region}/${mappedSlug}`);
  };

  const fetchAds = async () => {
    try {
      console.log("Fetching ads...");
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  const fetchPromotionCategories = async () => {
    setPromotionCategories([
      { id: 1, name: t("homeView.solarPanels") },
      { id: 2, name: t("homeView.dcChargingStations") },
      { id: 3, name: t("homeView.batteries") },
      { id: 4, name: t("homeView.cablesAndWires") },
    ]);
  };

  const fetchProducts = async () => {
    try {
      console.log("Fetching products...");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchAds();
    fetchPromotionCategories();
    fetchProducts();
  }, []);

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'white', minHeight: '100vh' }}>
      {/* Hero Carousel Section */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 15px', marginBottom: '40px' }}>
        <section style={{ marginBottom: '40px' }}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            style={{
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
          >
            <SwiperSlide>
              <div style={{
                position: 'relative',
                height: 'clamp(300px, 50vh, 400px)',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}>
                <div style={{
                  textAlign: 'center',
                  color: 'white',
                  padding: 'clamp(20px, 4vw, 40px)'
                }}>
                  <h1 style={{ 
                    fontSize: 'var(--font-size-h1)', 
                    marginBottom: 'var(--spacing-md)', 
                    fontWeight: 'bold',
                    lineHeight: '1.2'
                  }}>
                    {t("homeView.heroTitle", "ScaleVolt Store")}
                  </h1>
                  <p style={{ 
                    fontSize: 'var(--font-size-body)', 
                    marginBottom: 'var(--spacing-lg)', 
                    opacity: 0.9,
                    lineHeight: '1.4'
                  }}>
                    {t("homeView.heroSubtitle", "Your trusted partner for solar energy solutions")}
                  </p>
                  <button
                    onClick={() => navigate(`/${region}/products`)}
                    style={{
                      backgroundColor: 'white',
                      color: '#667eea',
                      border: 'none',
                      padding: 'clamp(12px, 3vw, 15px) clamp(24px, 6vw, 30px)',
                      borderRadius: '25px',
                      fontSize: 'var(--font-size-body)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      minHeight: '44px',
                      minWidth: '120px'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {t("homeView.shopNow", "Shop Now")}
                  </button>
                </div>
              </div>
            </SwiperSlide>
            
            <SwiperSlide>
              <div style={{
                position: 'relative',
                height: 'clamp(300px, 50vh, 400px)',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              }}>
                <div style={{
                  textAlign: 'center',
                  color: 'white',
                  padding: 'clamp(20px, 4vw, 40px)'
                }}>
                  <h1 style={{ 
                    fontSize: 'var(--font-size-h1)', 
                    marginBottom: 'var(--spacing-md)', 
                    fontWeight: 'bold',
                    lineHeight: '1.2'
                  }}>
                    {t("homeView.evChargingTitle", "EV Charging Solutions")}
                  </h1>
                  <p style={{ 
                    fontSize: 'var(--font-size-body)', 
                    marginBottom: 'var(--spacing-lg)', 
                    opacity: 0.9,
                    lineHeight: '1.4'
                  }}>
                    {t("homeView.evChargingSubtitle", "Fast and reliable electric vehicle charging stations")}
                  </p>
                  <button
                    onClick={() => navigate(`/${region}/ev-chargers`)}
                    style={{
                      backgroundColor: 'white',
                      color: '#f5576c',
                      border: 'none',
                      padding: 'clamp(12px, 3vw, 15px) clamp(24px, 6vw, 30px)',
                      borderRadius: '25px',
                      fontSize: 'var(--font-size-body)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      minHeight: '44px',
                      minWidth: '120px'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {t("homeView.learnMore", "Learn More")}
                  </button>
                </div>
              </div>
            </SwiperSlide>
            
            <SwiperSlide>
              <div style={{
                position: 'relative',
                height: '400px',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
              }}>
                <div style={{
                  textAlign: 'center',
                  color: 'white',
                  padding: '40px'
                }}>
                  <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: 'bold' }}>
                    {t("homeView.solarTitle", "Solar Energy Systems")}
                  </h1>
                  <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>
                    {t("homeView.solarSubtitle", "Complete solar solutions for homes and businesses")}
                  </p>
                                     <button
                     onClick={() => navigate(`/${region}/solar-systems`)}
                     style={{
                       backgroundColor: 'white',
                       color: '#4facfe',
                       border: 'none',
                       padding: '15px 30px',
                       borderRadius: '25px',
                       fontSize: '1.1rem',
                       fontWeight: 'bold',
                       cursor: 'pointer',
                       transition: 'transform 0.3s ease'
                     }}
                     onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                     onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                   >
                     {t("homeView.exploreSolar", "Explore Solar")}
                   </button>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>
      </div>

      {/* Residential & Commercial Solar System Section */}
      <div style={{ 
        maxWidth: 'var(--container-max-width)', 
        margin: '0 auto', 
        padding: '0 var(--spacing-sm)' 
      }}>
        <section style={{ 
          marginBottom: 'var(--spacing-xl)',
          padding: 'var(--spacing-sm) 0'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: 'var(--spacing-md) 0',
            marginBottom: 'var(--spacing-md)'
          }}>
            <h2 style={{ 
              color: '#333', 
              fontSize: 'var(--font-size-h3)',
              margin: 0,
              fontWeight: '600'
            }}>{t("homeView.residentialCommercialSolar")}</h2>
          </div>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-sm) 0'
          }}>
            {solarCategories.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  padding: 'var(--spacing-sm)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onClick={() => handleCategoryClick(item.slug)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{
                    width: '100%',
                    height: '120px',
                    objectFit: 'cover',
                    marginBottom: 'var(--spacing-sm)',
                    borderRadius: '8px'
                  }}
                />
                <h3 style={{ 
                  fontSize: 'var(--font-size-body)', 
                  color: '#333', 
                  margin: 0, 
                  padding: 0,
                  fontWeight: '500',
                  lineHeight: '1.3'
                }}>{item.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* EV Chargers & Components Section */}
        <section style={{ 
          marginBottom: 'var(--spacing-xl)',
          padding: 'var(--spacing-sm) 0'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: 'var(--spacing-md) 0',
            marginBottom: 'var(--spacing-md)'
          }}>
            <h2 style={{ 
              color: '#333', 
              fontSize: 'var(--font-size-h3)',
              margin: 0,
              fontWeight: '600'
            }}>{t("homeView.evChargersComponents")}</h2>
          </div>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-sm) 0'
          }}>
            {evChargerItems.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  padding: 'var(--spacing-sm)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onClick={() => handleCategoryClick(item.slug)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{
                    width: '100%',
                    height: '120px',
                    objectFit: 'cover',
                    marginBottom: 'var(--spacing-sm)',
                    borderRadius: '8px'
                  }}
                />
                <h3 style={{ 
                  fontSize: 'var(--font-size-body)', 
                  color: '#333', 
                  margin: 0, 
                  padding: 0,
                  fontWeight: '500',
                  lineHeight: '1.3'
                }}>{item.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Explore New Category Section */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
            <h2 style={{ color: '#333', fontSize: '17px' }}>{t("homeView.exploreNewCategories")}</h2>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            flexWrap: 'wrap' 
          }}>
            {newCategories.map((newCategory) => (
              <div
                key={newCategory.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  padding: '10px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  flex: '1 1 200px',
                }}
                onClick={() => handleCategoryClick(newCategory.slug)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.03)';
                  e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                }}
              >
                <img 
                  src={newCategory.image} 
                  alt={newCategory.name} 
                  style={{
                    display: 'block',
                    width: '100%',
                    maxHeight: '150px',
                    objectFit: 'contain',
                    margin: '0 auto',
                    borderBottom: '1px solid #e0e0e0',
                    paddingBottom: '10px',
                  }}
                />
                <h3 style={{ marginTop: '10px', fontSize: '18px', color: '#333' }}>{newCategory.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Category Section */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
            <h2 style={{ color: '#333', fontSize: '17px' }}>{t("homeView.rental")}</h2>
            <button 
              style={{
                backgroundColor: '#ff4f5a',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                textDecoration: 'none',
                fontSize: '14px',
              }}
              onClick={() => navigate(`/${region}/categories`)}
            >
              {t("homeView.seeAll")}
            </button>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
            gap: '20px' 
          }}>
            {categories.map((category) => (
              <div
                key={category.id}
                style={{
                  backgroundColor: '#f9f9f9',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                }}
                onClick={() => handleCategoryClick(category.slug)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                  }}
                />
                <h3 style={{ fontSize: '16px', color: '#333', margin: '10px 0' }}>{category.name}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeView;