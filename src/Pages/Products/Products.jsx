import React, { useState, useEffect } from 'react';
import Header from '../../Common/Header/Header';
import Footer from '../../Common/Footer/Footer';
import axios from 'axios';
import './Products.scss';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

    
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      
      console.log('Products data:', response.data);
      setProducts(response.data); 
    } catch (err) {
      console.error('Error fetching Products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    const token = localStorage.getItem('token');
    
    console.log("🛒 Add to Cart Debug:");
    console.log("Product ID:", productId);
    console.log("Token:", token);
    
    if (!token) {
      alert('Please login to add items to your cart');
      return;
    }

    try {
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/cart/add?productId=${productId}&quantity=1`,
        {}, // Empty body since we're using query params
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Success!", response.data);
      alert('Product added to cart!');
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      console.error('Error response:', err.response);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <Header/>
        <div className="loading-container">
          <div className="loading">Loading Products...</div>
        </div>
        <Footer/>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div>
        <Header/>
        <div className="error-container">
          <div className="error">{error}</div>
          <button onClick={fetchProducts} className="retry-btn">Try Again</button>
        </div>
        <Footer/>
      </div>
    );
  }

  return (
    <div>
      <Header/>
      
      <div className="products-page">
        {/* Page Header */}
        <div className="products-header">
          <h1>Our Products</h1>
          <p className="products-count">Showing {products.length} products</p>
        </div>

        {/* Check if products exist */}
        {products.length === 0 ? (
          <div className="no-products">
            <p>No products available at the moment.</p>
          </div>
        ) : (
          // Product grid
          <div className="products-grid">
            {products.map(product => (
              <div className="product-card" key={product.id}>
                {/* Product image */}
                <img 
                  src={
                    product.imageUrl
                      ? `${product.imageUrl}` 
                      : `${process.env.REACT_APP_API_URL}/images/products/placeholder.png`  
                  }
                  alt={product.productname}
                  className="product-image"
                  onError={(e) => {
                    // If image fails to load, show placeholder
                    e.target.src = `${process.env.REACT_APP_API_URL}/images/products/placeholder.png`;
                  }}
                />
                
                <div className="product-info">
                  <h3 className="product-name">{product.productname}</h3>
                  <p className="product-description">{product.productDescription}</p>
                  
                  <div className="product-details">
                    <p className="product-price">₹{product.price}</p>
                    <p className="product-stock">
                      {product.stock > 0
                        ? `In stock (${product.stock} available)`  
                        : 'Out of stock'
                      }
                    </p>
                  </div>
                  
                  <button 
                    className={`add-to-cart-btn ${product.stock === 0 ? 'out-of-stock' : ''}`}  
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
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

export default Products;


