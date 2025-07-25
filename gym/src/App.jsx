import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserRights from './components/UserRights';
import UserDetails from './components/UserDetails';
import UserDetailsDisplay from './components/UserDetailsDisplay';
import Login from './components/Login';
import WeightLoss from './components/WeightLoss'; // Import the WeightLoss component
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

function App() {
  const [loginState, setLoginState] = useState(() => {
    const saved = sessionStorage.getItem('loginState');
    return saved ? JSON.parse(saved) : { loggedIn: false, userId: '', userType: '' };
  });

  const updateLoginState = (newState) => {
    setLoginState(newState);
    sessionStorage.setItem('loginState', JSON.stringify(newState));
  };

  const handleLogin = (userId, userType) => {
    updateLoginState({ loggedIn: true, userId, userType });
  };

  const handleLogout = () => {
    updateLoginState({ loggedIn: false, userId: '', userType: '' });
  };

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">Gym Management</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          {loginState.loggedIn && (
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {loginState.userType === 'admin' && (
                  <>
                    <Nav.Link href="/userrights">User  Rights</Nav.Link>
                    <Nav.Link href="/userdetails">User  Details</Nav.Link>
                  </>
                )}
                <Nav.Link href="/userdetailsdisplay">View Profile</Nav.Link>
                <Nav.Link href="/weightloss">Weight Loss</Nav.Link> {/* Add Weight Loss link */}
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          )}
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={loginState.loggedIn ? "/userdetailsdisplay" : "/login"} />}
          />
          <Route
            path="/login"
            element={
              loginState.loggedIn ? (
                <Navigate to="/userdetailsdisplay" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/userrights"
            element={
              loginState.loggedIn && loginState.userType === 'admin' ? (
                <UserRights />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/userdetails"
            element={
              loginState.loggedIn && loginState.userType === 'admin' ? (
                <UserDetails />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/userdetailsdisplay"
            element={
              loginState.loggedIn ? (
                <UserDetailsDisplay 
                  currentUser Id={loginState.userId} 
                  userType={loginState.userType} 
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/weightloss"
            element={
              loginState.loggedIn ? (
                <WeightLoss 
                  currentUser Id={loginState.userId} 
                  userType={loginState.userType} 
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
