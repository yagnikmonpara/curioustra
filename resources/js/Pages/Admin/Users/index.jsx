import React, { useState, useEffect } from 'react';
import '../../../../css/AdminUsers.css'; // Create this CSS file
import AdminLayout from '../../Layouts/AdminLayout';
const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewingUser, setViewingUser] = useState(null); // To store the user being viewed
    const [userBookings, setUserBookings] = useState([]); // To store bookings for the viewed user
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [bookingsError, setBookingsError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setUsers(users.filter(user => user.id !== id));
        } catch (err) {
            setError(err);
        }
    };

    const handleView = async (user) => {
        setViewingUser(user); // Set the current user being viewed
        setBookingsLoading(true);
        setBookingsError(null);

        try {
            const bookingsResponse = await fetch(`/api/users/${user.id}/bookings`); // API endpoint for user bookings
            if (!bookingsResponse.ok) {
                throw new Error(`HTTP error! status: ${bookingsResponse.status}`);
            }
            const bookingsData = await bookingsResponse.json();
            setUserBookings(bookingsData);
        } catch (bookingsErr) {
            setBookingsError(bookingsErr);
        } finally {
            setBookingsLoading(false);
        }
    };

    const handleCloseView = () => {
        setViewingUser(null);
        setUserBookings([]); // Clear bookings when closing view
    };

    if (loading) {
        return <div>Loading users...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <AdminLayout>
        <div className="admin-users-page">
            <header>
                <h1>Admin Users</h1>
            </header>
            <main className="users-container">
                {users.map(user => (
                    <div key={user.id} className="user-card">
                        <p>Name: {user.name}</p>
                        <p>Email: {user.email}</p>
                        {/* Add other user details as needed */}
                        <div className="button-group"> {/* Group buttons */}
                            <button onClick={() => handleView(user)}>View</button>
                            <button className="delete-button" onClick={() => handleDelete(user.id)}>Delete</button>
                        </div>
                    </div>
                ))}

                {/* View User Details and Bookings (Modal or separate section) */}
                {viewingUser && (
                    <div className="view-user-modal"> {/* Or use a separate section */}
                        <div className="view-user-content">
                            <h2>{viewingUser.name}'s Details</h2>
                            {/* Display user details */}
                            <p>Email: {viewingUser.email}</p>
                            {/* ... other user details */}

                            <h3>Bookings:</h3>
                            {bookingsLoading ? (
                                <div>Loading bookings...</div>
                            ) : bookingsError ? (
                                <div>Error loading bookings: {bookingsError.message}</div>
                            ) : userBookings.length > 0 ? (
                                <ul>
                                    {userBookings.map(booking => (
                                        <li key={booking.id}>
                                            {/* Display booking details */}
                                            <p>Booking ID: {booking.id}</p>
                                            {/* ... other booking details */}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No bookings found for this user.</p>
                            )}

                            <button onClick={handleCloseView}>Close</button>
                        </div>
                    </div>
                )}
            </main>
            <footer>
                <p>&copy; 2023 Travel Company</p>
            </footer>
        </div>
        </AdminLayout>
    );
};

export default AdminUsers;