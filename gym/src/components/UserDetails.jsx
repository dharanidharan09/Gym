import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import useStorage from './useStorage';

const UserDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useStorage('gym_users', []);
  const queryParams = new URLSearchParams(location.search);
  const editUserId = queryParams.get('userId');
  
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    gender: '',
    address: '',
    phone: '',
    premium: '1 month',
    height: '',
    weight: '',
    dob: '',
    trainer: '',
    doj: '',
    bloodGroup: '',
    photo: null,
    status: 'active'
  });

  const [editingMode, setEditingMode] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (editUserId) {
      const user = users.find(u => u.userId === editUserId);
      if (user) {
        setFormData({
          userId: user.userId,
          name: user.details?.name || '',
          gender: user.details?.gender || '',
          address: user.details?.address || '',
          phone: user.details?.phone || '',
          premium: user.details?.premium || '1 month',
          height: user.details?.height || '',
          weight: user.details?.weight || '',
          dob: user.details?.dob || '',
          trainer: user.details?.trainer || '',
          doj: user.details?.doj || '',
          bloodGroup: user.details?.bloodGroup || '',
          photo: user.details?.photo || null,
          status: user.status || 'active'
        });
        setEditingMode(true);
      }
    }
  }, [editUserId, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedUsers = users.map(user => {
      if (user.userId === formData.userId) {
        return { 
          ...user, 
          status: formData.status,
          details: {
            name: formData.name,
            gender: formData.gender,
            address: formData.address,
            phone: formData.phone,
            premium: formData.premium,
            height: formData.height,
            weight: formData.weight,
            dob: formData.dob,
            trainer: formData.trainer,
            doj: formData.doj,
            bloodGroup: formData.bloodGroup,
            photo: formData.photo
          }
        };
      }
      return user;
    });

    // If it's a new user (not in editing mode)
    if (!editingMode && !users.some(u => u.userId === formData.userId)) {
      updatedUsers.push({
        userId: formData.userId,
        type: 'user',
        status: formData.status,
        password: 'default123', // Default password for new users
        details: {
          name: formData.name,
          gender: formData.gender,
          address: formData.address,
          phone: formData.phone,
          premium: formData.premium,
          height: formData.height,
          weight: formData.weight,
          dob: formData.dob,
          trainer: formData.trainer,
          doj: formData.doj,
          bloodGroup: formData.bloodGroup,
          photo: formData.photo
        }
      });
    }

    setUsers(updatedUsers);
    setSuccess('User details saved successfully!');
    setTimeout(() => navigate('/userdetailsdisplay'), 1500);
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">
        {editingMode ? `Edit User: ${formData.userId}` : 'Add New User Details'}
      </h2>
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        {!editingMode && (
          <Form.Group className="mb-3">
            <Form.Label>User ID</Form.Label>
            <Form.Select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            >
              <option value="">Select User ID</option>
              {users
                .filter(user => user.type === 'user' && !user.details?.name)
                .map(user => (
                  <option key={user.userId} value={user.userId}>
                    {user.userId}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        )}

        <div className="row">
          <div className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Male"
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  label="Female"
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
                maxLength={200}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
              />
            </Form.Group>
          </div>

          <div className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.photo && (
                <img 
                  src={formData.photo} 
                  alt="User" 
                  style={{ width: '100px', height: '100px', marginTop: '10px' }} 
                />
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Premium Membership</Form.Label>
              <Form.Select
                name="premium"
                value={formData.premium}
                onChange={handleChange}
              >
                <option value="1 month">1 Month</option>
                <option value="3 months">3 Months</option>
                <option value="6 months">6 Months</option>
                <option value="1 year">1 Year</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Height (cm)</Form.Label>
              <Form.Control
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Weight (kg)</Form.Label>
              <Form.Control
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
          <div className="col-md-4">
            <Form.Group className="mb-3">
              <Form.Label>Trainer</Form.Label>
              <Form.Control
                type="text"
                name="trainer"
                value={formData.trainer}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
          <div className="col-md-4">
            <Form.Group className="mb-3">
              <Form.Label>Date of Joining</Form.Label>
              <Form.Control
                type="date"
                name="doj"
                value={formData.doj}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label>Blood Group</Form.Label>
              <Form.Control
                type="text"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Active"
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  label="Inactive"
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>
          </div>
        </div>

        <div className="mt-3">
          <Button variant="primary" type="submit" className="me-3">
            {editingMode ? 'Update' : 'Save'}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/userdetailsdisplay')}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default UserDetails;
