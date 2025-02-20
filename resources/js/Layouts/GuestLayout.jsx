import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900">
            <div className="mb-6 flex items-center space-x-2">
                <Link href="/">
                    <img src="images/logo.png" alt="logo" className="w-20 h-20" />
                    <h2 className="text-2xl font-bold text-blue-600">CuriousTra</h2>
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800">
                {children}
            </div>
        </div>
    );
}
