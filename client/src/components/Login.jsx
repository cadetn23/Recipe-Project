import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { secureApiCall } from './Api';
import { saveToken } from './authToken';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCreateUserButton = () => {
        navigate('/signup');
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
                window.dispatchEvent(new Event('storage'));
                navigate('/');
            } else {
                setError('Invalid response');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    const styles = {
        background: {
            backgroundColor: '#F5E6D3', 
            minHeight: '100vh',
        },
        container: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            margin: 'auto',
            padding: '2rem',
            marginTop: '2rem',
        },
        header: {
            color: '#8B0000',
        },
        input: {
            borderColor: '#D2B48C',
            '&:focus': {
                borderColor: '#8B0000',
                boxShadow: '0 0 0 0.2rem rgba(139, 0, 0, 0.25)',
            },
        },
        button: {
            backgroundColor: '#8B0000',
            borderColor: '#8B0000',
            '&:hover': {
                backgroundColor: '#A52A2A',
                borderColor: '#A52A2A',
            },
        },
        link: {
            color: '#8B0000',
            '&:hover': {
                color: '#A52A2A',
            },
        },
    };

    return (
        <div style={styles.background}>
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
                <div style={styles.container}>
                    <h2 className="text-center mb-4" style={styles.header}>TasteTopia</h2>
                    <h3 className="text-center mb-4 text-muted">Login</h3>
                    {error && <Alert color="danger">{error}</Alert>}
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
                                style={styles.input}
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
                                style={styles.input}
                            />
                        </FormGroup>
                        <Button type="submit" block className="mb-4" style={styles.button}>
                            Login
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <p className="text-muted">New to TasteTopia?</p>
                        <Button color="link" onClick={handleCreateUserButton} className="p-0" style={styles.link}>
                            Create User
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Login;