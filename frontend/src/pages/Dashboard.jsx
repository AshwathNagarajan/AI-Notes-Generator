import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  BotIcon, 
  File, 
  Image as ImageIcon,
  HelpCircle, 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Clock,
  Activity,
  Sparkles,
  ArrowRight,
  Star,
} from 'lucide-react';
import { historyService } from '../services/historyService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enforce login restriction - Cannot access dashboard without authentication
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const features = [
    {
      name: 'Notes Summarizer',
      description: 'Transform long text into concise summaries with AI',
      icon: FileText,
      href: '/notes',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    
    {
      name: 'ChatBot Assistant',
      description: 'Get instant answers and explanations with our AI chatbot',
      icon: BotIcon,
      href: '/voice',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },

    {
      name: 'PDF Processor',
      description: 'Extract and analyze content from PDF documents',
      icon: File,
      href: '/pdf',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-200 dark:border-purple-800',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },

    {
      name: 'Image OCR',
      description: 'Extract text from images and create summaries',
      icon: ImageIcon,
      href: '/image',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    },

    {
      name: 'Quiz Generator',
      description: 'Create interactive quizzes from study materials',
      icon: HelpCircle,
      href: '/quiz',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-200 dark:border-orange-800',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },

    {
      name: 'Mind Map Creator',
      description: 'Visualize concepts with AI-powered mind maps',
      icon: Brain,
      href: '/mindmap',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-200 dark:border-pink-800',
      iconColor: 'text-pink-600 dark:text-pink-400'
    }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await historyService.getSummary(30);
        console.log('Dashboard stats:', data);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setError(error.message);
        setStats({
          total_items: 0,
          processing_stats: {
            success_rate: 0,
            average_processing_time: 0,
            total_processing_time: 0
          },
          feature_breakdown: {}
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Calculate statistics with fallbacks
  const totalActivities = stats?.total_items || 0;
  const successRate = stats?.processing_stats?.success_rate || 0;
  const avgProcessing = stats?.processing_stats?.average_processing_time || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Animated background gradient orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 dark:bg-primary-900 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200 dark:bg-secondary-900 rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Industrial Design */}
        <div className="industrial-header mb-20 relative overflow-hidden p-10 md:p-16 fade-in-up">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'}}></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
              <div className="flex items-start md:items-center space-x-6 flex-1">
                <div className="flex items-center justify-center w-20 h-20 bg-white/15 backdrop-blur-lg rounded-2xl border border-white/30 hover:bg-white/20 transition-all duration-300 group">
                  <Sparkles className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Welcome, {user?.display_name || user?.email || 'User'}
                  </h1>
                  <p className="text-white/70 text-base md:text-lg max-w-2xl">
                    Your AI-powered learning command center is ready to transform your productivity
                  </p>
                </div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="flex flex-col bg-white/10 backdrop-blur-md rounded-2xl px-6 py-5 border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-300 group cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <Activity className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                </div>
                <p className="text-white font-bold text-2xl md:text-3xl leading-none">{loading ? '-' : totalActivities}</p>
                <p className="text-white/60 text-xs font-medium mt-1">Activities</p>
              </div>

              <div className="flex flex-col bg-white/10 backdrop-blur-md rounded-2xl px-6 py-5 border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-300 group cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                </div>
                <p className="text-white font-bold text-2xl md:text-3xl leading-none">{loading ? '-' : `${successRate}%`}</p>
                <p className="text-white/60 text-xs font-medium mt-1">Success Rate</p>
              </div>

              <div className="flex flex-col bg-white/10 backdrop-blur-md rounded-2xl px-6 py-5 border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-300 group cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <Clock className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                </div>
                <p className="text-white font-bold text-2xl md:text-3xl leading-none">{loading ? '-' : `${avgProcessing.toFixed(1)}s`}</p>
                <p className="text-white/60 text-xs font-medium mt-1">Avg Processing</p>
              </div>

              <div className="flex flex-col bg-white/10 backdrop-blur-md rounded-2xl px-6 py-5 border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-300 group cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <Star className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                </div>
                <p className="text-white font-bold text-2xl md:text-3xl leading-none">∞</p>
                <p className="text-white/60 text-xs font-medium mt-1">Potential</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid Section */}
        <div className="mb-24 fade-in-up">
          <div className="mb-14">
            <div className="inline-flex items-center space-x-2 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
              </span>
              <span className="stat-badge">{features.length} Powerful Tools</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI-Powered Suite
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Unlock your potential with our intelligent features designed for modern learners
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.name}
                  to={feature.href}
                  style={{animationDelay: `${index * 50}ms`}}
                  className="group fade-in-up"
                >
                  <div className="industrial-card p-8 h-full flex flex-col hover-lift hover-glow">
                    <div className="flex items-start justify-between mb-8">
                      <div className="feature-icon">
                        <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400 transition-transform group-hover:scale-125 group-hover:rotate-6" />
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0">
                        <ArrowRight className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {feature.name}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-1">
                      {feature.description}
                    </p>

                    <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold text-sm pt-4 border-t border-gray-200 dark:border-gray-700 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                      <span>Explore Tool</span>
                      <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Stats Cards */}
        {!error && (
          <div className="fade-in-up">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Performance Metrics</h2>
              <p className="text-gray-600 dark:text-gray-400">Track your learning progress in real-time</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Activities Card */}
              <div className="industrial-card p-8 hover-lift fade-in-up">
                <div className="flex items-center justify-between mb-8">
                  <div className="feature-icon bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/50 dark:to-primary-800/30">
                    <Activity className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="inline-flex items-center space-x-1 stat-badge">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                    </span>
                    <span>Active</span>
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="stat-label mb-2">Total Activities</p>
                    <p className="stat-value">
                      {loading ? <span className="text-gray-400">-</span> : totalActivities}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
                    Keep pushing your learning journey forward
                  </p>
                </div>
              </div>

              {/* Success Rate Card */}
              <div className="industrial-card p-8 hover-lift fade-in-up animation-delay-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="feature-icon bg-gradient-to-br from-success-100 to-success-50 dark:from-success-900/50 dark:to-success-800/30">
                    <TrendingUp className="h-7 w-7 text-success-600 dark:text-success-400" />
                  </div>
                  <span className="stat-badge bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300">Performance</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="stat-label mb-2">Success Rate</p>
                    <p className="stat-value">
                      {loading ? <span className="text-gray-400">-</span> : `${successRate}%`}
                    </p>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-success-500 to-success-600 rounded-full transition-all duration-1000"
                      style={{width: `${successRate}%`}}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Processing Time Card */}
              <div className="industrial-card p-8 hover-lift fade-in-up animation-delay-200">
                <div className="flex items-center justify-between mb-8">
                  <div className="feature-icon bg-gradient-to-br from-warning-100 to-warning-50 dark:from-warning-900/50 dark:to-warning-800/30">
                    <Clock className="h-7 w-7 text-warning-600 dark:text-warning-400" />
                  </div>
                  <span className="stat-badge bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300">Speed</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="stat-label mb-2">Avg Processing Time</p>
                    <p className="stat-value">
                      {loading ? <span className="text-gray-400">-</span> : `${avgProcessing.toFixed(1)}s`}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
                    Lightning-fast AI processing
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;