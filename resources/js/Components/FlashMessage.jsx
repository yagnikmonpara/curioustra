import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';

export default function FlashMessage() {
    const [show, setShow] = useState(false);
    const { flash } = usePage().props;
    const message = flash.success || flash.error;
    const isSuccess = !!flash.success;

    useEffect(() => {
        if (message) {
            setShow(true);
            const timer = setTimeout(() => setShow(false), 3000); // Hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!message) return null;

    return (
        <Transition
            show={show}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className={`fixed bottom-4 right-4 z-50 rounded-md p-4 shadow-lg ${
                isSuccess ? 'bg-green-50' : 'bg-red-50'
            }`}>
                <div className="flex items-center">
                    {isSuccess ? (
                        <svg
                            className="h-5 w-5 text-green-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="h-5 w-5 text-red-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                    <p className={`ml-3 text-sm font-medium ${
                        isSuccess ? 'text-green-800' : 'text-red-800'
                    }`}>
                        {message}
                    </p>
                </div>
            </div>
        </Transition>
    );
} 