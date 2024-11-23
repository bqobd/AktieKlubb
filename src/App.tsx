import React, { useState, useEffect } from 'react';
import { BarChart3, Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { StockList } from './components/StockList';
import { SearchPage } from './components/SearchPage';
import { TechnicalAnalysis } from './components/TechnicalAnalysis';
import { NewsAnalysis } from './components/NewsAnalysis';
import { SentimentAnalysis } from './components/SentimentAnalysis';
import { ClubAnalysis } from './components/ClubAnalysis';
import { LoginModal } from './components/LoginModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import type { Stock } from './types';

const mockStocks: Stock[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 173.45,
    change: 2.3,
    signal: 'buy',
    technicalScore: 8,
    sentimentScore: 7,
    newsScore: 9,
    lastUpdated: new Date().toISOString(),
  },
  // ... other stocks
];

function AppContent() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('Dashboard');
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleAddStock = (stock: Stock) => {
    setStocks(prev => [...prev, stock]);
    setActivePage('Dashboard');
  };

  const buyStocks = stocks.filter(stock => stock.signal === 'buy');
  const neutralStocks = stocks.filter(stock => stock.signal === 'neutral');
  const sellStocks = stocks.filter(stock => stock.signal === 'sell');

  const renderContent = () => {
    if (!user) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Welcome to Stock Analysis Dashboard</h2>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      );
    }

    switch (activePage) {
      case 'Search':
        return <SearchPage onAddStock={handleAddStock} />;
      case 'Technical Analysis':
        return <TechnicalAnalysis stocks={stocks} />;
      case 'News Analysis':
        return <NewsAnalysis stocks={stocks} />;
      case 'Sentiment Analysis':
        return <SentimentAnalysis stocks={stocks} />;
      case 'Club Analysis':
        return <ClubAnalysis />;
      case 'Dashboard':
      default:
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <StockList stocks={buyStocks} title="Recommended Buys" signal="buy" />
            <StockList stocks={neutralStocks} title="Hold/Monitor" signal="neutral" />
            <StockList stocks={sellStocks} title="Recommended Sells" signal="sell" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors flex">
      <Sidebar 
        isDark={isDark} 
        toggleTheme={() => setIsDark(!isDark)} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        activePage={activePage}
        onPageChange={setActivePage}
        user={user}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                Stock Analysis Dashboard
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}