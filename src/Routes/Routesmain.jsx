import React from 'react'
import {BrowserRouter as Router , Routes , Route}from 'react-router-dom'
import Home from '../Pages/Home/Home'
import Products from '../Pages/Products/Products'
import Cart from '../Pages/Cart/Cart'
import Auth from '../Pages/Login/Auth'
import Login from '../Pages/Login/Login'
import Signup from '../Pages/Login/Signup'
import Checkout from '../Pages/Checkout/Checkout'
import OrderSuccess from '../Pages/OrderSucess/OrderSuccess'
import OrderHistory from '../Pages/OrderHistory/OrderHistory'
import UserProfile from '../Pages/UserProfile/UserProfile'

function Routesmain() {
  return (
    <div>
        <Router>
            <Routes>
                <Route path='/' element ={<Home/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path="/auth" element={<Auth/>} />
                
                <Route path ='/products' element ={<Products/>}/>
                <Route path= '/cart' element={<Cart/>}/>
                <Route path= '/checkout' element={<Checkout/>}/>
                <Route path= '/order-success/:orderId' element={<OrderSuccess/>}/>
<Route path= '/orders' element={<OrderHistory/>}/>
                 <Route path= '/profile' element={<UserProfile/>}/>
                   {/* 404 fallback */}
      <Route path="*" element={<div>Page not found</div>} />
            </Routes>
        </Router>
    </div>
  )
}

export default Routesmain