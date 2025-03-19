import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { motion } from "framer-motion";
import Carousel from "@/Components/Carousel";
import "../../../../css/Hotels.css";

const Hotels = () => {
    const [search, setSearch] = useState("");
    const [selectedHotel, setSelectedHotel] = useState(null);

    const hotels = [
        {
            id: 1,
            name: "Luxury Beach Resort",
            description: "A luxurious beachfront resort offering world-class amenities and stunning ocean views.",
            address: "123 Beach Road",
            city: "Bali",
            country: "Indonesia",
            stars: 5,
            price_per_night: 300,
            amenities: ["Spa", "Pool", "Restaurant", "Free Wi-Fi"],
            images: [
                "/images/hotels/hotel-1.jpg",
                "/images/hotels/hotel-2.jpg",
                "/images/hotels/hotel-3.jpg"
            ]
        },
        {
            id: 2,
            name: "Mountain View Lodge",
            description: "A cozy lodge nestled in the mountains, perfect for nature lovers and adventurers.",
            address: "456 Mountain Road",
            city: "Switzerland",
            country: "Switzerland",
            stars: 4,
            price_per_night: 200,
            amenities: ["Spa", "Restaurant", "Free Wi-Fi", "Hiking Trails"],
            images: [
                "/images/hotels/hotel-4.jpg",
                "/images/hotels/hotel-5.jpg",
                "/images/hotels/hotel-6.jpg"
            ]
        },
        {
            id: 3,
            name: "City Central Hotel",
            description: "A modern hotel located in the heart of the city, close to major attractions and business districts.",
            address: "789 Main Street",
            city: "New York",
            country: "USA",
            stars: 4,
            price_per_night: 250,
            amenities: ["Gym", "Restaurant", "Free Wi-Fi", "Conference Rooms"],
            images: [
                "/images/hotels/hotel-7.jpg",
                "/images/hotels/hotel-8.jpg",
                "/images/hotels/hotel-9.jpg"
            ]
        },
        {
            id: 4,
            name: "Desert Oasis Resort",
            description: "A luxurious resort in the middle of the desert, offering a unique and tranquil experience.",
            address: "101 Desert Road",
            city: "Dubai",
            country: "UAE",
            stars: 5,
            price_per_night: 400,
            amenities: ["Spa", "Pool", "Restaurant", "Free Wi-Fi", "Private Beach"],
            images: [
                "/images/hotels/hotel-10.jpg",
                "/images/hotels/hotel-11.jpg",
                "/images/hotels/hotel-12.jpg"
            ]
        }
    ];

    const HotelCard = ({ hotel }) => {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <motion.div
                className="hotel-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <figure className="card-banner">
                    <Carousel images={hotel.images} />
                    <motion.div
                        className="image-overlay"
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ul className="highlight-list">
                            {hotel.amenities.map((amenity, index) => (
                                <li key={index}>
                                    <ion-icon name="checkmark-circle"></ion-icon>
                                    {amenity}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </figure>

                <div className="card-content">
                    <h3 className="h3 card-title">{hotel.name}</h3>
                    <p className="card-text">{hotel.description}</p>

                    <ul className="card-meta-list">
                        <li className="card-meta-item">
                            <div className="meta-box">
                                <ion-icon name="location"></ion-icon>
                                <p className="text">{hotel.city}, {hotel.country}</p>
                            </div>
                        </li>

                        <li className="card-meta-item">
                            <div className="meta-box">
                                <ion-icon name="star"></ion-icon>
                                <p className="text">{hotel.stars} Stars</p>
                            </div>
                        </li>

                        <li className="card-meta-item">
                            <div className="meta-box">
                                <ion-icon name="cash"></ion-icon>
                                <p className="text">${hotel.price_per_night}/night</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="card-price">
                    {/* <div className="wrapper">
                        <div className="card-rating">
                            {[...Array(5)].map((_, i) => (
                                <ion-icon
                                    key={i}
                                    name={i < Math.floor(hotel.stars) ? "star" : (i < hotel.stars ? "star-half" : "star-outline")}
                                ></ion-icon>
                            ))}
                        </div>
                    </div> */}

                    <div className="action-buttons">
                        <button className="btn btn-secondary" onClick={() => setSelectedHotel(hotel)}>View More</button>
                        <button className="btn btn-outline" onClick={() => handleBookNow(hotel.id)}>
                            <ion-icon name="cart-outline"></ion-icon> Book Now
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    const filteredHotels = hotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleBookNow = async (hotelId) => {
        // Handle booking logic
    };

    return (
        <AuthenticatedLayout>
            <Head title="Hotels" />

            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="section-subtitle">Find Your Stay</p>
                        <h2 className="h2 section-title">Popular Hotels</h2>
                        <p className="section-text">
                            Discover our handpicked selection of luxurious hotels. From beachfront resorts to city-center hotels, find your perfect stay.
                        </p>
                    </motion.div>

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search Hotels..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="hotel-list">
                        {filteredHotels.map((hotel) => (
                            <motion.div
                                key={hotel.id}
                                className="hotel-item"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: hotel.id * 0.1 }}
                            >
                                <HotelCard hotel={hotel} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {selectedHotel && (
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
                                <h3 className="h3 mb-4">{selectedHotel.name}</h3>
                                <Carousel images={selectedHotel.images} />
                                <ul className="space-y-2 mt-4">
                                    <li><strong>Address:</strong> {selectedHotel.address}</li>
                                    <li><strong>City:</strong> {selectedHotel.city}</li>
                                    <li><strong>Country:</strong> {selectedHotel.country}</li>
                                    <li><strong>Rating:</strong> {selectedHotel.stars} Stars</li>
                                    <li><strong>Price per Night:</strong> ${selectedHotel.price_per_night}</li>
                                    <li><strong>Amenities:</strong> {selectedHotel.amenities.join(", ")}</li>
                                </ul>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-700 dark:text-gray-300">{selectedHotel.description}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button className="btn btn-secondary" onClick={() => handleBookNow(selectedHotel.id)}>Book Now</button>
                            <button className="btn btn-outline" onClick={() => setSelectedHotel(null)}>Close</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AuthenticatedLayout>
    );
};

export default Hotels;