import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

const AdminCabBookings = ({ bookings: initialBookings }) => {
    const [bookings, setBookings] = useState(initialBookings);
    const [filteredBookings, setFilteredBookings] = useState(initialBookings);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setBookings(initialBookings);
        setFilteredBookings(initialBookings);
    }, [initialBookings]);

    useEffect(() => {
        const results = bookings.filter(booking =>
            Object.values(booking).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.cab.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBookings(results);
    }, [searchTerm, bookings]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const handleStatusChange = (booking, status) => {
        if (status === 'confirmed') {
            router.post(route('admin.cab-bookings.confirm', booking.id), {
                onSuccess: () => {
                    const updated = bookings.map(b => 
                        b.id === booking.id ? { ...b, status: 'confirmed' } : b
                    );
                    setBookings(updated);
                }
            });
        } else {
            router.post(route('admin.cab-bookings.cancel', booking.id), {
                onSuccess: () => {
                    const updated = bookings.map(b => 
                        b.id === booking.id ? { ...b, status: 'cancelled' } : b
                    );
                    setBookings(updated);
                }
            });
        }
    };

    const openDetailModal = (booking) => {
        setSelectedBooking(booking);
        setShowDetailModal(true);
    };

    return (
        <AdminLayout>
            <Head title="Cab Bookings" />
            <div className="min-h-screen bg-sky-50">
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white">
                                <h2 className="text-2xl font-bold text-sky-800">Cab Bookings Management</h2>
                            </div>

                            <div className="px-6 py-4 bg-sky-50">
                                <div className="relative max-w-xs">
                                    <input
                                        type="text"
                                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm text-sky-700"
                                        placeholder="Search bookings..."
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
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Cab</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Pickup Location</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Dropoff Location</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Pickup Time</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Distance</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-sky-700 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-sky-100">
                                        {filteredBookings.map(booking => (
                                            <tr key={booking.id} className="hover:bg-sky-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-sky-900">
                                                    <div className="font-medium">{booking.user.name}</div>
                                                    <div className="text-sky-600">{booking.user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-900">{booking.cab.name}</td>
                                                <td className="px-6 py-4 text-sm text-sky-800">{booking.pickup_location}</td>
                                                <td className="px-6 py-4 text-sm text-sky-800">{booking.dropoff_location}</td>
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    {new Date(booking.pickup_time).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    {booking.distance_km ? `${booking.distance_km} km` : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    ${booking.total_price?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => openDetailModal(booking)}
                                                        className="text-sky-600 hover:text-sky-800 px-3 py-1 rounded-md hover:bg-sky-100"
                                                    >
                                                        Details
                                                    </button>
                                                    {booking.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusChange(booking, 'confirmed')}
                                                                className="text-green-600 hover:text-green-800 px-3 py-1 rounded-md hover:bg-green-100"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(booking, 'cancelled')}
                                                                className="text-rose-600 hover:text-rose-800 px-3 py-1 rounded-md hover:bg-rose-100"
                                                            >
                                                                Cancel
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

                {showDetailModal && selectedBooking && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto z-50">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-[95%] md:max-w-2xl my-8 mx-2">
                            <div className="px-4 md:px-6 py-4 border-b border-sky-100 bg-sky-50 rounded-t-2xl flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-lg md:text-xl font-bold text-sky-800">
                                    Booking Details
                                </h2>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-sky-400 hover:text-sky-600 text-lg md:text-xl p-1"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-4 md:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">User</label>
                                        <div className="bg-sky-50 p-3 rounded-lg">
                                            <p className="font-medium">{selectedBooking.user.name}</p>
                                            <p className="text-sky-600">{selectedBooking.user.email}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Cab</label>
                                        <div className="bg-sky-50 p-3 rounded-lg">
                                            <p className="font-medium">{selectedBooking.cab.name}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Pickup Location</label>
                                        <div className="bg-sky-50 p-3 rounded-lg">
                                            {selectedBooking.pickup_location}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Dropoff Location</label>
                                        <div className="bg-sky-50 p-3 rounded-lg">
                                            {selectedBooking.dropoff_location}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Pickup Time</label>
                                        <div className="bg-sky-50 p-3 rounded-lg">
                                            {new Date(selectedBooking.pickup_time).toLocaleString()}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Distance</label>
                                        <div className="bg-sky-50 p-3 rounded-lg">
                                            {selectedBooking.distance_km ? `${selectedBooking.distance_km} km` : 'N/A'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Total Price</label>
                                        <div className="bg-sky-50 p-3 rounded-lg">
                                            ${selectedBooking.total_price?.toFixed(2) || '0.00'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Status</label>
                                        <div className="bg-sky-50 p-3 rounded-lg">
                                            <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(selectedBooking.status)}`}>
                                                {selectedBooking.status}
                                            </span>
                                        </div>
                                    </div>

                                    {selectedBooking.additional_info && Object.keys(selectedBooking.additional_info).length > 0 && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-sky-700 mb-1">Additional Information</label>
                                            <div className="bg-sky-50 p-3 rounded-lg space-y-2">
                                                {Object.entries(selectedBooking.additional_info).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between border-b border-sky-100 pb-2">
                                                        <span className="text-sky-700">{key}:</span>
                                                        <span className="text-sky-900">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowDetailModal(false)}
                                        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminCabBookings;