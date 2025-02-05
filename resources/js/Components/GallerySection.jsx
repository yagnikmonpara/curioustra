import React from 'react';
import { motion } from 'framer-motion';
import '../../css/welcome.css';
import { Link } from '@inertiajs/react';

const GallerySection = () => {
    const images = [
        "/images/gallery-1.jpg",
        "/images/gallery-2.jpg",
        "/images/gallery-3.jpg",
        "/images/gallery-4.jpg",
        "/images/gallery-5.jpg",
        "/images/gallery-6.png",
        "/images/gallery-7.png",
        "/images/gallery-8.png"
    ];

    return (
        <section className="gallery" id="gallery">
            <div className="container">
                <div className="section-header">
                    <p className="section-subtitle">Photo Gallery</p>
                    <h2 className="h2 section-title">Photos From Travellers</h2>
                    <p className="section-text">
                        Fusce hic augue velit wisi quibusdam pariatur, iusto primis, nec nemo,
                        rutrum. Vestibulum cumque laudantium. Sit ornare mollitia tenetur, aptent.
                    </p>
                </div>
                <div className="gallery-grid">
                    {images.map((image, index) => (
                        <motion.div 
                            key={index}
                            className="gallery-item"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <img src={image} alt={`Gallery ${index + 1}`} className="gallery-img" />
                        </motion.div>
                    ))}
                </div>
                <div className="text-center">
                    <motion.button 
                        className="btn btn-success"
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
                        whileTap={{ scale: 0.95 }}
                        style={{ marginTop: "3rem" }}
                    >
                        <Link href="#gallery">Explore More!</Link>
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
