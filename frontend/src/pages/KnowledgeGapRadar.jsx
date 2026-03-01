import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, Send, Radar, Lightbulb, CheckCircle, AlertTriangle, Zap, BookOpen, Clock } from 'lucide-react';
import knowledgeGapService from '../services/knowledgeGapService';

const KnowledgeGapRadar = () => {
  const [topic, setTopic] = useState('');
  const [quizMistakes, setQuizMistakes] = useState('');
  const [explanationRequests, setExplanationRequests] = useState('');
  const [cognitiveProfile, setCognitiveProfile] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [hints, setHints] = useState([]);
  const resultsRef = useRef(null);

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDetectGaps = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResult(null);
    setHints([]);

    try {
      const mistakesArray = quizMistakes
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
      
      const requestsArray = explanationRequests
        .split(',')
        .map(item => item.trim())
        .filter(item => item);

      const response = await knowledgeGapService.detectGaps(
        topic,
        mistakesArray,
        requestsArray,
        cognitiveProfile
      );

      if (response.success) {
        setResult(response.data);
        
        // Get hints for the topic
        const hintsResponse = await knowledgeGapService.getHints(topic);
        if (hintsResponse.success) {
          setHints(hintsResponse.data.hints || []);
        }
        
        setTimeout(scrollToResults, 300);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950 p-4 lg:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Premium Header */}
        <div className="fade-in-up mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full p-4 text-white shadow-2xl">
                <Radar className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                Knowledge Gap Radar
              </h1>
              <p className="text-lg text-purple-200/80 mt-2 font-medium">Identify missing prerequisites and learning gaps</p>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="fade-in-up animation-delay-100 mb-10">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden p-8">
              <form onSubmit={handleDetectGaps} className="space-y-6">
                {/* Topic Input */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    Topic You're Studying
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Quantum Physics, Calculus II, Ancient Rome..."
                    maxLength={2000}
                    disabled={isProcessing}
                    className="w-full px-5 py-4 bg-white/10 dark:bg-black/20 border border-white/20 rounded-lg text-white dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 transition-all backdrop-blur-sm"
                  />
                  <p className="text-xs text-gray-400 mt-2">{topic.length}/2000 characters</p>
                </div>

                {/* Quiz Mistakes Input */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    Quiz Mistakes (comma-separated, optional)
                  </label>
                  <textarea
                    value={quizMistakes}
                    onChange={(e) => setQuizMistakes(e.target.value)}
                    placeholder="e.g., confused derivatives with integrals, misunderstood chain rule, made calculation errors..."
                    rows={3}
                    disabled={isProcessing}
                    className="w-full px-5 py-4 bg-white/10 dark:bg-black/20 border border-white/20 rounded-lg text-white dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 transition-all backdrop-blur-sm resize-none"
                  />
                </div>

                {/* Explanation Requests Input */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-orange-400" />
                    What You Asked to Explain (comma-separated, optional)
                  </label>
                  <textarea
                    value={explanationRequests}
                    onChange={(e) => setExplanationRequests(e.target.value)}
                    placeholder="e.g., why is integration important?, what is the difference between velocity and speed?..."
                    rows={3}
                    disabled={isProcessing}
                    className="w-full px-5 py-4 bg-white/10 dark:bg-black/20 border border-white/20 rounded-lg text-white dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 transition-all backdrop-blur-sm resize-none"
                  />
                </div>

                {/* Cognitive Profile Input */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    Your Learning Profile (optional)
                  </label>
                  <select
                    value={cognitiveProfile}
                    onChange={(e) => setCognitiveProfile(e.target.value)}
                    disabled={isProcessing}
                    className="w-full px-5 py-4 bg-white/10 dark:bg-black/20 border border-white/20 rounded-lg text-white dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 transition-all backdrop-blur-sm"
                  >
                    <option value="">Select a profile...</option>
                    <option value="visual learner">Visual Learner</option>
                    <option value="auditory learner">Auditory Learner</option>
                    <option value="kinesthetic learner">Kinesthetic Learner</option>
                    <option value="logical learner">Logical/Analytical Learner</option>
                    <option value="general learner">General Learner</option>
                  </select>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300 font-medium">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing || !topic.trim()}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/50 group"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing Knowledge Gaps...</span>
                    </>
                  ) : (
                    <>
                      <Radar className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      <span>Detect Knowledge Gaps</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div ref={resultsRef} className="fade-in-up animation-delay-100 space-y-6">
            {/* Core Concepts */}
            {result.core_concepts_detected && result.core_concepts_detected.length > 0 && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Core Concepts Detected</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.core_concepts_detected.map((concept, idx) => (
                      <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-white font-medium">{concept}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Missing Prerequisites */}
            {result.missing_prerequisites && result.missing_prerequisites.length > 0 && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-orange-600 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Missing Prerequisites</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {result.missing_prerequisites.map((prereq, idx) => (
                      <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">{prereq.concept}</h3>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            prereq.importance_level >= 4 ? 'bg-red-500/30 text-red-300' :
                            prereq.importance_level >= 3 ? 'bg-orange-500/30 text-orange-300' :
                            'bg-yellow-500/30 text-yellow-300'
                          }`}>
                            Importance: {prereq.importance_level}/5
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{prereq.why_missing}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recommended Micro Lessons */}
            {result.recommended_micro_lessons && result.recommended_micro_lessons.length > 0 && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Recommended Micro Lessons</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {result.recommended_micro_lessons.map((lesson, idx) => (
                      <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-blue-400/50 transition-colors">
                        <h3 className="text-lg font-semibold text-white mb-2">{lesson.title}</h3>
                        <p className="text-gray-300 text-sm mb-3">{lesson.focus}</p>
                        <div className="flex items-center gap-2 text-blue-300 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{lesson.estimated_time_minutes} minutes</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Learning Hints */}
            {hints.length > 0 && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Learning Hints</h2>
                  </div>
                  
                  <ul className="space-y-3">
                    {hints.map((hint, idx) => {
                      // Handle both string hints and object hints with misconception/correction
                      if (typeof hint === 'string') {
                        return (
                          <li key={idx} className="p-3 bg-white/5 border border-white/10 rounded-lg flex gap-3">
                            <span className="text-yellow-400 font-bold text-lg">💡</span>
                            <span className="text-gray-100">{hint}</span>
                          </li>
                        );
                      } else if (hint && typeof hint === 'object' && hint.misconception) {
                        return (
                          <li key={idx} className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-2">
                            <div className="flex gap-3">
                              <span className="text-red-400 font-bold text-lg">❌</span>
                              <div>
                                <p className="text-red-300 text-sm font-semibold">Common Misconception:</p>
                                <p className="text-gray-200 text-sm">{hint.misconception}</p>
                              </div>
                            </div>
                            <div className="flex gap-3 pl-7">
                              <span className="text-green-400 font-bold text-lg">✅</span>
                              <div>
                                <p className="text-green-300 text-sm font-semibold">Correct Understanding:</p>
                                <p className="text-gray-200 text-sm">{hint.correction}</p>
                              </div>
                            </div>
                          </li>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeGapRadar;
