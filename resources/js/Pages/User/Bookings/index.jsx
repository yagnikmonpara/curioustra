import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { motion } from "framer-motion";
import "../../../../css/Bookings.css";

const Bookings = () => {
    const [search, setSearch] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Sample booking data (replace with actual data fetching)
    const bookings = [
        { 
            id: 1,
            type: 'Package', 
            details: { name: 'Adventure Tour', price: '$500', date: '2024-04-01' }, 
            status: 'pending' 
        },
        { 
            id: 2,
            type: 'Hotel', 
            details: { name: 'Luxury Hotel', location: 'Paris', checkIn: '2024-04-10', checkOut: '2024-04-15' }, 
            status: 'confirmed' 
        },
        { 
            id: 3,
            type: 'Cab', 
            details: { pickup: 'Airport', dropoff: 'Hotel', date: '2024-04-05', time: '10:00 AM' }, 
            status: 'pending' 
        },
        { 
            id: 6,
            type: 'Guide', 
            details: { name: 'John Doe', expertise: 'Hiking', date: '2024-04-18' }, 
            status: 'confirmed' 
        },
        // ... more bookings
    ];

    // Function to cancel a booking (only if status is 'pending')
    const cancelBooking = (id) => {
        const booking = bookings.find((booking) => booking.id === id);
        if (booking && booking.status === 'pending') {
            alert(`Booking ${id} has been canceled.`);
            // Add logic to update the booking status in the backend
        } else {
            alert('You can only cancel pending bookings.');
        }
    };

    const filteredBookings = bookings.filter((booking) =>
        booking.type.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Bookings" />

            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="section-subtitle">Manage Your Bookings</p>
                        <h2 className="h2 section-title">My Bookings</h2>
                        <p className="section-text">
                            View and manage all your bookings in one place. Cancel pending bookings if needed.
                        </p>
                    </motion.div>

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search Bookings..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="booking-list">
                        {filteredBookings.map((booking) => (
                            <motion.div
                                key={booking.id}
                                className="booking-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: booking.id * 0.1 }}
                            >
                                <div className="card-content">
                                    <h3 className="h3 card-title">{booking.type} Booking</h3>
                                    <ul className="card-meta-list">
                                        {Object.entries(booking.details).map(([key, value]) => (
                                            <li key={key} className="card-meta-item">
                                                <div className="meta-box">
                                                    <ion-icon name="information-circle"></ion-icon>
                                                    <p className="text"><strong>{key}:</strong> {value}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="booking-status">
                                        <p><strong>Status:</strong> <span className={`status-${booking.status}`}>{booking.status}</span></p>
                                    </div>
                                    {booking.status === 'pending' && (
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => cancelBooking(booking.id)}
                                        >
                                            Cancel Booking
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {selectedBooking && (
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
                                <h3 className="h3 mb-4">{selectedBooking.type} Booking</h3>
                                <ul className="space-y-2 mt-4">
                                    {Object.entries(selectedBooking.details).map(([key, value]) => (
                                        <li key={key}><strong>{key}:</strong> {value}</li>
                                    ))}
                                    <li><strong>Status:</strong> <span className={`status-${selectedBooking.status}`}>{selectedBooking.status}</span></li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button className="btn btn-outline" onClick={() => setSelectedBooking(null)}>Close</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AuthenticatedLayout>
    );
};

export default Bookings;