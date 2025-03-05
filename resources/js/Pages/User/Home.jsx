import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import '../../../css/travel.css';

export default function Home() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };
    
const destinations = [
    {
        id: 1,
        name: 'SAN MIGUEL',
        location: 'ITALY',
        description: 'Fusce hic augue velit wisi ips quibusdam pariatur, iusto.',
        image: '/images/popular-1.jpg',
        rating: 5
    },
    {
        id: 2,
        name: 'BURJ KHALIFA',
        location: 'DUBAI',
        description: 'Fusce hic augue velit wisi ips quibusdam pariatur, iusto.',
        image: '/images/popular-2.jpg',
        rating: 5,
        price: '$799',
        duration: '7 Days'
    },
    {
        id: 3,
        name: 'KYOTO TEMPLE',
        location: 'JAPAN',
        description: 'Fusce hic augue velit wisi ips quibusdam pariatur, iusto.',
        image: '/images/popular-3.jpg',
        rating: 5,
        price: '$699',
        duration: '6 Days'
    }
];

const RatingStars = ({ rating }) => {
    return (
        <motion.div 
            className="rating"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
        >
            {[...Array(rating)].map((_, index) => (
                <motion.span 
                    key={index}
                    className="star"
                    variants={{
                        hidden: { opacity: 0, scale: 0, rotate: -180 },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                            transition: {
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                            }
                        }
                    }}
                >
                    ★
                </motion.span>
            ))}
        </motion.div>
    );
};

const DestinationCard = ({ destination }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div 
            className="popular-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                }
            }}
            viewport={{ once: true, margin: "-100px" }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <motion.div 
                className="image-container"
                animate={{
                    scale: isHovered ? 1.02 : 1
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
            >
                <motion.img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="popular-img"
                    animate={{
                        scale: isHovered ? 1.1 : 1
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }}
                />
                <motion.div 
                    className="popular-content"
                    animate={{
                        backgroundColor: isHovered ? "rgba(0, 0, 0, 0.15)" : "rgba(0, 0, 0, 0.2)",
                        backdropFilter: isHovered ? "blur(4px)" : "blur(2px)",
                        y: isHovered ? 0 : 20
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }}
                >
                    <motion.div 
                        className="card-top"
                        animate={{
                            y: isHovered ? 0 : 10,
                            opacity: isHovered ? 1 : 0.9
                        }}
                    >
                        <motion.div className="location-wrapper">
                            <motion.h3 
                                className="location"
                                animate={{
                                    scale: isHovered ? 1.05 : 1,
                                    y: isHovered ? -5 : 0
                                }}
                            >
                                {destination.location}
                            </motion.h3>
                        </motion.div>
                        <RatingStars rating={destination.rating} />
                    </motion.div>

                    <motion.div
                        animate={{
                            y: isHovered ? 0 : 10,
                            opacity: isHovered ? 1 : 0.9
                        }}
                    >
                        <motion.h2 
                            className="destination-name"
                            animate={{
                                scale: isHovered ? 1.05 : 1,
                                letterSpacing: isHovered ? "1px" : "0.5px"
                            }}
                        >
                            {destination.name}
                        </motion.h2>
                        <motion.p 
                            className="destination-desc"
                            animate={{
                                opacity: isHovered ? 1 : 0.8,
                                y: isHovered ? 0 : 5
                            }}
                        >
                            {destination.description}
                        </motion.p>
                        
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};


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
                    <button className="btn btn-secondary">Book Now</button>
                    <button className="btn btn-outline">
                        <ion-icon name="heart-outline"></ion-icon>
                        Save
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Transportation Modes Data
const transportationModes = [
    {
        id: 1,
        title: "Cars",
        description: "Explore the world at your own pace with our wide range of car rentals. Perfect for road trips and city tours.",
        image: "/images/cab.png",
        link: "/cars"
    },
    {
        id: 2,
        title: "Trains",
        description: "Travel comfortably and efficiently with our train services. Enjoy scenic routes and hassle-free journeys.",
        image: "/images/train.png",
        link: "/trains"
    },
    {
        id: 3,
        title: "Flights",
        description: "Fly to your dream destinations with our premium flight options. Fast, reliable, and convenient.",
        image: "/images/flight.png",
        link: "/flights"
    }
];

// Transportation Card Component
const TransportationCard = ({ mode }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div 
            className="transportation-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            onClick={() => window.location.href = mode.link}
            style={{ cursor: "pointer" }}
        >
            <motion.div 
                className="image-container"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <img src={mode.image} alt={mode.title} className="transportation-img" />
                <motion.div 
                    className="image-overlay"
                    animate={{ opacity: isHovered ? 0.8 : 0 }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>

            <motion.div 
                className="content"
                animate={{ y: -250 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <h3 className="title">{mode.title}</h3>
                <p className="description">{mode.description}</p>

                <motion.button
                    className="cta-button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1 , y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Explore {mode.title}
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

    return (
        <>
        <AuthenticatedLayout>
            <Head title="Home" />

            {/* Popular Destinations Section */}
            <section className="py-16 bg-gray-800">
                <div className="container mx-auto px-4">
                <motion.p 
                    className="section-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ marginTop: "3rem" }}
                >
                    
                    UNCOVER PLACE
                </motion.p>
                
                <motion.h2 
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    POPULAR DESTINATION
                </motion.h2>

                <motion.p 
                    className="section-text"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    Fusce hic augue velit wisi quibusdam pariatur, iusto primis, nec nemo, rutrum. 
                    Vestibulum cumque laudantium. Sit ornare mollitia tenetur, aptent.
                </motion.p>

                <motion.div 
                    className="popular-grid"
                    style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", marginTop: "2rem" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    {destinations.map((destination) => (
                        <DestinationCard key={destination.id} destination={destination} />
                    ))}
                </motion.div>

                <motion.div 
                    className="btn-container"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                >
                    <motion.button 
                        className="btn btn-success"
                        whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 8px 25px rgba(37, 99, 235, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        style={{ marginBottom: "3rem" }}
                    >
                        <Link href="/destinations">MORE DESTINATION</Link>
                    </motion.button>
                </motion.div>
                </div>
            </section>

            {/* Featured Packages Section */}
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

                <ul className="package-list">
                    {packages.map((pkg) => (
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

                <div className="flex justify-center">
                    <motion.button 
                        className="btn btn-success mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ marginTop: "3rem" }}
                    >
                        <Link href="/packages">MORE PACKAGES</Link>
                    </motion.button>
                </div>
                </div>
            </section>

            {/* Travel Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="section-header">
                        <p className="section-subtitle">Choose Your Mode</p>
                        <h2 className="h2 section-title">Travel with Ease</h2>
                        <p className="section-text">
                            Select your preferred mode of transportation and embark on your next adventure.
                        </p>
                    </div>

                    <div className="transportation-grid"> {/* No motion.div here */}
                        {transportationModes.map((mode) => (
                            <TransportationCard key={mode.id} mode={mode} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">Contact Us</h2>
                    <div className="max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border h-32 resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                ></textarea>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Send Message
                            </motion.button>
                        </form>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
        </>
    );
}
