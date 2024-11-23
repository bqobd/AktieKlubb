import React from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

export const DashboardStats = () => {
  const stats = [
    {
      title: 'Market Trend',
      value: 'Bullish',
      change: '+2.4%',
      icon: TrendingUp,
      positive: true,
    },
    {
      title: 'Trading Volume',
      value: '127.4M',
      change: '-5.2%',
      icon: Activity,
      positive: false,
    },
    {
      title: 'Total Portfolio',
      value: '$45,678',
      change: '+12.3%',
      icon: DollarSign,
      positive: true,
    },
    {
      title: 'Day Change',
      value: '-$234.5',
      change: '-0.8%',
      icon: TrendingDown,
      positive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </h3>
            </div>
            <div className={`rounded-full p-3 ${
              stat.positive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <stat.icon className={`w-6 h-6 ${
                stat.positive ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
          </div>
          <p className={`mt-2 text-sm flex items-center gap-1 ${
            stat.positive ? 'text-green-600' : 'text-red-600'
          }`}>
            {stat.change}
            <span className="text-gray-600 dark:text-gray-400 ml-1">vs last week</span>
          </p>
        </div>
      ))}
    </div>
  );
};