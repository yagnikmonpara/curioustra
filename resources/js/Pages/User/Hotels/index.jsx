import React from 'react';
import '../../../../css/Hotels.css'; // Create a Hotels.css file for styling

const hotelsData = [ // Sample hotel data (replace with API fetch later)
    {
        image: 'hotel1.jpg',
        name: 'Hotel Paradise',
        description: 'Luxury hotel with stunning views.',
        price: '$299/night',
    },
    {
        image: 'hotel2.jpg',
        name: 'City Center Hotel',
        description: 'Conveniently located in the heart of the city.',
        price: '$199/night',
    },
    {
        image: 'hotel3.jpg',
        name: 'Budget Inn',
        description: 'Affordable and comfortable accommodations.',
        price: '$99/night',
    },
];

const Hotels = () => {
    return (
        <div className="hotels-page">
            <div className="hotel-container">
                {hotelsData.map((hotel, index) => (
                    <div key={index} className="hotel-card">
                        <img src={hotel.image} alt={hotel.name} />
                        <div className="hotel-card-content">
                            <h3>{hotel.name}</h3>
                            <p>{hotel.description}</p>
                            <p className="price">{hotel.price}</p>
                            <button>Book Now</button>
                        </div>
                    </div>
                ))}
            </div>
        
        </div>
    );
};

export default Hotels;