import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Common/Header/Header';
import Footer from '../../Common/Footer/Footer';
import './OrderSuccess.scss';

function OrderSuccess() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(response.data);
        } catch (err) {
            console.error('Error fetching order:', err);
            setError('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="loading-container">
                    <div className="loading">Loading order details...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header />
                <div className="error-container">
                    <div className="error">{error}</div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="order-success-page">
                <div className="success-container">
                    <div className="success-icon">🎉</div>
                    <h1>Order Placed Successfully!</h1>
                    <p className="success-message">
                        Thank you for your purchase. We've sent a confirmation email to your registered mail address.
                    </p>

                    <div className="order-details">
                        <div className="detail-row">
                            <span>Order ID:</span>
                            <strong>#{order.id}</strong>
                        </div>

                        <div className="detail-row">
                            <span>Order Date:</span>
                            <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>

                        <div className="detail-row">
                            <span>Status:</span>
                            <span className={`status ${order.status.toLowerCase()}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="detail-row total">
                            <span>Total Amount:</span>
                            <strong>₹{order.totalAmount?.toFixed(2)}</strong>
                        </div>
                    </div>

                    <div className="order-items">
                        <h3>Order Items</h3>
                        {order.items?.map((item, index) => (
                            <div key={item.id || index} className="order-item">
                                <img
                                    src={item.product?.imageUrl
                                        ? `${process.env.REACT_APP_API_URL}/images/products/${item.product.imageUrl}`
                                        : `${process.env.REACT_APP_API_URL}/images/products/placeholder.png`
                                    }
                                    alt={item.product?.productname || 'Product'}
                                />
                                <div className="item-info">
                                    <h4>{item.product?.productname || 'Product'}</h4>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ₹{item.priceAtPurchase || item.product?.price} </p>
                                </div>

                                <div className="item-total">
                                    ₹{((item.priceAtPurchase || item.product?.price || 0) * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="action-buttons">
                        <button
                            onClick={() => window.location.href = '/orders'}
                            className="view-orders-btn"
                        >
                            View All Orders
                        </button>

                        <button
                            onClick={() => window.location.href = '/products'}
                            className="continue-shopping-btn"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default OrderSuccess;