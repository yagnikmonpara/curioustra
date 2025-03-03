import React, { useState, useEffect } from 'react';
import '../../../../css/AdminPackages.css';
import AdminLayout from '../../Layouts/AdminLayout';

const AdminPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPackage, setNewPackage] = useState({
        name: '',
        description: '',
        price: '',
        image: null,
    });
    const [isAdding, setIsAdding] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null); // Track which package is being edited

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch('/api/packages'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPackages(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/packages/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setPackages(packages.filter(pkg => pkg.id !== id));
        } catch (err) {
            setError(err);
        }
    };

    const handleInputChange = (e) => {
        setNewPackage({ ...newPackage, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setNewPackage({ ...newPackage, image: e.target.files[0] });
    };

    const handleAddPackage = async () => {
        try {
            const formData = new FormData();
            formData.append('name', newPackage.name);
            formData.append('description', newPackage.description);
            formData.append('price', newPackage.price);
            if (newPackage.image) {
                formData.append('image', newPackage.image);
            }

            const response = await fetch('/api/packages', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newPackageData = await response.json();
            setPackages([...packages, newPackageData]);

            setNewPackage({ name: '', description: '', price: '', image: null });
            setIsAdding(false);

        } catch (error) {
            setError(error);
        }
    };

    const handleEdit = (pkg) => {
        setEditingPackage({ ...pkg }); // Start editing, populate form with package data
    };

    const handleEditInputChange = (e) => {
        setEditingPackage({ ...editingPackage, [e.target.name]: e.target.value });
    };

    const handleEditImageChange = (e) => {
        setEditingPackage({ ...editingPackage, image: e.target.files[0] });
    };

    const handleUpdatePackage = async () => {
        try {
            const formData = new FormData();
            formData.append('name', editingPackage.name);
            formData.append('description', editingPackage.description);
            formData.append('price', editingPackage.price);
            if (editingPackage.image) {
                formData.append('image', editingPackage.image);
            }

            const response = await fetch(`/api/packages/${editingPackage.id}`, {
                method: 'PUT', // Or PATCH, depending on your API
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedPackage = await response.json(); // Get updated package data

            setPackages(
                packages.map((pkg) =>
                    pkg.id === updatedPackage.id ? updatedPackage : pkg
                )
            );

            setEditingPackage(null); // Close edit form

        } catch (error) {
            setError(error);
        }
    };


    if (loading) {
        return <div>Loading packages...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <AdminLayout>
        <div className="admin-packages-page">
            <main className="packages-container">
                {isAdding ? (
                    <div className="add-package-form">
                        <h2>Add New Package</h2>
                        {/* ... (Add form inputs - same as before) */}
                        <button onClick={handleAddPackage}>Add Package</button>
                        <button onClick={() => setIsAdding(false)}>Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setIsAdding(true)}>Add Package</button>
                )}

                {packages.map(pkg => (
                    <div key={pkg.id} className="package-card">
                        {editingPackage && editingPackage.id === pkg.id ? ( // Edit form
                            <div className="edit-package-form">
                                <input type="text" name="name" value={editingPackage.name} onChange={handleEditInputChange} />
                                <textarea name="description" value={editingPackage.description} onChange={handleEditInputChange} />
                                <input type="number" name="price" value={editingPackage.price} onChange={handleEditInputChange} />
                                <input type="file" name="image" onChange={handleEditImageChange} />
                                <button onClick={handleUpdatePackage}>Update</button>
                                <button onClick={() => setEditingPackage(null)}>Cancel</button>
                            </div>
                        ) : ( // Display package details
                            <div>
                                <p>Name: {pkg.name}</p>
                                <p>Description: {pkg.description}</p>
                                <p>Price: ${pkg.price}</p>
                                {pkg.image && <img src={pkg.image} alt={pkg.name} className="package-image" />}
                                <button onClick={() => handleEdit(pkg)}>Edit</button> {/* Edit button */}
                                <button className="delete-button" onClick={() => handleDelete(pkg.id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </main>
        </div>
        </AdminLayout>
    );
};

export default AdminPackages;