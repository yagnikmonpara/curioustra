import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaUser, FaStar, FaCar, FaTrain, FaPlane, FaHotel, FaMap } from 'react-icons/fa';
import '../../css/welcome.css';

const services = [
    {
        title: "Family Tours",
        icon: <FaUsers />,
        description: "Curated family tours ensuring fun and safety for all ages.",
        url: '/images/family.png'
    },
    {
        title: "Solo Trips",
        icon: <FaUser />,
        description: "Exciting solo travel packages for the adventurous explorer.",
        url: '/images/trip.png'
    },
    {
        title: "Exclusive Packages",
        icon: <FaStar />,
        description: "Special packages with unique experiences and added benefits.",
        url: '/images/package.png'
    },
    {
        title: "Cabs Booking",
        icon: <FaCar />,
        description: "Convenient and reliable cab bookings for local and outstation travel.",
        url: '/images/cab.png'
    },
    {
        title: "Provide Guides",
        icon: <FaMap />,
        description: "Experienced guides to enhance your travel experience with local insights.",
        url: '/images/guide.png'
    },
];

const ServicesSection = () => {
    return (
        <section className="services" id="services">
            <div className="container">
                <div className="section-header">
                    <p className="section-subtitle">Our Services</p>
                    <h2 className="h2 section-title" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: "700" }}>What We Offer</h2>
                    <p className="section-text">
                        Explore a wide range of services tailored to meet all your travel needs.
                        From hotel bookings to exclusive packages, we ensure a seamless experience.
                    </p>
                </div>
                <div className="services-grid services-container">
                    {services.map((service, index) => (
                        <motion.div 
                            key={index} 
                            className="service-card"
                            style={{ 
                                backgroundImage: `url(${service.url})`, 
                                backgroundSize: "cover",
                                position: "relative"
                            }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <div className="blur-overlay"></div>
                            <div className="service-content">
                                <div className="service-icon">{service.icon}</div>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
