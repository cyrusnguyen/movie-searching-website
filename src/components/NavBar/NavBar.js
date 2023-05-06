import React, { useState } from 'react';
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
import logo from '../../assets/logo.png';
import styled from 'styled-components';

export default function NavBar() {
  const [collapsed, setCollapsed] = useState(false);


  return (
    <NavBarComponent>
      <Navbar className="navbar-expand-lg" sticky="top" dark >
        <NavbarBrand href="/" className="me-3">
          <img src={logo} alt="Site logo" width="50"/>
          
        </NavbarBrand>
        <NavbarToggler onClick={() => setCollapsed(!collapsed)} className="me-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav className="container-fluid" navbar>
            <NavItem>
              <NavLink>Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink>Movies</NavLink>
            </NavItem>
            <NavItem>
              <NavLink>Register</NavLink>
            </NavItem>
            <NavItem>
              <NavLink>Login</NavLink>
            </NavItem>
          </Nav>
          <Nav className="ml-auto" navbar>
            <NavItem style={{ }}>
              <NavLink style={{ alignItems: "center"}}>MEMBER LOGIN </NavLink>
            </NavItem>
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
`;