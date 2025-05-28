// FILE: src/utils/locationDetector.js
// Utility functions for detecting user location and mapping to language
import axios from 'axios';

// Detect user's location based on IP
export async function detectUserLocation() {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    console.log('IP Detection result:', response.data); // For debugging
    
    if (response.data.error) {
      throw new Error(response.data.reason || 'Location detection failed');
    }
    
    return {
      ip: response.data.ip,
      country: response.data.country_code?.toLowerCase(),
      countryName: response.data.country_name,
      city: response.data.city,
      region: response.data.region,
      error: false
    };
  } catch (error) {
    console.error('Error detecting user location:', error);
    
    // Fallback: try another service
    try {
      const fallbackResponse = await axios.get('https://ip-api.com/json/');
      const fallbackData = fallbackResponse.data;
      
      if (fallbackData.status === 'success') {
        return {
          ip: fallbackData.query,
          country: fallbackData.countryCode?.toLowerCase(),
          countryName: fallbackData.country,
          city: fallbackData.city,
          region: fallbackData.regionName,
          error: false
        };
      }
    } catch (fallbackError) {
      console.error('Fallback location detection also failed:', fallbackError);
    }
    
    return { 
      error: true,
      message: error.message
    };
  }
}

// Browser geolocation (will prompt for permission)
export function detectBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocation not supported');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      // Success
      async (position) => {
        try {
          // Convert coordinates to country using reverse geocoding
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
          );
          
          const country = response.data.address.country_code?.toLowerCase();
          resolve({
            country: country,
            countryName: response.data.address.country,
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          });
        } catch (error) {
          console.error('Error with reverse geocoding:', error);
          reject(error);
        }
      },
      // Error
      (error) => {
        console.error('Error getting location:', error);
        reject(error);
      },
      // Options
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  });
}

// Set language based on country
export function getLanguageFromCountry(country) {
  if (!country) return null;
  
  const countryCode = country.toUpperCase();
  
  if (countryCode === 'UA') return 'ua';
  if (countryCode === 'PL') return 'pl';
  
  // European countries that might prefer English
  const englishCountries = ['US', 'GB', 'CA', 'AU', 'NZ', 'IE', 'ZA', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI'];
  
  if (englishCountries.includes(countryCode)) {
    return 'en';
  }
  
  return null; // Use default from i18n
}

// Additional utility to get browser language as fallback
export const getBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  
  if (browserLang) {
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // Map browser language to your supported languages
    const supportedLanguages = ['ua', 'pl', 'en'];
    
    if (supportedLanguages.includes(langCode)) {
      return langCode;
    }
    
    // Special cases
    if (langCode === 'uk') return 'ua'; // Ukrainian language code
  }
  
  return 'en'; // Default fallback
};

// Combined function to detect the best language for user
export const detectUserLanguage = async () => {
  try {
    // First try IP-based location detection
    const location = await detectUserLocation();
    
    if (!location.error && location.country) {
      const languageFromCountry = getLanguageFromCountry(location.country);
      if (languageFromCountry) {
        console.log(`Language detected from IP location: ${languageFromCountry} (${location.countryName})`);
        return languageFromCountry;
      }
    }
    
    // Fallback to browser language
    const browserLanguage = getBrowserLanguage();
    console.log(`Using browser language as fallback: ${browserLanguage}`);
    return browserLanguage;
    
  } catch (error) {
    console.error('Error in language detection:', error);
    return 'en'; // Ultimate fallback
  }
};