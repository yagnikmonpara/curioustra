import React, { useState, useEffect } from 'react';
import './AdminFlights.css';

const AdminFlights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newFlight, setNewFlight] = useState({
        origin: '',
        destination: '',
        date: '',
        time: '',
        price: '',
    });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await fetch('/api/flights'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setFlights(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/flights/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setFlights(flights.filter(flight => flight.id !== id));
        } catch (err) {
            setError(err);
        }
    };

    const handleInputChange = (e) => {
        setNewFlight({ ...newFlight, [e.target.name]: e.target.value });
    };

    const handleAddFlight = async () => {
        try {
            const response = await fetch('/api/flights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newFlight),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newFlightData = await response.json();  // Get the new flight data
            setFlights([...flights, newFlightData]); // Add to state

            setNewFlight({ origin: '', destination: '', date: '', time: '', price: '' }); // Clear form
            setIsAdding(false);

        } catch (error) {
            setError(error);
        }
    };

    if (loading) {
        return <div>Loading flights...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="admin-flights-page">
            <header>
                <h1>Admin Flights</h1>
            </header>
            <main className="flights-container">
                {isAdding ? (
                    <div className="add-flight-form">
                        <h2>Add New Flight</h2>
                        <input type="text" name="origin" placeholder="Origin" value={newFlight.origin} onChange={handleInputChange} />
                        <input type="text" name="destination" placeholder="Destination" value={newFlight.destination} onChange={handleInputChange} />
                        <input type="date" name="date" value={newFlight.date} onChange={handleInputChange} />
                        <input type="time" name="time" value={newFlight.time} onChange={handleInputChange} />
                        <input type="number" name="price" placeholder="Price" value={newFlight.price} onChange={handleInputChange} />
                        <button onClick={handleAddFlight}>Add Flight</button>
                        <button onClick={() => setIsAdding(false)}>Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setIsAdding(true)}>Add Flight</button>
                )}

                {flights.map(flight => (
                    <div key={flight.id} className="flight-card">
                        <p>Origin: {flight.origin}</p>
                        <p>Destination: {flight.destination}</p>
                        <p>Date: {flight.date}</p>
                        <p>Time: {flight.time}</p>
                        <p>Price: ${flight.price}</p>
                        <button className="delete-button" onClick={() => handleDelete(flight.id)}>Delete</button>
                    </div>
                ))}
            </main>
            <footer>
                <p>&copy; 2023 Travel Company</p>
            </footer>
        </div>
    );
};

export default AdminFlights;