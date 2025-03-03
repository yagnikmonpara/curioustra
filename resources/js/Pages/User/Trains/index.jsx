import React, { useState } from 'react';
import '../../../../css/Trains.css'; // Import your CSS file

const Trains = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [trains, setTrains] = useState([]);

    const handleSearch = () => {
        // Replace this with your actual API call to fetch train data
        const mockTrains = [
            { id: 1, name: 'Express Train', origin: 'Mumbai', destination: 'Delhi', date: '2024-03-16', arrival: '10:00 AM', price: '$50' },
            { id: 2, name: 'Superfast Train', origin: 'Mumbai', destination: 'Delhi', date: '2024-03-16', arrival: '6:00 PM', price: '$75' },
            { id: 3, name: 'Local Train', origin: 'Delhi', destination: 'Mumbai', date: '2024-03-17', arrival: '12:00 PM', price: '$40' },
            { id: 4, name: 'Rajdhani', origin: 'Delhi', destination: 'Mumbai', date: '2024-03-17', arrival: '8:00 PM', price: '$90' },
            // ... more mock trains
        ];

        const filteredTrains = mockTrains.filter(train =>
            train.origin.toLowerCase().includes(origin.toLowerCase()) &&
            train.destination.toLowerCase().includes(destination.toLowerCase()) &&
            train.date === date
        );

        setTrains(filteredTrains);
    };

    return (
        <div className="trains-page">
            <header>
                <h1>Search Trains</h1>
                <div className="search-inputs">
                    <input
                        type="text"
                        placeholder="Origin"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
            </header>
            <main className="trains-container">
                {trains.length === 0 ? (
                    <p>No trains found.</p>
                ) : (
                    trains.map(train => (
                        <div key={train.id} className="train-card">
                            <p><b>{train.name}</b></p> {/* Display train name */}
                            <p><b>{train.origin}</b> to <b>{train.destination}</b></p>
                            <p>{train.date} - Arrival: {train.arrival}</p> {/* Show arrival time */}
                            <p>Price: {train.price}</p>
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

export default Trains;