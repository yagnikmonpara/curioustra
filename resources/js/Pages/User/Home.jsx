import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import '../../../css/travel.css';

export default function Home() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };
    
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

                {/* Notification and Recent Activities Side-by-Side */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Notification Box */}
                            <div className="bg-sky-50 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Notifications</h2>
                                <div className="space-y-4">
                                    {notifications.map((notification) => (
                                        <div key={notification.id} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                            <h3 className="text-lg font-semibold text-slate-900">{notification.title}</h3>
                                            <p className="text-slate-700">{notification.message}</p>
                                            <p className="text-sm text-slate-500 mt-2">{notification.timestamp}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity Box */}
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Recent Activity</h2>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="p-4 bg-sky-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                            <p className="text-slate-700">
                                                <span className="font-semibold">{activity.user}</span> {activity.activity}
                                            </p>
                                            <p className="text-sm text-slate-500 mt-2">{activity.timestamp}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">About Us</h2>
                            <p className="text-xl text-slate-700 mb-8">
                                At TravelEase, we are passionate about creating unforgettable travel experiences. 
                                From luxury resorts to thrilling adventures, we offer handpicked packages tailored to your needs.
                            </p>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                                <Link href="/about">Learn More</Link>
                    </motion.button>
                        </motion.div>
                </div>
            </section>

                {/* Contact/Enquiry Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Contact Us</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                    <label className="block text-slate-700 mb-2 font-medium">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                    <label className="block text-slate-700 mb-2 font-medium">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                    <label className="block text-slate-700 mb-2 font-medium">Mobile Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                    <label className="block text-slate-700 mb-2 font-medium">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                                    required
                                ></textarea>
                            </div>
                            <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                type="submit"
                                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Send Message
                            </motion.button>
                        </form>
                        </motion.div>
                </div>
            </section>
        </AuthenticatedLayout>
        </>
    );
}