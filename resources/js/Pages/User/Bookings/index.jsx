import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Bookings = ({ packageBookings, cabBookings, guideBookings }) => {
    const [search, setSearch] = useState("");

    // Merge all bookings with type identifiers
    const allBookings = [
        ...packageBookings.map(b => ({ ...b, type: 'package', uniqueKey: `package_${b.id}` })),
        ...cabBookings.map(b => ({ ...b, type: 'cab', uniqueKey: `cab_${b.id}` })),
        ...guideBookings.map(b => ({ ...b, type: 'guide', uniqueKey: `guide_${b.id}` })),
    ];

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-700 ring-1 ring-yellow-500/20';
            case 'confirmed': return 'bg-blue-500/10 text-blue-700 ring-1 ring-blue-500/20';
            case 'in-progress': return 'bg-purple-500/10 text-purple-700 ring-1 ring-purple-500/20';
            case 'completed': return 'bg-green-500/10 text-green-700 ring-1 ring-green-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-700 ring-1 ring-red-500/20';
            default: return 'bg-gray-500/10 text-gray-700 ring-1 ring-gray-500/20';
        }
    };

    const handleCancel = async (booking) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        
        try {
            const response = await axios.post(`/packages/${booking.id}/cancel`);
            console.log('Cancellation successful:', response.data);
            // switch (booking.type) {
            //     case 'package':
            //         await axios.post(route('packages.cancel', booking.id));
            //         break;
            //     case 'cab':
            //         await axios.post(route('cabs.cancel', booking.id));
            //         break;
            //     case 'guide':
            //         await axios.post(route('guides.cancel', booking.id));
            //         break;
            //     default:
            //         alert('Cancellation not available for this booking type');
            //         return;
            // }

            router.reload({ only: ['packageBookings', 'cabBookings', 'guideBookings'] });
        } catch (error) {
            alert('Cancellation failed: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDownloadReceipt = async (booking) => {
        try {
            let endpoint;
            switch (booking.type) {
                case 'package':
                    endpoint = route('packages.download-receipt', booking.id);
                    break;
                case 'cab':
                    endpoint = route('cabs.download-receipt', booking.id);
                    break;
                case 'guide':
                    endpoint = route('guides.download-receipt', booking.id);
                    break;
                default:
                    return;
            }
    
            const response = await axios.get(`${endpoint}`, {
                responseType: 'blob'
            });
    
            // Create blob URL
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // Create download link
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `receipt-${booking.type}-${booking.id}.pdf`);
            document.body.appendChild(link);
            
            // Trigger download
            link.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
    
        } catch (error) {
            console.error('Download failed:', error);
            
            // Try to get error message from response if available
            let errorMessage = 'Failed to download receipt';
            if (error.response) {
                try {
                    const text = await error.response.data.text();
                    const json = JSON.parse(text);
                    errorMessage = json.message || errorMessage;
                } catch (e) {
                    errorMessage = error.response.statusText || errorMessage;
                }
            } else {
                errorMessage = error.message || errorMessage;
            }
            
            alert(errorMessage);
        }
    };

    const filteredBookings = allBookings.filter(booking =>
        booking.type.toLowerCase().includes(search.toLowerCase()) ||
        booking.status.toLowerCase().includes(search.toLowerCase()) ||
        booking.payment_id?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Bookings" />

            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="section-subtitle">Manage Your Bookings</p>
                        <h2 className="h2 section-title">My Bookings</h2>
                        <p className="section-text">
                            View and manage all your bookings in one place. Cancel pending bookings if needed.
                        </p>
                    </motion.div>

                    <div className="flex flex-col gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Search bookings by type..."
                            className="w-96 mx-auto p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="text-sm text-gray-500 text-center">
                            Showing {filteredBookings.length} bookings
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredBookings.length === 0 && (
                            <div className="text-center py-12 col-span-full">
                                <div className="text-gray-500 mb-4">✈️</div>
                                <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Try adjusting your search or create a new booking
                                </p>
                            </div>
                        )}
                        {filteredBookings.map((booking) => (
                            <motion.div
                                key={booking.uniqueKey}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <h3 className="text-lg font-semibold capitalize">
                                                    {booking.type} Booking
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-gray-600">
                                        {booking.type === 'package' && (
                                            <>
                                                <p><span className="font-medium">Package:</span> {booking.package?.title}</p>
                                                <p><span className="font-medium">Start Date:</span> {new Date(booking.start_date).toLocaleDateString()}</p>
                                                <p><span className="font-medium">Travelers:</span> {booking.number_of_people}</p>
                                                <p><span className="font-medium">Total:</span> ₹{booking.total_price}</p>
                                                <p><span className="font-medium">Payment ID:</span> {booking.payment_id || 'N/A'}</p>
                                            </>
                                        )}

                                        {booking.type === 'cab' && (
                                            <>
                                                <p><span className="font-medium">Cab:</span> {booking.cab?.make} {booking.cab?.model}</p>
                                                <p><span className="font-medium">Pickup:</span> {booking.pickup_location}</p>
                                                <p><span className="font-medium">Dropoff:</span> {booking.dropoff_location}</p>
                                                <p><span className="font-medium">When:</span> {new Date(booking.pickup_time).toLocaleString()}</p>
                                                <p><span className="font-medium">Payment ID:</span> {booking.payment_id || 'N/A'}</p>
                                            </>
                                        )}

                                        {booking.type === 'guide' && (
                                            <>
                                                <p><span className="font-medium">Guide:</span> {booking.guide?.name}</p>
                                                <p><span className="font-medium">Meeting At:</span> {booking.meeting_location}</p>
                                                <p><span className="font-medium">Duration:</span> {booking.duration_hours} hours</p>
                                                <p><span className="font-medium">Total:</span> ₹{booking.total_price}</p>
                                                <p><span className="font-medium">Payment ID:</span> {booking.payment_id || 'N/A'}</p>
                                            </>
                                        )}
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {booking.status.toLowerCase() === 'pending' ? (
                                            <button
                                                onClick={() => handleCancel(booking)}
                                                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                                            >
                                                Cancel Booking
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleDownloadReceipt(booking)}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                                            >
                                                Download Receipt
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
};

export default Bookings;