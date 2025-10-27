import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Award, Leaf, Users, Globe } from 'lucide-react';

const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 py-20 mb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img 
            src="/logo.png" 
            alt="Serenity Home" 
            className="h-72 w-auto mx-auto mb-6 drop-shadow-2xl"
          />
          <h1 className="text-5xl font-bold text-white mb-4">About Serenity Home</h1>
          <p className="text-xl text-white/95">Bringing tranquility and mindfulness into your daily life</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Our Story */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-10 border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Serenity Home was born from a simple belief: that everyone deserves moments of peace and tranquility in their daily lives. In our fast-paced world, we recognized the growing need for spaces and rituals that ground us, calm our minds, and reconnect us with what truly matters.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Founded by wellness enthusiasts who experienced firsthand the transformative power of mindful living, we set out to curate a collection of premium products that elevate everyday moments into meaningful rituals. Whether it's the gentle aroma of essential oils filling your space or the meditative practice of brewing the perfect cup of tea, each product in our collection is chosen with intention and care.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, we're proud to serve thousands of customers worldwide who have made mindfulness and self-care an essential part of their lives. Every product we offer reflects our commitment to quality, authenticity, and the belief that small moments of serenity can create profound change.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-2 border-amber-200">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600 leading-relaxed">
                We carefully select every product for its craftsmanship, durability, and ability to enhance your wellness journey. Only the finest materials and designs make it to our collection.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-2 border-green-200">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Mindful Living</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in the power of intentional living. Our products are designed to help you create meaningful rituals that bring calm, focus, and joy to your everyday life.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-2 border-blue-200">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600 leading-relaxed">
                We're building a global community of individuals committed to wellness and self-care. Your journey inspires us, and together we create a ripple of positive change.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <p className="text-xl text-white/90 leading-relaxed mb-6">
              To make wellness accessible, beautiful, and meaningful. We believe that self-care isn't a luxury—it's essential. Our mission is to provide thoughtfully curated products that transform ordinary moments into extraordinary experiences of peace and mindfulness.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              Every product we offer, every interaction we have, and every decision we make is guided by one question: "Will this help someone live a more mindful, peaceful, and intentional life?" If the answer is yes, we know we're on the right path.
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">Why Choose Serenity Home?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-200">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Curated Excellence</h3>
                <p className="text-gray-700">Every product is hand-selected for quality, functionality, and aesthetic beauty.</p>
              </div>
            </div>

            <div className="flex gap-4 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-200">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Exceptional Service</h3>
                <p className="text-gray-700">Fast shipping, easy returns, and customer support that genuinely cares about your experience.</p>
              </div>
            </div>

            <div className="flex gap-4 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-200">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Trusted Quality</h3>
                <p className="text-gray-700">All products undergo rigorous testing and meet international safety standards.</p>
              </div>
            </div>

            <div className="flex gap-4 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-200">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Global Reach</h3>
                <p className="text-gray-700">Serving customers worldwide with reliable shipping and dedicated support.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Wellness Journey</h2>
            <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto">
              Discover products that transform your space into a sanctuary of peace and tranquility.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/shop')}
                className="bg-white text-amber-700 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl text-lg"
              >
                Shop Collection
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-amber-700 transition-all text-lg"
              >
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
