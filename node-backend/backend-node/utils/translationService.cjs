// FILE: backend-node/utils/translationService.cjs

/**
 * Simple translation service that returns original text
 * TODO: Integrate with a translation service like Google Translate or DeepL
 */

const axios = require('axios');

/**
 * Translates a single piece of text using Google Translate API
 * @param {string} text
 * @param {string} targetLanguage
 * @param {string} sourceLanguage
 * @returns {Promise<string>}
 */
async function translateText(text, targetLanguage, sourceLanguage = 'en') {
  try {
    if (!text || targetLanguage === sourceLanguage) {
      return text;
    }
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      console.warn('No Google Translate API key set. Returning original text.');
      return text;
    }
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2`,
      {},
      {
        params: {
          q: text,
          target: targetLanguage,
          source: sourceLanguage,
          key: apiKey,
        },
      }
    );
    if (response.data && response.data.data && response.data.data.translations && response.data.data.translations[0]) {
      return response.data.data.translations[0].translatedText;
    }
    return text;
  } catch (err) {
    console.error('Translation error:', err.response?.data || err.message);
    return text;
  }
}

/**
 * Translates all fields of a product object
 * @param {Object} product
 * @param {string[]} targetLanguages
 * @param {string} sourceLanguage
 * @returns {Promise<Object>}
 */
async function translateProduct(product, targetLanguages = ['ua', 'pl'], sourceLanguage = 'en') {
  try {
    const translated = { ...product };
    for (const lang of targetLanguages) {
      if (product.name) {
        translated[`name_${lang}`] = await translateText(product.name, lang, sourceLanguage);
      }
      if (product.description) {
        translated[`description_${lang}`] = await translateText(product.description, lang, sourceLanguage);
      }
    }
    return translated;
  } catch (err) {
    console.error('Product translation error:', err);
    return product;
  }
}

/**
 * Given a translation object or plain string, pick the right locale
 * @param {Object|string} content
 * @param {string} currentLocale
 * @returns {string}
 */
function getTranslatedContent(content, currentLocale = 'en') {
  if (typeof content === 'string') {
    return content;
  }
  if (content && typeof content === 'object') {
    if (content[currentLocale]) {
      return content[currentLocale];
    }
    if (content.ua) {
      return content.ua;
    }
    // Fallback to first available
    const firstKey = Object.keys(content)[0];
    return content[firstKey] || '';
  }
  return '';
}

module.exports = {
  translateText,
  translateProduct,
  getTranslatedContent,
};
