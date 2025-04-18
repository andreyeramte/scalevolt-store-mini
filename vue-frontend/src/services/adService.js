// adService.js
import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

export default {
  getAds(params = {}) {
    const defaultParams = {
      filters: {
        active: true,
      },
      populate: '*',
    };
    return axios.get(`${API_URL}/ads`, { params: { ...defaultParams, ...params } });
  },
};
