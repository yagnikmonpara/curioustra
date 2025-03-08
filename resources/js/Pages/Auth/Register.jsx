import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'user',
    });

    const passwordStrengthColors = [
        'bg-red-500',
        'bg-orange-500',
        'bg-yellow-500',
        'bg-green-500',
    ];

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^A-Za-z0-9]/)) strength++;
        return Math.min(strength, 3);
    };

    useEffect(() => {
        setPasswordStrength(calculatePasswordStrength(data.password));
    }, [data.password]);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
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
                                    Create New Account
                                </h1>
                            </div>

                            <form className="space-y-4 md:space-y-6" onSubmit={submit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="bg-gray-50/70 border border-gray-300/50 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700/70 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="John Doe"
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>
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
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="bg-gray-50/70 border border-gray-300/50 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700/70 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="12345 67890"
                                        required
                                    />
                                    <InputError message={errors.phone} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                id="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="••••••••"
                                                className="bg-gray-50/70 border border-gray-300/50 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700/70 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pr-10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>
                                    <div>
                                        <label htmlFor="password_confirmation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="password_confirmation"
                                                id="password_confirmation"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="••••••••"
                                                className="bg-gray-50/70 border border-gray-300/50 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700/70 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pr-10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password_confirmation} className="mt-2" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-full rounded-full ${passwordStrengthColors[passwordStrength]} transition-all duration-300`} />
                                        <span className="text-xs text-gray-600 dark:text-gray-300">
                                            {['Weak', 'Fair', 'Good', 'Strong'][passwordStrength]}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white dark:text-gray-200">
                                        Password must contain at least 8 characters, including uppercase letters, numbers, and special characters.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full text-white bg-primary-600/90 hover:bg-primary-700/90 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600/90 dark:hover:bg-primary-700/90 dark:focus:ring-primary-800 backdrop-blur-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                >
                                    {processing ? 'Creating Account...' : 'Create Account'}
                                </button>

                                <p className="text-sm font-light text-gray-700 dark:text-gray-300 text-center">
                                    Already have an account? {' '}
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