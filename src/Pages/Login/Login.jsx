import React, { useState } from 'react';
import axios from 'axios';
import './Login.scss'
import { Container,Row ,Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Login({onSwitch}) {
  const[email,setEmail] = useState("");
  const[password,setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

   const navigate = useNavigate();

   const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  
  try {
    console.log("Logging in with:", email, password);
    
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, {
      email: email,
      password: password
    }, {
      // Tell axios to handle any response type
      transformResponse: [function (data) {
        // Try to parse as JSON, if fails, return as text
        try {
          return JSON.parse(data);
        } catch (e) {
          return { token: data }; 
        }
      }]
    });

    console.log("🔐 LOGIN RESPONSE DEBUG:");
    console.log("Full response:", response);
    console.log("Response data:", response.data);
    
    // Handle both JSON {token: "..."} and plain text token
    let token;
    if (typeof response.data === 'string') {
      token = response.data; // Plain text token
    } else if (response.data.token) {
      token = response.data.token; // JSON token
    } else {
      token = response.data; // Fallback
    }
    
    console.log("Extracted token:", token);
    console.log("Token type:", typeof token);
    console.log("Token length:", token.length);
    
    // Validate token format
    if (!token || token === "undefined" || token.split('.').length !== 3) {
      setError("Login failed: Invalid token received from server");
      return;
    }
    
    localStorage.setItem('token', token);
    console.log(" Valid JWT token stored!");
    
    setSuccess(true);
    setTimeout(() => {
      navigate("/");
    }, 1000);
    
  } catch (err) {
    console.error("Login error:", err);
    console.error("Error response:", err.response);
    setError("Login failed. Please check credentials and try again.");
  }
};

  return (
    <div>
      <Container fluid className='login-container d-flex justify-content-center align-items-center'>
        <Row className='w-100 justify-content-center'>
          <Col md={6} lg={4}> 
          <Card className='login-card p-4 shadow'>
            <h2 className='text-center'>Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}  
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
              </Form.Group>
             <Form.Group className="mb-3" controlId="formPassword">
                 <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
</Form.Group>
<Button  type="submit" className="custom-btn w-100">
  Login
</Button>
  {/* Feedback messages */}
  {success && <p className="text-success text-center mt-3"> Logged in successfully!</p>}
  {error && <p className="text-danger text-center mt-3">{error}</p>}


            </Form>
            <p className="m-3 text-center">
  Don’t have an account?</p>
    <button className='custom-btn w-100' onClick={onSwitch}>Sign Up</button>

            </Card>
            </Col>
        </Row>
      </Container>
    </div>
  )

}
export default Login;