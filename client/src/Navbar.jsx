import React, { useState, useEffect } from 'react';
import { Navbar as ReactstrapNavbar, Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getToken, removeToken } from './components/authToken';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = getToken();
      setIsLoggedIn(!!token);
    };
    
    // Check on mount
    checkAuthStatus();

    // Listen for storage events
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    removeToken();
    window.dispatchEvent(new Event('storage'));
  };

  const styles = {
    navbar: {
      backgroundColor: '#8B0000',
      padding: '1rem',
    },
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    brand: {
      color: '#F5E6D3',
      textDecoration: 'none',
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    navLink: {
      color: '#F5E6D3',
      textDecoration: 'none',
      marginLeft: '1.5rem',
    },
    authLinks: {
      marginLeft: 'auto',
    }
  };

  return (
    <ReactstrapNavbar style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          TasteTopia
        </Link>
        <Nav style={styles.authLinks}>
          {isLoggedIn ? (
            <>
              <NavItem>
                <NavLink tag={Link} to="/" style={styles.navLink}>
                  Recipes
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/create" style={styles.navLink}>
                  Create Recipe
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={handleLogout} style={{ ...styles.navLink, cursor: 'pointer' }}>
                  Logout
                </NavLink>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink tag={Link} to="/login" style={styles.navLink}>
                  Login
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/signup" style={styles.navLink}>
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