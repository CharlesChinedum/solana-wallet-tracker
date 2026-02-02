'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface WalletInputProps {
    onSearch: (address: string) => void;
    isLoading: boolean;
}

export default function WalletInput({ onSearch, isLoading }: WalletInputProps) {
    const [address, setAddress] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (address.trim()) {
            onSearch(address.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter Solana wallet address..."
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                        disabled={isLoading}
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !address.trim()}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {isLoading ? 'Loading...' : 'Search'}
                </button>
            </div>
        </form>
    );
}