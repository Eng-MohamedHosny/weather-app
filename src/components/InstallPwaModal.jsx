import React, { useState, useEffect } from 'react';

export default function InstallPwaModal() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if already installed / running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) return;

    // Check if user previously dismissed prompt in this session
    if (sessionStorage.getItem('pwa_prompt_dismissed') === 'true') return;

    // Check iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|crmo/.test(userAgent);

    if (isIosDevice && isSafari && !isStandalone) {
      setIsIos(true);
      // Show iOS instruction banner after 2.5s
      const timer = setTimeout(() => setShowPrompt(true), 2500);
      return () => clearTimeout(timer);
    }

    // Standard Chromium / Android / Desktop prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt smoothly after 1.5 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 1500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-x-4 bottom-6 z-50 max-w-md mx-auto animate-fade-in">
      <div className="bg-neutral-800 border border-neutral-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl flex items-start gap-4 backdrop-blur-md bg-neutral-800/95">
        {/* App Logo Icon */}
        <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center flex-shrink-0 p-1.5 shadow-md">
          <img src="/favicon.svg" alt="Weather Now" className="w-8 h-8 object-contain" />
        </div>

        {/* Text & Actions */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-neutral-0 text-base">
              Install Weather Now
            </h4>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-neutral-300 hover:text-white p-1 rounded-lg transition-colors text-sm"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <p className="text-neutral-200 text-xs sm:text-sm mt-1 leading-relaxed">
            {isIos
              ? 'Install on your iPhone: tap Share ⎋ and select "Add to Home Screen" ⊞.'
              : 'Add Weather Now to your phone for instant, fullscreen weather forecasts anytime.'}
          </p>

          <div className="flex items-center gap-2.5 mt-3.5">
            {!isIos && deferredPrompt && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="bg-brand-blue hover:bg-brand-blueHover text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-md focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
              >
                Install App
              </button>
            )}
            <button
              type="button"
              onClick={handleDismiss}
              className="bg-neutral-700/60 hover:bg-neutral-700 text-neutral-200 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              {isIos ? 'Got it' : 'Maybe Later'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
