import React, { useState } from 'react';
import { Search, Plus, ArrowUpRight, ArrowDownRight, LineChart, TrendingUp, DollarSign, Percent, Activity, Coins, Users } from 'lucide-react';
import type { Stock, StockAnalysis } from '../types';
import { StockAnalyzer } from '../services/StockAnalyzer';

interface SearchPageProps {
  onAddStock: (stock: Stock) => void;
}

const analyzer = new StockAnalyzer();

export const SearchPage: React.FC<SearchPageProps> = ({ onAddStock }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await analyzer.analyzeStock(searchQuery.toUpperCase());
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze stock. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToDashboard = () => {
    if (!analysis) return;
    
    const stock: Stock = {
      id: Date.now().toString(),
      symbol: searchQuery.toUpperCase(),
      name: searchQuery.toUpperCase(), // We'd get this from the API in production
      price: 150.25, // Mock price
      change: 2.5, // Mock change
      signal: analysis.recommendation === 'STRONG BUY' || analysis.recommendation === 'BUY' 
        ? 'buy' 
        : analysis.recommendation === 'HOLD' 
          ? 'sell' 
          : 'neutral',
      technicalScore: analysis.scores.momentum,
      sentimentScore: analysis.scores.institutionalOwnership,
      newsScore: analysis.scores.growth,
      lastUpdated: new Date().toISOString(),
    };
    
    onAddStock(stock);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Stock Analysis</h2>
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
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Header with Add to Dashboard button */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Analysis Results for {searchQuery.toUpperCase()}
            </h3>
            <button
              onClick={handleAddToDashboard}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <Plus className="w-5 h-5" />
              Add to Dashboard
            </button>
          </div>

          {/* Recommendation Card */}
          <div className={`p-6 rounded-lg shadow-lg border-l-4 ${
            analysis.recommendation === 'STRONG BUY' || analysis.recommendation === 'BUY'
              ? 'bg-green-50 dark:bg-green-900/20 border-l-green-500'
              : analysis.recommendation === 'HOLD'
                ? 'bg-red-50 dark:bg-red-900/20 border-l-red-500'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border-l-yellow-500'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {analysis.recommendation}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{analysis.recommendationText}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analysis.scorePercentage.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Overall Score</div>
              </div>
            </div>
          </div>

          {/* Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnalysisCard
              title="Growth"
              score={analysis.scores.growth}
              details={analysis.details.growth}
              icon={TrendingUp}
            />
            <AnalysisCard
              title="Profitability"
              score={analysis.scores.profitability}
              details={analysis.details.profitability}
              icon={DollarSign}
            />
            <AnalysisCard
              title="Financial Health"
              score={analysis.scores.financialHealth}
              details={analysis.details.financialHealth}
              icon={Activity}
            />
            <AnalysisCard
              title="Valuation"
              score={analysis.scores.valuation}
              details={analysis.details.valuation}
              icon={Percent}
            />
            <AnalysisCard
              title="Momentum"
              score={analysis.scores.momentum}
              details={analysis.details.momentum}
              icon={LineChart}
            />
            <AnalysisCard
              title="Dividend"
              score={analysis.scores.dividend}
              details={analysis.details.dividend}
              icon={Coins}
            />
            <AnalysisCard
              title="Institutional Ownership"
              score={analysis.scores.institutionalOwnership}
              details={analysis.details.institutionalOwnership}
              icon={Users}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface AnalysisCardProps {
  title: string;
  score: number;
  details: string[];
  icon: React.FC<{ className?: string }>;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, score, details, icon: Icon }) => {
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600 dark:text-green-400';
    if (score >= 2) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6 text-gray-400" />
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h4>
      </div>
      <div className="mb-4">
        <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {score}/5
        </div>
      </div>
      <div className="space-y-2">
        {details.map((detail, index) => (
          <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
            {detail}
          </p>
        ))}
      </div>
    </div>
  );
};