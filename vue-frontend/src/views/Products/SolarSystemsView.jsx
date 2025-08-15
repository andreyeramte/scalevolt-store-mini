import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import ProductGrid from '../../components/Product/ProductGrid';
import useProductsStore from '../../stores/products';

const SolarSystemsView = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const region = location.pathname.split('/')[1] || 'ua';
  const { products, loading } = useProductsStore();

  // Filter products for Solar Systems category
  const solarProducts = products.filter(product => 
    product.category === 'solar-panels' || 
    product.category === 'batteries' ||
    product.category === 'inverters' ||
    product.category === 'solar-sets' ||
    product.name.toLowerCase().includes('solar') ||
    product.name.toLowerCase().includes('panel') ||
    product.name.toLowerCase().includes('battery') ||
    product.name.toLowerCase().includes('inverter')
  );

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'white', minHeight: '100vh' }}>
      <ProductGrid
        products={solarProducts}
        loading={loading}
        title={t('categories.solarSystems.title', 'Житлова та комерційна сонячна система')}
        subtitle={t('categories.solarSystems.subtitle', 'Повні сонячні рішення для будинків та підприємств')}
      />
    </div>
  );
};

export default SolarSystemsView; 