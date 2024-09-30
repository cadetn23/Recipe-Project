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
        <div className="min-vh-100 d-flex align-items-center bg-light">
          <Container className="py-5">
            <div className="bg-white p-5 rounded shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
              <h2 className="text-center mb-4">TasteTopia</h2>
              <h3 className="text-center mb-4 text-muted">Sign Up</h3>
              {successMessage && <Alert color="success">{successMessage}</Alert>}
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="username" className="form-label">Username</Label>
                  <Input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="email" className="form-label">Email</Label>
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
                <FormGroup>
                  <Label for="password" className="form-label">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="confirmPassword" className="form-label">Confirm Password</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="form-control"
                  />
                </FormGroup>
                <Button color="primary" type="submit" block className="mt-4">
                  Sign Up
                </Button>
              </Form>
              <div className="text-center mt-4">
                <div className="position-relative">
                  <hr className="my-4" />
                  <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted">
                    Already a member?
                  </span>
                </div>
                <Button color="link" onClick={handleLoginButton} className="mt-2">
                  Log In
                </Button>
              </div>
            </div>
          </Container>
        </div>
      );
    };

export default Signup;