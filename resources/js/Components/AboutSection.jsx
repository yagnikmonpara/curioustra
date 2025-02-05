import { motion } from 'framer-motion';
import '../../css/welcome.css';

export default function AboutSection() {
    return (
        <motion.section 
            className="about section" 
            id="about"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="container">
                <div className="about-grid">

                    <motion.div 
                        className="about-content"
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <h2 className="section-title text-4xl font-bold text-primary">About Us</h2>
                        <p className="about-text text-lg text-gray-700 mt-4 leading-relaxed">
                            We are passionate about creating unforgettable travel experiences. With years of expertise in the travel industry, we specialize in crafting personalized journeys that cater to your unique preferences and desires.
                        </p>
                        <h3 className="about-subtitle text-2xl font-semibold mt-6 text-secondary lg:text-3xl lg:mt-8 lg:mb-4 text-gray-500">Why Choose Us?</h3>
                        <ul className="about-list mt-3 space-y-2 text-gray-600">
                            <li className="flex items-center gap-2"><span className="text-primary">✔</span> Personalized itineraries tailored to your needs</li>
                            <li className="flex items-center gap-2"><span className="text-primary">✔</span> 24/7 customer support during your travels</li>
                            <li className="flex items-center gap-2"><span className="text-primary">✔</span> Exclusive deals and packages</li>
                        </ul>

                        <motion.button 
                            className="cta-button text-white px-6 py-3 rounded-lg mt-6 shadow-md bg-blue-600 hover:bg-blue-700 bolder"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            Learn More
                        </motion.button>

                        <div className="about-features grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                            <motion.div 
                                className="feature p-6 bg-white shadow-lg rounded-xl text-center"
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <span className="feature-icon text-3xl">✈️</span>
                                <h3 className="text-xl font-semibold mt-2">Expert Planning</h3>
                                <p className="text-gray-600 text-sm mt-1">Customized itineraries tailored to your preferences</p>
                            </motion.div>

                            <motion.div 
                                className="feature p-6 bg-white shadow-lg rounded-xl text-center"
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <span className="feature-icon text-3xl">🌟</span>
                                <h3 className="text-xl font-semibold mt-2">Quality Service</h3>
                                <p className="text-gray-600 text-sm mt-1">24/7 support throughout your journey</p>
                            </motion.div>

                            <motion.div 
                                className="feature p-6 bg-white shadow-lg rounded-xl text-center"
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <span className="feature-icon text-3xl">💰</span>
                                <h3 className="text-xl font-semibold mt-2">Best Value</h3>
                                <p className="text-gray-600 text-sm mt-1">Competitive prices without compromising quality</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}
