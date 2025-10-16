import React, { useState } from 'react';
import axios from 'axios';
import './Payment.scss';

function Payment({ cartItems, totalAmount, onPaymentSuccess, onBackToCart }) {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: ''
    });
    const [orderId, setOrderId] = useState(null);

    // Create order first
    const createOrder = async function() {
        try {
            const token = localStorage.getItem('token');
            const orderData = {
                items: cartItems,
                totalAmount: totalAmount,
                shippingAddress: "User's address"
            };

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders/create`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setOrderId(response.data.id);
            return response.data.id;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    };

    const handleMockPayment = async function() {
        setLoading(true);
        try {
            const orderId = await createOrder();
            
            const paymentResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/payment/mock-create?orderId=${orderId}&amount=${totalAmount}`);
            
            setTimeout(async function() {
                try {
                    const successResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/payment/mock-success?orderId=${orderId}`);
                    alert(successResponse.data);
                    onPaymentSuccess(orderId);
                } catch (error) {
                    console.error('Payment error:', error);
                    alert('Payment failed. Please try again.');
                } finally {
                    setLoading(false);
                }
            }, 2000);
            
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to process payment');
            setLoading(false);
        }
    };

    const handleCardPayment = async function(e) {
        e.preventDefault();
        setLoading(true);
        
        try {
            const orderId = await createOrder();
            
            const paymentResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/payment/mock-create?orderId=${orderId}&amount=${totalAmount}`);
            
            setTimeout(async function() {
                try {
                    const successResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/payment/mock-success?orderId=${orderId}`);
                    alert('Card payment successful!');
                    onPaymentSuccess(orderId);
                } catch (error) {
                    console.error('Card payment error:', error);
                    alert('Card payment failed. Please try again.');
                } finally {
                    setLoading(false);
                }
            }, 3000);
            
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to process card payment');
            setLoading(false);
        }
    };

    const handleCardInputChange = function(e) {
        const { name, value } = e.target;
        setCardDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatCardNumber = function(value) {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        
        return parts.length ? parts.join(' ') : value;
    };

    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="payment-header">
                    <h2>Payment Method</h2>
                    <p>Complete your purchase securely</p>
                </div>

                <div className="payment-content">
                    {/* Order Summary */}
                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        {cartItems.map(item => (
                            <div key={item.id} className="order-item">
                                <span className="item-name">{item.name}</span>
                                <span className="item-price">${item.price} x {item.quantity}</span>
                            </div>
                        ))}
                        <div className="order-total">
                            <strong>Total: ${totalAmount}</strong>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="payment-methods">
                        <h3>Select Payment Method</h3>
                        
                        <div className="method-options">
                            <label className="method-option">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="checkmark"></span>
                                Credit/Debit Card
                            </label>

                            <label className="method-option">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="mock"
                                    checked={paymentMethod === 'mock'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="checkmark"></span>
                                Mock Payment (Testing)
                            </label>
                        </div>

                        {/* Card Payment Form */}
                        {paymentMethod === 'card' && (
                            <form onSubmit={handleCardPayment} className="card-form">
                                <div className="form-group">
                                    <label>Name on Card</label>
                                    <input
                                        type="text"
                                        name="nameOnCard"
                                        value={cardDetails.nameOnCard}
                                        onChange={handleCardInputChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Card Number</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={cardDetails.cardNumber}
                                        onChange={(e) => {
                                            const formatted = formatCardNumber(e.target.value);
                                            setCardDetails(prev => ({
                                                ...prev,
                                                cardNumber: formatted
                                            }));
                                        }}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Expiry Date</label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            value={cardDetails.expiryDate}
                                            onChange={handleCardInputChange}
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>CVV</label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={cardDetails.cvv}
                                            onChange={handleCardInputChange}
                                            placeholder="123"
                                            maxLength="3"
                                            required
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="pay-btn"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : `Pay $${totalAmount}`}
                                </button>
                            </form>
                        )}

                        {/* Mock Payment */}
                        {paymentMethod === 'mock' && (
                            <div className="mock-payment">
                                <div className="mock-info">
                                    <p>This is a test payment method. No real transaction will occur.</p>
                                    <button 
                                        onClick={handleMockPayment}
                                        className="pay-btn mock-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing Mock Payment...' : 'Test Payment'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="payment-actions">
                    <button onClick={onBackToCart} className="back-btn">
                        ← Back to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Payment;