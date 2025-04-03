import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { motion } from "framer-motion";
import Carousel from "@/Components/Carousel";
import "../../../../css/Destinations.css"

const Destinations = ({destinations}) => {
    const [search, setSearch] = useState("");
    const [selectedDestination, setSelectedDestination] = useState(null);

    const DestinationCard = ({ destination }) => {
        const [isHovered, setIsHovered] = useState(false);
    
        return (
            <motion.div
                className="popular-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <motion.div
                    className="image-container"
                    animate={{ scale: isHovered ? 1.02 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <motion.img
                        src={destination.images[0]}
                        alt={destination.name}
                        className="popular-img"
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <motion.div
                        className="popular-content"
                        animate={{
                            backgroundColor: isHovered ? "rgba(0, 0, 0, 0.15)" : "rgba(0, 0, 0, 0.2)",
                            backdropFilter: isHovered ? "blur(4px)" : "blur(2px)",
                            y: isHovered ? 0 : 20,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <motion.div
                            className="card-top"
                            animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.9 }}
                        >
                            <motion.div className="location-wrapper">
                                <motion.h3
                                    className="location"
                                    animate={{ scale: isHovered ? 1.05 : 1, y: isHovered ? -5 : 0 }}
                                >
                                    {destination.location}
                                </motion.h3>
                                <motion.span
                                    className="duration"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                                >
                                    {destination.duration}
                                </motion.span>
                            </motion.div>
                            <RatingStars rating={destination.rating} />
                        </motion.div>
    
                        <motion.div animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.9 }}>
                            <motion.h2
                                className="destination-name"
                                animate={{ scale: isHovered ? 1.05 : 1, letterSpacing: isHovered ? "1px" : "0.5px" }}
                            >
                                {destination.name}
                            </motion.h2>
                            <motion.p
                                className="destination-desc"
                                animate={{ opacity: isHovered ? 1 : 0.8, y: isHovered ? 0 : 5 }}
                            >
                                {destination.description}
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        );
    };

    const RatingStars = ({ rating }) => {
        const numberOfStars = Math.min(Math.floor(rating), 5);

        return (
            <motion.div
                className="rating"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                    }
                }}
            >
                {[...Array(numberOfStars)].map((_, index) => (
                    <motion.span
                        key={index}
                        className="star text-yellow-400"
                        variants={{
                            hidden: { opacity: 0, scale: 0 },
                            visible: {
                                opacity: 1,
                                scale: 1,
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

    const filteredDestinations = destinations.filter((destination) =>
        destination.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Destinations" />

            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="section-subtitle">Explore the World</p>
                        <h2 className="h2 section-title">Popular Destinations</h2>
                        <p className="section-text">
                            Discover our handpicked selection of stunning destinations. From tropical
                            beaches to historic cities, find your next adventure.
                        </p>
                    </motion.div>

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search Destinations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="destination-grid">
                        {filteredDestinations.map((destination) => (
                            <motion.div
                                key={destination.id}
                                className="destination-item"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: destination.id * 0.1 }}
                            >
                                <DestinationCard destination={destination} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {selectedDestination && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <h3 className="h3 mb-4">{selectedDestination.name}</h3>
                                <Carousel images={selectedDestination.images} />
                                <ul className="space-y-2 mt-4">
                                    <li><strong>Location:</strong> {selectedDestination.location}</li>
                                    <li><strong>Country:</strong> {selectedDestination.country}</li>
                                    <li><strong>Rating:</strong> {selectedDestination.rating}</li>
                                </ul>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-700 dark:text-gray-300">{selectedDestination.description}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button className="btn btn-outline" onClick={() => setSelectedDestination(null)}>Close</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AuthenticatedLayout>
    );
};

export default Destinations;