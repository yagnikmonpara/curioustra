import { Head, router } from '@inertiajs/react';
import '../../../../css/AdminDestinations.css';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

const AdminDestinations = ({ destinations: initialDestinations }) => {
    const [destinations, setDestinations] = useState(initialDestinations);
    const [filteredDestinations, setFilteredDestinations] = useState(initialDestinations);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [modalData, setModalData] = useState({
        id: null,
        name: '',
        description: '',
        price: '',
        image: null,
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setDestinations(initialDestinations);
        setFilteredDestinations(initialDestinations);
    }, [initialDestinations]);

    useEffect(() => {
        const results = destinations.filter(destination =>
            destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            destination.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            destination.price.toString().includes(searchTerm)
        );
        setFilteredDestinations(results);
    }, [searchTerm, destinations]);

    const openModal = (mode, data = { id: null, name: '', description: '', price: '', image: null }) => {
        setModalMode(mode);
        setModalData(data);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleChange = (e) => {
        setModalData({
            ...modalData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        setModalData({
            ...modalData,
            image: e.target.files[0],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', modalData.name);
        data.append('description', modalData.description);
        data.append('price', modalData.price);
        if (modalData.image) {
            data.append('image', modalData.image);
        }

        if (modalMode === 'add') {
            router.post(route('admin.destinations.store'), data, {
                onSuccess: () => window.location.reload(),
            });
        } else {
            data.append('_method', 'PUT');
            router.post(route('admin.destinations.update', modalData.id), data, {
                onSuccess: () => window.location.reload(),
            });
        }
        closeModal();
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this destination?')) {
            router.delete(route('admin.destinations.destroy', id), {
                onSuccess: () => window.location.reload(),
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Destinations" />
            <div className="admin-destinations-page">
                <main className="destinations-container">
                    <div className="flex flex-col">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                                <div className="border rounded-lg divide-y divide-gray-200">
                                <div className="py-3 px-4 flex justify-between items-center">
                                        <h2 className="text-xl font-semibold">Destinations</h2>
                                        <button onClick={() => openModal('add')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Destination</button>
                                    </div>
                                    <div className="py-3 px-4">
                                        <div className="relative max-w-xs">
                                            <label className="sr-only">Search</label>
                                            <input type="text" name="hs-table-with-pagination-search" id="hs-table-with-pagination-search" className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="Search for items" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                                                <svg className="size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="11" cy="11" r="8"></circle>
                                                    <path d="m21 21-4.3-4.3"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Description</th>
                                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Price</th>
                                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Image</th>
                                                    <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {filteredDestinations.map(destination => (
                                                    <tr key={destination.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{destination.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{destination.description}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{destination.price}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                            {destination.image && <img src={destination.image} alt={destination.name} style={{ maxWidth: '50px' }} />}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                            <button onClick={() => openModal('edit', destination)} className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none">Edit</button>
                                                            <button onClick={() => handleDelete(destination.id)} className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 focus:outline-none focus:text-red-800 disabled:opacity-50 disabled:pointer-events-none">Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="py-1 px-4">
                                        <nav className="flex items-center space-x-1" aria-label="Pagination">
                                            <button type="button" className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none" aria-label="Previous">
                                                <span aria-hidden="true">«</span>
                                                <span className="sr-only">Previous</span>
                                            </button>
                                            <button type="button" className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-1 0 focus:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none" aria-current="page">1</button>
                                            <button type="button" className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none">2</button>
                                            <button type="button" className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none">3</button>
                                            <button type="button" className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none" aria-label="Next">
                                                <span className="sr-only">Next</span>
                                                <span aria-hidden="true">»</span>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">{modalMode === 'add' ? 'Add Destination' : 'Edit Destination'}</h2>
                                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" name="name" placeholder="Name" value={modalData.name} onChange={handleChange} />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" name="description" placeholder="Description" value={modalData.description} onChange={handleChange} />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price</label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="price" type="number" name="price" placeholder="Price" value={modalData.price} onChange={handleChange} />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Image</label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="image" type="file" name="image" onChange={handleImageChange} />
                                </div>
                                <div className="flex justify-end">
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">{modalMode === 'add' ? 'Add' : 'Update'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminDestinations;