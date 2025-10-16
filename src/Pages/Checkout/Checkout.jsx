import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../Common/Header/Header';
import Footer from '../../Common/Footer/Footer';
import Payment from '../Payment/Payment';
import './Checkout.scss';

function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [orderCreated, setOrderCreated] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('${process.env.REACT_APP_API_URL}/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
    } catch (err) {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    try {
      setProcessing(true);
      setError('');
      const token = localStorage.getItem('token');
      
      console.log('Creating order...');

      const orderData = {
        items: cart.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: calculateTotal(),
        shippingAddress: "User's default address"
      };

      const response = await axios.post(
        '${process.env.REACT_APP_API_URL}/api/orders/create',
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Order created:', response.data);
      setOrderCreated(response.data);
      return response.data;

    } catch (err) {
      console.error('Order creation error:', err);
      setError('Failed to create order. Please try again.');
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  const handleProceedToPayment = async () => {
    try {
      if (!cart?.items?.length) {
        setError('Your cart is empty');
        return;
      }

      await createOrder();
      setShowPayment(true);

    } catch (err) {
      console.error('Error proceeding to payment:', err);
    }
  };

  const handlePaymentSuccess = async (orderId) => {
    try {
      console.log('Payment successful for order:', orderId);
      
      await clearCart();
      
      window.location.href = `/order-success/${orderId}`;
      
    } catch (err) {
      console.error('Error after payment success:', err);
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setOrderCreated(null);
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('${process.env.REACT_APP_API_URL}/api/cart/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Cart cleared after successful payment');
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemsForPayment = () => {
    if (!cart?.items) return [];
    
    return cart.items.map(item => ({
      id: item.product.id,
      name: item.product.productname,
      price: item.product.price,
      quantity: item.quantity,
      imageUrl: item.product.imageUrl
    }));
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-container">
          <div className="loading">Loading checkout...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showPayment && orderCreated) {
    return (
      <Payment
        cartItems={getCartItemsForPayment()}
        totalAmount={calculateTotal()}
        onPaymentSuccess={handlePaymentSuccess}
        onBackToCart={handlePaymentCancel}
      />
    );
  }

  return (
    <div>
      <Header />
      <div className="checkout-page">
        <div className="checkout-container">
          <h1>Checkout</h1>
          
          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError('')} className="close-error">×</button>
            </div>
          )}

          <div className="checkout-content">
            <div className="order-summary-section">
              <h2>Order Summary</h2>
              <div className="order-items">
                {cart?.items?.length > 0 ? (
                  cart.items.map(item => (
                    <div key={item.id} className="checkout-item">
                      <div className="item-image">
                        <img 
                          src={item.product.imageUrl 
                            ? `${process.env.REACT_APP_API_URL}/images/products/${item.product.imageUrl}`
                            : '${process.env.REACT_APP_API_URL}/images/products/placeholder.png'
                          } 
                          alt={item.product.productname}
                          onError={(e) => {
                            e.target.src = '${process.env.REACT_APP_API_URL}/images/products/placeholder.png';
                          }}
                        />
                      </div>
                      <div className="item-details">
                        <h4>{item.product.productname}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.product.price}</p>
                      </div>
                      <div className="item-total">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-cart">
                    <p>Your cart is empty</p>
                  </div>
                )}
              </div>
              
              <div className="checkout-total">
                <div className="total-line">
                  <span>Subtotal:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="total-line">
                  <span>Shipping:</span>
                  <span>$0.00</span>
                </div>
                <div className="total-line final-total">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="checkout-actions">
                <button 
                  onClick={handleProceedToPayment}
                  disabled={processing || !cart?.items?.length}
                  className="proceed-to-payment-btn"
                >
                  {processing ? 'Creating Order...' : 'Proceed to Payment'}
                </button>
                
                <button 
                  onClick={() => window.history.back()}
                  className="back-to-cart-btn"
                >
                  Back to Cart
                </button>
              </div>
            </div>

            {/* Shipping Information Section */}
            <div className="shipping-section">
              <h2>Shipping Information</h2>
              <div className="shipping-info">
                <p><strong>Delivery Address:</strong></p>
                <p>User's default address will be used</p>
                <button className="change-address-btn">
                  Change Address
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;