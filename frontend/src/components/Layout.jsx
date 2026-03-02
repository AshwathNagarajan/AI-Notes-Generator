import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  MessageCircle, 
  File, 
  HelpCircle, 
  Brain, 
  Lightbulb, 
  Image as ImageIcon,
  History, 
  User, 
  LogOut,
  Sun,
  Moon,
  ChevronRight,
  Radar,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';
import ChatbotModal from './ChatbotModal';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const { logout, user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Chatbot', href: '/voice', icon: MessageCircle },
    { name: 'Notes', href: '/notes', icon: FileText },
    { name: 'PDF', href: '/pdf', icon: File },
    { name: 'Image', href: '/image', icon: ImageIcon },
    { name: 'Quiz', href: '/quiz', icon: HelpCircle },
    { name: 'Mind Map', href: '/mindmap', icon: Brain },
    { name: 'Knowledge Gap', href: '/knowledge-gap-radar', icon: Radar },
    { name: 'History', href: '/history', icon: History },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const isActiveRoute = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-900 shadow-2xl">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">AI Notes</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 space-y-0.5 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                  }`} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && <ChevronRight className="h-4 w-4 text-white ml-auto" />}
                </a>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 dark:border-gray-800 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="flex h-16 items-center px-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">AI Notes</h1>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-0.5 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                  }`} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && <ChevronRight className="h-4 w-4 text-white ml-auto" />}
                </a>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 dark:border-gray-800 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 shadow-sm lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden transition-colors hover:text-gray-900 dark:hover:text-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">AI Notes Summarizer</h1>
            </div>
            <div className="flex items-center gap-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop header with theme toggle */}
        <div className="sticky top-0 z-40 hidden lg:flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 shadow-sm">
          <div className="flex flex-1 items-center">
            <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">AI Notes Summarizer</h1>
          </div>
          <div className="flex items-center gap-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors">
              {user?.photo_url ? (
                <img 
                  src={user.photo_url} 
                  alt={user.display_name || 'Profile'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>

        {/* Floating Chatbot Button - Hide on Profile */}
        {location.pathname !== '/profile' && (
          <button
            onClick={() => setChatbotOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center animate-pulse"
            title="Open Chatbot"
          >
            <MessageCircle className="w-8 h-8" />
          </button>
        )}
      </div>

      {/* Chatbot Modal */}
      {location.pathname !== '/profile' && (
        <ChatbotModal isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
