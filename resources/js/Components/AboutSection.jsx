import { motion } from 'framer-motion';
import '../../css/tourly.css';

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
                        className="about-image"
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e" 
                            alt="About Us" 
                            className="rounded-lg shadow-xl"
                        />
                    </motion.div>

                    <motion.div 
                        className="about-content"
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <h2 className="section-title">About Us</h2>
                        <p className="about-text">
                            We are passionate about creating unforgettable travel experiences. With years of expertise in the travel industry, we specialize in crafting personalized journeys that cater to your unique preferences and desires.
                        </p>
                        <h3 className="about-subtitle">Why Choose Us?</h3>
                        <ul className="about-list">
                            <li>Personalized itineraries tailored to your needs</li>
                            <li>24/7 customer support during your travels</li>
                            <li>Exclusive deals and packages</li>
                        </ul>
                        <motion.button 
                            className="cta-button"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            Learn More
                        </motion.button>

                        <div className="about-features">
                            <motion.div 
                                className="feature"
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <span className="feature-icon">✈️</span>
                                <h3>Expert Planning</h3>
                                <p>Customized itineraries tailored to your preferences</p>
                            </motion.div>

                            <motion.div 
                                className="feature"
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <span className="feature-icon">🌟</span>
                                <h3>Quality Service</h3>
                                <p>24/7 support throughout your journey</p>
                            </motion.div>

                            <motion.div 
                                className="feature"
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <span className="feature-icon">💰</span>
                                <h3>Best Value</h3>
                                <p>Competitive prices without compromising quality</p>
                            </motion.div>
                        </div>

                        <motion.button 
                            className="btn btn-primary mt-6"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Learn More About Us
                        </motion.button>

                        <h3 className="contact-title">Get in Touch</h3>
                        <form className="contact-form">
                            <input type="text" placeholder="Your Name" required className="form-input" />
                            <input type="email" placeholder="Your Email" required className="form-input" />
                            <textarea placeholder="Your Message" required className="form-textarea"></textarea>
                            <motion.button 
                                type="submit" 
                                className="submit-button" 
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                Send Message
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}
