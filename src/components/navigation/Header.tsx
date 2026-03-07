import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Bell, Settings, LogOut, Menu, ChevronRight } from 'lucide-react';
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDropdown]);

    const getBreadcrumbs = () => {
        const path = location.pathname;
        const breadcrumbs: { label: string; path?: string }[] = [];
        const isMatch = (itemPath?: string) => {
            if (!itemPath) return false;
            return path === itemPath || (itemPath !== '/admin' && path.startsWith(`${itemPath}/`));
        };
        for (const item of sidebarItems) {
            if (item.children) {
                for (const child of item.children) {
                    if (isMatch(child.path)) {
                        breadcrumbs.push({ label: item.name });
                        breadcrumbs.push({ label: child.name, path: child.path });
                        return breadcrumbs;
                    }
                }
            }
            if (isMatch(item.path)) {
                breadcrumbs.push({ label: item.name, path: item.path });
                return breadcrumbs;
            }
        }
        breadcrumbs.push({ label: 'Dashboard', path: '/admin' });
        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();
    const handleLogout = () => { setShowDropdown(false); setShowLogoutModal(true); };
    const confirmLogout = () => { dispatch(logout()); navigate('/login'); setShowLogoutModal(false); };

    return (
        <header className='h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-7 sticky top-0 z-10 shrink-0'>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1">
                <button onClick={onToggleSidebar} className="p-1.5 -ml-1.5 mr-1 text-gray-400 hover:text-gray-600 md:hidden">
                    <Menu size={20} />
                </button>
                {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.label} className="flex items-center gap-1">
                        {index > 0 && <ChevronRight size={12} className="text-[#9ca3af]" />}
                        <span className={cn(
                            'text-[13px]',
                            index === breadcrumbs.length - 1
                                ? 'font-semibold text-[#0f1117] dark:text-white'
                                : 'text-[#6b7280] dark:text-gray-400'
                        )}>
                            {crumb.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                {/* Bell */}
                <button
                    className="relative flex items-center justify-center w-9 h-9 rounded-[8px] transition-all"
                    style={{ border: '1px solid #e8e6e0', background: 'transparent', color: '#6b7280', cursor: 'pointer' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f4f0'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                    <Bell size={16} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
                </button>

                {/* Settings */}
                <Link
                    to='/admin/settings'
                    className="flex items-center justify-center w-9 h-9 rounded-[8px] transition-all"
                    style={{ border: '1px solid #e8e6e0', background: 'transparent', color: '#6b7280' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f4f0'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                    <Settings size={16} />
                </Link>

                {/* Avatar */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="h-9 w-9 rounded-[8px] flex items-center justify-center text-white text-xs font-bold uppercase"
                        style={{ background: 'linear-gradient(135deg, #6c63ff, #a78bfa)' }}
                    >
                        {(profileData?.fullName || user?.name || 'A').trim().split(/\s+/).map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </button>
                    {showDropdown && (
                        <div className='absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-[#e8e6e0] dark:border-gray-700 py-1.5 z-50'>
                            <button
                                onClick={handleLogout}
                                className='w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-500 hover:bg-[#fef3f2] transition-colors'
                            >
                                <LogOut size={14} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
        </header>
    );
};

export default Header;
