import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';

// Import Components
import Header from '@/Components/Header';
import HeroSection from '@/Components/HeroSection';
import PopularDestinations from '@/Components/PopularDestinations';
import PackagesSection from '@/Components/PackagesSection';
import GallerySection from '@/Components/GallerySection';
import ServicesSection from '@/Components/ServicesSection';
import AboutSection from '@/Components/AboutSection';
import ContactSection from '@/Components/ContactSection';
import Footer from '@/Components/Footer';

// Import Styles
import '../../css/welcome.css';

export default function Welcome({ auth }) {
    const [isHeaderActive, setIsHeaderActive] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Handle header state on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsHeaderActive(window.scrollY > 100);
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle smooth scroll for navigation
    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Head>
                <title>Welcome</title>
                <meta name="description" content="Discover amazing travel destinations and book your next adventure with Tourly." />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js" defer></script>
<script noModule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js" defer></script>
            </Head>

            {/* Header */}
            <Header isHeaderActive={isHeaderActive} />

            {/* Main Content */}
            <main>
                <HeroSection auth={auth} />
                <PopularDestinations />
                <PackagesSection />
                <GallerySection />
                <ServicesSection />
                <AboutSection />
                <ContactSection />
            </main>

            {/* Footer */}
            <Footer showTopBtn={showScrollTop} />
        </>
    );
}