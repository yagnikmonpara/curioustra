import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

const AdminReviews = ({ reviews: initialReviews = [], auth }) => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [modalData, setModalData] = useState({
        id: null,
        rating: 5,
        comment: '',
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const safeReviews = Array.isArray(initialReviews) ? initialReviews : [];
        setReviews(safeReviews);
        setFilteredReviews(safeReviews);
    }, [initialReviews]);

    useEffect(() => {
        const results = reviews.filter(review =>
            review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.rating?.toString().includes(searchTerm)
        );
        setFilteredReviews(results);
    }, [searchTerm, reviews]);

    const openModal = (mode, data = null) => {
        setModalMode(mode);
        if (data) {
            setModalData({
                id: data.id,
                rating: data.rating,
                comment: data.comment,
            });
        } else {
            setModalData({
                id: null,
                rating: 5,
                comment: '',
            });
        }
        setShowModal(true);
    };

    const handleChange = (e) => {
        setModalData({
            ...modalData,
            [e.target.name]: e.target.value
        });
    };

    const handleRatingChange = (newRating) => {
        setModalData({
            ...modalData,
            rating: newRating
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            rating: modalData.rating,
            comment: modalData.comment
        };

        const requestOptions = {
            onSuccess: () => window.location.reload(),
            preserveScroll: true,
        };

        if (modalMode === 'add') {
            router.post(route('admin.reviews.store'), data, requestOptions);
        } else {
            router.put(route('admin.reviews.update', modalData.id), data, requestOptions);
        }
    };

    const canEditDelete = (review) => {
        return auth.user.role === 'admin' || review.user_id === auth.user.id;
    };

    return (
        <AdminLayout>
            <Head title="Review Management" />
            <div className="min-h-screen bg-sky-50">
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-sky-800">Review Management</h2>
                                {auth.user.role === 'admin' && (
                                    <button
                                        onClick={() => openModal('add')}
                                        className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-all hover:scale-105"
                                    >
                                        + Add Review
                                    </button>
                                )}
                            </div>

                            <div className="px-6 py-4 bg-sky-50">
                                <div className="relative max-w-xs">
                                    <input
                                        type="text"
                                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm text-sky-700"
                                        placeholder="Search by comment, user, or rating..."
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
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Rating</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Comment</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Date</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-sky-700 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-sky-100">
                                        {filteredReviews.map(review => (
                                            <tr key={review.id} className="hover:bg-sky-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    <div className="flex flex-col">
                                                        <span>{review.user?.name}</span>
                                                        <span className="text-xs text-sky-600">ID: {review.user_id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className="text-2xl">
                                                                {i < review.rating ? '★' : '☆'}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-800 max-w-xs">{review.comment}</td>
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    {canEditDelete(review) && (
                                                        <>
                                                            <button
                                                                onClick={() => openModal('edit', review)}
                                                                className="text-sky-600 hover:text-sky-800 px-3 py-1 rounded-md hover:bg-sky-100"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm('Are you sure you want to delete this review?')) {
                                                                        router.delete(route('admin.reviews.destroy', review.id), {
                                                                            onSuccess: () => window.location.reload(),
                                                                        });
                                                                    }
                                                                }}
                                                                className="text-rose-600 hover:text-rose-800 px-3 py-1 rounded-md hover:bg-rose-100"
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
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
                                    {modalMode === 'add' ? 'New Review' : 'Edit Review'}
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
                                    <label className="block text-sm font-medium text-sky-700 mb-1">Rating</label>
                                    <div className="flex items-center space-x-2">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                                key={rating}
                                                type="button"
                                                onClick={() => handleRatingChange(rating)}
                                                className={`text-2xl ${modalData.rating >= rating ? 'text-amber-400' : 'text-sky-200'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-sky-700 mb-1">Comment</label>
                                    <textarea
                                        name="comment"
                                        value={modalData.comment}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                        placeholder="Write your review..."
                                    />
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
                                        {modalMode === 'add' ? 'Submit Review' : 'Save Changes'}
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

export default AdminReviews;