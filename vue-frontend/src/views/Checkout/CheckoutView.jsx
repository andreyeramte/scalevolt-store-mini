import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { getAuth } from 'firebase/auth';

const CheckoutView = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const auth = getAuth();
  
  // Current step in checkout process
  const [currentStep, setCurrentStep] = useState(1);
  
  // Cart items from localStorage (you might want to use a cart store here)
  const [cartItems, setCartItems] = useState([]);
  
  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
  
  // Shipping information
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: i18n.language === 'pl' ? 'Poland' : 'Ukraine',
    method: 'standard'
  });
  
  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Load cart items and user data on mount
  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(savedCart);
    
    // Check if cart is empty
    if (savedCart.length === 0) {
      toast.error(t('cart.emptyCartError', 'Your cart is empty'));
      navigate('/cart');
      return;
    }
    
    // Load user data if authenticated
    const user = auth.currentUser;
    if (user) {
      // Pre-fill basic information
      const nameParts = user.displayName ? user.displayName.split(' ') : ['', ''];
      setShippingInfo(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || ''
      }));
      
      // Load saved addresses (mock data for now)
      const mockAddresses = [
        {
          id: 'addr1',
          label: 'Home',
          type: 'shipping',
          fullName: 'Ivan Petrenko',
          street: 'Khreshchatyk Street 12',
          apartment: 'Apt 45',
          city: 'Kyiv',
          postalCode: '01001',
          country: i18n.language === 'pl' ? 'Poland' : 'Ukraine',
          phone: '+380991234567',
          isDefault: true
        },
        {
          id: 'addr2',
          label: 'Office',
          type: 'shipping',
          fullName: 'Ivan Petrenko',
          street: 'Business Center',
          apartment: 'Floor 3, Office 302',
          city: 'Kyiv',
          postalCode: '01004',
          country: i18n.language === 'pl' ? 'Poland' : 'Ukraine',
          phone: '+380991234567',
          isDefault: false
        }
      ];
      
      setSavedAddresses(mockAddresses);
      
      // If there's a default address, select it
      const defaultIndex = mockAddresses.findIndex(addr => addr.isDefault);
      if (defaultIndex >= 0) {
        selectSavedAddress(defaultIndex);
      }
    }
  }, [auth, navigate, t, i18n.language]);

  // Computed values
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const totalQuantity = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const standardShippingCost = useMemo(() => 
    totalPrice > 5000 ? 0 : 200, [totalPrice]
  );

  const expressShippingCost = useMemo(() => 
    totalPrice > 10000 ? 0 : 350, [totalPrice]
  );

  const shippingCost = useMemo(() => {
    return shippingInfo.method === 'express' ? expressShippingCost : standardShippingCost;
  }, [shippingInfo.method, expressShippingCost, standardShippingCost]);

  const tax = useMemo(() => totalPrice * 0.2, [totalPrice]);

  const orderTotal = useMemo(() => {
    let total = totalPrice + tax + shippingCost;
    if (paymentMethod === 'pod') {
      total += 50;
    }
    return total;
  }, [totalPrice, tax, shippingCost, paymentMethod]);

  // Helper functions
  const formatPrice = (price) => {
    return price.toLocaleString('en-US');
  };

  const selectSavedAddress = (index) => {
    setSelectedAddressIndex(index);
    const address = savedAddresses[index];
    
    // Extract first and last name from full name
    const nameParts = address.fullName.split(' ');
    
    // Update shipping information
    setShippingInfo(prev => ({
      ...prev,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      phone: address.phone || '',
      address: `${address.street}, ${address.apartment}`,
      city: address.city || '',
      postalCode: address.postalCode || '',
      country: address.country || 'Ukraine'
    }));
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const editSection = (step) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const goToCart = () => {
    navigate('/cart');
  };

  const getShippingMethodName = () => {
    if (shippingInfo.method === 'express') {
      return `${t('delivery.expressDelivery', 'Express Delivery')} (1-2 ${t('delivery.days', 'days')})`;
    } else {
      return `${t('delivery.standardDelivery', 'Standard Delivery')} (3-5 ${t('delivery.days', 'days')})`;
    }
  };

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
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

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error(t('cart.emptyCartError', 'Cart is empty'));
      return;
    }
    
    try {
      toast.info('Processing your order...');
      
      // Initialize Stripe
      const stripe = await loadStripe('YOUR_PUBLISHABLE_KEY');
      
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shippingInfo: { ...shippingInfo },
        paymentMethod: paymentMethod,
        totals: {
          subtotal: totalPrice,
          tax: tax,
          shipping: shippingCost,
          total: orderTotal
        }
      };
      
      // Create a checkout session on the server
      const response = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const session = await response.json();
      
      if (session.id) {
        if (paymentMethod === 'card') {
          const result = await stripe.redirectToCheckout({
            sessionId: session.id,
          });
          
          if (result.error) {
            toast.error(result.error.message);
          }
        } else {
          localStorage.setItem('orderData', JSON.stringify(orderData));
          navigate(`/checkout/success?orderId=${session.orderId}`);
        }
      } else if (session.url) {
        window.location.href = session.url;
      } else {
        toast.error('Unable to process your order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An error occurred during checkout. Please try again.');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  const handleShippingInfoChange = (field, value) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="checkout-view">
      <h1>{t('checkout.shippingAddress', 'Shipping Address')}</h1>

      <div className="checkout-container">
        {/* Checkout Steps */}
        <div className="checkout-steps">
          <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
            1. {t('checkout.shippingAddress', 'Shipping Address')}
          </div>
          <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
            2. {t('checkout.paymentMethod', 'Payment Method')}
          </div>
          <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
            3. {t('checkout.orderSummary', 'Order Summary')}
          </div>
        </div>

        {/* Step 1: Shipping Information */}
        {currentStep === 1 && (
          <div className="checkout-section shipping-info">
            <h2>{t('checkout.shippingAddress', 'Shipping Address')}</h2>
            
            {/* Saved Addresses Section */}
            {savedAddresses.length > 0 && (
              <div className="saved-addresses">
                <h3>{t('profile.personal.addresses', 'Saved Addresses')}</h3>
                <div className="address-selection">
                  {savedAddresses.map((address, index) => (
                    <div 
                      key={index}
                      className={`address-option ${selectedAddressIndex === index ? 'selected' : ''}`}
                      onClick={() => selectSavedAddress(index)}
                    >
                      <div className="address-info">
                        <div className="address-name">
                          {address.label} 
                          {address.isDefault && (
                            <span className="default-badge">
                              {t('profile.personal.default', 'Default')}
                            </span>
                          )}
                        </div>
                        <p>{address.fullName}</p>
                        <p>{address.street}, {address.apartment}</p>
                        <p>{address.city}, {address.postalCode}</p>
                        <p>{address.country}</p>
                        <p>{address.phone}</p>
                      </div>
                      <div className="address-select">
                        <input 
                          type="radio" 
                          id={`address-${index}`} 
                          name="saved-address" 
                          checked={selectedAddressIndex === index}
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="or-separator">
                  <span>
                    {t('common.or', 'or')} {t('profile.personal.add_new_address', 'Add New Address')}
                  </span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleFormSubmit} className="shipping-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">{t('auth.firstName', 'First Name')}</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    value={shippingInfo.firstName}
                    onChange={(e) => handleShippingInfoChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">{t('auth.lastName', 'Last Name')}</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    value={shippingInfo.lastName}
                    onChange={(e) => handleShippingInfoChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">{t('auth.email', 'Email')}</label>
                <input 
                  type="email" 
                  id="email" 
                  value={shippingInfo.email}
                  onChange={(e) => handleShippingInfoChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">{t('auth.phone', 'Phone')}</label>
                <input 
                  type="tel" 
                  id="phone" 
                  value={shippingInfo.phone}
                  onChange={(e) => handleShippingInfoChange('phone', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">{t('profile.personal.street_address', 'Street Address')}</label>
                <input 
                  type="text" 
                  id="address" 
                  value={shippingInfo.address}
                  onChange={(e) => handleShippingInfoChange('address', e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">{t('profile.personal.city', 'City')}</label>
                  <input 
                    type="text" 
                    id="city" 
                    value={shippingInfo.city}
                    onChange={(e) => handleShippingInfoChange('city', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">{t('profile.personal.postal_code', 'Postal Code')}</label>
                  <input 
                    type="text" 
                    id="postalCode" 
                    value={shippingInfo.postalCode}
                    onChange={(e) => handleShippingInfoChange('postalCode', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country">{t('profile.personal.country', 'Country')}</label>
                <select 
                  id="country" 
                  value={shippingInfo.country}
                  onChange={(e) => handleShippingInfoChange('country', e.target.value)}
                  required
                >
                  <option value="Ukraine">{t('common.ukrainian', 'Ukraine')}</option>
                  <option value="Poland">{t('common.polish', 'Poland')}</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group shipping-options">
                <h3>{t('checkout.shippingMethod', 'Shipping Method')}</h3>
                <div className="shipping-option">
                  <input 
                    type="radio" 
                    id="standard" 
                    value="standard" 
                    checked={shippingInfo.method === 'standard'}
                    onChange={(e) => handleShippingInfoChange('method', e.target.value)}
                  />
                  <label htmlFor="standard">
                    <div className="shipping-option-details">
                      <span className="option-name">{t('delivery.standardDelivery', 'Standard Delivery')}</span>
                      <span className="option-time">3-5 {t('delivery.days', 'days')}</span>
                    </div>
                    <span className="option-price">{formatPrice(standardShippingCost)} грн</span>
                  </label>
                </div>
                <div className="shipping-option">
                  <input 
                    type="radio" 
                    id="express" 
                    value="express" 
                    checked={shippingInfo.method === 'express'}
                    onChange={(e) => handleShippingInfoChange('method', e.target.value)}
                  />
                  <label htmlFor="express">
                    <div className="shipping-option-details">
                      <span className="option-name">{t('delivery.expressDelivery', 'Express Delivery')}</span>
                      <span className="option-time">1-2 {t('delivery.days', 'days')}</span>
                    </div>
                    <span className="option-price">{formatPrice(expressShippingCost)} грн</span>
                  </label>
                </div>
              </div>

              <div className="form-buttons">
                <button type="button" onClick={goToCart} className="back-button">
                  {t('cart.continueShopping', 'Continue Shopping')}
                </button>
                <button type="submit" className="next-button">
                  {t('checkout.paymentMethod', 'Payment Method')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {currentStep === 2 && (
          <div className="checkout-section payment-info">
            <h2>{t('checkout.paymentMethod', 'Payment Method')}</h2>
            <div className="payment-options">
              <div className="payment-option">
                <input 
                  type="radio" 
                  id="card-payment" 
                  value="card" 
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="card-payment">
                  <span className="option-name">Credit/Debit Card</span>
                  <div className="card-icons">
                    <span className="card-icon">Visa</span>
                    <span className="card-icon">Mastercard</span>
                  </div>
                </label>
              </div>
              <div className="payment-option">
                <input 
                  type="radio" 
                  id="bank-transfer" 
                  value="transfer" 
                  checked={paymentMethod === 'transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="bank-transfer">
                  <span className="option-name">Bank Transfer</span>
                </label>
              </div>
              <div className="payment-option">
                <input 
                  type="radio" 
                  id="pay-on-delivery" 
                  value="pod" 
                  checked={paymentMethod === 'pod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="pay-on-delivery">
                  <span className="option-name">Pay on Delivery</span>
                  <span className="option-price">+50 грн</span>
                </label>
              </div>
            </div>

            <div className="form-buttons">
              <button type="button" onClick={prevStep} className="back-button">
                {t('checkout.shippingAddress', 'Shipping Address')}
              </button>
              <button type="button" onClick={nextStep} className="next-button">
                {t('checkout.orderSummary', 'Order Summary')}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Order Review */}
        {currentStep === 3 && (
          <div className="checkout-section order-review">
            <h2>{t('checkout.orderSummary', 'Order Summary')}</h2>
            
            <div className="review-section">
              <h3>{t('checkout.shippingAddress', 'Shipping Address')}</h3>
              <div className="review-info">
                <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                <p>{shippingInfo.email}</p>
                <p>{shippingInfo.phone}</p>
                <p>{shippingInfo.address}</p>
                <p>{shippingInfo.city}, {shippingInfo.postalCode}</p>
                <p>{shippingInfo.country}</p>
                <p><strong>{t('checkout.shippingMethod', 'Shipping Method')}:</strong> {getShippingMethodName()}</p>
              </div>
              <button type="button" onClick={() => editSection(1)} className="edit-button">
                {t('profile.personal.edit_address', 'Edit')}
              </button>
            </div>
            
            <div className="review-section">
              <h3>{t('checkout.paymentMethod', 'Payment Method')}</h3>
              <div className="review-info">
                <p><strong>{getPaymentMethodName()}</strong></p>
              </div>
              <button type="button" onClick={() => editSection(2)} className="edit-button">
                {t('profile.personal.edit_address', 'Edit')}
              </button>
            </div>
            
            <div className="review-section">
              <h3>{t('cart.items', 'Items')}</h3>
              <div className="order-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="review-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="item-quantity">{t('product.quantity', 'Quantity')}: {item.quantity}</p>
                    </div>
                    <p className="item-price">{formatPrice(item.price * item.quantity)} грн</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-buttons">
              <button type="button" onClick={prevStep} className="back-button">
                {t('checkout.paymentMethod', 'Payment Method')}
              </button>
              <button type="button" onClick={handleCheckout} className="checkout-button">
                {t('checkout.placeOrder', 'Place Order')}
              </button>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="order-summary">
          <h2>{t('cart.orderSummary', 'Order Summary')}</h2>
          <div className="summary-item">
            <span>{t('cart.items', 'Items')} ({totalQuantity}):</span>
            <span>{formatPrice(totalPrice)} грн</span>
          </div>
          <div className="summary-item">
            <span>{t('cart.tax', 'Tax')} (20%):</span>
            <span>{formatPrice(tax)} грн</span>
          </div>
          <div className="summary-item">
            <span>{t('cart.shipping', 'Shipping')}:</span>
            <span>{formatPrice(shippingCost)} грн</span>
          </div>
          {paymentMethod === 'pod' && (
            <div className="summary-item">
              <span>Pay on Delivery Fee:</span>
              <span>50 грн</span>
            </div>
          )}
          <hr />
          <div className="summary-total">
            <span>{t('cart.total', 'Total')}:</span>
            <span>{formatPrice(orderTotal)} грн</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Root Styles */
        .checkout-view {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Inter', sans-serif;
          color: #333;
        }

        h1 {
          text-align: center;
          margin-bottom: 40px;
          font-size: 2rem;
          font-weight: 600;
        }

        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 20px;
        }

        h3 {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 15px;
        }

        /* Checkout Steps */
        .checkout-steps {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          position: relative;
        }

        .checkout-steps::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #eee;
          z-index: 1;
        }

        .step {
          position: relative;
          z-index: 2;
          background-color: #fff;
          padding: 10px 20px;
          border-radius: 20px;
          font-weight: 500;
          color: #999;
          border: 2px solid #eee;
        }

        .step.active {
          color: #333;
          border-color: #52c41a;
          background-color: #f6ffed;
        }

        /* Checkout Container */
        .checkout-container {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
        }

        .checkout-section {
          flex: 2;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 30px;
        }

        /* Form Styles */
        .form-row {
          display: flex;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 20px;
          flex: 1;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }

        input, select {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }

        input:focus, select:focus {
          outline: none;
          border-color: #52c41a;
          box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.2);
        }

        /* Shipping Options */
        .shipping-options {
          margin-top: 30px;
        }

        .shipping-option {
          margin-bottom: 15px;
        }

        .shipping-option input[type="radio"] {
          position: absolute;
          opacity: 0;
        }

        .shipping-option label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .shipping-option input[type="radio"]:checked + label {
          border-color: #52c41a;
          background-color: #f6ffed;
        }

        .shipping-option-details {
          display: flex;
          flex-direction: column;
        }

        .option-name {
          font-weight: 600;
        }

        .option-time {
          font-size: 0.9rem;
          color: #666;
        }

        .option-price {
          font-weight: 600;
        }

        /* Payment Options */
        .payment-options {
          margin-bottom: 30px;
        }

        .payment-option {
          margin-bottom: 15px;
        }

        .payment-option input[type="radio"] {
          position: absolute;
          opacity: 0;
        }

        .payment-option label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .payment-option input[type="radio"]:checked + label {
          border-color: #52c41a;
          background-color: #f6ffed;
        }

        .card-icons {
          display: flex;
          gap: 10px;
        }

        .card-icon {
          font-size: 0.9rem;
          color: #666;
        }

        /* Review Section */
        .review-section {
          margin-bottom: 30px;
          position: relative;
          padding: 20px;
          border: 1px solid #eee;
          border-radius: 8px;
        }

        .review-info p {
          margin: 5px 0;
        }

        .edit-button {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: #1890ff;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .order-items {
          max-height: 300px;
          overflow-y: auto;
          margin-top: 15px;
        }

        .review-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }

        .item-image img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
        }

        .item-details {
          flex: 1;
          margin-left: 15px;
        }

        .item-name {
          font-weight: 500;
        }

        .item-quantity {
          font-size: 0.9rem;
          color: #666;
        }

        .item-price {
          font-weight: 600;
        }

        /* Order Summary */
        .order-summary {
          flex: 1;
          padding: 30px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          align-self: flex-start;
          position: sticky;
          top: 20px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-size: 1rem;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 20px 0;
        }

        hr {
          border: none;
          border-top: 1px solid #eee;
          margin: 20px 0;
        }

        /* Button Styles */
        .form-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }

        .back-button {
          padding: 12px 24px;
          background-color: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          background-color: #e0e0e0;
        }

        .next-button, .checkout-button {
          padding: 12px 24px;
          background-color: #52c41a;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .next-button:hover, .checkout-button:hover {
          background-color: #41a516;
        }

        /* Saved Addresses Styles */
        .saved-addresses {
          margin-bottom: 30px;
        }

        .address-selection {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .address-option {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .address-option:hover {
          border-color: #52c41a;
        }

        .address-option.selected {
          border-color: #52c41a;
          background-color: #f6ffed;
        }

        .address-info {
          flex: 1;
        }

        .address-info p {
          margin: 5px 0;
          font-size: 0.9rem;
        }

        .address-name {
          font-weight: 600;
          margin-bottom: 8px;
        }

        .default-badge {
          background-color: #e7f5ff;
          color: #0066cc;
          font-size: 0.75rem;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 5px;
        }

        .address-select {
          padding-top: 5px;
        }

        .or-separator {
          position: relative;
          text-align: center;
          margin: 30px 0;
        }

        .or-separator::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background-color: #eee;
        }

        .or-separator span {
          position: relative;
          background-color: #fff;
          padding: 0 15px;
          color: #666;
          font-size: 0.9rem;
        }

        /* Responsive Styles */
        @media (max-width: 992px) {
          .checkout-container {
            flex-direction: column;
          }
          
          .form-row {
            flex-direction: column;
            gap: 0;
          }
          
          .order-summary {
            position: static;
            width: 100%;
          }
          
          .address-selection {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          h1 {
            font-size: 1.75rem;
          }
          
          .checkout-section, .order-summary {
            padding: 20px;
          }
          
          .checkout-steps {
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }
          
          .checkout-steps::before {
            display: none;
          }
          
          .form-buttons {
            flex-direction: column;
            gap: 10px;
          }
          
          .back-button, .next-button, .checkout-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutView;