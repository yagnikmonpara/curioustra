import { useState, useRef } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Gallery({ userPhotos, allPhotos }) {
    const { auth } = usePage().props;
    const [selectedImage, setSelectedImage] = useState(null);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset, delete: destroy } = useForm({
        image: null,
        caption: '',
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setData('image', file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('gallery.store'), {
            onSuccess: () => {
                reset();
                setPreview(null);
                fileInputRef.current.value = null;
                setShowUploadForm(false);
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
            destroy(route('gallery.destroy', { gallery: id }));
        }
    };

    const GalleryCard = ({ image, isUserImage }) => (
        <motion.div
            className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="aspect-square overflow-hidden">
                <img
                    src={image.image}
                    alt={image.caption}
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                    onClick={() => handleImageClick(image.image)}
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#2D336B]/90 via-[#7886C7]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                {image.caption && (
                    <div className="text-white text-sm font-medium mb-2 break-words overflow-hidden">
                        <p className="line-clamp-3 group-hover:line-clamp-none transition-all">
                            {image.caption}
                        </p>
                    </div>
                )}
                {isUserImage && (
                    <button
                        onClick={() => handleDelete(image.id)}
                        className="absolute top-2 right-2 bg-gradient-to-br from-[#FF4757] to-[#FF6B81] hover:from-[#FF6B81] hover:to-[#FF4757] text-white p-2 rounded-full shadow-sm transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        </motion.div>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Gallery" />
            <div className="py-16 bg-gradient-to-br from-gray-50 via-[#F8FAFC] to-gray-100 dark:from-gray-900 dark:via-[#0F172A] dark:to-gray-800 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h1 className="h2 section-title text-3xl sm:text-4xl font-bold text-[#2D336B] mb-4">
                            Travel Gallery
                        </h1>
                        <p className="section-text text-gray-600 max-w-2xl mx-auto">
                            Explore memories from our community and share your own travel experiences.
                        </p>
                        <button
                            onClick={() => setShowUploadForm(!showUploadForm)}
                            className="mt-6 bg-gradient-to-r from-[#2D336B] to-[#7886C7] hover:from-[#7886C7] hover:to-[#2D336B] text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            {showUploadForm ? 'Close Upload' : 'Share Your Photo'}
                        </button>
                    </motion.div>

                    {showUploadForm && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-12 max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-[#E2E8F0] dark:border-gray-700"
                        >
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Upload Image
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[#2D336B] transition-colors overflow-hidden relative">
                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover absolute inset-0"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
                                                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                                        Click to upload or drag and drop
                                                        <span className="block mt-1 text-xs">(JPEG, PNG, JPG - max 2MB)</span>
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                id="image"
                                                onChange={handleImageChange}
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                    {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Caption
                                    </label>
                                    <input
                                        type="text"
                                        id="caption"
                                        value={data.caption}
                                        onChange={(e) => setData('caption', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#2D336B] focus:border-[#2D336B] dark:bg-gray-700 dark:text-white bg-white/50 backdrop-blur-sm"
                                        placeholder="Add a caption..."
                                    />
                                    {errors.caption && <p className="text-red-500 text-sm mt-2">{errors.caption}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-[#2D336B] to-[#7886C7] hover:from-[#7886C7] hover:to-[#2D336B] text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                                >
                                    {processing ? 'Uploading...' : 'Share Photo'}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-[#404dc0] mb-6">Your Photos</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {userPhotos.map(image => (
                                <GalleryCard key={image.id} image={image} isUserImage={true} />
                            ))}
                            {userPhotos.length === 0 && (
                                <div className="col-span-full text-center py-8 text-gray-500">
                                    You haven't uploaded any photos yet.
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#404dc0] mb-6">Community Gallery</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {allPhotos.map(image => (
                                <GalleryCard key={image.id} image={image} isUserImage={false} />
                            ))}
                        </div>
                    </section>

                    {selectedImage && (
                        <div
                            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                            onClick={closeLightbox}
                        >
                            <div className="max-w-4xl w-full">
                                <img
                                    src={selectedImage}
                                    alt="Enlarged view"
                                    className="w-full h-full object-contain rounded-lg shadow-2xl"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}