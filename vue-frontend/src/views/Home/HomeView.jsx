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
  
  // Mock data (same as your Vue component)
  const moks = [
    {
      id: 14,
      documentId: "oy4o1x84z31mc2e05p7n69cv",
      createdAt: "2025-04-01T12:15:36.782Z",
      updatedAt: "2025-04-01T16:10:08.020Z",
      publishedAt: "2025-04-01T16:10:08.029Z",
      name: "homeView.solarPanels",
      slug: "solar-panels",
      image: "/images/HomeView/solar-farm.png",
    },
    {
      id: 15,
      documentId: "k8cymlf3kc9pil83n129njqk",
      createdAt: "2025-04-01T12:15:51.690Z",
      updatedAt: "2025-04-01T16:10:18.971Z",
      publishedAt: "2025-04-01T16:10:18.978Z",
      name: "homeView.batteries",
      slug: "batteries",
      image: "/images/HomeView/solar-battery.png",
    },
    {
      id: 16,
      documentId: "kdn2s5lmyxhtdrpa84fewre1",
      createdAt: "2025-04-01T12:16:13.132Z",
      updatedAt: "2025-04-01T16:10:49.808Z",
      publishedAt: "2025-04-01T16:10:49.817Z",
      name: "homeView.inverters",
      slug: "inverters",
      image: "/images/HomeView/інвертер.png",
    },
    {
      id: 17,
      documentId: "eu3drvd6vsicxxdztfz2ibia",
      createdAt: "2025-04-01T14:41:57.149Z",
      updatedAt: "2025-04-01T16:11:00.521Z",
      publishedAt: "2025-04-01T16:11:00.526Z",
      name: "homeView.solarSets",
      slug: "Sets-of-solar-power-plants",
      image: "/images/HomeView/комплект-сонячних.png",
    },
    {
      id: 18,
      documentId: "r1x51mh7tvppbi2g5sr7fa6k",
      createdAt: "2025-04-01T14:42:39.377Z",
      updatedAt: "2025-04-01T16:11:10.566Z",
      publishedAt: "2025-04-01T16:11:10.573Z",
      name: "homeView.mountingSystems",
      slug: "mounting-systems",
      image: "/images/HomeView/solar-mount-system.png",
    },
  ];
  
  const [solarisCategories, setSolarisCategories] = useState(moks);

  // Computed values (converted from Vue computed properties)
  const solarSystemItems = useMemo(() => [
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
      id: 6,
      name: t("homeView.mountingSystems"),
      slug: "mounting-systems",
      image: "/images/HomeView/solar-mount-system.png",
    },
  ], [t]);

  const evChargerItems = useMemo(() => [
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
  ], [t]);

  const newCategories = useMemo(() => [
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
  ], [t]);

  const categories = useMemo(() => [
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
  ], [t]);

  const carouselSlides = useMemo(() => [
    {
      type: "gif",
      src: "/videos/carousel/Self-Sustaining-Smart-Home.gif",
      title: t("homeView.solarPanels"),
      description: t("homeView.carousel.solarPanelsDesc"),
    },
    {
      type: "gif",
      src: "/videos/carousel/ev.chargers.gif",
      title: t("homeView.evChargersComponents"),
      description: t("homeView.carousel.evChargersDesc"),
    },
    {
      type: "gif",
      src: "/videos/carousel/portable.panels.gif",
      title: t("homeView.portableSolarPanels"),
      description: t("homeView.carousel.portablePanelsDesc"),
    },
  ], [t]);

  const minSlidesForLoop = 4; // For slidesPerView=1, Swiper needs at least 4 for loop mode

  // Methods converted from Vue
  const getCategoryRoute = (slug) => {
    return `/${slug.toLowerCase().replace(/ /g, "-")}`;
  };

  const handleCategoryClick = (slug) => {
    navigate(`/${region}/${slug.toLowerCase().replace(/ /g, '-')}`);
  };

  const fetchAds = async () => {
    try {
      // Your ad fetching logic here
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
      // Your product fetching logic here
      console.log("Fetching products...");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Effects (converted from Vue mounted)
  useEffect(() => {
    // Uncomment these when you have the services ready
    // fetchAds();
    // fetchPromotionCategories();
    // fetchProducts();
  }, []);

  // Initialize Intercom (if needed)
  useEffect(() => {
    // You can initialize Intercom here if needed
    // window.Intercom && window.Intercom('boot', { app_id: 'mm6ivt97' });
  }, []);

  return (
    <div className="home-view">
      {/* Residential & Commercial Solar System Section */}
      <div className="page-container">
        <section className="product-segment">
          <div className="section-header">
            <h2>{t("homeView.residentialCommercialSolar")}</h2>
          </div>
          <div className="product-segment-grid">
            {solarisCategories.map((item) => (
              <div
                key={item.id}
                className="product-segment-card promo-box"
                onClick={() => handleCategoryClick(item.slug)}
              >
                <img src={item.image} alt={item.name} />
                <h3>{t(item.name)}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* EV Chargers & Components Section */}
      <div className="page-container">
        <section className="product-segment">
          <div className="section-header">
            <h2>{t("homeView.evChargersComponents")}</h2>
          </div>
          <div className="product-segment-grid">
            {evChargerItems.map((item) => (
              <div
                key={item.id}
                className="product-segment-card promo-box"
                onClick={() => handleCategoryClick(item.slug)}
              >
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Carousel Section */}
      <div className="page-container">
        <section className="carousel-section">
          {carouselSlides.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              slidesPerView={1}
              loop={carouselSlides.length >= minSlidesForLoop}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              navigation
              pagination
              className="carousel-container"
            >
              {carouselSlides.map((slide, index) => (
                <SwiperSlide key={index}>
                  {slide.type === 'video' ? (
                    <video
                      src={slide.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="carousel-video"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={slide.src} alt={slide.title} />
                  )}
                  <div className="slide-content">
                    <h2>{slide.title}</h2>
                    <p>{slide.description}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div style={{textAlign: 'center', padding: '2rem', color: '#888'}}>
              No slides available
            </div>
          )}
        </section>
      </div>

      {/* Explore New Category Section */}
      <div className="page-container">
        <section className="new-category-section">
          <div className="section-header">
            <h2>{t("homeView.exploreNewCategories")}</h2>
          </div>
          <div className="new-category-grid">
            {newCategories.map((newCategory) => (
              <div
                key={newCategory.id}
                className="new-category-card promo-box"
                onClick={() => handleCategoryClick(newCategory.slug)}
              >
                <img src={newCategory.image} alt={newCategory.name} />
                <h3>{newCategory.name}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Category Section */}
      <div className="page-container">
        <section className="category-section">
          <div className="section-header">
            <h2>{t("homeView.rental")}</h2>
            <button 
              className="see-all-button"
              onClick={() => navigate(`/${region}/categories`)}
            >
              {t("homeView.seeAll")}
            </button>
          </div>
          <div className="categories-grid">
            {categories.length === 0 ? (
              <div>No categories found</div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="category-card promo-box"
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  <img src={category.image} alt={category.name} />
                  <h3>{category.name}</h3>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <style>{`
        /* All your original CSS styles - EXACTLY the same */
        .home-view {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background-color: white;
          margin: 0;
          padding: 0;
          padding-top: 80px;
        }

        .page-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 15px;
          box-sizing: border-box;
        }

        .top-grid-section {
          padding: 20px;
          background-color: #f0f4f8;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin: 0;
          padding: 5px 5px;
        }

        @media (max-width: 768px) {
          .grid-container {
            grid-template-columns: 1fr;
          }
        }

        .carousel-section {
          position: relative;
          width: 100%;
          height: 400px;
          margin-bottom: 40px;
        }

        .carousel-container {
          width: 100%;
          height: 100%;
        }

        .carousel-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .carousel-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .carousel-video {
          object-position: center;
          background-color: #000;
        }

        .swiper-slide {
          height: 400px;
          overflow: hidden;
          position: relative;
        }

        .slide-content {
          position: absolute;
          bottom: 30px;
          left: 30px;
          max-width: 60%;
          color: #fff;
          background: rgba(0, 0, 0, 0.6);
          padding: 20px;
          border-radius: 8px;
          z-index: 10;
        }

        .slide-content h2 {
          font-size: 24px;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .slide-content p {
          font-size: 16px;
          line-height: 1.4;
        }

        .swiper-button-next,
        .swiper-button-prev {
          color: #fff;
        }

        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.7);
        }

        .swiper-pagination-bullet-active {
          background: #fff;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
        }

        .section-header h2 {
          color: #333;
          font-size: 17px;
        }

        .new-category-section,
        .category-section {
          padding: 40px 0px;
        }

        .new-category-grid {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .new-category-card,
        .category-card {
          background-color: white;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          text-align: center;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          flex: 1 1 200px;
        }

        .new-category-card img,
        .category-card img {
          display: block;
          width: 100%;
          max-height: 150px;
          object-fit: contain;
          margin: 0 auto;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 10px;
        }

        .new-category-card h3,
        .category-card h3 {
          margin-top: 10px;
          font-size: 18px;
          color: #333;
        }

        .new-category-card:hover,
        .category-card:hover,
        .promo-box:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 20px;
        }

        .category-card {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          text-align: center;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .category-card:hover {
          transform: scale(1.05);
        }

        .promo-box {
          background-color: white;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          text-align: center;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          text-decoration: none;
          color: inherit;
        }

        .promo-box img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-bottom: 1px solid #e0e0e0;
        }

        .promo-box h3 {
          font-size: 16px;
          color: #333;
          margin: 10px 0;
        }

        .new-category-card,
        .category-card {
          display: block;
          text-decoration: none;
          color: inherit;
        }

        .see-all-button {
          background-color: #ff4f5a;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          text-decoration: none;
          font-size: 14px;
        }

        .see-all-button:hover {
          background-color: #e04350;
        }

        .product-segment-grid,
        .new-category-grid,
        .categories-grid {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
          padding: 10px 0;
        }

        .product-segment-card {
          flex: 0 0 auto;
          width: 200px;
          min-height: 280px;
          box-sizing: border-box;
          text-decoration: none;
          color: inherit;
          background-color: white;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          text-align: center;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .product-segment-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          margin-bottom: 10px;
          border-bottom: 1px solid #e0e0e0;
        }

        .product-segment-card h3 {
          font-size: 16px;
          color: #333;
          margin: 0;
          padding: 0;
        }

        .product-segment-card:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .new-category-card.promo-box img,
        .category-card.promo-box img {
          object-fit: contain !important;
          height: auto !important;
          max-height: 150px !important;
        }
      `}</style>
    </div>
  );
};

export default HomeView;