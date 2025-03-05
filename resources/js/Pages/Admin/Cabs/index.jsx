import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

const AdminCabs = ({ cabs: initialCabs = [] }) => {
    const [cabs, setCabs] = useState([]);
    const [filteredCabs, setFilteredCabs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [modalData, setModalData] = useState({
        id: null,
        make: '',
        model: '',
        registration_number: '',
        driver_name: '',
        driver_contact_number: '',
        capacity: 4,
        price_per_km: '',
        location: '',
        status: 'available',
        existing_images: [],
        new_images: [],
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const safeCabs = Array.isArray(initialCabs) ? initialCabs : [];
        setCabs(safeCabs);
        setFilteredCabs(safeCabs);
    }, [initialCabs]);

    useEffect(() => {
        const results = cabs.filter(cab =>
            cab && Object.values(cab).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredCabs(results);
    }, [searchTerm, cabs]);

    const openModal = (mode, data = null) => {
        setModalMode(mode);
        if (data) {
            setModalData({
                ...data,
                existing_images: data.images ? [...data.images] : [],
                new_images: [],
            });
        } else {
            setModalData({
                id: null,
                make: '',
                model: '',
                registration_number: '',
                driver_name: '',
                driver_contact_number: '',
                capacity: 4,
                price_per_km: '',
                location: '',
                status: 'available',
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
        data.append('make', modalData.make);
        data.append('model', modalData.model);
        data.append('registration_number', modalData.registration_number);
        data.append('driver_name', modalData.driver_name);
        data.append('driver_contact_number', modalData.driver_contact_number);
        data.append('capacity', modalData.capacity);
        data.append('price_per_km', modalData.price_per_km);
        data.append('location', modalData.location);
        data.append('status', modalData.status);

        // Handle images
        modalData.existing_images.forEach(img => data.append('existing_images[]', img));
        modalData.new_images.forEach(file => data.append('new_images[]', file));

        const requestOptions = {
            onSuccess: () => window.location.reload(),
            preserveScroll: true,
        };

        if (modalMode === 'add') {
            router.post(route('admin.cabs.store'), data, requestOptions);
        } else {
            data.append('_method', 'PUT');
            router.post(route('admin.cabs.update', modalData.id), data, requestOptions);
        }
    };

    return (
        <AdminLayout>
            <Head title="Cabs" />
            <div className="min-h-screen bg-sky-50">
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-sky-800">Cab Management</h2>
                                <button
                                    onClick={() => openModal('add')}
                                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-all hover:scale-105"
                                >
                                    + Add Cab
                                </button>
                            </div>

                            <div className="px-6 py-4 bg-sky-50">
                                <div className="relative max-w-xs">
                                    <input
                                        type="text"
                                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm text-sky-700"
                                        placeholder="Search cabs..."
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
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Cab Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Driver Info</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Capacity</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Price/KM</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Images</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-sky-700 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-sky-100">
                                        {filteredCabs.map(cab => (
                                            <tr key={cab.id} className="hover:bg-sky-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sky-900">{cab.make} {cab.model}</span>
                                                        <span className="text-sm text-sky-600">{cab.registration_number}</span>
                                                        <span className="text-sm text-sky-500">{cab.location}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sky-900">{cab.driver_name}</span>
                                                        <span className="text-sky-600">{cab.driver_contact_number}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-800">{cab.capacity} seats</td>
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    ${cab.price_per_km}/km
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cab.status === 'available' ? 'bg-green-100 text-green-800' :
                                                            cab.status === 'booked' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {cab.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex space-x-1">
                                                        {cab.images?.map((img, i) => (
                                                            <img
                                                                key={i}
                                                                src={img}
                                                                alt="Cab"
                                                                className="w-12 h-12 rounded-lg object-cover border border-sky-200"
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => openModal('edit', cab)}
                                                        className="text-sky-600 hover:text-sky-800 px-3 py-1 rounded-md hover:bg-sky-100"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this cab?')) {
                                                                router.delete(route('admin.cabs.destroy', cab.id), {
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
                                    {modalMode === 'add' ? 'New Cab' : 'Edit Cab'}
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
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Make</label>
                                        <input
                                            name="make"
                                            value={modalData.make}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Model</label>
                                        <input
                                            name="model"
                                            value={modalData.model}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Registration Number</label>
                                        <input
                                            name="registration_number"
                                            value={modalData.registration_number}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Driver Name</label>
                                        <input
                                            name="driver_name"
                                            value={modalData.driver_name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Driver Contact</label>
                                        <input
                                            name="driver_contact_number"
                                            value={modalData.driver_contact_number}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Capacity</label>
                                        <input
                                            type="number"
                                            name="capacity"
                                            value={modalData.capacity}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Price per KM ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="price_per_km"
                                            value={modalData.price_per_km}
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
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Status</label>
                                        <select
                                            name="status"
                                            value={modalData.status}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                        >
                                            <option value="available">Available</option>
                                            <option value="booked">Booked</option>
                                            <option value="unavailable">Unavailable</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-sky-700 mb-1">
                                        Cab Images
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
                                        Upload cab images (multiple selection allowed)
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
                                        {modalMode === 'add' ? 'Create Cab' : 'Save Changes'}
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

export default AdminCabs;