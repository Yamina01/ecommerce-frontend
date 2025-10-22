import React, { useState , useEffect} from 'react';
import axios from 'axios';
import Header from '../../Common/Header/Header';
import Footer from '../../Common/Footer/Footer';
import './Cart.scss';

function Cart() {
  const [cart , setCart] = useState(null);
  const [loading,setLoading] = useState(true);
  const [error, setError] = useState('')
  const [updating ,setUpdating] = useState([]);

  useEffect(() =>{
    fetchCart();
  },[]);

const fetchCart = async () => {
  try {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to view your cart');
      setLoading(false);
      return;
    }
    
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Cart data:', response.data);
    
    
    setCart(response.data);

  } catch (err) {
    console.error('Error fetching Cart:', err);
    setError('Failed to load cart. Please try again.');
  } finally {
    setLoading(false);
  }
};
    // Loading state
    if(loading){
      return(
        <div>
          <Header/>
          <div className="loading-container">
            <div className="loading">Loading your Cart</div>
          </div>
          <Footer/>
        </div>
      );
    }

    // Error state
    if(error){
      return(
        <div>
          <Header/>
          <div className="error-container">
            <div className="error">{error}</div>
            <button onClick={fetchCart} className="retry-btn">Try Again</button>
          </div>
          <Footer/>
        </div>
      );
    }
    // Single item calculation
const calculateItemTotal = (item) => {
  return item.product.price * item.quantity;
};

// All items calculation
const calculateCartSubtotal = () => {
  if (!cart || !cart.items) return 0;
  return cart.items.reduce((total, item) => total + calculateItemTotal(item), 0);
};

const calculateTax = () => {
  const subtotal = calculateCartSubtotal();  
  return subtotal * 0.18;
};

const calculateGrandTotal = () => {
  return calculateCartSubtotal() + calculateTax();
};
const isCartEmpty = () => {
  return !cart || !cart.items || cart.items.length === 0;
};

// In your Cart.js - UPDATE THIS FUNCTION
const updateQuantity = async(itemId, newQuantity) => {
  if(newQuantity < 1) return;
  
  try {
    setUpdating(prev => ({...prev, [itemId]: true}));
    const token = localStorage.getItem('token');
    
    await axios.put(`${process.env.REACT_APP_API_URL}/api/cart/update?itemId=${itemId}&quantity=${newQuantity}`,
      {}, // Empty body
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // Refresh cart data
    await fetchCart();

  } catch(err) {
    console.error('Error updating quantity:', err);
    alert('Failed to update quantity. Please try again');
  } finally {
    setUpdating(prev => ({...prev, [itemId]: false}));
  }
};
// Remove item
const removeItem = async(itemId) =>{
  try{
    setUpdating(prev => ({...prev,[itemId]: true}));
    const token = localStorage.getItem('token');
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/remove/${itemId}`,{
     headers:{Authorization: `Bearer ${token}`} 
    });

    // Refresh Cart Data
    await fetchCart();

  }catch(err){
    console.error('Error removing item:' , err);
    alert('Failedto remove item.Please try again.')
  }finally{
    setUpdating(prev=> ({...prev,[itemId]: false}))
  }
};
  return (
    <div>
      <Header/>
     ,<div className="cart-page">
      <h1>Shopping Cart</h1>

      <div className="cart-content">
        {isCartEmpty()?(
          // Empty Cart State 
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>

            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <button className="continue-shopping-btn"
            onClick={() => window.location.href='/products'}>Continue Shopping</button>
          </div>
        ) : (
          // Cart with Items
        <div className="cart-with-items">
          <div className="cart-items-section">
            <h2>Cart Items ({cart.items.length})</h2>
            {cart.items.map(item => (
              <div key={item.id} className="cart-item">
                {/* Product Image */}
                <div className="cart-item-image">
                  <img
                  src={
                    item.product.imageUrl
                    ? `${item.product.imageUrl}`
                    : `${process.env.REACT_APP_API_URL}/images/products/placeholder.png`
                  }
                  alt = {item.product.productname}
                  onError={(e)=>{
                    e.target.src = `${process.env.REACT_APP_API_URL}/images/products/placeholder.png`;
                  }}
                  />
                </div>
                {/* Product Info */}
                <div className="cart-item-info">
                  <h3 className="product-name">{item.product.productname}</h3>
                  <p className="product-description">{item.product.productDescription}</p>
                  <p className="product-price">{item.product.price}</p>
                </div>
                {/* Quantity Controls */}
                <div className="quantity-controls">
                  <button className="quantity-btn"
                  onClick={()=> updateQuantity(item.id,item.quantity - 1)}
                  disabled ={updating[item.id] || item.quantity<=1}>
                    -</button>

                    <span className="quantity-display">{updating[item.id] ?'...' : item.quantity}
                      </span>

                           <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating[item.id]}
                      >
                        +
                      </button>
                </div>
             {/* Item Total */}
                    <div className="item-total">
                      ₹{calculateItemTotal(item).toFixed(2)}
                    </div>
                      {/* Remove Button */}
                    <button 
                      className="remove-btn"
                      onClick={() => removeItem(item.product.id)}
                      disabled={updating[item.id]}
                    >
                      🗑️
                    </button>

              </div>
            ))}
          </div>
          {/* Order Summary */}

          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Cart Subtotal:</span>
              <span>₹{calculateCartSubtotal().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Tax(18%)</span>
                <span>₹{calculateTax().toFixed(2)}</span>
            </div>

              <div className="summary-row total">
                  <span>Grand Total:</span>
                  <span>₹{calculateGrandTotal().toFixed(2)}</span>
                </div>

<button className="checkout-btn" onClick={() => window.location.href = '/checkout'}>Proceed to Checkout</button>

          </div>
        </div> 
            )}
      </div>
     </div>
      <Footer/>
    </div>
  )
}

export default Cart