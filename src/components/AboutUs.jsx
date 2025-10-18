import React, { useState } from 'react';
import { Mail, MessageCircle, Send, MapPin, Clock, CheckCircle } from 'lucide-react';
import { submitContactForm } from '../lib/supabase.js';

const ContactUs = ({ setCurrentView }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitContactForm(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setStatus('error');
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 py-20 mb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img 
            src="/logo.png" 
            alt="Serenity Home" 
            className="h-32 w-auto mx-auto mb-6 drop-shadow-2xl"
          />
          <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-white/95">
            We'd love to hear from you — whether it’s a question, feedback, or just to say hello.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Mail className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Email Us</h3>
                <p className="text-gray-600">support@serenityhome.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <MessageCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Chat With Us</h3>
                <p className="text-gray-600">We’re available Monday–Friday, 9 AM – 6 PM</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Visit Us</h3>
                <p className="text-gray-600">123 Serenity Street, Mindful City, Earth</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Working Hours</h3>
                <p className="text-gray-600">Mon–Fri: 9 AM – 6 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-10 rounded-3xl border-2 border-amber-200 shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Send className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send /> Send Message
                  </>
                )}
              </button>

              {status === 'success' && (
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold mt-4">
                  <CheckCircle className="w-5 h-5" /> Message sent successfully!
                </div>
              )}
              {status === 'error' && (
                <div className="text-red-600 font-semibold text-center mt-4">
                  Something went wrong. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <button
            onClick={() => setCurrentView('shop')}
            className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-transform"
          >
            Back to Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
