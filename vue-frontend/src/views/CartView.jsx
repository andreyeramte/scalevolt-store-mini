import React, { useMemo } from 'react';
import useCartStore from '../stores/cart';

const CartView = ({ onNavigate, onShowToast }) => {
  // Use Zustand cart store
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  } = useCartStore();

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

  // Computed values
  const totalPrice = useMemo(() => getCartTotal(), [cartItems, getCartTotal]);
  const totalQuantity = useMemo(() => getCartCount(), [cartItems, getCartCount]);
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
  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
    showToast(t("cart.itemRemoved"));
  };

  const handleIncreaseQuantity = (id) => {
    increaseQuantity(id);
    showToast(t("cart.quantityUpdated"));
  };

  const handleDecreaseQuantity = (id) => {
    decreaseQuantity(id);
    showToast(t("cart.quantityUpdated"));
  };

  const handleUpdateQuantity = (id, quantity) => {
    const qty = parseInt(quantity, 10);
    if (qty > 0) {
      updateQuantity(id, qty);
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
                      onClick={() => handleDecreaseQuantity(item.id)}
                      aria-label="Decrease quantity"
                      className="quantity-button"
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                      className="quantity-input"
                      min="1"
                    />
                    <button
                      onClick={() => handleIncreaseQuantity(item.id)}
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
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="remove-button"
                  >
                    {t("common.remove")}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>{t("cart.orderSummary")}</h2>
            <p>
              {t("cart.items")}: {totalQuantity}
            </p>
            <p>
              {t("cart.subtotal")}: {formatPrice(totalPrice)} грн
            </p>
            <p>
              {t("cart.tax")}: {formatPrice(tax)} грн
            </p>
            <p>
              {t("cart.shipping")}: {shipping === 0 ? t("cart.free") : formatPrice(shipping) + ' грн'}
            </p>
            <p className="cart-total">
              {t("cart.total")}: {formatPrice(total)} грн
            </p>
            <button onClick={proceedToCheckout} className="checkout-button">
              {t("cart.checkout")}
            </button>
            <button onClick={continueShopping} className="continue-shopping-button">
              {t("cart.continueShopping")}
            </button>
            <button onClick={clearCart} className="clear-cart-button">
              Очистити кошик
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <p>{t("cart.empty")}</p>
          <button onClick={continueShopping} className="continue-shopping-button">
            {t("cart.continueShopping")}
          </button>
        </div>
      )}
    </div>
  );
};

export default CartView;