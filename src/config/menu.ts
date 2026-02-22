import {
    LayoutDashboard,
    Layers,
    Sparkles,
    Calendar,
    Tag,
    Users,
    Briefcase,
    UserCog,
    Store,
    MapPin,
    Clock,
    Settings,
    Gift,
    ShieldAlert
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
        icon: Sparkles,
        children: [
            { name: 'Experience', path: '/admin/experience', icon: Sparkles },
            { name: 'Category', path: '/admin/category', icon: Layers },
            { name: 'Sub Category', path: '/admin/subCategory', icon: Tag },
            { name: 'Inclusions', path: '/admin/inclusions', icon: Gift },
            { name: 'Cancellation Policies', path: '/admin/cancellation-policies', icon: ShieldAlert },
        ]
    },
    {
        name: 'Operations',
        icon: Calendar,
        children: [
            { name: 'Locations', path: '/admin/locations', icon: MapPin },
            { name: 'Time Slots', path: '/admin/slots', icon: Clock },
            { name: 'Vendors', path: '/admin/vendors', icon: Store },
        ]
    },
    {
        name: 'Administration',
        icon: UserCog,
        children: [
            { name: 'Users', path: '/admin/users', icon: Users },
            { name: 'Roles', path: '/admin/roles', icon: Briefcase },
            { name: 'Settings', path: '/admin/settings', icon: Settings },
        ]
    },
];
