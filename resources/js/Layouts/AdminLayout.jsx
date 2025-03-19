import { Head, Link, router } from '@inertiajs/react';
import '../../css/AdminLayout.css';
import FlashMessage from '@/Components/FlashMessage';

export default function AdminLayout({ children }) {

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <>
            <Head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /></Head>
            <div className="main-body">
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <img src="/images/logo.png" alt="logo" />
                        <h2>CuriousTra</h2>
                    </div>
                    <ul className="sidebar-links">
                    <h4>
                        <span>Main Menu</span>
                        <div className="menu-separator"></div>
                    </h4>
                    <li>
                        <Link href={route('admin.dashboard')}>
                            <span className="material-symbols-outlined"> dashboard </span>Dashboard</Link>
                    </li>
                    <li>
                        <Link href={route('admin.destinations')}>
                            <span className="material-symbols-outlined"> travel_explore </span>Destinations</Link>
                    </li>
                    <li>
                        <Link href={route('admin.packages')}>
                            <span className="material-symbols-outlined"> package </span>Packages</Link>
                    </li>
                    <li>
                        <Link href={route('admin.hotels')}>
                            <span className="material-symbols-outlined"> hotel </span>Hotels</Link>
                    </li>
                    <li>
                        <Link href={route('admin.cabs')}>
                            <span className="material-symbols-outlined"> local_taxi </span>Cabs</Link>
                    </li>
                    <li>
                        <Link href={route('admin.guides')}>
                            <span className="material-symbols-outlined"> person </span>Guides</Link>
                    </li>
                    <li>
                        <Link href={route('admin.gallery')}>
                            <span className="material-symbols-outlined"> folder </span>Gallery</Link>
                    </li>
                    <li>
                        <Link href={route('admin.reviews')}>
                            <span className="material-symbols-outlined"> rate_review </span>Reviews</Link>
                    </li>
                    <li>
                        <Link href={route('admin.contacts')}>
                            <span className="material-symbols-outlined"> person </span>Contacts</Link>
                    </li>
                    <h4>
                        <span>Bookings</span>
                        <div className="menu-separator"></div>
                    </h4>
                    <li>
                        <Link href={route('admin.package-bookings')}><span className="material-symbols-outlined"> folder </span>Package Bookings</Link>
                    </li>
                    <li>
                        <Link href={route('admin.hotel-bookings')}><span className="material-symbols-outlined"> folder </span>Hotel Bookings</Link>
                    </li>
                    <li>
                        <Link href={route('admin.cab-bookings')}><span className="material-symbols-outlined"> folder </span>Cab Bookings</Link>
                    </li>
                    <li>
                        <Link href={route('admin.guide-bookings')}><span className="material-symbols-outlined"> folder </span>Guide Bookings</Link>
                    </li>
                    <h4>
                        <span>Account</span>
                        <div className="menu-separator"></div>
                    </h4>
                    <li>
                        <Link onClick={handleLogout} className="hover:bg-red-400"><span className="material-symbols-outlined text-red-500"> logout </span> <p className="text-red-500 text-lg">Logout</p> </Link>
                    </li>
                </ul>
            </aside>
            <main>{children}</main>
            <FlashMessage />
            </div>
        </>
    );
}
