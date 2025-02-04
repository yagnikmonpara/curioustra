import { motion } from 'framer-motion';
import '../../css/tourly.css';

export default function HeroSection() {
    return (
        <motion.section 
            className="hero" 
            id="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1469474968028-56623f02e42e')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
            }}
        >
            <div className="container">
                <motion.h1 
                    className="hero-title"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    Welcome to CuriousTra
                    <span className="highlight">Where Curiousness Meets Travel</span>
                </motion.h1>

                <motion.p
                    className="hero-text"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    Experience seamless travel with CuriousTra
                </motion.p>

                <motion.div
                    className="btn-group"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                >
                    <motion.button 
                        className="btn btn-primary"
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Start Your Journey
                    </motion.button>
                    <motion.button 
                        className="btn btn-secondary"
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        View Packages
                    </motion.button>
                </motion.div>
            </div>
        </motion.section>
    );
}
