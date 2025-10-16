import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom'; // ← ADD THIS IMPORT
import "./Header.scss"
import logo from "../../Images/Logo.png"

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Navbar expand="lg" className="custom-navbar" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/"> {/* ← FIX BRAND LINK */}
            <img
              alt="Logo"
              src={logo}
              width="30"
              height="30"
              className="img-fluid rounded-circle"
            />{' '}
            IZZY'S CART
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className={`custom-toggler ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}>
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link> {/* ← FIX ALL LINKS */}
              <Nav.Link as={Link} to="/auth">Login</Nav.Link>
              <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
              <Nav.Link as={Link} to="/products">Products</Nav.Link>
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default Header;