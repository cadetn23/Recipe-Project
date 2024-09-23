import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { secureApiCall } from './Api'; 

const API_REGISTER = `${process.env.REACT_APP_API_BASE_URL}/users/register`;

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleLoginButton = () => {
        navigate('/');
    }

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      
      if (password.length < 8) {
        alert("Password must be at least 8 characters long");
        return;
      }
      
      try {
        const result = await secureApiCall('/users/register', 'POST', {
          username,
          email,
          password,
        });
        
        console.log('Signup successful: ', result);
        setSuccessMessage("Let's Cook!");
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('Signup failed:', error);
        alert(error.message || 'Signup Failed');
      }
    };

    return (
        <Container className="text-center">
            <h2>Signup</h2>
            {successMessage && <Alert color="success">{successMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="username">Username</Label>
                    <Input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password (min 8 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="confirmPassword">Confirm Password</Label>
                    <Input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </FormGroup>
                <Button color="primary" type="submit" block>
                    Signup
                </Button>
                <div className="text-center mt-3">
                    <p><i><b>Already a member?</b></i></p>
                    <Button color='secondary' onClick={handleLoginButton}>
                        Login
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default Signup;