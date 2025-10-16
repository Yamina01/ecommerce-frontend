import React from 'react'
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Footer.scss'
import logo from "../../Images/Logo.png"


function Footer() {
  return (
    <div>
        <Container fluid>
            <Row className='footer-row'>
        <Col sm={5} md={3} className='box'>
        <div className='name'> <img
              alt="Logo"
              src={logo}
              width="30"
              height="30"
              className="img-fluid rounded-circle"
            />
            <h3>IZZY'S CART</h3> </div>
        
          <h6>Lorem ipsum, dolor sit amet consectetur adipisicivelit et quasi, dolorum aspernatur est magni earum tempora conse</h6>
        </Col>

        <Col sm={5} md={3} className='box'>
          <h3>About Us</h3>
          <ul>
            <li>Careers</li>
             <li>Our Stores</li>
              <li>Our Cares</li>
               <li>Terms & Conditions</li>
                <li>Privacy Policy</li>

          </ul>
        </Col>

        <Col sm={5} md={3} className='box'>
           <h3>Customer Care</h3>
          <ul>
            <li>Help Centre</li>
             <li>How To Buy</li>
              <li>Track Your Order</li>
               <li>Corporate & Bulk-Purchasing</li>
                <li>Returns & Refunds</li>

          </ul>
        </Col>
        
         <Col sm={5} md={3} className='box'>
          <h3>Contact Us</h3>
          <ul>
            <li>Chennai,India</li>
             <li>eMail:<br/>izzyscart@gmail.com</li>
              <li>Phone:<br/>+919876543210</li>
          </ul>
        </Col>
      </Row>
        </Container>
    
    </div>
  )
}

export default Footer