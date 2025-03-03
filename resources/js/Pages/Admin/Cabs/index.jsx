import React, { useState, useEffect } from 'react';
import '../../../../css/AdminCabs.css';
import AdminLayout from '../../Layouts/AdminLayout';

const AdminCabs = () => {
    const [cabs, setCabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCabs = async () => {
            try {
                const response = await fetch('/api/cabs'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCabs(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCabs();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/cabs/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Remove the cab from the state
            setCabs(cabs.filter(cab => cab.id !== id));
        } catch (err) {
            setError(err);
        }
    };


    if (loading) {
        return <div>Loading cabs...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <AdminLayout>
        <div className="admin-cabs-page">
            <header>
                <h1>Admin Cabs</h1>
            </header>
            <main className="cabs-container">
                {cabs.map(cab => (
                    <div key={cab.id} className="cab-card">
                        <p>Type: {cab.type}</p>
                        <p>Pickup: {cab.pickup}</p>
                        <p>Dropoff: {cab.dropoff}</p>
                        <p>Date: {cab.date}</p>
                        <p>Time: {cab.time}</p>
                        <p>Price: {cab.price}</p>
                        <button className="delete-button" onClick={() => handleDelete(cab.id)}>Delete</button>
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

export default AdminCabs;