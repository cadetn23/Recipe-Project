import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { secureApiCall } from './Api'; 
import { saveToken } from './authToken';

const API_LOGIN = `${process.env.REACT_APP_API_BASE_URL}/users/login`;


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCreateUserButton = () => {
        navigate('/Signup');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const result = await secureApiCall('/users/login', 'POST', {
                email,
                password,
            });

            if (result.token) {
                console.log('Login successful');
                saveToken(result.token);
                localStorage.setItem('token', result.token);
                navigate('/'); // Redirect to home
            } else {
                setError('Invalid response');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <Container className="p-4">
            <div className="bg-white p-5 rounded shadow" style={{ maxWidth: '400px', margin: 'auto' }}>
              <h2 className="text-center mb-4 text-primary">TasteTopia</h2>
              <h3 className="text-center mb-4 text-muted">Login</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <Form onSubmit={handleSubmit}>
                <FormGroup className="mb-3">
                  <Label for="email" className="form-label fw-bold">Email</Label>
                  <Input 
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    required
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup className="mb-4">
                  <Label for="password" className="form-label fw-bold">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control"
                  />
                </FormGroup>
                <Button color="primary" type="submit" block className="mb-4">
                  Login
                </Button>
              </Form>
              <div className="text-center mt-3">
                <p className="text-muted">New to TasteTopia?</p>
                <Button color="link" onClick={handleCreateUserButton} className="p-0">
                  Create User
                </Button>
              </div>
            </div>
          </Container>
        </div>
      );
    };
    
    export default Login;