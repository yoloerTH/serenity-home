import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, MessageCircle, Mail, Phone } from 'lucide-react';

const FAQ = () => {
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState('shipping');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const faqCategories = {
    shipping: {
      title: "Shipping & Delivery",
      icon: "🚚",
      questions: [
        {
          q: "What are your shipping options?",
          a: "We offer free standard shipping on orders over $50. Standard shipping (5-7 business days) is $9.99 for orders under $50. Express shipping (2-3 business days) is available for $19.99."
        },
        {
          q: "Do you ship internationally?",
          a: "Yes! We currently ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination. Please check our shipping calculator at checkout for specific details."
        },
        {
          q: "How can I track my order?",
          a: "Once your order ships, you'll receive a tracking number via email. You can use this number to track your package on our website or directly on the carrier's site."
        },
        {
          q: "What if my package is lost or damaged?",
          a: "We take full responsibility for lost or damaged packages. Contact us immediately with your order number, and we'll either send a replacement or issue a full refund."
        }
      ]
    },
    returns: {
      title: "Returns & Refunds",
      icon: "↩️",
      questions: [
        {
          q: "What is your return policy?",
          a: "We offer a 30-day return policy for all unused items in their original packaging. Simply contact our customer service team to initiate a return, and we'll provide you with a prepaid return label."
        },
        {
          q: "How long does it take to process a refund?",
          a: "Once we receive your return, we'll process your refund within 5-7 business days. The refund will be issued to your original payment method."
        },
        {
          q: "Can I exchange an item?",
          a: "Absolutely! We're happy to exchange items for a different size, color, or product. Contact us to arrange an exchange, and we'll cover the return shipping."
        },
        {
          q: "Are there any items that cannot be returned?",
          a: "For hygiene reasons, we cannot accept returns on opened aromatherapy products or diffuser oils. All other items can be returned within 30 days if unused."
        }
      ]
    },
    products: {
      title: "Products & Usage",
      icon: "📦",
      questions: [
        {
          q: "Are your products safe and tested?",
          a: "Yes! All our products undergo rigorous quality testing and meet international safety standards. Our tea makers are made from food-grade materials, and our diffusers are certified for electrical safety."
        },
        {
          q: "How do I care for my tea maker?",
          a: "Most components are hand-wash only with mild soap and warm water. Avoid abrasive cleaners or putting glass parts in the dishwasher. Detailed care instructions are included with each product."
        },
        {
          q: "What essential oils work with your diffusers?",
          a: "Our diffusers work with all pure essential oils and water-soluble fragrance oils. We recommend using high-quality, 100% pure essential oils for the best aromatherapy experience."
        },
        {
          q: "Do your products come with warranties?",
          a: "Yes! All electrical products come with a 1-year manufacturer's warranty covering defects in materials and workmanship. Register your product after purchase to activate the warranty."
        }
      ]
    },
    payment: {
      title: "Payment & Security",
      icon: "💳",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All payments are processed securely through encrypted connections."
        },
        {
          q: "Is my payment information secure?",
          a: "Absolutely! We use industry-standard SSL encryption to protect your payment information. We never store your complete credit card details on our servers."
        },
        {
          q: "Do you offer payment plans?",
          a: "Currently, we don't offer payment plans, but we're working on adding this option soon. Subscribe to our newsletter to be notified when it becomes available."
        },
        {
          q: "Can I use multiple payment methods?",
          a: "At this time, we only accept one payment method per order. However, you can use gift cards or store credit in combination with a primary payment method."
        }
      ]
    },
    account: {
      title: "Account & Orders",
      icon: "👤",
      questions: [
        {
          q: "Do I need an account to place an order?",
          a: "No, you can checkout as a guest. However, creating an account allows you to track orders, save addresses, view order history, and receive exclusive offers."
        },
        {
          q: "How do I reset my password?",
          a: "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link. The link is valid for 24 hours."
        },
        {
          q: "Can I cancel or modify my order?",
          a: "Orders can be cancelled or modified within 2 hours of placement. After that, the order enters our fulfillment process. Contact us immediately if you need to make changes."
        },
        {
          q: "How do I update my account information?",
          a: "Log in to your account and click 'Account Settings' to update your email, shipping address, password, and communication preferences."
        }
      ]
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 py-16 mb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageCircle className="w-16 h-16 text-white mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-white/95">Find answers to common questions about our products and services</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(faqCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setExpandedCategory(key)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                expandedCategory === key
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-400'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.title}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="space-y-4 mb-16">
          {faqCategories[expandedCategory].questions.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-all">
              <button
                onClick={() => setExpandedQuestion(expandedQuestion === `${expandedCategory}-${idx}` ? null : `${expandedCategory}-${idx}`)}
                className="w-full px-8 py-6 flex justify-between items-center hover:bg-amber-50 transition"
              >
                <span className="font-bold text-lg text-gray-900 text-left pr-4">{item.q}</span>
                {expandedQuestion === `${expandedCategory}-${idx}` ? (
                  <ChevronUp className="w-6 h-6 text-amber-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {expandedQuestion === `${expandedCategory}-${idx}` && (
                <div className="px-8 py-6 bg-gradient-to-br from-gray-50 to-amber-50/20 border-t-2 border-gray-100">
                  <p className="text-gray-700 leading-relaxed text-lg">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

          {/* Contact Section */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-12 border-2 border-amber-200 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-lg text-gray-700 mb-8">Our customer service team is here to help you!</p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-2xl hover:scale-105 transition-all text-lg"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};


export default FAQ;
