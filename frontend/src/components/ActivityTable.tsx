'use client';

import { WalletActivity } from '@/types/wallet';
import { formatSolAmount, formatFee, shortenAddress, formatTimestamp } from '@/lib/utils';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface ActivityTableProps {
    activities: WalletActivity[];
}

export default function ActivityTable({ activities }: ActivityTableProps) {
    if (activities.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No activities found for this wallet.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Signature
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Confirmation
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Explorer
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {activities.map((activity) => (
                        <tr key={activity.signature} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                {activity.status === 'success' ? (
                                    <CheckCircle className="text-green-500" size={20} />
                                ) : (
                                    <XCircle className="text-red-500" size={20} />
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-700">
                                {shortenAddress(activity.signature, 8)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`font-semibold ${activity.sol_amount && activity.sol_amount > 0
                                            ? 'text-green-600'
                                            : activity.sol_amount && activity.sol_amount < 0
                                                ? 'text-red-600'
                                                : 'text-gray-600'
                                        }`}
                                >
                                    {formatSolAmount(activity.sol_amount)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {formatFee(activity.fee)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {activity.block_time || formatTimestamp(activity.timestamp)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                    {activity.confirmation_status || 'N/A'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <a
                                    href={`https://explorer.solana.com/tx/${activity.signature}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                                >
                                    <ExternalLink size={16} />
                                    <span className="text-sm">View</span>
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}