// src/services/categoryService.js
import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

export default {
  getCategories(params = {}) {
    const defaultParams = {
      populate: '*', // Adjust as needed
    };
    return axios.get(`${API_URL}/categories`, { params: { ...defaultParams, ...params } });
  },
  getCategoryById(id, params = {}) {
    const defaultParams = {
      populate: '*', // Adjust as needed
    };
    return axios.get(`${API_URL}/categories/${id}`, { params: { ...defaultParams, ...params } });
  },
};
