import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Collapse,
  NavbarToggler,
  NavbarBrand,
  Nav,
  Navbar,
  NavItem,
  NavLink,
} from 'reactstrap';
import logo from '../assets/logo.png';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom'
import { useLogout } from '../api/authAPI';
import { AuthContext, useAuth } from '../contexts/AuthContext';


export default function NavBar() {
  const [ collapsed, setCollapsed ] = useState(true);
  const { logout } = useLogout();
  const { authState, setAuthState } = useAuth();
  const navigate = useNavigate();
  const handleSignout = () => {
    logout();
    navigate('/login');
    setAuthState({
      isAuthenticated: false,
      user: null,
      bearerToken: null,
      refreshToken: null
    })
  }


  return (
    <NavBarComponent>
      <Navbar className="navbar-expand-lg" sticky="top" dark >
        <NavbarBrand as={Link} to="/" className="me-3">

          <img src={logo} alt="Site logo" width="50"/>

        </NavbarBrand>
        <NavbarToggler onClick={() => setCollapsed(!collapsed)} className="me-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav className="container-fluid" navbar>
            <NavItem>
              <NavBarLink to="/">Home</NavBarLink>
            </NavItem>
            <NavItem>
              <NavBarLink to="/movies">Movies</NavBarLink>
            </NavItem>
            
            {authState.isAuthenticated === true || authState.isAuthenticated === "true"? 
            <React.Fragment><NavItem>
              <NavBarLink onClick={handleSignout}>Sign out</NavBarLink>
            </NavItem> 
            <NavItem className="ms-auto">
              Hello, {authState.user}
            </NavItem>
            </React.Fragment> :
            <><NavItem>
                <NavBarLink to="/register">Register</NavBarLink>
              </NavItem><NavItem>
                  <NavBarLink to="/login">Login</NavBarLink>
                </NavItem></>
            }
          </Nav>
        </Collapse>
      </Navbar>
        
    </NavBarComponent>
    
  );
}

const NavBarComponent = styled.div`
    background-color: var(--color-black);
    position: relative;
    padding: 0 0;
    color: var(--color-white);
    font-size: 1.2rem;
    
    .helloUser{
      border: 1px solid var(--color-white);
      border-radius: 3px;

    }

    @media only screen and (max-width: 991.5px) {
      .ms-auto{
        margin-top: 0.5rem;
        margin-left: 1rem !important;
      }
  }
`;
const NavBarLink = styled(Link)`
    font-size: 1.2rem;
    color: var(--color-white);
    text-decoration: none;
    padding: 5px 15px;
    &:hover {
        color: var(--color-blue);
    }
`;