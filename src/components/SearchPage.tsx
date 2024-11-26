import React, { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { StockAnalyzer } from '../services/StockAnalyzer';
import { useStocks } from '../hooks/useStocks';
import type { Stock } from '../types';

const analyzer = new StockAnalyzer();

export const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addStock } = useStocks();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const stock = await analyzer.searchStock(searchQuery.toUpperCase());
      
      if (!stock) {
        setError('Stock not found. Please check the symbol and try again.');
        return;
      }

      await addStock.mutateAsync(stock);
      setSearchQuery('');
      
    } catch (err) {
      setError('Failed to analyze stock. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Search Stocks
        </h2>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL, MSFT)..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            disabled={isLoading}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          How to use the stock search:
        </h3>
        <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
          <li>Enter a valid stock symbol (e.g., AAPL for Apple Inc.)</li>
          <li>The system will analyze the stock using real-time market data</li>
          <li>If analysis is successful, the stock will be added to your dashboard</li>
          <li>You can then view detailed technical and sentiment analysis</li>
        </ul>
      </div>
    </div>
  );
};