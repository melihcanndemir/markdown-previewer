import { useState } from 'react';
import PropTypes from 'prop-types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  SparklesIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  LanguageIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  ArrowsPointingOutIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const GeminiAssistant = ({ isOpen, onClose, selectedText, onInsertText, darkMode }) => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // AI Action presets
  const aiActions = [
    {
      id: 'improve',
      label: 'Improve Writing',
      icon: PencilSquareIcon,
      prompt: 'Improve the following text while maintaining its meaning. Make it more clear, concise, and professional. Return ONLY the improved text without any introductory phrases or explanations:\n\n',
      color: 'blue',
    },
    {
      id: 'grammar',
      label: 'Fix Grammar',
      icon: CheckIcon,
      prompt: 'Fix grammar, spelling, and punctuation errors in the following text. Keep the original meaning. Return ONLY the corrected text without any introductory phrases or explanations:\n\n',
      color: 'green',
    },
    {
      id: 'summarize',
      label: 'Summarize',
      icon: DocumentTextIcon,
      prompt: 'Provide a concise summary of the following text. Return ONLY the summary without any introductory phrases like "Here is" or explanations:\n\n',
      color: 'purple',
    },
    {
      id: 'expand',
      label: 'Expand',
      icon: ArrowsPointingOutIcon,
      prompt: 'Expand the following text with more details and explanations. Return ONLY the expanded text without any introductory phrases or explanations:\n\n',
      color: 'orange',
    },
    {
      id: 'translate-tr',
      label: 'Translate to Turkish',
      icon: LanguageIcon,
      prompt: 'Translate the following text to Turkish. Return ONLY the translated text without any introductory phrases or explanations:\n\n',
      color: 'red',
    },
    {
      id: 'translate-en',
      label: 'Translate to English',
      icon: LanguageIcon,
      prompt: 'Translate the following text to English. Return ONLY the translated text without any introductory phrases or explanations:\n\n',
      color: 'indigo',
    },
  ];

  const callGeminiAPI = async (prompt, text) => {
    if (!API_KEY) {
      setError('API key not found. Please add VITE_GEMINI_API_KEY to your .env file.');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const fullPrompt = prompt + text;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const generatedText = response.text();

      setResult(generatedText);
    } catch (err) {
      console.error('Gemini API Error:', err);
      setError(err.message || 'Failed to generate content. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action) => {
    if (!selectedText && !customPrompt) {
      setError('Please select some text in the editor first.');
      return;
    }
    callGeminiAPI(action.prompt, selectedText);
  };

  const handleCustomPrompt = () => {
    if (!customPrompt) {
      setError('Please enter a custom prompt.');
      return;
    }
    if (!selectedText) {
      setError('Please select some text in the editor first.');
      return;
    }
    callGeminiAPI(customPrompt + '\n\n', selectedText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    onInsertText(result);
    onClose();
  };

  const handleReplace = () => {
    onInsertText(result, true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        } flex flex-col`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-purple-500" />
            <div>
              <h2 className="text-2xl font-bold">Gemini AI Assistant</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {selectedText ? `${selectedText.length} characters selected` : 'No text selected'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            aria-label="Close AI Assistant"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI Actions */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {aiActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action)}
                    disabled={loading}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      darkMode
                        ? 'border-gray-700 hover:border-purple-500 hover:bg-gray-700'
                        : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Icon className={`w-5 h-5 text-${action.color}-500`} />
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Custom Prompt
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter your custom instruction..."
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                onKeyPress={(e) => e.key === 'Enter' && handleCustomPrompt()}
              />
              <button
                onClick={handleCustomPrompt}
                disabled={loading || !customPrompt}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  loading || !customPrompt
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-500 hover:bg-purple-600'
                } text-white`}
              >
                {loading ? 'Processing...' : 'Generate'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
              <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center gap-3 p-8">
              <ArrowPathIcon className="w-6 h-6 text-purple-500 animate-spin" />
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Generating with Gemini AI...</p>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Result</h3>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <ClipboardDocumentIcon className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div
                className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                } max-h-64 overflow-y-auto`}
              >
                <pre className="whitespace-pre-wrap font-mono text-sm">{result}</pre>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleInsert}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  Insert Below
                </button>
                <button
                  onClick={handleReplace}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Replace Selection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

GeminiAssistant.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedText: PropTypes.string,
  onInsertText: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default GeminiAssistant;
