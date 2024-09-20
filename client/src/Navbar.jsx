import React from 'react';
import { Navbar as ReactstrapNavbar, Nav, NavItem, NavLink, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { getToken, removeToken } from './components/authToken';

const Navbar = () => {
  const isLoggedIn = !!getToken();

  const handleLogout = () => {
    removeToken();
    window.location.reload();
  };

  return (
    <ReactstrapNavbar color="light" light expand="md">
      <div className="container">
        <Link to="/" className="navbar-brand">
          TasteTopia
        </Link>
        <Nav className="ml-auto" navbar>
          {isLoggedIn ? (
            <>
              <NavItem>
                <NavLink tag={Link} to="/">
                  Recipes
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/create">
                  Create Recipe
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
                <NavLink tag={Link} to="/signup">
                  Signup
                </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </div>
    </ReactstrapNavbar>
  );
};

export default Navbar;