import { motion } from 'framer-motion';
import '../../css/tourly.css';

export default function ContactSection() {
    return (
        <motion.section 
            className="contact section" 
            id="contact"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="container">
                <motion.h2 
                    className="section-title"
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    Contact Us
                </motion.h2>

                <div className="contact-grid">
                    <motion.div 
                        className="contact-info"
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <h3>Get in Touch</h3>
                        <p>We'd love to hear from you. Please fill out this form or use our contact information below.</p>
                        
                        <div className="contact-details">
                            <div className="contact-item">
                                <span className="icon">📍</span>
                                <p>123 Travel Street, Adventure City, AC 12345</p>
                            </div>
                            <div className="contact-item">
                                <span className="icon">📞</span>
                                <p>+1 (234) 567-8900</p>
                            </div>
                            <div className="contact-item">
                                <span className="icon">✉️</span>
                                <p>info@tourly.com</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.form 
                        className="contact-form"
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input type="text" id="subject" name="subject" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message" rows="5" required></textarea>
                        </div>

                        <motion.button 
                            type="submit" 
                            className="btn btn-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Send Message
                        </motion.button>
                    </motion.form>
                </div>
            </div>
        </motion.section>
    );
}
