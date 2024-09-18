// Import necessary React hooks
import React, { useState } from 'react';

// Import UI components from reactstrap library
import { Button, Form, FormGroup, Label, Input, Container, Alert } from 'reactstrap';

// Import navigation hook from react-router-dom
import { useNavigate } from 'react-router-dom';

// Import utility functions for API calls and token management
import { secureApiCall, API_BASE_URL } from './Api';
import { saveToken } from './authToken';

// Define the Login component
const Login = () => {
    // State hooks for username, password, and error message
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Make API call to login
            const data = await secureApiCall('/api/users/login', 'POST', { username, password });
            
            // Save the received token
            saveToken(data.token);
            
            console.log('Login successful!');
            
            // Redirect to home page after successful login
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid username or password');
        }
    };

    // Function to handle navigation to signup page
    const handleCreateUserButton = () => {
        navigate('/signup');
    };

    // Render the login form
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
                {error && <Alert color="danger">{error}</Alert>}
                <Button color="primary" type="submit" block>
                    Login
                </Button>
                <div className="text-center mt-3">
                    <p><i><b>New to the Recipe App?</b></i></p>
                    <Button color="secondary" onClick={handleCreateUserButton}>
                        Create User
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default Login;