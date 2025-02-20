import React, { useState } from 'react';

const Packages = () => {
    const [search, setSearch] = useState('');
    
    const packages = [
        { id: 1, name: 'Package 1', description: 'Description 1', price: 100 },
        { id: 2, name: 'Package 2', description: 'Description 2', price: 200 },
        { id: 3, name: 'Package 3', description: 'Description 3', price: 300 },
    ];

    const filteredPackages = packages.filter(pkg =>
        pkg.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Search packages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {filteredPackages.map(pkg => (
                <div key={pkg.id}>
                    <h2>{pkg.name}</h2>
                    <p>{pkg.description}</p>
                    <p>${pkg.price}</p>
                    <button onClick={() => bookPackage(pkg.id)}>Book Now</button>
                </div>
            ))}
        </div>
    );
};

export default Packages;