import React, { useState, useEffect } from 'react';
import './AdminGuides.css';

const AdminGuides = () => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newGuide, setNewGuide] = useState({
        name: '',
        expertise: '',
        experience: '',
        bio: '',
        image: null,
    });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await fetch('/api/guides'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setGuides(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGuides();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/guides/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setGuides(guides.filter(guide => guide.id !== id));
        } catch (err) {
            setError(err);
        }
    };

    const handleInputChange = (e) => {
        setNewGuide({ ...newGuide, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setNewGuide({ ...newGuide, image: e.target.files[0] });
    };

    const handleAddGuide = async () => {
        try {
            const formData = new FormData();
            formData.append('name', newGuide.name);
            formData.append('expertise', newGuide.expertise);
            formData.append('experience', newGuide.experience);
            formData.append('bio', newGuide.bio);
            if (newGuide.image) {
                formData.append('image', newGuide.image);
            }

            const response = await fetch('/api/guides', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newGuideData = await response.json();
            setGuides([...guides, newGuideData]);

            setNewGuide({ name: '', expertise: '', experience: '', bio: '', image: null });
            setIsAdding(false);

        } catch (error) {
            setError(error);
        }
    };

    if (loading) {
        return <div>Loading guides...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="admin-guides-page">
            <header>
                <h1>Admin Guides</h1>
            </header>
            <main className="guides-container">
                {isAdding ? (
                    <div className="add-guide-form">
                        <h2>Add New Guide</h2>
                        <input type="text" name="name" placeholder="Name" value={newGuide.name} onChange={handleInputChange} />
                        <input type="text" name="expertise" placeholder="Expertise" value={newGuide.expertise} onChange={handleInputChange} />
                        <input type="text" name="experience" placeholder="Experience" value={newGuide.experience} onChange={handleInputChange} />
                        <textarea name="bio" placeholder="Bio" value={newGuide.bio} onChange={handleInputChange} />
                        <input type="file" name="image" onChange={handleImageChange} />
                        <button onClick={handleAddGuide}>Add Guide</button>
                        <button onClick={() => setIsAdding(false)}>Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setIsAdding(true)}>Add Guide</button>
                )}

                {guides.map(guide => (
                    <div key={guide.id} className="guide-card">
                        <p>Name: {guide.name}</p>
                        <p>Expertise: {guide.expertise}</p>
                        <p>Experience: {guide.experience}</p>
                        <p>Bio: {guide.bio}</p>
                        {guide.image && <img src={guide.image} alt={guide.name} className="guide-image" />} {/* Display image */}
                        <button className="delete-button" onClick={() => handleDelete(guide.id)}>Delete</button>
                    </div>
                ))}
            </main>
            <footer>
                <p>&copy; 2023 Travel Company</p>
            </footer>
        </div>
    );
};

export default AdminGuides;