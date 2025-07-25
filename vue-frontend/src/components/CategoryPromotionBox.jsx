import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const CategoryPromotionBox = ({ category }) => {
  const [promotions, setPromotions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Equivalent to computed property in Vue
  const currentPromotion = promotions[currentIndex];

  // Methods from Vue component
  const nextPromotion = () => {
    setCurrentIndex((currentIndex + 1) % promotions.length);
  };

  const prevPromotion = () => {
    setCurrentIndex((currentIndex - 1 + promotions.length) % promotions.length);
  };

  const fetchPromotions = async () => {
    try {
      const response = await productService.getPromotionsByCategory(category.id);
      setPromotions(response.data.data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const getImageUrl = (promotion) => {
    const imageData = promotion.attributes.image.data;
    if (!imageData || !imageData.attributes || !imageData.attributes.url) return '';
    return `${import.meta.env.VITE_API_URL.replace(/\/api$/, '')}${imageData.attributes.url}`;
  };

  // Equivalent to Vue's created() hook
  useEffect(() => {
    fetchPromotions();
  }, [category.id]); // Re-run when category.id changes

  return (
    <div className="category-promotion-box">
      <h3>{category.name}</h3>
      <div className="promotion-content">
        <button className="nav-button" onClick={prevPromotion}>◀</button>
        {currentPromotion && (
          <div className="promotion-item">
            <img 
              src={getImageUrl(currentPromotion)} 
              alt={currentPromotion.attributes.title} 
            />
            <p>{currentPromotion.attributes.title}</p>
          </div>
        )}
        <button className="nav-button" onClick={nextPromotion}>▶</button>
      </div>

      <style jsx>{`
        .category-promotion-box {
          position: relative;
          padding: 10px;
          text-align: center;
          background-color: #e0f7fa; /* Light blue background */
          border: 1px solid #b2ebf2; /* Light blue border */
          transition: transform 0.3s, box-shadow 0.3s; /* Smooth hover effect */
        }

        .category-promotion-box:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 10px rgba(255, 0, 0, 0.2); /* Red shadow on hover */
        }
        
        .promotion-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .nav-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
        
        .promotion-item {
          flex: 1;
          margin: 0 10px;
        }
        
        .promotion-item img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        
        .promotion-item p {
          margin-top: 10px;
          font-size: 16px;
          color: #333; 
        }

        .category-promotion-box::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: transparent;
          transition: background-color 0.3s;
        }

        .category-promotion-box:hover::after {
          background-color: rgba(255, 0, 0, 0.1); /* Red overlay */
        }
      `}</style>
    </div>
  );
};

export default CategoryPromotionBox;