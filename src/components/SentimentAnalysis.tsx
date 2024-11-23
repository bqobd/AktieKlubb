import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Brain, Twitter, MessageCircle, Users, BarChart3, Newspaper } from 'lucide-react';
import type { Stock } from '../types';

interface SentimentAnalysisProps {
  stocks: Stock[];
}

interface SentimentData {
  socialMedia: {
    score: number;
    volume: number;
    trend: 'up' | 'down' | 'neutral';
    sources: {
      twitter: number;
      reddit: number;
      stocktwits: number;
    };
  };
  newsMedia: {
    score: number;
    articles: number;
    trend: 'up' | 'down' | 'neutral';
  };
  analystRatings: {
    buy: number;
    hold: number;
    sell: number;
    averagePrice: number;
    trend: 'up' | 'down' | 'neutral';
  };
  insiderActivity: {
    buys: number;
    sells: number;
    netAmount: number;
    trend: 'up' | 'down' | 'neutral';
  };
}

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ stocks }) => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  // Mock sentiment data
  const mockSentimentData: SentimentData = {
    socialMedia: {
      score: 7.5,
      volume: 15234,
      trend: 'up',
      sources: {
        twitter: 8542,
        reddit: 4521,
        stocktwits: 2171
      }
    },
    newsMedia: {
      score: 6.8,
      articles: 142,
      trend: 'neutral'
    },
    analystRatings: {
      buy: 28,
      hold: 12,
      sell: 4,
      averagePrice: 185.50,
      trend: 'up'
    },
    insiderActivity: {
      buys: 8,
      sells: 3,
      netAmount: 2450000,
      trend: 'up'
    }
  };

  if (stocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Stocks Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add stocks to your dashboard to view sentiment analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sentiment Analysis
        </h2>
        <select
          value={selectedStock?.symbol || ''}
          onChange={(e) => setSelectedStock(stocks.find(s => s.symbol === e.target.value) || null)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a stock</option>
          {stocks.map((stock) => (
            <option key={stock.id} value={stock.symbol}>
              {stock.symbol} - {stock.name}
            </option>
          ))}
        </select>
      </div>

      {selectedStock ? (
        <div className="space-y-6">
          {/* Overall Sentiment Score */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Overall Sentiment Score
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Combined analysis from all sources
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {selectedStock.sentimentScore}/10
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Strong Positive</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Social Media Sentiment */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Social Media Sentiment
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Sentiment Score</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockSentimentData.socialMedia.score}/10
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Twitter</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {mockSentimentData.socialMedia.sources.twitter.toLocaleString()} mentions
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Reddit</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {mockSentimentData.socialMedia.sources.reddit.toLocaleString()} mentions
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">StockTwits</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {mockSentimentData.socialMedia.sources.stocktwits.toLocaleString()} mentions
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* News Sentiment */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  News Sentiment
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Sentiment Score</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockSentimentData.newsMedia.score}/10
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Articles Analyzed</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {mockSentimentData.newsMedia.articles} articles
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Trend</span>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Positive</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analyst Ratings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Analyst Ratings
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Average Target</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${mockSentimentData.analystRatings.averagePrice}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-green-600 font-bold text-lg">
                      {mockSentimentData.analystRatings.buy}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Buy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-600 font-bold text-lg">
                      {mockSentimentData.analystRatings.hold}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Hold</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-600 font-bold text-lg">
                      {mockSentimentData.analystRatings.sell}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Sell</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insider Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Insider Activity
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Net Amount</span>
                  <span className="text-2xl font-bold text-green-600">
                    +${(mockSentimentData.insiderActivity.netAmount / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-green-600 font-bold text-lg">
                      {mockSentimentData.insiderActivity.buys}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Buys</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-600 font-bold text-lg">
                      {mockSentimentData.insiderActivity.sells}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Sells</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <p className="text-blue-600 dark:text-blue-400">
            Select a stock to view sentiment analysis
          </p>
        </div>
      )}
    </div>
  );
};