import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog } from '@headlessui/react';
import Carousel from "@/Components/Carousel";
import axios from "axios";
import "../../../../css/Hotels.css";

axios.defaults.withCredentials = true;

const Hotels = ({ hotels }) => {
    const { csrf_token } = usePage().props;
    const [search, setSearch] = useState("");
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [formData, setFormData] = useState({
        check_in_date: '',
        check_out_date: '',
        number_of_guests: 1,
        additional_info: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;
        
        return () => document.body.removeChild(script);
    }, [csrf_token]);

    const handlePayment = async () => {
        try {
            const response = await axios.post(route('hotels.book'), {
                hotel_id: selectedHotel.id,
                ...formData
            });

            const options = {
                key: response.data.razorpay_key,
                amount: response.data.amount,
                currency: 'INR',
                order_id: response.data.order_id,
                handler: async (razorpayResponse) => {
                    try {
                        const verifyResponse = await axios.post(
                            route('hotels.payment'), 
                            { payment_id: razorpayResponse.razorpay_payment_id }
                        );
                        
                        if (verifyResponse.data.success) {
                            window.location.href = verifyResponse.data.redirect;
                        }
                    } catch (error) {
                        alert('Payment verification failed: ' + error.response?.data?.error);
                    }
                },
                prefill: response.data.user,
                theme: { color: '#3385ff' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            alert('Booking failed: ' + error.response?.data?.error);
        } finally {
            setLoading(false);
        }
    };

    const BookingModal = () => {
        const validateForm = () => {
            const newErrors = {};
            if (!formData.check_in_date) newErrors.check_in_date = 'Check-in date required';
            if (!formData.check_out_date) newErrors.check_out_date = 'Check-out date required';
            if (formData.number_of_guests < 1) newErrors.number_of_guests = 'At least 1 guest required';
            
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!validateForm()) return;
            
            setLoading(true);
            handlePayment();
        };

        const calculateNights = () => {
            if (!formData.check_in_date || !formData.check_out_date) return 0;
            const start = new Date(formData.check_in_date);
            const end = new Date(formData.check_out_date);
            return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        };

        const totalPrice = selectedHotel 
            ? calculateNights() * selectedHotel.price_per_night * formData.number_of_guests
            : 0;

        return (
            <Dialog open={showBookingModal} onClose={() => setShowBookingModal(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
                        <Dialog.Title className="text-xl font-bold mb-4">
                            Book {selectedHotel?.name}
                        </Dialog.Title>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label>Check-in Date</label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.check_in_date}
                                    onChange={e => setFormData({ ...formData, check_in_date: e.target.value })}
                                    className={`w-full p-2 border rounded ${errors.check_in_date ? 'border-red-500' : ''}`}
                                />
                                {errors.check_in_date && <p className="text-red-500 text-sm">{errors.check_in_date}</p>}
                            </div>

                            <div>
                                <label>Check-out Date</label>
                                <input
                                    type="date"
                                    min={formData.check_in_date}
                                    value={formData.check_out_date}
                                    onChange={e => setFormData({ ...formData, check_out_date: e.target.value })}
                                    className={`w-full p-2 border rounded ${errors.check_out_date ? 'border-red-500' : ''}`}
                                />
                                {errors.check_out_date && <p className="text-red-500 text-sm">{errors.check_out_date}</p>}
                            </div>

                            <div>
                                <label>Number of Guests</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={formData.number_of_guests}
                                    onChange={e => setFormData({ ...formData, number_of_guests: e.target.value })}
                                    className={`w-full p-2 border rounded ${errors.number_of_guests ? 'border-red-500' : ''}`}
                                />
                                {errors.number_of_guests && <p className="text-red-500 text-sm">{errors.number_of_guests}</p>}
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <p className="font-semibold">
                                        Total: ₹{totalPrice.toFixed(2)}
                                        <span className="text-sm text-gray-600 ml-2">
                                            ({calculateNights()} nights × {formData.number_of_guests} guests)
                                        </span>
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Proceed to Pay'}
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        );
    };

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
                    <div className="wrapper">
                        <div className="card-rating">
                            {[...Array(5)].map((_, i) => (
                                <ion-icon
                                    key={i}
                                    name={i < Math.floor(hotel.stars) ? "star" : (i === Math.floor(hotel.stars) && hotel.stars % 1 !== 0 ? "star-half" : "star-outline")}
                                ></ion-icon>
                            ))}
                        </div>
                    </div>

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

    const handleBookNow = (hotel) => {
        setSelectedHotel(hotel);
        setShowBookingModal(true);
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
                            <button 
                                className="btn btn-outline" 
                                onClick={() => {
                                    handleBookNow(selectedHotel);
                                    setShowBookingModal(true);
                                }}
                            >
                                <ion-icon name="cart-outline"></ion-icon> Book Now
                            </button>
                            <button 
                                className="btn btn-outline" 
                                onClick={() => setSelectedHotel(null)}
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            {showBookingModal && <BookingModal />}
        </AuthenticatedLayout>
    );
};

export default Hotels;