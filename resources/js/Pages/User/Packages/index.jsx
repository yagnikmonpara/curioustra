import React, { useState } from "react";

const Packages = () => {
    // State for packages and search term
    const [search, setSearch] = useState("");

    const packages = [
        { id: 1, name: "Package 1", description: "Description 1", price: 100 },
        { id: 2, name: "Package 2", description: "Description 2", price: 200 },
        { id: 3, name: "Package 3", description: "Description 3", price: 300 },
    ];

    // Filter packages based on search term
    const filteredPackages = packages.filter((pkg) =>
        pkg.name.toLowerCase().includes(search.toLowerCase())
    );

    // Function to handle booking
    const handleBookNow = async (packageId) => {

    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Travel Packages</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search Packages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "20px",
                    fontSize: "16px",
                }}
            />

            {/* Package List */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {filteredPackages.map((pkg) => (
                    <div
                        key={pkg.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "20px",
                            width: "300px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <h2>{pkg.name}</h2>
                        <p>{pkg.description}</p>
                        <p>
                            <strong>Price:</strong> ${pkg.price}
                        </p>
                        <button
                            onClick={() => handleBookNow(pkg.id)}
                            style={{
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Book Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Packages;