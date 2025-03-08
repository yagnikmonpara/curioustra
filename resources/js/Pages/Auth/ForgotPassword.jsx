import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />
            <section className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/auth-bg.jpg')" }}>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-2xl backdrop-blur-lg border border-white/20 dark:border-gray-600 md:mt-0 sm:max-w-md xl:p-0"
                    >
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <div className="flex flex-col items-center">
                                <img className="w-12 h-12 mb-4" src="images/logo.png" alt="logo" />
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Reset Your Password
                                </h1>
                            </div>

                            <div className="mb-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                                Forgot your password? No problem. Just enter your email address and we'll send you a password reset link.
                            </div>

                            {status && (
                                <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400 text-center">
                                    {status}
                                </div>
                            )}

                            <form className="space-y-4 md:space-y-6" onSubmit={submit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="bg-gray-50/70 border border-gray-300/50 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700/70 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="name@domain.com"
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full text-white bg-primary-600/90 hover:bg-primary-700/90 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600/90 dark:hover:bg-primary-700/90 dark:focus:ring-primary-800 backdrop-blur-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                >
                                    {processing ? 'Sending Link...' : 'Send Reset Link'}
                                </button>

                                <p className="text-sm font-light text-gray-700 dark:text-gray-300 text-center">
                                    Remember your password? {' '}
                                    <Link href={route('login')} className="font-medium text-primary-700 hover:underline dark:text-primary-400">
                                        Login here
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}