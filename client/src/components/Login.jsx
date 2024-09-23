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
        <Container>
            <h2 className="text-center">Login</h2>
            {error && <Alert color="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </FormGroup>
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