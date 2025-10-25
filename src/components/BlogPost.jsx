import React, { useRef, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Facebook, Twitter } from 'lucide-react';
import { sleepDiffusersContent } from '../blog-content/sleep-diffusers.js';
import { teaCeremonyContent } from '../blog-content/tea-ceremony.js';
import { homeWellnessSanctuaryContent } from '../blog-content/home-wellness-sanctuary.js';
import { aromatherapyBeginnersContent } from '../blog-content/aromatherapy-beginners.js';
import { teaForHealthContent } from '../blog-content/best-tea-for-health.js';

const BlogPost = ({ post, setCurrentView, setSelectedProduct, products }) => {
  const articleRef = useRef(null);

  useEffect(() => {
    const handleProductClick = (e) => {
      if (e.target.classList.contains('blog-product-btn') || e.target.closest('.blog-product-btn')) {
        const button = e.target.classList.contains('blog-product-btn')
          ? e.target
          : e.target.closest('.blog-product-btn');
        const productId = parseInt(button.dataset.productId);

        const product = products.find((p) => p.id === productId);

        if (product) {
          setSelectedProduct(product);
          setCurrentView('shop');
        }
      }
    };

    const articleElement = articleRef.current;
    if (articleElement) {
      articleElement.addEventListener('click', handleProductClick);
      return () => articleElement.removeEventListener('click', handleProductClick);
    }
  }, [products, setCurrentView, setSelectedProduct]);

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
      <article className="max-w-4xl mx-auto px-4" ref={articleRef}>
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
            <button
              onClick={() => {
                const url = window.location.href;
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
              }}
              className="p-2 bg-blue-600 text-white rounded-full hover:scale-110 transition"
            >
              <Facebook className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const url = window.location.href;
                const text = "Check out this amazing guide on better sleep with aroma diffusers!";
                window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
              }}
              className="p-2 bg-sky-500 text-white rounded-full hover:scale-110 transition"
            >
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
  dangerouslySetInnerHTML={{ 
    __html: 
      post.id === 1 ? sleepDiffusersContent 
      : post.id === 2 ? teaCeremonyContent 
      : post.id === 3 ? homeWellnessSanctuaryContent 
      : post.id === 4 ? aromatherapyBeginnersContent 
      : teaForHealthContent
  }} 
/>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 rounded-3xl p-12 text-center mt-12">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Shop?</h3>
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
