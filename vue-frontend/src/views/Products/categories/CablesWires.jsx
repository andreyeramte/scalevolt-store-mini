// File: CablesWires.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../../../components/Breadcrumb';
import ProductCard from '../components/ProductCard';

const CablesWires = () => {
  const [loading, setLoading] = useState(true);
  const [cables, setCables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const breadcrumbs = [
    { name: 'Головна', link: '/' },
    { name: 'Низьковольтна Продукція', link: '#' },
    { name: 'Кабелі електричні та дроти' },
  ];

  useEffect(() => {
    // Fetch cables data from your API
    const fetchCables = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory) {
          params.category = selectedCategory;
        }
        if (searchTerm) {
          params.search = searchTerm;
        }

        const response = await axios.get('/api/cables', { params });
        setCables(response.data);
      } catch (error) {
        console.error('Error fetching cables:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCables();
  }, [selectedCategory, searchTerm]);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const pageTitle = 'Кабелі електричні та дроти';

  return (
    <div className="catalogue-view">
      <Breadcrumb breadcrumbs={breadcrumbs} className="breadcrumb-spacing" />
      <h1>{pageTitle}</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Категорія</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Усі категорії</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Пошук</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Пошук за назвою або моделлю..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="products-container">
          {cables.length === 0 ? (
            <div className="col-span-full bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              No cables found. Try adjusting your filters.
            </div>
          ) : (
            cables.map(cable => (
              <div key={cable.id} className="product-card-wrapper">
                <ProductCard
                  productId={cable.id}
                  title={cable.name}
                  price={cable.market_data.price}
                  imageSrc={cable.image_url || '/images/placeholder.png'}
                  brand={cable.specifications.conductor_material} // Using conductor material as brand
                  // Don't pass rentalPrices to make it a regular product, not a rental
                  isRentalItem={false}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CablesWires;