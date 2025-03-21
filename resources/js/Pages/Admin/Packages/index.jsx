import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

const AdminPackages = ({ packages: initialPackages }) => {
    const [packages, setPackages] = useState(initialPackages);
    const [filteredPackages, setFilteredPackages] = useState(initialPackages);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [modalData, setModalData] = useState({
        id: null,
        title: '',
        description: '',
        duration: '',
        pax: 2,
        location: '',
        country: '',
        price: 0,
        amenities: '',
        highlights: '',
        existing_images: [],
        new_images: [],
    });
    const [searchTerm, setSearchTerm] = useState('');

    const processList = (str) =>
        str.split(',')
            .map(item => item.trim())
            .filter(item => item);

    useEffect(() => {
        setPackages(initialPackages);
        setFilteredPackages(initialPackages);
    }, [initialPackages]);

    useEffect(() => {
        const results = packages.filter(pkg =>
            Object.values(pkg).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredPackages(results);
    }, [searchTerm, packages]);

    const openModal = (mode, data = null) => {
        setModalMode(mode);
        if (data) {
            setModalData({
                ...data,
                existing_images: data.images || [],
                new_images: [],
                amenities: Array.isArray(data.amenities)
                    ? data.amenities.join(', ')
                    : '',
                highlights: Array.isArray(data.highlights)
                    ? data.highlights.join(', ')
                    : '',
            });
        } else {
            setModalData({
                id: null,
                title: '',
                description: '',
                duration: '',
                pax: 2,
                location: '',
                country: '',
                price: 0,
                reviews: 0,
                rating: 0,
                amenities: '',
                highlights: '',
                existing_images: [],
                new_images: [],
            });
        }
        setShowModal(true);
    };

    const handleRemoveImage = (index, type) => {
        const updatedData = { ...modalData };
        if (type === 'existing') {
            updatedData.existing_images.splice(index, 1);
        } else {
            updatedData.new_images.splice(index, 1);
        }
        setModalData(updatedData);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setModalData(prev => ({ ...prev, new_images: files }));
    };

    const handleChange = (e) => {
        setModalData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();

        // Basic fields
        data.append('title', modalData.title);
        data.append('description', modalData.description);
        data.append('duration', modalData.duration);
        data.append('pax', modalData.pax);
        data.append('location', modalData.location);
        data.append('country', modalData.country);
        data.append('price', modalData.price);
        data.append('reviews', modalData.reviews);
        data.append('rating', modalData.rating);

        // Add processed arrays
        processList(modalData.amenities).forEach(item => data.append('amenities[]', item));
        processList(modalData.highlights).forEach(item => data.append('highlights[]', item));

        // Handle images
        modalData.existing_images.forEach(img => data.append('existing_images[]', img));
        modalData.new_images.forEach(file => data.append('new_images[]', file));

        const requestOptions = {
            onSuccess: () => window.location.reload(),
            preserveScroll: true,
        };

        if (modalMode === 'add') {
            router.post(route('admin.packages.store'), data, requestOptions);
        } else {
            data.append('_method', 'PUT');
            router.post(route('admin.packages.update', modalData.id), data, requestOptions);
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this package?')) {
            router.delete(route('admin.packages.destroy', id), {
                onSuccess: () => window.location.reload(),
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Packages" />
            <div className="min-h-screen bg-sky-50">
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-sky-800">Package Management</h2>
                                <button
                                    onClick={() => openModal('add')}
                                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-all hover:scale-105"
                                >
                                    + Add Package
                                </button>
                            </div>

                            <div className="px-6 py-4 bg-sky-50">
                                <div className="relative max-w-xs">
                                    <input
                                        type="text"
                                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm text-sky-700"
                                        placeholder="Search packages..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <svg className="h-5 w-5 text-sky-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-sky-200">
                                    <thead className="bg-sky-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Duration</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">PAX</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Location</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Images</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-sky-700 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-sky-100">
                                        {filteredPackages.map(pkg => (
                                            <tr key={pkg.id} className="hover:bg-sky-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-sky-900">{pkg.title}</td>
                                                <td className="px-6 py-4 text-sm text-sky-800">{pkg.duration}</td>
                                                <td className="px-6 py-4 text-sm text-sky-800">{pkg.pax}</td>
                                                <td className="px-6 py-4 text-sm text-sky-800">₹{pkg.price}</td>
                                                <td className="px-6 py-4 text-sm text-sky-800">{pkg.location}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex space-x-1">
                                                        {pkg.images?.slice(0, 3).map((img, i) => (
                                                            <img
                                                                key={i}
                                                                src={img}
                                                                alt={pkg.title}
                                                                className="w-12 h-12 rounded-lg object-cover border border-sky-200"
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => openModal('edit', pkg)}
                                                        className="text-sky-600 hover:text-sky-800 px-3 py-1 rounded-md hover:bg-sky-100"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(pkg.id)}
                                                        className="text-rose-600 hover:text-rose-800 px-3 py-1 rounded-md hover:bg-rose-100"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto z-50">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-[95%] md:max-w-2xl my-8 mx-2">
                            <div className="px-4 md:px-6 py-4 border-b border-sky-100 bg-sky-50 rounded-t-2xl flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-lg md:text-xl font-bold text-sky-800">
                                    {modalMode === 'add' ? 'New Package' : 'Edit Package'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-sky-400 hover:text-sky-600 text-lg md:text-xl p-1"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Title</label>
                                        <input
                                            name="title"
                                            value={modalData.title}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Duration</label>
                                        <input
                                            name="duration"
                                            value={modalData.duration}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">PAX</label>
                                        <input
                                            type="number"
                                            name="pax"
                                            value={modalData.pax}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Price (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="price"
                                            value={modalData.price}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Location</label>
                                        <input
                                            name="location"
                                            value={modalData.location}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Country</label>
                                        <input
                                            name="country"
                                            value={modalData.country}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Reviews</label>
                                        <input
                                            type="number"
                                            name="reviews"
                                            value={modalData.reviews}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Rating</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="rating"
                                            value={modalData.rating}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            min="0"
                                            max="5"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-sky-700 mb-1">
                                            Amenities (comma separated)
                                        </label>
                                        <input
                                            name="amenities"
                                            value={modalData.amenities}
                                            onChange={handleChange}
                                            placeholder="e.g., Swimming Pool, Free WiFi, Breakfast"
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-sky-700 mb-1">
                                            Highlights (comma separated)
                                        </label>
                                        <input
                                            name="highlights"
                                            value={modalData.highlights}
                                            onChange={handleChange}
                                            placeholder="e.g., Sunset Cruise, City Tour, Airport Transfer"
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-sky-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={modalData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-sky-700 mb-1">
                                        Package Images
                                    </label>

                                    <div className="mb-4">
                                        <p className="text-xs text-sky-500 mb-2">Existing Images:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {modalData.existing_images.map((img, index) => (
                                                <div key={`existing-${index}`} className="relative">
                                                    <img
                                                        src={img}
                                                        alt={`Existing ${index}`}
                                                        className="w-16 h-16 rounded-lg object-cover border border-sky-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index, 'existing')}
                                                        className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600"
                                                        style={{ width: '20px', height: '20px' }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {modalData.new_images.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-xs text-sky-500 mb-2">New Images to Upload:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {modalData.new_images.map((file, index) => (
                                                    <div key={`new-${index}`} className="relative">
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={`New ${index}`}
                                                            className="w-16 h-16 rounded-lg object-cover border border-sky-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(index, 'new')}
                                                            className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600"
                                                            style={{ width: '20px', height: '20px' }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                    />
                                    <p className="mt-1 text-xs text-sky-500">
                                        Upload package images (multiple selection allowed)
                                    </p>
                                </div>

                                <div className="flex justify-end space-x-2 md:space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-3 py-1.5 md:px-4 md:py-2 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg text-sm md:text-base"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 md:px-6 md:py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors text-sm md:text-base"
                                    >
                                        {modalMode === 'add' ? 'Create Package' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminPackages;