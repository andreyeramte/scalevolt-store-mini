// src/services/RegionService.js
import axios from 'axios';
import qs from 'qs';

const API_URL = 'http://localhost:1337/api';

export default {
  async getRegionalSettings(region) {
    try {
      const params = {
        filters: {
          code: region
        }
      };
      
      const queryString = qs.stringify(params, { 
        encodeValuesOnly: true,
        arrayFormat: 'brackets'
      });
      
      const response = await axios.get(`${API_URL}/region-settings?${queryString}`);
      return response.data;
    } catch (error) {
      console.error(`RegionService getRegionalSettings(${region}) error:`, error);
      throw error;
    }
  },
  
  async getProductsForRegion(region, params = {}) {
    try {
      const defaultParams = {
        filters: {
          regions: {
            code: region
          }
        },
        populate: {
          general_information: {
            populate: ['images'],
          },
          pricing_and_inventory: true,
          specifications: true,
          categories: true,
          tags: true,
          regions: true
        }
      };
      
      const mergedParams = { ...defaultParams, ...params };
      const queryString = qs.stringify(mergedParams, { 
        encodeValuesOnly: true,
        arrayFormat: 'brackets',
        encode: false
      });

      const response = await axios.get(`${API_URL}/products?${queryString}`);
      return response.data;
    } catch (error) {
      console.error(`RegionService getProductsForRegion(${region}) error:`, error);
      throw error;
    }
  },
  
  async getCurrencyForRegion(region) {
    try {
      const settings = await this.getRegionalSettings(region);
      return settings.data?.[0]?.attributes?.currency || (region === 'uk' ? 'UAH' : 'PLN');
    } catch (error) {
      console.error(`RegionService getCurrencyForRegion(${region}) error:`, error);
      // Fallback values if API fails
      return region === 'uk' ? 'UAH' : 'PLN';
    }
  },
  
  getLocaleConfig() {
    return {
      uk: {
        currency: 'UAH',
        currencySymbol: '₴',
        dateFormat: 'DD.MM.YYYY',
        numberFormat: {
          decimal: ',',
          thousands: ' '
        }
      },
      pl: {
        currency: 'PLN',
        currencySymbol: 'zł',
        dateFormat: 'DD.MM.YYYY',
        numberFormat: {
          decimal: ',',
          thousands: ' '
        }
      }
    };
  },
  
  formatPrice(price, region) {
    const config = this.getLocaleConfig()[region] || this.getLocaleConfig().uk;
    
    return new Intl.NumberFormat(region === 'pl' ? 'pl-PL' : 'uk-UA', {
      style: 'currency',
      currency: config.currency
    }).format(price);
  }
};