import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

const AdminGallery = ({ gallery: initialGallery = [] }) => {
    const [gallery, setGallery] = useState([]);
    const [filteredGallery, setFilteredGallery] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [modalData, setModalData] = useState({
        id: null,
        caption: '',
        image: null,
        existing_image: '',
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const safeGallery = Array.isArray(initialGallery) ? initialGallery : [];
        setGallery(safeGallery);
        setFilteredGallery(safeGallery);
    }, [initialGallery]);

    useEffect(() => {
        const results = gallery.filter(item =>
            item.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.user_id?.toString().includes(searchTerm)
        );
        setFilteredGallery(results);
    }, [searchTerm, gallery]);

    const openModal = (mode, data = null) => {
        setModalMode(mode);
        if (data) {
            setModalData({
                ...data,
                existing_image: data.image || '',
                image: null,
            });
        } else {
            setModalData({
                id: null,
                caption: '',
                image: null,
                existing_image: '',
            });
        }
        setShowModal(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setModalData({
            ...modalData,
            image: file,
            existing_image: file ? URL.createObjectURL(file) : modalData.existing_image
        });
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

        data.append('caption', modalData.caption);
        if (modalData.image) {
            data.append('image', modalData.image);
        }

        const requestOptions = {
            onSuccess: () => window.location.reload(),
            preserveScroll: true,
        };

        if (modalMode === 'add') {
            router.post(route('admin.gallery.store'), data, requestOptions);
        } else {
            data.append('_method', 'PUT');
            router.post(route('admin.gallery.update', modalData.id), data, requestOptions);
        }
    };

    return (
        <AdminLayout>
            <Head title="Gallery Management" />
            <div className="min-h-screen bg-sky-50">
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-sky-800">Gallery Management</h2>
                                <button
                                    onClick={() => openModal('add')}
                                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-all hover:scale-105"
                                >
                                    + Add Image
                                </button>
                            </div>

                            <div className="px-6 py-4 bg-sky-50">
                                <div className="relative max-w-xs">
                                    <input
                                        type="text"
                                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm text-sky-700"
                                        placeholder="Search by caption or user name..."
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
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Image</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Caption</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Uploaded By</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Date</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-sky-700 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-sky-100">
                                        {filteredGallery.map(item => (
                                            <tr key={item.id} className="hover:bg-sky-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <img
                                                        src={item.image}
                                                        alt={item.caption}
                                                        className="w-20 h-20 object-cover rounded-lg border border-sky-200"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-800 max-w-xs">{item.caption}</td>
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    <div className="flex flex-col">
                                                        <span>{item.user_name}</span>
                                                        <span className="text-xs text-sky-600">ID: {item.user_id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => openModal('edit', item)}
                                                        className="text-sky-600 hover:text-sky-800 px-3 py-1 rounded-md hover:bg-sky-100"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this image?')) {
                                                                router.delete(route('admin.gallery.destroy', item.id), {
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
                                    {modalMode === 'add' ? 'Add New Image' : 'Edit Image'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-sky-400 hover:text-sky-600 text-lg md:text-xl p-1"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                                <div>
                                    <label className="block text-sm font-medium text-sky-700 mb-1">Caption</label>
                                    <textarea
                                        name="caption"
                                        value={modalData.caption}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                        placeholder="Enter image description..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-sky-700 mb-1">
                                        Image Upload
                                    </label>
                                    <div className="flex items-center gap-4">
                                        {modalData.existing_image && (
                                            <img
                                                src={modalData.existing_image}
                                                alt="Current"
                                                className="w-32 h-32 object-cover rounded-lg border border-sky-200"
                                            />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                            required={modalMode === 'add'}
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-sky-500">
                                        Upload an image (JPEG, PNG, JPG, GIF up to 2MB)
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
                                        {modalMode === 'add' ? 'Upload Image' : 'Save Changes'}
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

export default AdminGallery;