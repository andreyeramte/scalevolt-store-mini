import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import useCartStore from '../stores/cart';

const CartView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current region from URL
  const region = location.pathname.split('/')[1] || 'ua';
  
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

  // Computed values
  const totalPrice = useMemo(() => getCartTotal(), [cartItems, getCartTotal]);
  const totalQuantity = useMemo(() => getCartCount(), [cartItems, getCartCount]);
  const tax = useMemo(() => totalPrice * 0.2, [totalPrice]); // 20% Tax
  const shipping = useMemo(() => totalPrice > 5000 ? 0 : 200, [totalPrice]); // Free shipping over 5000 грн
  const total = useMemo(() => totalPrice + tax + shipping, [totalPrice, tax, shipping]);

  // Helper functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Cart management functions
  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
  };

  const handleIncreaseQuantity = (id) => {
    increaseQuantity(id);
  };

  const handleDecreaseQuantity = (id) => {
    decreaseQuantity(id);
  };

  const handleUpdateQuantity = (id, quantity) => {
    const qty = parseInt(quantity, 10);
    if (qty > 0) {
      updateQuantity(id, qty);
    }
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }
    navigate(`/${region}/checkout`);
  };

  const continueShopping = () => {
    navigate(`/${region}`);
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          backgroundColor: '#f8f9fa',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <ShoppingBag size={48} style={{ color: '#6c757d' }} />
        </div>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '12px'
        }}>
          {t('cart.empty', 'Your cart is empty')}
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#6c757d',
          marginBottom: '32px',
          maxWidth: '400px'
        }}>
          {t('cart.emptyDescription', 'Looks like you haven\'t added any products to your cart yet.')}
        </p>
        <button
          onClick={continueShopping}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeft size={20} />
          {t('cart.continueShopping', 'Continue Shopping')}
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e9ecef'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShoppingBag size={24} style={{ color: '#007bff' }} />
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
            margin: 0
          }}>
            {t('cart.yourCart', 'Your Cart')} ({totalQuantity})
          </h1>
        </div>
        <button
          onClick={continueShopping}
          style={{
            backgroundColor: 'transparent',
            color: '#007bff',
            border: '1px solid #007bff',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ArrowLeft size={16} />
          {t('cart.continueShopping', 'Continue Shopping')}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Cart Items */}
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e9ecef',
            overflow: 'hidden'
          }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  padding: '24px',
                  borderBottom: '1px solid #f8f9fa',
                  gap: '20px'
                }}
              >
                {/* Product Image */}
                <div style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '24px', color: '#6c757d' }}>📦</span>
                  )}
                </div>

                {/* Product Details */}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    {item.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6c757d',
                    marginBottom: '12px'
                  }}>
                    {item.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      {/* Quantity Controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #e9ecef',
                        borderRadius: '6px',
                        overflow: 'hidden'
                      }}>
                        <button
                          onClick={() => handleDecreaseQuantity(item.id)}
                          style={{
                            backgroundColor: '#f8f9fa',
                            border: 'none',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            color: '#6c757d'
                          }}
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                          style={{
                            width: '60px',
                            textAlign: 'center',
                            border: 'none',
                            padding: '8px',
                            fontSize: '14px'
                          }}
                          min="1"
                        />
                        <button
                          onClick={() => handleIncreaseQuantity(item.id)}
                          style={{
                            backgroundColor: '#f8f9fa',
                            border: 'none',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            color: '#6c757d'
                          }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#dc3545',
                          cursor: 'pointer',
                          padding: '8px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={16} />
                        {t('common.remove', 'Remove')}
                      </button>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#333'
                      }}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6c757d'
                      }}>
                        {formatPrice(item.price)} each
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e9ecef',
          padding: '24px',
          position: 'sticky',
          top: '20px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '20px'
          }}>
            {t('cart.orderSummary', 'Order Summary')}
          </h3>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ color: '#6c757d' }}>
                {t('cart.items', 'Items')} ({totalQuantity})
              </span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ color: '#6c757d' }}>
                {t('cart.tax', 'Tax')} (20%)
              </span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ color: '#6c757d' }}>
                {t('cart.shipping', 'Shipping')}
              </span>
              <span style={{ color: shipping === 0 ? '#28a745' : '#6c757d' }}>
                {shipping === 0 ? t('cart.free', 'Free') : formatPrice(shipping)}
              </span>
            </div>
            
            <div style={{
              borderTop: '1px solid #e9ecef',
              paddingTop: '12px',
              marginTop: '12px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: '600',
                color: '#333'
              }}>
                <span>{t('cart.total', 'Total')}</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={proceedToCheckout}
            style={{
              width: '100%',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <CreditCard size={20} />
            {t('cart.checkout', 'Proceed to Checkout')}
          </button>
          
          {totalPrice < 5000 && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#fff3cd',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#856404',
              textAlign: 'center'
            }}>
              {t('cart.freeShippingMessage', 'Add {amount} more for free shipping', { amount: formatPrice(5000 - totalPrice) })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartView;