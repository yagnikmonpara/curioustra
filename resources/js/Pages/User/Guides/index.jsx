import React, { useState } from 'react';
import '../../../../css/Guides.css'; // Import your CSS file

const Guides = () => {
    const [search, setSearch] = useState('');

    const guides = [
        {
            id: 1,
            name: 'John Doe',
            expertise: 'Hiking, Trekking',
            experience: '10 years',
            bio: 'Experienced mountain guide with a passion for sharing the beauty of nature.',
            image: '/guide1.jpg', // Replace with your image path
        },
        {
            id: 2,
            name: 'Jane Smith',
            expertise: 'City Tours, Historical Sites',
            experience: '5 years',
            bio: 'Knowledgeable and enthusiastic guide specializing in city tours and historical landmarks.',
            image: '/guide2.jpg', // Replace with your image path
        },
        {
            id: 3,
            name: 'David Lee',
            expertise: 'Wildlife Safaris, Nature Photography',
            experience: '7 years',
            bio: 'Expert in wildlife safaris and nature photography, dedicated to providing unforgettable experiences.',
            image: '/guide3.jpg', // Replace with your image path
        },
        // ... more guides
    ];

    const filteredGuides = guides.filter(guide =>
        guide.name.toLowerCase().includes(search.toLowerCase()) ||
        guide.expertise.toLowerCase().includes(search.toLowerCase()) // Search by expertise too
    );

    return (
        <div className="guides-page">
            <header>
                <h1>Meet Our Guides</h1>
                <input
                    type="text"
                    placeholder="Search guides..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </header>
            <main className="guides-container">
                {filteredGuides.map(guide => (
                    <div key={guide.id} className="guide-card">
                        <img src={guide.image} alt={guide.name} className="guide-image" />
                        <div className="guide-content">
                            <h2 className="guide-name">{guide.name}</h2>
                            <p className="guide-expertise">Expertise: {guide.expertise}</p>
                            <p className="guide-experience">Experience: {guide.experience}</p>
                            <p className="guide-bio">{guide.bio}</p>
                            <button className="contact-button">Contact</button> {/* Contact button */}
                        </div>
                    </div>
                ))}
                {filteredGuides.length === 0 && <p className="no-guides">No guides found.</p>}
            </main>
        </div>
    );
};

export default Guides;