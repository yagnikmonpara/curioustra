import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Footer from '../Components/Footer';
import { Head, Link, usePage } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import FlashMessage from '@/Components/FlashMessage';
import styles from './AuthenticatedLayout.module.css';

const AuthenticatedLayout = ({ children }) => {
    const { user } = usePage().props.auth;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isHeaderActive, setIsHeaderActive] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsHeaderActive(window.scrollY > 50);
        };

        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', checkMobile);
        checkMobile();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const navVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <>
        <Head>
            <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js" defer></script>
            <script noModule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js" defer></script>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-700">
            <motion.nav 
                className={`fixed w-full z-50 transition-all duration-300 ${
                    isHeaderActive 
                    ? 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700'
                    : 'bg-transparent'
                }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <motion.div 
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.1 }}
                        >
                            <Link href="/" className="flex items-center gap-3">
                                <motion.img 
                                    src="images/logo.png" 
                                    alt="logo" 
                                    className={styles.logo}
                                />
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    CuriousTra
                                </span>
                            </Link>
                        </motion.div>

                        <div className="hidden md:flex items-center gap-8">
                            {['home', 'destinations', 'packages', 'cabs', 'guides', 'gallery'].map((routeName) => (
                            // {['home'].map((routeName) => (
                                <motion.div
                                    key={routeName}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <NavLink
                                        href={route(routeName)}
                                        active={route().current(routeName)}
                                        className="relative px-0 py-1 text-gray-600 dark:text-gray-300 font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        {routeName.charAt(0).toUpperCase() + routeName.slice(1)}
                                        {route().current(routeName) && (
                                            <motion.div
                                                className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
                                                layoutId="nav-underline"
                                            />
                                        )}
                                    </NavLink>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            {!isMobile && (
                                <Dropdown>
                                <Dropdown.Trigger>
                                    <motion.button
                                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-full shadow-sm hover:shadow-md transition-shadow"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="text-gray-700 dark:text-gray-200 font-medium">{user.name}</span>
                                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                            {user.name[0]}
                                        </div>
                                    </motion.button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="origin-top-right"
                                    >
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="hover:bg-blue-50 dark:hover:bg-gray-700"
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('bookings')}
                                            className="hover:bg-blue-50 dark:hover:bg-gray-700"
                                        >
                                            <span className="text-blue-600 dark:text-blue-400">📝</span> My Bookings
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </motion.div>
                                </Dropdown.Content>
                            </Dropdown>
                            )}

                            {isMobile && (
                                <motion.button 
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
                                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="Toggle navigation"
                                >
                                <span className={`line ${showingNavigationDropdown ? 'active' : ''}`}></span>
                                <span className={`line ${showingNavigationDropdown ? 'active' : ''}`}></span>
                                <span className={`line ${showingNavigationDropdown ? 'active' : ''}`}></span>
                            </motion.button>
                            )}
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {showingNavigationDropdown && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-4 space-y-1">
                                {['home', 'destinations', 'packages', 'cabs', 'guides', 'gallery'].map((routeName) => (
                                    <motion.div
                                        key={routeName}
                                        variants={navVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <ResponsiveNavLink
                                            href={route(routeName)}
                                            active={route().current(routeName)}
                                            className="block px-0 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700"
                                        >
                                            {routeName.charAt(0).toUpperCase() + routeName.slice(1)}
                                        </ResponsiveNavLink>
                                    </motion.div>
                                ))}
                                
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="px-4 py-3">
                                        <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                            {user.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {user.email}
                                        </div>
                                    </div>
                                    
                                    <ResponsiveNavLink 
                                        href={route('profile.edit')}
                                        className="hover:bg-blue-50 dark:hover:bg-gray-700"
                                    >
                                        Profile
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route('bookings')}
                                        className="hover:bg-blue-50 dark:hover:bg-gray-700"
                                    >
                                        <span className="text-blue-600 dark:text-blue-400">📝</span> My Bookings
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        Log Out
                                    </ResponsiveNavLink>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <main className="pt-24">
                {children}
            </main>
            <Footer />
            <FlashMessage />
        </div>
    </>
    );
};

export default AuthenticatedLayout;