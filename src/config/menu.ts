import {
    LayoutDashboard,
    Layers,
    Sparkles,
    Calendar,
    Tag,
    Users,
    Briefcase,
    UserCog,
    Store
} from 'lucide-react';

export interface SidebarItem {
    name: string;
    path?: string;
    icon: React.ElementType;
    children?: SidebarItem[];
}

export const sidebarItems: SidebarItem[] = [
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
            { name: 'Roles', path: '/admin/roles', icon: Layers },
        ]
    },
];
