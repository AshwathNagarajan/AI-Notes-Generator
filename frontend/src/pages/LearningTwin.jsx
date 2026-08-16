import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  BrainCircuit,
  CheckCircle,
  ClipboardList,
  Lightbulb,
  MessageSquare,
  Send,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import learningTwinService from '../services/learningTwinService';

const splitLines = (value) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const LearningTwin = () => {
  const [topic, setTopic] = useState('');
  const [learnerExplanation, setLearnerExplanation] = useState('');
  const [quizMistakes, setQuizMistakes] = useState('');
  const [doubts, setDoubts] = useState('');
  const [learningStyle, setLearningStyle] = useState('general learner');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const resultsRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!topic.trim()) {
      setError('Please enter the topic you want to model.');
      return;
    }

    if (!learnerExplanation.trim()) {
      setError('Write your current explanation first. The twin needs your words as evidence.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResult(null);

    const response = await learningTwinService.buildTwin({
      topic,
      learnerExplanation,
      quizMistakes: splitLines(quizMistakes),
      doubts: splitLines(doubts),
      learningStyle,
    });

    if (response.success) {
      setResult(response.data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 250);
    } else {
      setError(response.error);
    }

    setIsProcessing(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-500 dark:bg-black/20 dark:border-white/10 dark:text-white dark:placeholder-gray-500";
  const cardClass = "rounded-2xl border border-gray-200 bg-white p-6 shadow-lg space-y-5 dark:border-white/10 dark:bg-white/10 dark:backdrop-blur-xl dark:shadow-2xl";
  const stepCardClass = "px-4 py-3 rounded-lg bg-white border border-gray-200 shadow-sm dark:bg-white/5 dark:border-white/10 dark:shadow-none";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 p-4 lg:p-8 dark:from-gray-950 dark:via-slate-900 dark:to-zinc-950">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-sm font-semibold dark:bg-cyan-500/10 dark:border-cyan-400/20 dark:text-cyan-200">
              <Sparkles className="w-4 h-4" />
              MirrorMind v0
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-950 tracking-tight dark:text-white">
                Learning Twin
              </h1>
              <p className="text-gray-600 mt-3 max-w-2xl dark:text-gray-300">
                Build a first-pass model of how you currently understand a topic, then expose likely misconceptions and next correction steps.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className={stepCardClass}>
              <p className="text-lg font-bold text-gray-950 dark:text-white">1</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Explain</p>
            </div>
            <div className={stepCardClass}>
              <p className="text-lg font-bold text-gray-950 dark:text-white">2</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Model</p>
            </div>
            <div className={stepCardClass}>
              <p className="text-lg font-bold text-gray-950 dark:text-white">3</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Correct</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className={cardClass}>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3 dark:text-white">
                <Target className="w-4 h-4 text-cyan-600 dark:text-cyan-300" />
                Topic
              </label>
              <input
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                disabled={isProcessing}
                maxLength={500}
                placeholder="e.g., Binary search, Newton's laws, database normalization"
                className={inputClass}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3 dark:text-white">
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                Explain it in your own words
              </label>
              <textarea
                value={learnerExplanation}
                onChange={(event) => setLearnerExplanation(event.target.value)}
                disabled={isProcessing}
                rows={9}
                maxLength={6000}
                placeholder="Write what you currently think the topic means, how it works, and where you feel unsure."
                className={`${inputClass} resize-none`}
              />
              <p className="text-xs text-gray-500 mt-2">{learnerExplanation.length}/6000 characters</p>
            </div>
          </div>

          <div className={cardClass}>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3 dark:text-white">
                <ClipboardList className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                Mistakes or wrong answers
              </label>
              <textarea
                value={quizMistakes}
                onChange={(event) => setQuizMistakes(event.target.value)}
                disabled={isProcessing}
                rows={4}
                placeholder="One per line"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3 dark:text-white">
                <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                Doubts or questions
              </label>
              <textarea
                value={doubts}
                onChange={(event) => setDoubts(event.target.value)}
                disabled={isProcessing}
                rows={4}
                placeholder="One per line"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3 dark:text-white">
                Preferred learning style
              </label>
              <select
                value={learningStyle}
                onChange={(event) => setLearningStyle(event.target.value)}
                disabled={isProcessing}
                className={inputClass}
              >
                <option value="general learner">General Learner</option>
                <option value="visual learner">Visual Learner</option>
                <option value="step-by-step learner">Step-by-Step Learner</option>
                <option value="example-first learner">Example-First Learner</option>
                <option value="logical learner">Logical Learner</option>
              </select>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3 text-red-700 dark:bg-red-500/10 dark:border-red-400/20 dark:text-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing || !topic.trim() || !learnerExplanation.trim()}
              className="w-full px-5 py-4 rounded-lg bg-gradient-to-r from-gray-950 via-primary-800 to-gray-900 hover:from-gray-900 hover:via-primary-700 hover:to-gray-800 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 dark:from-cyan-500 dark:to-cyan-400 dark:text-slate-950"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin dark:border-slate-950 dark:border-t-transparent" />
                  Building Twin...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Build Learning Twin
                </>
              )}
            </button>
          </div>
        </form>

        {result && (
          <div ref={resultsRef} className="space-y-6">
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6 dark:border-cyan-400/20 dark:bg-cyan-400/10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <p className="text-cyan-700 text-sm font-semibold dark:text-cyan-200">Twin Profile</p>
                  <h2 className="text-3xl font-black text-gray-950 mt-1 dark:text-white">{result.twin_name}</h2>
                  <p className="text-gray-700 mt-2 dark:text-gray-300">{result.current_understanding.summary}</p>
                </div>
                <div className="min-w-40 rounded-xl bg-white border border-cyan-200 p-4 text-center dark:bg-black/20 dark:border-white/10">
                  <p className="text-4xl font-black text-gray-950 dark:text-white">{result.current_understanding.confidence_score}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Confidence</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ResultPanel
                title="Evidence"
                icon={CheckCircle}
                color="text-emerald-300"
                items={result.current_understanding.evidence}
                renderItem={(item) => <p className="text-gray-700 text-sm dark:text-gray-200">{item}</p>}
              />
              <ResultPanel
                title="Misconceptions"
                icon={BrainCircuit}
                color="text-rose-300"
                items={result.likely_misconceptions}
                renderItem={(item) => (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-950 dark:text-white">{item.misconception}</h3>
                    <p className="text-gray-600 text-sm dark:text-gray-400">{item.why_it_matters}</p>
                    <p className="text-emerald-700 text-sm dark:text-emerald-200">{item.correction}</p>
                  </div>
                )}
              />
              <ResultPanel
                title="Failure Points"
                icon={TrendingUp}
                color="text-amber-300"
                items={result.predicted_failure_points}
                renderItem={(item) => (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-950 dark:text-white">{item.scenario}</h3>
                    <p className="text-rose-700 text-sm dark:text-rose-200">{item.twin_response}</p>
                    <p className="text-cyan-700 text-sm dark:text-cyan-200">{item.better_response}</p>
                  </div>
                )}
              />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-white/10 dark:shadow-none">
              <h2 className="text-2xl font-bold text-gray-950 mb-5 dark:text-white">Correction Path</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.personalized_correction_path.map((step, index) => (
                  <div key={index} className="rounded-xl bg-gray-50 border border-gray-200 p-4 dark:bg-black/20 dark:border-white/10">
                    <p className="text-cyan-700 text-sm font-bold dark:text-cyan-300">Step {index + 1}</p>
                    <h3 className="text-gray-950 font-semibold mt-2 dark:text-white">{step.step}</h3>
                    <p className="text-gray-600 text-sm mt-2 dark:text-gray-400">{step.purpose}</p>
                    <p className="text-gray-700 text-sm mt-4 border-t border-gray-200 pt-4 dark:text-gray-200 dark:border-white/10">{step.practice_prompt}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 dark:border-purple-400/20 dark:bg-purple-400/10">
              <p className="text-purple-700 text-sm font-semibold mb-2 dark:text-purple-200">Teach-Back Prompt</p>
              <p className="text-gray-950 text-lg dark:text-white">{result.teach_back_prompt}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ResultPanel = ({ title, icon: Icon, color, items, renderItem }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-white/10 dark:shadow-none">
    <div className="flex items-center gap-3 mb-4">
      <Icon className={`w-5 h-5 ${color}`} />
      <h2 className="text-xl font-bold text-gray-950 dark:text-white">{title}</h2>
    </div>
    <div className="space-y-3">
      {(items || []).map((item, index) => (
        <div key={index} className="rounded-lg bg-gray-50 border border-gray-200 p-4 dark:bg-black/20 dark:border-white/10">
          {renderItem(item)}
        </div>
      ))}
    </div>
  </div>
);

export default LearningTwin;
