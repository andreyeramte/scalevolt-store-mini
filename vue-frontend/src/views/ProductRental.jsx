import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProductCard from '../components/Product/ProductCard';

// Mock rental products data
const rentalProducts = [
  {
    id: 1,
    name: 'Генератор 10 кВт',
    category: 'Генератори',
    image: '/images/Categories/equipment/generator-10kw.jpg',
    brand: 'Honda',
    rentalPrices: { day: 150, week: 900, month: 2700 },
    specs: ['Потужність: 10 кВт', 'Паливо: Дизель', 'Рівень шуму: 65 dB'],
  },
  {
    id: 2,
    name: 'Генератор 20 кВт',
    category: 'Генератори',
    image: '/images/Categories/equipment/generator-20kw.jpg',
    brand: 'Yamaha',
    rentalPrices: { day: 250, week: 1500, month: 4500 },
    specs: ['Потужність: 20 кВт', 'Паливо: Дизель', 'Рівень шуму: 68 dB'],
  },
  {
    id: 3,
    name: 'Промисловий генератор 100 кВт',
    category: 'Промислові генератори для важких навантажень (100 кВт+)',
    image: '/images/Categories/equipment/industrial-generator-100kw.jpg',
    brand: 'Caterpillar',
    rentalPrices: { day: 600, week: 3500, month: 12000 },
    specs: ['Потужність: 100 кВт', 'Паливо: Дизель', 'Рівень шуму: 72 dB'],
  },
  {
    id: 4,
    name: 'Освітлювальна вежа 4x400W',
    category: 'Освітлювальні вежі на сонячних батареях',
    image: '/images/Categories/equipment/lighting-tower.jpg',
    brand: 'Atlas Copco',
    rentalPrices: { day: 200, week: 1200, month: 4000 },
    specs: ['4x400W LED', 'Автономність: 24 год', 'Сонячна батарея'],
  },
  {
    id: 5,
    name: 'Ножичний підйомник 8м',
    category: 'Підйомники та Крани',
    image: '/images/Categories/equipment/scissor-lift-8m.jpg',
    brand: 'JLG',
    rentalPrices: { day: 180, week: 1080, month: 3240 },
    specs: ['Висота підйому: 8м', 'Вантажопідйомність: 450 кг', 'Електричний привід'],
  },
  {
    id: 6,
    name: 'Кран-маніпулятор 10т',
    category: 'Підйомники та Крани',
    image: '/images/Categories/equipment/crane-10t.jpg',
    brand: 'Liebherr',
    rentalPrices: { day: 500, week: 3000, month: 9000 },
    specs: ['Вантажопідйомність: 10т', 'Довжина стріли: 20м', 'Дизель'],
  },
];

const rentalCategories = [
  'Генератори',
  'Промислові генератори для важких навантажень (100 кВт+)',
  'Освітлювальні вежі на сонячних батареях',
  'Підйомники та Крани',
];

const ProductRental = () => {
  const location = useLocation();
  const region = location.pathname.split('/')[1] || 'ua';
  const [selectedCategory, setSelectedCategory] = useState('Всі категорії');
  const [search, setSearch] = useState('');

  // Filtered products
  const filteredProducts = useMemo(() => {
    return rentalProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Всі категорії' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  return (
    <div className="rental-catalogue-view">
      <div className="rental-header">
        <h1>Оренда обладнання</h1>
        <p className="rental-subtitle">
          Виберіть категорію, знайдіть потрібне обладнання, перегляньте характеристики та ціни, і оформіть заявку на оренду онлайн. Сучасний сервіс для бізнесу та приватних клієнтів.
        </p>
        <div className="rental-filters">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rental-category-select"
          >
            <option value="Всі категорії">Всі категорії</option>
            {rentalCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Пошук обладнання або бренду..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rental-search-input"
          />
        </div>
      </div>
      <div className="products-container">
        {filteredProducts.length === 0 ? (
          <div className="no-products">Нічого не знайдено.</div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card-wrapper">
              <Link to={`/${region}/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ProductCard
                  productId={product.id}
                  title={product.name}
                  price={product.rentalPrices.day}
                  imageSrc={product.image}
                  brand={product.brand}
                  isRentalItem={true}
                  rentalPrices={product.rentalPrices}
                  region={region}
                />
                <ul className="rental-specs-list">
                  {product.specs.map((spec, idx) => (
                    <li key={idx}>{spec}</li>
                  ))}
                </ul>
              </Link>
            </div>
          ))
        )}
      </div>
      <style jsx>{`
        .rental-catalogue-view {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 16px 64px 16px;
        }
        .rental-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .rental-subtitle {
          color: #666;
          font-size: 1.1rem;
          margin-bottom: 24px;
        }
        .rental-filters {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .rental-category-select, .rental-search-input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }
        .products-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .product-card-wrapper {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          padding: 18px 18px 12px 18px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          transition: box-shadow 0.2s;
        }
        .product-card-wrapper:hover {
          box-shadow: 0 6px 24px rgba(0,0,0,0.13);
        }
        .rental-specs-list {
          margin: 16px 0 0 0;
          padding: 0 0 0 18px;
          color: #444;
          font-size: 0.98rem;
        }
        .no-products {
          grid-column: 1/-1;
          text-align: center;
          color: #888;
          font-size: 1.2rem;
          padding: 40px 0;
        }
        @media (max-width: 700px) {
          .products-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductRental; 