'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/store/user.store';
import { UserRole } from '@/types/auth';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, token } = useUserStore();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Wait for hydration/check
        if (!isAuthenticated || !token || !user) {
            // Not logged in, redirect to login
            // Optional: save current path to redirect back
            router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
            // Logged in but wrong role
            if (user.role === 'user' && pathname.startsWith('/seller')) {
                router.push('/seller/register'); // Or some onboarding page
            } else {
                router.push('/'); // Fallback
            }
            return;
        }

        setAuthorized(true);
    }, [isAuthenticated, token, user, allowedRoles, router, pathname]);

    if (!authorized) {
        return null; // Or a loading spinner
    }

    return <>{children}</>;
}
