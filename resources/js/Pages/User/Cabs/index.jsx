import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { motion } from "framer-motion";
import Carousel from "@/Components/Carousel";
import "../../../../css/Cabs.css";

const Cabs = () => {
    const [search, setSearch] = useState("");
    const [selectedCab, setSelectedCab] = useState(null);

    const cabs = [
        {
            id: 1,
            make: "Toyota",
            model: "Camry",
            registration_number: "ABC123",
            driver_name: "John Doe",
            driver_contact_number: "+1234567890",
            capacity: 4,
            price_per_km: 2.5,
            location: "Downtown",
            status: "available",
            images: [
                "/images/cabs/cab-1.jpg",
                "/images/cabs/cab-2.jpg",
                "/images/cabs/cab-3.jpg"
            ]
        },
        {
            id: 2,
            make: "Honda",
            model: "Civic",
            registration_number: "XYZ456",
            driver_name: "Jane Smith",
            driver_contact_number: "+0987654321",
            capacity: 4,
            price_per_km: 2.0,
            location: "Uptown",
            status: "available",
            images: [
                "/images/cabs/cab-4.jpg",
                "/images/cabs/cab-5.jpg",
                "/images/cabs/cab-6.jpg"
            ]
        },
        {
            id: 3,
            make: "Ford",
            model: "Mustang",
            registration_number: "DEF789",
            driver_name: "Alice Johnson",
            driver_contact_number: "+1122334455",
            capacity: 2,
            price_per_km: 3.5,
            location: "Suburb",
            status: "booked",
            images: [
                "/images/cabs/cab-7.jpg",
                "/images/cabs/cab-8.jpg",
                "/images/cabs/cab-9.jpg"
            ]
        },
        {
            id: 4,
            make: "Chevrolet",
            model: "Tahoe",
            registration_number: "GHI012",
            driver_name: "Bob Brown",
            driver_contact_number: "+5566778899",
            capacity: 6,
            price_per_km: 4.0,
            location: "Airport",
            status: "available",
            images: [
                "/images/cabs/cab-10.jpg",
                "/images/cabs/cab-11.jpg",
                "/images/cabs/cab-12.jpg"
            ]
        }
    ];

    const CabCard = ({ cab }) => {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <motion.div
                className="cab-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <figure className="card-banner">
                    <Carousel images={cab.images} />
                    <motion.div
                        className="image-overlay"
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ul className="highlight-list">
                            <li>
                                <ion-icon name="car"></ion-icon>
                                {cab.make} {cab.model}
                            </li>
                            <li>
                                <ion-icon name="people"></ion-icon>
                                Capacity: {cab.capacity}
                            </li>
                            <li>
                                <ion-icon name="cash"></ion-icon>
                                ${cab.price_per_km}/km
                            </li>
                        </ul>
                    </motion.div>
                </figure>

                <div className="card-content">
                    <h3 className="h3 card-title">{cab.make} {cab.model}</h3>
                    <p className="card-text">Driver: {cab.driver_name}</p>

                    <ul className="card-meta-list">
                        <li className="card-meta-item">
                            <div className="meta-box">
                                <ion-icon name="call"></ion-icon>
                                <p className="text">{cab.driver_contact_number}</p>
                            </div>
                        </li>

                        <li className="card-meta-item">
                            <div className="meta-box">
                                <ion-icon name="location"></ion-icon>
                                <p className="text">{cab.location}</p>
                            </div>
                        </li>

                        <li className="card-meta-item">
                            <div className="meta-box">
                                <ion-icon name="time"></ion-icon>
                                <p className="text">Status: {cab.status}</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="card-price">
                    <div className="action-buttons">
                        <button className="btn btn-secondary" onClick={() => setSelectedCab(cab)}>View More</button>
                        <button className="btn btn-outline" onClick={() => handleBookCab(cab.id)}>
                            <ion-icon name="cart-outline"></ion-icon> Book Now
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    const filteredCabs = cabs.filter((cab) =>
        cab.make.toLowerCase().includes(search.toLowerCase()) ||
        cab.model.toLowerCase().includes(search.toLowerCase())
    );

    const handleBookCab = async (cabId) => {
        // Handle booking logic
    };

    return (
        <AuthenticatedLayout>
            <Head title="Cabs" />

            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="section-subtitle">Find Your Ride</p>
                        <h2 className="h2 section-title">Available Cabs</h2>
                        <p className="section-text">
                            Discover our fleet of comfortable and reliable cabs. Book your ride now for a seamless travel experience.
                        </p>
                    </motion.div>

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search Cabs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="cab-list">
                        {filteredCabs.map((cab) => (
                            <motion.div
                                key={cab.id}
                                className="cab-item"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: cab.id * 0.1 }}
                            >
                                <CabCard cab={cab} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {selectedCab && (
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
                                <h3 className="h3 mb-4">{selectedCab.make} {selectedCab.model}</h3>
                                <Carousel images={selectedCab.images} />
                                <ul className="space-y-2 mt-4">
                                    <li><strong>Driver:</strong> {selectedCab.driver_name}</li>
                                    <li><strong>Contact Number:</strong> {selectedCab.driver_contact_number}</li>
                                    <li><strong>Capacity:</strong> {selectedCab.capacity}</li>
                                    <li><strong>Price per KM:</strong> ${selectedCab.price_per_km}</li>
                                    <li><strong>Location:</strong> {selectedCab.location}</li>
                                    <li><strong>Status:</strong> {selectedCab.status}</li>
                                </ul>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-700 dark:text-gray-300">Book your ride now for a comfortable and reliable travel experience.</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button className="btn btn-secondary" onClick={() => handleBookCab(selectedCab.id)}>Book Now</button>
                            <button className="btn btn-outline" onClick={() => setSelectedCab(null)}>Close</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AuthenticatedLayout>
    );
};

export default Cabs;