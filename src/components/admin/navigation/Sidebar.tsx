import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ADMIN_CONFIG } from '@/config/constants';
import {
    LayoutDashboard,
    Layers,
    Sparkles,
    Settings,
    ChevronRight,
    ChevronLeft,
    Calendar,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarItem {
    name: string;
    path?: string;
    icon: React.ElementType;
    children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
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
            { name: 'Experience', path: '/admin/experience', icon: Sparkles },
        ]
    },
    {
        name: 'Settings',
        path: '/admin/settings',
        icon: Settings
    },
];

const Sidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['Event Management']);

    const toggleMenu = (name: string) => {
        if (isCollapsed) return;
        setExpandedMenus(prev =>
            prev.includes(name)
                ? prev.filter(item => item !== name)
                : [...prev, name]
        );
    };

    const toggleSidebar = () => {
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
        <aside
            className={cn(
                'bg-[#F4F5F7] dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen flex flex-col transition-all duration-300 relative',
                isCollapsed ? 'w-16' : 'w-64'
            )}
        >
            {/* Header */}
            <div className='h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 shrink-0'>
                <div className={cn('flex items-center gap-2 overflow-hidden', isCollapsed && 'justify-center w-full')}>
                    <div className='h-8 w-8 rounded bg-blue-600 flex items-center justify-center shrink-0'>
                        <span className='text-white font-bold text-lg'>F</span>
                    </div>
                    {!isCollapsed && (
                        <div className='flex flex-col'>
                            <span className='font-bold text-gray-900 dark:text-white text-sm truncate'>{ADMIN_CONFIG.name}</span>
                            <span className='text-[10px] text-gray-500 uppercase tracking-widest'>Management</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className='absolute -right-3 top-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow z-10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Navigation */}
            <nav className='flex-1 p-3 overflow-y-auto no-scrollbar'>
                {!isCollapsed && <div className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 pt-2'>Menu</div>}

                {sidebarItems.map(item => renderItem(item))}
            </nav>

            {/* Footer / User Profile Placeholder */}
            {!isCollapsed && (
                <div className='p-4 border-t border-gray-200 dark:border-gray-800'>
                    <Link
                        to='/'
                        className='block w-full text-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm'
                    >
                        View Website
                    </Link>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
