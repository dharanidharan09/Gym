// // import React from 'react';
// // import { Card, Container, Button } from 'react-bootstrap';
// // import useStorage from './useStorage';

// // const UserDetailsDisplay = ({ currentUserId }) => {
// //   const [users] = useStorage('gym_users', []);
// //   const user = users.find(u => u.userId === currentUserId) || {};
// //   const details = user.details || {};

// //   return (
// //     <Container className="mt-4">
// //       <h2 className="mb-4">User Profile</h2>
      
// //       <Card>
// //         <Card.Header className="bg-dark text-white">
// //           <h4>{details.name || 'No Name'}</h4>
// //         </Card.Header>
// //         <Card.Body>
// //           <div className="row">
// //             <div className="col-md-4">
// //               {details.photo ? (
// //                 <img 
// //                   src={details.photo} 
// //                   alt="User" 
// //                   className="img-fluid rounded"
// //                   style={{ maxWidth: '200px' }}
// //                 />
// //               ) : (
// //                 <div className="text-center py-5 bg-light">
// //                   <p>No Photo</p>
// //                 </div>
// //               )}
// //               <div className="mt-3">
// //                 <p><strong>User ID:</strong> {user.userId}</p>
// //                 <p><strong>Status:</strong> {user.status}</p>
// //                 <p><strong>Membership:</strong> {details.premium || 'N/A'}</p>
// //               </div>
// //             </div>
// //             <div className="col-md-8">
// //               <div className="row">
// //                 <div className="col-md-6">
// //                   <Card className="mb-3">
// //                     <Card.Header>Personal Information</Card.Header>
// //                     <Card.Body>
// //                       <p><strong>Gender:</strong> {details.gender || 'N/A'}</p>
// //                       <p><strong>DOB:</strong> {details.dob || 'N/A'}</p>
// //                       <p><strong>Height:</strong> {details.height ? `${details.height} cm` : 'N/A'}</p>
// //                       <p><strong>Weight:</strong> {details.weight ? `${details.weight} kg` : 'N/A'}</p>
// //                       <p><strong>Blood Group:</strong> {details.bloodGroup || 'N/A'}</p>
// //                     </Card.Body>
// //                   </Card>
// //                 </div>
// //                 <div className="col-md-6">
// //                   <Card className="mb-3">
// //                     <Card.Header>Contact Information</Card.Header>
// //                     <Card.Body>
// //                       <p><strong>Address:</strong> {details.address || 'N/A'}</p>
// //                       <p><strong>Phone:</strong> {details.phone || 'N/A'}</p>
// //                     </Card.Body>
// //                   </Card>
// //                   <Card>
// //                     <Card.Header>Gym Information</Card.Header>
// //                     <Card.Body>
// //                       <p><strong>Trainer:</strong> {details.trainer || 'N/A'}</p>
// //                       <p><strong>Date Joined:</strong> {details.doj || 'N/A'}</p>
// //                     </Card.Body>
// //                   </Card>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </Card.Body>
// //       </Card>
// //     </Container>
// //   );
// // };

// // export default UserDetailsDisplay;


// import React, { useState } from 'react';
// import { Table, Button, Card, Container, Form, Modal } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import useStorage from './useStorage';

// const UserDetailsDisplay = ({ currentUserId, userType }) => {
//   const [users, setUsers] = useStorage('gym_users', []);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [viewModalShow, setViewModalShow] = useState(false);
//   const [currentViewUser, setCurrentViewUser] = useState(null);
//   const navigate = useNavigate();

//   // Filter users for admin view
//   const filteredUsers = users.filter(user => 
//     (user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (user.details?.name?.toLowerCase().includes(searchTerm.toLowerCase()))) &&
//     user.type !== 'admin'
//   );

//   const handleDelete = (userId) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       setUsers(prev => prev.filter(user => user.userId !== userId));
//     }
//   };

//   const handleView = (user) => {
//     setCurrentViewUser(user);
//     setViewModalShow(true);
//   };

//   const handleEdit = (userId) => {
//     navigate(`/userdetails?userId=${userId}`);
//   };

//   // For user view - find current user
//   const currentUser = users.find(u => u.userId === currentUserId) || {};
//   const userDetails = currentUser.details || {};

//   return (
//     <Container className="mt-4">
//       {userType === 'admin' ? (
//         <div>
//           <h2 className="mb-4">User Management</h2>

//           <Form.Group className="mb-3">
//             <Form.Control
//               type="text"
//               placeholder="Search by User ID or Name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </Form.Group>

//           <Table striped bordered hover responsive>
//             <thead>
//               <tr>
//                 <th>User ID</th>
//                 <th>Name</th>
//                 <th>Status</th>
//                 <th>Weight</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map(user => (
//                 <tr key={user.userId}>
//                   <td>{user.userId}</td>
//                   <td>{user.details?.name || 'N/A'}</td>
//                   <td>
//                     <span className={`badge bg-${user.status === 'active' ? 'success' : 'danger'}`}>
//                       {user.status}
//                     </span>
//                   </td>
//                   <td>{user.details?.weight ? `${user.details.weight} kg` : 'N/A'}</td>
//                   <td>
//                     <div className="d-flex">
//                       <Button 
//                         variant="info" 
//                         size="sm" 
//                         className="me-2"
//                         onClick={() => handleView(user)}
//                       >
//                         View
//                       </Button>
//                       <Button 
//                         variant="warning" 
//                         size="sm" 
//                         className="me-2"
//                         onClick={() => handleEdit(user.userId)}
//                       >
//                         Edit
//                       </Button>
//                       <Button 
//                         variant="danger" 
//                         size="sm"
//                         onClick={() => handleDelete(user.userId)}
//                       >
//                         Delete
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           {/* View Modal */}
//           <Modal 
//             show={viewModalShow} 
//             onHide={() => setViewModalShow(false)} 
//             size="lg"
//           >
//             <Modal.Header closeButton>
//               <Modal.Title>User Details: {currentViewUser?.userId}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               {currentViewUser && (
//                 <UserDetailView user={currentViewUser} />
//               )}
//             </Modal.Body>
//             <Modal.Footer>
//               <Button 
//                 variant="primary" 
//                 onClick={() => {
//                   handleEdit(currentViewUser.userId);
//                   setViewModalShow(false);
//                 }}
//               >
//                 Edit User
//               </Button>
//               <Button variant="secondary" onClick={() => setViewModalShow(false)}>
//                 Close
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         </div>
//       ) : (
//         /* User View (Card Format) */
//         <div>
//           <h2 className="mb-4">My Profile</h2>
//           <UserDetailView user={currentUser} />
//         </div>
//       )}
//     </Container>
//   );
// };

// // User Detail View Component (Used in both modal and user view)
// const UserDetailView = ({ user }) => {
//   const details = user.details || {};
  
//   return (
//     <Card>
//       <Card.Header className="bg-dark text-white">
//         <h4>{details.name || 'No Name'} </h4>
//       </Card.Header>
//       <Card.Body>
//         <div className="row">
//           <div className="col-md-4">
//             {details.photo ? (
//               <img 
//                 src={details.photo} 
//                 alt="User" 
//                 className="img-fluid rounded"
//                 style={{ maxWidth: '200px' }}
//               />
//             ) : (
//               <div className="text-center py-5 bg-light">
//                 <p>No Photo</p>
//               </div>
//             )}
//             <div className="mt-3">
//               <p><strong>UserId: </strong> {user.userId}</p>
//               <p><strong>Status:</strong> 
//                 <span className={`badge bg-${user.status === 'active' ? 'success' : 'danger'} ms-2`}>
//                   {user.status}
//                 </span>
//               </p>
//               <p><strong>Membership:</strong> {details.premium || 'N/A'}</p>
//             </div>
//           </div>
//           <div className="col-md-8">
//             <div className="row">
//               <div className="col-md-6">
//                 <Card className="mb-3">
//                   <Card.Header>Personal Information</Card.Header>
//                   <Card.Body>
//                     <p><strong>Gender:</strong> {details.gender || 'N/A'}</p>
//                     <p><strong>DOB:</strong> {details.dob || 'N/A'}</p>
//                     <p><strong>Height:</strong> {details.height ? `${details.height} cm` : 'N/A'}</p>
//                     <p><strong>Weight:</strong> {details.weight ? `${details.weight} kg` : 'N/A'}</p>
//                     <p><strong>Blood Group:</strong> {details.bloodGroup || 'N/A'}</p>
//                   </Card.Body>
//                 </Card>
//               </div>
//               <div className="col-md-6">
//                 <Card className="mb-3">
//                   <Card.Header>Contact Information</Card.Header>
//                   <Card.Body>
//                     <p><strong>Address:</strong> {details.address || 'N/A'}</p>
//                     <p><strong>Phone:</strong> {details.phone || 'N/A'}</p>
//                   </Card.Body>
//                 </Card>
//                 <Card>
//                   <Card.Header>Gym Information</Card.Header>
//                   <Card.Body>
//                     <p><strong>Trainer:</strong> {details.trainer || 'N/A'}</p>
//                     <p><strong>Date Joined:</strong> {details.doj || 'N/A'}</p>
//                   </Card.Body>
//                 </Card>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card.Body>
//     </Card>
//   );
// };

// export default UserDetailsDisplay;

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Card, Container, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useStorage from './useStorage';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Make sure you have Bootstrap Icons installed and imported in your main index.js or App.js
// npm install bootstrap-icons
// import 'bootstrap-icons/font/bootstrap-icons.css';

const UserDetailsDisplay = ({ currentUserId, userType }) => {
  const [users, setUsers] = useStorage('gym_users', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModalShow, setViewModalShow] = useState(false);
  const [currentViewUser, setCurrentViewUser] = useState(null); // State to hold the user data for the modal
  const navigate = useNavigate();

  // State for pagination in admin view
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for sorting in admin view
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  // Memoized filtered and sorted users for admin table
  const filteredAndSortedUsers = useMemo(() => {
    let tempUsers = users.filter(user => user.type !== 'admin'); // Always exclude admins

    // Apply search filter
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      tempUsers = tempUsers.filter(user =>
        user.userId.toLowerCase().includes(lowercasedSearchTerm) ||
        (user.details?.name?.toLowerCase().includes(lowercasedSearchTerm))
      );
    }

    // Apply sorting
    if (sortColumn) {
      tempUsers.sort((a, b) => {
        let valA, valB;

        // Special handling for nested properties like details.name or details.weight
        if (sortColumn === 'name') {
          valA = a.details?.name || '';
          valB = b.details?.name || '';
        } else if (sortColumn === 'weight') {
          valA = parseFloat(a.details?.weight) || 0;
          valB = parseFloat(b.details?.weight) || 0;
        } else {
          valA = a[sortColumn];
          valB = b[sortColumn];
        }

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return tempUsers;
  }, [users, searchTerm, sortColumn, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedUsers.length / rowsPerPage);
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset current page when filters/sort/rowsPerPage change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage, sortColumn, sortDirection]);

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(user => user.userId !== userId));
    }
  };

  const handleView = (user) => {
    // This is the crucial part: Set the user to be viewed and then show the modal
    setCurrentViewUser(user);
    setViewModalShow(true);
  };

  const handleEdit = (userId) => {
    navigate(`/userdetails?userId=${userId}`);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);

    if (userType === 'admin') {
      doc.text('Gym User Report', 14, 20);
      doc.setFontSize(12);
      doc.text(`Total Users: ${filteredAndSortedUsers.length}`, 14, 30);
      if (searchTerm) {
        doc.text(`Search Term: "${searchTerm}"`, 14, 40);
      }

      const tableColumn = ["User ID", "Name", "Status", "Membership", "Gender", "DOB", "Height", "Weight", "Blood Group", "Address", "Phone", "Trainer", "Date Joined"];
      const tableRows = [];

      filteredAndSortedUsers.forEach(user => {
        const userDetails = user.details || {};
        const userData = [
          user.userId,
          userDetails.name || 'N/A',
          user.status,
          userDetails.premium || 'N/A',
          userDetails.gender || 'N/A',
          userDetails.dob || 'N/A',
          userDetails.height ? `${userDetails.height} cm` : 'N/A',
          userDetails.weight ? `${userDetails.weight} kg` : 'N/A',
          userDetails.bloodGroup || 'N/A',
          userDetails.address || 'N/A',
          userDetails.phone || 'N/A',
          userDetails.trainer || 'N/A',
          userDetails.doj || 'N/A'
        ];
        tableRows.push(userData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
        columnStyles: {
          0: { cellWidth: 15 }, // User ID
          1: { cellWidth: 25 }, // Name
          2: { cellWidth: 15 }, // Status
          3: { cellWidth: 15 }, // Membership
          4: { cellWidth: 15 }, // Gender
          5: { cellWidth: 20 }, // DOB
          6: { cellWidth: 15 }, // Height
          7: { cellWidth: 15 }, // Weight
          8: { cellWidth: 15 }, // Blood Group
          9: { cellWidth: 30 }, // Address
          10: { cellWidth: 20 }, // Phone
          11: { cellWidth: 20 }, // Trainer
          12: { cellWidth: 20 }  // Date Joined
        },
        margin: { top: 10, left: 10, right: 10, bottom: 10 }
      });
      doc.save('Gym_Users_Report.pdf');

    } else { // Regular user downloads their own profile
      const user = users.find(u => u.userId === currentUserId) || {};
      const details = user.details || {};

      doc.text(`User Profile: ${details.name || 'N/A'}`, 14, 20);
      doc.setFontSize(10);

      let y = 30; // Starting Y position for text

      if (details.photo) {
        const img = new Image();
        img.src = details.photo;
        img.onload = () => {
          const imgWidth = 50; // Desired width
          const imgHeight = (img.height * imgWidth) / img.width;
          doc.addImage(img, 'JPEG', 14, y, imgWidth, imgHeight);
          y += imgHeight + 10; // Move Y below the image
          addUserInfo(doc, user, details, y);
          doc.save(`${user.userId}_Profile.pdf`);
        };
        img.onerror = () => { // Fallback if image fails to load
          addUserInfo(doc, user, details, y);
          doc.save(`${user.userId}_Profile.pdf`);
        };
      } else {
        addUserInfo(doc, user, details, y);
        doc.save(`${user.userId}_Profile.pdf`);
      }
    }
  };

  // Helper function to add user info to PDF
  const addUserInfo = (doc, user, details, startY) => {
    let currentY = startY;
    const addLine = (label, value) => {
      doc.text(`${label}: ${value}`, 14, currentY);
      currentY += 7; // Line height
    };

    addLine('User ID', user.userId);
    addLine('Name', details.name || 'N/A');
    addLine('Status', user.status);
    addLine('Membership', details.premium || 'N/A');
    addLine('Gender', details.gender || 'N/A');
    addLine('DOB', details.dob || 'N/A');
    addLine('Height', details.height ? `${details.height} cm` : 'N/A');
    addLine('Weight', details.weight ? `${details.weight} kg` : 'N/A');
    addLine('Blood Group', details.bloodGroup || 'N/A');
    addLine('Address', details.address || 'N/A');
    addLine('Phone', details.phone || 'N/A');
    addLine('Trainer', details.trainer || 'N/A');
    addLine('Date Joined', details.doj || 'N/A');
  };

  // For user view - find current user
  const currentUser = users.find(u => u.userId === currentUserId) || {};

  return (
    <Container className="mt-4">
      {userType === 'admin' ? (
        <div>
          <h2 className="mb-4">User Management</h2>

          <div className="d-flex justify-content-between mb-4">
            <Form.Group className="mb-3 w-50 me-2">
              <Form.Control
                type="text"
                placeholder="Search by User ID or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
            <div>
              <Button variant="secondary" onClick={handleDownloadPDF}>
                <i className="bi bi-download me-2"></i>Download PDF
              </Button>
            </div>
          </div>

         
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th onClick={() => handleSort('userId')} style={{ cursor: 'pointer' }}>
                  User ID {sortColumn === 'userId' && (<i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>)}
                </th>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  Name {sortColumn === 'name' && (<i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>)}
                </th>
                <th>Status</th>
                <th onClick={() => handleSort('weight')} style={{ cursor: 'pointer' }}>
                  Weight {sortColumn === 'weight' && (<i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>)}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map(user => (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.details?.name || 'N/A'}</td>
                    <td>
                      <span className={`badge bg-${user.status === 'active' ? 'success' : 'danger'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.details?.weight ? `${user.details.weight} kg` : 'N/A'}</td>
                    <td>
                      <div className="d-flex">
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleView(user)} // This should now correctly set currentViewUser and open the modal
                        >
                          <i className="bi bi-eye"></i> View
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(user.userId)}
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(user.userId)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No users found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </Table>

          {filteredAndSortedUsers.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              {/* Rows Per Page Selector */}
              <div className="d-flex align-items-center">
                <Form.Group className="mb-0 me-3">
                  <Form.Label className="me-2">Rows Per Page:</Form.Label>
                  <Form.Select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    style={{ width: 'auto', display: 'inline-block' }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Showing X to Y of Z entries */}
              <div>
                Showing{' '}
                {Math.min(filteredAndSortedUsers.length, (currentPage - 1) * rowsPerPage + 1)}{' '}
                to{' '}
                {Math.min(currentPage * rowsPerPage, filteredAndSortedUsers.length)} of{' '}
                {filteredAndSortedUsers.length} entries
              </div>

              {/* Pagination Buttons and Page Numbers */}
              <div>
                <Button
                  variant="light"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="me-2"
                >
                  Previous
                </Button>

                {/* Dynamic Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                  const isCurrent = pageNumber === currentPage;
                  const isFirst = pageNumber === 1;
                  const isLast = pageNumber === totalPages;
                  const isNearCurrent = Math.abs(pageNumber - currentPage) < 3;

                  if (isFirst || isLast || isNearCurrent || (currentPage < 4 && pageNumber <= 5) || (currentPage > totalPages - 3 && pageNumber >= totalPages - 4)) {
                    return (
                      <Button
                        key={pageNumber}
                        variant={isCurrent ? 'primary' : 'light'}
                        onClick={() => setCurrentPage(pageNumber)}
                        className="mx-1"
                      >
                        {pageNumber}
                      </Button>
                    );
                  } else if (
                      (pageNumber === currentPage - 3 && currentPage > 4) ||
                      (pageNumber === currentPage + 3 && currentPage < totalPages - 3)
                  ) {
                    return <span key={`ellipsis-${pageNumber}`} className="mx-1">...</span>;
                  }
                  return null;
                })}

                <Button
                  variant="light"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="ms-2"
                >
                  Next
                </Button>
              </div>
            </div>
          )}


          {/* View Modal */}
          <Modal
            show={viewModalShow}
            onHide={() => setViewModalShow(false)}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>User Details: {currentViewUser?.userId}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {currentViewUser && (
                <UserDetailView user={currentViewUser} />
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  handleEdit(currentViewUser.userId);
                  setViewModalShow(false);
                }}
              >
                Edit User
              </Button>
              <Button variant="secondary" onClick={() => setViewModalShow(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : (
        /* User View (Card Format) */
        <div>
          <h2 className="mb-4">My Profile</h2>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="secondary" onClick={handleDownloadPDF}>
              <i className="bi bi-download me-2"></i>Download Profile PDF
            </Button>
          </div>
          <UserDetailView user={currentUser} />
        </div>
      )}
    </Container>
  );
};

// User Detail View Component (Used in both modal and user view)
const UserDetailView = ({ user }) => {
  const details = user.details || {};

  return (
    <Card>
      <Card.Header className="bg-dark text-white">
        <h4>{details.name || 'No Name'} </h4>
      </Card.Header>
      <Card.Body>
        <div className="row">
          <div className="col-md-4">
            {details.photo ? (
              <img
                src={details.photo}
                alt="User"
                className="img-fluid rounded"
                style={{ maxWidth: '200px' }}
              />
            ) : (
              <div className="text-center py-5 bg-light">
                <p>No Photo</p>
              </div>
            )}
            <div className="mt-3">
              <p><strong>User ID:</strong> {user.userId}</p>
              <p><strong>Status:</strong>
                <span className={`badge bg-${user.status === 'active' ? 'success' : 'danger'} ms-2`}>
                  {user.status}
                </span>
              </p>
              <p><strong>Membership:</strong> {details.premium || 'N/A'}</p>
            </div>
          </div>
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-6">
                <Card className="mb-3">
                  <Card.Header>Personal Information</Card.Header>
                  <Card.Body>
                    <p><strong>Gender:</strong> {details.gender || 'N/A'}</p>
                    <p><strong>DOB:</strong> {details.dob || 'N/A'}</p>
                    <p><strong>Height:</strong> {details.height ? `${details.height} cm` : 'N/A'}</p>
                    <p><strong>Weight:</strong> {details.weight ? `${details.weight} kg` : 'N/A'}</p>
                    <p><strong>Blood Group:</strong> {details.bloodGroup || 'N/A'}</p>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-6">
                <Card className="mb-3">
                  <Card.Header>Contact Information</Card.Header>
                  <Card.Body>
                    <p><strong>Address:</strong> {details.address || 'N/A'}</p>
                    <p><strong>Phone:</strong> {details.phone || 'N/A'}</p>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Header>Gym Information</Card.Header>
                  <Card.Body>
                    <p><strong>Trainer:</strong> {details.trainer || 'N/A'}</p>
                    <p><strong>Date Joined:</strong> {details.doj || 'N/A'}</p>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserDetailsDisplay;
