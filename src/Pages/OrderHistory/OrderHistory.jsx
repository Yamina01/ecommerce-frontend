import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './OrderHistory.scss'
import Header from '../../Common/Header/Header';
import Footer from '../../Common/Footer/Footer';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('📦 Orders loaded:', response.data.length);
            setOrders(response.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders. Please try again');
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Order cancelled successfully!');
            fetchOrders();
        } catch (err) {
            console.error('Error cancelling order:', err);
            alert('Failed to cancel order. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: "short",
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return '#ffc107';
            case 'paid': return '#17a2b8';
            case 'processing': return '#007bff';
            case 'shipped': return '#28a745';
            case 'delivered': return '#20c997';
            case 'cancelled': return '#dc3545';
            default: return '#6c757d';
        }
    };

    
    const getProductName = (item) => {
        return item.product?.productname || item.productName || 'Product';
    };

    const getProductImage = (item) => {
        const imageUrl = item.product?.imageUrl || item.productImageUrl;
        return imageUrl 
            ? `${imageUrl}`
            : `${process.env.REACT_APP_API_URL}/images/products/placeholder.png`;
    };

    const getProductPrice = (item) => {
        return item.priceAtPurchase || item.product?.price || item.productPrice || 0;
    };

    if (loading) {
        return (
            <div>
                <Header/>
                <div className="loading-container">
                    <div className="loading">Loading your orders...</div>
                </div>
                <Footer/>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header/>
                <div className="error-container">
                    <div className="error">{error}</div>
                    <button onClick={fetchOrders} className="retry-btn">Try Again</button>
                </div>
                <Footer/>
            </div>
        );
    }

    return (
        <div>
            <Header/>
            <div className="order-history-page">
                <h1>My Orders</h1>
                <p className="orders-count">{orders.length} order(s)</p>

                {orders.length === 0 ? (
                    <div className="no-orders">
                        <div className="empty-icon">📦</div>
                        <h2>No orders yet</h2>
                        <p>Start shopping to see your orders here!</p>
                        <button onClick={() => window.location.href = '/products'} className="shop-now-btn">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <h3>Order #{order.id}</h3>
                                        <p className="order-date">{formatDate(order.orderDate)}</p>
                                    </div>
                                    <div className="order-status">
                                        <span className="status-badge" style={{backgroundColor: getStatusColor(order.status)}}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="order-items-preview">
                                    {order.items?.map((item, index) => (
                                        <div key={item.id || index} className="preview-item">
                                            <img
                                                src={getProductImage(item)}
                                                alt={getProductName(item)}
                                                className="preview-image"
                                                onError={(e) => {
                                                    e.target.src = `${process.env.REACT_APP_API_URL}/images/products/placeholder.png`;
                                                }}
                                            />
                                            <div className="item-details">
                                                <span className="product-name">{getProductName(item)}</span>
                                                <span className="quantity">Qty: {item.quantity}</span>
                                                <span className="price">₹{getProductPrice(item).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {order.items && order.items.length > 3 && (
                                        <div className="more-items">
                                            +{order.items.length - 3} more items
                                        </div>
                                    )}
                                </div>

                                <div className="order-footer">
                                    <div className="order-total">
                                        Total: <strong>₹{order.totalAmount?.toFixed(2)}</strong>
                                    </div>
                                    <div className="order-actions">
                                        <button 
                                            onClick={() => window.location.href = `/order-success/${order.id}`}
                                            className="view-details-btn"
                                        >
                                            View Details
                                        </button>
                                        {order.status === 'PENDING' && (
                                            <button 
                                                onClick={() => cancelOrder(order.id)} 
                                                className="cancel-btn"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    );
}

export default OrderHistory;