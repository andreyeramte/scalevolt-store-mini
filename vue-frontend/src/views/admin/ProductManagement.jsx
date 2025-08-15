import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './ProductManagement.css';

const ProductManagement = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    name_ua: '',
    name_pl: '',
    description: '',
    description_ua: '',
    description_pl: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    sku: '',
    images: []
  });

  const categories = [
    { value: 'solar-panels', label: t('admin.products.categories.solarPanels', 'Solar Panels') },
    { value: 'batteries', label: t('admin.products.categories.batteries', 'Batteries') },
    { value: 'inverters', label: t('admin.products.categories.inverters', 'Inverters') },
    { value: 'ev-chargers', label: t('admin.products.categories.evChargers', 'EV Chargers') },
    { value: 'portable-power', label: t('admin.products.categories.portablePower', 'Portable Power') },
    { value: 'generators', label: t('admin.products.categories.generators', 'Generators') },
    { value: 'electrical-components', label: t('admin.products.categories.electricalComponents', 'Electrical Components') }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data
      setProducts([
        {
          id: 1,
          name: 'Solar Panel 100W',
          name_ua: 'Сонячна панель 100W',
          name_pl: 'Panel słoneczny 100W',
          description: 'High efficiency solar panel for residential use',
          price: 150.00,
          stock: 10,
          category: 'solar-panels',
          brand: 'ScaleVolt',
          sku: 'SP-100W-001',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Battery Pack 24V 100Ah',
          name_ua: 'Акумуляторна батарея 24V 100Ah',
          name_pl: 'Pakiet baterii 24V 100Ah',
          description: 'Lithium battery pack for solar systems',
          price: 800.00,
          stock: 5,
          category: 'batteries',
          brand: 'ScaleVolt',
          sku: 'BP-24V-100Ah-001',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach(image => {
            formDataToSend.append('images', image);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (response.ok) {
        setShowAddForm(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      name_ua: product.name_ua || '',
      name_pl: product.name_pl || '',
      description: product.description || '',
      description_ua: product.description_ua || '',
      description_pl: product.description_pl || '',
      price: product.price || '',
      stock: product.stock || '',
      category: product.category || '',
      brand: product.brand || '',
      sku: product.sku || '',
      images: []
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm(t('admin.products.confirmDelete', 'Are you sure you want to delete this product?'))) {
      try {
        await fetch(`/api/products/${productId}`, {
          method: 'DELETE'
        });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_ua: '',
      name_pl: '',
      description: '',
      description_ua: '',
      description_pl: '',
      price: '',
      stock: '',
      category: '',
      brand: '',
      sku: '',
      images: []
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      case 'stock':
        return a.stock - b.stock;
      case 'created':
        return new Date(b.created_at) - new Date(a.created_at);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="product-management">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{t('admin.products.loading', 'Loading products...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-management">
      <div className="product-header">
        <div className="header-left">
          <h1>{t('admin.products.title', 'Product Management')}</h1>
          <p>{t('admin.products.subtitle', 'Manage your product catalog')}</p>
        </div>
        <button 
          className="add-product-btn"
          onClick={() => setShowAddForm(true)}
        >
          ➕ {t('admin.products.addProduct', 'Add Product')}
        </button>
      </div>

      <div className="product-controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder={t('admin.products.searchPlaceholder', 'Search products...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="all">{t('admin.products.allCategories', 'All Categories')}</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">{t('admin.products.sortByName', 'Sort by Name')}</option>
            <option value="price">{t('admin.products.sortByPrice', 'Sort by Price')}</option>
            <option value="stock">{t('admin.products.sortByStock', 'Sort by Stock')}</option>
            <option value="created">{t('admin.products.sortByCreated', 'Sort by Created')}</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {sortedProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img 
                src={product.image_url || '/images/placeholder-product.png'} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/images/placeholder-product.png';
                }}
              />
            </div>
            
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-sku">SKU: {product.sku}</p>
              <p className="product-category">{product.category}</p>
              <div className="product-details">
                <span className="price">${product.price}</span>
                <span className={`stock ${product.stock < 10 ? 'low' : ''}`}>
                  {product.stock} in stock
                </span>
              </div>
            </div>
            
            <div className="product-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEdit(product)}
              >
                ✏️ {t('admin.products.edit', 'Edit')}
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(product.id)}
              >
                🗑️ {t('admin.products.delete', 'Delete')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {editingProduct 
                  ? t('admin.products.editProduct', 'Edit Product')
                  : t('admin.products.addProduct', 'Add Product')
                }
              </h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>{t('admin.products.name', 'Name (English)')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>{t('admin.products.nameUa', 'Name (Ukrainian)')}</label>
                  <input
                    type="text"
                    name="name_ua"
                    value={formData.name_ua}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>{t('admin.products.namePl', 'Name (Polish)')}</label>
                  <input
                    type="text"
                    name="name_pl"
                    value={formData.name_pl}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>{t('admin.products.price', 'Price')}</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>{t('admin.products.stock', 'Stock')}</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>{t('admin.products.category', 'Category')}</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">{t('admin.products.selectCategory', 'Select Category')}</option>
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>{t('admin.products.brand', 'Brand')}</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>{t('admin.products.sku', 'SKU')}</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group full-width">
                <label>{t('admin.products.description', 'Description (English)')}</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-group full-width">
                <label>{t('admin.products.descriptionUa', 'Description (Ukrainian)')}</label>
                <textarea
                  name="description_ua"
                  value={formData.description_ua}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              
              <div className="form-group full-width">
                <label>{t('admin.products.descriptionPl', 'Description (Polish)')}</label>
                <textarea
                  name="description_pl"
                  value={formData.description_pl}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              
              <div className="form-group full-width">
                <label>{t('admin.products.images', 'Product Images')}</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                {formData.images.length > 0 && (
                  <div className="image-preview">
                    {formData.images.map((image, index) => (
                      <div key={index} className="preview-item">
                        <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}>
                  {t('admin.products.cancel', 'Cancel')}
                </button>
                <button type="submit" className="save-btn">
                  {editingProduct 
                    ? t('admin.products.update', 'Update Product')
                    : t('admin.products.save', 'Save Product')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 