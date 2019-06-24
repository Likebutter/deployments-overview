import React from 'react';
import { Nav, Navbar, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

export class Navigation extends React.Component {

  render() {
    return (
      <div className="Navigation">
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">Deployments overview</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <NavDropdown.Divider />
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="ibs">IBS Overview</Nav.Link>
            <NavDropdown title="SI Tools" id="basic-nav-dropdown">
              <NavDropdown.Item href="grafana">Grafana</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Influx</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Nexus3</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4">Automatic delivery</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>
          </Navbar.Collapse>
      </Navbar>  
      </div>
    );
  }
}
