import { Head, Link } from '@inertiajs/react';
import '../../css/AdminLayout.css';
import { usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const { user } = usePage().props.auth;

    return (
        <>
            <Head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /></Head>
            <div className="main-body">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src="images/logo.png" alt="logo" />
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
                        <Link href={route('admin.trains')}>
                            <span className="material-symbols-outlined"> train </span>Trains</Link>
                    </li>
                    <li>
                        <Link href={route('admin.flights')}>
                            <span className="material-symbols-outlined"> flight </span>Flights</Link>
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
                        <Link href={route('admin.train-bookings')}><span className="material-symbols-outlined"> folder </span>Train Bookings</Link>
                    </li>
                    <li>
                        <Link href={route('admin.flight-bookings')}><span className="material-symbols-outlined"> folder </span>Flight Bookings</Link>
                    </li>
                    <li>
                        <Link href={route('admin.guide-bookings')}><span className="material-symbols-outlined"> folder </span>Guide Bookings</Link>
                    </li>
                    <h4>
                        <span>Account</span>
                        <div className="menu-separator"></div>
                    </h4>
                    <li>
                        <Link href={route('profile.edit')}><span className="material-symbols-outlined"> account_circle </span>Profile</Link>
                    </li>
                    <li>
                        <Link href={route('logout')} method="POST"><span className="material-symbols-outlined"> logout </span>Logout</Link>
                    </li>
                </ul>
            </aside>
            <main>{children}</main>
            </div>
        </>
    );
}
