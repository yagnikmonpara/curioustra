import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

const AdminCabBookings = ({ bookings: initialBookings, auth }) => {
    const [bookings, setBookings] = useState(initialBookings);
    const [filteredBookings, setFilteredBookings] = useState(initialBookings);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'pickup_time', direction: 'desc' });
    const [loadingStates, setLoadingStates] = useState({});
    const [error, setError] = useState('');

    // Sorting logic
    const sortedBookings = [...filteredBookings].sort((a, b) => {
        const aValue = sortConfig.key.includes('.') 
            ? sortConfig.key.split('.').reduce((o, i) => o[i], a)
            : a[sortConfig.key];
        const bValue = sortConfig.key.includes('.') 
            ? sortConfig.key.split('.').reduce((o, i) => o[i], b)
            : b[sortConfig.key];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortConfig.direction === 'asc' 
                ? aValue.localeCompare(bValue) 
                : bValue.localeCompare(aValue);
        }
        return sortConfig.direction === 'asc' 
            ? (aValue > bValue ? 1 : -1)
            : (aValue < bValue ? 1 : -1);
    });

    // Handle sorting for any column
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    useEffect(() => {
        setBookings(initialBookings);
        setFilteredBookings(initialBookings);
    }, [initialBookings]);

    useEffect(() => {
        const searchLower = searchTerm.toLowerCase();
        const results = bookings.filter(booking => {
            const searchString = [
                booking.pickup_location,
                booking.dropoff_location,
                booking.distance_km,
                booking.total_price,
                booking.rate_per_km,
                booking.cab.make,
                booking.cab.model,
                booking.cab.registration_number,
                booking.user.name,
                booking.user.email,
                booking.user.phone,
                format(parseISO(booking.pickup_time), 'MMM d, yyyy h:mm a'),
                ...Object.values(booking.additional_info || {}).map(String)
            ].join(' ').toLowerCase();

            return searchString.includes(searchLower);
        });
        setFilteredBookings(results);
    }, [searchTerm, bookings]);

    const getStatusColor = (status) => {
        const colors = {
            confirmed: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800',
            'in-progress': 'bg-purple-100 text-purple-800'
        };
        return colors[status] || colors.pending;
    };

    const handleStatusChange = async (booking, newStatus) => {
        setLoadingStates(prev => ({ ...prev, [booking.id]: true }));
        setError('');
        try {
            const response = router.put(
                route(`admin.cab-bookings.${newStatus}`, booking.id),
                {},
                {
                    onSuccess: () => {
                        const updated = bookings.map(b => b.id === booking.id ? { ...b, status: newStatus } : b
                        );
                        setBookings(updated);
                        setShowDetailModal(false);
                    },
                    onError: (errors) => {
                        setError(errors.message || 'Failed to update status');
                    }
                }
            );

            if (response?.data?.error) {
                setError(response.data.error);
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while updating the status.');
        } finally {
            setLoadingStates(prev => ({ ...prev, [booking.id]: false }));
        }
    };

    const StatusButton = ({ booking, status, label, color }) => (
        <button
            onClick={() => handleStatusChange(booking, status)}
            disabled={loadingStates[booking?.id]}
            className={`${color} px-3 py-1 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {loadingStates[booking?.id] ? 'Processing...' : label}
        </button>
    );

    const formatPrice = (price) => {
        return `₹${price.toLocaleString('en-IN')}`;
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
                                <p className="text-sky-600 mt-1">Total bookings: {bookings.length}</p>
                            </div>

                            <div className="px-6 py-4 bg-sky-50 space-y-4">
                                <div className="relative max-w-md">
                                    <input
                                        type="text"
                                        className="pl-10 pr-10 py-2 w-full rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm text-sky-700 transition-all duration-200 ease-in-out"
                                        placeholder="Search bookings..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <svg className="h-5 w-5 text-sky-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="h-5 w-5 text-sky-400 absolute right-3 top-2.5 hover:text-sky-600"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-sky-200 rounded-lg overflow-hidden">
                                    <thead className="bg-sky-50 sticky top-0 z-10">
                                        <tr>
                                            {[
                                                ['User', 'user.name'],
                                                ['Cab', 'cab.registration_number'],
                                                ['Pickup Time', 'pickup_time'],
                                                ['Distance (km)', 'distance_km'],
                                                ['Total Price', 'total_price'],
                                                ['Status', 'status'],
                                                ['Actions', '']
                                            ].map(([label, sortKey]) => (
                                                <th 
                                                    key={sortKey}
                                                    className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase cursor-pointer hover:bg-sky-100 transition-colors"
                                                    onClick={() => sortKey && handleSort(sortKey)}
                                                >
                                                    {label}
                                                    {sortConfig.key === sortKey && (
                                                        <span className="ml-1">
                                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-sky-100">
                                        {sortedBookings.map(booking => (
                                            <tr key={booking?.id} className="hover:bg-sky-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-sky-900">
                                                    <div className="font-medium">{booking.user.name}</div>
                                                    <div className="text-sky-600 text-xs">{booking.user.email}</div>
                                                    <div className="text-sky-500 text-xs">{booking.user.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-900">
                                                    <div className="font-medium">{booking.cab.make} - {booking.cab.model}</div>
                                                    <div className="text-sky-500 text-xs">License: {booking.cab.registration_number}</div>
                                                </td>   
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    {format(parseISO(booking.pickup_time), 'MMM d, yyyy h:mm a')}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    {booking.distance_km} km
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-800">
                                                    {formatPrice(booking.total_price)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setShowDetailModal(true);
                                                        }}
                                                        className="text-sky-600 hover:text-sky-800 px-3 py-1 rounded-md hover:bg-sky-100 text-sm transition-colors"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {sortedBookings.length === 0 && (
                                    <div className="text-center py-8 text-sky-600">
                                        No bookings found matching your criteria
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {showDetailModal && selectedBooking && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto z-50">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-[95%] md:max-w-2xl my-8 mx-2 transition-all duration-300 ease-in-out">
                            <div className="px-4 md:px-6 py-4 border-b border-sky-100 bg-sky-50 rounded-t-2xl flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-lg md:text-xl font-bold text-sky-800">
                                    Booking Details
                                </h2>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-sky-400 hover:text-sky-600 text-lg md:text-xl p-1 transition-colors"
                                    aria-label="Close modal"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-4 md:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2 bg-sky-50 p-4 rounded-lg">
                                        <div className="flex items-center space-x-2 justify-center">
                                            <span className="text-sky-700 font-medium">
                                                {selectedBooking?.distance_km} km
                                            </span>
                                            <span className="text-sky-500">×</span>
                                            <span className="text-sky-700 font-medium">
                                                {formatPrice(selectedBooking?.rate_per_km)}/km
                                            </span>
                                            <span className="text-sky-500">=</span>
                                            <span className="font-semibold text-sky-800 text-lg">
                                                {formatPrice(selectedBooking?.total_price)}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">User Details</label>
                                        <div className="bg-sky-50 p-3 rounded-lg space-y-1">
                                            <p className="font-medium">{selectedBooking.user.name}</p>
                                            <p className="text-sky-600 text-sm">{selectedBooking.user.email}</p>
                                            <p className="text-sky-600 text-sm">{selectedBooking.user.phone}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Cab Details</label>
                                        <div className="bg-sky-50 p-3 rounded-lg space-y-1">
                                            <p className="font-medium">{selectedBooking.cab.make} - {selectedBooking.cab.model}</p>
                                            <p className="text-sky-600 text-sm">License: {selectedBooking.cab.registration_number}</p>
                                            <p className="text-sky-600 text-sm">Rate: {formatPrice(selectedBooking.cab.price_per_km)}/km</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Pickup Details</label>
                                        <div className="bg-sky-50 p-3 rounded-lg space-y-1">
                                            <p className="font-medium">{selectedBooking.pickup_location}</p>
                                            <p className="text-sky-600 text-sm">
                                                {format(parseISO(selectedBooking.pickup_time), 'MMM d, yyyy h:mm a')}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Dropoff Details</label>
                                        <div className="bg-sky-50 p-3 rounded-lg space-y-1">
                                            <p className="font-medium">{selectedBooking.dropoff_location}</p>
                                            <p className="text-sky-600 text-sm">
                                                Estimated duration: {Math.round(selectedBooking.distance_km / 40 * 60)} mins
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Rate per km</label>
                                        <div className="bg-sky-50 p-3 rounded-lg">
                                            {formatPrice(selectedBooking.rate_per_km)}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-sky-700 mb-1">Total Price</label>
                                        <div className="bg-sky-50 p-3 rounded-lg">
                                            {formatPrice(selectedBooking.total_price)}
                                        </div>
                                    </div>

                                    {selectedBooking.additional_info && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-sky-700 mb-1">Additional Information</label>
                                            <div className="bg-sky-50 p-3 rounded-lg grid grid-cols-2 gap-3">
                                                {Object.entries(selectedBooking.additional_info).map(([key, value]) => (
                                                    <div key={key} className="flex flex-col">
                                                        <span className="text-sky-700 text-sm font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                                                        <span className="text-sky-900 text-sm">{value || 'N/A'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2 pt-4 border-t border-sky-100">
                                    {selectedBooking.status === 'pending' && (
                                        <>
                                            <StatusButton
                                                booking={selectedBooking}
                                                status="confirm"
                                                label="Confirm"
                                                color="text-green-600 hover:text-green-800 hover:bg-green-100"
                                            />
                                            <StatusButton
                                                booking={selectedBooking}
                                                status="cancel"
                                                label="Cancel"
                                                color="text-rose-600 hover:text-rose-800 hover:bg-rose-100"
                                            />
                                        </>
                                    )}
                                    {selectedBooking.status === 'confirmed' && (
                                        <>
                                            <StatusButton
                                                booking={selectedBooking}
                                                status="in-progress"
                                                label="In Progress"
                                                color="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100"
                                            />
                                        </>
                                    )}
                                    {selectedBooking.status === 'in-progress' && (
                                        <>
                                            <StatusButton
                                                booking={selectedBooking}
                                                status="complete"
                                                label="Complete"
                                                color="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                                            />
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-end pt-4 border-t border-sky-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowDetailModal(false)}
                                        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors text-sm"
                                    >
                                        Close Details
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