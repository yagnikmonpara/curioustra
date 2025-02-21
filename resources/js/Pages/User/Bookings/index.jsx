import React, { useState } from 'react';
import './Bookings.css';

const Bookings = () => {
    const [bookings, setBookings] = useState([]); // Store bookings

    // Sample booking data (replace with actual data fetching)
    const sampleBookings = [
        { type: 'Package', details: { name: 'Adventure Tour', price: '$500', date: '2024-04-01' } },
        { type: 'Hotel', details: { name: 'Luxury Hotel', location: 'Paris', checkIn: '2024-04-10', checkOut: '2024-04-15' } },
        { type: 'Cab', details: { pickup: 'Airport', dropoff: 'Hotel', date: '2024-04-05', time: '10:00 AM' } },
        { type: 'Train', details: { from: 'Mumbai', to: 'Delhi', date: '2024-04-08', arrival: '6:00 PM' } },
        { type: 'Flight', details: { from: 'JFK', to: 'LAX', date: '2024-04-12', time: '11:00 AM' } },
        { type: 'Guide', details: { name: 'John Doe', expertise: 'Hiking', date: '2024-04-18' } },
        // ... more bookings
    ];

    // Function to add a new booking (you'll integrate this with your booking forms)
    const addBooking = (bookingType, bookingDetails) => {
        const newBooking = { type: bookingType, details: bookingDetails };
        setBookings([...bookings, newBooking]); // Add to state
    };

    // Example of how to delete a booking (you'll add this to the UI)
    const deleteBooking = (index) => {
        const updatedBookings = [...bookings];
        updatedBookings.splice(index, 1);
        setBookings(updatedBookings);
    };

    return (
        <div className="bookings-page">
            <header>
                <h1>My Bookings</h1>
            </header>
            <main className="bookings-container">
                {/* Example of a booking section (repeat for other types) */}
                {sampleBookings.map((booking, index) => (
                    <div key={index} className="booking-section">
                        <h2>{booking.type} Booking</h2>
                        {Object.entries(booking.details).map(([key, value]) => (
                            <p key={key}>{key}: {value}</p>
                        ))}
                        <button className="delete-button" onClick={() => deleteBooking(index)}>Delete</button>
                    </div>
                ))}
                {bookings.length === 0 && <p>No bookings yet.</p>}
            </main>
            <footer>
                <p>&copy; 2023 Travel Company</p>
            </footer>
        </div>
    );
};

export default Bookings;