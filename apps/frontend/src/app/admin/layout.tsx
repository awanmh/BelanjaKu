'use client';

import RoleGuard from "@/components/auth/RoleGuard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={['admin']}>
            <div className="flex min-h-screen bg-gray-50">
                <DashboardSidebar role="admin" />
                <main className="flex-1 p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </RoleGuard>
    );
}
