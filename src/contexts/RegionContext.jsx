import React, { createContext, useState, useEffect, useContext } from 'react';

const RegionContext = createContext();

export function RegionProvider({ children }) {
  const [region, setRegion] = useState(() => localStorage.getItem('sv_region') || null);
  const [lang, setLang] = useState(() => localStorage.getItem('sv_lang') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [detectedRegion, setDetectedRegion] = useState(null);

  useEffect(() => {
    // Fetch server-detected region if not set
    async function init() {
      try {
        if (!region) {
          const response = await fetch('/api/region-detect');
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              const serverRegion = data.data.region;
              const serverLang = data.data.currentLang;
              
              setRegion(serverRegion);
              setLang(serverLang);
              setDetectedRegion(serverRegion);
              
              // Store in localStorage
              localStorage.setItem('sv_region', serverRegion);
              localStorage.setItem('sv_lang', serverLang);
            }
          }
        } else {
          // If we have a stored region, check if it matches detected region
          try {
            const response = await fetch('/api/region-detect');
            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                setDetectedRegion(data.data.region);
              }
            }
          } catch (error) {
            console.log('Could not check detected region:', error);
          }
        }
      } catch (error) {
        console.error('Failed to initialize region:', error);
        // Fallback to default values
        if (!region) {
          const defaultRegion = 'PL';
          const defaultLang = 'pl';
          setRegion(defaultRegion);
          setLang(defaultLang);
          localStorage.setItem('sv_region', defaultRegion);
          localStorage.setItem('sv_lang', defaultLang);
        }
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [region]);

  useEffect(() => {
    if (region) localStorage.setItem('sv_region', region);
    if (lang) localStorage.setItem('sv_lang', lang);
  }, [region, lang]);

  const updateRegion = async (newRegion, newLang = null) => {
    try {
      const response = await fetch('/api/region-set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          region: newRegion,
          lang: newLang || (newRegion === 'UA' ? 'ua' : 'pl')
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRegion(newRegion);
          setLang(data.data.currentLang);
          setDetectedRegion(null); // Clear detected region since user manually set it
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to update region:', error);
      return false;
    }
  };

  const updateLanguage = async (newLang) => {
    try {
      const response = await fetch('/api/region-set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          region: region,
          lang: newLang
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLang(newLang);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to update language:', error);
      return false;
    }
  };

  const value = {
    region,
    setRegion: updateRegion,
    lang,
    setLang: updateLanguage,
    isLoading,
    detectedRegion,
    showRegionBanner: detectedRegion && detectedRegion !== region
  };

  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
}

export default RegionContext;
