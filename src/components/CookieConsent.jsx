import React, { useState, useEffect } from 'react';
import { Cookie, X, Shield, BarChart, Target, Check } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, can't be disabled
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show modal after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    } else {
      // Load existing preferences
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
      initializeTracking(savedPreferences);
    }
  }, []);

  const initializeTracking = (prefs) => {
    // Initialize Google Analytics if consent given
    if (prefs.analytics && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }

    // Initialize TikTok Pixel if consent given
    if (prefs.marketing && window.ttq) {
      window.ttq.page();
    }

    // Store consent in window for other scripts to check
    window.cookieConsent = prefs;
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true
    };
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false
    };
    saveConsent(onlyEssential);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const saveConsent = (prefs) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setPreferences(prefs);
    initializeTracking(prefs);
    setIsVisible(false);
  };

  const togglePreference = (key) => {
    if (key === 'essential') return; // Can't disable essential cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-md animate-slide-up-gentle">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-amber-200 overflow-hidden"
           style={{
             boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(251, 191, 36, 0.1)'
           }}>
        {/* Header - More Compact */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Cookie className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Cookie Preferences</h2>
              <p className="text-white/90 text-xs">We value your privacy</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          <p className="text-gray-700 text-sm mb-4 leading-relaxed">
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
            By clicking "Accept All", you consent to our use of cookies.
          </p>

          {/* Quick Actions */}
          {!showDetails && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAcceptAll}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Accept All
              </button>

              <button
                onClick={handleRejectAll}
                className="bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all whitespace-nowrap"
              >
                Reject All
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all whitespace-nowrap"
              >
                Customize
              </button>
            </div>
          )}

          {/* Detailed Preferences */}
          {showDetails && (
            <div className="space-y-4 mb-6">
              {/* Essential Cookies */}
              <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-bold text-gray-900">Essential Cookies</h3>
                      <p className="text-sm text-gray-600">Required for basic site functionality</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    Always Active
                  </div>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  These cookies are necessary for the website to function and cannot be disabled.
                  They include session cookies for your cart, authentication, and security.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="border-2 border-gray-200 rounded-xl p-4 hover:border-amber-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <BarChart className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-bold text-gray-900">Analytics Cookies</h3>
                      <p className="text-sm text-gray-600">Help us understand how you use our site</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePreference('analytics')}
                    className={`relative w-14 h-7 rounded-full transition-all ${
                      preferences.analytics ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      preferences.analytics ? 'translate-x-7' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  We use Google Analytics to understand visitor behavior, improve our content, and optimize your experience.
                  No personal data is sold or shared.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="border-2 border-gray-200 rounded-xl p-4 hover:border-amber-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-purple-600" />
                    <div>
                      <h3 className="font-bold text-gray-900">Marketing Cookies</h3>
                      <p className="text-sm text-gray-600">Used to show you relevant ads</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePreference('marketing')}
                    className={`relative w-14 h-7 rounded-full transition-all ${
                      preferences.marketing ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      preferences.marketing ? 'translate-x-7' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  We use TikTok Pixel to measure ad performance and show you relevant products.
                  This helps us run better ads and improve your shopping experience.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={() => setShowDetails(false)}
                  className="bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Footer Links */}
          {!showDetails && (
            <div className="text-center pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                <a href="/privacy" className="text-amber-600 hover:text-amber-700 font-semibold underline">
                  Privacy Policy
                </a>
                {' '} • {' '}
                <a href="/terms" className="text-amber-600 hover:text-amber-700 font-semibold underline">
                  Terms
                </a>
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up-gentle {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up-gentle {
          animation: slide-up-gentle 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default CookieConsent;
