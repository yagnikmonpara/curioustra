import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import { Dialog } from '@headlessui/react';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from 'date-fns';

const Cabs = ({ cabs }) => {
    const { csrf_token } = usePage().props;
    const [search, setSearch] = useState("");
    const [selectedCab, setSelectedCab] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingCab, setBookingCab] = useState(null);
    const [availability, setAvailability] = useState(null);
    const [estimatedDuration, setEstimatedDuration] = useState(1);
    const [showCalendar, setShowCalendar] = useState(false);
    const [calendarData, setCalendarData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [formData, setFormData] = useState({
        pickup_time: '',
        distance_km: 1,
        pickup_location: '',
        dropoff_location: '',
        additional_info: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        make: '',
        model: '',
        priceRange: [0, 1000],
        capacity: '',
        location: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', checkMobile);
        checkMobile();

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;
        axios.defaults.withCredentials = true;

        return () => document.body.removeChild(script);
    }, [csrf_token]);

    const fetchAvailabilityCalendar = async () => {
        try {
            const response = await axios.get(route('cabs.availability-calendar'), {
                params: {
                    cab_id: bookingCab?.id,
                    month: currentMonth,
                    year: currentYear
                }
            });
            setCalendarData(response.data.calendar);
            console.log("Calendar data:", response.data.calendar);
        } catch (error) {
            console.error('Calendar data fetch failed:', error);
            setCalendarData([]);
        }
    };

    const handleMonthChange = (increment) => {
        const newDate = new Date(currentYear, currentMonth - 1 + increment, 1);
        setCurrentMonth(newDate.getMonth() + 1);
        setCurrentYear(newDate.getFullYear());
    };

    useEffect(() => {
        if (bookingCab) {
            fetchAvailabilityCalendar();
        }
    }, [currentMonth, currentYear, bookingCab]);

    useEffect(() => {
        if (showBookingModal && bookingCab) {
            // Initialize pickup time with current datetime if not set
            if (!formData.pickup_time) {
                const now = new Date();
                const initialDateTime = format(now, "yyyy-MM-dd'T'HH:mm");
                setFormData(prev => ({
                    ...prev,
                    pickup_time: initialDateTime
                }));
            }
            fetchAvailabilityCalendar();
        }
    }, [showBookingModal, bookingCab]);

    const CalendarView = () => {
        if (!calendarData) return (
            <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );

        const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayData = calendarData.find(d => d.date === dateStr);

            const isAvailable = dayData ? dayData.available : true;

            days.push({
                day,
                date: dateStr,
                available: isAvailable
            });
        }

        return (
            <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => handleMonthChange(-1)}
                        className="p-2 rounded hover:bg-[#FFF2F2] text-[#2D336B]"
                    >
                        &lt; Previous
                    </button>
                    <h3 className="font-semibold text-[#2D336B]">
                        {new Date(currentYear, currentMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                        onClick={() => handleMonthChange(1)}
                        className="p-2 rounded hover:bg-[#FFF2F2] text-[#2D336B]"
                    >
                        Next &gt;
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`p-2 text-center border rounded h-12 flex items-center justify-center ${day
                                ? day.available
                                    ? 'bg-green-100 hover:bg-green-200 cursor-pointer'
                                    : 'bg-red-100 hover:bg-red-200 cursor-not-allowed'
                                : 'bg-gray-100'
                                } ${day?.date === new Date().toISOString().split('T')[0]
                                    ? 'border-2 border-blue-500'
                                    : 'border-gray-200'
                                } transition-colors duration-200`}
                            onClick={() => {
                                if (day?.available) {
                                    const currentDate = new Date();
                                    const currentTime = formData.pickup_time
                                        ? new Date(formData.pickup_time).toTimeString().slice(0, 5)
                                        : currentDate.toTimeString().slice(0, 5);

                                    const newDateTime = `${day.date}T${currentTime}`;

                                    setFormData(prev => ({
                                        ...prev,
                                        pickup_time: newDateTime
                                    }));
                                }
                            }}
                        >
                            {day && (
                                <span className={`font-medium ${day.available ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                    {day.day}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const ImageGallery = ({ images }) => {
        const [mainImage, setMainImage] = useState(0);
        const formattedImages = images.map(img => ({
            src: img.src,
            alt: img.alt
        }));

        return (
            <div className="relative h-full w-full">
                <div className="h-full w-full overflow-hidden">
                    {formattedImages.length > 0 ? (
                        <img
                            src={formattedImages[mainImage].src}
                            alt={formattedImages[mainImage].alt}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/default-car.png'; // This now points to the correct location
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
                                className={`w-3 h-3 rounded-full ${index === mainImage ? 'bg-[#2D336B]' : 'bg-white'}`}
                                onClick={() => setMainImage(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const CabCard = ({ cab }) => {
        const [isHovered, setIsHovered] = useState(false);

        const cabImages = cab.images?.map(img => ({
            src: img.startsWith('http') ? img : img, // Remove leading slash
            alt: `${cab.make} ${cab.model}`
        })) || [];

        return (
            <motion.div
                className="w-full rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <div className="relative h-[200px] w-full overflow-hidden">
                    <div className="h-full w-full">
                        {cabImages.length > 0 ? (
                            <img
                                src={cabImages[0].src.startsWith('http') ?
                                    cabImages[0].src :
                                    cabImages[0].src} // Remove /storage/ prefix
                                alt={cab?.make}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/images/default-car.png';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-500">No image available</span>
                            </div>
                        )}
                    </div>
                    <motion.div
                        className="absolute inset-0 bg-black/50 flex items-center justify-center"
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ul className="text-white text-center space-y-2">
                            <li className="flex items-center justify-center gap-2">
                                <ion-icon name="car"></ion-icon>
                                {cab.make} {cab.model}
                            </li>
                            <li className="flex items-center justify-center gap-2">
                                <ion-icon name="people"></ion-icon>
                                Capacity: {cab.capacity}
                            </li>
                            <li className="flex items-center justify-center gap-2">
                                <ion-icon name="cash"></ion-icon>
                                ₹{cab.price_per_km}/km
                            </li>
                        </ul>
                    </motion.div>
                </div>

                <div className="p-4">
                    <h3 className="text-xl font-semibold text-[#2D336B]">{cab.make} {cab.model}</h3>
                    <p className="text-gray-600 mt-1">Driver: {cab.driver_name}</p>

                    <ul className="mt-4 space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                            <ion-icon name="call" className="text-[#7886C7]"></ion-icon>
                            {cab.driver_contact_number}
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                            <ion-icon name="location" className="text-[#7886C7]"></ion-icon>
                            {cab.location}
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                            <ion-icon name="time" className="text-[#7886C7]"></ion-icon>
                            Status: {cab.status}
                        </li>
                    </ul>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-between gap-3">
                    <button
                        className="px-4 py-2 bg-[#2D336B] text-white rounded-lg hover:bg-[#7886C7] transition-colors text-sm"
                        onClick={() => setSelectedCab(cab)}
                    >
                        View More
                    </button>
                    <button
                        className="px-4 py-2 border border-[#2D336B] text-[#2D336B] rounded-lg hover:bg-[#7886C7]/10 transition-colors text-sm flex items-center gap-1"
                        onClick={() => {
                            setBookingCab(cab);
                            setShowBookingModal(true);
                        }}
                    >
                        <ion-icon name="cart-outline"></ion-icon>
                        Book Now
                    </button>
                </div>
            </motion.div>
        );
    };

    const checkAvailability = async () => {
        try {
            const formattedPickupTime = format(new Date(formData.pickup_time), 'yyyy-MM-dd HH:mm:ss');
            const response = await axios.post(route('cabs.check-availability'), {
                cab_id: bookingCab.id,
                pickup_time: formattedPickupTime,
                duration_hours: estimatedDuration
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrf_token
                }
            });

            setAvailability(response.data.available);
            return response.data.available;
        } catch (error) {
            console.error('Availability check failed:', error);
            setAvailability(false);
            return false;
        }
    };

    const handlePayment = async () => {
        try {
            setLoading(true);

            // 1. First check availability with fresh data
            const formattedPickupTime = format(new Date(formData.pickup_time), 'yyyy-MM-dd HH:mm:ss');
            const availabilityResponse = await axios.post(route('cabs.check-availability'), {
                cab_id: bookingCab.id,
                pickup_time: formattedPickupTime,
                duration_hours: estimatedDuration
            });

            if (!availabilityResponse.data.available) {
                throw new Error(availabilityResponse.data.message || 'Cab no longer available');
            }

            // 2. Calculate dropoff time
            const pickupTime = new Date(formData.pickup_time);
            const dropoffTime = new Date(pickupTime.getTime() + estimatedDuration * 60 * 60 * 1000);

            // 3. Create booking request
            const bookingResponse = await axios.post(route('cabs.book'), {
                cab_id: bookingCab.id,
                pickup_location: formData.pickup_location,
                dropoff_location: formData.dropoff_location,
                pickup_time: format(pickupTime, 'yyyy-MM-dd HH:mm:ss'),
                dropoff_time: format(dropoffTime, 'yyyy-MM-dd HH:mm:ss'),
                distance_km: formData.distance_km,
                additional_info: formData.additional_info,
            });

            // 4. Setup Razorpay with proper error handling
            const options = {
                key: bookingResponse.data.razorpay_key,
                amount: bookingResponse.data.amount,
                currency: 'INR',
                order_id: bookingResponse.data.order_id,
                handler: async (razorpayResponse) => {
                    try {
                        const verifyResponse = await axios.post(
                            route('cabs.payment'),
                            { payment_id: razorpayResponse.razorpay_payment_id }
                        );

                        if (verifyResponse.data.success) {
                            window.location.href = verifyResponse.data.redirect;
                        } else {
                            throw new Error(verifyResponse.data.error || 'Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Verification failed:', error);

                        // Show appropriate error message
                        let errorMessage = error.response?.data?.error || error.message;

                        if (error.response?.status === 400) {
                            errorMessage = error.response.data.error || 'Cab is no longer available';
                        } else {
                            errorMessage = 'Payment verification failed. Please contact support.';
                        }

                        alert(errorMessage);

                        // Reset form
                        setShowBookingModal(false);
                        setFormData({
                            pickup_time: '',
                            distance_km: 1,
                            pickup_location: '',
                            dropoff_location: '',
                            additional_info: ''
                        });
                    }
                },
                prefill: bookingResponse.data.user,
                theme: { color: '#3385ff' },
                modal: {
                    ondismiss: () => {
                        if (!loading) {
                            alert('Payment window closed. Your booking is not confirmed yet.');
                        }
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Booking Error:', error);

            let errorMessage = 'Booking failed. Please try again.';
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(errorMessage);

            // Reset availability status
            setAvailability(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const isAvailable = await checkAvailability();
            if (!isAvailable) {
                alert('This cab is already booked for the selected time');
                return;
            }

            await handlePayment();
        } catch (error) {
            console.error('Booking process error:', error);
            alert('Error processing booking: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const BookingModal = () => {
        const validateForm = () => {
            const newErrors = {};
            if (!formData.pickup_time) newErrors.pickup_time = 'Pickup time is required';
            if (!formData.pickup_location) newErrors.pickup_location = 'Pickup location is required';
            if (!formData.dropoff_location) newErrors.dropoff_location = 'Dropoff location is required';
            if (formData.distance_km < 1) newErrors.distance_km = 'Distance must be at least 1 km';

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!validateForm()) return;

            setLoading(true);
            try {
                const isAvailable = await checkAvailability();
                if (!isAvailable) {
                    alert('This cab is already booked for the selected time');
                    return;
                }
                await handlePayment();
            } catch (error) {
                alert('Error processing payment: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        };

        return (
            <Dialog
                open={showBookingModal}
                onClose={() => {
                    if (!loading) {
                        setShowBookingModal(false);
                    }
                }}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-[#2D336B]/30 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
                    <Dialog.Panel className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-[#A9B5DF] max-h-[90vh] overflow-y-auto">
                        <div className="flex flex-col md:flex-row h-full">
                            {/* Left Column - Calendar */}
                            <div className={`w-full ${isMobile ? '' : 'md:w-1/2'} p-6 bg-[#2D336B]`}>
                                <div className="flex justify-between items-center mb-6">
                                    <Dialog.Title className="text-2xl font-bold text-white">
                                        Select Date & Time
                                    </Dialog.Title>
                                    <button
                                        onClick={() => setShowBookingModal(false)}
                                        className="p-2 rounded-full hover:bg-[#A9B5DF]/20 text-white"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="bg-white rounded-lg p-4 shadow-sm border border-[#A9B5DF]">
                                    <CalendarView />
                                </div>

                                <div className="mt-6 p-4 bg-white rounded-lg border border-[#A9B5DF]">
                                    <h3 className="font-semibold text-[#2D336B] mb-2">Cab Details</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 bg-[#FFF2F2] rounded-lg overflow-hidden">
                                            {bookingCab?.images?.[0] && (
                                                <img
                                                    src={bookingCab.images[0].startsWith('http') ?
                                                        bookingCab.images[0] :
                                                        bookingCab.images[0]} // Remove /storage/ prefix
                                                    alt={bookingCab?.make}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/images/default-car.png';
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#2D336B]">{bookingCab?.make} {bookingCab?.model}</h4>
                                            <p className="text-sm text-[#7886C7]">{bookingCab?.driver_name}</p>
                                            <p className="text-sm text-[#7886C7]">{bookingCab?.driver_contact_number}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Booking Form */}
                            <div className={`w-full ${isMobile ? '' : 'md:w-1/2'} p-6 overflow-y-auto`}>
                                <Dialog.Title className="text-2xl font-bold text-[#2D336B] mb-6">
                                    Complete Your Booking
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-[#2D336B]">
                                            Estimated Trip Duration (hours)
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full p-3 border border-[#A9B5DF] rounded-lg focus:ring-2 focus:ring-[#7886C7] focus:border-[#7886C7]"
                                            value={estimatedDuration}
                                            onChange={(e) => setEstimatedDuration(Math.max(1, Number(e.target.value)))}
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-[#2D336B]">
                                            Pickup Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="pickup_time"
                                            className={`w-full p-3 border ${errors.pickup_time ? 'border-red-500' : 'border-[#A9B5DF]'} rounded-lg focus:ring-2 focus:ring-[#7886C7] focus:border-[#7886C7]`}
                                            value={formData.pickup_time}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().slice(0, 16)}
                                            required
                                        />
                                        {errors.pickup_time && (
                                            <p className="text-red-500 text-sm mt-1">{errors.pickup_time}</p>
                                        )}
                                        {availability === false && (
                                            <p className="text-red-500 text-sm mt-1">
                                                This cab is not available for the selected time
                                            </p>
                                        )}
                                        {availability === true && (
                                            <p className="text-green-500 text-sm mt-1">
                                                Cab is available for booking
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-[#2D336B]">
                                            Pickup Location
                                        </label>
                                        <input
                                            type="text"
                                            name="pickup_location"
                                            className={`w-full p-3 border ${errors.pickup_location ? 'border-red-500' : 'border-[#A9B5DF]'} rounded-lg focus:ring-2 focus:ring-[#7886C7] focus:border-[#7886C7]`}
                                            value={formData.pickup_location}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {errors.pickup_location && (
                                            <p className="text-red-500 text-sm mt-1">{errors.pickup_location}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-[#2D336B]">
                                            Dropoff Location
                                        </label>
                                        <input
                                            type="text"
                                            name="dropoff_location"
                                            className={`w-full p-3 border ${errors.dropoff_location ? 'border-red-500' : 'border-[#A9B5DF]'} rounded-lg focus:ring-2 focus:ring-[#7886C7] focus:border-[#7886C7]`}
                                            value={formData.dropoff_location}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {errors.dropoff_location && (
                                            <p className="text-red-500 text-sm mt-1">{errors.dropoff_location}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-[#2D336B]">
                                            Distance (km)
                                        </label>
                                        <input
                                            type="number"
                                            name="distance_km"
                                            className={`w-full p-3 border ${errors.distance_km ? 'border-red-500' : 'border-[#A9B5DF]'} rounded-lg focus:ring-2 focus:ring-[#7886C7] focus:border-[#7886C7]`}
                                            value={formData.distance_km}
                                            onChange={(e) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    distance_km: Math.max(1, Number(e.target.value))
                                                }));
                                            }}
                                            min="1"
                                            required
                                        />
                                        {errors.distance_km && (
                                            <p className="text-red-500 text-sm mt-1">{errors.distance_km}</p>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-[#A9B5DF]">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-sm text-[#7886C7]">Price per km</p>
                                            <p className="font-medium text-[#2D336B]">₹{bookingCab?.price_per_km}</p>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-sm text-[#7886C7]">Distance</p>
                                            <p className="font-medium text-[#2D336B]">{formData.distance_km} km</p>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-[#A9B5DF]">
                                            <p className="text-sm font-semibold text-[#2D336B]">Total Amount</p>
                                            <p className="text-xl font-bold text-[#2D336B]">
                                                ₹{(bookingCab?.price_per_km * formData.distance_km).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowBookingModal(false)}
                                            className="px-6 py-3 border border-[#A9B5DF] rounded-lg hover:bg-[#FFF2F2] transition-colors text-[#2D336B] font-medium"
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-[#2D336B] text-white rounded-lg hover:bg-[#7886C7] disabled:bg-[#A9B5DF] transition-colors flex items-center justify-center min-w-[150px] font-medium"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                `Pay ₹${(bookingCab?.price_per_km * formData.distance_km).toFixed(2)}`
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        );
    };

    const filteredCabs = cabs.filter(cab => {
        // Basic search
        const matchesSearch = `${cab.make} ${cab.model} ${cab.location} ${cab.driver_name}`
            .toLowerCase()
            .includes(search.toLowerCase());

        // Advanced filters
        const matchesMake = !searchFilters.make || cab.make.toLowerCase().includes(searchFilters.make.toLowerCase());
        const matchesModel = !searchFilters.model || cab.model.toLowerCase().includes(searchFilters.model.toLowerCase());
        const matchesPrice = cab.price_per_km >= searchFilters.priceRange[0] &&
            cab.price_per_km <= searchFilters.priceRange[1];
        const matchesCapacity = !searchFilters.capacity || cab.capacity >= parseInt(searchFilters.capacity);
        const matchesLocation = !searchFilters.location || cab.location.toLowerCase().includes(searchFilters.location.toLowerCase());

        return matchesSearch && matchesMake && matchesModel && matchesPrice && matchesCapacity && matchesLocation;
    });

    const resetFilters = () => {
        setSearchFilters({
            make: '',
            model: '',
            priceRange: [0, 1000],
            capacity: '',
            location: ''
        });
        setSearch('');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Cabs" />

            {/* <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;  
                    scrollbar-width: none; 
                }
            `}</style> */}

            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="section-header text-center px-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="section-subtitle text-[#7886C7] mb-2">Find Your Ride</p>
                        <h2 className="h2 section-title text-3xl sm:text-4xl font-bold text-[#2D336B] mb-4">
                            Available Cabs
                        </h2>
                        <p className="section-text text-gray-600 max-w-2xl mx-auto">
                            Discover our fleet of comfortable and reliable cabs. Book your ride now for a seamless travel experience.
                        </p>
                    </motion.div>

                    <div className="search-container mt-8 px-4">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-grow">
                                    <div className="absolute left-3 top-3.5 text-[#7886C7]">
                                        <ion-icon name="search-outline"></ion-icon>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by make, model, location or driver..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full p-3 pl-10 rounded-lg border border-[#A9B5DF] focus:ring-2 focus:ring-[#7886C7] focus:border-[#7886C7]"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="px-4 py-3 bg-[#2D336B] text-white rounded-lg hover:bg-[#7886C7] transition-colors flex items-center justify-center gap-2"
                                >
                                    <ion-icon name={showFilters ? "filter" : "filter-outline"}></ion-icon>
                                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                                </button>
                            </div>

                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-4 pt-4 border-t border-[#A9B5DF]"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#2D336B] mb-1">Make</label>
                                            <input
                                                type="text"
                                                placeholder="Any make"
                                                value={searchFilters.make}
                                                onChange={(e) => setSearchFilters({ ...searchFilters, make: e.target.value })}
                                                className="w-full p-2 border border-[#A9B5DF] rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#2D336B] mb-1">Model</label>
                                            <input
                                                type="text"
                                                placeholder="Any model"
                                                value={searchFilters.model}
                                                onChange={(e) => setSearchFilters({ ...searchFilters, model: e.target.value })}
                                                className="w-full p-2 border border-[#A9B5DF] rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#2D336B] mb-1">Price Range (₹/km)</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="Min"
                                                    value={searchFilters.priceRange[0]}
                                                    onChange={(e) => setSearchFilters({ ...searchFilters, priceRange: [parseInt(e.target.value) || 0, searchFilters.priceRange[1]] })}
                                                    className="w-full p-2 border border-[#A9B5DF] rounded-lg"
                                                />
                                                <span>-</span>
                                                <input
                                                    type="number"
                                                    placeholder="Max"
                                                    value={searchFilters.priceRange[1]}
                                                    onChange={(e) => setSearchFilters({ ...searchFilters, priceRange: [searchFilters.priceRange[0], parseInt(e.target.value) || 1000] })}
                                                    className="w-full p-2 border border-[#A9B5DF] rounded-lg"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#2D336B] mb-1">Min Capacity</label>
                                            <select
                                                value={searchFilters.capacity}
                                                onChange={(e) => setSearchFilters({ ...searchFilters, capacity: e.target.value })}
                                                className="w-full p-2 border border-[#A9B5DF] rounded-lg"
                                            >
                                                <option value="">Any capacity</option>
                                                <option value="2">2+ seats</option>
                                                <option value="4">4+ seats</option>
                                                <option value="6">6+ seats</option>
                                                <option value="8">8+ seats</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-[#2D336B] mb-1">Location</label>
                                            <input
                                                type="text"
                                                placeholder="Any location"
                                                value={searchFilters.location}
                                                onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
                                                className="w-full p-2 border border-[#A9B5DF] rounded-lg"
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex justify-end items-end">
                                            <button
                                                onClick={resetFilters}
                                                className="px-4 py-2 border border-[#A9B5DF] text-[#2D336B] rounded-lg hover:bg-[#FFF2F2] transition-colors"
                                            >
                                                Reset Filters
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {filteredCabs.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-medium text-[#2D336B]">No cabs found matching your criteria</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
                            <button
                                onClick={resetFilters}
                                className="mt-4 px-4 py-2 bg-[#2D336B] text-white rounded-lg hover:bg-[#7886C7] transition-colors"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="cab-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 px-4">
                            {filteredCabs.map(cab => (
                                <motion.div
                                    key={cab.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <CabCard cab={cab} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {selectedCab && (
                <motion.div
                    className="fixed inset-0 bg-[#2D336B]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-xl shadow-2xl overflow-hidden border border-[#A9B5DF] w-full max-w-4xl max-h-[90vh] flex flex-col"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                    >
                        {/* Header with close button */}
                        <div className="flex justify-between items-center p-6 border-b border-[#A9B5DF]">
                            <h3 className="text-2xl font-bold text-[#2D336B]">
                                {selectedCab.make} {selectedCab.model}
                            </h3>
                            <button
                                onClick={() => setSelectedCab(null)}
                                className="p-2 rounded-full hover:bg-[#A9B5DF]/20 text-[#2D336B]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Scrollable content container */}
                        <div className="flex-1 overflow-y-auto"> {/* This is now the single scroll container */}
                            <div className="flex flex-col md:flex-row">
                                {/* Left Column - Cab Images */}
                                <div className="w-full md:w-1/2 p-6 bg-[#7886C7]/10">
                                    <div className="h-96 rounded-lg overflow-hidden border border-[#A9B5DF] bg-white">
                                        <ImageGallery
                                            images={(selectedCab.images || []).map(img => ({
                                                src: img,
                                                alt: `${selectedCab.make} ${selectedCab.model}`
                                            }))}
                                        />
                                    </div>
                                </div>

                                {/* Right Column - Cab Details */}
                                <div className="w-full md:w-1/2 p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-lg font-semibold text-[#2D336B] mb-3">Cab Details</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-[#7886C7]/10 p-3 rounded-lg border border-[#A9B5DF]">
                                                    <p className="text-sm text-[#7886C7]">Driver</p>
                                                    <p className="font-medium text-[#2D336B]">{selectedCab.driver_name}</p>
                                                </div>
                                                <div className="bg-[#7886C7]/10 p-3 rounded-lg border border-[#A9B5DF]">
                                                    <p className="text-sm text-[#7886C7]">Contact</p>
                                                    <p className="font-medium text-[#2D336B]">{selectedCab.driver_contact_number}</p>
                                                </div>
                                                <div className="bg-[#7886C7]/10 p-3 rounded-lg border border-[#A9B5DF]">
                                                    <p className="text-sm text-[#7886C7]">Capacity</p>
                                                    <p className="font-medium text-[#2D336B]">{selectedCab.capacity} people</p>
                                                </div>
                                                <div className="bg-[#7886C7]/10 p-3 rounded-lg border border-[#A9B5DF]">
                                                    <p className="text-sm text-[#7886C7]">Price/km</p>
                                                    <p className="font-medium text-[#2D336B]">₹{selectedCab.price_per_km}</p>
                                                </div>
                                                <div className="bg-[#7886C7]/10 p-3 rounded-lg border border-[#A9B5DF]">
                                                    <p className="text-sm text-[#7886C7]">Location</p>
                                                    <p className="font-medium text-[#2D336B]">{selectedCab.location}</p>
                                                </div>
                                                <div className="bg-[#7886C7]/10 p-3 rounded-lg border border-[#A9B5DF]">
                                                    <p className="text-sm text-[#7886C7]">Status</p>
                                                    <p className="font-medium text-[#2D336B] capitalize">{selectedCab.status}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer with buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-[#A9B5DF]">
                            <button
                                className="px-6 py-3 border border-[#A9B5DF] rounded-lg hover:bg-[#7886C7]/10 transition-colors text-[#2D336B] font-medium"
                                onClick={() => setSelectedCab(null)}
                            >
                                Close
                            </button>
                            <button
                                className="px-6 py-3 bg-[#2D336B] text-white rounded-lg hover:bg-[#7886C7] transition-colors font-medium"
                                onClick={() => {
                                    setBookingCab(selectedCab);
                                    setShowBookingModal(true);
                                    setSelectedCab(null);
                                }}
                            >
                                Book Now
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {showBookingModal && <BookingModal />}
        </AuthenticatedLayout>
    );
};

export default Cabs;