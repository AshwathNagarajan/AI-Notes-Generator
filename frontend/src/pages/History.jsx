import React, { useState, useEffect, useCallback } from 'react';
import { History as HistoryIcon, Trash2, Eye, X, RefreshCw } from 'lucide-react';
import { historyService } from '../services/historyService';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

const HistoryPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [days, setDays] = useState(30);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const loadHistory = useCallback(async (feature_type = '') => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading history with filter:', feature_type || 'all');
      const params = {};
      if (feature_type) {
        params.feature_type = feature_type;
      }
      const data = await historyService.getHistory(params);
      console.log('History data received:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      console.log('Data length:', data?.length);
      console.log('First item:', data?.[0]);
      
      if (Array.isArray(data) && data.length > 0) {
        setHistory(data);
        console.log('✅ History set with', data.length, 'items');
      } else {
        console.log('⚠️ No data or empty array');
        setHistory([]);
      }
    } catch (error) {
      console.error('Full error object:', error);
      const errorMsg = error?.response?.data?.detail || error.message || 'Unknown error';
      setError(errorMsg);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSummary = useCallback(async (daysValue = 30) => {
    try {
      console.log('Loading summary for days:', daysValue);
      const data = await historyService.getSummary(daysValue);
      console.log('Summary data received:', data);
      setSummary(data);
    } catch (error) {
      console.error('Error loading summary:', error);
      setSummary(null);
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log('User logged in, loading history. User ID:', user.id || user.firebase_uid);
      loadHistory(filterType);
      loadSummary(days);
    } else {
      console.log('No user logged in');
    }
  }, [filterType, days, user, loadHistory, loadSummary]);

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your history?')) {
      try {
        console.log('Clearing history for feature type:', filterType || 'all');
        await historyService.clearHistory(filterType);
        console.log('History cleared, reloading...');
        await loadHistory(filterType);
        await loadSummary(days);
      } catch (error) {
        console.error('Error clearing history:', error);
        setError('Failed to clear history');
      }
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      console.log('Deleting history item:', id);
      await historyService.deleteHistoryItem(id);
      console.log('Item deleted, reloading...');
      await loadHistory(filterType);
      await loadSummary(days);
    } catch (error) {
      console.error('Error deleting history item:', error);
      setError('Failed to delete history item');
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleRefresh = async () => {
    console.log('Manual refresh triggered');
    await loadHistory(filterType);
    await loadSummary(days);
  };

  const renderHistoryContent = (item) => {
    const { feature_type, input_data, output_data } = item;
    
    switch (feature_type) {
      case 'notes':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Input Text:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {input_data.text ? input_data.text.substring(0, 200) + (input_data.text.length > 200 ? '...' : '') : 'No input text'}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Generated Summary:</h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {output_data.summary || 'No summary generated'}
                </p>
              </div>
            </div>
            {output_data.key_points && output_data.key_points.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Key Points:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {output_data.key_points.map((point, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300 text-sm">{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'eli5':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Topic:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">{input_data.topic}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Simple Explanation:</h4>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {output_data.simple_explanation || 'No explanation generated'}
                </p>
              </div>
            </div>
            {output_data.key_concepts && output_data.key_concepts.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Key Concepts:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {output_data.key_concepts.map((concept, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300 text-sm">{concept}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Input Text:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {input_data.text ? input_data.text.substring(0, 200) + (input_data.text.length > 200 ? '...' : '') : 'No input text'}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Generated Quiz:</h4>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {output_data.total_questions || 0} questions generated
                </p>
              </div>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Audio File:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {input_data.filename || 'Unknown file'} ({input_data.file_size ? Math.round(input_data.file_size / 1024) + 'KB' : 'Unknown size'})
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Transcription:</h4>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {output_data.transcription || 'No transcription available'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">PDF File:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {input_data.filename || 'Unknown file'} ({input_data.total_pages || 0} pages)
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Extracted Text:</h4>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {output_data.word_count || 0} words extracted
                </p>
              </div>
            </div>
          </div>
        );

      case 'mindmap':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Topic:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">{input_data.topic}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Mind Map Structure:</h4>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {output_data.branches_count || 0} branches with {output_data.subtopics_count || 0} subtopics
                </p>
              </div>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Image File:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">{input_data.filename}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Extracted Text:</h4>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {output_data.extracted_text || 'No text extracted'}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Summary:</h4>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">{output_data.summary || 'N/A'}</p>
              </div>
            </div>
          </div>
        );

      case 'research':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Topic Searched:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">{input_data.topic}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Papers Found:</h4>
              <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {output_data.papers_count || 0} papers analyzed
                </p>
              </div>
            </div>
            {output_data.papers && output_data.papers.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Sample Papers:</h4>
                <ul className="space-y-2">
                  {output_data.papers.slice(0, 3).map((paper, index) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <strong>{paper.title}</strong> - {paper.year}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'voice_emotion':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Audio File:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">{input_data.filename}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Primary Emotion:</h4>
              <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold uppercase">
                  {output_data.primary_emotion || 'Unknown'} ({((output_data.confidence || 0) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Audio File:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">{input_data.filename}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Transcription:</h4>
              <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {output_data.transcription || 'No transcription'}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Statistics:</h4>
              <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                <p>Word Count: {output_data.word_count || 0}</p>
                <p>Confidence: {((output_data.confidence || 0) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Input Data:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <pre className="text-gray-700 dark:text-gray-300 text-sm overflow-auto">
                  {JSON.stringify(input_data, null, 2)}
                </pre>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Output Data:</h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <pre className="text-gray-700 dark:text-gray-300 text-sm overflow-auto">
                  {JSON.stringify(output_data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Activity History</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage your AI processing history</p>
        </div>
        <div className="flex items-center space-x-2">
          <HistoryIcon className="h-8 w-8 text-primary-600" />
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <h3 className="text-lg font-semibold mb-2">Total Activities</h3>
            <p className="text-3xl font-bold text-primary-600">{summary.total_items}</p>
          </div>
          <div className="card p-4">
            <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
            <p className="text-3xl font-bold text-primary-600">
              {summary.processing_stats.success_rate}%
            </p>
          </div>
          <div className="card p-4">
            <h3 className="text-lg font-semibold mb-2">Average Time</h3>
            <p className="text-3xl font-bold text-primary-600">
              {summary.processing_stats.average_processing_time.toFixed(2)}s
            </p>
          </div>
        </div>
      )}

      {/* Debug Panel */}
      <div className="card p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 hover:underline"
        >
          {showDebug ? '▼' : '▶'} Debug Info
        </button>
        {showDebug && (
          <div className="mt-4 space-y-2 text-sm text-yellow-700 dark:text-yellow-300 font-mono">
            <p>User: {user ? `✅ ${user.email}` : '❌ Not logged in'}</p>
            <p>Loading: {isLoading ? '⏳ Yes' : '✅ No'}</p>
            <p>Error: {error ? `❌ ${error}` : '✅ None'}</p>
            <p>History Count: <strong>{history.length}</strong> items</p>
            <p>Summary: {summary ? `✅ ${summary.total_items} items` : '❌ No summary'}</p>
            <p>Filter: <strong>{filterType || 'all'}</strong></p>
            <p>Days: <strong>{days}</strong></p>
            {history.length > 0 && (
              <>
                <p className="mt-2 border-t border-yellow-300 pt-2">Sample Item:</p>
                <pre className="bg-gray-900 text-green-400 p-2 rounded overflow-auto text-xs">
                  {JSON.stringify(history[0], null, 2).substring(0, 300)}...
                </pre>
              </>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                className="form-select bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Activities</option>
                <option value="notes">Notes</option>
                <option value="voice">Voice</option>
                <option value="voice_emotion">Voice Emotion</option>
                <option value="pdf">PDF</option>
                <option value="quiz">Quiz</option>
                <option value="mindmap">Mind Map</option>
                <option value="eli5">ELI5</option>
                <option value="image">Image</option>
                <option value="research">Research</option>
              </select>
              <select
                className="form-select bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
            <button
              onClick={handleRefresh}
              className="btn-primary flex items-center mr-2"
              title="Refresh history data"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={handleClearHistory}
              className="btn-error flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </button>
          </div>
        </div>

        <div className="p-4">
          {!user ? (
            <div className="text-center py-12 text-yellow-600">
              <h2 className="text-xl font-semibold mb-2">You are not logged in</h2>
              <p>Please log in to view your history.</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">
              <div className="spinner"></div>
              <p className="mt-2 text-gray-600">Loading history...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <h2 className="text-xl font-semibold mb-2">Error loading history</h2>
              <p>{error}</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <HistoryIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No History Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Start using the app's features (ELI5, PDF, Quiz, etc.) to see your activity history.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history && history.length > 0 ? (
                history.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {item.feature_type && typeof item.feature_type === 'string'
                              ? item.feature_type.charAt(0).toUpperCase() + item.feature_type.slice(1)
                              : 'Unknown'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.created_at
                              ? format(new Date(item.created_at), 'PPpp')
                              : 'Unknown date'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.processing_time ? `${item.processing_time.toFixed(2)}s` : 'N/A'}
                          </span>
                          <button
                            onClick={() => handleViewDetails(item)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Delete item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <p>No items to display</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedItem.feature_type.charAt(0).toUpperCase() + selectedItem.feature_type.slice(1)} Details
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Created: {format(new Date(selectedItem.created_at), 'PPpp')}</span>
                  <span>Processing Time: {selectedItem.processing_time ? `${selectedItem.processing_time.toFixed(2)}s` : 'N/A'}</span>
                  <span>Status: {selectedItem.status}</span>
                </div>
                
                {renderHistoryContent(selectedItem)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;