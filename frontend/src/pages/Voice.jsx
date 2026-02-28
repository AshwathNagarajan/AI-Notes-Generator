import React, { useState, useRef, useEffect } from 'react';
import { Mic, Upload, FileText, CheckCircle, AlertCircle, Activity, Clock, BarChart3 } from 'lucide-react';
import { voiceService } from '../services/voiceService';
import { notesService } from '../services/notesService';
import VoiceRecorder from '../components/VoiceRecorder';

// Waveform visualization component
const WaveformVisualizer = ({ isActive = true }) => {
  const generateWaveHeights = () => {
    return Array.from({ length: 50 }, () => Math.random() * 100);
  };

  const [heights, setHeights] = useState(generateWaveHeights);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setHeights(generateWaveHeights());
    }, 100);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="w-full h-24 flex items-center justify-center gap-0.5 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent rounded-lg p-4">
      {heights.map((height, index) => (
        <div
          key={index}
          className="flex-1 bg-gradient-to-t from-blue-500 via-blue-400 to-cyan-300 rounded-full shadow-lg"
          style={{
            height: `${Math.max(8, height)}%`,
            opacity: 0.7 + (height / 100) * 0.3,
            transition: 'height 0.1s ease-out',
            filter: 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))',
          }}
        />
      ))}
    </div>
  );
};

const Voice = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [confidence, setConfidence] = useState(null);
  const [duration, setDuration] = useState(null);
  const [word_count, setWordCount] = useState(null);
  const [timestamps, setTimestamps] = useState([]);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [supportedFormats, setSupportedFormats] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    const getFormats = async () => {
      try {
        const { data } = await voiceService.getSupportedFormats();
        setSupportedFormats(data.supported_formats);
      } catch (err) {
        console.error('Failed to get supported formats:', err);
      }
    };
    getFormats();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError('');
    setTranscription('');
    setConfidence(null);
    setDuration(null);
    setWordCount(null);
    setTimestamps([]);
    setSummary('');

    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit. For better performance, please select a smaller file or try a shorter audio clip.');
      }

      const fileType = file.type.toLowerCase();
      if (!fileType.includes('audio/')) {
        throw new Error('Please select a valid audio file.');
      }

      setError('Processing audio file. This may take a few moments for longer files...');
      const result = await voiceService.transcribeAudioFile(file);

      if (result.transcription) {
        setTranscription(result.transcription);
        setConfidence(result.confidence || null);
        setDuration(result.duration || null);
        setWordCount(result.word_count || null);
        setTimestamps(result.timestamps || []);
      } else {
        throw new Error('No transcription received from server');
      }

    } catch (err) {
      const errorMessage = err.message || err.response?.data?.detail || 'Failed to transcribe audio file';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSummarize = async () => {
    if (!transcription) return;
    
    try {
      setIsSummarizing(true);
      setError('');
      setSummary('');
      const result = await notesService.summarize(transcription);
      if (result.summary) {
        setSummary(result.summary);
      } else {
        throw new Error('No summary received');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.detail || 'Failed to generate summary';
      setError(errorMessage);
      console.error('Summary error:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleTranscriptionComplete = (data) => {
    setTranscription(data.transcription);
    setConfidence(data.confidence || null);
    setDuration(data.duration || null);
    setWordCount(data.word_count || null);
    setTimestamps(data.timestamps || []);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Mic className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent mb-2">
            Voice to Text
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Convert voice recordings to text with advanced AI transcription
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 md:p-12 hover:shadow-xl transition-shadow duration-300">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-2xl">
                <Mic className="h-14 w-14 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Voice Transcription</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Upload audio files ({supportedFormats.slice(0, 3).join(', ')}...) or record directly to convert speech to text
            </p>

            <div className="flex flex-col items-center gap-6">
              <input
                type="file"
                ref={fileInputRef}
                accept={supportedFormats.map(format => `.${format}`).join(',')}
                className="hidden"
                onChange={handleFileUpload}
              />
              
              <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />

              <button
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                <Upload className="h-5 w-5" />
                Upload Audio File
              </button>
            </div>

            {/* Processing State with Waveform */}
            {isProcessing && (
              <div className="mt-8 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="flex flex-col items-center gap-6">
                  {/* Animated Waveform */}
                  <WaveformVisualizer isActive={isProcessing} />
                  
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-blue-700 dark:text-blue-300 font-semibold">Processing audio...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {transcription && (
          <div className="space-y-8 animate-fadeIn">
            {/* Transcription Result */}
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Transcribed Text</h3>
              </div>
              
              <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 text-left leading-relaxed">
                <p className="text-gray-700 dark:text-gray-300 text-lg">{transcription}</p>
              </div>

              <button
                onClick={handleSummarize}
                disabled={isSummarizing}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                <FileText className="h-4 w-4" />
                {isSummarizing ? 'Generating Summary...' : 'Generate Summary'}
              </button>
            </div>

            {/* Summary Result */}
            {summary && (
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-shadow duration-300 animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Summary</h3>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 text-left leading-relaxed">
                  <p className="text-gray-700 dark:text-gray-300 text-lg">{summary}</p>
                </div>
              </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Confidence Card */}
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Confidence</h4>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{(confidence * 100).toFixed(1)}%</p>
                </div>
                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(confidence * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Duration Card */}
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Duration</h4>
                </div>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{duration?.toFixed(2)}s</p>
              </div>

              {/* Word Count Card */}
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Word Count</h4>
                </div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{word_count}</p>
              </div>
            </div>

            {/* Timestamps Section */}
            {timestamps && timestamps.length > 0 && (
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Word Timestamps</h3>
                <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700/50 dark:to-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Word</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Start Time</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">End Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto block">
                      {timestamps.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150 table w-full table-fixed">
                          <td className="px-6 py-3 text-sm text-gray-900 dark:text-gray-300">{item.word}</td>
                          <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{item.start_time.toFixed(2)}s</td>
                          <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{item.end_time.toFixed(2)}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Voice;
