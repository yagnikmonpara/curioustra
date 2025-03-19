import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { motion } from "framer-motion";
import "../../../../css/Guides.css";

const Guides = () => {
    const [search, setSearch] = useState("");
    const [selectedGuide, setSelectedGuide] = useState(null);

    const guides = [
        {
            id: 1,
            name: "John Doe",
            bio: "Experienced tour guide with over 10 years of experience in cultural and historical tours.",
            specialization: "Cultural Tours",
            contact_number: "+1234567890",
            email: "john.doe@example.com",
            profile_picture: "/images/guides/guide-1.jpg",
            languages: ["English", "Spanish", "French"]
        },
        {
            id: 2,
            name: "Jane Smith",
            bio: "Adventure guide specializing in hiking, trekking, and outdoor activities.",
            specialization: "Adventure Tours",
            contact_number: "+0987654321",
            email: "jane.smith@example.com",
            profile_picture: "/images/guides/guide-2.jpg",
            languages: ["English", "German"]
        },
        {
            id: 3,
            name: "Alice Johnson",
            bio: "Wildlife expert with a passion for nature and conservation.",
            specialization: "Wildlife Tours",
            contact_number: "+1122334455",
            email: "alice.johnson@example.com",
            profile_picture: "/images/guides/guide-3.jpg",
            languages: ["English", "Swahili"]
        },
        {
            id: 4,
            name: "Bob Brown",
            bio: "City tour guide with extensive knowledge of urban history and architecture.",
            specialization: "City Tours",
            contact_number: "+5566778899",
            email: "bob.brown@example.com",
            profile_picture: "/images/guides/guide-4.jpg",
            languages: ["English", "Italian"]
        }
    ];

    const GuideCard = ({ guide }) => {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <motion.div
                className="guide-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <figure className="card-banner">
                    <img src={guide.profile_picture} alt={guide.name} className="guide-img" />
                    <motion.div
                        className="image-overlay"
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ul className="highlight-list">
                            {guide.languages.map((language, index) => (
                                <li key={index}>
                                    <ion-icon name="checkmark-circle"></ion-icon>
                                    {language}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </figure>

                <div className="card-content">
                    <h3 className="h3 card-title">{guide.name}</h3>
                    <p className="card-text">{guide.bio}</p>

                    <ul className="card-meta-list">
                        <li className="card-meta-item">
                            <div className="meta-box">
                                <ion-icon name="star"></ion-icon>
                                <p className="text">{guide.specialization}</p>
                            </div>
                        </li>

                        <li className="card-meta-item">
                            <div className="meta-box">
                                <ion-icon name="call"></ion-icon>
                                <p className="text">{guide.contact_number}</p>
                            </div>
                        </li>

                        <li className="card-meta-item">
                            <div className="meta-box">
                                <ion-icon name="mail"></ion-icon>
                                <p className="text">{guide.email}</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="card-price">
                    <div className="action-buttons">
                        <button className="btn btn-secondary" onClick={() => setSelectedGuide(guide)}>View More</button>
                        <button className="btn btn-outline" onClick={() => handleContact(guide.id)}>
                            <ion-icon name="chatbox-outline"></ion-icon> Contact
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    const filteredGuides = guides.filter((guide) =>
        guide.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleContact = async (guideId) => {
        // Handle contact logic
    };

    return (
        <AuthenticatedLayout>
            <Head title="Guides" />

            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="section-subtitle">Meet Our Guides</p>
                        <h2 className="h2 section-title">Professional Tour Guides</h2>
                        <p className="section-text">
                            Discover our team of experienced and knowledgeable tour guides. They are here to make your journey unforgettable.
                        </p>
                    </motion.div>

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search Guides..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="guide-list">
                        {filteredGuides.map((guide) => (
                            <motion.div
                                key={guide.id}
                                className="guide-item"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: guide.id * 0.1 }}
                            >
                                <GuideCard guide={guide} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {selectedGuide && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <h3 className="h3 mb-4">{selectedGuide.name}</h3>
                                <img src={selectedGuide.profile_picture} alt={selectedGuide.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                                <ul className="space-y-2 mt-4">
                                    <li><strong>Specialization:</strong> {selectedGuide.specialization}</li>
                                    <li><strong>Contact Number:</strong> {selectedGuide.contact_number}</li>
                                    <li><strong>Email:</strong> {selectedGuide.email}</li>
                                    <li><strong>Languages:</strong> {selectedGuide.languages.join(", ")}</li>
                                </ul>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-700 dark:text-gray-300">{selectedGuide.bio}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button className="btn btn-secondary" onClick={() => handleContact(selectedGuide.id)}>Contact</button>
                            <button className="btn btn-outline" onClick={() => setSelectedGuide(null)}>Close</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AuthenticatedLayout>
    );
};

export default Guides;