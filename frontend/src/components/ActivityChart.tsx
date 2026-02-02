'use client';

import { WalletActivity } from '@/types/wallet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatTimestamp } from '@/lib/utils';

interface ActivityChartProps {
    activities: WalletActivity[];
}

export default function ActivityChart({ activities }: ActivityChartProps) {
    // Prepare data for the chart
    const chartData = activities
        .filter((activity) => activity.sol_amount !== null)
        .map((activity) => ({
            time: activity.block_time || formatTimestamp(activity.timestamp),
            amount: activity.sol_amount || 0,
            signature: activity.signature,
        }))
        .reverse(); // Show oldest to newest

    if (chartData.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No transaction data available for chart.
            </div>
        );
    }

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                    />
                    <YAxis
                        label={{ value: 'SOL Amount', angle: -90, position: 'insideLeft' }}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '10px',
                        }}
                        formatter={(value: number) => [`${value.toFixed(4)} SOL`, 'Amount']}
                    />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.amount >= 0 ? '#10b981' : '#ef4444'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}