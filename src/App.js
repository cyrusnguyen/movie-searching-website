import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

function App() {
  const [collapsed, setCollapsed] = useState(false);


  return (
    <div>
      <Navbar className="navbar-expand-lg" sticky="top" color="dark" dark >
        <NavbarBrand href="/" className="me-auto">
          230MOVIES
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
            <NavItem className="ml-auto">
              <NavLink>USERNAME</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default App;