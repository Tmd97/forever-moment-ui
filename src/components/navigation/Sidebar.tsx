import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/store/actions';
import { ADMIN_CONFIG } from '@/config/constants';
import {
    LayoutDashboard,
    Layers,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Calendar,
    ChevronDown,
    Tag,
    Users,
    LogOut,
    Briefcase,
    UserCog,
    Store
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarItem {
    name: string;
    path?: string;
    icon: React.ElementType;
    children?: SidebarItem[];
}

const sidebarItems = [
    {
        name: 'Dashboard',
        path: '/admin',
        icon: LayoutDashboard
    },
    {
        name: 'Event Management',
        icon: Calendar,
        children: [
            { name: 'Category', path: '/admin/category', icon: Layers },
            { name: 'Sub Category', path: '/admin/subCategory', icon: Tag },
            { name: 'Experience', path: '/admin/experience', icon: Sparkles },
        ]
    },
    {
        name: 'Service Providers',
        icon: Briefcase,
        children: [
            { name: 'Vendors', path: '/admin/vendors', icon: Store },
        ]
    },
    {
        name: 'User Management',
        icon: UserCog,
        children: [
            { name: 'Users', path: '/admin/users', icon: Users },
            { name: 'Roles', path: '/admin/roles', icon: Layers }, // Using Layers for Roles as it represents hierarchy/levels
        ]
    },
];

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['Event Management']);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Handle initial responsive state
    // On mobile: isOpen controls visibility (slide-in)
    // On desktop: isCollapsed controls width (minimized vs full)

    const toggleMenu = (name: string) => {
        if (isCollapsed) return;
        setExpandedMenus(prev =>
            prev.includes(name)
                ? prev.filter(item => item !== name)
                : [...prev, name]
        );
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        if (!isCollapsed) {
            setExpandedMenus([]); // Collapse all when minimizing sidebar
        }
    };

    const renderItem = (item: SidebarItem, depth = 0) => {
        const isActive = item.path ? location.pathname === item.path : false;
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedMenus.includes(item.name);
        const Icon = item.icon;

        if (hasChildren) {
            return (
                <div key={item.name} className='mb-1'>
                    <button
                        onClick={() => toggleMenu(item.name)}
                        className={cn(
                            'w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors duration-200 group text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                            isCollapsed && 'justify-center px-2'
                        )}
                        title={isCollapsed ? item.name : ''}
                    >
                        <div className='flex items-center gap-3'>
                            <Icon size={20} className='shrink-0 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white' />
                            {!isCollapsed && (
                                <span className='text-sm font-medium truncate'>{item.name}</span>
                            )}
                        </div>
                        {!isCollapsed && (
                            <ChevronDown
                                size={16}
                                className={cn('transition-transform duration-200 text-gray-400', isExpanded && 'transform rotate-180')}
                            />
                        )}
                    </button>

                    {/* Submenu */}
                    {isExpanded && !isCollapsed && (
                        <div className='mt-1 space-y-0.5'>
                            {item.children?.map(child => renderItem(child, depth + 1))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Link
                key={item.name}
                to={item.path || '#'}
                onClick={() => {
                    // Close sidebar on mobile when navigating
                    if (window.innerWidth < 768) {
                        onToggle();
                    }
                }}
                className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 group mb-1',
                    isActive
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                    isCollapsed && 'justify-center px-2',
                    depth > 0 && 'pl-9' // Indent submenu items
                )}
                title={isCollapsed ? item.name : ''}
            >
                <Icon size={20} className={cn('shrink-0', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white')} />
                {!isCollapsed && (
                    <span className='text-sm font-medium truncate'>{item.name}</span>
                )}
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 md:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    'bg-[#F4F5F7] dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300',
                    'fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0', // Mobile fixed, Desktop relative
                    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0', // Mobile toggle
                    isCollapsed ? 'md:w-16' : 'md:w-64', // Desktop collapse width
                    'w-64' // Mobile always full width
                )}
            >
                {/* Header */}
                <div className='h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 shrink-0'>
                    <div className={cn('flex items-center gap-2 overflow-hidden', isCollapsed && 'justify-center w-full')}>
                        <div className='h-8 w-8 rounded bg-blue-600 flex items-center justify-center shrink-0'>
                            <span className='text-white font-bold text-lg'>F</span>
                        </div>
                        {(!isCollapsed || isOpen) && (
                            <div className='flex flex-col md:block'>
                                <span className={cn('font-bold text-gray-900 dark:text-white text-sm truncate', isCollapsed && 'md:hidden')}>
                                    {ADMIN_CONFIG.name}
                                </span>
                            </div>
                        )}
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={onToggle} className="ml-auto md:hidden text-gray-500">
                        <ChevronLeft size={20} />
                    </button>
                </div>

                {/* Desktop Toggle Button */}
                <button
                    onClick={toggleCollapse}
                    className='hidden md:flex absolute -right-3 top-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow z-10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Navigation */}
                <nav className='flex-1 p-3 overflow-y-auto no-scrollbar'>
                    {sidebarItems.map(item => renderItem(item))}
                </nav>

                {/* Logout Section */}
                <div className='p-3 border-t border-gray-200 dark:border-gray-800 shrink-0'>
                    <button
                        onClick={handleLogout}
                        className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 group',
                            isCollapsed && 'justify-center px-2'
                        )}
                        title={isCollapsed ? 'Logout' : ''}
                    >
                        <LogOut size={20} className='shrink-0 group-hover:text-red-600 dark:group-hover:text-red-400' />
                        {!isCollapsed && (
                            <div className='flex flex-col items-start overflow-hidden'>
                                <span className='text-sm font-medium'>Logout</span>
                                {/* <span className='text-xs text-gray-400 truncate w-full'>{user?.email}</span> */}
                            </div>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
