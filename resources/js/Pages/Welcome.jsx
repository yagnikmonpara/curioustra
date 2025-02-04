// import { Head, Link } from '@inertiajs/react';
// import { route } from 'ziggy-js';

// export default function Welcome({ auth }) {
//     return (
//         <>
//             <Head title="Welcome" />
//             <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
//                 <img
//                     id="background"
//                     className="absolute -left-20 top-0 max-w-[877px]"
//                     src="https://laravel.com/assets/img/welcome/background.svg"
//                 />
//                 <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
//                     <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
//                         <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
//                             <div className="flex lg:col-start-2 lg:justify-center">
//                                 <img
//                                     src="https://laravel.com/assets/img/laravel-logo.svg"
//                                     alt="Application Logo"
//                                     className="h-12"
//                                 />
//                             </div>
//                             <nav className="-mx-3 flex flex-1 justify-end">
//                                 {auth.user ? (
//                                     <Link
//                                         href={route('home')}
//                                         className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
//                                     >
//                                         Explore More 
//                                     </Link>
//                                 ) : (
//                                     <>
//                                         <Link
//                                             href={route('login')}
//                                             className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
//                                         >
//                                             Log in
//                                         </Link>
//                                         <Link
//                                             href={route('register')}
//                                             className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
//                                         >
//                                             Register
//                                         </Link>
//                                     </>
//                                 )}
//                             </nav>
//                         </header>

//                         <main className="mt-6">
//                             <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">

//                             </div>
//                         </main>

//                         <footer className="py-16 text-center text-sm text-black dark:text-white/70">
//                             CuriosiuTra : Where Curiosity Meets Travel
//                         </footer>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

import React from "react";
import "../../css/welcome.css";

const Welcome = () => {
    return (
        <div>
            <header>
                <nav>
                    <a className="nav-items active">Home</a>
                    <a className="nav-items">About</a>
                    <a className="nav-items">Reviews</a>
                    <a className="nav-items">Gallery</a>
                    <a className="nav-items">Contacts</a>
                </nav>
            </header>

            <div className="content">
                <img src="/images/bac-3.png" alt="background" className="back-3" />

                <div className="title">
                    <h1>CuriousTra</h1>
                    <h3>Where Curiosity Meets Travel</h3>
                </div>
                <img src="/images/bac-2.2.png" alt="background" className="back-2" />
                <img src="/images/bac-1.png" alt="background" className="back-1" />

                <div className="info-wrap">
                    <p>
                        Kerala is a tropical paradise in southern India, known for its
                        breathtaking landscapes, rich culture, and serene backwaters. Whether
                        you're seeking adventure, relaxation, or a taste of India's unique
                        traditions, Kerala has something for everyone. From the lush hill
                        stations to pristine beaches, and Ayurvedic retreats to vibrant
                        festivals, this enchanting state offers a perfect blend of natural
                        beauty and cultural experiences.
                    </p>
                </div>

                <div className="cta">
                    <button>
                        Explore More
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
