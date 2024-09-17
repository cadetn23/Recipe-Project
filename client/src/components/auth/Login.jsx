import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../utils/authToken';



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Make a POST request to the login endpoint
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      // Check if the response was successful
         if (response.ok) {

        const data = await response.json();

        saveToken(data.token); // Save the token to storage

        console.log('Login successful!');
        navigate('/'); // Redirect to home page after successful login
      
    } else { //Failed log in, disp error msg
        setError('Invalid username or password');
      }
      
    } catch (error) {
      setError('Error logging in: ' + error.message);  // Catch any errors that occur during the fetch request
    }
  };


  const handleCreateUserButton = () => {
    navigate('/signup');
  }; //Go sign up boss



  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormGroup>
                <Button color="primary" type="submit" block>
                  Login
                </Button>
                
                <div className="text-center mt-3">
          <p><i><b>New to the Chat App?</b></i></p>
            <Button color="secondary" onClick={handleCreateUserButton}>
              Create User
            </Button>
          </div>
              </Form>
        </Container>
  );
};

export default Login;