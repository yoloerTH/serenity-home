import React, { useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Pinterest, Link as LinkIcon } from 'lucide-react';

const BlogPost = ({ post, setCurrentView }) => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank');
  };

  const shareToPinterest = () => {
    window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(post.image)}&description=${encodeURIComponent(post.title)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <button
          onClick={() => setCurrentView('blog')}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </button>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-block bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
            {post.category}
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

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

          {/* Social Share Buttons */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-gray-600 font-medium">Share:</span>
            <button onClick={shareToFacebook} className="p-2 bg-blue-600 text-white rounded-full hover:scale-110 transition">
              <Facebook className="w-5 h-5" />
            </button>
            <button onClick={shareToTwitter} className="p-2 bg-sky-500 text-white rounded-full hover:scale-110 transition">
              <Twitter className="w-5 h-5" />
            </button>
            <button onClick={shareToPinterest} className="p-2 bg-red-600 text-white rounded-full hover:scale-110 transition">
              <Pinterest className="w-5 h-5" />
            </button>
            <button onClick={copyLink} className="p-2 bg-gray-600 text-white rounded-full hover:scale-110 transition">
              <LinkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {/* THIS IS WHERE YOU'LL PUT THE BLOG CONTENT */}
          {/* For now, we'll use a placeholder. You'll paste the actual blog content here */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12">
          {post.tags.map(tag => (
            <span key={tag} className="bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-10 border-2 border-amber-200 text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Transform Your Sleep?</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Shop our collection of premium aroma diffusers and start sleeping better tonight.
          </p>
          <button
            onClick={() => setCurrentView('shop')}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl"
          >
            Shop Diffusers
          </button>
        </div>

        {/* Related Articles */}
        <div className="border-t border-gray-200 pt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* You'll add related articles here later */}
            <div className="text-gray-600 italic">More articles coming soon...</div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
