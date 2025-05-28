import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { detectUserCountry, mapCountryToLocale } from '../services/geoService';

const ConsentBanner = () => {
  const { i18n, t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Only show the banner if the user hasn't set a preference AND hasn't rejected the consent
    setShowBanner(!localStorage.getItem('userLocale') && 
                 !localStorage.getItem('locationConsentRejected'));
  }, []);
  
  const acceptConsent = async () => {
    setShowBanner(false);
    try {
      const country = await detectUserCountry();
      if (country) {
        const detectedLocale = mapCountryToLocale(country);
        i18n.changeLanguage(detectedLocale);
        localStorage.setItem('userLocale', detectedLocale);
        // Reload to apply language changes
        window.location.reload();
      }
    } catch (error) {
      console.error('Error during country detection:', error);
      // Fall back to default locale
      localStorage.setItem('userLocale', 'uk');
    }
  };
  
  const rejectConsent = () => {
    setShowBanner(false);
    localStorage.setItem('locationConsentRejected', 'true');
    // Set default locale
    localStorage.setItem('userLocale', 'uk');
  };
  
  if (!showBanner) return null;
  
  return (
    <div className="consent-banner">
      <p>{t('consent.message')}</p>
      <div className="consent-buttons">
        <button onClick={acceptConsent} className="accept-btn">
          {t('consent.accept')}
        </button>
        <button onClick={rejectConsent} className="reject-btn">
          {t('consent.reject')}
        </button>
      </div>
      
      <style jsx>{`
        .consent-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #333;
          color: white;
          padding: 15px;
          z-index: 1000;
          text-align: center;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .consent-buttons {
          display: flex;
          gap: 10px;
        }
        
        .accept-btn {
          background-color: #4285F4;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .reject-btn {
          background-color: transparent;
          color: white;
          border: 1px solid white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .consent-banner {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default ConsentBanner;