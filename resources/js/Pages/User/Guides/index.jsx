import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState, useEffect, Fragment, useMemo } from "react";
import { motion } from "framer-motion";
import { Dialog, Transition } from '@headlessui/react';
import axios from "axios";
import { format, isToday, addMonths, subMonths } from 'date-fns';

// Icon components
const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2D336B]" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2D336B]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2D336B]"></div>
);

const Guides = ({ guides }) => {
    const { auth } = usePage().props;
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState({
        start_time: format(new Date(), 'yyyy-MM-dd') + 'T12:00',
        duration: 2,
        meeting_location: ''
    });
    const [loading, setLoading] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [calendarData, setCalendarData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        specialization: '',
        languages: [],
        priceRange: [0, 10000],
        rating: 0,
        location: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (window.Razorpay) return;
        
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // Only fetch if selectedGuide has required properties
        if (selectedGuide?.id && currentDate) {
            fetchAvailabilityCalendar();
        }
    }, [currentDate, selectedGuide]);

    // Enhanced filtered guides calculation
    const filteredGuides = useMemo(() => {
        return guides.filter(guide => {
            const guideLanguages = Array.isArray(guide.languages)
                ? guide.languages
                : typeof guide.languages === 'string'
                    ? guide.languages.split(',').map(l => l.trim())
                    : [];

            const matchesSearch = `${guide.name} ${guide.specialization} ${guide.bio}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const matchesSpecialization = !searchFilters.specialization ||
                guide.specialization.toLowerCase().includes(searchFilters.specialization.toLowerCase());

            const matchesLanguages = searchFilters.languages.length === 0 ||
                searchFilters.languages.every(lang =>
                    guideLanguages.map(l => l.toLowerCase()).includes(lang.toLowerCase())
                );

            const matchesPrice = guide.price_per_hour >= searchFilters.priceRange[0] &&
                guide.price_per_hour <= searchFilters.priceRange[1];

            // Updated line to handle undefined/null ratings
            const matchesRating = (guide.rating || 0) >= searchFilters.rating;

            const matchesLocation = !searchFilters.location ||
                guide.location.toLowerCase().includes(searchFilters.location.toLowerCase());

            return matchesSearch && matchesSpecialization && matchesLanguages &&
                matchesPrice && matchesRating && matchesLocation;
        });
    }, [guides, searchQuery, searchFilters]);

    const fetchAvailabilityCalendar = async () => {
        if (!selectedGuide) return;

        setLoading(true);
        try {
            const response = await axios.get(route('guides.availability-calendar'), {
                params: {
                    guide_id: selectedGuide.id,
                    month: currentDate.getMonth() + 1, // JavaScript months are 0-11
                    year: currentDate.getFullYear()
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.calendar) {
                setCalendarData(response.data.calendar);
            } else {
                throw new Error('Invalid calendar data format');
            }
        } catch (error) {
            console.error('Calendar data fetch failed:', error);
            setErrors(prev => ({
                ...prev,
                calendar: error.response?.data?.message || 'Failed to load availability calendar'
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleMonthChange = (increment) => {
        setCurrentDate(increment > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    };

    useEffect(() => {
        fetchAvailabilityCalendar();
    }, [currentDate, selectedGuide]);

    const validateBooking = () => {
        const newErrors = {};
        if (!bookingDetails.start_time) {
            newErrors.start_time = 'Start time is required';
        }
        if (bookingDetails.duration < 1 || bookingDetails.duration > 8) {
            newErrors.duration = 'Duration must be between 1 and 8 hours';
        }
        if (!bookingDetails.meeting_location) {
            newErrors.meeting_location = 'Meeting location is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async () => {
        if (!validateBooking()) return;

        setPaymentProcessing(true);
        try {
            const [bookingDate, bookingTime] = bookingDetails.start_time.split('T');

            const response = await axios.post(route('guides.book'), {
                guide_id: selectedGuide.id,
                booking_date: bookingDate,
                booking_time: bookingTime,
                duration_hours: bookingDetails.duration,
                meeting_location: bookingDetails.meeting_location,
                _token: auth.csrf_token
            });

            const options = {
                key: response.data.razorpay_key,
                amount: response.data.amount,
                currency: 'INR',
                order_id: response.data.order_id,
                handler: async (razorpayResponse) => {
                    try {
                        await axios.post(route('guides.payment'), {
                            payment_id: razorpayResponse.razorpay_payment_id,
                            _token: auth.csrf_token
                        });
                        window.location.href = route('bookings');
                    } catch (error) {
                        setErrors(prev => ({ ...prev, payment: 'Payment verification failed' }));
                    }
                },
                prefill: {
                    name: auth.user.name,
                    email: auth.user.email,
                    contact: auth.user.phone || ''
                },
                theme: { color: '#2D336B' }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                booking: error.response?.data?.message || 'Booking failed. Please try again.'
            }));
        } finally {
            setPaymentProcessing(false);
        }
    };

    // Calendar View Component
    const CalendarView = () => {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        // Get today's date in YYYY-MM-DD format for comparison
        const today = format(new Date(), 'yyyy-MM-dd');

        const days = Array.from({ length: firstDayOfMonth }, () => null)
            .concat(...Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dateStr = format(date, 'yyyy-MM-dd');
                const dayData = calendarData.find(d => d.date === dateStr);

                // Check if date is in the past
                const isPastDate = dateStr < today;

                return {
                    day,
                    date: dateStr,
                    available: dayData ? dayData.available : false,
                    isToday: isToday(date),
                    isPastDate
                };
            }));

        return (
            <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => handleMonthChange(-1)}
                        className="p-2 rounded-lg hover:bg-[#FFF2F2] text-[#2D336B] disabled:opacity-50 transition-colors"
                        disabled={loading || (currentDate <= new Date() && currentDate.getMonth() <= new Date().getMonth())}
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
                        disabled={loading}
                        aria-label="Next month"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="text-center text-sm font-medium text-[#64748b] p-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day, index) => {
                                const isSelected = bookingDetails.start_time.startsWith(day?.date || '');
                                const isPastDate = day?.date && new Date(day.date) < new Date(new Date().setHours(0, 0, 0, 0));

                                return (
                                    <button
                                        key={index}
                                        className={`
            p-2 text-center border rounded-lg h-12 flex flex-col items-center justify-center transition-all
            ${!day ? 'bg-gray-50' : ''}
            ${day?.available && !day?.isPastDate ?
                                                'bg-green-50 hover:bg-green-100 cursor-pointer' :
                                                'bg-red-50 hover:bg-red-100 cursor-not-allowed'
                                            }
            ${day?.isToday ? 'border-2 border-blue-500' : 'border-gray-200'}
            ${isSelected ? 'ring-2 ring-[#2D336B] bg-[#2D336B]/10' : ''}
        `}
                                        onClick={() => {
                                            if (day?.available && !day?.isPastDate) {
                                                const currentTime = bookingDetails.start_time
                                                    ? bookingDetails.start_time.slice(11, 16)
                                                    : '12:00';
                                                setBookingDetails(prev => ({
                                                    ...prev,
                                                    start_time: `${day.date}T${currentTime}`
                                                }));
                                            }
                                        }}
                                        disabled={!day?.available || day?.isPastDate}
                                        aria-label={`${day?.day || ''} ${day?.available ? 'Available' : 'Unavailable'}`}
                                    >
                                        {day && (
                                            <>
                                                <span className={`
                          text-sm font-medium
                          ${day.available && !isPastDate ?
                                                        (isSelected ? 'text-[#2D336B] font-bold' : 'text-green-800') :
                                                        'text-red-800'
                                                    }
                        `}>
                                                    {day.day}
                                                </span>
                                                {day.isToday && (
                                                    <span className="w-1 h-1 rounded-full bg-blue-500 mt-1"></span>
                                                )}
                                            </>
                                        )}
                                    </button>
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
                    </>
                )}
            </div>
        );
    };

    const GuideCard = ({ guide }) => {
        const [isHovered, setIsHovered] = useState(false);
        const languages = useMemo(() => {
            if (Array.isArray(guide.languages)) return guide.languages;
            if (typeof guide.languages === 'string') return guide.languages.split(',').map(l => l.trim());
            return [];
        }, [guide.languages]);

        return (
            <motion.div
                className="w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <div className="relative h-72 w-full overflow-hidden">
                    <img
                        src={guide.profile_picture || '/images/default-guide.jpg'}
                        alt={guide.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/default-guide.jpg';
                        }}
                    />

                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end p-6"
                        animate={{ opacity: isHovered ? 1 : 0.8 }}
                    >
                        <div className="text-white w-full">
                            <h3 className="text-2xl font-bold mb-1">{guide.name}</h3>
                            <p className="text-sm text-gray-300 mb-3">{guide.specialization}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {languages.map(lang => (
                                    <span
                                        key={lang}
                                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium capitalize"
                                    >
                                        {lang.trim()}
                                    </span>
                                ))}
                                {languages.length > 3 && (
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                                        +{languages.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-[#2D336B] shadow-sm">
                        ₹{guide.price_per_hour}/hr
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <LocationIcon />
                                <span>{guide.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <StarIcon />
                                <span>{guide.rating} • {guide.tours_completed} tours</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-6 line-clamp-2">
                        {guide.bio}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setSelectedGuide(guide)}
                            className="flex-1 py-3 px-4 border border-[#2D336B] text-[#2D336B] rounded-lg hover:bg-[#2D336B]/10 transition-colors flex items-center justify-center gap-2"
                            aria-label={`View details for ${guide.name}`}
                        >
                            <InfoIcon />
                            Details
                        </button>
                        <button
                            onClick={() => {
                                setSelectedGuide(guide);
                                setShowBookingModal(true);
                            }}
                            className="flex-1 py-3 px-4 bg-[#2D336B] text-white rounded-lg hover:bg-[#1a2257] transition-colors flex items-center justify-center gap-2"
                            aria-label={`Book ${guide.name}`}
                        >
                            <CalendarIcon />
                            Book Now
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    const BookingModal = () => {
        if (!selectedGuide) return null;
        return (
            <Dialog
                open={showBookingModal}
                onClose={() => !paymentProcessing && setShowBookingModal(false)}
                className="relative z-50"
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all">
                            <div className="flex flex-col md:flex-row min-h-[600px]">
                                {/* Calendar Section */}
                                <div className="w-full md:w-2/5 bg-gradient-to-b from-[#2D336B] to-[#7886C7] p-6 flex flex-col">
                                    <div className="flex justify-between items-center mb-6">
                                        <Dialog.Title className="text-2xl font-bold text-white">
                                            Select Date & Time
                                        </Dialog.Title>
                                        <button
                                            onClick={() => setShowBookingModal(false)}
                                            disabled={paymentProcessing}
                                            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="bg-white rounded-xl p-4 shadow-sm flex-1">
                                        <CalendarView />
                                    </div>

                                    <div className="mt-4 text-white text-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-4 h-4 rounded-sm bg-green-100 border border-green-300"></div>
                                            <span>Available</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-sm bg-red-100 border border-red-300"></div>
                                            <span>Unavailable</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-3/5 p-8">
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <div className="flex items-center gap-4 mb-6">
                                            <img
                                                src={selectedGuide.profile_picture || '/images/default-guide.jpg'}
                                                alt={selectedGuide.name}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-[#2D336B]"
                                            />
                                            <div>
                                                <Dialog.Title className="text-2xl font-bold text-gray-800">
                                                    Book {selectedGuide.name}
                                                </Dialog.Title>
                                                <p className="text-gray-600">{selectedGuide.specialization}</p>
                                            </div>
                                        </div>

                                        {/* Form fields similar to cabs page */}
                                        <div className="space-y-5">
                                            {/* Start Time */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Start Time
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2D336B] focus:border-[#2D336B] ${errors.start_time ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    value={bookingDetails.start_time}
                                                    onChange={(e) => setBookingDetails(prev => ({
                                                        ...prev,
                                                        start_time: e.target.value
                                                    }))}
                                                    min={format(new Date(), 'yyyy-MM-dd') + 'T00:00'}
                                                />
                                            </div>

                                            {/* Duration Selector */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Duration (hours)
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setBookingDetails(prev => ({
                                                            ...prev,
                                                            duration: Math.max(1, prev.duration - 1)
                                                        }))}
                                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        className="w-20 text-center p-2 border rounded-lg"
                                                        value={bookingDetails.duration}
                                                        onChange={(e) => setBookingDetails(prev => ({
                                                            ...prev,
                                                            duration: Math.min(8, Math.max(1, parseInt(e.target.value) || 1))
                                                        }))}
                                                        min="1"
                                                        max="8"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setBookingDetails(prev => ({
                                                            ...prev,
                                                            duration: Math.min(8, prev.duration + 1)
                                                        }))}
                                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Meeting Location */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Meeting Location
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2D336B] focus:border-[#2D336B] ${errors.meeting_location ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    value={bookingDetails.meeting_location}
                                                    onChange={(e) => setBookingDetails(prev => ({
                                                        ...prev,
                                                        meeting_location: e.target.value
                                                    }))}
                                                    placeholder="Enter meeting location"
                                                />
                                            </div>

                                            {/* Payment Summary */}
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                                <h4 className="font-semibold text-gray-800 mb-3">Booking Summary</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Guide Rate:</span>
                                                        <span>₹{selectedGuide.price_per_hour}/hour</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Duration:</span>
                                                        <span>{bookingDetails.duration} hours</span>
                                                    </div>
                                                    <div className="border-t border-gray-200 my-2"></div>
                                                    <div className="flex justify-between font-bold text-lg text-[#2D336B]">
                                                        <span>Total:</span>
                                                        <span>₹{(selectedGuide.price_per_hour * bookingDetails.duration).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Button */}
                                            <button
                                                type="button"
                                                onClick={handlePayment}
                                                className="w-full py-3 bg-gradient-to-r from-[#2D336B] to-[#7886C7] text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
                                                disabled={paymentProcessing}
                                            >
                                                {paymentProcessing ? (
                                                    <>
                                                        <LoadingSpinner />
                                                        Processing Payment...
                                                    </>
                                                ) : (
                                                    'Confirm & Pay'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        );
    };

    const GuideDetailsModal = () => {
        if (!selectedGuide) return null;
        const languages = useMemo(() => {
            if (Array.isArray(selectedGuide.languages)) return selectedGuide.languages;
            if (typeof selectedGuide.languages === 'string') return selectedGuide.languages.split(',').map(l => l.trim());
            return [];
        }, [selectedGuide.languages]);

        return (
            <Dialog open={!!selectedGuide} onClose={() => setSelectedGuide(null)} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all">
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/3 bg-gradient-to-b from-[#2D336B] to-[#7886C7] p-8 text-white">
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={selectedGuide?.profile_picture || '/images/default-guide.jpg'}
                                            alt={selectedGuide?.name}
                                            className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-lg mb-6"
                                        />
                                        <h2 className="text-2xl font-bold text-center mb-1">{selectedGuide?.name}</h2>
                                        <p className="text-gray-200 text-center mb-6">{selectedGuide?.specialization}</p>

                                        <div className="w-full space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/10 rounded-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-300">Rate</p>
                                                    <p className="font-semibold">₹{selectedGuide?.price_per_hour}/hour</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/10 rounded-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-300">Location</p>
                                                    <p className="font-semibold">{selectedGuide?.location || 'Not specified'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/10 rounded-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-300">Contact</p>
                                                    <p className="font-semibold">{selectedGuide?.contact_number}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-2/3 p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <Dialog.Title className="text-2xl font-bold text-gray-800">
                                            Guide Details
                                        </Dialog.Title>
                                        <button
                                            onClick={() => setSelectedGuide(null)}
                                            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                                            aria-label="Close guide details"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                                            <p className="text-gray-600">{selectedGuide?.bio || 'No bio available'}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Languages</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {languages.map(lang => (
                                                    <span
                                                        key={lang}
                                                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium capitalize"
                                                    >
                                                        {lang.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Experience</h3>
                                                <p className="text-gray-600">{selectedGuide?.experience || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tours Completed</h3>
                                                <p className="text-gray-600">{selectedGuide?.tours_completed || '50+'}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Rating</h3>
                                                <div className="flex items-center gap-1">
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <svg
                                                                key={star}
                                                                className={`h-5 w-5 ${star <= Math.floor(selectedGuide?.rating || 4.5) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className="text-gray-600">{selectedGuide?.rating || '4.5'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4">
                                            <button
                                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                                                onClick={() => setSelectedGuide(null)}
                                            >
                                                Close
                                            </button>
                                            <button
                                                className="px-6 py-3 bg-gradient-to-r from-[#2D336B] to-[#7886C7] text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-md"
                                                onClick={() => {
                                                    setShowBookingModal(true);
                                                    setSelectedGuide(null);
                                                }}
                                            >
                                                Book This Guide
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Guides" />

            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="section-header text-center px-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="section-subtitle text-[#7886C7] mb-2">Find Your Guide</p>
                        <h2 className="h2 section-title text-3xl sm:text-4xl font-bold text-[#2D336B] mb-4">
                            Professional Tour Guides
                        </h2>
                        <p className="section-text text-gray-600 max-w-2xl mx-auto">
                            Connect with our certified guides to enhance your travel experience
                        </p>
                    </motion.div>

                    {/* Search and Filters Section */}
                    <div className="mb-8 bg-white rounded-xl shadow-md p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Search guides..."
                                    className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D336B]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 py-3 bg-[#2D336B] text-white rounded-lg hover:bg-[#7886C7] transition-colors"
                            >
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>
                        </div>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 pt-4 border-t border-gray-200"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Specialization Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Specialization
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Any specialization"
                                            className="w-full p-2 border rounded-lg"
                                            value={searchFilters.specialization}
                                            onChange={(e) => setSearchFilters(prev => ({
                                                ...prev,
                                                specialization: e.target.value
                                            }))}
                                        />
                                    </div>

                                    {/* Price Range Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Price Range (per hour)
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                className="w-full p-2 border rounded-lg"
                                                value={searchFilters.priceRange[0]}
                                                onChange={(e) => setSearchFilters(prev => ({
                                                    ...prev,
                                                    priceRange: [Number(e.target.value), prev.priceRange[1]]
                                                }))}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                className="w-full p-2 border rounded-lg"
                                                value={searchFilters.priceRange[1]}
                                                onChange={(e) => setSearchFilters(prev => ({
                                                    ...prev,
                                                    priceRange: [prev.priceRange[0], Number(e.target.value)]
                                                }))}
                                            />
                                        </div>
                                    </div>

                                    {/* Rating Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Minimum Rating
                                        </label>
                                        <select
                                            className="w-full p-2 border rounded-lg"
                                            value={searchFilters.rating}
                                            onChange={(e) => setSearchFilters(prev => ({
                                                ...prev,
                                                rating: Number(e.target.value)
                                            }))}
                                        >
                                            <option value={0}>Any rating</option>
                                            <option value={4}>4★ & above</option>
                                            <option value={4.5}>4.5★ & above</option>
                                            <option value={5}>5★</option>
                                        </select>
                                    </div>

                                    {/* Location Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Any location"
                                            className="w-full p-2 border rounded-lg"
                                            value={searchFilters.location}
                                            onChange={(e) => setSearchFilters(prev => ({
                                                ...prev,
                                                location: e.target.value
                                            }))}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Languages (comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., English, Spanish, French"
                                            className="w-full p-2 border rounded-lg"
                                            value={searchFilters.languagesInput}
                                            onChange={(e) => {
                                                const langs = e.target.value.split(',')
                                                    .map(l => l.trim().toLowerCase());
                                                setSearchFilters(prev => ({
                                                    ...prev,
                                                    languages: langs,
                                                    languagesInput: e.target.value
                                                }));
                                            }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>


                    {/* Guides Grid */}
                    {filteredGuides.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-medium text-gray-600">
                                No guides found matching your criteria
                            </h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGuides.map(guide => (
                                <GuideCard key={guide.id} guide={guide} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <GuideDetailsModal />
            <BookingModal />
        </AuthenticatedLayout>
    );
};

export default Guides;