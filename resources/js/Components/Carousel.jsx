import { useState } from 'react';

const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="relative w-full h-56 md:h-96 overflow-hidden rounded-lg">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute w-full h-full transition-transform duration-700 ease-in-out ${
                        index === currentIndex ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <img src={image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                </div>
            ))}
            <button
                type="button"
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/30 dark:bg-gray-800/30 p-2 rounded-full"
                onClick={prevSlide}
            >
                &lt;
            </button>
            <button
                type="button"
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/30 dark:bg-gray-800/30 p-2 rounded-full"
                onClick={nextSlide}
            >
                &gt;
            </button>
        </div>
    );
};

export default Carousel;