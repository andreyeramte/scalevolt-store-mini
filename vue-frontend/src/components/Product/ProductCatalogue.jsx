import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCard from '../ProductCard/ProductCard';
import Breadcrumb from '../../common/Breadcrumb/Breadcrumb';
import './ProductCatalog.css';

const ProductCatalog = ({
  products = [],
  catalogType,
  isRental = false,
  loading = false
}) => {
  const { t } = useTranslation();
  const { id } = useParams();

  // Get category ID from the route and ensure it's correctly parsed
  const categoryId = useMemo(() => {
    return id ? Number(id) : null;
  }, [id]);

  // Catalog title translation key
  const catalogTitle = useMemo(() => `catalog.${catalogType}`, [catalogType]);

  // Localized breadcrumbs
  const localizedBreadcrumbs = useMemo(() => [
    { name: t('common.home'), link: '/' },
    { name: t('common.categories'), link: '/catalogue' },
    { name: t(catalogTitle) },
  ], [t, catalogTitle]);

  // Process products to add unique keys and translate names
  const processedProducts = useMemo(() => {
    return products.map((product) => {
      // Create translation key for the product
      const nameKey = `products.${product.type || catalogType}.id_${product.id}.name`;

      return {
        ...product,
        uniqueKey: product.id,
        name: t(nameKey, product.name), // Translate or fallback to original
        isRentalItem: isRental || product.isRentalItem,
      };
    });
  }, [products, catalogType, isRental, t]);

  // Filter products by categoryId if present
  const displayedProducts = useMemo(() => {
    if (categoryId) {
      return processedProducts.filter(
        (product) => product.categoryId === categoryId
      );
    }
    return processedProducts;
  }, [categoryId, processedProducts]);

  return (
    <div className="catalogue-view">
      {/* Breadcrumb Component with same design classes */}
      <Breadcrumb
        breadcrumbs={localizedBreadcrumbs}
        className="breadcrumb-spacing"
      />

      <h1>{t(catalogTitle)}</h1>

      {/* Product Listing */}
      {loading ? (
        <div className="loading-indicator">
          {t('common.loading')}
        </div>
      ) : displayedProducts.length > 0 ? (
        <div className="products-container">
          {displayedProducts.map((product) => (
            <div
              key={product.uniqueKey}
              className="product-card-wrapper"
            >
              {/* Wrap ProductCard in Link to /product/:id */}
              <Link
                to={`/product/${product.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {/* ProductCard component */}
                <ProductCard
                  productId={product.id}
                  title={product.name}
                  price={product.price}
                  imageSrc={product.image}
                  brand={product.brand}
                  isRentalItem={product.isRentalItem}
                  rentalPrices={product.rentalPrices}
                />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-products">
          <p>{t('common.noProductsFound')}</p>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;