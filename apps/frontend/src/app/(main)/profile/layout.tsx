'use client';

import RoleGuard from "@/components/auth/RoleGuard";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={['user', 'seller', 'admin']}>
            {children}
        </RoleGuard>
    );
}
