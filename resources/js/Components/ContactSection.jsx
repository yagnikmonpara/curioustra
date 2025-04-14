import { motion } from 'framer-motion';
import '../../css/welcome.css';
import { useForm } from '@inertiajs/react';
import {
    UserIcon,
    UsersIcon,
    StarIcon,
    TruckIcon,
    MapIcon,
    BellIcon,
    ClockIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    ChatBubbleLeftRightIcon,
    ArrowRightIcon,
    InformationCircleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function ContactSection() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        response: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    response: '',
                    message: ''
                });
            },
            onError: (errors) => {
                console.log(errors);
            }
        });
    };

    return (
        <section className="py-16 bg-white-800" id="contact">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="bg-gray-200 rounded-2xl shadow-xl overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                                {/* Contact Info */}
                                <div className="space-y-8">
                                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                                        <MapPinIcon className="h-6 w-6 text-blue-900 mx-auto mb-4" />
                                        <h4 className="text-xl font-bold mb-2 text-blue-900">Address</h4>
                                        <p className="text-gray-600">123 Travel Street<br />New York, USA</p>
                                    </div>
                                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                                        <PhoneIcon className="h-6 w-6 text-blue-900 mx-auto mb-4" />
                                        <h4 className="text-xl font-bold mb-2 text-blue-900">Phone</h4>
                                        <p className="text-gray-600">+1 234 567 890<br />+1 987 654 321</p>
                                    </div>
                                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                                        <EnvelopeIcon className="h-6 w-6 text-blue-900 mx-auto mb-4" />
                                        <h4 className="text-xl font-bold mb-2 text-blue-900">Email</h4>
                                        <p className="text-gray-600">info@curioustra.com<br />support@curioustra.com</p>
                                    </div>
                                </div>

                                {/* Contact Form */}
                                <div className="md:col-span-2">
                                    <h3 className="text-3xl font-bold mb-6 text-blue-900">Send Us a Message</h3>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-700 mb-2">Name</label>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            {errors.phone && <p className="text-red-500 text-sm mt-1">
                                                {errors.phone.replace('phone', 'Phone number').replace('digits', 'digits long')}
                                            </p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2">Subject</label>
                                            <input
                                                type="text"
                                                value={data.subject}
                                                onChange={(e) => setData('subject', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                                        </div>


                                        <div>
                                            <label className="block text-gray-700 mb-2">Message</label>
                                            <textarea
                                                value={data.message}
                                                onChange={(e) => setData('message', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40"
                                                required
                                            ></textarea>
                                            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="w-full bg-blue-900 text-white py-4 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                'Send Message'
                                            )}
                                        </motion.button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
    );
}
