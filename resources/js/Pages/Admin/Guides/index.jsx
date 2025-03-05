import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

const AdminGuides = ({ guides: initialGuides = [] }) => {
    const [guides, setGuides] = useState([]);
    const [filteredGuides, setFilteredGuides] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [modalData, setModalData] = useState({
        id: null,
        name: '',
        bio: '',
        specialization: '',
        contact_number: '',
        email: '',
        languages: [],
        profile_picture: null,
        existing_image: '',
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const safeGuides = Array.isArray(initialGuides) ? initialGuides : [];
        setGuides(safeGuides);
        setFilteredGuides(safeGuides);
    }, [initialGuides]);

    useEffect(() => {
        const results = guides.filter(guide =>
            guide && Object.values(guide).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredGuides(results);
    }, [searchTerm, guides]);

    const openModal = (mode, data = null) => {
        setModalMode(mode);
        if (data) {
            setModalData({
                ...data,
                existing_image: data.profile_picture || '',
                profile_picture: null,
            });
        } else {
            setModalData({
                id: null,
                name: '',
                bio: '',
                specialization: '',
                contact_number: '',
                email: '',
                languages: '',
                profile_picture: null,
                existing_image: '',
            });
        }
        setShowModal(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setModalData({ 
            ...modalData, 
            profile_picture: file,
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

        // Basic fields
        data.append('name', modalData.name);
        data.append('bio', modalData.bio);
        data.append('specialization', modalData.specialization);
        data.append('contact_number', modalData.contact_number);
        data.append('email', modalData.email);
        data.append('languages', modalData.languages);
        // Handle profile picture
        if (modalData.profile_picture) {
            data.append('profile_picture', modalData.profile_picture);
        }

        const requestOptions = {
            onSuccess: () => window.location.reload(),
            preserveScroll: true,
        };

        if (modalMode === 'add') {
            router.post(route('admin.guides.store'), data, requestOptions);
        } else {
            data.append('_method', 'PUT');
            router.post(route('admin.guides.update', modalData.id), data, requestOptions);
        }
    };

    return (
        <AdminLayout>
            <Head title="Guides" />
            <div className="min-h-screen bg-sky-50">
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-sky-800">Guide Management</h2>
                                <button
                                    onClick={() => openModal('add')}
                                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-all hover:scale-105"
                                >
                                    + Add Guide
                                </button>
                            </div>

                            <div className="px-6 py-4 bg-sky-50">
                                <div className="relative max-w-xs">
                                    <input
                                        type="text"
                                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm text-sky-700"
                                        placeholder="Search guides..."
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
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Profile</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Specialization</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Languages</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-sky-700 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-sky-100">
                                        {filteredGuides.map(guide => (
                                            <tr key={guide.id} className="hover:bg-sky-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <img
                                                        src={guide.profile_picture || '/placeholder-avatar.jpg'}
                                                        alt="Profile"
                                                        className="w-12 h-12 rounded-full object-cover border border-sky-200"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-sky-900">{guide.name}</td>
                                                <td className="px-6 py-4 text-sm text-sky-800">{guide.specialization}</td>
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    <div className="flex flex-col">
                                                        <span>{guide.contact_number}</span>
                                                        <span className="text-sky-600">{guide.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    {Array.isArray(guide.languages) ? guide.languages.join(', ') : guide.languages}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => openModal('edit', guide)}
                                                        className="text-sky-600 hover:text-sky-800 px-3 py-1 rounded-md hover:bg-sky-100"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this guide?')) {
                                                                router.delete(route('admin.guides.destroy', guide.id), {
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
                                    {modalMode === 'add' ? 'New Guide' : 'Edit Guide'}
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
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Specialization</label>
                                        <input
                                            name="specialization"
                                            value={modalData.specialization}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Contact Number</label>
                                        <input
                                            name="contact_number"
                                            value={modalData.contact_number}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={modalData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-sky-700 mb-1">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={modalData.bio}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-sky-700 mb-1">Languages</label>
                                    <input
                                        name="languages"
                                        value={modalData.languages}
                                        onChange={handleChange}
                                        className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                        placeholder="Enter comma-separated languages (e.g., English, Spanish)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-sky-700 mb-1">
                                        Profile Picture
                                    </label>
                                    <div className="flex items-center gap-4">
                                        {modalData.existing_image && (
                                            <img
                                                src={modalData.existing_image}
                                                alt="Current Profile"
                                                className="w-16 h-16 rounded-full object-cover border border-sky-200"
                                            />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-sky-500">
                                        Upload a profile picture (JPEG, PNG, JPG, GIF up to 2MB)
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
                                        {modalMode === 'add' ? 'Create Guide' : 'Save Changes'}
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

export default AdminGuides;