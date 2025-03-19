import React, { useState, useRef } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Gallery() {
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const gallery = [
        {
            "id": 1,
            "image_path": "/storage/gallery/image1.jpg",
            "caption": "Beautiful Landscape",
            "imageable_id": 1,
            "imageable_type": "App\\Models\\Package",
            "created_at": "2023-10-27T10:00:00.000000Z",
            "updated_at": "2023-10-27T10:00:00.000000Z"
        },
        {
            "id": 2,
            "image_path": "/storage/gallery/image2.jpg",
            "caption": "City at Night",
            "imageable_id": 1,
            "imageable_type": "App\\Models\\Package",
            "created_at": "2023-10-27T11:30:00.000000Z",
            "updated_at": "2023-10-27T11:30:00.000000Z"
        },
        {
            "id": 3,
            "image_path": "/storage/gallery/image3.jpg",
            "caption": "Mountain View",
            "imageable_id": 2,
            "imageable_type": "App\\Models\\Hotel",
            "created_at": "2023-10-27T12:45:00.000000Z",
            "updated_at": "2023-10-27T12:45:00.000000Z"
        },
        {
            "id": 4,
            "image_path": "/storage/gallery/image4.jpg",
            "caption": "Beach Sunset",
            "imageable_id": 3,
            "imageable_type": "App\\Models\\Destination",
            "created_at": "2023-10-27T14:15:00.000000Z",
            "updated_at": "2023-10-27T14:15:00.000000Z"
        },
        {
            "id": 5,
            "image_path": "/storage/gallery/image5.jpg",
            "caption": "Forest Path",
            "imageable_id": 1,
            "imageable_type": "App\\Models\\Package",
            "created_at": "2023-10-27T15:30:00.000000Z",
            "updated_at": "2023-10-27T15:30:00.000000Z"
        },
        {
            "id": 6,
            "image_path": "/storage/gallery/image6.jpg",
            "caption": "Snowy Peaks",
            "imageable_id": 2,
            "imageable_type": "App\\Models\\Hotel",
            "created_at": "2023-10-27T16:45:00.000000Z",
            "updated_at": "2023-10-27T16:45:00.000000Z"
        },
        {
            "id": 7,
            "image_path": "/storage/gallery/image7.jpg",
            "caption": "Desert Dunes",
            "imageable_id": 3,
            "imageable_type": "App\\Models\\Destination",
            "created_at": "2023-10-27T18:00:00.000000Z",
            "updated_at": "2023-10-27T18:00:00.000000Z"
        }
    ];

    const { data, setData, post, processing, errors, reset, delete: destroy } = useForm({
        image: null,
        caption: '',
        imageable_id: 1,
        imageable_type: 'App\\Models\\Package',
    });

    const handleImageChange = (e) => {
        setData('image', e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.galleries.store'), {
            onSuccess: () => {
                reset();
                fileInputRef.current.value = null;
            },
        });
    };

    const handleImageClick = (imagePath) => {
        setSelectedImage(imagePath);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this image?')) {
            destroy(route('admin.galleries.destroy', { gallery: id }));
        }
    };

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Gallery</h1>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="mb-8 max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image:</label>
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                    {errors.image && <div className="text-red-500 mt-1">{errors.image}</div>}
                </div>

                <div className="mb-4">
                    <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Caption:</label>
                    <input
                        type="text"
                        id="caption"
                        value={data.caption}
                        onChange={(e) => setData('caption', e.target.value)}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                    {errors.caption && <div className="text-red-500 mt-1">{errors.caption}</div>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                >
                    Upload
                </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                {gallery.map((gallery) => (
                    <motion.div
                        key={gallery.id}
                        className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <img
                            src={gallery.image_path}
                            alt={gallery.caption}
                            className="w-full h-64 object-cover"
                            onClick={() => handleImageClick(gallery.image_path)}
                        />
                        {gallery.caption && (
                            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                                {gallery.caption}
                            </div>
                        )}
                        <button
                            onClick={() => handleDelete(gallery.id)}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </motion.div>
                ))}
            </div>

            {selectedImage && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    <img
                        src={selectedImage}
                        alt="Lightbox Image"
                        className="max-w-full max-h-full rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}