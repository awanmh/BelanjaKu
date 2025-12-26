'use client';

import { LucideIcon } from 'lucide-react';
import { formatNumber } from '@/lib/dashboard';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    iconColor?: string;
    iconBgColor?: string;
    trend?: number;
    loading?: boolean;
    format?: 'number' | 'currency' | 'text';
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    iconColor = 'text-blue-600',
    iconBgColor = 'bg-blue-100',
    trend,
    loading = false,
    format = 'number'
}: StatCardProps) {
    const formatValue = (val: number | string): string => {
        if (typeof val === 'string') return val;

        switch (format) {
            case 'currency':
                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(val);
            case 'number':
                return formatNumber(val);
            default:
                return val.toString();
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                        <div className="h-8 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className={`p-3 rounded-lg ${iconBgColor}`}>
                        <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {formatValue(value)}
                    </h3>
                    {trend !== undefined && (
                        <p className={`text-xs mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}% dari bulan lalu
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${iconBgColor}`}>
                    <Icon className={`${iconColor}`} size={24} />
                </div>
            </div>
        </div>
    );
}
