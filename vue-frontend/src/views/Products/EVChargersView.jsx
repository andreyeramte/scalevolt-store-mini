import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import ProductGrid from '../../components/Product/ProductGrid';
import useProductsStore from '../../stores/products';

const EVChargersView = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const region = location.pathname.split('/')[1] || 'ua';
  const { products, loading } = useProductsStore();

  // Filter products for EV Chargers category
  const evChargerProducts = products.filter(product => 
    product.category === 'ev-chargers' || 
    product.category === 'charging-stations' ||
    product.name.toLowerCase().includes('charger') ||
    product.name.toLowerCase().includes('charging')
  );

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'white', minHeight: '100vh' }}>
      <ProductGrid
        products={evChargerProducts}
        loading={loading}
        title={t('categories.evChargers.title', 'Зарядні пристрої та компоненти для електромобілів')}
        subtitle={t('categories.evChargers.subtitle', 'Швидкі та надійні зарядні станції для електромобілів')}
      />
    </div>
  );
};

export default EVChargersView; 