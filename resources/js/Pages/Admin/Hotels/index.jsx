import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

const AdminHotels = ({ hotels: initialHotels = [] }) => {
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [modalData, setModalData] = useState({
        id: null,
        name: '',
        description: '',
        address: '',
        city: '',
        country: '',
        stars: 3,
        price_per_night: '',
        amenities: '', 
        existing_images: [], 
        new_images: [], 
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const safeHotels = Array.isArray(initialHotels) ? initialHotels : [];
        setHotels(safeHotels);
        setFilteredHotels(safeHotels);
    }, [initialHotels]);

    useEffect(() => {
        const results = hotels.filter(hotel =>
            hotel && Object.values(hotel).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredHotels(results);
    }, [searchTerm, hotels]);

    const openModal = (mode, data = null) => {
        setModalMode(mode);
        if (data) {
            setModalData({
                ...data,
                existing_images: data.images || [], // Existing images
                amenities: data.amenities || '', // Initialize amenities as a string
                new_images: [], // New array for images
            });
        } else {
            setModalData({
                id: null,
                name: '',
                description: '',
                address: '',
                city: '',
                country: '',
                stars: 3,
                price_per_night: '',
                amenities: '',
                existing_images: [],
                new_images: [],
            });
        }
        setShowModal(true);
    };

    const handleRemoveImage = (index, type) => {
        if (type === 'existing') {
            const updatedImages = [...modalData.existing_images];
            updatedImages.splice(index, 1);
            setModalData({ ...modalData, existing_images: updatedImages });
        } else {
            const updatedImages = [...modalData.new_images];
            updatedImages.splice(index, 1);
            setModalData({ ...modalData, new_images: updatedImages });
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setModalData({ ...modalData, new_images: files });
    };

    const handleChange = (e) => {
        setModalData({
            ...modalData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();

        // Basic fields
        data.append('name', modalData.name);
        data.append('description', modalData.description);
        data.append('address', modalData.address);
        data.append('city', modalData.city);
        data.append('country', modalData.country);
        data.append('stars', modalData.stars);
        data.append('price_per_night', modalData.price_per_night);
        data.append('amenities', modalData.amenities);

        modalData.new_images.forEach((file) => {
            data.append('new_images[]', file);
        });

        const requestOptions = {
            onSuccess: () => window.location.reload(),
            onError: (error) => {
                console.error('Error creating hotel:', error);
            },
            preserveScroll: true,
        };

        if (modalMode === 'add') {
            router.post(route('admin.hotels.store'), data, requestOptions);
        } else {
            data.append('_method', 'PUT');
            router.post(route('admin.hotels.update', modalData.id), data, requestOptions);
        }
    };

    return (
        <AdminLayout>
            <Head title="Hotels" />
            <div className="min-h-screen bg-sky-50">
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-sky-800">Hotel Management</h2>
                                <button
                                    onClick={() => openModal('add')}
                                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-all hover:scale-105"
                                >
                                    + Add Hotel
                                </button>
                            </div>

                            <div className="px-6 py-4 bg-sky-50">
                                <div className="relative max-w-xs">
                                    <input
                                        type="text"
                                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm text-sky-700"
                                        placeholder="Search hotels..."
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
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Location</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Stars</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Price/Night</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Amenities</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Images</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-sky-700 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-sky-100">
                                        {filteredHotels.map(hotel => (
                                            <tr key={hotel.id} className="hover:bg-sky-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-sky-900">{hotel.name}</td>
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    {[hotel.city, hotel.country].filter(Boolean).join(', ')}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    <div className="flex items-center">
                                                        {Array.from({ length: hotel.stars }).map((_, i) => (
                                                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    {hotel.price_per_night?.toLocaleString('en-US', {
                                                        style: 'currency',
                                                        currency: 'USD'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-800 max-w-xs">
                                                    {hotel.amenities}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex space-x-1">
                                                        {hotel.images?.slice(0, 3).map((img, i) => (
                                                            <img
                                                                key={i}
                                                                src={img}
                                                                alt="Hotel"
                                                                className="w-12 h-12 rounded-lg object-cover border border-sky-200"
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => openModal('edit', hotel)}
                                                        className="text-sky-600 hover:text-sky-800 px-3 py-1 rounded-md hover:bg-sky-100"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this hotel?')) {
                                                                router.delete(route('admin.hotels.destroy', hotel.id), {
                                                                    onSuccess: () => window.location.reload(),
                                                                });
                                                            }
                                                        }}
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
                                    {modalMode === 'add' ? 'New Hotel' : 'Edit Hotel'}
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
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Name</label>
                                        <input
                                            name="name"
                                            value={modalData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Stars</label>
                                        <select
                                            name="stars"
                                            value={modalData.stars}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            required
                                        >
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <option key={num} value={num}>
                                                    {num} Star{num > 1 ? 's' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Price/Night</label>
                                        <input
                                            type="number"
                                            name="price_per_night"
                                            value={modalData.price_per_night}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Address</label>
                                        <input
                                            name="address"
                                            value={modalData.address}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">City</label>
                                        <input
                                            name="city"
                                            value={modalData.city}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Country</label>
                                        <input
                                            name="country"
                                            value={modalData.country}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-sky-700 mb-1">Amenities</label>
                                    <textarea
                                        name="amenities"
                                        value={modalData.amenities}
                                        onChange={handleChange}
                                        rows="2"
                                        className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                        placeholder="Enter comma-separated amenities (e.g., Pool, WiFi, Restaurant)"
                                    />
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
                                        Hotel Images
                                    </label>

                                    {/* Existing images */}
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

                                    {/* New images preview */}
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

                                    {/* File input */}
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                    />
                                    <p className="mt-1 text-xs text-sky-500">
                                        Upload new hotel images (multiple selection allowed)
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
                                        {modalMode === 'add' ? 'Create Hotel' : 'Save Changes'}
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

export default AdminHotels;