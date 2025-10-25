import React, { useState } from 'react';
import { Calendar, Clock, ArrowLeft, Share2, Tag } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    slug: 'best-aroma-diffusers-for-sleep',
    title: '10 Best Aroma Diffusers for Better Sleep (2025 Complete Guide)',
    excerpt: 'Discover the scientifically-proven aroma diffusers that can transform your sleep quality. Complete guide with expert tips and real customer reviews.',
    image: '/images/blog/diffusers-sleep-hero.jpg',
    author: 'Serenity Home Team',
    date: 'January 24, 2025',
    readTime: '18 min read',
    category: 'Sleep & Wellness',
    tags: ['Aromatherapy', 'Sleep Tips', 'Product Guide', 'Essential Oils']
  },
  // Add more blog posts here as you create them
];

const Blog = ({ setCurrentView, setSelectedBlogPost }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Sleep & Wellness', 'Tea Ceremony', 'Essential Oils', 'Home Decor', 'Gift Guides'];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 py-16 mb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Serenity Home Blog</h1>
          <p className="text-xl text-white/95">Wellness wisdom, product guides, and mindful living tips</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts
            .filter(post => selectedCategory === 'All' || post.category === selectedCategory)
            .map(post => (
              <article
                key={post.id}
                onClick={() => {
                  setSelectedBlogPost(post);
                  setCurrentView('blogPost');
                }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              >
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-amber-50">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    {post.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-amber-600 font-semibold group-hover:underline">
                      Read More →
                    </span>
                    <div className="flex gap-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
        </div>

        {/* Newsletter Signup CTA */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Never Miss a Post</h2>
          <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto">
            Get our latest wellness tips, product guides, and exclusive offers delivered to your inbox.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50"
            />
            <button className="bg-white text-amber-700 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
