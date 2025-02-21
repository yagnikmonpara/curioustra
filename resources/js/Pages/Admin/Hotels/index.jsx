import React, { useState, useEffect } from 'react';
import './AdminHotels.css';

const AdminHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newHotel, setNewHotel] = useState({
        name: '',
        description: '',
        location: '',
        price: '',
        image: null, // For image upload
    });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await fetch('/api/hotels'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setHotels(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/hotels/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setHotels(hotels.filter(hotel => hotel.id !== id));
        } catch (err) {
            setError(err);
        }
    };

    const handleInputChange = (e) => {
        setNewHotel({ ...newHotel, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setNewHotel({ ...newHotel, image: e.target.files[0] });
    };

    const handleAddHotel = async () => {
        try {
            const formData = new FormData();
            formData.append('name', newHotel.name);
            formData.append('description', newHotel.description);
            formData.append('location', newHotel.location);
            formData.append('price', newHotel.price);
            if (newHotel.image) {
                formData.append('image', newHotel.image);
            }

            const response = await fetch('/api/hotels', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newHotelData = await response.json();
            setHotels([...hotels, newHotelData]);

            setNewHotel({ name: '', description: '', location: '', price: '', image: null });
            setIsAdding(false);

        } catch (error) {
            setError(error);
        }
    };

    if (loading) {
        return <div>Loading hotels...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="admin-hotels-page">
            <header>
                <h1>Admin Hotels</h1>
            </header>
            <main className="hotels-container">
                {isAdding ? (
                    <div className="add-hotel-form">
                        <h2>Add New Hotel</h2>
                        <input type="text" name="name" placeholder="Name" value={newHotel.name} onChange={handleInputChange} />
                        <textarea name="description" placeholder="Description" value={newHotel.description} onChange={handleInputChange} />
                        <input type="text" name="location" placeholder="Location" value={newHotel.location} onChange={handleInputChange} />
                        <input type="number" name="price" placeholder="Price" value={newHotel.price} onChange={handleInputChange} />
                        <input type="file" name="image" onChange={handleImageChange} />
                        <button onClick={handleAddHotel}>Add Hotel</button>
                        <button onClick={() => setIsAdding(false)}>Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setIsAdding(true)}>Add Hotel</button>
                )}

                {hotels.map(hotel => (
                    <div key={hotel.id} className="hotel-card">
                        <p>Name: {hotel.name}</p>
                        <p>Description: {hotel.description}</p>
                        <p>Location: {hotel.location}</p>
                        <p>Price: ${hotel.price}</p>
                        {hotel.image && <img src={hotel.image} alt={hotel.name} className="hotel-image" />}
                        <button className="delete-button" onClick={() => handleDelete(hotel.id)}>Delete</button>
                    </div>
                ))}
            </main>
            <footer>
                <p>&copy; 2023 Travel Company</p>
            </footer>
        </div>
    );
};

export default AdminHotels;