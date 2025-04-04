import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import '../../../../css/welcome.css';

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
    console.log(destination);
    
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
                    src={destination.image || '/images/default-destination.png'}
                    alt={destination.name}
                    className="popular-img"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/default-destination.png';
                    }}
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

const Destinations = ({ destinations }) => {
    const [search, setSearch] = useState("");

    const filteredDestinations = useMemo(() =>
        destinations.filter(destination =>
            destination.name.toLowerCase().includes(search.toLowerCase())
        ),
        [destinations, search]
    );

    return (
        <AuthenticatedLayout>
            <Head title="Destinations" />

            <section className="py-16 bg-gray-50 dark:bg-gray-900" id="destinations">
                <div className="container mx-auto px-4">
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
                        className="search-box"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <input
                            type="text"
                            placeholder="Search destinations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </motion.div>

                    <motion.div
                        className="popular-grid"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        {filteredDestinations.map((destination) => (
                            <DestinationCard key={destination.id} destination={destination} />
                        ))}
                    </motion.div>
                </div>
            </section>

        </AuthenticatedLayout>
    );
};

export default Destinations;