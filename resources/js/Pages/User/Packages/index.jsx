import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { motion } from 'framer-motion';

const Packages = () => {
    // State for packages and search term
    const [search, setSearch] = useState("");

    const packages = [
        {
            id: 1,
            title: "Luxury Beach Resort Experience",
            description: "Indulge in a luxurious beach getaway with world-class amenities, pristine beaches, and unforgettable sunsets. Perfect for couples and families.",
            image: "/images/packege-1.jpg",
            duration: "5D/4N",
            pax: 4,
            location: "Maldives",
            reviews: 128,
            rating: 5,
            price: 1299,
            amenities: ["Spa Access", "Water Sports", "Gourmet Dining"],
            highlights: ["Private Beach", "Sunset Cruise", "Diving"]
        },
        {
            id: 2,
            title: "Amazon Rainforest Adventure",
            description: "Embark on an exciting journey through the Amazon rainforest. Experience wildlife, indigenous cultures, and breathtaking natural wonders.",
            image: "/images/packege-2.jpg",
            duration: "7D/6N",
            pax: 8,
            location: "Brazil",
            reviews: 95,
            rating: 4.8,
            price: 1599,
            amenities: ["Guided Tours", "Eco Lodge", "Local Cuisine"],
            highlights: ["Wildlife Safari", "Tribal Visit", "River Cruise"]
        },
        {
            id: 3,
            title: "Alpine Ski Adventure Package",
            description: "Experience the thrill of skiing in the majestic Alps. Perfect for both beginners and experienced skiers with professional instruction available.",
            image: "/images/packege-3.jpg",
            duration: "6D/5N",
            pax: 6,
            location: "Switzerland",
            reviews: 156,
            rating: 4.9,
            price: 1899,
            amenities: ["Ski Equipment", "Spa Access", "Mountain View"],
            highlights: ["Ski Lessons", "Cable Car", "Snow Activities"]
        },
        {
            id: 4,
            title: "Cultural Heritage Tour",
            description: "Explore the rich history and culture of ancient civilizations. Visit iconic landmarks such as the Acropolis, the Parthenon, and the ancient ruins of Delphi.",
            image: "/images/package-4.png",
            duration: "8D/7N",
            pax: 10,
            location: "Greece",
            reviews: 75,
            rating: 4.7,
            price: 1999,
            amenities: ["Guided Tours", "Cultural Experiences", "Local Cuisine"],
            highlights: ["Acropolis Visit", "Local Festivals", "Cooking Class"]
        }
    ];

    
const PackageCard = ({ pkg }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div 
            className="package-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <figure className="card-banner">
                <img src={pkg.image} alt={pkg.title} loading="lazy" />
                <motion.div 
                    className="image-overlay"
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ul className="highlight-list">
                        {pkg.highlights.map((highlight, index) => (
                            <li key={index}>
                                <ion-icon name="checkmark-circle"></ion-icon>
                                {highlight}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </figure>

            <div className="card-content">
                <h3 className="h3 card-title">{pkg.title}</h3>
                <p className="card-text">{pkg.description}</p>


                <ul className="card-meta-list">
                    <li className="card-meta-item">
                        <div className="meta-box">
                            <ion-icon name="time"></ion-icon>
                            <p className="text">{pkg.duration}</p>
                        </div>
                    </li>

                    <li className="card-meta-item">
                        <div className="meta-box">
                            <ion-icon name="people"></ion-icon>
                            <p className="text">max: {pkg.pax}</p>
                        </div>
                    </li>

                    <li className="card-meta-item">
                        <div className="meta-box">
                            <ion-icon name="location"></ion-icon>
                            <p className="text">{pkg.location}</p>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="card-price">
                <div className="wrapper">
                    <p className="reviews">({pkg.reviews} reviews)</p>

                    <div className="card-rating">
                        {[...Array(5)].map((_, i) => (
                            <ion-icon 
                                key={i} 
                                name={i < Math.floor(pkg.rating) ? "star" : (i < pkg.rating ? "star-half" : "star-outline")}
                            ></ion-icon>
                        ))}
                    </div>
                </div>

                <p className="price">
                    ${pkg.price}
                    <span>/ per person</span>
                </p>

                <div className="action-buttons">
                    <button className="btn btn-secondary" onClick={() => handleBookNow(pkg.id)}>Book Now</button>
                    <button className="btn btn-outline" onClick={() => handleSave(pkg.id)}>
                        <ion-icon name="heart-outline"></ion-icon> Save
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
    // Filter packages based on search term
    const filteredPackages = packages.filter((pkg) =>
        pkg.title.toLowerCase().includes(search.toLowerCase())
    );

    // Function to handle booking
    const handleBookNow = async (packageId) => {

    };

    return (
        <AuthenticatedLayout>
            <Head title="Packages" />

            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="section-subtitle">Exclusive Packages</p>
                    <h2 className="h2 section-title">Popular Travel Packages</h2>
                    <p className="section-text">
                        Discover our handpicked selection of premium travel experiences.
                        From luxury resorts to thrilling adventures, find your perfect getaway.
                    </p>
                </motion.div>
                
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
                <ul className="package-list">
                    {filteredPackages.map((pkg) => (
                        <motion.li 
                            key={pkg.id}
                            style={{ height: "100%" }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: pkg.id * 0.1 }}
                        >
                            <PackageCard pkg={pkg} />
                        </motion.li>
                    ))}
                </ul>
                </div>
            </section>
        </AuthenticatedLayout>
    );
};

export default Packages;
