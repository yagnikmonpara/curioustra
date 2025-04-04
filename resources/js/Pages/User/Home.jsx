import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useForm } from '@inertiajs/react';
import {
    UserIcon,
    UsersIcon,
    StarIcon,
    TruckIcon,
    MapIcon,
    BellIcon,
    ClockIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    ChatBubbleLeftRightIcon,
    ArrowRightIcon,
    InformationCircleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import '../../../css/travel.css';

export default function Home() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        response: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                setData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    response: '',
                    message: ''
                });
            }
        });
    };

    const services = [
        {
            title: "Family Tours",
            icon: <UsersIcon className="h-8 w-8 text-white" />,
            description: "Curated family tours ensuring fun and safety for all ages.",
            url: '/images/family.png'
        },
        {
            title: "Solo Trips",
            icon: <UserIcon className="h-8 w-8 text-white" />,
            description: "Exciting solo travel packages for the adventurous explorer.",
            url: '/images/trip.png'
        },
        {
            title: "Exclusive Packages",
            icon: <StarIcon className="h-8 w-8 text-white" />,
            description: "Special packages with unique experiences and added benefits.",
            url: '/images/package.png'
        },
        {
            title: "Cabs Booking",
            icon: <TruckIcon className="h-8 w-8 text-white" />,
            description: "Convenient and reliable cab bookings for local and outstation travel.",
            url: '/images/cab.png'
        },
        {
            title: "Community Posts",
            icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />,
            description: "Engage with fellow travelers and share experiences in our active community.",
            url: '/images/community.jpg'
        },
        {
            title: "Provide Guides",
            icon: <MapIcon className="h-8 w-8 text-white" />,
            description: "Experienced guides to enhance your travel experience with local insights.",
            url: '/images/guide.png'
        },
    ];

    // Notification Data
    const notifications = [
        {
            id: 1,
            title: "New Package Alert!",
            message: "Check out our latest Luxury Beach Resort Experience in the Maldives.",
            timestamp: "2 hours ago"
        },
        {
            id: 2,
            title: "Special Discount",
            message: "Get 20% off on all Alpine Ski Adventure Packages. Book now!",
            timestamp: "5 hours ago"
        },
        {
            id: 3,
            title: "Travel Advisory",
            message: "Stay updated with the latest travel guidelines for your destination.",
            timestamp: "1 day ago"
        }
    ];

    // Recent Activity Data
    const recentActivities = [
        {
            id: 1,
            activity: "Booked a trip to the Maldives",
            user: "John Doe",
            timestamp: "3 hours ago"
        },
        {
            id: 2,
            activity: "Saved the Amazon Rainforest Adventure package",
            user: "Jane Smith",
            timestamp: "6 hours ago"
        },
        {
            id: 3,
            activity: "Reviewed the Cultural Heritage Tour",
            user: "Alice Johnson",
            timestamp: "1 day ago"
        }
    ];

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Home" />

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -z-10 w-72 h-72 bg-sky-100 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 -z-10 w-72 h-72 bg-sky-100 rounded-full blur-3xl opacity-30"></div>

                {/* Welcome Section */}
                <section className="py-20 relative bg-cover bg-center" style={{ backgroundImage: "url('/images/home-hero3.png')" }}>
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h1 className="text-5xl font-bold text-white mb-4">
                                Welcome to CuriousTra
                            </h1>
                            <p className="text-xl text-white mb-8">
                                Your gateway to unforgettable travel experiences. Explore the world with us!
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Link href="/packages">Explore Packages</Link>
                            </motion.button>
                        </motion.div>
                    </div>
                </section>

                {/* Notification and Recent Activities */}
                <section className="py-16 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Notifications */}
                            <div className="bg-blue-50 p-6 rounded-xl shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <BellIcon className="h-6 w-6 text-blue-900" />
                                    <h2 className="text-2xl font-bold">Notifications</h2>
                                </div>
                                <div className="space-y-4">
                                    {notifications.map((notification) => (
                                        <div key={notification.id} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-blue-100 rounded-full">
                                                    <InformationCircleIcon className="h-5 w-5 text-blue-900" />
                                                </div>
                                                <h3 className="text-lg font-semibold">{notification.title}</h3>
                                            </div>
                                            <p className="text-gray-600">{notification.message}</p>
                                            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                                <ClockIcon className="h-4 w-4" />
                                                <span>{notification.timestamp}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <ClockIcon className="h-6 w-6 text-blue-900" />
                                    <h2 className="text-2xl font-bold">Recent Activity</h2>
                                </div>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="p-4 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-full">
                                                    <UserIcon className="h-5 w-5 text-blue-900" />
                                                </div>
                                                <div>
                                                    <p className="text-gray-700">
                                                        <span className="font-semibold">{activity.user}</span> {activity.activity}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                                        <ClockIcon className="h-4 w-4" />
                                                        <span>{activity.timestamp}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-16 bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="h2 section-title">Our Services</h2>
                            <p className="section-text">
                                Explore our comprehensive travel services designed to make your journey seamless and memorable.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                    whileHover={{ y: -10 }}
                                >
                                    <div className="relative h-48">
                                        <img
                                            src={service.url}
                                            alt={service.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                            <div className="text-white">{service.icon}</div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                        <p className="text-gray-600">{service.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="py-16 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                className="relative h-96"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="absolute inset-0 border-[50px] border-transparent border-r-blue-900 border-l-blue-900 transform -rotate-2">
                                    <img
                                        src="/images/about-img.jpg"
                                        className="w-full h-full object-cover transform rotate-2"
                                        alt="About Us"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                className="space-y-6 bg-white p-8 rounded-lg shadow-lg"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-4xl font-bold text-blue-900">Welcome to CuriousTra</h2>
                                <p className="text-lg text-gray-600">
                                    Your gateway to unforgettable travel experiences. From luxury resorts to thrilling adventures,
                                    we offer handpicked packages tailored to your needs.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        'First Class Flights',
                                        'Handpicked Hotels',
                                        '5 Star Accommodations',
                                        'Latest Model Vehicles',
                                        '150 Premium City Tours',
                                        '24/7 Customer Support'
                                    ].map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <ArrowRightIcon className="h-5 w-5 text-blue-900" />
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    href="#contact"
                                    className="inline-block bg-blue-900 text-white px-8 py-3 rounded-full hover:bg-blue-800 transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-16 bg-gray-50 dark:bg-gray-900" id="contact">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="bg-white rounded-2xl shadow-xl overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                                {/* Contact Info */}
                                <div className="space-y-8">
                                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                                        <MapPinIcon className="h-6 w-6 text-blue-900 mx-auto mb-4" />
                                        <h4 className="text-xl font-bold mb-2 text-blue-900">Address</h4>
                                        <p className="text-gray-600">123 Travel Street<br />New York, USA</p>
                                    </div>
                                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                                        <PhoneIcon className="h-6 w-6 text-blue-900 mx-auto mb-4" />
                                        <h4 className="text-xl font-bold mb-2 text-blue-900">Phone</h4>
                                        <p className="text-gray-600">+1 234 567 890<br />+1 987 654 321</p>
                                    </div>
                                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                                        <EnvelopeIcon className="h-6 w-6 text-blue-900 mx-auto mb-4" />
                                        <h4 className="text-xl font-bold mb-2 text-blue-900">Email</h4>
                                        <p className="text-gray-600">info@curioustra.com<br />support@curioustra.com</p>
                                    </div>
                                </div>

                                {/* Contact Form */}
                                <div className="md:col-span-2">
                                    <h3 className="text-3xl font-bold mb-6 text-blue-900">Send Us a Message</h3>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-700 mb-2">Name</label>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            {errors.phone && <p className="text-red-500 text-sm mt-1">
                                                {errors.phone.replace('phone', 'Phone number').replace('digits', 'digits long')}
                                            </p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2">Subject</label>
                                            <input
                                                type="text"
                                                value={data.subject}
                                                onChange={(e) => setData('subject', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                                        </div>


                                        <div>
                                            <label className="block text-gray-700 mb-2">Message</label>
                                            <textarea
                                                value={data.message}
                                                onChange={(e) => setData('message', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40"
                                                required
                                            ></textarea>
                                            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="w-full bg-blue-900 text-white py-4 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                'Send Message'
                                            )}
                                        </motion.button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </AuthenticatedLayout>
        </>
    );
}