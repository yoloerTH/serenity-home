import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session ID from URL
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (sessionId) {
      // Fetch order details from your backend
      fetch(`/api/checkout-session/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setOrderDetails(data);
          setLoading(false);
          
          // Clear cart from localStorage
          localStorage.removeItem('cart');
        })
        .catch(err => {
          console.error('Error fetching order details:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Order Confirmed! 🎉</h1>
          <p className="text-xl text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 border border-gray-100">
          <div className="space-y-6">
            {/* Order Number */}
            {orderDetails?.id && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                <p className="text-sm font-semibold text-amber-900 mb-1">Order Number</p>
                <p className="text-lg font-mono text-amber-700">{orderDetails.id}</p>
              </div>
            )}

            {/* Confirmation Email */}
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">Confirmation Email Sent</p>
                <p className="text-sm text-blue-700">
                  We've sent a confirmation email to{' '}
                  <span className="font-semibold">{orderDetails?.customer_email || 'your email'}</span>
                  {' '}with your order details and tracking information.
                </p>
              </div>
            </div>

            {/* What's Next */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">What happens next?</h2>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Order Processing</p>
                    <p className="text-sm text-gray-600">
                      We're preparing your items for shipment
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Shipping Notification</p>
                    <p className="text-sm text-gray-600">
                      You'll receive tracking details within 24-48 hours
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Delivery</p>
                    <p className="text-sm text-gray-600">
                      Your order will arrive in 3-7 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Amount */}
            {orderDetails?.amount_total && (
              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Total Paid</span>
                  <span className="text-2xl font-bold text-gray-900">
                    €{(orderDetails.amount_total / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <Package className="w-8 h-8 text-amber-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Track Your Order</h3>
            <p className="text-sm text-gray-600">
              You can track your order status anytime using the tracking link in your email.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">30-Day Returns</h3>
            <p className="text-sm text-gray-600">
              Not satisfied? Return your items within 30 days for a full refund.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-4 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-full hover:border-amber-600 hover:text-amber-700 transition-all duration-300 font-semibold"
          >
            Print Receipt
          </button>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <button
              onClick={() => navigate('/contact')}
              className="text-amber-600 hover:text-amber-700 font-semibold underline"
            >
              Contact our support team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
