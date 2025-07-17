import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useCartStore from '../../stores/cart';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  
  const [orderData, setOrderData] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [orderEmail, setOrderEmail] = useState('');
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    // Get order ID from URL params
    const orderIdFromUrl = searchParams.get('orderId') || 'ORDER-' + Date.now();
    setOrderId(orderIdFromUrl);

    // Load order data from localStorage (set during checkout)
    const savedOrderData = localStorage.getItem('orderData');
    if (savedOrderData) {
      const parsedOrderData = JSON.parse(savedOrderData);
      setOrderData(parsedOrderData);
      setOrderEmail(parsedOrderData.shippingInfo?.email || 'your-email@example.com');
      
      // Clear the order data from localStorage after loading
      localStorage.removeItem('orderData');
    }

    // Clear Zustand cart store since order is complete
    clearCart();
  }, [searchParams, clearCart]);

  const formatPrice = (price) => {
    return price.toLocaleString('en-US');
  };

  const getShippingMethodName = (method) => {
    if (method === 'express') {
      return `${t('delivery.expressDelivery', 'Express Delivery')} (1-2 ${t('delivery.days', 'days')})`;
    } else {
      return `${t('delivery.standardDelivery', 'Standard Delivery')} (3-5 ${t('delivery.days', 'days')})`;
    }
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'card':
        return 'Credit/Debit Card';
      case 'transfer':
        return 'Bank Transfer';
      case 'pod':
        return 'Pay on Delivery';
      default:
        return 'Credit/Debit Card';
    }
  };

  const trackOrder = () => {
    // Implement order tracking functionality
    console.log('Tracking order:', orderId);
    alert('Order tracking feature will be available soon!');
  };

  return (
    <div className="success-view">
      <div className="success-container">
        <div className="success-icon">
          <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
            <circle cx="26" cy="26" r="25" fill="#52c41a" />
            <path d="M14,27.5 L21,34.5 L38,17.5" stroke="white" strokeWidth="4" fill="none" />
          </svg>
        </div>
        
        <h1>{t('checkout.thankYou', 'Thank You for Your Order!')}</h1>
        <p className="order-number">Order #{orderId}</p>
        <p className="success-message">
          {t('checkout.orderProcessed', 'Your order has been successfully processed. We\'ve sent a confirmation email with all the details to')} {orderEmail}.
        </p>

        <div className="order-details">
          <h2>{t('checkout.orderSummary', 'Order Summary')}</h2>
          
          {orderData ? (
            <div className="summary-container">
              <div className="items-summary">
                <h3>{t('checkout.itemsOrdered', 'Items Ordered')}</h3>
                {orderData.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-quantity">Qty: {item.quantity}</p>
                    </div>
                    <p className="item-price">{formatPrice(item.price * item.quantity)} грн</p>
                  </div>
                ))}
              </div>
              
              <div className="shipping-summary">
                <h3>{t('checkout.shippingInformation', 'Shipping Information')}</h3>
                <p>{orderData.shippingInfo.firstName} {orderData.shippingInfo.lastName}</p>
                <p>{orderData.shippingInfo.address}</p>
                <p>{orderData.shippingInfo.city}, {orderData.shippingInfo.postalCode}</p>
                <p>{orderData.shippingInfo.country}</p>
                <p><strong>{t('checkout.shippingMethod', 'Shipping Method')}:</strong> {getShippingMethodName(orderData.shippingInfo.method)}</p>
              </div>
              
              <div className="payment-summary">
                <h3>{t('checkout.paymentDetails', 'Payment Details')}</h3>
                <p><strong>{t('checkout.paymentMethod', 'Payment Method')}:</strong> {getPaymentMethodName(orderData.paymentMethod)}</p>
                <div className="total-details">
                  <div className="total-row">
                    <span>{t('cart.subtotal', 'Subtotal')}:</span>
                    <span>{formatPrice(orderData.totals.subtotal)} грн</span>
                  </div>
                  <div className="total-row">
                    <span>{t('cart.tax', 'Tax')}:</span>
                    <span>{formatPrice(orderData.totals.tax)} грн</span>
                  </div>
                  <div className="total-row">
                    <span>{t('cart.shipping', 'Shipping')}:</span>
                    <span>{formatPrice(orderData.totals.shipping)} грн</span>
                  </div>
                  <div className="total-row total">
                    <span>{t('cart.total', 'Total')}:</span>
                    <span>{formatPrice(orderData.totals.total)} грн</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="loading-summary">
              <p>{t('common.loading', 'Loading order details...')}</p>
            </div>
          )}
        </div>
        
        <div className="action-buttons">
          <Link to="/" className="continue-button">
            {t('checkout.continueShopping', 'Continue Shopping')}
          </Link>
          <button onClick={trackOrder} className="track-button">
            {t('checkout.trackOrder', 'Track Your Order')}
          </button>
        </div>
        
        <div className="support-section">
          <h3>{t('checkout.needHelp', 'Need Help?')}</h3>
          <p>{t('checkout.supportMessage', 'If you have any questions about your order, please contact our customer support:')}</p>
          <a href="mailto:support@scalevolt.ua" className="support-link">support@scalevolt.ua</a>
          <p>{t('checkout.callUs', 'or call us at:')} <a href="tel:+380123456789" className="support-link">+38 (012) 345-67-89</a></p>
        </div>
      </div>

      <style jsx>{`
        .success-view {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Inter', sans-serif;
          color: #333;
        }

        .success-container {
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 40px;
          text-align: center;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 30px;
        }

        h1 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: #52c41a;
        }

        .order-number {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 15px;
        }

        .success-message {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .order-details {
          margin: 40px 0;
          text-align: left;
        }

        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 30px;
          text-align: center;
          color: #333;
        }

        h3 {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 15px;
          color: #333;
        }

        .summary-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }

        .items-summary,
        .shipping-summary,
        .payment-summary {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-weight: 500;
          margin-bottom: 5px;
          font-size: 1rem;
        }

        .item-quantity {
          color: #666;
          font-size: 0.9rem;
          margin: 0;
        }

        .item-price {
          font-weight: 600;
          font-size: 1rem;
          margin: 0;
        }

        .shipping-summary p,
        .payment-summary p {
          margin: 8px 0;
          line-height: 1.5;
        }

        .total-details {
          margin-top: 20px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 5px 0;
        }

        .total-row.total {
          border-top: 1px solid #ddd;
          padding-top: 15px;
          margin-top: 15px;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .loading-summary {
          text-align: center;
          padding: 40px 0;
          color: #666;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 40px 0;
        }

        .continue-button,
        .track-button {
          padding: 12px 24px;
          font-size: 1rem;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
          text-decoration: none;
          border: none;
          cursor: pointer;
        }

        .continue-button {
          background-color: #52c41a;
          color: #ffffff;
        }

        .continue-button:hover {
          background-color: #46b314;
          transform: translateY(-1px);
        }

        .track-button {
          background-color: #fff;
          color: #333;
          border: 1px solid #d9d9d9;
        }

        .track-button:hover {
          background-color: #f5f5f5;
          border-color: #40a9ff;
        }

        .support-section {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #eee;
          text-align: center;
        }

        .support-section h3 {
          font-size: 1.3rem;
          margin-bottom: 15px;
          text-align: center;
        }

        .support-section p {
          margin: 10px 0;
          color: #666;
        }

        .support-link {
          color: #1890ff;
          text-decoration: none;
          font-weight: 500;
        }

        .support-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .success-container {
            padding: 30px 20px;
          }

          .summary-container {
            gap: 20px;
          }

          .action-buttons {
            flex-direction: column;
            gap: 15px;
          }

          .continue-button,
          .track-button {
            width: 100%;
          }

          .order-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .item-price {
            align-self: flex-end;
          }
        }

        @media (max-width: 576px) {
          h1 {
            font-size: 1.75rem;
          }

          .success-message {
            font-size: 1rem;
          }

          .items-summary,
          .shipping-summary,
          .payment-summary {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutSuccess;