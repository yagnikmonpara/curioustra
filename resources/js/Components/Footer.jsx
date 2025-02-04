import { motion, AnimatePresence } from 'framer-motion';
import '../../css/tourly.css';

export default function Footer({ showTopBtn }) {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
        <footer className="footer">
                    <div className="footer-top">
                        <div className="container">
                            <div className="footer-grid">
                                <div className="footer-brand">
                                    <h3 className="footer-brand-title">Tourly</h3>
                                    <p className="footer-brand-text">
                                        Discover the world with us. We create unforgettable travel experiences
                                        that will stay with you forever.
                                    </p>
                                    <ul className="social-list">
                                        {[
                                            { icon: 'logo-facebook', link: '#' },
                                            { icon: 'logo-twitter', link: '#' },
                                            { icon: 'logo-instagram', link: '#' },
                                            { icon: 'logo-linkedin', link: '#' }
                                        ].map((social, index) => (
                                            <motion.li 
                                                key={index}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <a href={social.link} className="social-link">
                                                    <ion-icon name={social.icon}></ion-icon>
                                                </a>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="footer-links">
                                    <h3 className="footer-title">Quick Links</h3>
                                    <ul>
                                        {[
                                            { text: 'About Us', link: '#about' },
                                            { text: 'Services', link: '#services' },
                                            { text: 'Gallery', link: '#gallery' },
                                            { text: 'Contact Us', link: '#contact' }
                                        ].map((link, index) => (
                                            <motion.li 
                                                key={index}
                                                whileHover={{ x: 5 }}
                                            >
                                                <a href={link.link}>{link.text}</a>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="footer-links">
                                    <h3 className="footer-title">Support</h3>
                                    <ul>
                                        {[
                                            { text: 'Travel Guide', link: '#' },
                                            { text: 'FAQ\'s', link: '#' },
                                            { text: 'Terms & Conditions', link: '#' },
                                            { text: 'Privacy Policy', link: '#' }
                                        ].map((link, index) => (
                                            <motion.li 
                                                key={index}
                                                whileHover={{ x: 5 }}
                                            >
                                                <a href={link.link}>{link.text}</a>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="footer-newsletter">
                                    <h3 className="footer-title">Newsletter</h3>
                                    <p className="footer-text">
                                        Subscribe to our newsletter to receive updates and travel tips.
                                    </p>
                                    <motion.form 
                                        className="newsletter-form"
                                        onSubmit={(e) => e.preventDefault()}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                    >
                                        <input 
                                            type="email" 
                                            placeholder="Enter your email" 
                                            className="newsletter-input" 
                                            required 
                                        />
                                        <motion.button 
                                            type="submit" 
                                            className="newsletter-btn"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <ion-icon name="paper-plane-outline"></ion-icon>
                                        </motion.button>
                                    </motion.form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <div className="container">
                            <motion.p 
                                className="copyright"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                            >
                                &copy; {new Date().getFullYear()} Tourly. All rights reserved. 
                                <span className="separator">|</span> 
                                Crafted with <ion-icon name="heart"></ion-icon> by Tourly Team
                            </motion.p>
                        </div>
                    </div>

                    {/* Scroll to Top Button */}
                    <AnimatePresence>
                        {showTopBtn && (
                            <motion.button
                                className="scroll-top-btn"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <ion-icon name="arrow-up-outline"></ion-icon>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </footer>
    );
}