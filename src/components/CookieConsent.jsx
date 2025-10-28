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
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-6 rounded-t-3xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Cookie Preferences</h2>
                <p className="text-white/90 text-sm">We value your privacy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-6 leading-relaxed">
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
            By clicking "Accept All", you consent to our use of cookies. You can customize your preferences below.
          </p>

          {/* Quick Actions */}
          {!showDetails && (
            <div className="space-y-3 mb-6">
              <button
                onClick={handleAcceptAll}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Accept All Cookies
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleRejectAll}
                  className="bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Customize
                </button>
              </div>
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
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Read our{' '}
              <a href="/privacy" className="text-amber-600 hover:text-amber-700 font-semibold underline">
                Privacy Policy
              </a>
              {' '}and{' '}
              <a href="/terms" className="text-amber-600 hover:text-amber-700 font-semibold underline">
                Terms of Service
              </a>
              {' '}for more information.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CookieConsent;
