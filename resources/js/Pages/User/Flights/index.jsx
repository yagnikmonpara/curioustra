import React, { useState } from 'react';
import '../../../../css/Flights.css'; // Import your CSS file

const Flights = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState(''); // Store the date
    const [flights, setFlights] = useState([]); // Store fetched flights

    const handleSearch = () => {
        // In a real application, you would make an API call here.
        // For this example, we'll use mock data.

        const mockFlights = [
            { id: 1, origin: 'JFK', destination: 'LAX', date: '2024-03-15', time: '8:00 AM', price: '$250' },
            { id: 2, origin: 'JFK', destination: 'LAX', date: '2024-03-15', time: '12:00 PM', price: '$300' },
            { id: 3, origin: 'LAX', destination: 'JFK', date: '2024-03-16', time: '9:30 AM', price: '$275' },
            { id: 4, origin: 'SFO', destination: 'JFK', date: '2024-03-17', time: '11:00 AM', price: '$320' },
            // ... more mock flights
        ];

        // Filter flights based on search criteria
        const filteredFlights = mockFlights.filter(flight =>
            flight.origin.toLowerCase().includes(origin.toLowerCase()) &&
            flight.destination.toLowerCase().includes(destination.toLowerCase()) &&
            flight.date === date  // Filter by date
        );
        setFlights(filteredFlights); // Update the flights state
    };

    return (
        <div className="flights-page">
            <header>
                <h1>Search Flights</h1>
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
                        type="date" // Use type="date" for date input
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
            </header>
            <main className="flights-container">
                {flights.length === 0 ? (
                    <p>No flights found.</p>
                ) : (
                    flights.map(flight => (
                        <div key={flight.id} className="flight-card">
                            <p><b>{flight.origin}</b> to <b>{flight.destination}</b></p>
                            <p>{flight.date} - {flight.time}</p>
                            <p>Price: {flight.price}</p>
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

export default Flights;