import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ClockIcon,
  XMarkIcon,
  ArrowPathIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';

const VersionHistory = ({ isOpen, onClose, versions, onRestore, onDelete, onSaveVersion, currentMarkdown, isDark }) => {
  const [selectedVersionId, setSelectedVersionId] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersionId, setCompareVersionId] = useState(null);

  if (!isOpen) return null;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const getStats = (content) => {
    const chars = content.length;
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const lines = content.split('\n').length;
    return { chars, words, lines };
  };

  const handleSaveVersion = () => {
    if (!versionName.trim()) {
      alert('Lütfen version için bir isim girin');
      return;
    }
    onSaveVersion(versionName);
    setVersionName('');
    setShowSaveDialog(false);
  };

  const handleRestore = (version) => {
    if (window.confirm(`"${version.name}" versiyonuna geri dönmek istediğinize emin misiniz?`)) {
      onRestore(version);
      onClose();
    }
  };

  const handleDelete = (versionId) => {
    if (window.confirm('Bu versiyonu silmek istediğinize emin misiniz?')) {
      onDelete(versionId);
    }
  };

  const selectedVersion = selectedVersionId ? versions.find(v => v.id === selectedVersionId) : null;
  const compareVersion = compareVersionId ? versions.find(v => v.id === compareVersionId) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex sm:items-center sm:justify-center sm:p-4 bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full sm:max-w-5xl h-full sm:h-auto sm:max-h-[90vh] overflow-hidden sm:rounded-2xl shadow-2xl ${
          isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        } flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold truncate">Version History</h2>
              <p className={`text-xs sm:text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {versions.length} version kayıtlı
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Save New Version */}
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            {!showSaveDialog ? (
              <button
                onClick={() => setShowSaveDialog(true)}
                className="w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircleIcon className="w-5 h-5" />
                <span className="text-sm sm:text-base">Mevcut Metni Versiyonla</span>
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  placeholder="Version adı (örn: 'İlk taslak', 'Final sürüm')"
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveVersion()}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveVersion}
                    className="flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => {
                      setShowSaveDialog(false);
                      setVersionName('');
                    }}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-slate-800'
                    }`}
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Version List */}
          {versions.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <ClockIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Henüz hiç version kaydedilmemiş</p>
              <p className="text-sm mt-2">Mevcut metninizi versiyonlamak için yukarıdaki butonu kullanın</p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version) => {
                const stats = getStats(version.content);
                const isSelected = selectedVersionId === version.id;

                return (
                  <div
                    key={version.id}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-blue-500 bg-blue-50'
                        : isDark
                          ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedVersionId(isSelected ? null : version.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm sm:text-base truncate">{version.name}</h3>
                        <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(version.timestamp)}
                        </p>
                        <div className={`flex flex-wrap gap-3 mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span>{stats.chars} karakter</span>
                          <span>•</span>
                          <span>{stats.words} kelime</span>
                          <span>•</span>
                          <span>{stats.lines} satır</span>
                        </div>
                      </div>
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(version);
                          }}
                          className="p-1.5 sm:p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                          title="Bu versiyonu geri yükle"
                        >
                          <ArrowPathIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(version.id);
                          }}
                          className="p-1.5 sm:p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                          title="Bu versiyonu sil"
                        >
                          <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Preview */}
                    {isSelected && (
                      <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div
                          className={`p-3 rounded-lg max-h-48 overflow-y-auto text-xs sm:text-sm ${
                            isDark ? 'bg-gray-900' : 'bg-gray-100'
                          }`}
                        >
                          <pre className="whitespace-pre-wrap font-mono">{version.content}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

VersionHistory.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      timestamp: PropTypes.number.isRequired,
    })
  ).isRequired,
  onRestore: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSaveVersion: PropTypes.func.isRequired,
  currentMarkdown: PropTypes.string.isRequired,
  isDark: PropTypes.bool.isRequired,
};

export default VersionHistory;
