'use client';

import RoleGuard from "@/components/auth/RoleGuard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={['seller', 'admin']}>
            <div className="flex min-h-screen bg-gray-50">
                <DashboardSidebar role="seller" />
                <main className="flex-1 p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </RoleGuard>
    );
}
