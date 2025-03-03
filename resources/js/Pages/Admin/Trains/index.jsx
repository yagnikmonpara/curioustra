import React, { useState, useEffect } from 'react';
import '../../../../css/AdminTrains.css';
import AdminLayout from '../../Layouts/AdminLayout';

const AdminTrains = () => {
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTrain, setNewTrain] = useState({
        name: '',
        origin: '',
        destination: '',
        date: '',
        arrival: '', // Added arrival time
        price: '',
    });
    const [isAdding, setIsAdding] = useState(false);
    const [editingTrain, setEditingTrain] = useState(null);

    useEffect(() => {
        const fetchTrains = async () => {
            try {
                const response = await fetch('/api/trains'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTrains(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrains();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/trains/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setTrains(trains.filter(train => train.id !== id));
        } catch (err) {
            setError(err);
        }
    };

    const handleInputChange = (e) => {
        setNewTrain({ ...newTrain, [e.target.name]: e.target.value });
    };

    const handleAddTrain = async () => {
        try {
            const response = await fetch('/api/trains', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTrain),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newTrainData = await response.json();
            setTrains([...trains, newTrainData]);

            setNewTrain({ name: '', origin: '', destination: '', date: '', arrival: '', price: '' });
            setIsAdding(false);

        } catch (error) {
            setError(error);
        }
    };

    const handleEdit = (train) => {
        setEditingTrain({ ...train });
    };

    const handleEditInputChange = (e) => {
        setEditingTrain({ ...editingTrain, [e.target.name]: e.target.value });
    };

    const handleUpdateTrain = async () => {
        try {
            const response = await fetch(`/api/trains/${editingTrain.id}`, {
                method: 'PUT', // Or PATCH
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingTrain),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedTrain = await response.json();

            setTrains(
                trains.map(train =>
                    train.id === updatedTrain.id ? updatedTrain : train
                )
            );

            setEditingTrain(null);

        } catch (error) {
            setError(error);
        }
    };


    if (loading) {
        return <div>Loading trains...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <AdminLayout>
        <div className="admin-trains-page">
            <header>
                <h1>Admin Trains</h1>
            </header>
            <main className="trains-container">
                {isAdding ? (
                    <div className="add-train-form">
                        <h2>Add New Train</h2>
                        <input type="text" name="name" placeholder="Name" value={newTrain.name} onChange={handleInputChange} />
                        <input type="text" name="origin" placeholder="Origin" value={newTrain.origin} onChange={handleInputChange} />
                        <input type="text" name="destination" placeholder="Destination" value={newTrain.destination} onChange={handleInputChange} />
                        <input type="date" name="date" value={newTrain.date} onChange={handleInputChange} />
                        <input type="time" name="arrival" placeholder="Arrival Time" value={newTrain.arrival} onChange={handleInputChange} />
                        <input type="number" name="price" placeholder="Price" value={newTrain.price} onChange={handleInputChange} />
                        <button onClick={handleAddTrain}>Add Train</button>
                        <button onClick={() => setIsAdding(false)}>Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setIsAdding(true)}>Add Train</button>
                )}

                {trains.map(train => (
                    <div key={train.id} className="train-card">
                        {editingTrain && editingTrain.id === train.id ? (
                            <div className="edit-train-form">
                                <input type="text" name="name" value={editingTrain.name} onChange={handleEditInputChange} />
                                <input type="text" name="origin" value={editingTrain.origin} onChange={handleEditInputChange} />
                                <input type="text" name="destination" value={editingTrain.destination} onChange={handleEditInputChange} />
                                <input type="date" name="date" value={editingTrain.date} onChange={handleEditInputChange} />
                                <input type="time" name="arrival" value={editingTrain.arrival} onChange={handleEditInputChange} />
                                <input type="number" name="price" value={editingTrain.price} onChange={handleEditInputChange} />
                                <button onClick={handleUpdateTrain}>Update</button>
                                <button onClick={() => setEditingTrain(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <p>Name: {train.name}</p>
                                <p>Origin: {train.origin}</p>
                                <p>Destination: {train.destination}</p>
                                <p>Date: {train.date}</p>
                                <p>Arrival: {train.arrival}</p>
                                <p>Price: ${train.price}</p>
                                <button onClick={() => handleEdit(train)}>Edit</button>
                                <button className="delete-button" onClick={() => handleDelete(train.id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </main>
            <footer>
                <p>&copy; 2023 Travel Company</p>
            </footer>
        </div>
        </AdminLayout>
    );
};

export default AdminTrains;