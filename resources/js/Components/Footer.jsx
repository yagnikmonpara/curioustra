import { motion, AnimatePresence } from 'framer-motion';
import '../../css/welcome.css';

export default function Footer({ showTopBtn }) {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="container">
                    <div className="footer-grid">
                        {/* Brand Section */}
                        <motion.div 
                            className="footer-brand"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <motion.h3 
                                className="footer-brand-title flex"
                                whileHover={{ scale: 1.05 }}
                            >
                                <ion-icon name="airplane-outline" className="brand-icon text-primary mx-2"></ion-icon>
                                <p className="brand-text mx-1">CuriousTra</p>
                            </motion.h3>
                            <p className="footer-brand-text">
                                Discover the world with us. We create unforgettable travel experiences
                                that will stay with you forever.
                            </p>
                            <ul className="social-list flex mt-4">
                                {[
                                    { icon: 'logo-facebook', link: '#' },
                                    { icon: 'logo-twitter', link: '#' },
                                    { icon: 'logo-instagram', link: '#' },
                                ].map((social, index) => (
                                    <motion.li 
                                        key={index}
                                        whileHover={{ y: -5 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <a href={social.link} className="social-link mx-2">
                                            <ion-icon name={social.icon}></ion-icon>
                                            <span className="social-hover-effect"></span>
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Links Sections */}
                        {[
                            {
                                title: 'Quick Links',
                                links: [
                                    { text: 'About Us', link: '#about' },
                                    { text: 'Services', link: '#services' },
                                    { text: 'Gallery', link: '#gallery' },
                                    { text: 'Contact Us', link: '#contact' }
                                ]
                            },
                            {
                                title: 'Support',
                                links: [
                                    { text: 'Travel Guide', link: '#' },
                                    { text: 'FAQ\'s', link: '#' },
                                    { text: 'Terms & Conditions', link: '#' },
                                    { text: 'Privacy Policy', link: '#' }
                                ]
                            }
                        ].map((section, index) => (
                            <motion.div 
                                key={index}
                                className="footer-links"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 + (index * 0.2) }}
                                viewport={{ once: true }}
                            >
                                <h3 className="footer-title">{section.title}</h3>
                                <ul>
                                    {section.links.map((link, linkIndex) => (
                                        <motion.li 
                                            key={linkIndex}
                                            whileHover={{ x: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <a href={link.link} className="link-item">
                                                <ion-icon name="chevron-forward-outline" className="link-icon"></ion-icon>
                                                {link.text}
                                            </a>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}

                        {/* Newsletter Section */}
                        <motion.div 
                            className="footer-newsletter"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="footer-title">Join Our Newsletter</h3>
                            <p className="footer-text">
                                Get exclusive travel deals and updates straight to your inbox
                            </p>
                            <motion.form 
                                className="newsletter-form"
                                onSubmit={(e) => e.preventDefault()}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1 }}
                                viewport={{ once: true }}
                            >
                                <div className="input-group flex items-center">
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        className="newsletter-input rounded shadow-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required 
                                    />
                                    <motion.button 
                                        type="submit" 
                                        className="newsletter-btn bg-blue-500 text-white rounded p-2 ml-2 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:shadow-lg"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <ion-icon name="paper-plane-outline" className="btn-icon"></ion-icon>
                                    </motion.button>
                                </div>
                            </motion.form>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <motion.div 
                className="footer-bottom flex justify-between items-center text-white py-4 h-full"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                viewport={{ once: true }}
            >
                <div className="container flex justify-center items-center copyright-content h-full">
                        <h2 className="copyright text-lg bold-1">
                            &copy; {new Date().getFullYear()} CuriousTra. All rights reserved.
                        </h2>
                    </div>
            </motion.div>

            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showTopBtn && (
                    <motion.button
                        className="scroll-top-btn fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-2 shadow-lg"
                        onClick={scrollToTop}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 300,
                            hover: { repeat: Infinity, duration: 1.5 }
                        }}
                    >
                        <ion-icon name="arrow-up-outline"></ion-icon>
                    </motion.button>
                )}
            </AnimatePresence>
        </footer>
    );
}