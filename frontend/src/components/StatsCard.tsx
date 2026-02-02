'use client';

import { WalletActivity } from '@/types/wallet';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

interface StatsCardProps {
    activities: WalletActivity[];
}

export default function StatsCard({ activities }: StatsCardProps) {
    const totalReceived = activities
        .filter((a) => a.sol_amount && a.sol_amount > 0)
        .reduce((sum, a) => sum + (a.sol_amount || 0), 0);

    const totalSent = Math.abs(
        activities
            .filter((a) => a.sol_amount && a.sol_amount < 0)
            .reduce((sum, a) => sum + (a.sol_amount || 0), 0)
    );

    const totalFees = activities.reduce((sum, a) => sum + (a.fee || 0), 0) / 1_000_000_000;

    const successCount = activities.filter((a) => a.status === 'success').length;
    const failedCount = activities.filter((a) => a.status === 'failed').length;

    const stats = [
        {
            title: 'Total Received',
            value: `${totalReceived.toFixed(4)} SOL`,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Total Sent',
            value: `${totalSent.toFixed(4)} SOL`,
            icon: TrendingDown,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
        {
            title: 'Total Fees',
            value: `${totalFees.toFixed(6)} SOL`,
            icon: DollarSign,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Transactions',
            value: `${successCount} / ${activities.length}`,
            subtitle: `${failedCount} failed`,
            icon: Activity,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                            {stat.subtitle && (
                                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                            )}
                        </div>
                        <div className={`p-3 rounded-full ${stat.bgColor}`}>
                            <stat.icon className={stat.color} size={24} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}