import React, { useState } from 'react';
import { AlertTriangle, ExternalLink, TrendingUp, TrendingDown, Newspaper } from 'lucide-react';
import type { Stock } from '../types';

interface NewsAnalysisProps {
  stocks: Stock[];
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  stockSymbol: string;
}

export const NewsAnalysis: React.FC<NewsAnalysisProps> = ({ stocks }) => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  // Mock news data
  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: 'Apple Unveils Revolutionary AI Features for iPhone',
      summary: 'Apple announces groundbreaking AI capabilities coming to iPhone, potentially transforming user experience and market position.',
      source: 'TechCrunch',
      url: '#',
      date: '2024-03-15T10:30:00Z',
      sentiment: 'positive',
      impact: 'high',
      stockSymbol: 'AAPL'
    },
    {
      id: '2',
      title: 'Microsoft Cloud Revenue Surpasses Expectations',
      summary: 'Microsoft reports exceptional cloud services growth, beating analyst estimates for Q4.',
      source: 'Reuters',
      url: '#',
      date: '2024-03-14T15:45:00Z',
      sentiment: 'positive',
      impact: 'high',
      stockSymbol: 'MSFT'
    },
    {
      id: '3',
      title: 'Meta Faces New Privacy Concerns in EU',
      summary: "European regulators launch investigation into Meta's data handling practices.",
      source: 'Bloomberg',
      url: '#',
      date: '2024-03-13T09:15:00Z',
      sentiment: 'negative',
      impact: 'medium',
      stockSymbol: 'META'
    }
  ];

  const getRelevantNews = () => {
    if (selectedStock) {
      return mockNews.filter(news => news.stockSymbol === selectedStock.symbol);
    }
    return mockNews.slice(0, 6); // Show latest 6 news items when no stock is selected
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
            Add stocks to your dashboard to view news analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          News Analysis
        </h2>
        <select
          value={selectedStock?.symbol || ''}
          onChange={(e) => setSelectedStock(stocks.find(s => s.symbol === e.target.value) || null)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Stocks</option>
          {stocks.map((stock) => (
            <option key={stock.id} value={stock.symbol}>
              {stock.symbol} - {stock.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {getRelevantNews().map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </div>
  );
};

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const getSentimentIcon = () => {
    switch (news.sentiment) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Newspaper className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactBadge = () => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (news.impact) {
      case 'high':
        return `${baseClasses} bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400`;
      default:
        return `${baseClasses} bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400`;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getSentimentIcon()}
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {news.stockSymbol}
            </span>
            <span className={getImpactBadge()}>
              {news.impact.toUpperCase()} IMPACT
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {news.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {news.summary}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{news.source}</span>
              <span>•</span>
              <span>{new Date(news.date).toLocaleDateString()}</span>
            </div>
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Read More
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};