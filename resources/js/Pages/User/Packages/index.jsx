import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import '../../../../css/Packages.css';
import Carousel from "@/Components/Carousel";
import axios from "axios";

axios.defaults.withCredentials = true;

const Packages = ({packages}) => {
    const { csrf_token, auth } = usePage().props;
    const [search, setSearch] = useState("");
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [bookingData, setBookingData] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [formData, setFormData] = useState({
        start_date: '',
        end_date: '',
        number_of_people: 1,
        additional_notes: ''
    });

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;
        axios.defaults.withCredentials = true;
    }, [csrf_token]);

    const handleBookNow = (pkg) => {
        setSelectedPackage(pkg);
        setShowBookingModal(true);
    };

    const handlePayment = async () => {
        try {
            if (!selectedPackage) {
                throw new Error('No package selected');
            }

            const bookingData = {
                ...formData,
                package_id: selectedPackage.id,
                start_date: formData.start_date,
                end_date: formData.end_date,
                number_of_people: parseInt(formData.number_of_people),
                additional_notes: formData.additional_notes || ''
            };

            console.log('Sending booking data:', bookingData);

            const response = await axios.post(route('packages.book', {
                package: selectedPackage.id
            }), bookingData, {
                headers: {
                    'X-CSRF-TOKEN': csrf_token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const { booking, razorpay_key, order_id } = response.data;

            const options = {
                key: razorpay_key,
                amount: booking.total_price * 100,
                currency: 'INR',
                name: selectedPackage.title,
                description: 'Package Booking',
                image: '/images/logo.png',
                order_id: order_id,
                handler: async function(response) {
                    await axios.post(route('packages.payment'), {
                        booking_id: booking.id,
                        payment_id: response.razorpay_payment_id
                    });
                    setShowBookingModal(false);
                    alert('Booking confirmed!');
                },
                modal: {
                    ondismiss: async () => {
                        await axios.delete(`/bookings/${booking.id}`);
                    }
                },
                prefill: {
                    name: auth.user.name,
                    email: auth.user.email
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            
        } catch (error) {
            console.error('Full error details:', error.response?.data || error);
            alert('Payment failed: ' + (error.response?.data?.message || error.message));
        }
    };

    // const packages = [
    //     {
    //         id: 1,
    //         title: "Luxury Beach Resort Experience",
    //         description: "Indulge in a luxurious beach getaway with world-class amenities, pristine beaches, and unforgettable sunsets. Perfect for couples and families.",
    //         images: ["/images/packege-1.jpg", "/images/packege-2.jpg", "/images/packege-3.jpg", "/images/packege-4.png"],
    //         duration: "5D/4N",
    //         pax: 4,
    //         location: "Maldives",
    //         country: "Maldives",
    //         reviews: 128,
    //         rating: 5,
    //         price: 1299,
    //         amenities: ["Spa Access", "Water Sports", "Gourmet Dining"],
    //         highlights: ["Private Beach", "Sunset Cruise", "Diving"]
    //     },
    //     {
    //         id: 2,
    //         title: "Amazon Rainforest Adventure",
    //         description: "Embark on an exciting journey through the Amazon rainforest. Experience wildlife, indigenous cultures, and breathtaking natural wonders.",
    //         images: ["/images/packege-1.jpg", "/images/packege-2.jpg", "/images/packege-3.jpg", "/images/packege-4.png"],
    //         duration: "7D/6N",
    //         pax: 8,
    //         location: "Brazil",
    //         country: "Brazil",
    //         reviews: 95,
    //         rating: 4.8,
    //         price: 1599,
    //         amenities: ["Guided Tours", "Eco Lodge", "Local Cuisine"],
    //         highlights: ["Wildlife Safari", "Tribal Visit", "River Cruise"]
    //     },
    //     {
    //         id: 3,
    //         title: "Alpine Ski Adventure Package",
    //         description: "Experience the thrill of skiing in the majestic Alps. Perfect for both beginners and experienced skiers with professional instruction available.",
    //         images: ["/images/packege-1.jpg", "/images/packege-2.jpg", "/images/packege-3.jpg", "/images/packege-4.png"],
    //         duration: "6D/5N",
    //         pax: 6,
    //         location: "Switzerland",
    //         country: "Switzerland",
    //         reviews: 156,
    //         rating: 4.9,
    //         price: 1899,
    //         amenities: ["Ski Equipment", "Spa Access", "Mountain View"],
    //         highlights: ["Ski Lessons", "Cable Car", "Snow Activities"]
    //     },
    //     {
    //         id: 4,
    //         title: "Cultural Heritage Tour",
    //         description: "Explore the rich history and culture of ancient civilizations. Visit iconic landmarks such as the Acropolis, the Parthenon, and the ancient ruins of Delphi.",
    //         images: ["/images/packege-1.jpg", "/images/packege-2.jpg", "/images/packege-3.jpg", "/images/packege-4.png"],
    //         duration: "8D/7N",
    //         pax: 10,
    //         location: "Greece",
    //         country: "Greece",
    //         reviews: 75,
    //         rating: 4.7,
    //         price: 1999,
    //         amenities: ["Guided Tours", "Cultural Experiences", "Local Cuisine"],
    //         highlights: ["Acropolis Visit", "Local Festivals", "Cooking Class"]
    //     }
    // ];

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
                    {/* <Carousel images={pkg.images} /> */}
                    <motion.div
                        className="image-overlay"
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ul className="highlight-list">
                            {pkg.highlight}
                            {/* {pkg.highlights.map((highlight, index) => (
                                <li key={index}>
                                    <ion-icon name="checkmark-circle"></ion-icon>
                                    {highlight}
                                </li>
                            ))} */}
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
                                <p className="text">{pkg.location}, {pkg.country}</p>
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
                        <button className="btn btn-secondary" onClick={() => setSelectedPackage(pkg)}>View More</button>
                        <button className="btn btn-outline" onClick={() => handleBookNow(pkg)}>
                            <ion-icon name="cart-outline"></ion-icon> Book Now
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    const BookingModal = () => {
        const handleSubmit = (e) => {
            e.preventDefault();
            if (!formData.start_date || !formData.end_date || !formData.number_of_people) {
                alert('Please fill in all required fields');
                return;
            }
            handlePayment();
        };

        return (
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <motion.div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                    <form onSubmit={handleSubmit}>
                        <h3 className="text-xl font-bold mb-4">Book {selectedPackage?.title}</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div>
                                <label>End Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                    min={formData.start_date}
                                    required
                                />
                            </div>

                            <div>
                                <label>Number of People</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded"
                                    value={formData.number_of_people}
                                    onChange={(e) => setFormData({...formData, number_of_people: e.target.value})}
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label>Additional Notes</label>
                                <textarea
                                    className="w-full p-2 border rounded"
                                    value={formData.additional_notes}
                                    onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-4">
                            <button 
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Pay Now ₹{(selectedPackage?.price * formData.number_of_people) || 0}
                            </button>
                            <button 
                                className="border px-4 py-2 rounded"
                                onClick={() => setShowBookingModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        );
    };

    const filteredPackages = packages.filter((pkg) =>
        pkg.title.toLowerCase().includes(search.toLowerCase())
    );

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

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search Packages..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="package-list">
                        {filteredPackages.map((pkg) => (
                            <motion.div
                                key={pkg.id}
                                className="package-item"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: pkg.id * 0.1 }}
                            >
                                <PackageCard pkg={pkg} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {selectedPackage && (
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
                                <h3 className="h3 mb-4">{selectedPackage.title}</h3>
                                {/* <Carousel images={selectedPackage.images} /> */}
                                <p className="text-gray-700 dark:text-gray-300">{selectedPackage.description}</p>
                            </div>
                            <div className="flex-1">
                            <ul className="space-y-2 mt-4">
                                    <li><strong>Duration:</strong> {selectedPackage.duration}</li>
                                    <li><strong>Pax:</strong> {selectedPackage.pax}</li>
                                    <li><strong>Location:</strong> {selectedPackage.location}, {selectedPackage.country}</li>
                                    <li><strong>Rating:</strong> {selectedPackage.rating}</li>
                                    <li><strong>Price:</strong> ${selectedPackage.price}</li>
                                    <li><strong>Amenities:</strong> {selectedPackage.amenities}</li>
                                    <li><strong>Highlights:</strong> {selectedPackage.highlights}</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button className="btn btn-secondary" onClick={() => handleBookNow(selectedPackage)}>Book Now</button>
                            <button className="btn btn-outline" onClick={() => setSelectedPackage(null)}>Close</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            {showBookingModal && <BookingModal />}
        </AuthenticatedLayout>
    );
};

export default Packages;