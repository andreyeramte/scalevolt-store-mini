import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useCartStore from '../../stores/cart';

const CheckoutCancel = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cartItems } = useCartStore();

  // Calculate total price
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  // Format price with thousands separator
  const formatPrice = (price) => {
    return price.toLocaleString('en-US');
  };

  const retryCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cancel-view">
      <div className="cancel-container">
        <div className="cancel-icon">
          <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
            <circle cx="26" cy="26" r="25" fill="#ff4d4f" />
            <path d="M16,16 L36,36 M36,16 L16,36" stroke="white" strokeWidth="4" />
          </svg>
        </div>
        <h1>{t('checkout.paymentCancelled', 'Payment Cancelled')}</h1>
        <p className="cancel-message">
          {t('checkout.cancelMessage', 'Your payment was cancelled. Don\'t worry, no charges were made to your account. Your items are still in your cart.')}
        </p>
        <div className="cart-summary">
          <h2>{t('cart.orderSummary', 'Order Summary')}</h2>
          <p>{t('cart.total', 'Total')}: {formatPrice(totalPrice)} грн</p>
        </div>
        <button onClick={retryCheckout} className="retry-button">
          {t('checkout.retryPayment', 'Try Again')}
        </button>
        <Link to="/cart" className="back-to-cart">
          {t('cart.continueShopping', 'Continue Shopping')}
        </Link>
      </div>
    </div>
  );
};

export default CheckoutCancel;