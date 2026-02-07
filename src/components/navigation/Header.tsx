import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Settings, User, LogOut, Menu } from 'lucide-react';

interface HeaderProps {
    onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    // Map routes to titles
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/category')) return 'Category Management';
        if (path.includes('/sub-category')) return 'Sub Category Management';
        if (path.includes('/experience')) return 'Experience Management';
        if (path.includes('/vendor')) return 'Vendor Management';
        if (path.includes('/dashboard')) return 'Dashboard';
        return 'Admin Workspace';
    };

    const handleLogout = () => {
        // Add logout logic here
        console.log('Logout clicked');
        setShowDropdown(false);
    };

    return (
        <header className='h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10'>
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden"
                >
                    <Menu size={24} />
                </button>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[200px] md:max-w-none'>{getPageTitle()}</h2>
            </div>
            <div className='flex items-center gap-2 md:gap-4'>
                <Link
                    to='/admin/settings'
                    className='hidden md:block p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors'
                    title='Settings'
                >
                    <Settings size={20} />
                </Link>
                <button className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors'>
                    <span className='sr-only'>Notifications</span>
                    <Bell size={20} />
                </button>

                {/* User Avatar with Dropdown */}
                <div className='relative' ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className='h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold hover:bg-blue-600 transition-colors'
                    >
                        A
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50'>
                            <Link
                                to='/admin/profile'
                                className='flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                                onClick={() => setShowDropdown(false)}
                            >
                                <User size={16} />
                                <span>Profile</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className='w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
