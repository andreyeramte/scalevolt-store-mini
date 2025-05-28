import { useState, useEffect, useMemo } from 'react';

const CartView = ({ onNavigate, onShowToast }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Translation function (replace with your i18n solution)
  const t = (key) => {
    const translations = {
      'cart.yourCart': 'Ваш кошик',
      'product.price': 'Ціна',
      'cart.subtotal': 'Підсума',
      'common.remove': 'Видалити',
      'cart.orderSummary': 'Підсумок замовлення',
      'cart.items': 'Товари',
      'cart.tax': 'Податок',
      'cart.shipping': 'Доставка',
      'cart.free': 'Безкоштовно',
      'cart.total': 'Разом',
      'cart.checkout': 'Оформити замовлення',
      'cart.continueShopping': 'Продовжити покупки',
      'cart.empty': 'Ваш кошик порожній',
      'cart.itemRemoved': 'Товар видалено з кошика',
      'cart.quantityUpdated': 'Кількість оновлено',
      'cart.emptyCartError': 'Кошик порожній'
    };
    return translations[key] || key;
  };

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
      }
    };

    loadCartItems();
  }, []);

  // Save cart items to localStorage whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart items:', error);
    }
  }, [cartItems]);

  // Computed values
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const totalQuantity = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const tax = useMemo(() => totalPrice * 0.2, [totalPrice]); // 20% Tax
  const shipping = useMemo(() => totalPrice > 5000 ? 0 : 200, [totalPrice]); // Free shipping over 5000 грн
  const total = useMemo(() => totalPrice + tax + shipping, [totalPrice, tax, shipping]);

  // Helper functions
  const formatPrice = (price) => {
    return price.toLocaleString("en-US");
  };

  const showToast = (message, type = 'success') => {
    if (onShowToast) {
      onShowToast(message, type);
    } else {
      console.log(`${type}: ${message}`);
    }
  };

  const navigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  // Cart management functions
  const removeFromCart = (uniqueKey) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== uniqueKey);
      showToast(t("cart.itemRemoved"));
      return updatedItems;
    });
  };

  const increaseQuantity = (uniqueKey) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === uniqueKey) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      showToast(t("cart.quantityUpdated"));
      return updatedItems;
    });
  };

  const decreaseQuantity = (uniqueKey) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === uniqueKey && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      showToast(t("cart.quantityUpdated"));
      return updatedItems;
    });
  };

  const updateQuantity = (uniqueKey, quantity) => {
    const qty = parseInt(quantity, 10);
    if (qty > 0) {
      setCartItems(prevItems => {
        return prevItems.map(item => {
          if (item.id === uniqueKey) {
            return { ...item, quantity: qty };
          }
          return item;
        });
      });
    }
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      showToast(t("cart.emptyCartError"), 'error');
      return;
    }

    navigate('/checkout');
  };

  const continueShopping = () => {
    navigate('/');
  };

  return (
    <div className="cart-view">
      <h1 className="page-title">{t("cart.yourCart")}</h1>

      {cartItems.length > 0 ? (
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="product-image"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-product.png';
                  }}
                />
                <div className="product-details">
                  <h3>{item.name}</h3>
                  <p className="product-price">
                    {t("product.price")}: {formatPrice(item.price)} грн
                  </p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      aria-label="Decrease quantity"
                      className="quantity-button"
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                      className="quantity-input"
                      min="1"
                    />
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      aria-label="Increase quantity"
                      className="quantity-button"
                    >
                      +
                    </button>
                  </div>
                  <p className="product-subtotal">
                    {t("cart.subtotal")}:
                    {formatPrice(item.price * item.quantity)} грн
                  </p>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="remove-button"
                  >
                    <span className="remove-icon">×</span>
                    {t("common.remove")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>{t("cart.orderSummary")}</h2>
            <div className="summary-item">
              <span>{t("cart.items")}:</span>
              <span>{totalQuantity}</span>
            </div>
            <div className="summary-item">
              <span>{t("cart.subtotal")}:</span>
              <span>{formatPrice(totalPrice)} грн</span>
            </div>
            <div className="summary-item">
              <span>{t("cart.tax")} (20%):</span>
              <span>{formatPrice(tax)} грн</span>
            </div>
            <div className="summary-item">
              <span>{t("cart.shipping")}:</span>
              <span>{formatPrice(shipping)} грн</span>
              {totalPrice > 5000 && (
                <span className="free-shipping-badge">
                  {t("cart.free")}
                </span>
              )}
            </div>
            <hr />
            <div className="summary-total">
              <span>{t("cart.total")}:</span>
              <span>{formatPrice(total)} грн</span>
            </div>
            <button 
              onClick={proceedToCheckout} 
              className="checkout-button"
              disabled={isLoading}
            >
              <span className="checkout-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L13 6M19 12L13 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {t("cart.checkout")}
            </button>
            <button 
              onClick={continueShopping} 
              className="continue-shopping-button"
            >
              {t("cart.continueShopping")}
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <img src="/images/Cart/empty-cart.png" alt="Empty Cart" />
          <p>{t("cart.empty")}</p>
          <button
            onClick={continueShopping}
            className="continue-shopping-button primary"
          >
            {t("cart.continueShopping")}
          </button>
        </div>
      )}

      <style jsx>{`
        /* Root Styles */
        .cart-view {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: "Inter", sans-serif;
          color: #333;
        }

        .page-title {
          text-align: center;
          margin: 80px 0 40px;
          font-size: 2rem;
          font-weight: 600;
          position: relative;
        }

        /* Cart Container */
        .cart-container {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
        }

        /* Cart Items */
        .cart-items {
          flex: 2;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cart-item {
          display: flex;
          gap: 20px;
          padding: 20px;
          background-color: #fafafa;
          border-radius: 12px;
          align-items: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .cart-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
        }

        .product-image {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .product-details {
          flex: 1;
        }

        .product-details h3 {
          margin: 0 0 10px 0;
          font-size: 1.25rem;
          font-weight: 500;
          color: #222;
        }

        .product-price,
        .product-subtotal {
          font-size: 1rem;
          margin: 5px 0;
          color: #555;
        }

        .product-subtotal {
          font-weight: 500;
          color: #333;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 8px;
          margin: 15px 0;
        }

        .quantity-button {
          width: 36px;
          height: 36px;
          background-color: #f8f8f8;
          color: #333;
          border: 1px solid #e0e0e0;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .quantity-button:hover:not(:disabled) {
          background-color: #eee;
          transform: scale(1.05);
        }

        .quantity-button:active {
          transform: scale(0.98);
        }

        .quantity-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-input {
          width: 50px;
          height: 36px;
          text-align: center;
          font-size: 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 0 8px;
        }

        .quantity-input:focus {
          outline: none;
          border-color: #52c41a;
          box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.1);
        }

        .remove-button {
          margin-top: 10px;
          padding: 8px 14px;
          background-color: #fff;
          color: #ff4d4f;
          border: 1px solid #ff4d4f;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .remove-button:hover {
          background-color: #fff1f0;
        }

        .remove-icon {
          font-size: 16px;
          font-weight: bold;
        }

        /* Cart Summary */
        .cart-summary {
          flex: 1;
          padding: 30px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 100px;
          max-height: calc(100vh - 120px);
          align-self: flex-start;
        }

        .cart-summary h2 {
          margin-bottom: 30px;
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          color: #222;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-size: 1rem;
          color: #555;
          position: relative;
        }

        .free-shipping-badge {
          position: absolute;
          top: -8px;
          right: 0;
          background-color: #52c41a;
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.25rem;
          font-weight: 600;
          color: #222;
          margin: 20px 0;
        }

        .cart-summary hr {
          border: none;
          border-top: 1px solid #eee;
          margin: 20px 0;
        }

        .checkout-button {
          width: 100%;
          padding: 14px 20px;
          background-color: #52c41a;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 6px rgba(82, 196, 26, 0.2);
        }

        .checkout-button:hover:not(:disabled) {
          background-color: #46b314;
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(82, 196, 26, 0.25);
        }

        .checkout-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(82, 196, 26, 0.2);
        }

        .checkout-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .checkout-icon {
          display: flex;
          align-items: center;
        }

        .continue-shopping-button {
          width: 100%;
          margin-top: 12px;
          padding: 12px 20px;
          background-color: transparent;
          color: #1890ff;
          border: 1px solid #1890ff;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .continue-shopping-button:hover {
          background-color: #e6f7ff;
        }

        .continue-shopping-button.primary {
          background-color: #1890ff;
          color: #ffffff;
          border: none;
          box-shadow: 0 4px 6px rgba(24, 144, 255, 0.2);
        }

        .continue-shopping-button.primary:hover {
          background-color: #096dd9;
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(24, 144, 255, 0.25);
        }

        /* Empty Cart */
        .empty-cart {
          text-align: center;
          margin-top: 100px;
          padding: 40px;
          background-color: #fafafa;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .empty-cart img {
          width: 180px;
          margin-bottom: 30px;
          opacity: 0.8;
        }

        .empty-cart p {
          font-size: 1.5rem;
          color: #666;
          margin-bottom: 20px;
        }

        /* Responsive Styles */
        @media (max-width: 992px) {
          .cart-container {
            flex-direction: column;
          }

          .cart-summary {
            width: 100%;
            position: static;
            max-height: none;
          }

          .cart-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .product-image {
            width: 100%;
            max-width: 200px;
            height: auto;
            margin-bottom: 10px;
          }
        }

        @media (max-width: 576px) {
          .page-title {
            font-size: 1.75rem;
            margin-top: 70px;
          }

          .cart-summary {
            padding: 20px;
          }

          .checkout-button {
            padding: 12px;
          }

          .cart-item {
            padding: 15px;
          }

          .product-details h3 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CartView;