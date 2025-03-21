import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Dialog } from '@headlessui/react';
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
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [formData, setFormData] = useState({
        start_date: '',
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
            const bookingData = {
                package_id: selectedPackage.id,
                start_date: new Date(formData.start_date).toISOString().split('T')[0],
                number_of_people: Number(formData.number_of_people),
                additional_notes: formData.additional_notes || null
            };
    
            const response = await axios.post(route('packages.book'), bookingData, {
                headers: {
                    'X-CSRF-TOKEN': csrf_token,
                    'Content-Type': 'application/json'
                }
            });

            const options = {
                key: response.data.razorpay_key,
                amount: response.data.amount,
                currency: 'INR',
                order_id: response.data.order_id,
                handler: async (razorpayResponse) => {
                    try {
                        const verifyResponse = await axios.post(
                            route('packages.payment'), 
                            { payment_id: razorpayResponse.razorpay_payment_id }
                        );
                        
                        if (verifyResponse.data.success) {
                            window.location.href = verifyResponse.data.redirect;
                        }
                    } catch (error) {
                        console.error('Verification failed:', error.response?.data);
                        alert(`Payment failed: ${error.response?.data.error || error.message}`);
                    }
                },
                prefill: response.data.user,
                theme: {
                    color: '#3385ff'
                }
            };
    
            const rzp = new window.Razorpay(options);
            rzp.open();
    
        } catch (error) {
            console.error('Booking Error:', {
                config: error.config,
                response: error.response?.data
            });
            alert(`Error: ${error.response?.data?.error || error.message}`);
        }
    };

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
                    <Carousel images={pkg.images?.map(img => 
                        img.startsWith('http') ? img : `/storage/${img}`
                    )} />
                    <motion.div
                        className="image-overlay"
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ul className="highlight-list">
                            {pkg.highlight}
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
        const [loading, setLoading] = useState(false);
        const [errors, setErrors] = useState({});
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setErrors({});
            
            try {
                if (!selectedPackage) throw new Error('No package selected');
                if (!formData.start_date) {
                    setErrors(prev => ({ ...prev, start_date: 'Start date is required' }));
                    return;
                }
                if (formData.number_of_people < 1 || formData.number_of_people > selectedPackage.pax) {
                    setErrors(prev => ({ ...prev, number_of_people: `Must be between 1-${selectedPackage.pax}` }));
                    return;
                }
                
                await handlePayment();
            } catch (error) {
                alert('Error: ' + error.message);
            } finally {
                setLoading(false);
            }
        };
    
        return (
            <Dialog
                open={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
                        <Dialog.Title className="text-xl font-bold mb-4">
                            Book {selectedPackage?.title}
                        </Dialog.Title>
    
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1">Start Date</label>
                                <input
                                    type="date"
                                    className={`w-full p-2 border rounded ${errors.start_date ? 'border-red-500' : ''}`}
                                    value={formData.start_date}
                                    onChange={(e) => setFormData(p => ({ ...p, start_date: e.target.value }))}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
                            </div>
    
                            <div>
                                <label className="block mb-1">Number of People</label>
                                <input
                                    type="number"
                                    className={`w-full p-2 border rounded ${errors.number_of_people ? 'border-red-500' : ''}`}
                                    value={formData.number_of_people}
                                    onChange={(e) => setFormData(p => ({
                                        ...p,
                                        number_of_people: Math.min(Number(e.target.value), selectedPackage?.pax || 1)
                                    }))}
                                    min="1"
                                    max={selectedPackage?.pax}
                                />
                                {errors.number_of_people && (
                                    <p className="text-red-500 text-sm">{errors.number_of_people}</p>
                                )}
                            </div>
    
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowBookingModal(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-50"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : `Pay ₹${(selectedPackage?.price * formData.number_of_people) || 0}`}
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
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
                                <Carousel images={selectedPackage.images?.map(img => 
                                    img.startsWith('http') ? img : `/storage/${img}`
                                )} />
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