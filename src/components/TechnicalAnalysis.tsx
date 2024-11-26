import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import { AlertTriangle } from 'lucide-react';
import { StockAnalyzer } from '../services/StockAnalyzer';
import type { Stock } from '../types';

interface TechnicalAnalysisProps {
  stocks: Stock[];
}

const analyzer = new StockAnalyzer();

export const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = ({ stocks }) => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedStock || !chartContainerRef.current) return;

    const loadChartData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const historicalData = await analyzer.getHistoricalData(selectedStock.symbol);
        
        const chart = createChart(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: '#D1D5DB',
          },
          grid: {
            vertLines: { color: '#374151' },
            horzLines: { color: '#374151' },
          },
          crosshair: {
            mode: CrosshairMode.Normal,
          },
          rightPriceScale: {
            borderColor: '#374151',
          },
          timeScale: {
            borderColor: '#374151',
            timeVisible: true,
          },
        });

        const candlestickSeries = chart.addCandlestickSeries({
          upColor: '#10B981',
          downColor: '#EF4444',
          borderUpColor: '#10B981',
          borderDownColor: '#EF4444',
          wickUpColor: '#10B981',
          wickDownColor: '#EF4444',
        });

        candlestickSeries.setData(historicalData);

        // Add volume series
        const volumeSeries = chart.addHistogramSeries({
          color: '#60A5FA',
          priceFormat: {
            type: 'volume',
          },
          priceScaleId: '',
          scaleMargins: {
            top: 0.8,
            bottom: 0,
          },
        });

        volumeSeries.setData(
          historicalData.map(item => ({
            time: item.time,
            value: item.volume,
            color: item.close > item.open ? '#10B981' : '#EF4444',
          }))
        );

        chart.timeScale().fitContent();

        return () => {
          chart.remove();
        };
      } catch (err) {
        setError('Failed to load chart data');
      } finally {
        setIsLoading(false);
      }
    };

    loadChartData();
  }, [selectedStock]);

  if (stocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Stocks Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add stocks to your dashboard to view technical analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Technical Analysis
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TechnicalCard
              title="Price"
              value={`$${selectedStock.price.toFixed(2)}`}
              change={selectedStock.change}
            />
            <TechnicalCard
              title="Technical Score"
              value={`${selectedStock.technicalScore}/10`}
              type="score"
            />
            <TechnicalCard
              title="Signal"
              value={selectedStock.signal.toUpperCase()}
              type="signal"
              signal={selectedStock.signal}
            />
          </div>

          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              {isLoading ? (
                <div className="h-[600px] flex items-center justify-center">
                  <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
                </div>
              ) : (
                <div className="h-[600px]" ref={chartContainerRef} />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <p className="text-blue-600 dark:text-blue-400">
            Select a stock to view technical analysis
          </p>
        </div>
      )}
    </div>
  );
};

interface TechnicalCardProps {
  title: string;
  value: string;
  change?: number;
  type?: 'price' | 'score' | 'signal';
  signal?: 'buy' | 'sell' | 'neutral';
}

const TechnicalCard: React.FC<TechnicalCardProps> = ({ title, value, change, type, signal }) => {
  const getColorClass = () => {
    if (type === 'signal') {
      switch (signal) {
        case 'buy': return 'text-green-600 dark:text-green-400';
        case 'sell': return 'text-red-600 dark:text-red-400';
        default: return 'text-yellow-600 dark:text-yellow-400';
      }
    }
    if (change) {
      return change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    }
    return 'text-gray-900 dark:text-white';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        {title}
      </h3>
      <div className="flex items-end gap-2">
        <div className={`text-2xl font-bold ${getColorClass()}`}>
          {value}
        </div>
        {change && (
          <div className={`text-sm font-medium ${getColorClass()}`}>
            {change >= 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
    </div>
  );
};