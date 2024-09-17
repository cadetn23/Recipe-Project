import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';



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

  // Handle form submission
  const handleSubmit = async (event) => {
    // Prevent default form submission behavior
    event.preventDefault();

    // Check that passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Create new user
    try {
      // Send a POST request to the API_REGISTER_USER endpoint
      const response = await fetch(`${API_BASE_URL}/api/users/register`,  {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      // Check if the response was successful
      if (response.ok) {
        // Get the response data
        const result = await response.json();
        saveToken(result.token); // Save the token immediately after signup
        setSuccessMessage('SUCCESS! - Please login!')

        // Navigate to the login page after 2 seconds
        setTimeout(() => {
          navigate('/');}, 2000);


        console.log('Signup successful: ', result);

      } else {
        // Display error if response is not ok
        const error = await response.json();
        alert(error.message);
        console.error('Signup failed:', error);
      }

    } catch (err) {
      console.error('Error: ', err);
      alert('Signup Failed');
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