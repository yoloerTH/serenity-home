import React from 'react';
import { ArrowLeft, Calendar, Clock, Facebook, Twitter } from 'lucide-react';
import { sleepDiffusersContent } from '../blog-content/sleep-diffusers.js';

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
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <img src={post.image} alt={post.title} className="w-full h-auto" />
        </div>

        {/* Blog Content */}
        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: sleepDiffusersContent }}
        />

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 rounded-3xl p-12 text-center mt-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Shop?
          </h3>
          <button
            onClick={() => setCurrentView('shop')}
            className="bg-white text-amber-700 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl"
          >
            View All Products
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
