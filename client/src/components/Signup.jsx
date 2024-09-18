import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { secureApiCall, API_BASE_URL } from './utils/Api';
import { saveToken } from './utils/authToken';

const Signup = () => {
  // Initialize state variables for form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get the navigate function from react-router-dom
  const navigate = useNavigate();

  // Handle login button click
  const handleLoginButton = () => {
    navigate('/');
  }

  const handleSubmit = async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        // Make an API call to register the user
        const result = await secureApiCall('/api/users/register', 'POST', {
            username,
            email,
            password,
        });

        // Save the token received from the server
        saveToken(result.token);

        // Set a success message to display to the user
        setSuccessMessage('SUCCESS! - Please login!');

        // Wait for 2 seconds, then navigate to the home page
        setTimeout(() => {
            navigate('/');
        }, 2000);

        // Log the successful signup
        console.log('Signup successful: ', result);
    } catch (error) {
        // Log any errors that occur during signup
        console.error('Signup failed:', error);

        // Display an alert with the error message or a default message
        alert(error.message || 'Signup Failed');
    }
};

  // Render the Signup form
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
            required />
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
            required />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
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
            required />
        </FormGroup>
        <Button color="primary" type="submit" block>
          Signup
        </Button>
        <div className="text-center mt-3">
          <p><i><b>Already a member of The Recipe App?</b></i></p>
          <Button color='secondary' onClick={handleLoginButton}>
            Login
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Signup;