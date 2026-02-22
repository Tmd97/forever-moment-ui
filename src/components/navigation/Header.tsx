import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Bell, Settings, User, LogOut, Menu, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/auth/store/actions';
import type { RootState } from '@/store/store';
import { cn } from '@/utils/cn';
import { LogoutModal } from '@/features/auth/pages/Login/components/LogoutModal';
import { sidebarItems } from '@/config/menu';

interface HeaderProps {
    onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { data: profileData } = useSelector((state: RootState) => state.profile);

    const [showDropdown, setShowDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
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
    // Map routes to titles using sidebar config
    // Map routes to breadcrumbs using sidebar config
    // Map routes to breadcrumbs using sidebar config
    const getBreadcrumbs = () => {
        const path = location.pathname;
        const breadcrumbs: { label: string; path?: string }[] = [];

        // Helper to check if current path is sub-path of menu item
        const isMatch = (itemPath?: string) => {
            if (!itemPath) return false;
            // Exact match or prefix match (e.g. /admin/users matches /admin/users/create)
            return path === itemPath || (itemPath !== '/admin' && path.startsWith(`${itemPath}/`));
        };

        for (const item of sidebarItems) {
            // Check children first (more specific)
            if (item.children) {
                for (const child of item.children) {
                    if (isMatch(child.path)) {
                        breadcrumbs.push({ label: item.name }); // Parent
                        breadcrumbs.push({ label: child.name, path: child.path });
                        return breadcrumbs;
                    }
                }
            }

            // Check active parent/root item
            if (isMatch(item.path)) {
                breadcrumbs.push({ label: item.name, path: item.path });
                return breadcrumbs;
            }
        }

        // Fallback
        if (path === '/admin') {
            breadcrumbs.push({ label: 'Dashboard', path: '/admin' });
        } else {
            breadcrumbs.push({ label: 'Admin Workspace' });
        }
        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();
    const pageTitle = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : 'Admin Workspace';

    const handleLogout = () => {
        setShowDropdown(false);
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        dispatch(logout());
        navigate('/login');
        setShowLogoutModal(false);
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

                <div className="flex flex-col justify-center">
                    {/* Page Title */}
                    <h1 className="text-lg font-bold text-blue-700 dark:text-blue-400 leading-tight">
                        {pageTitle}
                    </h1>

                    {/* Breadcrumbs */}
                    <nav className="flex items-center text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                        {breadcrumbs.map((crumb, index) => {
                            return (
                                <div key={crumb.label} className="flex items-center">
                                    {index > 0 && <ChevronRight size={10} className="mx-1 text-gray-400" />}
                                    <span className={cn(
                                        'text-gray-500 dark:text-gray-400'
                                    )}>
                                        {crumb.label}
                                    </span>
                                </div>
                            );
                        })}
                    </nav>
                </div>
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
                        className='h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold hover:bg-blue-600 transition-colors uppercase'
                        title={profileData?.fullName || user?.name || 'User'}
                    >
                        {(profileData?.fullName || user?.name || 'A').charAt(0)}
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
            {/* Logout Confirmation Modal */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
            />
        </header >
    );
};

export default Header;
