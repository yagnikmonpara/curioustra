import React, { useState, useEffect } from 'react';
import '../../../../css/AdminBookings.css';
import AdminLayout from '../../Layouts/AdminLayout';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Replace with your actual API call to fetch bookings
        const fetchBookings = async () => {
            try {
                const response = await fetch('/api/bookings'); // Example API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBookings(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []); // Empty dependency array ensures this runs only once on mount

    const handleConfirm = async (id) => {
        try {
            const response = await fetch(`/api/bookings/${id}/confirm`, {
                method: 'PUT', // Or PATCH, depending on your API
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Update the booking status in the state
            setBookings(bookings.map(booking =>
                booking.id === id ? { ...booking, status: 'confirmed' } : booking
            ));
        } catch (err) {
            setError(err);
        }
    };

    const handleCancel = async (id) => {
        try {
            const response = await fetch(`/api/bookings/${id}/cancel`, {
                method: 'PUT', // Or PATCH
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Update the booking status in the state
            setBookings(bookings.map(booking =>
                booking.id === id ? { ...booking, status: 'cancelled' } : booking
            ));
        } catch (err) {
            setError(err);
        }
    };

    if (loading) {
        return <div>Loading bookings...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <AdminLayout>
        <div className="admin-bookings-page">
            <header>
                <h1>Admin Bookings</h1>
            </header>
            <main className="bookings-container">
                {bookings.map(booking => (
                    <div key={booking.id} className="booking-card">
                        {/* Display booking details */}
                        <p>Type: {booking.type}</p>
                        {/* ... other details */}
                        <p>Status: {booking.status || 'pending'}</p> {/* Display status */}
                        <div className="button-group">
                            <button onClick={() => handleConfirm(booking.id)} disabled={booking.status !== undefined && booking.status !== 'pending'}>
                                Confirm
                            </button>
                            <button onClick={() => handleCancel(booking.id)} disabled={booking.status !== undefined && booking.status !== 'pending'}>
                                Cancel
                            </button>
                        </div>
                    </div>
                ))}
            </main>
        </div>
        </AdminLayout>
    );
};