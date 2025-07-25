// import React, { useState } from 'react';
// import { Form, Button, Container, Alert } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import useStorage from './useStorage';

// const Login = ({ onLogin }) => {
//   const [loginForm, setLoginForm] = useState({
//     userId: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const [users] = useStorage('gym_users', []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLoginForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Check admin credentials
//     if (loginForm.userId === 'admin1' && loginForm.password === 'admin1') {
//       onLogin('admin1', 'admin');
//       navigate('/userrights');
//       return;
//     }

//     // Check regular users
//     const user = users.find(u => u.userId === loginForm.userId && u.password === loginForm.password);
//     if (user && user.status === 'active') {
//       onLogin(user.userId, user.type);
//       navigate('/userdetailsdisplay');
//     } else {
//       setError('Invalid credentials or inactive account');
//     }
//   };

//   return (
//     <Container className="form-container mt-5">
//       <h2 className="text-center mb-4">Gym Management Login</h2>
//       {error && <Alert variant="danger">{error}</Alert>}

//       <Form onSubmit={handleSubmit}>
//         <Form.Group className="mb-3">
//           <Form.Label>User ID</Form.Label>
//           <Form.Control
//             type="text"
//             name="userId"
//             value={loginForm.userId}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <Form.Label>Password</Form.Label>
//           <Form.Control
//             type="password"
//             name="password"
//             value={loginForm.password}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>

//         <Button variant="primary" type="submit" className="w-100 mb-3">
//           Login
//         </Button>
        
//         <div className="text-center">
//           <Button variant="link" disabled>
//             Forgot Password?
//           </Button>
//         </div>
//       </Form>
//     </Container>
//   );
// };

// export default Login;

import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useStorage from './useStorage'; // Assuming useStorage is a custom hook for localStorage

const Login = ({ onLogin }) => {
  const [loginForm, setLoginForm] = useState({
    userId: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [users] = useStorage('gym_users', []); // Access the users data from your storage

  // Effect to load saved credentials if "rememberMe" was true
  useEffect(() => {
    const savedUserId = localStorage.getItem('rememberedUserId');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedUserId && savedPassword) {
      setLoginForm({
        userId: savedUserId,
        password: savedPassword
      });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    if (type === 'checkbox') {
      setRememberMe(checked);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Handle "Remember Me" logic
    if (rememberMe) {
      localStorage.setItem('rememberedUserId', loginForm.userId);
      localStorage.setItem('rememberedPassword', loginForm.password);
    } else {
      localStorage.removeItem('rememberedUserId');
      localStorage.removeItem('rememberedPassword');
    }

    // Check admin credentials
    if (loginForm.userId === 'admin1' && loginForm.password === 'admin1') {
      onLogin('admin1', 'admin');
      navigate('/userrights');
      return;
    }

    // Check regular users
    const user = users.find(u => u.userId === loginForm.userId && u.password === loginForm.password);
    if (user && user.status === 'active') {
      onLogin(user.userId, user.type);
      navigate('/userdetailsdisplay');
    } else {
      setError('Invalid credentials or inactive account.');
    }
  };

  const handleForgotPassword = () => {
    // --- New Verification Logic ---
    if (!loginForm.userId) {
      setError('Please enter your User ID to reset your password.');
      return;
    }

    // Check if the user ID exists in your stored users data
    const userExists = users.some(u => u.userId === loginForm.userId);

    if (!userExists) {
      setError(`User ID '${loginForm.userId}' not found. Please check the ID or contact support.`);
      return;
    }
    // --- End New Verification Logic ---

    // If user ID exists, proceed to open WhatsApp
    const defaultMessage = `Hello, I am User ID ${loginForm.userId}. I would like to request a password reset for my Gym Management account.`;
    // Replace '91XXXXXXXXXX' with the actual WhatsApp number for support
    const whatsappLink = `https://wa.me/918220832286?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <Container className="form-container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Gym Management Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicUserId">
          <Form.Label>User ID</Form.Label>
          <Form.Control
            type="text"
            name="userId"
            value={loginForm.userId}
            onChange={handleChange}
            placeholder="Enter user ID"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={loginForm.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </Form.Group>

        <Row className="mb-3 align-items-center">
          <Col xs={6}>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="Remember me"
                name="rememberMe"
                checked={rememberMe}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col xs={6} className="text-end">
            <Button variant="link" onClick={handleForgotPassword} className="p-0">
              Forgot Password?
            </Button>
          </Col>
        </Row>

        <Button variant="primary" type="submit" className="w-100 mb-3">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;