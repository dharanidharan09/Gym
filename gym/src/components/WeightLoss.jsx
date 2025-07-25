


// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { Container, Form, Button, Table, Modal, Alert, InputGroup, Dropdown } from 'react-bootstrap';
// import useStorage from './useStorage';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { useNavigate } from 'react-router-dom';

// const WeightLoss = ({ currentUserId, userType }) => {
//   const [users] = useStorage('gym_users', []);
//   const [weightLossEntries, setWeightLossEntries] = useStorage('weight_loss_entries', []);
//   const [selectedUserId, setSelectedUserId] = useState(currentUserId);
//   const [date, setDate] = useState('');
//   const [weight, setWeight] = useState('');
//   const [descriptions, setDescriptions] = useState(['']);
//   const [currentEditEntry, setCurrentEditEntry] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [filterDateFrom, setFilterDateFrom] = useState('');
//   const [filterDateTo, setFilterDateTo] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // States for global search and sorting
//   const [globalSearchTerm, setGlobalSearchTerm] = useState('');
//   const [sortColumn, setSortColumn] = useState(null);
//   const [sortDirection, setSortDirection] = useState('asc');

//   // States for combined user search/select in admin add modal
//   const [userSearchTerm, setUserSearchTerm] = useState('');
//   const [showUserDropdown, setShowUserDropdown] = useState(false);
//   const userDropdownRef = useRef(null);

//   // New state for success message
//   const [successMessage, setSuccessMessage] = useState('');

//   const navigate = useNavigate();

//   // Get current user's weight or default to empty
//   useEffect(() => {
//     if (selectedUserId && users.length > 0) {
//       const user = users.find(u => u.userId === selectedUserId);
//       if (user?.details?.weight) {
//         setWeight(user.details.weight);
//       }
//     }
//   }, [selectedUserId, users]);

//   // Handle click outside to close user dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
//         setShowUserDropdown(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Clear success message after a few seconds
//   useEffect(() => {
//     if (successMessage) {
//       const timer = setTimeout(() => {
//         setSuccessMessage('');
//       }, 3000); // Message disappears after 3 seconds
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage]);

//   // Filter users based on search term for the admin dropdown
//   const filteredUsersForDropdown = useMemo(() => {
//     if (!userSearchTerm) {
//       // If no search term, show all non-admin users if admin, otherwise just the current user
//       return userType === 'admin' ? users.filter(user => user.type !== 'admin') : users.filter(user => user.userId === currentUserId);
//     }
//     const lowercasedSearchTerm = userSearchTerm.toLowerCase();
//     return users
//       .filter(user => user.type !== 'admin') // Always exclude admins from this list
//       .filter(user =>
//         user.userId.toLowerCase().includes(lowercasedSearchTerm) ||
//         user.details?.name?.toLowerCase().includes(lowercasedSearchTerm)
//       );
//   }, [users, userSearchTerm, userType, currentUserId]);


//   // Combined filtering and sorting logic using useMemo for performance
//   const filteredAndSortedEntries = useMemo(() => {
//     let tempEntries = weightLossEntries;

//     // 1. Global Search Filter
//     if (globalSearchTerm) {
//       const lowercasedSearchTerm = globalSearchTerm.toLowerCase();
//       tempEntries = tempEntries.filter(entry =>
//         Object.values(entry).some(value =>
//           String(value).toLowerCase().includes(lowercasedSearchTerm)
//         )
//       );
//     }

//     // 2. User Type Filter
//     tempEntries = tempEntries.filter(entry =>
//       userType === 'admin' || entry.userId === currentUserId
//     );

//     // 3. Date Range Filter
//     tempEntries = tempEntries.filter(entry => {
//       const entryDate = new Date(entry.date);
//       const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
//       const toDate = filterDateTo ? new Date(filterDateTo) : null;

//       return (!fromDate || entryDate >= fromDate) && (!toDate || entryDate <= toDate);
//     });

//     // 4. Sorting
//     if (sortColumn) {
//       tempEntries.sort((a, b) => {
//         const valA = a[sortColumn];
//         const valB = b[sortColumn];

//         // Handle numeric sorting for weight
//         if (sortColumn === 'weight') {
//           return sortDirection === 'asc' ? valA - valB : valB - valA;
//         }

//         if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
//         if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
//         return 0;
//       });
//     }

//     return tempEntries;
//   }, [weightLossEntries, currentUserId, userType, filterDateFrom, filterDateTo, globalSearchTerm, sortColumn, sortDirection]);

//   // Pagination logic
//   const totalPages = Math.ceil(filteredAndSortedEntries.length / rowsPerPage);
//   const paginatedEntries = filteredAndSortedEntries.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   // Reset current page when filters/sort change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filterDateFrom, filterDateTo, globalSearchTerm, sortColumn, sortDirection, rowsPerPage]);

//   const handleAddEntry = () => {
//     const selectedUser = users.find(u => u.userId === selectedUserId);

//     if (!date || !selectedUserId) {
//       alert('Please select a date and user.');
//       return;
//     }

//     // Ensure weight is a number if possible, or keep as string
//     const finalWeight = weight ? parseFloat(weight) : null;

//     const newEntry = {
//       userId: selectedUserId,
//       userName: selectedUser?.details?.name || 'N/A',
//       weight: finalWeight, // Store as number for better sorting/analysis
//       date,
//       descriptions: descriptions.filter(d => d.trim() !== '')
//     };

//     setWeightLossEntries([...weightLossEntries, newEntry]);
//     setDescriptions(['']);
//     setShowAddModal(false);
//     // Keep selectedUserId as is if admin, otherwise reset to currentUserId for normal users
//     if (userType !== 'admin') {
//         setSelectedUserId(currentUserId);
//     }
//     setDate('');
//     setWeight('');
//     setUserSearchTerm('');

//     // Set success message
//     setSuccessMessage(`Weight loss data successfully added for User ID: ${selectedUserId}`);
//   };

//   const handleDeleteEntry = (index) => {
//     if (window.confirm('Are you sure you want to delete this entry?')) {
//       const entryToDelete = paginatedEntries[index];
//       const originalIndex = weightLossEntries.findIndex(entry =>
//         entry.userId === entryToDelete.userId &&
//         entry.date === entryToDelete.date &&
//         entry.weight === entryToDelete.weight &&
//         entry.descriptions.join(',') === entryToDelete.descriptions.join(',')
//       );

//       if (originalIndex > -1) {
//         const updatedEntries = [...weightLossEntries];
//         updatedEntries.splice(originalIndex, 1);
//         setWeightLossEntries(updatedEntries);
//       }
//     }
//   };

//   const handleEditEntry = (entryToEdit) => {
//     const originalIndex = weightLossEntries.findIndex(entry =>
//       entry.userId === entryToEdit.userId &&
//       entry.date === entryToEdit.date &&
//       entry.weight === entryToEdit.weight &&
//       entry.descriptions.join(',') === entryToEdit.descriptions.join(',')
//     );

//     if (originalIndex > -1) {
//       setCurrentEditEntry({ index: originalIndex, ...entryToEdit });
//       setShowEditModal(true);
//     }
//   };

//   const handleSaveEdit = () => {
//     const updatedEntries = [...weightLossEntries];
//     updatedEntries[currentEditEntry.index] = {
//       userId: currentEditEntry.userId,
//       userName: currentEditEntry.userName,
//       weight: parseFloat(currentEditEntry.weight), // Ensure weight is saved as number
//       date: currentEditEntry.date,
//       descriptions: currentEditEntry.descriptions.filter(d => d.trim() !== '')
//     };
//     setWeightLossEntries(updatedEntries);
//     setShowEditModal(false);
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();

//     // Header
//     doc.setFontSize(18);
//     doc.text('Gym Management - Weight Loss Report', 14, 20);
//     doc.setFontSize(12);

//     // User Info
//     if (userType !== 'admin') {
//       const user = users.find(u => u.userId === currentUserId);
//       doc.text(`Name: ${user?.details?.name || 'N/A'}`, 14, 30);
//       doc.text(`User ID: ${currentUserId}`, 14, 40);
//       doc.text(`Membership: ${user?.details?.premium || 'N/A'}`, 14, 50);
//       doc.text(`Phone: ${user?.details?.phone || 'N/A'}`, 14, 60);
//       doc.text(`Status: ${user?.status || 'N/A'}`, 14, 70);
//     }

//     // Date range info if filtered
//     if (filterDateFrom || filterDateTo) {
//       doc.text(`Date Range: ${filterDateFrom || 'Start'} to ${filterDateTo || 'End'}`, 14, userType === 'admin' ? 30 : 80);
//     }

//     // Table data
//     const tableData = filteredAndSortedEntries.map(entry => [
//       entry.userId,
//       entry.userName,
//       entry.weight,
//       entry.date,
//       entry.descriptions.join(', ')
//     ]);

//     // Generate table
//     autoTable(doc, {
//       head: [['User ID', 'Name', 'Weight', 'Date', 'Notes']],
//       body: tableData,
//       startY: userType === 'admin' ? (filterDateFrom || filterDateTo ? 40 : 30) : (filterDateFrom || filterDateTo ? 90 : 80),
//       margin: { top: 20 },
//       styles: { overflow: 'linebreak' }
//     });

//     doc.save('weight_loss_report.pdf');
//   };

//   // Function to handle column sorting
//   const handleSort = (column) => {
//     if (sortColumn === column) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortColumn(column);
//       setSortDirection('asc');
//     }
//   };

//   // Function to add a new description input field
//   const handleAddDescriptionField = () => {
//     if (descriptions.length < 5) {
//       setDescriptions([...descriptions, '']);
//     }
//   };

//   // Function to handle user selection from the dropdown
//   const handleUserSelect = (userId) => {
//     setSelectedUserId(userId);
//     // Set the input value to the selected user's name/ID for display
//     const selectedUser = users.find(u => u.userId === userId);
//     setUserSearchTerm(selectedUser ? `${selectedUser.userId} - ${selectedUser.details?.name || 'N/A'}` : '');
//     setShowUserDropdown(false); // Close the dropdown after selection

//     // Also update the weight field if the user has a stored weight
//     if (selectedUser?.details?.weight) {
//         setWeight(selectedUser.details.weight);
//     } else {
//         setWeight(''); // Clear weight if selected user has none
//     }
//   };

//   return (
//     <Container className="mt-4">
//       <h2 className="mb-4">Weight Loss Tracking</h2>

//       {/* Success Message Alert */}
//       {successMessage && <Alert variant="success">{successMessage}</Alert>}

//       <div className="d-flex justify-content-between mb-4">
//         <div>
//           <Button variant="primary" onClick={() => {
//             setShowAddModal(true);
//             // If admin, keep selectedUserId as is, otherwise default to currentUserId
//             setSelectedUserId(userType === 'admin' ? selectedUserId : currentUserId);
//             setDate('');
//             setWeight('');
//             setDescriptions(['']);
//             setUserSearchTerm(''); // Clear user search term
//             setSuccessMessage(''); // Clear any old success messages
//           }}>
//             Add New Entry
//           </Button>
//         </div>
//         <div>
//           <Button variant="secondary" onClick={handleDownloadPDF} className="me-2">
//             Download PDF
//           </Button>
//           <Button variant="info" onClick={() => navigate(-1)}>
//             Back
//           </Button>
//         </div>
//       </div>

     
//       <div className="row mb-4 align-items-center">
//         <div className="col-auto">
//           <Form.Group className="d-flex align-items-center mb-0">
//             <Form.Label className="me-2 mb-0">Date From:</Form.Label>
//             <Form.Control
//               type="date"
//               value={filterDateFrom}
//               onChange={(e) => setFilterDateFrom(e.target.value)}
//               style={{ width: '150px' }}
//             />
//           </Form.Group>
//         </div>
//         <div className="col-auto">
//           <Form.Group className="d-flex align-items-center mb-0">
//             <Form.Label className="me-2 mb-0">Date To:</Form.Label>
//             <Form.Control
//               type="date"
//               value={filterDateTo}
//               onChange={(e) => setFilterDateTo(e.target.value)}
//               style={{ width: '150px' }}
//             />
//           </Form.Group>
//         </div>
//         <div className="col d-flex justify-content-end">
//           <Form.Group className="d-flex align-items-center mb-0" style={{ width: '250px' }}>
//             <Form.Label className="me-2 mb-0">Search:</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Search all columns..."
//               value={globalSearchTerm}
//               onChange={(e) => setGlobalSearchTerm(e.target.value)}
//             />
//           </Form.Group>
//         </div>
//       </div>

//       <Table striped bordered hover responsive>
//         <thead>
//           <tr>
//             <th onClick={() => handleSort('userId')} style={{ cursor: 'pointer' }}>
//               User ID {sortColumn === 'userId' && (sortDirection === 'asc' ? '▲' : '▼')}
//             </th>
//             <th onClick={() => handleSort('userName')} style={{ cursor: 'pointer' }}>
//               Name {sortColumn === 'userName' && (sortDirection === 'asc' ? '▲' : '▼')}
//             </th>
//             <th onClick={() => handleSort('weight')} style={{ cursor: 'pointer' }}>
//               Weight {sortColumn === 'weight' && (sortDirection === 'asc' ? '▲' : '▼')}
//             </th>
//             <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
//               Date {sortColumn === 'date' && (sortDirection === 'asc' ? '▲' : '▼')}
//             </th>
//             <th>Notes</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedEntries.length > 0 ? (
//             paginatedEntries.map((entry, index) => (
//               <tr key={index}>
//                 <td>{entry.userId}</td>
//                 <td>{entry.userName}</td>
//                 <td>{entry.weight}</td>
//                 <td>{entry.date}</td>
//                 <td>{entry.descriptions.join(', ')}</td>
//                 <td>
//                   <Button
//                     variant="warning"
//                     size="sm"
//                     className="me-2"
//                     onClick={() => handleEditEntry(entry)}
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     variant="danger"
//                     size="sm"
//                     onClick={() => handleDeleteEntry(index)}
//                   >
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" className="text-center">No entries found</td>
//             </tr>
//           )}
//         </tbody>
//       </Table>

//       {filteredAndSortedEntries.length > 0 && (
//         <div className="d-flex justify-content-between align-items-center mt-3">
//           {/* Rows Per Page Selector */}
//           <div className="d-flex align-items-center">
//             <Form.Group className="mb-0 me-3">
//               <Form.Label className="me-2">Rows Per Page:</Form.Label>
//               <Form.Select
//                 value={rowsPerPage}
//                 onChange={(e) => setRowsPerPage(Number(e.target.value))}
//                 style={{ width: 'auto', display: 'inline-block' }}
//               >
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//                 <option value={50}>50</option>
//               </Form.Select>
//             </Form.Group>
//           </div>

//           {/* Showing X to Y of Z entries */}
//           <div>
//             Showing{' '}
//             {Math.min(filteredAndSortedEntries.length, (currentPage - 1) * rowsPerPage + 1)}{' '}
//             to{' '}
//             {Math.min(currentPage * rowsPerPage, filteredAndSortedEntries.length)} of{' '}
//             {filteredAndSortedEntries.length} entries
//           </div>

//           {/* Pagination Buttons and Page Numbers */}
//           <div>
//             <Button
//               variant="light"
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage(p => p - 1)}
//               className="me-2"
//             >
//               Previous
//             </Button>

//             {/* Dynamic Page Number Buttons */}
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
//               const isCurrent = pageNumber === currentPage;
//               const isFirst = pageNumber === 1;
//               const isLast = pageNumber === totalPages;
//               const isNearCurrent = Math.abs(pageNumber - currentPage) < 3;

//               if (isFirst || isLast || isNearCurrent || (currentPage < 4 && pageNumber <= 5) || (currentPage > totalPages - 3 && pageNumber >= totalPages - 4)) {
//                 return (
//                   <Button
//                     key={pageNumber}
//                     variant={isCurrent ? 'primary' : 'light'}
//                     onClick={() => setCurrentPage(pageNumber)}
//                     className="mx-1"
//                   >
//                     {pageNumber}
//                   </Button>
//                 );
//               } else if (
//                   (pageNumber === currentPage - 3 && currentPage > 4) ||
//                   (pageNumber === currentPage + 3 && currentPage < totalPages - 3)
//               ) {
//                 return <span key={`ellipsis-${pageNumber}`} className="mx-1">...</span>;
//               }
//               return null;
//             })}

//             <Button
//               variant="light"
//               disabled={currentPage >= totalPages}
//               onClick={() => setCurrentPage(p => p + 1)}
//               className="ms-2"
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       )}

//       <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Add Weight Loss Entry</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//              {userType === 'admin' && (
//               <Form.Group className="mb-3" ref={userDropdownRef}>
//                 <Form.Label>Select User</Form.Label>
//                 <Dropdown show={showUserDropdown} onToggle={(nextShow) => setShowUserDropdown(nextShow)}>
//                   <Dropdown.Toggle as={InputGroup} className="w-100">
//                     <Form.Control
//                       type="text"
//                       placeholder="Search by ID ..."
//                       value={userSearchTerm}
//                       onChange={(e) => {
//                         setUserSearchTerm(e.target.value);
//                         setSelectedUserId(''); // Clear selection if typing
//                         if (!showUserDropdown) setShowUserDropdown(true);
//                       }}
//                       onFocus={() => setShowUserDropdown(true)}
//                     />
//                     <InputGroup.Text>
//                         <i className={`bi bi-chevron-${showUserDropdown ? 'up' : 'down'}`}></i>
//                     </InputGroup.Text>
//                   </Dropdown.Toggle>

//                   <Dropdown.Menu className="w-100" style={{ maxHeight: '250px', overflowY: 'auto' }}>
//                     {filteredUsersForDropdown.length > 0 ? (
//                       filteredUsersForDropdown.map(user => (
//                         <Dropdown.Item
//                           key={user.userId}
//                           eventKey={user.userId}
//                           onClick={() => handleUserSelect(user.userId)}
//                           active={selectedUserId === user.userId}
//                         >
//                           {user.userId}
//                         </Dropdown.Item>
//                       ))
//                     ) : (
//                       <Dropdown.ItemText>No matching users</Dropdown.ItemText>
//                     )}
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </Form.Group>
//             )}

//             {/* Display selected user's name if a user is selected */}
//             {selectedUserId && (
//               <Form.Group className="mb-3">
//                 <Form.Label>Name:</Form.Label>
//                 <p className="form-control-static">
//                   {users.find(user => user.userId === selectedUserId)?.details?.name || 'N/A'}
//                 </p>
//               </Form.Group>
//             )}

//             <Form.Group className="mb-3">
//               <Form.Label>Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={date}
//                 max={new Date().toISOString().split('T')[0]}
//                 onChange={(e) => setDate(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Weight (kg)</Form.Label>
//               <Form.Control
//                 type="number"
//                 value={weight}
//                 onChange={(e) => setWeight(e.target.value)}
//                 placeholder="Enter current weight"
//                 min="0"
//               />
//             </Form.Group>

//             {/* Dynamic Description Fields */}
//             {descriptions.map((desc, idx) => (
//               <Form.Group key={idx} className="mb-3">
//                 <Form.Label>Note {idx + 1}</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={desc}
//                   onChange={(e) => {
//                     const newDescriptions = [...descriptions];
//                     newDescriptions[idx] = e.target.value;
//                     setDescriptions(newDescriptions);
//                   }}
//                   placeholder="Optional note"
//                 />
//               </Form.Group>
//             ))}
//             {descriptions.length < 5 && (
//               <Button variant="outline-secondary" size="sm" onClick={handleAddDescriptionField} className="mb-3">
//                 Add More Notes
//               </Button>
//             )}
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleAddEntry}>
//             Save Entry
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Entry</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>User ID</Form.Label>
//               <Form.Control plaintext readOnly value={currentEditEntry?.userId} />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Name</Form.Label>
//               <Form.Control plaintext readOnly value={currentEditEntry?.userName} />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Date</Form.Label>
//               <Form.Control plaintext readOnly value={currentEditEntry?.date} />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Weight (kg)</Form.Label>
//               <Form.Control
//                 type="number"
//                 value={currentEditEntry?.weight || ''}
//                 onChange={(e) => setCurrentEditEntry({
//                   ...currentEditEntry,
//                   weight: e.target.value
//                 })}
//                  min="0"
//               />
//             </Form.Group>
//             {/* Edit modal descriptions are always 5 for simplicity and consistency */}
//             {Array(5).fill(0).map((_, idx) => (
//               <Form.Group key={idx} className="mb-3">
//                 <Form.Label>Note {idx + 1}</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={currentEditEntry?.descriptions?.[idx] || ''}
//                   onChange={(e) => {
//                     const newDescriptions = [...(currentEditEntry.descriptions || [])];
//                     newDescriptions[idx] = e.target.value;
//                     setCurrentEditEntry({
//                       ...currentEditEntry,
//                       descriptions: newDescriptions
//                     });
//                   }}
//                 />
//               </Form.Group>
//             ))}
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEditModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleSaveEdit}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default WeightLoss;


import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Container, Form, Button, Table, Modal, Alert, InputGroup, Dropdown } from 'react-bootstrap';
import useStorage from './useStorage';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const WeightLoss = ({ currentUserId, userType }) => {
  const [users] = useStorage('gym_users', []);
  const [weightLossEntries, setWeightLossEntries] = useStorage('weight_loss_entries', []);
  // Set initial selectedUserId based on userType
  const [selectedUserId, setSelectedUserId] = useState(userType === 'admin' ? '' : currentUserId);
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [descriptions, setDescriptions] = useState(['']);
  const [currentEditEntry, setCurrentEditEntry] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // States for global search and sorting
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // States for combined user search/select in admin add modal
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);

  // New state for success message
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  // Get current user's weight or default to empty when the component mounts or user changes
  useEffect(() => {
    if (userType !== 'admin' && currentUserId && users.length > 0) {
      const user = users.find(u => u.userId === currentUserId);
      if (user?.details?.weight) {
        setWeight(user.details.weight);
      }
      setSelectedUserId(currentUserId); // Ensure regular user's ID is selected
    } else if (userType === 'admin' && !selectedUserId && users.length > 0) {
        // For admin, initially clear selectedUserId to prompt selection, or if no users, keep empty
        setSelectedUserId('');
    }
  }, [currentUserId, users, userType]);


  // Handle click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clear success message after a few seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Message disappears after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Filter users based on search term for the admin dropdown (only non-admin users)
  const filteredUsersForDropdown = useMemo(() => {
    if (!userSearchTerm) {
      return users.filter(user => user.type !== 'admin');
    }
    const lowercasedSearchTerm = userSearchTerm.toLowerCase();
    return users
      .filter(user => user.type !== 'admin')
      .filter(user =>
        user.userId.toLowerCase().includes(lowercasedSearchTerm) ||
        user.details?.name?.toLowerCase().includes(lowercasedSearchTerm)
      );
  }, [users, userSearchTerm]);


  // Combined filtering and sorting logic using useMemo for performance
  const filteredAndSortedEntries = useMemo(() => {
    let tempEntries = weightLossEntries;

    // 1. Global Search Filter
    if (globalSearchTerm) {
      const lowercasedSearchTerm = globalSearchTerm.toLowerCase();
      tempEntries = tempEntries.filter(entry =>
        Object.values(entry).some(value =>
          String(value).toLowerCase().includes(lowercasedSearchTerm)
        )
      );
    }

    // 2. User Type Filter: Regular users only see their own data
    if (userType !== 'admin') {
      tempEntries = tempEntries.filter(entry => entry.userId === currentUserId);
    }

    // 3. Date Range Filter
    tempEntries = tempEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
      const toDate = filterDateTo ? new Date(filterDateTo) : null;

      return (!fromDate || entryDate >= fromDate) && (!toDate || entryDate <= toDate);
    });

    // 4. Sorting
    if (sortColumn) {
      tempEntries.sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];

        // Handle numeric sorting for weight
        if (sortColumn === 'weight') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return tempEntries;
  }, [weightLossEntries, currentUserId, userType, filterDateFrom, filterDateTo, globalSearchTerm, sortColumn, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedEntries.length / rowsPerPage);
  const paginatedEntries = filteredAndSortedEntries.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset current page when filters/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDateFrom, filterDateTo, globalSearchTerm, sortColumn, sortDirection, rowsPerPage]);

  const handleAddEntry = () => {
    const selectedUser = users.find(u => u.userId === selectedUserId);

    if (!date || !selectedUserId) {
      alert('Please select a date and user.');
      return;
    }

    const finalWeight = weight ? parseFloat(weight) : null;

    const newEntry = {
      userId: selectedUserId,
      userName: selectedUser?.details?.name || 'N/A',
      weight: finalWeight,
      date,
      descriptions: descriptions.filter(d => d.trim() !== '')
    };

    setWeightLossEntries([...weightLossEntries, newEntry]);
    setDescriptions(['']);
    setShowAddModal(false);
    setDate('');
    setWeight('');
    setUserSearchTerm(''); // Clear admin user search input after adding

    setSuccessMessage(`Weight loss data successfully added for User ID: ${selectedUserId}`);
  };

  const handleDeleteEntry = (index) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      // Find the entry in the original (unpaginated, unfiltered) array to delete it
      const entryToDelete = paginatedEntries[index];
      const originalIndex = weightLossEntries.findIndex(entry =>
        entry.userId === entryToDelete.userId &&
        entry.date === entryToDelete.date &&
        entry.weight === entryToDelete.weight &&
        entry.descriptions.join(',') === entryToDelete.descriptions.join(',')
      );

      if (originalIndex > -1) {
        const updatedEntries = [...weightLossEntries];
        updatedEntries.splice(originalIndex, 1);
        setWeightLossEntries(updatedEntries);
      }
    }
  };

  const handleEditEntry = (entryToEdit) => {
    // Find the entry in the original (unpaginated, unfiltered) array to edit it
    const originalIndex = weightLossEntries.findIndex(entry =>
      entry.userId === entryToEdit.userId &&
      entry.date === entryToEdit.date &&
      entry.weight === entryToEdit.weight &&
      entry.descriptions.join(',') === entryToEdit.descriptions.join(',')
    );

    if (originalIndex > -1) {
      setCurrentEditEntry({ index: originalIndex, ...entryToEdit });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    const updatedEntries = [...weightLossEntries];
    updatedEntries[currentEditEntry.index] = {
      userId: currentEditEntry.userId,
      userName: currentEditEntry.userName,
      weight: parseFloat(currentEditEntry.weight),
      date: currentEditEntry.date,
      descriptions: currentEditEntry.descriptions.filter(d => d.trim() !== '')
    };
    setWeightLossEntries(updatedEntries);
    setShowEditModal(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text('Gym Management - Weight Loss Report', 14, 20);
    doc.setFontSize(12);

    // User Info (for regular users, show only their info; for admin, no specific user info here)
    if (userType !== 'admin') {
      const user = users.find(u => u.userId === currentUserId);
      doc.text(`Name: ${user?.details?.name || 'N/A'}`, 14, 30);
      doc.text(`User ID: ${currentUserId}`, 14, 40);
      doc.text(`Membership: ${user?.details?.premium || 'N/A'}`, 14, 50);
      doc.text(`Phone: ${user?.details?.phone || 'N/A'}`, 14, 60);
      doc.text(`Status: ${user?.status || 'N/A'}`, 14, 70);
    }

    // Date range info if filtered
    if (filterDateFrom || filterDateTo) {
      doc.text(`Date Range: ${filterDateFrom || 'Start'} to ${filterDateTo || 'End'}`, 14, userType === 'admin' ? 30 : 80);
    }

    // Table data
    const tableData = filteredAndSortedEntries.map(entry => [
      entry.userId,
      entry.userName,
      entry.weight,
      entry.date,
      entry.descriptions.join(', ')
    ]);

    // Generate table
    autoTable(doc, {
      head: [['User ID', 'Name', 'Weight', 'Date', 'Notes']],
      body: tableData,
      startY: userType === 'admin' ? (filterDateFrom || filterDateTo ? 40 : 30) : (filterDateFrom || filterDateTo ? 90 : 80),
      margin: { top: 20 },
      styles: { overflow: 'linebreak' }
    });

    doc.save('weight_loss_report.pdf');
  };

  // Function to handle column sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Function to add a new description input field
  const handleAddDescriptionField = () => {
    if (descriptions.length < 5) {
      setDescriptions([...descriptions, '']);
    }
  };

  // Function to handle user selection from the dropdown (Admin only)
  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    const selectedUser = users.find(u => u.userId === userId);
    setUserSearchTerm(selectedUser ? `${selectedUser.userId} - ${selectedUser.details?.name || 'N/A'}` : '');
    setShowUserDropdown(false);

    if (selectedUser?.details?.weight) {
        setWeight(selectedUser.details.weight);
    } else {
        setWeight('');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Weight Loss Tracking</h2>

      {/* Success Message Alert */}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <div className="d-flex justify-content-between mb-4">
        {userType === 'admin' ? ( // Only show "Add New Entry" for admins
          <div>
            <Button variant="primary" onClick={() => {
              setShowAddModal(true);
              setSelectedUserId(''); // Clear selected user for new admin entry
              setDate('');
              setWeight('');
              setDescriptions(['']);
              setUserSearchTerm('');
              setSuccessMessage('');
            }}>
              Add New Entry
            </Button>
          </div>
        ) : (
            // For regular users, you might want to show a message or nothing here
            <div className="p-2 border rounded bg-light">
                <p className="mb-0">You are viewing your personal weight loss history.</p>
            </div>
        )}
        <div>
          <Button variant="secondary" onClick={handleDownloadPDF} className="me-2">
            Download PDF
          </Button>
          <Button variant="info" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>

      <div className="row mb-4 align-items-center">
        <div className="col-auto">
          <Form.Group className="d-flex align-items-center mb-0">
            <Form.Label className="me-2 mb-0">Date From:</Form.Label>
            <Form.Control
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              style={{ width: '150px' }}
            />
          </Form.Group>
        </div>
        <div className="col-auto">
          <Form.Group className="d-flex align-items-center mb-0">
            <Form.Label className="me-2 mb-0">Date To:</Form.Label>
            <Form.Control
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              style={{ width: '150px' }}
            />
          </Form.Group>
        </div>
        <div className="col d-flex justify-content-end">
          <Form.Group className="d-flex align-items-center mb-0" style={{ width: '250px' }}>
            <Form.Label className="me-2 mb-0">Search:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search all columns..."
              value={globalSearchTerm}
              onChange={(e) => setGlobalSearchTerm(e.target.value)}
            />
          </Form.Group>
        </div>
      </div>

  
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {userType === 'admin' && ( // Show User ID and Name columns only for admin
                <>
                    <th onClick={() => handleSort('userId')} style={{ cursor: 'pointer' }}>
                    User ID {sortColumn === 'userId' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('userName')} style={{ cursor: 'pointer' }}>
                    Name {sortColumn === 'userName' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                </>
            )}
            <th onClick={() => handleSort('weight')} style={{ cursor: 'pointer' }}>
              Weight {sortColumn === 'weight' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
              Date {sortColumn === 'date' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Notes</th>
            {userType === 'admin' && <th>Actions</th>} {/* Show Actions column only for admin */}
          </tr>
        </thead>
        <tbody>
          {paginatedEntries.length > 0 ? (
            paginatedEntries.map((entry, index) => (
              <tr key={index}>
                {userType === 'admin' && ( // Show User ID and Name data only for admin
                    <>
                        <td>{entry.userId}</td>
                        <td>{entry.userName}</td>
                    </>
                )}
                <td>{entry.weight}</td>
                <td>{entry.date}</td>
                <td>{entry.descriptions.join(', ')}</td>
                {userType === 'admin' && ( // Show Actions buttons only for admin
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditEntry(entry)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteEntry(index)}
                    >
                      Delete
                    </Button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={userType === 'admin' ? 6 : 4} className="text-center">No entries found</td>
            </tr>
          )}
        </tbody>
      </Table>

     
      {filteredAndSortedEntries.length > 0 && (
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
            {Math.min(filteredAndSortedEntries.length, (currentPage - 1) * rowsPerPage + 1)}{' '}
            to{' '}
            {Math.min(currentPage * rowsPerPage, filteredAndSortedEntries.length)} of{' '}
            {filteredAndSortedEntries.length} entries
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
      {userType === 'admin' && ( // Only show "Add Entry Modal" for admins
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Add Weight Loss Entry</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
                <Form.Group className="mb-3" ref={userDropdownRef}>
                  <Form.Label>Select User</Form.Label>
                  <Dropdown show={showUserDropdown} onToggle={(nextShow) => setShowUserDropdown(nextShow)}>
                    <Dropdown.Toggle as={InputGroup} className="w-100">
                      <Form.Control
                        type="text"
                        placeholder="Search by ID or Name..."
                        value={userSearchTerm}
                        onChange={(e) => {
                          setUserSearchTerm(e.target.value);
                          setSelectedUserId('');
                          if (!showUserDropdown) setShowUserDropdown(true);
                        }}
                        onFocus={() => setShowUserDropdown(true)}
                      />
                      <InputGroup.Text>
                          <i className={`bi bi-chevron-${showUserDropdown ? 'up' : 'down'}`}></i>
                      </InputGroup.Text>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="w-100" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                      {filteredUsersForDropdown.length > 0 ? (
                        filteredUsersForDropdown.map(user => (
                          <Dropdown.Item
                            key={user.userId}
                            eventKey={user.userId}
                            onClick={() => handleUserSelect(user.userId)}
                            active={selectedUserId === user.userId}
                          >
                            {user.userId} - {user.details?.name || 'N/A'}
                          </Dropdown.Item>
                        ))
                      ) : (
                        <Dropdown.ItemText>No matching users</Dropdown.ItemText>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>

              {selectedUserId && (
                <Form.Group className="mb-3">
                  <Form.Label>Name:</Form.Label>
                  <p className="form-control-static">
                    {users.find(user => user.userId === selectedUserId)?.details?.name || 'N/A'}
                  </p>
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Weight (kg)</Form.Label>
                <Form.Control
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter current weight"
                  min="0"
                />
              </Form.Group>

              {descriptions.map((desc, idx) => (
                <Form.Group key={idx} className="mb-3">
                  <Form.Label>Note {idx + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    value={desc}
                    onChange={(e) => {
                      const newDescriptions = [...descriptions];
                      newDescriptions[idx] = e.target.value;
                      setDescriptions(newDescriptions);
                    }}
                    placeholder="Optional note"
                  />
                </Form.Group>
              ))}
              {descriptions.length < 5 && (
                <Button variant="outline-secondary" size="sm" onClick={handleAddDescriptionField} className="mb-3">
                  Add More Notes
                </Button>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddEntry}>
              Save Entry
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {userType === 'admin' && ( // Only show "Edit Entry Modal" for admins
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Entry</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>User ID</Form.Label>
                <Form.Control plaintext readOnly value={currentEditEntry?.userId} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control plaintext readOnly value={currentEditEntry?.userName} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control plaintext readOnly value={currentEditEntry?.date} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Weight (kg)</Form.Label>
                <Form.Control
                  type="number"
                  value={currentEditEntry?.weight || ''}
                  onChange={(e) => setCurrentEditEntry({
                    ...currentEditEntry,
                    weight: e.target.value
                  })}
                  min="0"
                />
              </Form.Group>
              {Array(5).fill(0).map((_, idx) => (
                <Form.Group key={idx} className="mb-3">
                  <Form.Label>Note {idx + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentEditEntry?.descriptions?.[idx] || ''}
                    onChange={(e) => {
                      const newDescriptions = [...(currentEditEntry.descriptions || [])];
                      newDescriptions[idx] = e.target.value;
                      setCurrentEditEntry({
                        ...currentEditEntry,
                        descriptions: newDescriptions
                      });
                    }}
                  />
                </Form.Group>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default WeightLoss;