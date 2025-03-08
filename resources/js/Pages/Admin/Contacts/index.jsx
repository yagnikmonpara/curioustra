import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

const AdminContacts = ({ contacts: initialContacts = [] }) => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const safeContacts = Array.isArray(initialContacts) ? initialContacts : [];
        setContacts(safeContacts);
        setFilteredContacts(safeContacts);
    }, [initialContacts]);

    useEffect(() => {
        const results = contacts.filter(contact =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (contact.phone && contact.phone.toString().includes(searchTerm)) ||
            (contact.subject && contact.subject.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredContacts(results);
    }, [searchTerm, contacts]);

    const handleView = (contact) => {
        setSelectedContact(contact);
        setFormData({
            subject: `Re: ${contact.subject || 'Your Inquiry'}`,
            message: ''
        });
        setShowModal(true);
        
        // Mark as read
        if (!contact.read_at) {
            router.put(route('admin.contacts.markAsRead', contact.id), {}, {
                preserveScroll: true
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            router.delete(route('admin.contacts.destroy', id), {
                onSuccess: () => {
                    setContacts(contacts.filter(c => c.id !== id));
                }
            });
        }
    };

    const handleSendEmail = (e) => {
        e.preventDefault();
        router.post(route('admin.contacts.sendResponse', selectedContact.id), formData, {
            onSuccess: () => {
                setShowModal(false);
                alert('Response sent successfully!');
            },
            onError: (errors) => {
                alert('Error sending response: ' + (errors.message || 'Something went wrong'));
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Contact Management" />
            <div className="min-h-screen bg-sky-50">
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-sky-800">Contact Requests</h2>
                                <div className="relative max-w-xs">
                                    <input
                                        type="text"
                                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm text-sky-700"
                                        placeholder="Search contacts..."
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
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase"></th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Phone</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Subject</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-sky-700 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-sky-100">
                                        {filteredContacts.map(contact => (
                                            <tr key={contact.id} className="hover:bg-sky-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    {!contact.read_at && (
                                                        <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-800">{contact.name}</td>
                                                <td className="px-6 py-4 text-sm text-sky-800">{contact.email}</td>
                                                <td className="px-6 py-4 text-sm text-sky-800">{contact.phone}</td>
                                                <td className="px-6 py-4 text-sm text-sky-800 max-w-xs">{contact.subject}</td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleView(contact)}
                                                        className="text-sky-600 hover:text-sky-800 px-3 py-1 rounded-md hover:bg-sky-100"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(contact.id)}
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

                {showModal && selectedContact && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto z-50">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-[95%] md:max-w-2xl my-8 mx-2">
                            <div className="px-4 md:px-6 py-4 border-b border-sky-100 bg-sky-50 rounded-t-2xl flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-lg md:text-xl font-bold text-sky-800">
                                    Contact Details
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-sky-400 hover:text-sky-600 text-lg md:text-xl p-1"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-4 md:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-sky-700">From:</h3>
                                        <p className="mt-1 text-sm text-sky-900">{selectedContact.name}</p>
                                        <p className="text-sm text-sky-600">{selectedContact.email}</p>
                                        {selectedContact.phone && (
                                            <p className="text-sm text-sky-600">Phone: {selectedContact.phone}</p>
                                        )}
                                    </div>

                                    <div className="border-t border-sky-200"></div>

                                    <div>
                                        <h3 className="text-sm font-medium text-sky-700">Subject:</h3>
                                        <p className="mt-1 text-sm text-sky-900">{selectedContact.subject}</p>
                                    </div>

                                    <div className="border-t border-sky-200"></div>

                                    <div>
                                        <h3 className="text-sm font-medium text-sky-700">Message:</h3>
                                        <p className="mt-1 text-sm text-sky-900 whitespace-pre-wrap">
                                            {selectedContact.message}
                                        </p>
                                    </div>

                                    <div className="border-t border-sky-200"></div>

                                    <form onSubmit={handleSendEmail} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-sky-700 mb-1">
                                                Response Subject
                                            </label>
                                            <input
                                                name="subject"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-sky-700 mb-1">
                                                Response Message
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                rows="5"
                                                className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-sm"
                                                required
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-2 md:space-x-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="px-3 py-1.5 md:px-4 md:py-2 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg text-sm md:text-base"
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-1.5 md:px-6 md:py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors text-sm md:text-base"
                                            >
                                                Send Response
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminContacts;