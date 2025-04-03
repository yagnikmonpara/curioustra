import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Dialog } from '@headlessui/react';
import { useEffect, useState, useMemo, memo } from "react";
import { motion } from 'framer-motion';
import '../../../../css/Packages.css';
import axios from "axios";

axios.defaults.withCredentials = true;

const Packages = ({ packages = [] }) => {
    const { csrf_token } = usePage().props;
    const [search, setSearch] = useState("");
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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

    const filteredPackages = useMemo(() =>
        packages.filter(pkg =>
            pkg?.title?.toLowerCase().includes(search.toLowerCase())
        ),
        [packages, search]
    );

    const handleBookNow = (pkg) => {
        setSelectedPackage(pkg);
        setShowBookingModal(true);
    };

    const handlePayment = async () => {
        try {
            const bookingData = {
                package_id: selectedPackage?.id,
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
                name: 'CuriousTra',
                logo: '/images/logo.png',
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

    const SkeletonLoader = () => (
        <div className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-xl"></div>
            <div className="space-y-4 mt-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    );

    const ImageGallery = memo(({ images = [] }) => {
        const [mainImage, setMainImage] = useState(0);

        const formattedImages = useMemo(() =>
            images.map(img => ({
                src: (typeof img === 'string' ? img : img?.src) || '',
                alt: (typeof img === 'string' ? 'Package image' : img?.alt) || 'Package image'
            })).filter(img => img.src.startsWith('http') || img.src.startsWith('/')),
            [images]
        );

        return (
            <div className="relative h-full w-full">
                <div className="h-full w-full overflow-hidden">
                    {formattedImages.length > 0 ? (
                        <img
                            src={formattedImages[mainImage]?.src}
                            alt={formattedImages[mainImage]?.alt}
                            className="w-full h-full object-cover rounded-lg transition-opacity duration-300"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/default-package.png';
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                            <span className="text-gray-500">No image available</span>
                        </div>
                    )}
                </div>

                {formattedImages.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                        {formattedImages.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full ${index === mainImage ? 'bg-blue-500' : 'bg-white'}`}
                                onClick={() => setMainImage(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    });

    const PackageCard = memo(({ pkg, onViewMore, onBookNow }) => {
        const [isHovered, setIsHovered] = useState(false);

        if (!pkg) return null;

        return (
            <motion.div
                className="flex flex-col bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                layout
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <figure className="relative h-48 md:h-56 w-full overflow-hidden rounded-t-xl">
                    <ImageGallery images={pkg.images || []} />
                    <motion.div
                        className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 opacity-0 transition-opacity duration-300"
                        animate={{ opacity: isHovered ? 1 : 0 }}
                    >
                        <ul className="text-white text-center space-y-2 text-sm md:text-base">
                            {(pkg.highlights || []).map((highlight, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <ion-icon name="checkmark-circle" className="text-green-400"></ion-icon>
                                    {highlight}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </figure>

                <div className="p-4 md:p-6 flex flex-col flex-grow">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{pkg.title}</h3>
                    <p className="text-gray-600 text-sm md:text-base mb-4 flex-grow">{pkg.description}</p>

                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                            <ion-icon name="time" className="text-blue-600"></ion-icon>
                            <span className="text-sm md:text-base">{pkg.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <ion-icon name="people" className="text-blue-600"></ion-icon>
                            <span className="text-sm md:text-base">Max {pkg.pax}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <ion-icon name="location" className="text-blue-600"></ion-icon>
                            <span className="text-sm md:text-base">{pkg.location}</span>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <ion-icon
                                        key={i}
                                        name={i < Math.floor(pkg.rating || 0) ? "star" : (i < (pkg.rating || 0) ? "star-half" : "star-outline")}
                                        className="text-yellow-400 text-sm md:text-base"
                                    ></ion-icon>
                                ))}
                                <span className="text-gray-600 text-sm ml-2">({pkg.reviews || 0})</span>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl md:text-3xl font-bold text-blue-600">₹{pkg.price}</span>
                                <span className="block text-gray-500 text-xs">per person</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={onViewMore}
                                className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm md:text-base"
                            >
                                View More
                            </button>
                            <button
                                onClick={onBookNow}
                                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                            >
                                <ion-icon name="cart-outline"></ion-icon>
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    });

    const BookingModal = ({ selectedPackage: pkg, onClose }) => {
        const [formData, setFormData] = useState({
            start_date: '',
            number_of_people: 1,
            additional_notes: ''
        });
        const [loading, setLoading] = useState(false);
        const [errors, setErrors] = useState({});

        const totalPrice = useMemo(() =>
            (pkg?.price || 0) * formData.number_of_people,
            [pkg?.price, formData.number_of_people]
        );

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setErrors({});

            try {
                if (!pkg) throw new Error('No package selected');
                if (!formData.start_date) {
                    setErrors(prev => ({ ...prev, start_date: 'Start date is required' }));
                    return;
                }
                if (formData.number_of_people < 1 || formData.number_of_people > (pkg?.pax || 1)) {
                    setErrors(prev => ({ ...prev, number_of_people: `Must be between 1-${pkg?.pax || 1}` }));
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
                onClose={onClose}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-2xl">
                        <div className="p-6">
                            <Dialog.Title className="text-2xl font-bold text-gray-800 mb-4">
                                Book {pkg?.title}
                            </Dialog.Title>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">Start Date</label>
                                    <input
                                        type="date"
                                        className={`w-full p-3 border rounded-lg ${errors.start_date ? 'border-red-500' : 'border-gray-200'
                                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                        value={formData.start_date}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            start_date: e.target.value
                                        }))}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                    {errors.start_date && (
                                        <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">Number of People</label>
                                    <input
                                        type="number"
                                        className={`w-full p-3 border rounded-lg ${errors.number_of_people ? 'border-red-500' : 'border-gray-200'
                                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                        value={formData.number_of_people}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            number_of_people: Math.min(
                                                Number(e.target.value),
                                                pkg?.pax || 1
                                            )
                                        }))}
                                        min="1"
                                        max={pkg?.pax}
                                        required
                                    />
                                    {errors.number_of_people && (
                                        <p className="text-red-500 text-sm mt-1">{errors.number_of_people}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-75"
                                        disabled={loading}
                                    >
                                        {loading && (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                        {loading ? 'Processing...' : `Pay ₹${totalPrice}`}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        );
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
                                transition={{ duration: 0.5 }}
                            >
                                {isLoading ? (
                                    <SkeletonLoader />
                                ) : (
                                    <PackageCard
                                        pkg={pkg}
                                        onViewMore={() => setSelectedPackage(pkg)}
                                        onBookNow={() => handleBookNow(pkg)}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {selectedPackage && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedPackage(null)}
                >
                    <motion.div
                        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{selectedPackage.title}</h3>
                                <button
                                    onClick={() => setSelectedPackage(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <ion-icon name="close" className="text-2xl"></ion-icon>
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                                <div className="h-64 md:h-96 rounded-xl overflow-hidden">
                                    <ImageGallery images={selectedPackage.images || []} />
                                </div>

                                <div className="space-y-4 md:space-y-6">
                                    <p className="text-gray-600 text-base md:text-lg">{selectedPackage.description}</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-gray-500 text-sm">Duration</p>
                                            <p className="font-medium">{selectedPackage.duration}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-gray-500 text-sm">Max People</p>
                                            <p className="font-medium">{selectedPackage.pax}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-gray-500 text-sm">Location</p>
                                            <p className="font-medium">{selectedPackage.location}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-gray-500 text-sm">Rating</p>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <ion-icon
                                                        key={i}
                                                        name={i < Math.floor(selectedPackage.rating || 0) ? "star" : (i < (selectedPackage.rating || 0) ? "star-half" : "star-outline")}
                                                        className="text-yellow-400"
                                                    ></ion-icon>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-2xl font-bold text-blue-600">₹{selectedPackage.price}</span>
                                                <span className="block text-gray-500 text-sm">per person</span>
                                            </div>
                                            <button
                                                onClick={() => handleBookNow(selectedPackage)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                                            >
                                                <ion-icon name="cart-outline"></ion-icon>
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {showBookingModal && (
                <BookingModal
                    selectedPackage={selectedPackage}
                    onClose={() => {
                        setShowBookingModal(false);
                        setSelectedPackage(null);
                    }}
                />
            )}
        </AuthenticatedLayout>
    );
};

export default Packages;