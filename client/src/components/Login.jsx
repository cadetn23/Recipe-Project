import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { saveToken } from './authToken';
import { secureApiCall } from './Api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await secureApiCall('/users/login', 'POST', { email, password });
      if (response.token) {
        saveToken(response.token);
        console.log('Login successful!');
        navigate('/');
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      setError(error.message || 'Error logging in');
    }
  };

  const handleCreateUserButton = () => {
    navigate('/signup');
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        {error && <Alert color="danger">{error}</Alert>}
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </FormGroup>
        <Button color="primary" type="submit" block>
          Login
        </Button>
        
        <div className="text-center mt-3">
          <p><i><b>New tocTasteTopia?</b></i></p>
          <Button color="secondary" onClick={handleCreateUserButton}>
            Create User
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Login;