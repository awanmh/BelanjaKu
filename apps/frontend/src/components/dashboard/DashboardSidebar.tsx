'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user.store';
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingBag,
    Settings,
    LogOut,
    Menu,
    X,
    Store
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NavItem {
    label: string;
    href: string;
    icon: any;
}

interface DashboardSidebarProps {
    role: 'admin' | 'seller';
}

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useUserStore();
    const [isOpen, setIsOpen] = useState(false);

    const adminNavItems: NavItem[] = [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Users', href: '/admin/users', icon: Users },
        { label: 'Products', href: '/admin/products', icon: Package },
        { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    const sellerNavItems: NavItem[] = [
        { label: 'Dashboard', href: '/seller/dashboard', icon: LayoutDashboard },
        { label: 'Products', href: '/seller/products', icon: Package },
        { label: 'Orders', href: '/seller/orders', icon: ShoppingBag },
        { label: 'Store', href: '/seller/store', icon: Store },
        { label: 'Settings', href: '/seller/settings', icon: Settings },
    ];

    const navItems = role === 'admin' ? adminNavItems : sellerNavItems;

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    const isActive = (href: string) => {
        if (href === '/admin' || href === '/seller/dashboard') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-40
                    w-64 bg-white border-r border-gray-200
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">
                            {role === 'admin' ? 'Admin Panel' : 'Seller Dashboard'}
                        </h2>
                        {user && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user.fullName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-lg
                                                transition-colors duration-200
                                                ${active
                                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            <Icon size={20} />
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <Button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                        >
                            <LogOut size={18} />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
}
