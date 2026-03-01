import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Send, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { voiceService } from '../services/voiceService';

const WaveformBars = ({ analyserNode }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!analyserNode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

    const draw = () => {
      context.fillStyle = 'transparent';
      context.fillRect(0, 0, canvas.width, canvas.height);

      analyserNode.getByteFrequencyData(dataArray);

      const barCount = 24;
      const barWidth = canvas.width / barCount;

      for (let i = 0; i < barCount; i++) {
        const index = Math.floor((i / barCount) * dataArray.length);
        const dataValue = dataArray[index];
        const barHeight = (dataValue / 255) * canvas.height;

        const hue = (i / barCount) * 60 + 200;
        context.fillStyle = `hsl(${hue}, 100%, 50%)`;

        const x = i * barWidth + 2;
        const y = canvas.height - barHeight;

        context.beginPath();
        context.roundRect(x, y, barWidth - 4, barHeight, 2);
        context.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyserNode]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={60}
      className="w-full max-w-xs"
    />
  );
};

const CircularWaveform = ({ analyserNode, isRecording }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isRecording || !analyserNode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      analyserNode.getByteFrequencyData(dataArray);

      const waveCount = 4;
      for (let w = 0; w < waveCount; w++) {
        const radius = 40 + w * 15;
        context.strokeStyle = `rgba(59, 130, 246, ${0.8 - w * 0.15})`;
        context.lineWidth = 2;

        context.beginPath();

        for (let i = 0; i < 360; i += 10) {
          const index = Math.floor((i / 360) * dataArray.length);
          const dataValue = dataArray[index] / 255;
          const waveHeight = dataValue * 20;

          const rad = (i * Math.PI) / 180;
          const x = centerX + (radius + waveHeight) * Math.cos(rad);
          const y = centerY + (radius + waveHeight) * Math.sin(rad);

          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        context.closePath();
        context.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyserNode, isRecording]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className="w-48 h-48 mx-auto"
    />
  );
};

const VoiceRecorder = ({ onTranscriptionComplete, compact = false, autoStart = false }) => {
  const [state, setState] = useState('idle'); // idle, recording, processing, completed
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-start recording when component mounts if autoStart is true
  useEffect(() => {
    if (autoStart && state === 'idle') {
      const timer = setTimeout(() => {
        startRecording();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoStart]);

  // Auto-transcribe when recording is completed
  useEffect(() => {
    if (state === 'completed' && audioBlob && !compact) {
      const timer = setTimeout(() => {
        autoTranscribe();
      }, 500); // Small delay to ensure UI has updated
      return () => clearTimeout(timer);
    }
  }, [state, audioBlob, compact]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Set up Web Audio API
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Set up MediaRecorder
      const options = { mimeType: 'audio/webm' };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        setState('completed');

        // Stop audio context
        stream.getTracks().forEach(track => track.stop());
        if (analyserRef.current) {
          analyserRef.current.disconnect();
          analyserRef.current = null;
        }
      };

      mediaRecorderRef.current.start();
      setState('recording');
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Microphone error:', error);
      toast.error('Unable to access microphone. Please check permissions.');
      setState('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
    }
  };

  const resetRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioBlob(null);
    setAudioURL(null);
    setDuration(0);
    setState('idle');
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      toast.error('Please record audio first');
      return;
    }
    await performTranscription();
  };

  const autoTranscribe = async () => {
    if (audioBlob) {
      await performTranscription();
    }
  };

  const performTranscription = async () => {
    setState('processing');
    try {
      const timestamp = Date.now();
      const audioFile = new File([audioBlob], `recording_${timestamp}.webm`, {
        type: 'audio/webm',
        lastModified: timestamp,
      });

      const result = await voiceService.transcribeAudioFile(audioFile);
      onTranscriptionComplete(result);
      resetRecording();
      toast.success('Audio transcribed successfully');
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error(error.message || 'Error transcribing audio');
      setState('completed');
    }
  };

  return (
    <>
      {compact ? (
        // Compact mode: small button with inline animation
        <div className="relative inline-flex items-center">
          {/* Recording Indicator Animation */}
          {state === 'recording' && (
            <div className="absolute -inset-2 rounded-full opacity-0 animate-ping bg-red-500" style={{ animationDuration: '1.5s' }} />
          )}
          
          {/* Main Button */}
          <button
            onClick={state === 'idle' ? startRecording : state === 'recording' ? stopRecording : state === 'processing' ? null : resetRecording}
            disabled={state === 'processing'}
            className={`relative p-2 rounded-lg transition-all duration-300 ${
              state === 'idle' 
                ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700' 
                : state === 'recording' 
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20 animate-pulse' 
                : state === 'processing' 
                ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-green-500 bg-green-50 dark:bg-green-900/20'
            } ${state === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={state === 'idle' ? 'Start recording' : state === 'recording' ? 'Stop recording' : 'Clear'}
          >
            {state === 'recording' && <Mic className="w-5 h-5 animate-pulse" />}
            {state !== 'recording' && <Mic className="w-5 h-5" />}
            
            {/* Time Duration Badge */}
            {state === 'recording' && (
              <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-mono text-red-500 dark:text-red-400 whitespace-nowrap">
                {formatTime(duration)}
              </span>
            )}
          </button>

          {/* Processing Spinner */}
          {state === 'processing' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        // Original full mode
        <div className="flex flex-col items-center justify-center space-y-6">
      {/* AI Avatar with states */}
      <div className="relative">
        {/* Idle/Recording Avatar */}
        {state === 'idle' && (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300 animate-pulse">
            <Mic className="w-12 h-12 text-white" />
          </div>
        )}

        {state === 'recording' && (
          <div className="relative w-32 h-32">
            {/* Glow animation */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/50 animate-pulse"></div>
            {/* Circular waveform */}
            <div className="absolute inset-0 flex items-center justify-center">
              <CircularWaveform analyserNode={analyserRef.current} isRecording={true} />
            </div>
          </div>
        )}

        {state === 'processing' && (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {state === 'completed' && (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {state === 'idle' && 'Tap to Speak'}
          {state === 'recording' && 'Listening...'}
          {state === 'processing' && 'Transcribing...'}
          {state === 'completed' && 'Recording Complete'}
        </h3>
        {state === 'recording' && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {formatTime(duration)}
          </p>
        )}
      </div>

      {/* Waveform Bars */}
      {state === 'recording' && analyserRef.current && (
        <div className="w-full">
          <WaveformBars analyserNode={analyserRef.current} />
        </div>
      )}

      {/* Audio Playback */}
      {state === 'completed' && audioURL && (
        <audio src={audioURL} controls className="w-64 rounded-lg" />
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {state === 'idle' && (
          <button
            onClick={startRecording}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </button>
        )}

        {state === 'recording' && (
          <button
            onClick={stopRecording}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <Square className="w-5 h-5" />
            Stop
          </button>
        )}

        {state === 'completed' && !audioBlob && (
          <button
            onClick={resetRecording}
            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Clear
          </button>
        )}

        {state === 'completed' && audioBlob && (
          <>
            <button
              onClick={resetRecording}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Clear
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              disabled={state === 'processing'}
            >
              {state === 'processing' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Transcribe
                </>
              )}
            </button>
          </>
        )}
      </div>
        </div>
      )}
    </>
  );
};

export default VoiceRecorder;
