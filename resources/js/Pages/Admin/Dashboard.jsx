import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard() {
    const [bookings, setBookings] = useState({
        total: 200,
        packages: 50,
        hotels: 30,
        cabs: 50,
        trains: 50,
        flights: 20,
    });

    const chartData = {
        labels: ['Bookings', 'Packages', 'Hotels', 'Cabs', 'Trains', 'Flights'],
        datasets: [
            {
                label: 'Count',
                data: [bookings.total, bookings.packages, bookings.hotels, bookings.cabs, bookings.trains, bookings.flights],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Booking Summary',
            },
        },
    };

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"> {/* Grid layout for boxes */}
                        <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-700">Total Bookings</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-700">{bookings.total}</p>
                        </div>
                        <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-700">Total Packages</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-700">{bookings.packages}</p>
                        </div>
                        <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-700">Total Hotels</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-700">{bookings.hotels}</p>
                        </div>
                        <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-700">Total Cabs</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-700">{bookings.cabs}</p>
                        </div>
                        <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-700">Total Trains</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-700">{bookings.trains}</p>
                        </div>
                        <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-700">Total Flights</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-700">{bookings.flights}</p>
                        </div>
                    </div>

                    <div className="mt-8 bg-white shadow-sm sm:rounded-lg dark:bg-gray-200 p-6"> {/* Chart container */}
                        <Bar options={chartOptions} data={chartData} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}