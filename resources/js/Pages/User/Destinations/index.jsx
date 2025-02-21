import React, { useState } from 'react';
import '../../../../css/Destinations.css'; // Import CSS file

const Destinations = () => {
    const [search, setSearch] = useState('');

    const destinations = [
        { id: 1, name: 'Paris', description: 'City of Lights, romance, and iconic landmarks.', price: 1200, image: '/paris.jpg' },
        { id: 2, name: 'Tokyo', description: 'A vibrant blend of tradition and modernity.', price: 1500, image: '/tokyo.jpg' },
        { id: 3, name: 'New York City', description: 'The Big Apple, a melting pot of cultures and experiences.', price: 1000, image: '/nyc.jpg' },
        { id: 4, name: 'Machu Picchu', description: 'Ancient Inca citadel nestled high in the Andes Mountains.', price: 900, image: '/machu.jpg' },
        { id: 5, name: 'Serengeti National Park', description: 'Witness the Great Migration and incredible wildlife safaris.', price: 1800, image: '/serengeti.jpg' },
        //... more destinations
    ];

    const filteredDestinations = destinations.filter(dest =>
        dest.name.toLowerCase().includes(search.toLowerCase())
    );

    const bookDestination = (id) => {
        // Implement your booking logic here
        console.log(`Booking destination with ID: ${id}`);
    };

    return (
        <div className="destinations-page">
            <header>
                <h1>Explore Destinations</h1>
                <input
                    type="text"
                    placeholder="Search destinations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </header>
            <main className="destinations-container">
                {filteredDestinations.map(dest => (
                    <div key={dest.id} className="destination-card">
                        <img src={dest.image} alt={dest.name} className="destination-image" />
                        <div className="destination-content">
                            <h2 className="destination-title">{dest.name}</h2>
                            <p className="destination-description">{dest.description}</p>
                            <p className="destination-price">${dest.price}</p>
                            <button className="book-button" onClick={() => bookDestination(dest.id)}>Book Now</button>
                        </div>
                    </div>
                ))}
                {filteredDestinations.length === 0 && <p className="no-destinations">No destinations found.</p>}
            </main>
            <footer>
                <p>&copy; 2023 Travel Company</p>
            </footer>
        </div>
    );
};

export default Destinations;