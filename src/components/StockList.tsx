import React from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { StockListProps } from '../types';

const getSignalColor = (signal: 'buy' | 'sell' | 'neutral') => {
  switch (signal) {
    case 'buy':
      return 'bg-green-100 dark:bg-green-900/30 border-green-500';
    case 'sell':
      return 'bg-red-100 dark:bg-red-900/30 border-red-500';
    default:
      return 'bg-gray-100 dark:bg-gray-800 border-gray-500';
  }
};

const SignalIcon = ({ signal }: { signal: 'buy' | 'sell' | 'neutral' }) => {
  switch (signal) {
    case 'buy':
      return <TrendingUp className="w-5 h-5 text-green-500" />;
    case 'sell':
      return <TrendingDown className="w-5 h-5 text-red-500" />;
    default:
      return <Minus className="w-5 h-5 text-gray-500" />;
  }
};

export const StockList: React.FC<StockListProps> = ({ stocks, title, signal }) => {
  if (stocks.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
        <SignalIcon signal={signal} />
        {title}
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          ({stocks.length})
        </span>
      </h2>
      <div className="space-y-4">
        {stocks.map((stock) => (
          <div
            key={stock.id}
            className={`p-4 rounded-lg border ${getSignalColor(stock.signal)} transition-all hover:scale-[1.02]`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{stock.symbol}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 dark:text-white">${stock.price}</p>
                <p className={`text-sm flex items-center gap-1 ${
                  stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.change >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(stock.change)}%
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <ScoreIndicator label="Technical" score={stock.technicalScore} />
              <ScoreIndicator label="Sentiment" score={stock.sentimentScore} />
              <ScoreIndicator label="News" score={stock.newsScore} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ScoreIndicator: React.FC<{ label: string; score: number }> = ({ label, score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className={`font-bold ${getScoreColor(score)}`}>{score}/10</p>
    </div>
  );
};