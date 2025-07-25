import React from 'react';
import { Table, Button, Form, Container, Alert } from 'react-bootstrap';
import useStorage from './useStorage';

const UserRights = () => {
  const [users, setUsers] = useStorage('gym_users', [{
    userId: 'admin1',
    password: 'admin1',
    type: 'admin',
    status: 'active',
    details: {}
  }]);
  const [newUser, setNewUser] = React.useState({
    userId: '',
    password: '',
    type: 'user',
    status: 'active'
  });
  const [feedback, setFeedback] = React.useState({ error: '', success: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = () => {
    if (!newUser.userId) {
      setFeedback({ error: 'User ID required', success: '' });
      return;
    }
    if (users.some(u => u.userId === newUser.userId)) {
      setFeedback({ error: 'User ID already exists', success: '' });
      return;
    }

    setUsers(prev => [...prev, { ...newUser, details: {} }]);
    setFeedback({ error: '', success: 'User added successfully' });
    setNewUser({ userId: '', password: '', type: 'user', status: 'active' });
  };

  const resetPassword = (userId) => {
    setUsers(prev => prev.map(u => 
      u.userId === userId ? { ...u, password: 'reset123' } : u
    ));
    setFeedback({ error: '', success: 'Password reset to reset123' });
  };

  return (
    <Container>
      <h2 className="my-4">User Rights Management</h2>
      {feedback.error && <Alert variant="danger">{feedback.error}</Alert>}
      {feedback.success && <Alert variant="success">{feedback.success}</Alert>}

      <div className="mb-4 p-3 bg-light rounded">
        <h4>Add New User</h4>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              type="text"
              name="userId"
              value={newUser.userId}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>User Type</Form.Label>
            <Form.Select
              name="type"
              value={newUser.type}
              onChange={handleInputChange}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={newUser.status}
              onChange={handleInputChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" onClick={handleAddUser}>
            Add User
          </Button>
        </Form>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.userId}</td>
              <td>{user.type}</td>
              <td>{user.status}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => resetPassword(user.userId)}>
                  Reset Password
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserRights;
