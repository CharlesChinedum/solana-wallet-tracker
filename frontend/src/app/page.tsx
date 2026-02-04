'use client';

import { useState } from 'react';
import WalletInput from '@/components/WalletInput';
import ActivityTable from '@/components/ActivityTable';
import ActivityChart from '@/components/ActivityChart';
import StatsCard from '@/components/StatsCard';
import { walletApi } from '@/lib/api';
import { WalletActivity } from '@/types/wallet';
import { Wallet, AlertCircle } from 'lucide-react';

export default function Home() {
  const [activities, setActivities] = useState<WalletActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);

  const handleSearch = async (address: string) => {
    setIsLoading(true);
    setError(null);
    setActivities([]);
    setCurrentAddress(address);

    try {
      const data = await walletApi.getActivities(address);
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Wallet className="text-purple-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Solana Wallet Tracker</h1>
              <p className="text-sm text-gray-600 mt-1">Track and analyze your Solana wallet activities</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="flex justify-center mb-8">
          <WalletInput onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading wallet activities...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && activities.length > 0 && (
          <div className="space-y-8">
            {/* Current Address Display */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Viewing wallet:</p>
              <p className="font-mono text-sm text-gray-900 mt-1 break-all">{currentAddress}</p>
            </div>

            {/* Statistics */}
            <StatsCard activities={activities} />

            {/* Chart Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction Activity</h2>
              <ActivityChart activities={activities} />
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                <p className="text-sm text-gray-600 mt-1">Latest {activities.length} activities</p>
              </div>
              <ActivityTable activities={activities} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && activities.length === 0 && currentAddress && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
            <Wallet className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Found</h3>
            <p className="text-gray-600">This wallet has no recent transactions.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            Built with Rust & Next.js • Powered by Solana
          </p>
        </div>
      </footer>
    </div>
  );
}