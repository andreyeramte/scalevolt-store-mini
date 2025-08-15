import React, { useState, useEffect, useRef } from 'react';
import useUserStore from '../../stores/user';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import './Header.css';
// You'll need to convert your SearchBar component to React
// import SearchBar from './SearchBar';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // State variables
  const [menuVisible, setMenuVisible] = useState(false);
  const [regionMenuVisible, setRegionMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchProducts, setSearchProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('solar');
  const [currentCurrency, setCurrentCurrency] = useState(
    localStorage.getItem('userCurrency') || 'UAH'
  );
  
  // Refs
  const headerRef = useRef(null);
  
  // Mock cart state, but get user from Zustand store
  const [cartCount, setCartCount] = useState(0);
  const user = useUserStore(state => state.user);
  
  // Computed properties as regular variables
  const isHomePage = location.pathname === '/';
  const currentLocale = i18n.language || 'ua';
  
  // Get current region from URL or default to 'ua'
  const region = location.pathname.split('/')[1] || 'ua';
  
  // Update CSS variable to reflect header height
  const updateHeaderHeight = () => {
    const root = document.documentElement;
    const headerContainer = headerRef.current;
    
    if (headerContainer) {
      // Get actual header height
      const headerHeight = headerContainer.offsetHeight;
      
      // Set the CSS variable
      root.style.setProperty('--header-height', `${headerHeight}px`);
      
      // Set different variable for mega menu positioning
      const menuTopPosition = window.innerWidth < 768 ? headerHeight : 110;
      root.style.setProperty('--menu-top-position', `${menuTopPosition}px`);
      
      // Force mobile icons to display properly
      if (window.innerWidth < 768) {
        const mobileIcons = document.querySelectorAll('.mobile-icon');
        mobileIcons.forEach(icon => {
          icon.style.display = 'flex';
        });
      }
      
      // Update breadcrumbs position if they exist
      const breadcrumbsContainer = document.querySelector('.breadcrumbs-container');
      if (breadcrumbsContainer) {
        breadcrumbsContainer.style.display = 'block';
        breadcrumbsContainer.scrollLeft = 0; // Reset horizontal scroll position
      }
      
      // If on product page, update its padding
      const productPage = document.querySelector('.product-page-container');
      if (productPage) {
        productPage.style.paddingTop = `${headerHeight + 10}px`;
      }
    }
  };
  
  // Currency functions
  const selectCurrency = (currency) => {
    setCurrentCurrency(currency);
    localStorage.setItem('userCurrency', currency);
  };
  
  // Toggle functions
  const toggleMenu = (event) => {
    if (event) event.stopPropagation();
    setMenuVisible(!menuVisible);
    // Close region menu if open
    if (regionMenuVisible) setRegionMenuVisible(false);
    // Close search if open
    if (searchVisible) setSearchVisible(false);
  };
  
  const toggleRegionMenu = (event) => {
    if (event) event.stopPropagation();
    setRegionMenuVisible(!regionMenuVisible);
    // Close hamburger menu if open
    if (menuVisible) setMenuVisible(false);
    // Close search if open
    if (searchVisible) setSearchVisible(false);
  };
  
  const toggleSearch = (event) => {
    if (event) event.stopPropagation();
    setSearchVisible(!searchVisible);
    // Close hamburger menu if open
    if (menuVisible) setMenuVisible(false);
    // Close region menu if open
    if (regionMenuVisible) setRegionMenuVisible(false);
  };
  
  // Handler functions
  const handleMenuItemClick = () => {
    // Close the menu when an item is clicked
    setMenuVisible(false);
  };
  
  const closeMenusOnOutsideClick = (event) => {
    // Only close menus if click is outside the header element
    if (headerRef.current && !headerRef.current.contains(event.target)) {
      setMenuVisible(false);
      setRegionMenuVisible(false);
      setSearchVisible(false);
    }
  };
  
  const selectRegion = (region) => {
    // Map 'uk' from UI to 'ua' for the i18n system
    const localeCode = region === 'uk' ? 'ua' : region;
    
    console.log("Changing locale to:", region, "-> mapping to locale code:", localeCode);
    
    // Update the i18n locale with the MAPPED code
    i18n.changeLanguage(localeCode);
    
    // Store in localStorage with the MAPPED code
    localStorage.setItem('userLocale', localeCode);
    
    // Update document language
    document.documentElement.setAttribute('lang', localeCode);
    
    // Dispatch event for components to listen
    window.dispatchEvent(
      new CustomEvent('locale-changed', {
        detail: { locale: localeCode },
      })
    );
    
    // Close the dropdown
    setRegionMenuVisible(false);
    
    // Optionally reload the page or navigate - depending on how your app handles locale changes
    // window.location.href = `${window.location.origin}/${localeCode}`;
  };
  
  const performSearch = () => {
    if (!searchQuery.trim()) return;
    
    console.log(`Performing search for: ${searchQuery}`);
    
    // Simple filtering of products
    const query = searchQuery.toLowerCase();
    const results = searchProducts.length > 0
      ? searchProducts.filter(p => p.name.toLowerCase().includes(query))
      : allProducts.filter(p => p.name.toLowerCase().includes(query));
    
    console.log(`Found ${results.length} results`);
    
    if (results.length > 0) {
      handleSearchSelected(results[0]);
    }
  };
  
  const handleSearchSelected = (product) => {
    navigate(`/products/${product.id}`);
    // Close search after selection
    setSearchVisible(false);
  };
  
  // Helper for category routing
  const getCategoryRoute = (slug) => {
    return `/${slug.toLowerCase().replace(/ /g, "-")}`;
  };
  
  // Lifecycle effects
  useEffect(() => {
    document.addEventListener('click', closeMenusOnOutsideClick);
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    
    // Check if this page load was from a language switch
    const isLanguageSwitch = localStorage.getItem('isLanguageSwitch');
    if (isLanguageSwitch === 'true') {
      // Clear the flag
      localStorage.removeItem('isLanguageSwitch');
      console.log('Page loaded after language switch');
    }
    
    // Add event listener for orientation changes
    window.addEventListener('orientationchange', () => {
      // Short delay to allow the browser to complete the orientation change
      setTimeout(updateHeaderHeight, 100);
    });
    
    // Add a CSS class to the body tag to handle mobile-specific styling
    if (window.innerWidth < 768) {
      document.body.classList.add('mobile-view');
    } else {
      document.body.classList.remove('mobile-view');
    }
    
    // Hide search bar on mobile by default
    if (window.innerWidth < 768) {
      setSearchVisible(false);
    } else {
      setSearchVisible(true); // Always visible on desktop
    }
    
    // Force update for product pages
    setTimeout(() => {
      const productPage = document.querySelector('.product-page-container');
      if (productPage) {
        updateHeaderHeight();
      }
    }, 500);
    
    // Debug i18n state
    console.log("Current locale on mount:", i18n.language);
    console.log("Sample translation:", t("header.menu.solarSystem"));
    
    // Cleanup function
    return () => {
      document.removeEventListener('click', closeMenusOnOutsideClick);
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('orientationchange', updateHeaderHeight);
    };
  }, [t, i18n]);
  
  // Example products for search
  const allProducts = [
    { id: 1, name: "Сонячна Панель A" },
    { id: 2, name: "Зарядка X" },
    { id: 3, name: "Автоматичний вимикач Y" },
  ];
  
  // Category data
  const solarSystemItems = [
    {
      id: 1,
      name: t("header.categories.solarPanels"),
      slug: "solar-panels",
      image: "/images/HomeView/solar-farm.png",
    },
    {
      id: 2,
      name: t("header.categories.batteries"),
      slug: "batteries",
      image: "/images/HomeView/solar-battery.png",
    },
    {
      id: 3,
      name: t("header.categories.inverters"),
      slug: "inverters",
      image: "/images/HomeView/інвертер.png",
    },
    {
      id: 4,
      name: t("header.categories.solarSets"),
      slug: "Sets-of-solar-power-plants",
      image: "/images/HomeView/комплект-сонячних.png",
    },
    {
      id: 6,
      name: t("header.categories.mountingSystems"),
      slug: "mounting-systems",
      image: "/images/HomeView/solar-mount-system.png",
    },
  ];

  // EV Charger Categories
  const evChargerItems = [
    {
      id: 1,
      name: t("header.categories.evChargers"),
      slug: "ev-chargers",
      image: "/images/HomeView/otcta-стійка-02.png",
    },
    {
      id: 2,
      name: t("header.categories.cablesAdapters"),
      slug: "cables-adapters",
      image: "/images/HomeView/electric-charging-adapters.png",
    },
    {
      id: 3,
      name: t("header.categories.chargingStations"),
      slug: "charging-stations",
      image: "/images/HomeView/ev-charger-city.png",
    },
  ];

  // Portable Power Categories
  const portablePowerItems = [
    {
      id: 1,
      name: t("header.categories.portablePowerStations"),
      slug: "portable-power-stations",
      image: "/images/HomeView/solar-panel.png",
    },
    {
      id: 2,
      name: t("header.categories.solarGenerators"),
      slug: "solar-generators",
      image: "/images/HomeView/Charging-station-ND-EVC-UR40.jpg",
    },
    {
      id: 3,
      name: t("header.categories.portableSolarPanels"),
      slug: "portable-solar-panels",
      image:
        "/images/Categories/portable.solar.panels/Портативні-Сонячні-панелі-Jackery-SolarSaga-100W.png",
    },
  ];

  // Generator Categories
  const generatorItems = [
    {
      id: 1,
      name: t("header.categories.generators"),
      slug: "generators",
      image: "/images/HomeView/генератори.png",
    },
    {
      id: 2,
      name: t("header.categories.industrialGenerators"),
      slug: "industrial-generators",
      image:
        "/images/HomeView/Промислові-генератори-для-важких-навантажень.png",
    },
    {
      id: 3,
      name: t("header.categories.solarLightingTowers"),
      slug: "solar-lighting-towers",
      image: "/images/HomeView/Освітлювальні-вежі-на-сонячних-батареях.png",
    },
  ];

  // Electrical Component Categories
  const electricalItems = [
    {
      id: 1,
      name: t("header.categories.automaticSwitches"),
      slug: "automatic-switches",
      image: "/images/HomeView/інвертер.png",
    },
    {
      id: 2,
      name: t("header.categories.cablesWires"),
      slug: "cables-wires",
      image: "/images/HomeView/Electrical-cables-and-wires.jpg",
    },
  ];
  
  return (
    <header className="header-container" ref={headerRef}>
      {/* Mobile Header (shown only on mobile devices) */}
      <div className="mobile-header">
        {/* Top Row: Logo and Icons */}
        <div className="mobile-top-row">
          {/* Left: Hamburger and Logo */}
          <div className="mobile-left-group">
            <div className="hamburger-container" onClick={(e) => toggleMenu(e)}>
              <button className="hamburger-menu" aria-label="Toggle Menu">
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
            <div className="logo-container">
              <Link to={`/${region}`}>
                <img src="/images/header/scalevolt-logo.png" alt="Scalevolt Logo" className="logo" />
              </Link>
            </div>
          </div>
          
          {/* Right: Icons */}
          <div className="mobile-right-group">
            {/* Language Selector */}
            <div className="mobile-language-selector">
              <LanguageSelector />
            </div>
            
            {/* Profile */}
            <div className="mobile-icon">
              {!user ? (
                <Link to={`/${region}/auth`}>
                  <img src="/images/header/profile-logo.svg" alt="Account" />
                </Link>
              ) : (
                <Link to={`/${region}/profile`}>
                  <img src="/images/header/profile-logo.svg" alt="Account" />
                </Link>
              )}
            </div>
            
            {/* Cart */}
            <div className="mobile-icon">
              <Link to={`/${region}/cart`}>
                <img src="/images/header/cart.svg" alt="Cart" />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Row: Search */}
        <div className="mobile-search-row">
          <div className="search-container-mobile">
            {/* Uncomment when you have converted SearchBar to React
            <SearchBar 
              className="my-search-bar full-width-search" 
              allProducts={searchProducts}
              onSearchSelected={handleSearchSelected} 
            /> */}
            {/* Temporary placeholder for SearchBar */}
            <input 
              type="text" 
              placeholder="Search..." 
              className="my-search-bar full-width-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performSearch()}
            />
          </div>
        </div>
      </div>
      
      {/* Desktop Header (shown only on desktop devices) */}
      <div className="desktop-header">
        <div className="desktop-content">
          <div className="left-section">
            <div className="hamburger-container" onClick={(e) => toggleMenu(e)}>
              <button className="hamburger-menu" aria-label="Toggle Menu">
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
            <div className="logo-container">
              <Link to={`/${region}`}>
                <img src="/images/header/scalevolt-logo.png" alt="Scalevolt Logo" className="logo" />
              </Link>
            </div>
          </div>

          <div className="center-section">
            <div className="search-container">
              {/* Uncomment when you have converted SearchBar to React
              <SearchBar
                className="my-search-bar desktop-search"
                allProducts={searchProducts}
                onSearchSelected={handleSearchSelected}
              /> */}
              {/* Temporary placeholder for SearchBar */}
              <input 
                type="text" 
                placeholder="Search..." 
                className="my-search-bar desktop-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              />
            </div>
          </div>

          <div className="right-section">
            <div className="user-controls">
              <div className="language-selector">
                <LanguageSelector />
              </div>
              <div className="cart-icon">
                <Link to={`/${region}/cart`}>
                  <img src="/images/header/cart.svg" alt="Cart" />
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>
              </div>
              <div className="user-icon">
                {!user ? (
                  <Link to={`/${region}/auth`}>
                    <img src="/images/header/profile-logo.svg" alt="Account" />
                  </Link>
                ) : (
                  <Link to={`/${region}/profile`}>
                    <img src="/images/header/profile-logo.svg" alt="Account" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Region Dropdown Menu (works for both mobile and desktop) */}
      {regionMenuVisible && (
        <div className="region-dropdown" onClick={(e) => e.stopPropagation()}>
          <div className={`region-option${currentLocale === 'ua' ? ' active' : ''}`} onClick={() => selectRegion('ua')}>
            <span className="language">{t('common.language.ukrainian', 'Українська')}</span>
          </div>
          <div className={`region-option${currentLocale === 'pl' ? ' active' : ''}`} onClick={() => selectRegion('pl')}>
            <span className="language">{t('common.language.polish', 'Polski')}</span>
          </div>
        </div>
      )}

      {/* Mega Menu Dropdown */}
      {menuVisible && (
        <div className="dropdown-mega-menu" onClick={(e) => e.stopPropagation()}>
          <div className="menu-container">
            {/* Main Categories Column */}
            <div className="menu-categories">
              {/* Solar System Category */}
              <div
                className={`menu-category ${activeCategory === 'solar' ? 'active' : ''}`}
                onMouseEnter={() => setActiveCategory('solar')}
                onClick={() => setActiveCategory('solar')}
              >
                <div className="category-header">
                  <div className="category-icon-placeholder solar-color"></div>
                  <h3>{t("header.menu.solarSystem")}</h3>
                </div>
              </div>

              {/* EV Chargers Category */}
              <div
                className={`menu-category ${activeCategory === 'ev' ? 'active' : ''}`}
                onMouseEnter={() => setActiveCategory('ev')}
                onClick={() => setActiveCategory('ev')}
              >
                <div className="category-header">
                  <div className="category-icon-placeholder ev-color"></div>
                  <h3>{t("header.menu.evChargers")}</h3>
                </div>
              </div>

              {/* Portable Power Category */}
              <div
                className={`menu-category ${activeCategory === 'portable' ? 'active' : ''}`}
                onMouseEnter={() => setActiveCategory('portable')}
                onClick={() => setActiveCategory('portable')}
              >
                <div className="category-header">
                  <div className="category-icon-placeholder portable-color"></div>
                  <h3>{t("header.menu.portablePower")}</h3>
                </div>
              </div>

              {/* Generators Category */}
              <div
                className={`menu-category ${activeCategory === 'generators' ? 'active' : ''}`}
                onMouseEnter={() => setActiveCategory('generators')}
                onClick={() => setActiveCategory('generators')}
              >
                <div className="category-header">
                  <div className="category-icon-placeholder generator-color"></div>
                  <h3>{t("header.menu.generators")}</h3>
                </div>
              </div>

              {/* Electrical Components Category */}
              <div
                className={`menu-category ${activeCategory === 'electrical' ? 'active' : ''}`}
                onMouseEnter={() => setActiveCategory('electrical')}
                onClick={() => setActiveCategory('electrical')}
              >
                <div className="category-header">
                  <div className="category-icon-placeholder electrical-color"></div>
                  <h3>{t("header.menu.electricalComponents")}</h3>
                </div>
              </div>
            </div>

            {/* Subcategories Panel */}
            <div className="menu-subcategories">
              {/* Solar System Subcategories */}
              {activeCategory === 'solar' && (
                <div className="subcategory-panel">
                  <div className="subcategory-list">
                    {solarSystemItems.map(item => (
                      <Link
                        key={item.id}
                        to={getCategoryRoute(item.slug)}
                        className="subcategory-item"
                        onClick={handleMenuItemClick}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="subcategory-image"
                        />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="featured-category">
                    <div className="featured-header">
                      <h4>
                        {t("header.featured.solar", "Популярні сонячні рішення")}
                      </h4>
                    </div>
                    <div className="featured-image">
                      <img
                        src="/images/HomeView/solar-farm.png"
                        alt="Solar Solutions"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* EV Chargers Subcategories */}
              {activeCategory === 'ev' && (
                <div className="subcategory-panel">
                  <div className="subcategory-list">
                    {evChargerItems.map(item => (
                      <Link
                        key={item.id}
                        to={getCategoryRoute(item.slug)}
                        className="subcategory-item"
                        onClick={handleMenuItemClick}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="subcategory-image"
                        />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="featured-category">
                    <div className="featured-header">
                      <h4>
                        {t("header.featured.ev", "Топові зарядні станції")}
                      </h4>
                    </div>
                    <div className="featured-image">
                      <img
                        src="/images/HomeView/ev-charger-city.png"
                        alt="EV Charging Stations"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Portable Power Subcategories */}
              {activeCategory === 'portable' && (
                <div className="subcategory-panel">
                  <div className="subcategory-list">
                    {portablePowerItems.map(item => (
                      <Link
                        key={item.id}
                        to={getCategoryRoute(item.slug)}
                        className="subcategory-item"
                        onClick={handleMenuItemClick}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="subcategory-image"
                        />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="featured-category">
                    <div className="featured-header">
                      <h4>
                        {t(
                          "header.featured.portable",
                          "Портативні рішення для енергії"
                        )}
                      </h4>
                    </div>
                    <div className="featured-image">
                      <img
                        src="/images/HomeView/solar-panel.png"
                        alt="Portable Power Solutions"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Generators Subcategories */}
              {activeCategory === 'generators' && (
                <div className="subcategory-panel">
                  <div className="subcategory-list">
                    {generatorItems.map(item => (
                      <Link
                        key={item.id}
                        to={getCategoryRoute(item.slug)}
                        className="subcategory-item"
                        onClick={handleMenuItemClick}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="subcategory-image"
                        />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="featured-category">
                    <div className="featured-header">
                      <h4>
                        {t(
                          "header.featured.generators",
                          "Генератори для будь-яких потреб"
                        )}
                      </h4>
                    </div>
                    <div className="featured-image">
                      <img
                        src="/images/HomeView/генератори.png"
                        alt="Generators"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Electrical Components Subcategories */}
              {activeCategory === 'electrical' && (
                <div className="subcategory-panel">
                  <div className="subcategory-list">
                    {electricalItems.map(item => (
                      <Link
                        key={item.id}
                        to={getCategoryRoute(item.slug)}
                        className="subcategory-item"
                        onClick={handleMenuItemClick}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="subcategory-image"
                        />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="featured-category">
                    <div className="featured-header">
                      <h4>
                        {t(
                          "header.featured.electrical",
                          "Електричні компоненти та кабелі"
                        )}
                      </h4>
                    </div>
                    <div className="featured-image">
                      <img
                        src="/images/HomeView/Electrical-cables-and-wires.jpg"
                        alt="Electrical Components"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Removed language selector from burger menu - only kept in header */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
