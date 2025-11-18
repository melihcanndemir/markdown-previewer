import { useState, useEffect } from 'react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

function PWAInstallPrompt({ isDark }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Check if user has already dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed === 'true') {
      return;
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    // Save the dismissal to localStorage
    localStorage.setItem('pwa-install-dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  // Mobile: Full screen modal
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* Modal */}
          <div
            className={`w-full max-w-md rounded-2xl shadow-2xl ${
              isDark
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700'
                : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200'
            } p-6 space-y-6 animate-scale-in`}
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-300'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
              }`}
              aria-label="Dismiss"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Icon */}
            <div className="flex justify-center">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                  isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}
              >
                <ArrowDownTrayIcon
                  className={`w-10 h-10 ${
                    isDark ? 'text-purple-400' : 'text-purple-600'
                  }`}
                />
              </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-2">
              <h2
                className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Uygulamayı Yükle
              </h2>
              <p
                className={`text-base ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Markdown Previewer'ı cihazınıza yükleyerek hızlı erişim sağlayın ve çevrimdışı kullanın!
              </p>
            </div>

            {/* Features */}
            <div
              className={`space-y-3 p-4 rounded-xl ${
                isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">⚡</span>
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Hızlı Erişim
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    Ana ekranınızdan tek dokunuşla açın
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">📱</span>
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Uygulama Deneyimi
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    Tam ekran, native uygulama gibi çalışır
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">💾</span>
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Çevrimdışı Kullanım
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    İnternet olmadan da çalışır
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:from-purple-700 active:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Şimdi Yükle
              </button>
              <button
                onClick={handleDismiss}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${
                  isDark
                    ? 'bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-200'
                    : 'bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-700'
                }`}
              >
                Daha Sonra
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop: Bottom-right corner banner
  return (
    <div
      className={`fixed bottom-6 right-6 w-96 rounded-2xl shadow-2xl ${
        isDark
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700'
          : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200'
      } p-5 space-y-4 animate-slide-in z-50`}
    >
      {/* Close button */}
      <button
        onClick={handleDismiss}
        className={`absolute top-3 right-3 p-1.5 rounded-lg transition-colors ${
          isDark
            ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-300'
            : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
        }`}
        aria-label="Dismiss"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 pr-6">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark ? 'bg-purple-900/30' : 'bg-purple-100'
          }`}
        >
          <ArrowDownTrayIcon
            className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
          />
        </div>
        <div className="flex-1">
          <h3
            className={`font-bold text-lg ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Uygulamayı Yükle
          </h3>
          <p
            className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Hızlı erişim için yükleyin
          </p>
        </div>
      </div>

      {/* Features (compact) */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span>⚡</span>
          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            Hızlı erişim ve tam ekran deneyim
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>💾</span>
          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            Çevrimdışı kullanım desteği
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleInstallClick}
          className="flex-1 py-2.5 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:from-purple-700 active:to-pink-700 transition-all shadow-md hover:shadow-lg"
        >
          Yükle
        </button>
        <button
          onClick={handleDismiss}
          className={`px-4 py-2.5 rounded-lg font-semibold transition-colors ${
            isDark
              ? 'bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-200'
              : 'bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-700'
          }`}
        >
          Sonra
        </button>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;
