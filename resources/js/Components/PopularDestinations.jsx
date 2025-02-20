import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import '../../css/welcome.css';
import { Link } from '@inertiajs/react';

const destinations = [
    {
        id: 1,
        name: 'SAN MIGUEL',
        location: 'ITALY',
        description: 'Fusce hic augue velit wisi ips quibusdam pariatur, iusto.',
        image: '/images/popular-1.jpg',
        rating: 5,
        price: '$599',
        duration: '5 Days'
    },
    {
        id: 2,
        name: 'BURJ KHALIFA',
        location: 'DUBAI',
        description: 'Fusce hic augue velit wisi ips quibusdam pariatur, iusto.',
        image: '/images/popular-2.jpg',
        rating: 5,
        price: '$799',
        duration: '7 Days'
    },
    {
        id: 3,
        name: 'KYOTO TEMPLE',
        location: 'JAPAN',
        description: 'Fusce hic augue velit wisi ips quibusdam pariatur, iusto.',
        image: '/images/popular-3.jpg',
        rating: 5,
        price: '$699',
        duration: '6 Days'
    },
    {
        id: 4,
        name: 'SANTORINI',
        location: 'GREECE',
        description: 'Experience the stunning white architecture and blue domes of Santorini.',
        image: '/images/popular-4.png',
        rating: 5,
        price: '$899',
        duration: '8 Days'
    },
    {
        id: 5,
        name: 'MACHU PICCHU',
        location: 'PERU',
        description: 'Discover the ancient Incan citadel set high in the Andes Mountains.',
        image: '/images/popular-5.png',
        rating: 5,
        price: '$1299',
        duration: '10 Days'
    },
    {
        id: 6,
        name: 'MALDIVES',
        location: 'SOUTH ASIA',
        description: 'Relax in luxury overwater villas in crystal clear turquoise waters.',
        image: '/images/popular-6.png',
        rating: 5,
        price: '$1499',
        duration: '7 Days'
    }
];

const RatingStars = ({ rating }) => {
    return (
        <motion.div 
            className="rating"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
        >
            {[...Array(rating)].map((_, index) => (
                <motion.span 
                    key={index}
                    className="star"
                    variants={{
                        hidden: { opacity: 0, scale: 0, rotate: -180 },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                            transition: {
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                            }
                        }
                    }}
                >
                    ★
                </motion.span>
            ))}
        </motion.div>
    );
};

const DestinationCard = ({ destination }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div 
            className="popular-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                }
            }}
            viewport={{ once: true, margin: "-100px" }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <motion.div 
                className="image-container"
                animate={{
                    scale: isHovered ? 1.02 : 1
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
            >
                <motion.img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="popular-img"
                    animate={{
                        scale: isHovered ? 1.1 : 1
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }}
                />
                <motion.div 
                    className="popular-content"
                    animate={{
                        backgroundColor: isHovered ? "rgba(0, 0, 0, 0.15)" : "rgba(0, 0, 0, 0.2)",
                        backdropFilter: isHovered ? "blur(4px)" : "blur(2px)",
                        y: isHovered ? 0 : 20
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }}
                >
                    <motion.div 
                        className="card-top"
                        animate={{
                            y: isHovered ? 0 : 10,
                            opacity: isHovered ? 1 : 0.9
                        }}
                    >
                        <motion.div className="location-wrapper">
                            <motion.h3 
                                className="location"
                                animate={{
                                    scale: isHovered ? 1.05 : 1,
                                    y: isHovered ? -5 : 0
                                }}
                            >
                                {destination.location}
                            </motion.h3>
                            <motion.span 
                                className="duration"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: isHovered ? 1 : 0,
                                    y: isHovered ? 0 : 10
                                }}
                            >
                                {destination.duration}
                            </motion.span>
                        </motion.div>
                        <RatingStars rating={destination.rating} />
                    </motion.div>

                    <motion.div
                        animate={{
                            y: isHovered ? 0 : 10,
                            opacity: isHovered ? 1 : 0.9
                        }}
                    >
                        <motion.h2 
                            className="destination-name"
                            animate={{
                                scale: isHovered ? 1.05 : 1,
                                letterSpacing: isHovered ? "1px" : "0.5px"
                            }}
                        >
                            {destination.name}
                        </motion.h2>
                        <motion.p 
                            className="destination-desc"
                            animate={{
                                opacity: isHovered ? 1 : 0.8,
                                y: isHovered ? 0 : 5
                            }}
                        >
                            {destination.description}
                        </motion.p>
                        
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default function PopularDestinations() {
    return (
        <section className="section popular" id="destinations">
            <div className="container">
                <motion.p 
                    className="section-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ marginTop: "3rem" }}
                >
                    
                    UNCOVER PLACE
                </motion.p>
                
                <motion.h2 
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    POPULAR DESTINATION
                </motion.h2>

                <motion.p 
                    className="section-text"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    Fusce hic augue velit wisi quibusdam pariatur, iusto primis, nec nemo, rutrum. 
                    Vestibulum cumque laudantium. Sit ornare mollitia tenetur, aptent.
                </motion.p>

                <motion.div 
                    className="popular-grid"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    {destinations.map((destination) => (
                        <DestinationCard key={destination.id} destination={destination} />
                    ))}
                </motion.div>

                <motion.div 
                    className="btn-container"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                >
                    <motion.button 
                        className="btn btn-success"
                        whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 8px 25px rgba(37, 99, 235, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        style={{ marginBottom: "3rem" }}
                    >
                        <Link href="#destinations">MORE DESTINATION</Link>
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
