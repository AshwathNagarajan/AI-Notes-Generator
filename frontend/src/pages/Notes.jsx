import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Copy, Download, Sparkles, Target, Clock, Volume2, Pause, Play, X, ArrowDown, CheckCircle, TrendingDown } from 'lucide-react';
import { notesService } from '../services/notesService';
import toast from 'react-hot-toast';

// ...existing code...
const AIReader = ({ text }) => {
  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const speak = () => {
    if (synth.speaking) synth.cancel();
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const pause = () => {
    synth.pause();
    setIsPaused(true);
  };

  const resume = () => {
    synth.resume();
    setIsPaused(false);
  };

  const stop = () => {
    synth.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="mt-3 flex gap-2 flex-wrap">
      <button
        onClick={speak}
        disabled={isSpeaking || !text}
        className="btn-success flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Play audio"
      >
        <Play className="w-4 h-4" />
        Play
      </button>
      <button
        onClick={pause}
        disabled={!isSpeaking || isPaused}
        className="btn-warning flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Pause audio"
      >
        <Pause className="w-4 h-4" />
        Pause
      </button>
      <button
        onClick={resume}
        disabled={!isPaused}
        className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Resume audio"
      >
        <Volume2 className="w-4 h-4" />
        Resume
      </button>
      <button
        onClick={stop}
        disabled={!isSpeaking}
        className="btn-error flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Stop audio"
      >
        <X className="w-4 h-4" />
        Stop
      </button>
    </div>
  );
};
// ...existing code...

const Notes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [maxLength, setMaxLength] = useState(500);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [summarizationType, setSummarizationType] = useState('abstractive');
  const [summaryMode, setSummaryMode] = useState('narrative');

  // Enforce login restriction - Cannot access notes without authentication
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to summarize');
      return;
    }

    if (text.length > 10000) {
      toast.error('Text is too long. Maximum 10,000 characters allowed.');
      return;
    }

    try {
      setLoading(true);
      const response = await notesService.summarize(text, maxLength, summarizationType, summaryMode);
      setResult(response);
      toast.success('Text summarized successfully!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to summarize text');
    } finally {
      setLoading(false);
    }
  };

  const handleExtractKeyPoints = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to extract key points');
      return;
    }

    try {
      setLoading(true);
      const response = await notesService.extractKeyPoints(text);
      setResult({
        summary: 'Key points extracted successfully',
        key_points: response.key_points,
        word_count: text.split(' ').length,
        processing_time: 0
      });
      toast.success('Key points extracted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to extract key points');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadAsText = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded successfully!');
  };

  const clearAll = () => {
    setText('');
    setResult(null);
    setMaxLength(500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-6 py-10">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"></div>
        <div className="absolute -bottom-8 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Header */}
        <div className="fade-in-up mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Smart Notes</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Summarize and extract key insights from your text</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="fade-in-up">
            <div className="industrial-card p-8 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Input Text</h2>
              </div>

              {/* Text Input Area */}
              <div className="mb-6 flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Your Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your text here... (minimum 50 words, maximum 10,000 words)"
                  className="input-field w-full h-48 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {text.split(/\s+/).filter(w => w).length} words
                  </span>
                  <span className={`text-xs font-medium ${text.split(/\s+/).filter(w => w).length >= 50 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {text.split(/\s+/).filter(w => w).length >= 50 ? '✓ Ready' : '○ Need more text'}
                  </span>
                </div>
              </div>

              {/* Settings Grid */}
              <div className="space-y-4 mb-6">
                {/* Summary Length */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-2 text-blue-500" />
                    Summary Length
                  </label>
                  <select
                    value={maxLength}
                    onChange={(e) => setMaxLength(parseInt(e.target.value))}
                    className="input-field w-full text-sm"
                  >
                    <option value={100}>Very Short (100 words)</option>
                    <option value={250}>Short (250 words)</option>
                    <option value={500}>Medium (500 words)</option>
                    <option value={1000}>Long (1000 words)</option>
                  </select>
                </div>

                {/* Summary Type */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Target className="w-4 h-4 inline mr-2 text-emerald-500" />
                    Summary Type
                  </label>
                  <div className="flex gap-3">
                    {['abstractive', 'extractive'].map(type => (
                      <button
                        key={type}
                        onClick={() => setSummarizationType(type)}
                        className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 ${
                          summarizationType === type
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Format Mode */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <TrendingDown className="w-4 h-4 inline mr-2 text-amber-500" />
                    Format
                  </label>
                  <select
                    value={summaryMode}
                    onChange={(e) => setSummaryMode(e.target.value)}
                    className="input-field w-full text-sm"
                  >
                    <option value="narrative">Narrative</option>
                    <option value="beginner">Beginner-Friendly</option>
                    <option value="technical">Technical</option>
                    <option value="bullet">Bullet Points</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-col sm:flex-row">
                <button
                  onClick={handleSummarize}
                  disabled={text.split(/\s+/).filter(w => w).length < 50 || loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Summarize
                </button>
                <button
                  onClick={handleExtractKeyPoints}
                  disabled={text.split(/\s+/).filter(w => w).length < 50 || loading}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Target className="w-4 h-4" />
                  Key Points
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="fade-in-up animation-delay-100">
            {result ? (
              <div className="space-y-6">
                {/* Summary Result */}
                <div className="industrial-card p-8 fade-in-up animation-delay-150">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Summary</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {result.summary}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(result.summary)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    <AIReader text={result.summary} />
                  </div>
                </div>

                {/* Key Points Result */}
                {result.key_points && result.key_points.length > 0 && (
                  <div className="industrial-card p-8 fade-in-up animation-delay-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-blue-500" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Key Points</h3>
                    </div>
                    <ul className="space-y-3">
                      {result.key_points.map((point, index) => (
                        <li key={index} className="flex gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <span className="text-blue-500 font-bold flex-shrink-0">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Original Words Stat */}
                  <div className="industrial-card p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 fade-in-up animation-delay-250">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Original</span>
                      <FileText className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {text.split(/\s+/).filter(w => w).length}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Words</p>
                  </div>

                  {/* Summary Words Stat */}
                  <div className="industrial-card p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 fade-in-up animation-delay-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Summary</span>
                      <ArrowDown className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                      {result.word_count || 0}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Words</p>
                  </div>

                  {/* Compression Ratio */}
                  <div className="industrial-card p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 fade-in-up animation-delay-350">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Ratio</span>
                      <TrendingDown className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                      {result.word_count && text.split(/\s+/).filter(w => w).length > 0 
                        ? Math.round((1 - result.word_count / text.split(/\s+/).filter(w => w).length) * 100)
                        : 0}%
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Reduction</p>
                  </div>

                  {/* Reading Time */}
                  <div className="industrial-card p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 fade-in-up animation-delay-400">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Time</span>
                      <Clock className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {result.processing_time ? result.processing_time.toFixed(1) : '0'}s
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">Processed</p>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => downloadAsText(result.summary)}
                  className="btn-primary w-full flex items-center justify-center gap-2 fade-in-up animation-delay-500"
                >
                  <Download className="w-4 h-4" />
                  Download Summary
                </button>
              </div>
            ) : (
              <div className="industrial-card p-12 flex flex-col items-center justify-center h-full text-center">
                <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Results Yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter text on the left and click "Summarize" to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;