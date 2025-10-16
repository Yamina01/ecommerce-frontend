import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Common/Header/Header';
import Footer from '../../Common/Footer/Footer';
import './Home.scss';

function Homepage() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
            // Take first 6 products as featured
            const featured = response.data.slice(0, 6);
            setFeaturedProducts(featured);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            
            {/* Hero Banner */}
            <section className="hero-banner">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>Welcome to Izzy's Cart</h1>
                        <p>Discover amazing products at unbeatable prices. Quality meets affordability.</p>
                        <div className="hero-buttons">
                            <Link to="/products" className="btn btn-primary">Shop Now</Link>
                            <Link to="/products" className="btn btn-secondary">View Deals</Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="placeholder-hero">🛒</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2>Why Choose Izzy's Cart?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🚚</div>
                            <h3>Free Shipping</h3>
                            <p>Free delivery on orders above ₹499</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💳</div>
                            <h3>Secure Payment</h3>
                            <p>100% secure and encrypted payments</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">↩️</div>
                            <h3>Easy Returns</h3>
                            <p>14-day return policy for all products</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📞</div>
                            <h3>24/7 Support</h3>
                            <p>Freindly customer support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="featured-products">
                <div className="container">
                    <div className="section-header">
                        <h2>Featured Products</h2>
                        <p>Handpicked items just for you</p>
                        <Link to="/products" className="view-all">View All Products →</Link>
                    </div>

                    {loading ? (
                        <div className="loading-products">Loading featured products...</div>
                    ) : (
                        <div className="products-grid">
                            {featuredProducts.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image">
                                        <img
                                            src={
                                                product.imageUrl
                                                    ? `${process.env.REACT_APP_API_URL}/images/products/${product.imageUrl}`
                                                    : `${process.env.REACT_APP_API_URL}/images/products/placeholder.png`
                                            }
                                            alt={product.productname}
                                            onError={(e) => {
                                                e.target.src = `${process.env.REACT_APP_API_URL}/images/products/placeholder.png`;
                                            }}
                                        />
                                        {product.stock === 0 && (
                                            <div className="out-of-stock-badge">Out of Stock</div>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-name">{product.productname}</h3>
                                        <p className="product-description">
                                            {product.productDescription && product.productDescription.length > 80
                                                ? `${product.productDescription.substring(0, 80)}...`
                                                : product.productDescription || 'No description available'
                                            }
                                        </p>
                                        <div className="product-price">₹{product.price}</div>
                                        <div className="product-stock">
                                            {product.stock > 0 
                                                ? `${product.stock} in stock` 
                                                : 'Out of stock'
                                            }
                                        </div>
                                        <Link 
                                            to="/products" 
                                            className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
                                        >
                                            {product.stock === 0 ? 'Out of Stock' : 'View Product'}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Start Shopping?</h2>
                        <p>Join thousands of satisfied customers. Create an account and get started today!</p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-primary">Sign Up Free</Link>
                            <Link to="/products" className="btn btn-secondary">Continue Shopping</Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Homepage;