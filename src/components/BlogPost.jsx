import React from 'react';
import { ArrowLeft, Calendar, Clock, Facebook, Twitter, Share2 } from 'lucide-react';

const BlogPost = ({ post, setCurrentView }) => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <button
          onClick={() => setCurrentView('blog')}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </button>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="inline-block bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
            {post.category}
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>

          <div className="flex items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {post.readTime}
            </div>
          </div>

          {/* Social Share */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-gray-600 font-medium">Share:</span>

            <button className="p-2 bg-blue-600 text-white rounded-full hover:scale-110 transition">
              <Facebook className="w-5 h-5" />
            </button>

            <button className="p-2 bg-sky-500 text-white rounded-full hover:scale-110 transition">
              <Twitter className="w-5 h-5" />
            </button>

            <button className="p-2 bg-gray-700 text-white rounded-full hover:scale-110 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <img src={post.image} alt={post.title} className="w-full h-auto" />
        </div>

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Why Aroma Diffusers Help You Sleep Better
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            If you're reading this at 2 AM after another restless night of tossing and turning, you're not alone. 
            Over 70 million Americans struggle with sleep disorders, and many more experience occasional insomnia.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            But here's the thing: you don't always need medication. Sometimes, the solution is as simple as 
            creating the right environment for rest—and that's where aroma diffusers come in.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Science Behind Aromatherapy
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Research from the Journal of Alternative and Complementary Medicine found that participants who used 
            lavender aromatherapy experienced a 45% improvement in sleep quality, along with reduced heart rate 
            and blood pressure.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Our Top 3 Recommendations
          </h2>

          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 border-2 border-amber-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🥇 #1: Jellyfish Dream LED Aroma Diffuser
            </h3>
            <p className="text-gray-700 mb-4">
              The hypnotic jellyfish animations are like meditation for your eyes. The 250ml capacity means 
              it runs all night without refilling, and the remote control lets you adjust everything without 
              getting out of bed.
            </p>
            <button 
              onClick={() => setCurrentView('shop')}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition"
            >
              Shop Now - $69.99
            </button>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 border-2 border-amber-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🥈 #2: Flame Fireplace Aroma Diffuser
            </h3>
            <p className="text-gray-700 mb-4">
              The subtle flame simulation creates an incredibly calming ambiance—perfect for winding down before bed. 
              The multicolor lighting lets you choose the perfect mood.
            </p>
            <button 
              onClick={() => setCurrentView('shop')}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition"
            >
              Shop Now - $54.99
            </button>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 border-2 border-amber-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🥉 #3: Cannon Blast Flame Humidifier
            </h3>
            <p className="text-gray-700 mb-4">
              Perfect for dry winter air that affects sleep quality. The unique cannon design adds moisture 
              while dispersing essential oils.
            </p>
            <button 
              onClick={() => setCurrentView('shop')}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition"
            >
              Shop Now - $39.99
            </button>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Best Essential Oils for Sleep
          </h2>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <span className="text-amber-600 text-2xl">•</span>
              <div>
                <strong className="text-gray-900">Lavender:</strong>
                <span className="text-gray-700"> The gold standard for sleep. Contains compounds that reduce anxiety and promote relaxation.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 text-2xl">•</span>
              <div>
                <strong className="text-gray-900">Chamomile:</strong>
                <span className="text-gray-700"> Gentle and effective. Perfect for sensitive noses and children's bedtime routines.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 text-2xl">•</span>
              <div>
                <strong className="text-gray-900">Cedarwood:</strong>
                <span className="text-gray-700"> Stimulates melatonin production. Great for staying asleep through the night.</span>
              </div>
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Final Thoughts
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Quality sleep changes everything—your mood, productivity, health, and relationships all improve 
            when you're well-rested. Aromatherapy diffusers are one of the simplest, most natural ways to 
            transform your sleep quality.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Don't let another restless night go by. The right diffuser + the right oils + the right routine = 
            the best sleep of your life.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Sleep?</h3>
          <p className="text-xl text-white/95 mb-8">
            Shop our collection of premium aroma diffusers today.
          </p>
          <button
            onClick={() => setCurrentView('shop')}
            className="bg-white text-amber-700 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl"
          >
            Shop All Diffusers
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
