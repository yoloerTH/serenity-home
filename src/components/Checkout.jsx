import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, CheckCircle, AlertCircle, ShoppingBag, Truck, Mail, User, MapPin } from 'lucide-react';
import { createOrder, updateOrderPaymentStatus } from '../lib/supabase.js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Card Element styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      fontFamily: '"Inter", system-ui, sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
      iconColor: '#f59e0b',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true,
};

// Main Checkout Form Component
const CheckoutForm = ({ 
  cart, 
  cartSubtotal, 
  discountAmount, 
  cartTotal, 
  onSuccess, 
  onCancel 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.zipCode) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

// Updated section of Checkout.jsx - Replace the payment intent creation part

// In the handleSubmit function, replace the payment intent creation with this:

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!stripe || !elements) {
    return;
  }

  if (!validateForm()) {
    return;
  }

  setLoading(true);
  setError(null);

  try {
    // Create order in database first
    const orderData = {
      email: formData.email,
      name: formData.name,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: parseFloat(cartSubtotal.toFixed(2)),
      discount: parseFloat(discountAmount.toFixed(2)),
      total: parseFloat(cartTotal.toFixed(2)),
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      paymentStatus: 'pending',
    };

    const orderResult = await createOrder(orderData);

    if (!orderResult.success) {
      throw new Error(orderResult.message);
    }

    // ✅ UPDATED: Call Supabase Edge Function instead of Stripe API directly
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const response = await fetch(
      `${supabaseUrl}/functions/v1/create-payment-intent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          amount: cartTotal,
          orderNumber: orderResult.orderNumber,
          customerEmail: formData.email,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create payment intent');
    }

    const { clientSecret, paymentIntentId } = await response.json();

    // Confirm payment with Stripe
    const { error: stripeError, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.name,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zipCode,
              country: formData.country,
            },
          },
        },
      }
    );

    if (stripeError) {
      throw new Error(stripeError.message);
    }

    // Update order with payment status
    await updateOrderPaymentStatus(
      orderResult.orderNumber,
      confirmedPayment.status,
      confirmedPayment.id
    );

    // Success!
    setSuccess(true);
    setOrderNumber(orderResult.orderNumber);
    
    // Call success callback after a short delay
    setTimeout(() => {
      onSuccess(orderResult.orderNumber);
    }, 3000);

  } catch (err) {
    console.error('Payment error:', err);
    setError(err.message || 'Payment failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

// Note: The rest of the Checkout component remains exactly the same!

  // Success state
  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4">
        <div className="inline-block p-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-8 border-4 border-green-200">
          <CheckCircle className="w-24 h-24 text-green-600" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed! 🎉</h2>
        <p className="text-xl text-gray-700 mb-2">
          Thank you for your purchase!
        </p>
        <p className="text-lg text-gray-600 mb-8">
          Order Number: <span className="font-bold text-amber-600">{orderNumber}</span>
        </p>
        <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200 max-w-md mx-auto">
          <p className="text-gray-700">
            We've sent a confirmation email to <strong>{formData.email}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Forms */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Street Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="NY"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="10001"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Lock className="w-4 h-4 text-green-600" />
              <span>Secure SSL encrypted payment</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-8 shadow-xl border-2 border-amber-200 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white rounded-xl p-4 border border-amber-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 pt-6 border-t-2 border-amber-200">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">€{cartSubtotal.toFixed(2)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span className="font-semibold">-€{discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              
              <div className="flex justify-between text-2xl font-bold text-gray-900 pt-3 border-t-2 border-amber-200">
                <span>Total:</span>
                <span className="text-amber-600">€{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-8">
              <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pay €{cartTotal.toFixed(2)}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t-2 border-amber-200">
              <p className="text-xs text-gray-600 text-center mb-3">
                Your payment information is secure and encrypted
              </p>
              <div className="flex justify-center gap-3">
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-700 border border-gray-200">
                  🔒 SSL Secure
                </div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-700 border border-gray-200">
                  💳 Stripe
                </div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-700 border border-gray-200">
                  ✓ Verified
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

// Main Checkout Component with Stripe Elements Provider
const Checkout = ({ cart, cartSubtotal, discountAmount, cartTotal, setCurrentView, clearCart }) => {
  const handleSuccess = (orderNumber) => {
    clearCart();
    // Could navigate to an order confirmation page here
    setTimeout(() => {
      setCurrentView('home');
    }, 3000);
  };

  const handleCancel = () => {
    setCurrentView('cart');
  };

  return (
    <div className="pt-32 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Secure Checkout</h1>
        <p className="text-xl text-gray-600">Complete your order safely and securely</p>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm
          cart={cart}
          cartSubtotal={cartSubtotal}
          discountAmount={discountAmount}
          cartTotal={cartTotal}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Elements>
    </div>
  );
};

export default Checkout;
