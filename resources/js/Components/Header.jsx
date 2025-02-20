import { motion } from 'framer-motion';
import '../../css/welcome.css';
import { useState, useEffect } from 'react';

export default function Header({ isHeaderActive }) {
    const [isNavbarActive, setIsNavbarActive] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Initial check
        checkMobile();

        // Add event listener
        window.addEventListener('resize', checkMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            if (isMobile) {
                setIsNavbarActive(false);
            }
        }
    };

    const toggleNavbar = () => {
        if (isMobile) {
            setIsNavbarActive(!isNavbarActive);
        }
    };

    return (
        <header className={`header ${isHeaderActive ? 'active' : ''}`}>
            <div className="container header-container">
                <a href="/" className="logo flex items-center" onClick={(e) => handleNavClick(e, 'home')}>
                    <img src="images/logo.png" alt="logo" className="w-20 h-20" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">CuriousTra</h1>
                </a>

                {isMobile && (
                    <motion.button 
                        className="nav-toggle-btn"
                        onClick={toggleNavbar}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Toggle navigation"
                    >
                        <span className={`line ${isNavbarActive ? 'active' : ''}`}></span>
                        <span className={`line ${isNavbarActive ? 'active' : ''}`}></span>
                        <span className={`line ${isNavbarActive ? 'active' : ''}`}></span>
                    </motion.button>
                )}

                <nav className={`navbar ${isNavbarActive ? 'active' : ''} ${isMobile ? 'mobile' : 'desktop'}`}>
                    <ul className="navbar-list">
                        {['home', 'destinations', 'packages', 'gallery', 'services', 'about', 'contact'].map((item) => (
                            <li key={item}>
                                <motion.a 
                                    href={`#${item}`}
                                    className="navbar-link"
                                    onClick={(e) => handleNavClick(e, item)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </motion.a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}