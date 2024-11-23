import React from 'react';
import { User } from 'firebase/auth';
import { LayoutDashboard, LineChart, Newspaper, Brain, Settings, HelpCircle, PieChart, ChevronLeft, ChevronRight, Search, LogOut, UserCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  isDark: boolean;
  toggleTheme: () => void;
  isOpen: boolean;
  onToggle: () => void;
  activePage: string;
  onPageChange: (page: string) => void;
  user: User | null;
  onLogout: () => Promise<void>;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isDark, 
  toggleTheme, 
  isOpen, 
  onToggle,
  activePage,
  onPageChange,
  user,
  onLogout
}) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Search, label: 'Search' },
    { icon: LineChart, label: 'Technical Analysis' },
    { icon: Newspaper, label: 'News Analysis' },
    { icon: Brain, label: 'Sentiment Analysis' },
    { icon: PieChart, label: 'Club Analysis' },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help' },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-8 pt-2">
        {isOpen && (
          <div className="flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-gray-400" />
            <span className="text-gray-200 font-medium">
              {user ? user.email?.split('@')[0] : 'Menu'}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {isOpen && <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => onPageChange(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activePage === item.label
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={!isOpen ? item.label : undefined}
              >
                <item.icon className="w-5 h-5" />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {user && isOpen && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 flex flex-col
        ${isOpen ? 'w-64' : 'w-20'} 
        hidden lg:flex
      `}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transition-all duration-300
        ${isOpen ? 'w-64' : 'w-20'} 
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:hidden
      `}>
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};