import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import ProductGrid from '../../components/Product/ProductGrid';
import useProductsStore from '../../stores/products';

const NewCategoriesView = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const region = location.pathname.split('/')[1] || 'ua';
  const { products, loading } = useProductsStore();

  // Filter products for New Categories (portable power stations, generators, etc.)
  const newCategoryProducts = products.filter(product => 
    product.category === 'portable-power-stations' || 
    product.category === 'generators' ||
    product.category === 'portable-solar-panels' ||
    product.category === 'cables-wires' ||
    product.name.toLowerCase().includes('portable') ||
    product.name.toLowerCase().includes('generator') ||
    product.name.toLowerCase().includes('cable') ||
    product.name.toLowerCase().includes('wire')
  );

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'white', minHeight: '100vh' }}>
      <ProductGrid
        products={newCategoryProducts}
        loading={loading}
        title={t('categories.newCategories.title', 'Досліджуйте нові категорії')}
        subtitle={t('categories.newCategories.subtitle', 'Інноваційні рішення для ваших потреб')}
      />
    </div>
  );
};

export default NewCategoriesView; 