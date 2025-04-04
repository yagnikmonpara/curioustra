import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import { Dialog } from '@headlessui/react';
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { format } from 'date-fns';

const useCalendar = (cabId) => {
    const [calendarData, setCalendarData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const fetchAvailabilityCalendar = useCallback(async () => {
        if (!cabId) return;

        try {
            const response = await axios.get(route('cabs.availability-calendar'), {
                params: {
                    cab_id: cabId,
                    month: currentDate.getMonth() + 1,
                    year: currentDate.getFullYear()
                }
            });
            setCalendarData(response.data.calendar);
        } catch (error) {
            console.error('Calendar fetch error:', error);
            setCalendarData([]);
        }
    }, [cabId, currentDate]);

    const handleMonthChange = useCallback((increment) => {
        setCurrentDate(prev => new Date(prev.setMonth(prev.getMonth() + increment)));
    }, []);

    useEffect(() => {
        fetchAvailabilityCalendar();
    }, [fetchAvailabilityCalendar]);

    return {
        calendarData,
        currentDate,
        handleMonthChange
    };
};

const Cabs = ({ cabs }) => {
    // const { csrf_token } = usePage().props;
    const [search, setSearch] = useState("");
    const [selectedCab, setSelectedCab] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingCab, setBookingCab] = useState(null);
    const [availability, setAvailability] = useState(null);
    const [estimatedDuration, setEstimatedDuration] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [localFormData, setLocalFormData] = useState({
        pickup_time: '',
        distance_km: 1,
        pickup_location: '',
        dropoff_location: '',
        additional_info: ''
    });
    const [isMobile, setIsMobile] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        make: '',
        model: '',
        priceRange: [0, 1000],
        capacity: '',
        location: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const closeBookingModal = useCallback(() => setShowBookingModal(false), []);

    // Memoized filtered cabs
    const filteredCabs = useMemo(() => {
        return cabs.filter(cab => {
            const searchString = `${cab.make} ${cab.model} ${cab.location} ${cab.driver_name}`.toLowerCase();
            const matchesSearch = searchString.includes(search.toLowerCase());
            const matchesMake = !searchFilters.make || cab.make.toLowerCase().includes(searchFilters.make.toLowerCase());
            const matchesModel = !searchFilters.model || cab.model.toLowerCase().includes(searchFilters.model.toLowerCase());
            const matchesPrice = cab.price_per_km >= searchFilters.priceRange[0] && cab.price_per_km <= searchFilters.priceRange[1];
            const matchesCapacity = !searchFilters.capacity || cab.capacity >= parseInt(searchFilters.capacity);
            const matchesLocation = !searchFilters.location || cab.location.toLowerCase().includes(searchFilters.location.toLowerCase());

            return matchesSearch && matchesMake && matchesModel && matchesPrice && matchesCapacity && matchesLocation;
        });
    }, [cabs, search, searchFilters.make, searchFilters.model,
        searchFilters.priceRange[0], searchFilters.priceRange[1],
        searchFilters.capacity, searchFilters.location]);

    const resetFilters = useCallback(() => {
        setSearchFilters({
            make: '',
            model: '',
            priceRange: [0, 100],
            capacity: '',
            location: ''
        });
        setSearch('');
    }, []);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', checkMobile);
        checkMobile();
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // Check if Razorpay is already loaded
        if (window.Razorpay) return;

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        axios.defaults.withCredentials = true;

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Availability check
    const checkAvailability = useCallback(async (formData) => {
        try {
            const formattedPickupTime = format(new Date(formData.pickup_time), 'yyyy-MM-dd HH:mm:ss');
            const response = await axios.post(route('cabs.check-availability'), {
                cab_id: bookingCab.id,
                pickup_time: formattedPickupTime,
                duration_hours: estimatedDuration
            });
            setAvailability(response.data.available);
            return response.data.available;
        } catch (error) {
            console.error('Availability check failed:', error);
            setAvailability(false);
            return false;
        }
    }, [bookingCab, estimatedDuration]);

    // Payment handling
    const handlePayment = useCallback(async (formData) => {
        console.log('handlePayment called');
        try {
            setLoading(true);
            const pickupTime = new Date(formData.pickup_time);
            const dropoffTime = new Date(pickupTime.getTime() + estimatedDuration * 60 * 60 * 1000);

            const bookingResponse = await axios.post(route('cabs.book'), {
                cab_id: bookingCab.id,
                ...formData,
                pickup_time: format(pickupTime, 'yyyy-MM-dd HH:mm:ss'),
                dropoff_time: format(dropoffTime, 'yyyy-MM-dd HH:mm:ss'),
            });

            const options = {
                key: bookingResponse.data.razorpay_key,
                name: 'CuriousTra',
                logo: '/images/logo.png',
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
                        }
                    } catch (error) {
                        alert(`Payment failed: ${error.response?.data?.error || error.message}`);
                    }
                },
                prefill: bookingResponse.data.user,
                theme: { color: '#3385ff' },
                modal: { ondismiss: () => setShowBookingModal(false) }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            alert(`Booking error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [bookingCab, estimatedDuration]);

    const ImageGallery = memo(({ images }) => {
        const [mainImage, setMainImage] = useState(0);
        const formattedImages = useMemo(() =>
            (images || []).map(img => ({
                src: img.startsWith('http') ? img : img,
                alt: `Cab image`
            })),
            [images]
        );

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
                                e.target.src = '/images/default-car.png';
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
                                aria-label={`Select image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    });

    // Cab Card Component
    const CabCard = memo(({ cab, onSelect, onBook }) => {
        const [isHovered, setIsHovered] = useState(false);
        const cabImages = useMemo(() =>
            (cab.images || []).map(img => ({
                src: img.startsWith('http') ? img : img,
                alt: `${cab.make} ${cab.model}`
            })),
            [cab.images]
        );

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
                    {/* Cab image display */}
                    {cabImages.length > 0 ? (
                        <img
                            src={cabImages[0].src}
                            alt={cabImages[0].alt}
                            className="w-full h-full object-cover"
                            loading="lazy"
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

                    {/* Hover overlay */}
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

                {/* Cab details */}
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

                {/* Action buttons */}
                <div className="p-4 border-t border-gray-100 flex justify-between gap-3">
                    <button
                        className="px-6 py-3 bg-[#2D336B] text-white rounded-lg hover:bg-[#7886C7] transition-colors text-base flex-grow"
                        onClick={() => onSelect(cab)}
                        aria-label={`View details for ${cab.make} ${cab.model}`}
                    >
                        View Details
                    </button>
                    <button
                        className="px-6 py-3 border border-[#2D336B] text-[#2D336B] rounded-lg hover:bg-[#7886C7]/10 transition-colors text-base flex-grow flex items-center justify-center gap-1"
                        onClick={() => onBook(cab)}
                        aria-label={`Book ${cab.make} ${cab.model}`}
                    >
                        <ion-icon name="cart-outline"></ion-icon>
                        Book Now
                    </button>
                </div>
            </motion.div>
        );
    });

    // Booking Modal Component
    const BookingModal = memo(({ bookingCab, isMobile, onClose }) => {
        console.log('BookingModal called');

        const { calendarData, currentDate, handleMonthChange } = useCalendar(bookingCab?.id);
        const [localErrors, setLocalErrors] = useState({});
        const [localFormData, setLocalFormData] = useState({
            pickup_time: '',
            distance_km: 1,
            pickup_location: '',
            dropoff_location: '',
            additional_info: ''
        });

        // Initialize form when cab is selected
        useEffect(() => {
            if (showBookingModal && bookingCab) {
                const now = new Date();
                setLocalFormData({
                    pickup_time: format(now, "yyyy-MM-dd'T'HH:mm"),
                    distance_km: 1,
                    pickup_location: '',
                    dropoff_location: '',
                    additional_info: ''
                });
            }
        }, [showBookingModal, bookingCab]);

        // Input change handler
        const handleInputChange = useCallback((e) => {
            const { name, value } = e.target;
            setLocalFormData(prev => ({ ...prev, [name]: value }));
            setLocalErrors(prev => ({ ...prev, [name]: '' }));
        }, []);

        // Form validation
        const validateForm = useCallback(() => {
            const newErrors = {};
            if (!localFormData.pickup_time) newErrors.pickup_time = 'Pickup time is required';
            if (!localFormData.pickup_location.trim()) newErrors.pickup_location = 'Pickup location is required';
            if (!localFormData.dropoff_location.trim()) newErrors.dropoff_location = 'Dropoff location is required';
            if (localFormData.distance_km < 1) newErrors.distance_km = 'Distance must be at least 1 km';

            setLocalErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        }, [localFormData]);

        // Form submission
        const handleSubmit = useCallback(async (e) => {
            e.preventDefault();
            if (!validateForm()) return;

            setLoading(true);
            try {
                const isAvailable = await checkAvailability(localFormData);
                if (!isAvailable) {
                    alert('This cab is already booked for the selected time');
                    return;
                }

                await handlePayment(localFormData);

            } catch (error) {
                alert('Booking error: ' + error.message);
            } finally {
                setLoading(false);
            }
        }, [localFormData, validateForm, checkAvailability, handlePayment]);

        // Calendar view component
        const CalendarView = useMemo(() => () => {
            const today = format(new Date(), 'yyyy-MM-dd');
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;
            const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
            const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
            return (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => handleMonthChange(-1)}
                            className="p-2 rounded-lg hover:bg-[#FFF2F2] text-[#2D336B] disabled:opacity-50 transition-colors"
                            disabled={currentDate <= new Date() && currentDate.getMonth() <= new Date().getMonth()}
                            aria-label="Previous month"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>

                        <h3 className="font-semibold text-lg text-[#2D336B]">
                            {format(currentDate, 'MMMM yyyy')}
                        </h3>

                        <button
                            onClick={() => handleMonthChange(1)}
                            className="p-2 rounded-lg hover:bg-[#FFF2F2] text-[#2D336B] transition-colors"
                            aria-label="Next month"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-[#64748b] p-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array(firstDayOfMonth).fill(null).map((_, index) => (
                            <div key={`empty-${index}`} className="bg-gray-100 h-12" />
                        ))}

                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                            const date = new Date(currentYear, currentMonth - 1, day);
                            const dateStr = format(date, 'yyyy-MM-dd');
                            const dayData = calendarData.find(d => d.date === dateStr);
                            const isPastDate = dateStr < today;

                            return (
                                <div
                                    key={day}
                                    className={`p-2 text-center border rounded h-12 flex items-center justify-center 
                                        ${dayData?.available && !isPastDate ?
                                            'bg-green-100 hover:bg-green-200 cursor-pointer' :
                                            'bg-red-100 hover:bg-red-200 cursor-not-allowed'}
                                        ${dateStr === today ? 'border-2 border-blue-500' : 'border-gray-200'}`}
                                    onClick={() => {
                                        if (dayData?.available && !isPastDate) {
                                            const currentTime = localFormData.pickup_time ?
                                                new Date(localFormData.pickup_time).toTimeString().slice(0, 5) :
                                                new Date().toTimeString().slice(0, 5);

                                            setLocalFormData(prev => ({
                                                ...prev,
                                                pickup_time: `${dateStr}T${currentTime}`
                                            }));
                                        }
                                    }}
                                >
                                    <span className={`font-medium ${dayData?.available && !isPastDate ? 'text-green-800' : 'text-red-800'}`}>
                                        {day}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-center gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-sm bg-green-100 border border-green-300"></div>
                            <span>Available</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-sm bg-red-100 border border-red-300"></div>
                            <span>Booked</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-300"></div>
                            <span>Past Date</span>
                        </div>
                    </div>
                </div>
            );
        }, [calendarData, currentDate, localFormData.pickup_time]);

        return (
            <Dialog open={showBookingModal} onClose={onClose} className="relative z-50">
                <div className="fixed inset-0 bg-[#2D336B]/30 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
                    <Dialog.Panel className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-[#A9B5DF] max-h-[90vh] overflow-y-auto">
                        <div className="flex flex-col md:flex-row h-full">
                            {/* Calendar Section */}
                            <div className={`w-full ${isMobile ? '' : 'md:w-1/2'} p-6 bg-[#2D336B]`}>
                                <div className="flex justify-between items-center mb-6">
                                    <Dialog.Title className="text-2xl font-bold text-white">
                                        Select Date & Time
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-full hover:bg-[#A9B5DF]/20 text-white"
                                        aria-label="Close booking modal"
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
                                            <ImageGallery images={bookingCab?.images || []} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#2D336B]">{bookingCab?.make} {bookingCab?.model}</h4>
                                            <p className="text-sm text-[#7886C7]">{bookingCab?.driver_name}</p>
                                            <p className="text-sm text-[#7886C7]">{bookingCab?.driver_contact_number}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Form Section */}
                            <div className={`w-full ${isMobile ? '' : 'md:w-1/2'} p-6 overflow-y-auto`}>
                                <Dialog.Title className="text-2xl font-bold text-[#2D336B] mb-6">
                                    Complete Your Booking
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Form fields */}
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
                                            aria-label="Estimated trip duration"
                                        />
                                    </div>

                                    {/* Pickup time input */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-[#2D336B]">
                                            Pickup Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="pickup_time"
                                            className={`w-full p-3 border ${localErrors.pickup_time ? 'border-red-500' : 'border-[#A9B5DF]'} rounded-lg focus:ring-2 focus:ring-[#7886C7] focus:border-[#7886C7]`}
                                            value={localFormData.pickup_time}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().slice(0, 16)}
                                            required
                                            aria-invalid={!!localErrors.pickup_time}
                                            aria-describedby="pickupTimeError"
                                        />
                                        {localErrors.pickup_time && (
                                            <p id="pickupTimeError" className="text-red-500 text-sm mt-1">
                                                {localErrors.pickup_time}
                                            </p>
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

                                    {/* Pickup location input */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-[#2D336B]">
                                            Pickup Location
                                        </label>
                                        <input
                                            type="text"
                                            name="pickup_location"
                                            className={`w-full p-3 border ${localErrors.pickup_location ? 'border-red-500' : 'border-[#A9B5DF]'} rounded-lg focus:ring-2 focus:ring-[#7886C7] focus:border-[#7886C7]`}
                                            value={localFormData.pickup_location}
                                            onChange={handleInputChange}
                                            required
                                            aria-invalid={!!localErrors.pickup_location}
                                            aria-describedby="pickupLocationError"
                                        />
                                        {localErrors.pickup_location && (
                                            <p id="pickupLocationError" className="text-red-500 text-sm mt-1">
                                                {localErrors.pickup_location}
                                            </p>
                                        )}
                                    </div>

                                    {/* Dropoff location input */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-[#2D336B]">
                                            Dropoff Location
                                        </label>
                                        <input
                                            type="text"
                                            name="dropoff_location"
                                            className={`w-full p-3 border ${localErrors.dropoff_location ? 'border-red-500' : 'border-[#A9B5DF]'} rounded-lg focus:ring-2 focus:ring-[#7886C7] focus:border-[#7886C7]`}
                                            value={localFormData.dropoff_location}
                                            onChange={handleInputChange}
                                            required
                                            aria-invalid={!!localErrors.dropoff_location}
                                            aria-describedby="dropoffLocationError"
                                        />
                                        {localErrors.dropoff_location && (
                                            <p id="dropoffLocationError" className="text-red-500 text-sm mt-1">
                                                {localErrors.dropoff_location}
                                            </p>
                                        )}
                                    </div>

                                    {/* Distance input */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-[#2D336B]">
                                            Distance (km)
                                        </label>
                                        <input
                                            type="number"
                                            name="distance_km"
                                            className={`w-full p-3 border ${localErrors.distance_km ? 'border-red-500' : 'border-[#A9B5DF]'} rounded-lg focus:ring-2 focus:ring-[#7886C7] focus:border-[#7886C7]`}
                                            value={localFormData.distance_km}
                                            onChange={(e) => handleInputChange({
                                                target: {
                                                    name: "distance_km",
                                                    value: Math.max(1, Number(e.target.value))
                                                }
                                            })}
                                            min="1"
                                            required
                                            aria-invalid={!!localErrors.distance_km}
                                            aria-describedby="distanceError"
                                        />
                                        {localErrors.distance_km && (
                                            <p id="distanceError" className="text-red-500 text-sm mt-1">
                                                {localErrors.distance_km}
                                            </p>
                                        )}
                                    </div>

                                    {/* Price calculation */}
                                    <div className="pt-4 border-t border-[#A9B5DF]">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-sm text-[#7886C7]">Price per km</p>
                                            <p className="font-medium text-[#2D336B]">₹{bookingCab?.price_per_km}</p>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-sm text-[#7886C7]">Distance</p>
                                            <p className="font-medium text-[#2D336B]">{localFormData.distance_km} km</p>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-[#A9B5DF]">
                                            <p className="text-sm font-semibold text-[#2D336B]">Total Amount</p>
                                            <p className="text-xl font-bold text-[#2D336B]">
                                                ₹{(bookingCab?.price_per_km * localFormData.distance_km).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Form actions */}
                                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-6 py-3 border border-[#A9B5DF] text-[#2D336B] rounded-lg hover:bg-[#FFF2F2] transition-colors font-medium"
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
                                                `Pay ₹${(bookingCab?.price_per_km * localFormData.distance_km).toFixed(2)}`
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
    });

    return (
        <AuthenticatedLayout>
            <Head title="Cabs" />

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;  
                    scrollbar-width: none; 
                }
            `}</style>

            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="section-header text-center px-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="section-subtitle text-[#7886C7] mb-2">Find Your Ride</p>
                        <h2 className="h2 section-title text-3xl sm:text-4xl font-bold text-[#2D336B] mb-4">Available Cabs</h2>
                        <p className="section-text text-gray-600 max-w-2xl mx-auto">
                            Discover our fleet of comfortable and reliable cabs. Book your ride now for a seamless travel experience.
                        </p>
                    </motion.div>

                    {/* Search and Filters Section */}
                    <div className="mt-8 px-4">
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
                                        aria-label="Search cabs"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="px-6 py-3 bg-[#2D336B] text-white rounded-lg hover:bg-[#7886C7] transition-colors flex items-center justify-center gap-2"
                                    aria-label={`${showFilters ? 'Hide' : 'Show'} filters`}
                                >
                                    <ion-icon name={showFilters ? "filter" : "filter-outline"}></ion-icon>
                                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                                </button>
                            </div>

                            {/* Advanced Filters */}
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
                                                    onChange={(e) => setSearchFilters({ ...searchFilters, priceRange: [searchFilters.priceRange[0], parseInt(e.target.value) || 100] })}
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

                    {/* Cabs List */}
                    {filteredCabs.length === 0 ? (
                        <div className="text-center py-12">
                            <h2 className="text-xl font-medium text-[#2D336B]">No cabs found matching your criteria</h2>
                            <button
                                onClick={resetFilters}
                                className="mt-4 px-6 py-3 bg-[#2D336B] text-white rounded-lg hover:bg-[#7886C7] transition-colors"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 px-4">
                            {filteredCabs.map(cab => (
                                <CabCard
                                    key={cab.id}
                                    cab={cab}
                                    onSelect={setSelectedCab}
                                    onBook={(cab) => {
                                        setBookingCab(cab);
                                        setShowBookingModal(true);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Selected Cab Details */}
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

                        <div className="flex-1 overflow-y-auto">
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/2 p-6 bg-[#7886C7]/10">
                                    <div className="h-96 rounded-lg overflow-hidden border border-[#A9B5DF] bg-white">
                                        <ImageGallery
                                            images={selectedCab.images || []}
                                        />
                                    </div>
                                </div>

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

                        <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-[#A9B5DF]">
                            <button
                                className="px-6 py-3 border border-[#A9B5DF] text-[#2D336B] rounded-lg hover:bg-[#7886C7]/10 transition-colors font-medium"
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

            {showBookingModal && (
                <BookingModal
                    bookingCab={bookingCab}
                    isMobile={isMobile}
                    onClose={closeBookingModal}
                />
            )}
        </AuthenticatedLayout>
    );
};

export default Cabs;