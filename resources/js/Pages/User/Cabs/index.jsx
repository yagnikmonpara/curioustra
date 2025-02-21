import React, { useState } from 'react';
import './Cabs.css';

const Cabs = () => {
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState(''); // Added time state
    const [cabs, setCabs] = useState([]);

    const handleSearch = () => {
        // Replace this with your actual API call to fetch cab data
        const mockCabs = [
            { id: 1, type: 'Sedan', pickup: 'City Center', dropoff: 'Airport', date: '2024-03-17', time: '10:00 AM', price: '$25' },
            { id: 2, type: 'SUV', pickup: 'City Center', dropoff: 'Airport', date: '2024-03-17', time: '10:00 AM', price: '$40' },
            { id: 3, type: 'Sedan', pickup: 'Airport', dropoff: 'Hotel', date: '2024-03-17', time: '2:00 PM', price: '$30' },
            { id: 4, type: 'Luxury', pickup: 'Hotel', dropoff: 'Mall', date: '2024-03-18', time: '11:00 AM', price: '$50' },
            // ... more mock cabs
        ];

        const filteredCabs = mockCabs.filter(cab =>
            cab.pickup.toLowerCase().includes(pickup.toLowerCase()) &&
            cab.dropoff.toLowerCase().includes(dropoff.toLowerCase()) &&
            cab.date === date &&
            cab.time === time // Filter by time as well
        );

        setCabs(filteredCabs);
    };

    return (
        <div className="cabs-page">
            <header>
                <h1>Book a Cab</h1>
                <div className="search-inputs">
                    <input
                        type="text"
                        placeholder="Pickup Location"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Dropoff Location"
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <input  // Time input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
            </header>
            <main className="cabs-container">
                {cabs.length === 0 ? (
                    <p>No cabs found.</p>
                ) : (
                    cabs.map(cab => (
                        <div key={cab.id} className="cab-card">
                            <p><b>{cab.type}</b></p> {/* Cab type */}
                            <p><b>{cab.pickup}</b> to <b>{cab.dropoff}</b></p>
                            <p>{cab.date} - {cab.time}</p>
                            <p>Price: {cab.price}</p>
                            <button className="book-button">Book Now</button>
                        </div>
                    ))
                )}
            </main>
            <footer>
                <p>&copy; 2023 Travel Company</p>
            </footer>
        </div>
    );
};

export default Cabs;