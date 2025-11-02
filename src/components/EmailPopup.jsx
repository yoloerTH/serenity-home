import React, { useState, useEffect } from 'react';
import { X, Mail, Gift } from 'lucide-react';

const EmailPopup = ({ onSubscribe }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check if user has already seen/dismissed the popup
    const hasSeenPopup = localStorage.getItem('serenity-email-popup-seen');
    const hasSubscribed = localStorage.getItem('serenity-email-subscribed');

    if (hasSeenPopup || hasSubscribed) {
      return; // Don't show popup
    }

    // Show popup after 15 seconds OR when user scrolls 30%
    let timeoutId;
    let hasShown = false;

    const showPopup = () => {
      if (!hasShown) {
        hasShown = true;
        setIsVisible(true);
      }
    };

    // Timer: Show after 15 seconds
    timeoutId = setTimeout(() => {
      showPopup();
    }, 15000);

    // Scroll: Show when user scrolls 30% down the page
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= 30) {
        showPopup();
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('serenity-email-popup-seen', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the parent's newsletter subscription handler
      const result = await onSubscribe(email);

      if (result.success) {
        // Store subscription in localStorage to prevent showing popup again
        localStorage.setItem('serenity-email-subscribed', 'true');
        localStorage.setItem('serenity-subscriber-email', email);

        // Show success state
        setIsSubmitted(true);

        // Close popup after 3 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      } else {
        // Handle subscription errors (e.g., duplicate email)
        setErrorMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Popup subscription error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Popup Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative pointer-events-auto transform transition-all animate-popup"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            aria-label="Close popup"
          >
            <X className="w-6 h-6" />
          </button>

          {!isSubmitted ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-full p-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
                Welcome to Serenity Home!
              </h2>

              <p className="text-lg text-gray-600 text-center mb-6">
                Get <span className="text-green-600 font-bold">10% off</span> your first order + exclusive wellness tips
              </p>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:border-green-500 focus:outline-none transition"
                    required
                  />
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm text-center">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-full font-bold hover:from-green-600 hover:to-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Subscribing...' : 'Claim My 10% Discount'}
                </button>
              </form>

              {/* Fine Print */}
              <p className="text-xs text-gray-500 text-center mt-4">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-4">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                You're In! 🎉
              </h3>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-bold text-lg mb-1">
                  Your 10% Discount Code:
                </p>
                <p className="text-2xl font-mono font-bold text-green-600">
                  WELCOME10
                </p>
              </div>

              <p className="text-gray-600 mb-2">
                Use code <strong className="text-green-600">WELCOME10</strong> at checkout
              </p>

              <p className="text-sm text-gray-500">
                Welcome to the Serenity Home family ✨
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes popup {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-popup {
          animation: popup 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default EmailPopup;
