import React, { useState, useEffect } from 'react';
import './AdminDestinations.css';

const AdminDestinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newDestination, setNewDestination] = useState({  // State for new destination
        name: '',
        description: '',
        price: '',
        image: null, // For image upload
    });
    const [isAdding, setIsAdding] = useState(false); // Track adding state

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await fetch('/api/destinations'); // Replace with your actual API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setDestinations(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/destinations/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setDestinations(destinations.filter(dest => dest.id !== id));
        } catch (err) {
            setError(err);
        }
    };

    const handleInputChange = (e) => {
        setNewDestination({ ...newDestination, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setNewDestination({ ...newDestination, image: e.target.files[0] });
    };

    const handleAddDestination = async () => {
        try {
            const formData = new FormData();
            formData.append('name', newDestination.name);
            formData.append('description', newDestination.description);
            formData.append('price', newDestination.price);
            if (newDestination.image) {
                formData.append('image', newDestination.image);
            }

            const response = await fetch('/api/destinations', { // POST request
                method: 'POST',
                body: formData, // Send form data
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newDest = await response.json(); // Get the newly created destination from the server
            setDestinations([...destinations, newDest]); // Update state with the new destination

            // Clear the form and close the "add" section
            setNewDestination({ name: '', description: '', price: '', image: null });
            setIsAdding(false);

        } catch (error) {
            setError(error);
        }
    };



    if (loading) {
        return <div>Loading destinations...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="admin-destinations-page">
            <header>
                <h1>Admin Destinations</h1>
            </header>
            <main className="destinations-container">

                {/* Add Destination Form */}
                {isAdding ? (
                    <div className="add-destination-form">
                        <h2>Add New Destination</h2>
                        <input type="text" name="name" placeholder="Name" value={newDestination.name} onChange={handleInputChange} />
                        <textarea name="description" placeholder="Description" value={newDestination.description} onChange={handleInputChange} />
                        <input type="number" name="price" placeholder="Price" value={newDestination.price} onChange={handleInputChange} />
                        <input type="file" name="image" onChange={handleImageChange} /> {/* Image upload */}
                        <button onClick={handleAddDestination}>Add Destination</button>
                        <button onClick={() => setIsAdding(false)}>Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setIsAdding(true)}>Add Destination</button>
                )}

                {/* Existing Destinations */}
                {destinations.map(dest => (
                    <div key={dest.id} className="destination-card">
                        <p>Name: {dest.name}</p>
                        <p>Description: {dest.description}</p>
                        <p>Price: ${dest.price}</p>
                        {/* Display image if available */}
                        {dest.image && <img src={dest.image} alt={dest.name} className="destination-image" />}
                        <button className="delete-button" onClick={() => handleDelete(dest.id)}>Delete</button>
                    </div>
                ))}
            </main>
            <footer>
                <p>&copy; 2023 Travel Company</p>
            </footer>
        </div>
    );
};

export default AdminDestinations;