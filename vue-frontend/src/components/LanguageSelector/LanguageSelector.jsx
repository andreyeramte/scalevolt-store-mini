import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentRegion, setCurrentRegion] = useState('ua');
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);

  // Get current region from URL
  useEffect(() => {
    const region = location.pathname.split('/')[1] || 'ua';
    setCurrentRegion(region);
  }, [location.pathname]);

  const languages = {
    ua: {
      name: 'Українська',
      flag: '🇺🇦',
      local: 'Українська',
      english: 'English'
    },
    pl: {
      name: 'Polski',
      flag: '🇵🇱',
      local: 'Polski',
      english: 'English'
    },
    en: {
      name: 'English',
      flag: '🇺🇸',
      local: 'English',
      english: 'English'
    }
  };

  const handleLanguageChange = (region, language) => {
    // Update the URL to reflect the new region
    const pathParts = location.pathname.split('/');
    pathParts[1] = region;
    const newPath = pathParts.join('/');
    
    // Change the language
    i18n.changeLanguage(language);
    localStorage.setItem('userLocale', language);
    document.documentElement.setAttribute('lang', language);
    
    // Navigate to the new URL
    navigate(newPath);
    
    // Close the dropdown
    setIsOpen(false);
  };

  const calculateButtonPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right
      });
    }
  };

  const handleToggleDropdown = () => {
    if (!isOpen) {
      calculateButtonPosition();
    }
    setIsOpen(!isOpen);
  };

  const currentLanguage = languages[currentRegion] || languages.ua;
  
  // Get display name for current language
  const getCurrentLanguageDisplay = () => {
    switch (currentRegion) {
      case 'ua':
        return { name: 'Українська', flag: '🇺🇦', abbr: 'UA' };
      case 'pl':
        return { name: 'Polski', flag: '🇵🇱', abbr: 'PL' };
      case 'en':
        return { name: 'English', flag: '🇺🇸', abbr: 'EN' };
      default:
        return { name: 'Українська', flag: '🇺🇦', abbr: 'UA' };
    }
  };
  
  const currentDisplay = getCurrentLanguageDisplay();
  
  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className="language-selector-dropdown"
      style={{ 
        position: 'relative',
        zIndex: 99999
      }}
    >
      <button
        onClick={handleToggleDropdown}
        ref={buttonRef}
        className={isMobile ? 'mobile-language-button' : ''}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '4px' : '8px',
          backgroundColor: 'transparent',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: isMobile ? '6px 8px' : '8px 12px',
          cursor: 'pointer',
          fontSize: isMobile ? '12px' : '14px',
          color: '#333',
          transition: 'all 0.2s ease',
          minWidth: isMobile ? 'auto' : 'auto',
          minHeight: isMobile ? '36px' : 'auto'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = '#007bff';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = '#e0e0e0';
        }}
      >
        <Globe size={isMobile ? 14 : 16} />
        <span>{currentDisplay.flag}</span>
        {!isMobile && <span>{currentDisplay.name}</span>}
        {isMobile && <span style={{ fontSize: '10px', fontWeight: '600' }}>{currentDisplay.abbr}</span>}
        <ChevronDown 
          size={isMobile ? 12 : 14} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }} 
        />
      </button>

      {isOpen && createPortal(
        <div 
          className="language-selector-dropdown-content language-selector-portal-dropdown"
          style={{
            position: 'fixed',
            top: buttonPosition.top,
            right: buttonPosition.right,
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            zIndex: 9999999,
            minWidth: '200px',
            marginTop: '4px'
          }}
        >
          {/* Ukrainian Option */}
          <button
            onClick={() => handleLanguageChange('ua', 'ua')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              backgroundColor: currentRegion === 'ua' ? '#f0f7ff' : 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              textAlign: 'left',
              borderBottom: '1px solid #f0f0f0'
            }}
            onMouseEnter={(e) => {
              if (currentRegion !== 'ua') {
                e.target.style.backgroundColor = '#f8f9fa';
              }
            }}
            onMouseLeave={(e) => {
              if (currentRegion !== 'ua') {
                e.target.style.backgroundColor = 'transparent';
              } else {
                e.target.style.backgroundColor = '#f0f7ff';
              }
            }}
          >
            <span style={{ fontSize: '16px' }}>🇺🇦</span>
            <div>
              <div style={{ fontWeight: '500', color: '#333' }}>
                Українська
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Ukrainian
              </div>
            </div>
          </button>

          {/* Polish Option */}
          <button
            onClick={() => handleLanguageChange('pl', 'pl')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              backgroundColor: currentRegion === 'pl' ? '#f0f7ff' : 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              textAlign: 'left',
              borderBottom: '1px solid #f0f0f0'
            }}
            onMouseEnter={(e) => {
              if (currentRegion !== 'pl') {
                e.target.style.backgroundColor = '#f8f9fa';
              }
            }}
            onMouseLeave={(e) => {
              if (currentRegion !== 'pl') {
                e.target.style.backgroundColor = 'transparent';
              } else {
                e.target.style.backgroundColor = '#f0f7ff';
              }
            }}
          >
            <span style={{ fontSize: '16px' }}>🇵🇱</span>
            <div>
              <div style={{ fontWeight: '500', color: '#333' }}>
                Polski
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Polish
              </div>
            </div>
          </button>

          {/* English Option */}
          <button
            onClick={() => handleLanguageChange('en', 'en')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              backgroundColor: currentRegion === 'en' ? '#f0f7ff' : 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (currentRegion !== 'en') {
                e.target.style.backgroundColor = '#f8f9fa';
              }
            }}
            onMouseLeave={(e) => {
              if (currentRegion !== 'en') {
                e.target.style.backgroundColor = 'transparent';
              } else {
                e.target.style.backgroundColor = '#f0f7ff';
              }
            }}
          >
            <span style={{ fontSize: '16px' }}>🇺🇸</span>
            <div>
              <div style={{ fontWeight: '500', color: '#333' }}>
                English
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                English
              </div>
            </div>
          </button>
        </div>
      , document.body)}

      {/* Click outside to close */}
      {isOpen && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999998
          }}
          onClick={() => setIsOpen(false)}
        />
      , document.body)}
    </div>
  );
};

export default LanguageSelector; 