import axios from 'axios';

// Detect user's location based on IP
export async function detectUserLocation() {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    console.log('IP Detection result:', response.data); // For debugging
    return {
      ip: response.data.ip,
      country: response.data.country_code,
      countryName: response.data.country_name
    };
  } catch (error) {
    console.error('Error detecting location:', error);
    return { error: true };
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
          
          const country = response.data.address.country_code?.toUpperCase();
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
      }
    );
  });
}

// Set language based on country
export function getLanguageFromCountry(country) {
  if (country === 'UA') return 'ua';
  if (country === 'PL') return 'pl';
  return null; // Use default from i18n
}