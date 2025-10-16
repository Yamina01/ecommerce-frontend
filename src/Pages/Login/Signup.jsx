import React, { useState } from 'react'
import { Container , Row, Col , Form , Button , Card} from "react-bootstrap";
import "./Signup.scss";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Signup({onSwitch}) {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false)

    const navigate = useNavigate()



const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        setError("Passwords do not match");
        setSuccess(false);
        return;
    }

    try {
        setError("");
        
        // ✅ Send user data to Spring Boot backend
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/signup`, {
            name: name,
            email: email,
            password: password
        });

        console.log("Signup successful:", response.data);
        setSuccess(true);

        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        // Navigate to login page
        setTimeout(() => {
            navigate("/login");
        }, 1000);

    } catch (error) {
        console.error("Signup error:", error);
        if (error.response && error.response.data) {
            setError(error.response.data);
        } else {
            setError("Signup failed. Please try again.");
        }
        setSuccess(false);
    }
};
  return (
    <div>
        <Container fluid className="signup-container d-flex justify-content-center align-items-center">
        <Row className='w-100 justify-content-center'>
            <Col md={6} lg={4}>
            <Card className='signup-card p-4 shadow'>
             <h2 className='text-center'>Sign Up</h2>
             <Form onSubmit ={handleSubmit}>
                {/* Name */}
                <Form.Group className='mb-3'controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                    required
                    />
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                    type="email"
                    placeholder='Enter Email'
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                    />
                </Form.Group>

                {/* Password */}
                <Form.Group className='mb-3' controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type="Password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                    />
                </Form.Group>

                {/* Confirm Password */}
                <Form.Group className='mb-3' controlId='fromConfirmPassword'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                    type="password"
                    placeholder='Confirm your Password'
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    required/>
                </Form.Group>
           
            {/* Submit */}
                <Button type="submit" className='custom-btn w-100'>
                    Sign Up
                </Button>
            
            {/* Feedback messages */}
            {success && <p className='text-success text-center mt-3'>Signed in successfully!</p>}
            {error && <p className="text-danger text-center mt-3">{error}</p>}
        
        </Form>
        <p className='text-center m-2'> Already have an account? </p>
         <button className='custom-btn w-100' onClick={onSwitch}>
            Login
        </button>
                    </Card>
            </Col>
        </Row>
        </Container>
    </div>
  )
}
export default Signup;