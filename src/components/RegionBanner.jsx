import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRegion } from '../contexts/RegionContext.jsx';
import './RegionBanner.css';

function RegionBanner() {
  const { t } = useTranslation();
  const { detectedRegion, region, setRegion, showRegionBanner } = useRegion();

  if (!showRegionBanner) {
    return null;
  }

  const handleAccept = async () => {
    await setRegion(detectedRegion);
  };

  const handleDecline = () => {
    // This will be handled by the context to hide the banner
  };

  const getRegionName = (regionCode) => {
    switch (regionCode) {
      case 'PL':
        return t('region.poland');
      case 'UA':
        return t('region.ukraine');
      default:
        return regionCode;
    }
  };

  return (
    <div className="region-banner">
      <div className="region-banner-content">
        <div className="region-banner-text">
          {t('region.banner.detected', {
            detectedRegion: getRegionName(detectedRegion),
            currentRegion: getRegionName(region)
          })}
        </div>
        <div className="region-banner-actions">
          <button 
            className="region-banner-btn region-banner-btn-accept"
            onClick={handleAccept}
          >
            {t('region.banner.switch')}
          </button>
          <button 
            className="region-banner-btn region-banner-btn-decline"
            onClick={handleDecline}
          >
            {t('region.banner.decline')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegionBanner;
