import React from 'react';
import { Nav, NavItem, NavLink, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { getToken, removeToken } from './components/authToken'; // Import auth functions

const Navbar = () => {
  const isLoggedIn = !!getToken(); // Check if user is logged in

  const handleLogout = () => {
    removeToken(); // Remove the token on logout
    window.location.reload(); // Refresh the page to update
  };

  return (
    <Navbar color="light" light expand="md">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Recipe App
        </Link>
        <Nav className="ml-auto" navbar>
          {isLoggedIn ? (
            <>
              <NavItem>
                <NavLink tag={Link} to="/recipes">
                  Recipes
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/profile">
                  Profile
                </NavLink>
              </NavItem>
              <NavItem>
                <Button onClick={handleLogout} color="danger">
                  Logout
                </Button>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink tag={Link} to="/login">
                  Login
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/register">
                  Register
                </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </div>
    </Navbar>
  );
};

export default Navbar;