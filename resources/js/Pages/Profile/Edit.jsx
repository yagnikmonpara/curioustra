import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { motion } from 'framer-motion';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="section-subtitle">Manage Your Profile</p>
                        <h2 className="h2 section-title">Profile Settings</h2>
                        <p className="section-text">
                            Update your profile information, change your password, or delete your account.
                        </p>
                    </motion.div>

                    <div className="space-y-8">
                        <motion.div
                            className="bg-white p-6 shadow sm:rounded-lg dark:bg-gray-800"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </motion.div>

                        <motion.div
                            className="bg-white p-6 shadow sm:rounded-lg dark:bg-gray-800"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <UpdatePasswordForm className="max-w-xl" />
                        </motion.div>

                        <motion.div
                            className="bg-white p-6 shadow sm:rounded-lg dark:bg-gray-800"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <DeleteUserForm className="max-w-xl" />
                        </motion.div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}