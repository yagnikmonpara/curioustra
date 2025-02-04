import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const FeaturedPackage = ({ title, description, price, image }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex flex-col p-6 bg-white rounded-lg shadow-lg dark:bg-gray-700"
    >
        <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-lg mb-4" />
        <h3 className="text-xl font-bold mb-2 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-auto">{price}</p>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Learn More
        </button>
    </motion.div>
);

const ReviewCard = ({ name, review, rating }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-700"
    >
        <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {name[0]}
            </div>
            <div className="ml-4">
                <h4 className="font-bold dark:text-white">{name}</h4>
                <div className="flex text-yellow-400">
                    {[...Array(rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                    ))}
                </div>
            </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300">{review}</p>
    </motion.div>
);

const Logo = () => (
    <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-center justify-center mb-8"
    >
        <div className="relative">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-2xl font-bold">CT</span>
            </div>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute -right-2 -bottom-2 w-6 h-6 bg-yellow-400 rounded-full"
            />
        </div>
        <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="ml-4 text-4xl font-bold text-white"
        >
            CuriousTra
        </motion.h1>
    </motion.div>
);

export default function Home() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const featuredPackages = [
        {
            title: 'Basic Package',
            description: 'Perfect for small businesses',
            price: '$99/month',
            image: '/images/package1.jpg'
        },
        {
            title: 'Pro Package',
            description: 'Ideal for growing companies',
            price: '$199/month',
            image: '/images/package2.jpg'
        },
        {
            title: 'Enterprise Package',
            description: 'For large organizations',
            price: '$299/month',
            image: '/images/package3.jpg'
        }
    ];

    const reviews = [
        { name: 'John Doe', review: 'Amazing service! Highly recommended.', rating: 5 },
        { name: 'Jane Smith', review: 'Great experience working with them.', rating: 4 },
        { name: 'Mike Johnson', review: 'Professional and reliable team.', rating: 5 }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Home" />

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative bg-blue-600 text-white py-20"
            >
                <div className="container mx-auto px-4">
                    <Logo />
                    <motion.p
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        className="text-xl mb-8 max-w-2xl text-center mx-auto"
                    >
                        Discover amazing features and services tailored for your needs
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex justify-center"
                    >
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors">
                            Get Started
                        </button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Featured Packages Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">Featured Packages</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredPackages.map((pkg, index) => (
                            <FeaturedPackage key={index} {...pkg} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="py-16 bg-gray-100 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">Client Reviews</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <ReviewCard key={index} {...review} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">Contact Us</h2>
                    <div className="max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border h-32 resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                ></textarea>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Send Message
                            </motion.button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">About Us</h3>
                            <p className="text-gray-400">
                                We provide innovative solutions for your business needs. Contact us to learn more about our services.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>Email: info@example.com</li>
                                <li>Phone: (123) 456-7890</li>
                                <li>Address: 123 Business St, City, Country</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 Your Company. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </AuthenticatedLayout>
    );
}
