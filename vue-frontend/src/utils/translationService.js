// FILE: vue-frontend/src/utils/translationService.js

import axios from 'axios';
import { i18n } from '@/i18n/index.js';

/**
 * Translates text to the target language
 * @param {string} text - The text to translate
 * @param {string} targetLanguage - The target language code (e.g., 'ua', 'pl', 'en')
 * @param {string} sourceLanguage - The source language code (optional, defaults to 'en')
 * @returns {Promise<string>} - The translated text
 */
export async function translateText(text, targetLanguage, sourceLanguage = 'en') {
  try {
    // If no text or target language is same as source, return original
    if (!text || targetLanguage === sourceLanguage) {
      return text;
    }

    const response = await axios.post('/api/translations/text', {
      text,
      targetLanguage,
      sourceLanguage
    });

    return response.data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

/**
 * Translates product fields to multiple languages
 * @param {Object} product - The product object with name, description, etc.
 * @param {Array<string>} targetLanguages - Array of target language codes (e.g., ['ua', 'pl'])
 * @param {string} sourceLanguage - The source language code (optional, defaults to 'en')
 * @returns {Promise<Object>} - The product with translated fields
 */
export async function translateProduct(product, targetLanguages = ['ua', 'pl'], sourceLanguage = 'en') {
  try {
    const response = await axios.post('/api/translations/product', {
      product,
      targetLanguages,
      sourceLanguage
    });

    return response.data;
  } catch (error) {
    console.error('Product translation error:', error);
    return product; // Return original product if translation fails
  }
}

/**
 * Get translated content based on current locale
 * @param {Object} content - Object with translations for different languages
 * @returns {string} - Content in current language or fallback
 */
export function getTranslatedContent(content) {
  const currentLocale = i18n.global.locale.value;
  
  // If content is a string, return it directly
  if (typeof content === 'string') {
    return content;
  }
  
  // If content is an object with language keys
  if (content && typeof content === 'object') {
    // Try to get content for current locale
    if (content[currentLocale]) {
      return content[currentLocale];
    }
    
    // Fallback order: current locale → default locale (ua) → first available
    if (content.ua) {
      return content.ua;
    }
    
    // Last resort: return first available translation
    const firstAvailableLocale = Object.keys(content)[0];
    if (firstAvailableLocale) {
      return content[firstAvailableLocale];
    }
  }
  
  // If nothing found, return empty string
  return '';
}