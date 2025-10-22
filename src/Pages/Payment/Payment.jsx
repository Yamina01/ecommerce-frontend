import React, { useState } from 'react';
import axios from 'axios';
import './Payment.scss';

function Payment({ cartItems, totalAmount, orderId, onPaymentSuccess, onBackToCart }) {
    const [paymentMethod, setPaymentMethod] = useState('mock');
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');

    // ✅ SIMPLIFIED: Process payment directly using the orderId passed from Checkout
    const processPayment = async () => {
        setLoading(true);
        setPaymentStatus('Processing payment...');
        
        try {
            const token = localStorage.getItem('token');
            
            console.log('💰 Processing payment for order:', orderId);
            
            // ✅ Use the orderId that was already created in Checkout
            if (!orderId) {
                throw new Error('No order ID provided');
            }

            // Simulate payment processing delay
            setTimeout(() => {
                // ✅ Directly call success - no need for additional payment endpoints
                console.log('✅ Payment successful for order:', orderId);
                setPaymentStatus('Payment completed successfully!');
                
                // Call the success handler with the order ID
                onPaymentSuccess(orderId);
                setLoading(false);
            }, 2000);
            
        } catch (error) {
            console.error('❌ Payment error:', error);
            setPaymentStatus('Payment failed - please try again');
            alert('Payment failed. Please try again.');
            setLoading(false);
        }
    };

    const handleCardPayment = async (e) => {
        e.preventDefault();
        await processPayment();
    };

    const handleMockPayment = async () => {
        await processPayment();
    };

    const getPaymentStatusColor = () => {
        if (paymentStatus.includes('success') || paymentStatus.includes('completed')) {
            return '#28a745';
        } else if (paymentStatus.includes('fail') || paymentStatus.includes('error')) {
            return '#dc3545';
        } else if (paymentStatus.includes('processing')) {
            return '#ffc107';
        }
        return '#6c757d';
    };

    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="payment-header">
                    <h2>Payment Method</h2>
                    <p>Complete your purchase securely</p>
                </div>

                {/* Payment Status Display */}
                {paymentStatus && (
                    <div className="payment-status" style={{ borderLeftColor: getPaymentStatusColor() }}>
                        <strong>Status:</strong> {paymentStatus}
                    </div>
                )}

                {/* Order Info */}
                {orderId && (
                    <div className="payment-info">
                        <div className="info-item">
                            <strong>Order ID:</strong> #{orderId}
                        </div>
                        <div className="info-item">
                            <strong>Amount:</strong> ₹{totalAmount}
                        </div>
                    </div>
                )}

                <div className="payment-content">
                    {/* Order Summary */}
                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        {cartItems.map(item => (
                            <div key={item.id} className="order-item">
                                <span className="item-name">{item.name}</span>
                                <span className="item-price">₹{item.price} x {item.quantity}</span>
                            </div>
                        ))}
                        <div className="order-total">
                            <strong>Total: ₹{totalAmount}</strong>
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
                                    value="mock"
                                    checked={paymentMethod === 'mock'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="checkmark"></span>
                                Mock Payment (Testing)
                            </label>

                            <label className="method-option">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="checkmark"></span>
                                Credit/Debit Card (Coming Soon)
                            </label>
                        </div>

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
                                        {loading ? 'Processing Payment...' : `Pay ₹${totalAmount}`}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Card Payment Form */}
                        {paymentMethod === 'card' && (
                            <div className="card-payment">
                                <div className="coming-soon">
                                    <p>Card payments coming soon. Please use Mock Payment for testing.</p>
                                    <button 
                                        onClick={handleMockPayment}
                                        className="pay-btn mock-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Use Mock Payment Instead'}
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