import React, { Component } from 'react';
import {
  NavLink as RouterNavLink,
} from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './Header.css';

class Header extends Component {
  render() {
    return (
      <Navbar dark className="navbar-light bg-primary">
        <NavbarBrand tag={RouterNavLink} to="/">Reddit Comments</NavbarBrand>
        
      </Navbar>
    );
  }
}

export default Header;
