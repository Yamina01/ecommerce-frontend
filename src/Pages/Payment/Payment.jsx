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
    const [paymentResponse, setPaymentResponse] = useState(null);
    const [successResponse, setSuccessResponse] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('');

    // Create order first
    const createOrder = async () => {
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
            setPaymentStatus('Order created successfully');
            return response.data.id;
        } catch (error) {
            console.error('Error creating order:', error);
            setPaymentStatus('Failed to create order');
            throw error;
        }
    };

    const handleMockPayment = async () => {
        setLoading(true);
        setPaymentStatus('Initiating payment...');
        try {
            const createdOrderId = await createOrder();
            
            const paymentResp = await axios.post(`${process.env.REACT_APP_API_URL}/api/payment/mock-create?orderId=${createdOrderId}&amount=${totalAmount}`);
            setPaymentResponse(paymentResp.data);
            setPaymentStatus('Payment initiated - processing...');
            
            console.log('Payment initiated:', paymentResp.data);
            
            setTimeout(async () => {
                try {
                    const successResp = await axios.get(`${process.env.REACT_APP_API_URL}/api/payment/mock-success?orderId=${createdOrderId}`);
                    setSuccessResponse(successResp.data);
                    setPaymentStatus('Payment completed successfully!');
                    
                    console.log('Payment success:', successResp.data);
                    
                    // Use the actual response data
                    const successMessage = successResp.data.message || successResp.data || 'Payment successful!';
                    alert(successMessage);
                    onPaymentSuccess(createdOrderId, successResp.data);
                    
                } catch (error) {
                    console.error('Payment error:', error);
                    setPaymentStatus('Payment failed - please try again');
                    alert('Payment failed. Please try again.');
                } finally {
                    setLoading(false);
                }
            }, 2000);
            
        } catch (error) {
            console.error('Error:', error);
            setPaymentStatus('Payment processing failed');
            alert('Failed to process payment');
            setLoading(false);
        }
    };

    const handleCardPayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPaymentStatus('Processing card payment...');
        
        try {
            const createdOrderId = await createOrder();
            
            const paymentResp = await axios.post(`${process.env.REACT_APP_API_URL}/api/payment/mock-create?orderId=${createdOrderId}&amount=${totalAmount}`);
            setPaymentResponse(paymentResp.data);
            setPaymentStatus('Card payment authorized - completing transaction...');
            
            console.log('Card payment initiated:', paymentResp.data);
            
            setTimeout(async () => {
                try {
                    const successResp = await axios.get(`${process.env.REACT_APP_API_URL}/api/payment/mock-success?orderId=${createdOrderId}`);
                    setSuccessResponse(successResp.data);
                    setPaymentStatus('Card payment completed successfully!');
                    
                    console.log('Card payment success:', successResp.data);
                    alert('Card payment successful!');
                    onPaymentSuccess(createdOrderId, successResp.data);
                    
                } catch (error) {
                    console.error('Card payment error:', error);
                    setPaymentStatus('Card payment failed');
                    alert('Card payment failed. Please try again.');
                } finally {
                    setLoading(false);
                }
            }, 3000);
            
        } catch (error) {
            console.error('Error:', error);
            setPaymentStatus('Card payment processing failed');
            alert('Failed to process card payment');
            setLoading(false);
        }
    };

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        
        return parts.length ? parts.join(' ') : value;
    };

    const getPaymentStatusColor = () => {
        if (paymentStatus.includes('success') || paymentStatus.includes('completed')) {
            return '#28a745';
        } else if (paymentStatus.includes('fail') || paymentStatus.includes('error')) {
            return '#dc3545';
        } else if (paymentStatus.includes('processing') || paymentStatus.includes('initiating')) {
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

                {/* Order & Payment Info */}
                {(orderId || paymentResponse || successResponse) && (
                    <div className="payment-info">
                        {orderId && (
                            <div className="info-item">
                                <strong>Order ID:</strong> #{orderId}
                            </div>
                        )}
                        {paymentResponse && paymentResponse.paymentId && (
                            <div className="info-item">
                                <strong>Payment ID:</strong> {paymentResponse.paymentId}
                            </div>
                        )}
                        {successResponse && successResponse.transactionId && (
                            <div className="info-item">
                                <strong>Transaction ID:</strong> {successResponse.transactionId}
                            </div>
                        )}
                    </div>
                )}

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