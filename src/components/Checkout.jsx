import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, CheckCircle, AlertCircle, ShoppingBag, Truck, Mail, User, MapPin } from 'lucide-react';
import Select from "react-select";
import countries from "world-countries";
import { createOrder, updateOrderPaymentStatus, updateOrderShippingDetails } from '../lib/supabase.js';
import { generateEventId, trackInitiateCheckout, trackAddPaymentInfo, trackPurchase, identifyCustomer } from '../utils/tiktokPixel';
import { serverTrackPurchase, serverTrackInitiateCheckout } from '../utils/tiktokServerEvents';
import { useCurrency } from '../context/CurrencyContext.jsx';

function detectPaymentMethod() {
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  
  if (isIOS) {
    return 'ios';
  } else if (isAndroid) {
    return 'android';
  } else {
    return 'desktop';
  }
}

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Create country options for react-select
const countryOptions = countries
  .map((c) => ({
    label: c.name.common,
    value: c.cca2,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

// Main Checkout Form Component
const CheckoutForm = ({
  cart,
  cartSubtotal,
  discountAmount,
  cartTotal,
  shippingCost,
  finalTotal,
  clientSecret,
  orderNumber,
  onSuccess,
  onCancel
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { formatPrice } = useCurrency();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const deviceType = detectPaymentMethod();

  
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

  const handleCountryChange = (selected) => {
    handleChange({
      target: { name: "country", value: selected?.value || "" },
    });
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
      // STEP 1: Save shipping details BEFORE payment (fixes PayPal redirect issue)
      const shippingUpdateResult = await updateOrderShippingDetails(orderNumber, formData);

      if (!shippingUpdateResult.success) {
        console.warn('⚠️ Failed to save shipping details:', shippingUpdateResult.message);
        // Continue anyway - we'll retry after payment succeeds
      }

      // STEP 2: Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin, // Not used but required
          payment_method_data: {
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
        },
        redirect: 'if_required', // Don't redirect, handle in-page
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // STEP 3: Update order with payment status (also saves shipping details again as backup)
      await updateOrderPaymentStatus(
        orderNumber,
        paymentIntent.status,
        paymentIntent.id,
        formData  // ✅ include real customer data
      );

      // STEP 4: Identify customer to TikTok (tells TikTok WHO bought)
      await identifyCustomer({
        email: formData.email,
        externalId: orderNumber  // Use order number as unique identifier
      });

      // Generate shared event ID for deduplication
      const purchaseEventId = generateEventId();
      // STEP 5: Track successful purchase with TikTok Pixel (Browser-Side)
      trackPurchase({
        eventId: purchaseEventId,
        orderId: orderNumber,
        items: cart,
        totalValue: finalTotal
      });

      // STEP 6: Track successful purchase with Server-Side Events API (99% accuracy!)
      // Non-blocking: If server tracking fails, purchase still succeeds
      serverTrackPurchase({
        eventId: purchaseEventId,
        orderId: orderNumber,
        customerEmail: formData.email,
        items: cart,
        totalValue: finalTotal
      }).catch(error => {
        console.warn('⚠️ Server-side tracking failed (purchase still successful):', error);
      });

      // Success!
      setSuccess(true);
      
      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess(orderNumber);
      }, 3000);

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                    State / Province
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
                    ZIP / Postal Code *
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
                  <Select
                    options={countryOptions}
                    value={countryOptions.find((c) => c.value === formData.country) || null}
                    onChange={handleCountryChange}
                    placeholder="Start typing to search..."
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
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
              <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
            </div>
            
            {/* Payment Element - Shows all available payment methods */}
            {clientSecret && (
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <PaymentElement 
  onReady={() => setPaymentReady(true)}
  options={{
    layout: 'tabs',
    wallets: {
      applePay: deviceType === 'ios' ? 'auto' : 'never',
      googlePay: deviceType === 'android' ? 'auto' : 'never',
    },
    defaultValues: {
      billingDetails: {
        name: formData.name,
        email: formData.email,
      }
    }
  }}

                />
              </div>
            )}

            {!clientSecret && (
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading payment methods...</p>
              </div>
            )}

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
                <div key={`${item.id}-${item.variant || 'default'}`} className="flex gap-4 bg-white rounded-xl p-4 border border-amber-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {item.name}
                    </h3>
                    {item.variant && (
                      <p className="text-xs text-amber-600 font-medium">
                        {item.variant}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 pt-6 border-t-2 border-amber-200">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatPrice(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                  {shippingCost === 0 ? 'FREE ✓' : formatPrice(shippingCost)}
                </span>
              </div>

              <div className="flex justify-between text-2xl font-bold text-gray-900 pt-3 border-t-2 border-amber-200">
                <span>Total:</span>
                <span className="text-amber-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-8">
              <button
                type="submit"
                disabled={!stripe || loading || !paymentReady}
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
                    Pay {formatPrice(finalTotal)}
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
              <div className="flex justify-center gap-3 flex-wrap">
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-700 border border-gray-200">
                  🔒 SSL
                </div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-700 border border-gray-200">
                  💳 Card
                </div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-700 border border-gray-200">
                   Apple Pay
                </div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-700 border border-gray-200">
                  🔵 Google Pay
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

// Wrapper component to handle payment intent creation
const CheckoutWrapper = ({ cart, cartSubtotal, discountAmount, cartTotal, onSuccess, onCancel }) => {
  const checkoutTrackedRef = useRef(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate shipping cost
  const shippingCost = cartTotal > 50 ? 0 : 4.99;
  const finalTotal = cartTotal + shippingCost;

  useEffect(() => {
    const initializePayment = async () => {
        // Track InitiateCheckout only once
        if (!checkoutTrackedRef.current) {
          const checkoutEventId = generateEventId();
          trackInitiateCheckout(cart, finalTotal, checkoutEventId);
          serverTrackInitiateCheckout(cart, finalTotal, checkoutEventId);
          checkoutTrackedRef.current = true;
        }
        // Prevent re-initialization if payment intent already created
        if (clientSecret) {
          console.log("Payment already initialized, skipping");
          return;
        }
      try {
        // Split full name for database
        const formData = {
          name: '', // Will be filled by user
          email: '', // Will be filled by user
        };

        // Create order in database first
        const orderData = {
          email: 'pending@checkout.com', // Placeholder - will update after payment
          name: 'Pending Customer',
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            variant: item.variant || null, // Include variant if present
          })),
          subtotal: parseFloat(cartSubtotal.toFixed(2)),
          discount: parseFloat(discountAmount.toFixed(2)),
          total: parseFloat(finalTotal.toFixed(2)),
          shippingAddress: {
            address: 'Pending',
            city: 'Pending',
            state: '',
            zipCode: 'Pending',
            country: 'US',
          },
          paymentStatus: 'pending',
        };

        const orderResult = await createOrder(orderData);

        if (!orderResult.success) {
          throw new Error(orderResult.message);
        }

        setOrderNumber(orderResult.orderNumber);

        // Call Supabase Edge Function to create payment intent
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
              amount: finalTotal,
              orderNumber: orderResult.orderNumber,
              customerEmail: 'pending@checkout.com',
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

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);

      } catch (err) {
        console.error('Initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [cart, cartSubtotal, discountAmount, cartTotal]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4">
        <div className="animate-spin w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-8"></div>
        <p className="text-xl text-gray-700">Preparing checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4">
        <div className="inline-block p-8 bg-gradient-to-br from-red-100 to-rose-100 rounded-full mb-8 border-4 border-red-200">
          <AlertCircle className="w-24 h-24 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Checkout Error</h2>
        <p className="text-lg text-gray-700 mb-8">{error}</p>
        <button
          onClick={onCancel}
          className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all"
        >
          Return to Cart
        </button>
      </div>
    );
  }

  return (
    <CheckoutForm
      cart={cart}
      cartSubtotal={cartSubtotal}
      discountAmount={discountAmount}
      cartTotal={cartTotal}
      shippingCost={shippingCost}
      finalTotal={finalTotal}
      clientSecret={clientSecret}
      orderNumber={orderNumber}
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
};

// Main Checkout Component with Stripe Elements Provider
// Replace the entire Checkout component at the bottom with this:

const Checkout = ({ cart, cartSubtotal, discountAmount, cartTotal, clearCart }) => {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const checkoutTrackedRef = useRef(false);

  // Calculate shipping cost
  const shippingCost = cartTotal > 50 ? 0 : 4.99;
  const finalTotal = cartTotal + shippingCost;

  const handleSuccess = (orderNumber) => {
    clearCart();
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const handleCancel = () => {
    navigate('/cart');
  };

  // Initialize payment on mount
  useEffect(() => {

    const initializePayment = async () => {
        // Track InitiateCheckout only once
        if (!checkoutTrackedRef.current) {
          const checkoutEventId = generateEventId();
          trackInitiateCheckout(cart, finalTotal, checkoutEventId);
          serverTrackInitiateCheckout(cart, finalTotal, checkoutEventId);
          checkoutTrackedRef.current = true;
        }
        // Prevent re-initialization if payment intent already created
        if (clientSecret) {
          console.log("Payment already initialized, skipping");
          return;
        }
      try {
        // Create order in database first
        const orderData = {
          email: 'pending@checkout.com', // Temporary - updated after payment
          name: 'Pending Customer',
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            variant: item.variant || null, // Include variant if present
          })),
          subtotal: parseFloat(cartSubtotal.toFixed(2)),
          discount: parseFloat(discountAmount.toFixed(2)),
          total: parseFloat(finalTotal.toFixed(2)),
          shippingAddress: {
            address: 'Pending',
            city: 'Pending',
            state: '',
            zipCode: 'Pending',
            country: 'US',
          },
          paymentStatus: 'pending',
        };

        const orderResult = await createOrder(orderData);

        if (!orderResult.success) {
          throw new Error(orderResult.message);
        }

        setOrderNumber(orderResult.orderNumber);

        // Create payment intent via Edge Function
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
              amount: finalTotal,
              orderNumber: orderResult.orderNumber,
              customerEmail: 'pending@checkout.com',
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

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);

      } catch (err) {
        console.error('Initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [cart, cartSubtotal, discountAmount, cartTotal]);

  // Loading state
  if (loading) {
    return (
      <div className="pt-32 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-2xl mx-auto text-center py-16 px-4">
          <div className="animate-spin w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-700">Preparing secure checkout...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pt-32 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-2xl mx-auto text-center py-16 px-4">
          <div className="inline-block p-8 bg-gradient-to-br from-red-100 to-rose-100 rounded-full mb-8 border-4 border-red-200">
            <AlertCircle className="w-24 h-24 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Checkout Error</h2>
          <p className="text-lg text-gray-700 mb-8">{error}</p>
          <button
            onClick={handleCancel}
            className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  // Elements options with clientSecret
  const options = {
    clientSecret: clientSecret, // ✅ This is the key fix!
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#f59e0b',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '12px',
      },
    },
  };

  // Render checkout form
  return (
    <div className="pt-32 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Secure Checkout</h1>
        <p className="text-xl text-gray-600">Complete your order safely and securely with your preferred payment method</p>
      </div>

      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            cart={cart}
            cartSubtotal={cartSubtotal}
            discountAmount={discountAmount}
            cartTotal={cartTotal}
            shippingCost={shippingCost}
            finalTotal={finalTotal}
            clientSecret={clientSecret}
            orderNumber={orderNumber}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </Elements>
      )}
    </div>
  );
};

export default Checkout;
