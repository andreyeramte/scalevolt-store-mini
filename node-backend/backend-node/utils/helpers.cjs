// FILE: backend-node/utils/helpers.cjs

/**
 * Build a searchable text blob from product fields.
 * @param {Object} product
 * @returns {string}
 */
function buildSearchableText(product) {
  return [
    product.name,
    product.name_ua,
    product.name_pl,
    product.description,
    product.description_ua,
    product.description_pl
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

module.exports = { buildSearchableText };
