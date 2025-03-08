import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PrimaryButton from '@/Components/PrimaryButton';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Email Verification" />
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
                                    Email Verification
                                </h1>
                            </div>

                            <div className="mb-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                                Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
                            </div>

                            {status === 'verification-link-sent' && (
                                <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400 text-center">
                                    A new verification link has been sent to the email address you provided during registration.
                                </div>
                            )}

                            <form className="space-y-4 md:space-y-6" onSubmit={submit}>
                                <div className="mt-4 flex items-center justify-between">
                                    <PrimaryButton 
                                        className="w-full"
                                        disabled={processing}
                                        onClick={submit}
                                    >
                                        {processing ? 'Sending...' : 'Resend Verification Email'}
                                    </PrimaryButton>
                                </div>

                                <div className="text-center">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="text-sm text-primary-700 hover:text-primary-800 underline dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                                    >
                                        Log Out
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}