import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Calendar, DollarSign, Clock, Upload, Users, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StockAnalyzer } from '../services/StockAnalyzer';

interface ClubStock {
  id: string;
  symbol: string;
  name: string;
  analyses: Analysis[];
  watchedSince: string;
  price: number;
  change: number;
  signal: 'buy' | 'sell' | 'neutral';
  technicalScore: number;
  sentimentScore: number;
}

interface Analysis {
  id: string;
  stockId: string;
  type: 'buy' | 'sell';
  text: string;
  images: string[];
  date: string;
  time: string;
  currency: string;
  value: number;
  quantity: number;
  author: string;
  createdAt: string;
}

// Mock club stocks data with analysis metrics
const mockClubStocks: ClubStock[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    watchedSince: '2023-01-15',
    price: 173.45,
    change: 2.3,
    signal: 'buy',
    technicalScore: 8,
    sentimentScore: 7,
    analyses: [
      {
        id: '1',
        stockId: '1',
        type: 'buy',
        text: 'Strong fundamentals and upcoming product launches make this a compelling buy.',
        images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'],
        date: '2024-03-20',
        time: '14:30',
        currency: 'USD',
        value: 180.50,
        quantity: 100,
        author: 'John Doe',
        createdAt: '2024-03-15T10:30:00Z'
      }
    ]
  },
  {
    id: '2',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    watchedSince: '2023-02-01',
    price: 338.11,
    change: -1.2,
    signal: 'neutral',
    technicalScore: 6,
    sentimentScore: 5,
    analyses: []
  }
];

const analyzer = new StockAnalyzer();

export const ClubAnalysis: React.FC = () => {
  const [clubStocks] = useState<ClubStock[]>(mockClubStocks);
  const [selectedStock, setSelectedStock] = useState<ClubStock | null>(null);
  const [showAnalysisForm, setShowAnalysisForm] = useState(false);
  const [newAnalysis, setNewAnalysis] = useState<Partial<Analysis>>({
    type: 'buy',
    text: '',
    images: [],
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    currency: 'USD',
    value: 0,
    quantity: 0
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewAnalysis(prev => ({
            ...prev,
            images: [...(prev.images || []), event.target!.result as string]
          }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmitAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the analysis to your backend
    console.log('Submitting analysis:', newAnalysis);
    setShowAnalysisForm(false);
    setNewAnalysis({
      type: 'buy',
      text: '',
      images: [],
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      currency: 'USD',
      value: 0,
      quantity: 0
    });
  };

  const getAnalysisSummary = (stock: ClubStock) => {
    const buyCount = stock.analyses.filter(a => a.type === 'buy').length;
    const sellCount = stock.analyses.filter(a => a.type === 'sell').length;
    return { buyCount, sellCount };
  };

  const getSignalColor = (signal: 'buy' | 'sell' | 'neutral') => {
    switch (signal) {
      case 'buy':
        return 'text-green-600 dark:text-green-400';
      case 'sell':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-100">Club Analysis</h2>
        <button
          onClick={() => setShowAnalysisForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          New Analysis
        </button>
      </div>

      {/* Stock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubStocks.map(stock => {
          const { buyCount, sellCount } = getAnalysisSummary(stock);
          return (
            <div
              key={stock.id}
              className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedStock(stock)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">{stock.symbol}</h3>
                  <p className="text-sm text-gray-400">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-100">${stock.price.toFixed(2)}</p>
                  <p className={`text-sm flex items-center gap-1 ${
                    stock.change >= 0 ? 'text-green-400' : 'text-red-400'
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

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">System Signal</span>
                  <span className={`font-medium ${getSignalColor(stock.signal)}`}>
                    {stock.signal.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Technical Score</span>
                  <span className="font-medium text-blue-400">{stock.technicalScore}/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Member Signals</span>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">{buyCount} Buy</span>
                    <span className="text-red-400">{sellCount} Sell</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Watched Since</span>
                  <span className="text-gray-300">
                    {new Date(stock.watchedSince).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analysis Form Modal */}
      {showAnalysisForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-100 mb-4">New Analysis</h3>
            <form onSubmit={handleSubmitAnalysis} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Stock
                </label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100"
                  required
                  value={newAnalysis.stockId || ''}
                  onChange={e => setNewAnalysis(prev => ({ ...prev, stockId: e.target.value }))}
                >
                  <option value="">Select a stock</option>
                  {clubStocks.map(stock => (
                    <option key={stock.id} value={stock.id}>
                      {stock.symbol} - {stock.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Analysis Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center text-gray-300">
                    <input
                      type="radio"
                      value="buy"
                      checked={newAnalysis.type === 'buy'}
                      onChange={e => setNewAnalysis(prev => ({ ...prev, type: e.target.value as 'buy' | 'sell' }))}
                      className="mr-2"
                    />
                    Buy
                  </label>
                  <label className="flex items-center text-gray-300">
                    <input
                      type="radio"
                      value="sell"
                      checked={newAnalysis.type === 'sell'}
                      onChange={e => setNewAnalysis(prev => ({ ...prev, type: e.target.value as 'buy' | 'sell' }))}
                      className="mr-2"
                    />
                    Sell
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Analysis Text
                </label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100"
                  rows={4}
                  required
                  value={newAnalysis.text}
                  onChange={e => setNewAnalysis(prev => ({ ...prev, text: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100"
                    required
                    value={newAnalysis.date}
                    onChange={e => setNewAnalysis(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100"
                    required
                    value={newAnalysis.time}
                    onChange={e => setNewAnalysis(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Currency
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100"
                    required
                    value={newAnalysis.currency}
                    onChange={e => setNewAnalysis(prev => ({ ...prev, currency: e.target.value }))}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="SEK">SEK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100"
                    required
                    value={newAnalysis.value}
                    onChange={e => setNewAnalysis(prev => ({ ...prev, value: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100"
                    required
                    value={newAnalysis.quantity}
                    onChange={e => setNewAnalysis(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Images
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-700 text-gray-300 rounded-lg border border-gray-600 cursor-pointer hover:bg-gray-600">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm">Upload Images</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} multiple />
                  </label>
                </div>
                {newAnalysis.images && newAnalysis.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {newAnalysis.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAnalysisForm(false)}
                  className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Analysis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Stock Analysis Modal */}
      {selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-100">
                  {selectedStock.symbol} - {selectedStock.name}
                </h3>
                <p className="text-sm text-gray-400">
                  Watched since {new Date(selectedStock.watchedSince).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedStock(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                ×
              </button>
            </div>

            {selectedStock.analyses.length > 0 ? (
              <div className="space-y-6">
                {selectedStock.analyses.map(analysis => (
                  <div
                    key={analysis.id}
                    className="bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        {analysis.type === 'buy' ? (
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                        <span className={`font-medium ${
                          analysis.type === 'buy' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {analysis.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        by {analysis.author} on {new Date(analysis.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-gray-200 mb-4">{analysis.text}</p>

                    {analysis.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {analysis.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Analysis ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Date:</span>
                        <div className="font-medium text-gray-200">
                          {analysis.date}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Time:</span>
                        <div className="font-medium text-gray-200">
                          {analysis.time}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Value:</span>
                        <div className="font-medium text-gray-200">
                          {analysis.currency} {analysis.value.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Quantity:</span>
                        <div className="font-medium text-gray-200">
                          {analysis.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No analyses yet for this stock
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};