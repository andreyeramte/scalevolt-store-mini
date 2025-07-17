import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useCartStore from '../../stores/cart';
import './ProductCard.css';

const ProductCard = ({
  productId,
  title,
  price,
  imageSrc,
  brand = '',
  rentalPrices = {},
  isRentalItem = false,
  region = 'ua', // default to 'ua' if not provided
}) => {
  const { t } = useTranslation();
  const { cartItems, addToCart, increaseQuantity, decreaseQuantity, getItemQuantity } = useCartStore();
  
  // State for rental duration
  const [selectedDuration, setSelectedDuration] = useState('day');
  
  // Get current quantity from cart
  const cartCount = getItemQuantity(productId);
  
  // Product link with region
  const productLink = `/${region}/product/${productId}`;
  
  // Method to format rental price
  const formatRentalPrice = (duration) => {
    return rentalPrices[duration]
      ? rentalPrices[duration].toLocaleString()
      : 'N/A';
  };
  
  // Method to format duration display based on current language
  const formatDurationDisplay = (duration) => {
    const durationKeys = {
      day: 'product.durations.day',
      week: 'product.durations.week',
      month: 'product.durations.month',
    };
    
    return durationKeys[duration]
      ? t(durationKeys[duration])
      : duration.charAt(0).toUpperCase() + duration.slice(1);
  };
  
  // Method to select rental duration
  const selectRentalDuration = (duration) => {
    setSelectedDuration(duration);
  };
  
  // Method to add product to cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isRentalItem) {
      // Special handling for rental items
      addToCart({
        id: productId,
        name: title,
        price: rentalPrices[selectedDuration],
        image: imageSrc,
        brand: brand,
        quantity: 1,
        rentalDuration: selectedDuration,
        isRental: true,
      });
    } else {
      // Regular product add to cart
      addToCart({
        id: productId,
        name: title,
        price: price,
        image: imageSrc,
        brand: brand,
        quantity: 1,
      });
    }
  };
  
  // Method to increase quantity
  const handleIncreaseCount = (e) => {
    e.stopPropagation();
    e.preventDefault();
    increaseQuantity(productId);
  };
  
  // Method to decrease quantity
  const handleDecreaseCount = (e) => {
    e.stopPropagation();
    e.preventDefault();
    decreaseQuantity(productId);
  };
  
  return (
    <div className={`product-card ${isRentalItem ? 'rental-mode' : ''}`}>
      {/* Only Image & Title Navigate to Product Page */}
      <Link to={productLink} className="product-image">
        <img src={imageSrc} alt={title || 'Product Image'} />
      </Link>
      
      <Link to={productLink} className="product-name">
        <h2>{t(title)}</h2>
      </Link>
      
      {/* Conditionally show brand if not empty */}
      {brand && (
        <div className="product-brand">
          {t('product.brand')}: {brand}
        </div>
      )}
      
      {/* Pricing Display */}
      {isRentalItem ? (
        <div className="rental-pricing">
          <div className="rental-duration-options">
            {Object.keys(rentalPrices).map((duration) => (
              <button
                key={duration}
                onClick={() => selectRentalDuration(duration)}
                className={selectedDuration === duration ? 'selected' : ''}
              >
                {formatDurationDisplay(duration)}
              </button>
            ))}
          </div>
          <h3 className="product-price">
            {formatRentalPrice(selectedDuration)} грн / {selectedDuration}
          </h3>
        </div>
      ) : (
        <h3 className="product-price">{price} грн</h3>
      )}
      
      {/* Transition between Add-to-Cart and +/- controls */}
      <div className="cart-controls">
        {cartCount > 0 ? (
          <div className="quantity-controls fade-in">
            <button 
              onClick={handleDecreaseCount} 
              className="decrement-btn"
            >
              -
            </button>
            <span className="quantity-number">{cartCount}</span>
            <button 
              onClick={handleIncreaseCount} 
              className="increment-btn"
            >
              +
            </button>
          </div>
        ) : (
          <button 
            className="add-to-cart fade-in" 
            onClick={handleAddToCart}
          >
            {isRentalItem ? t('product.rent') : t('product.addToCart')}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;