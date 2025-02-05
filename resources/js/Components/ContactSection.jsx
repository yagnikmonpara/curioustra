import { motion } from 'framer-motion';
import '../../css/welcome.css';

export default function ContactSection() {
    return (
        <motion.section 
            className="contact section py-16 bg-white-300" 
            id="contact"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="container mx-auto px-6">
                <motion.h2 
                    className="section-title text-6xl font-extrabold text-center text-blue-900 dark:text-blue-200 font-serif mb-10"
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    Contact Us
                </motion.h2>

                <div className="contact-grid grid md:grid-cols-2 gap-12">
                    <motion.div 
                        className="contact-info bg-white/90 dark:bg-blue-700 p-8 rounded-xl shadow-xl border border-blue-400 dark:border-blue-600 backdrop-blur-lg"
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <h3 className="text-4xl font-semibold text-blue-800 dark:text-blue-200 mb-4 font-serif">Get in Touch</h3>
                        <p className="text-gray-800 dark:text-gray-200 mb-6">We'd love to hear from you. <br/> Please fill out this form or use our contact information below.</p>
                        
                        <div className="contact-details space-y-4">
                            <div className="contact-item flex items-center gap-4">
                                <ion-icon name="location-outline" class="text-4xl text-blue-800 dark:text-blue-200" aria-label="Location"></ion-icon>
                                <p className="text-gray-800 dark:text-gray-200">A-1201 to A-1210 Peladium Square, Dalal Street, Mumbai City, India - 40001</p>
                            </div>
                            <div className="contact-item flex items-center gap-4">
                                <ion-icon name="call-outline" class="text-4xl text-blue-800 dark:text-blue-200" aria-label="Phone"></ion-icon>
                                <p className="text-gray-800 dark:text-gray-200">+1 (234) 567-8900 / +91 38526 84393</p>
                            </div>
                            <div className="contact-item flex items-center gap-4">
                                <ion-icon name="mail-outline" class="text-4xl text-blue-800 dark:text-blue-200" aria-label="Email"></ion-icon>
                                <p className="text-gray-800 dark:text-gray-200">info@curioustra.com</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.form 
                        className="contact-form bg-white/90 dark:bg-gray-800/90 p-8 rounded-xl shadow-xl border border-blue-400 dark:border-blue-600 backdrop-blur-lg"
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="form-group mb-4">
                            <label htmlFor="name" className="block font-medium text-blue-800 dark:text-blue-800 font-serif bolder">Name</label>
                            <input type="text" id="name" name="name" required className="form-input w-full px-4 py-2 border border-blue-500 dark:border-blue-600 rounded-lg focus:ring-blue-600 focus:border-blue-600 font-serif" aria-label="Name"/>
                        </div>

                        <div className="form-group mb-4">
                            <label htmlFor="email" className="block font-medium text-blue-800 dark:text-blue-800 font-serif bolder">Email</label>
                            <input type="email" id="email" name="email" required className="form-input w-full px-4 py-2 border border-blue-500 dark:border-blue-600 rounded-lg focus:ring-blue-600 focus:border-blue-600 font-serif" aria-label="Email"/>
                        </div>

                        <div className="form-group mb-4">
                            <label htmlFor="subject" className="block font-medium text-blue-800 dark:text-blue-800 font-serif bolder">Subject</label>
                            <input type="text" id="subject" name="subject" required className="form-input w-full px-4 py-2 border border-blue-500 dark:border-blue-600 rounded-lg focus:ring-blue-600 focus:border-blue-600 font-serif" aria-label="Subject"/>
                        </div>

                        <div className="form-group mb-4">
                            <label htmlFor="message" className="block font-medium text-blue-800 dark:text-blue-800 font-serif bolder">Message</label>
                            <textarea id="message" name="message" rows="5" required className="form-textarea w-full px-4 py-2 border border-blue-500 dark:border-blue-600 rounded-lg focus:ring-blue-600 focus:border-blue-600 font-serif" aria-label="Message"></textarea>
                        </div>

                        <motion.button 
                            type="submit" 
                            className="btn w-full py-3 rounded-lg bg-blue-800 dark:bg-blue-600 text-white font-semibold shadow-lg font-serif"
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
