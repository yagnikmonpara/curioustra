import React from 'react';
import { motion } from 'framer-motion';
import '../../css/tourly.css';

const services = [
    {
        title: "Family Tours",
        icon: "family",
        description: "Curated family tours ensuring fun and safety for all ages.",
        url: '/images/family.png'
    },
    {
        title: "Solo Trips",
        icon: "user",
        description: "Exciting solo travel packages for the adventurous explorer.",
        url: '/images/trip.png'
    },
    {
        title: "Exclusive Packages",
        icon: "star",
        description: "Special packages with unique experiences and added benefits.",
        url: '/images/package.png'
    },
    {
        title: "Cabs Booking",
        icon: "car",
        description: "Convenient and reliable cab bookings for local and outstation travel.",
        url: '/images/cab.png'
    },
    {
        title: "Trains Booking",
        icon: "train",
        description: "Reserve train tickets effortlessly with our user-friendly booking system.",
        url: '/images/train.png'
    },
    {
        title: "Flights Booking",
        icon: "plane",
        description: "Find and book flights to any destination with competitive pricing.",
        url: '/images/flight.png'
    },
    {
        title: "Hotel Reservation",
        icon: "hotel",
        description: "Book from a wide range of hotels at your preferred destination with exclusive deals.",
        url: '/images/hotel.png'
    },
    {
        title: "Provide Guides",
        icon: "map",
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
                    <h2 className="h2 section-title">What We Offer</h2>
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
                            style={{ backgroundImage: `url(${service.url})` }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <div className="service-icon">
                                <i className={`icon-${service.icon}`}></i>
                            </div>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
