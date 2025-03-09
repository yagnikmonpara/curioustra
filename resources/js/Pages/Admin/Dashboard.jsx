import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = ({ auth, revenue }) => {
    
    // Sample data for charts
    const bookingTrendsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Cab Bookings',
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'Package Bookings',
                data: [28, 48, 40, 19, 86, 27, 90],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
            },
            {
                label: 'Hotel Bookings',
                data: [12, 34, 20, 15, 67, 18, 22],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Guide Bookings',
                data: [18, 22, 12, 34, 20, 15, 67],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
            },
        ],
    };

    const revenueTrendsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Revenue',
                data: [12000, 19000, 3000, 5000, 2000, 3000, 45000, 12000, 19000, 3000, 5000, 2000],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
            },
        ],
    };

    return (
        <AdminLayout>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-sky-50 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-sky-800">Welcome back, {auth.user.name}!</h1>
                    <div className="space-x-4">
                        <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700">
                            Add New Booking
                        </button>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                            Generate Reports
                        </button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold text-sky-800">Total Bookings</h2>
                        <p className="text-3xl font-bold">150</p>
                        <p className="text-sm text-sky-600">Cab: 50, Package: 30, Hotel: 20, Guide: 10</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold text-sky-800">Revenue</h2>
                        <p className="text-3xl font-bold">₹2,00,000</p>
                        <p className="text-sm text-sky-600">Cab: ₹50,000, Package: ₹1,00,000, Hotel: ₹20,000, Guide: ₹10,000</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold text-sky-800">Pending Bookings</h2>
                        <p className="text-3xl font-bold">11</p>
                        <p className="text-sm text-sky-600">Cab: 5, Package: 3, Hotel: 2, Guide: 1</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-sky-800 mb-4">Booking Trends</h2>
                        <Line data={bookingTrendsData} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-sky-800 mb-4">Revenue Trends</h2>
                        <Bar data={revenueTrendsData} />
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <h2 className="text-xl font-bold text-sky-800 mb-4">Quick Links</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700">
                            Manage Bookings
                        </button>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                            Manage Users
                        </button>
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                            Generate Reports
                        </button>
                        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;