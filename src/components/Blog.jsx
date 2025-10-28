import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';

export const blogPosts = [
  {
    id: 1,
    slug: 'sleep-diffusers-guide',
    title: '10 Best Aroma Diffusers for Better Sleep (2025 Complete Guide)',
    excerpt: 'Discover the scientifically-proven aroma diffusers that can transform your sleep quality.',
    image: '/images/blog/sleep-diffuser.jpg',
    date: 'January 24, 2025',
    readTime: '18 min read',
    category: 'Sleep & Wellness'
  },
  {
    id: 2,
    slug: 'tea-ceremony-essentials',
    title: 'The Art of Tea Ceremony: Ancient Mindfulness for Modern Living',
    excerpt: 'Learn how to create your own authentic tea ceremony ritual at home. Discover the science-backed wellness benefits.',
    image: '/images/blog/tea-ceremony.png',
    date: 'January 28, 2025',
    readTime: '15 min read',
    category: 'Mindfulness & Wellness'
  },
  {
    id: 3,
    slug: 'home-wellness-sanctuary',
    title: 'Creating Your Perfect Home Wellness Sanctuary: A Room-by-Room Guide',
    excerpt: 'Transform every room into a healing space. Learn the science-backed design principles for optimal wellness at home.',
    image: '/images/blog/home-wellness-sanctuary.png',
    date: 'February 3, 2025',
    readTime: '20 min read',
    category: 'Home Design & Wellness'
  },
  {
    id: 4,
    slug: 'aromatherapy-for-beginners',
    title: 'Aromatherapy for Beginners: The Complete Science-Backed Guide',
    excerpt: 'Everything a beginner needs to know about essential oils and diffusers. Learn the science, safety, and best practices.',
    image: '/images/blog/aromatherapy-beginners.png',
    date: 'February 10, 2025',
    readTime: '22 min read',
    category: 'Aromatherapy & Wellness'
  },
  {
    id: 5,
    slug: 'best-tea-for-health',
    title: 'The Best Tea for Health & Wellness: Complete Science-Backed Guide',
    excerpt: 'Discover which teas are best for your health, how to brew them perfectly, and how to build a sustainable tea practice.',
    image: '/images/blog/best-tea-for-health.png',
    date: 'February 17, 2025',
    readTime: '20 min read',
    category: 'Tea & Wellness'
  },
  {
    id: 6,
    slug: 'diffuser-maintenance-guide',
    title: "How to Clean & Maintain Your Diffuser (Complete Guide)",
    excerpt: "Proper maintenance is the difference between a diffuser that lasts 2 years and one that performs flawlessly for 7+ years.",
    image: '/images/blog/diffuser-maintenance-hero.jpg',
    date: 'February 2025',
    readTime: '12 min read',
    category: 'Aromatherapy & Diffusers',
    tags: ['Maintenance', 'How-to', 'Diffuser Care', 'Product Guide'],
    keywords: ['how to clean diffuser', 'diffuser maintenance', 'clean ultrasonic diffuser']
  },
  {
    id: 7,
    slug: 'essential-oils-anxiety-stress',
    title: 'Best Essential Oils for Anxiety & Stress Relief (2025 Science-Backed Guide)',
    excerpt: 'Discover the 10 most effective essential oils clinically proven to reduce anxiety by up to 60%. Complete guide with blends and usage methods.',
    image: '/images/blog/essential-oils-anxiety.png',
    date: 'January 2025',
    readTime: '18 min read',
    category: 'Anxiety & Stress Relief',
    tags: ['Anxiety', 'Stress', 'Essential Oils', 'Mental Health'],
    keywords: ['essential oils for anxiety', 'stress relief oils', 'best oils for stress', 'aromatherapy anxiety']
  },
  {
    id: 8,
    slug: 'diffuser-vs-candles',
    title: 'Diffusers vs Candles: Which is Safer & More Effective? (2025 Comparison)',
    excerpt: 'The ultimate comparison guide. Safety, cost, effectiveness, and environmental impact analyzed. The results will surprise you.',
    image: '/images/blog/diffuser-vs-candles.png',
    date: 'January 2025',
    readTime: '16 min read',
    category: 'Product Comparison',
    tags: ['Diffuser', 'Candles', 'Comparison', 'Safety'],
    keywords: ['diffuser vs candles', 'are diffusers safer than candles', 'candles or diffusers better']
  },
  {
    id: 9,
    slug: 'tea-lovers-gift-guide',
    title: 'Ultimate Gift Guide for Tea Lovers (2025)',
    excerpt: 'Find the perfect tea gift for every occasion and budget. Expert recommendations from €40 to €180+. Make your gift unforgettable.',
    image: '/images/blog/tea-gift-guide.png',
    date: 'January 2025',
    readTime: '20 min read',
    category: 'Gift Guide',
    tags: ['Gifts', 'Tea', 'Shopping Guide', 'Occasions'],
    keywords: ['tea gift ideas', 'best tea sets gifts', 'tea lover gifts', 'tea gift guide']
  },
  {
    id: 10,
    slug: 'led-humidifier-buying-guide',
    title: 'LED Humidifier Buying Guide 2025: How to Choose the Best Aroma Humidifier',
    excerpt: 'The complete science-backed guide to choosing LED humidifiers. Learn the 7 critical factors, avoid 7 costly mistakes, and find your perfect match.',
    image: '/images/blog/led-humidifier-guide.png',
    date: 'January 2025',
    readTime: '20 min read',
    category: 'Buying Guide',
    tags: ['Humidifier', 'Buying Guide', 'Product Review', 'Health'],
    keywords: ['LED humidifier', 'best humidifier 2025', 'humidifier buying guide', 'aroma humidifier', 'ultrasonic humidifier']
  },
  {
    id: 11,
    slug: 'morning-routine-energy',
    title: 'Morning Routine for Energy: Tea + Aromatherapy Ritual (2025 Guide)',
    excerpt: 'The ultimate 30-minute morning routine combining tea ceremony and aromatherapy. Science-backed strategies for all-day energy without coffee crashes.',
    image: '/images/blog/morning-routine-energy.png',
    date: 'January 2025',
    readTime: '20 min read',
    category: 'Wellness & Routines',
    tags: ['Morning Routine', 'Energy', 'Tea', 'Aromatherapy', 'Productivity'],
    keywords: ['morning routine', 'morning routine for energy', 'tea ritual', 'energizing tea', 'morning aromatherapy']
  },
  {
    id: 12,
    slug: 'humidifier-vs-diffuser',
    title: 'Humidifier vs Diffuser: What\'s the Difference? (2025 Complete Guide)',
    excerpt: 'Confused about humidifiers vs diffusers? This complete guide explains the key differences, when to use each, and which one you actually need.',
    image: '/images/blog/humidifier-vs-diffuser.png',
    date: 'January 2025',
    readTime: '18 min read',
    category: 'Product Education',
    tags: ['Humidifier', 'Diffuser', 'Comparison', 'Buying Guide'],
    keywords: ['humidifier vs diffuser', 'difference between humidifier and diffuser', 'humidifier or diffuser', 'which is better']
  }
];

const Blog = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 py-16 mb-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Serenity Home Blog</h1>
          <p className="text-xl text-white/95">Wellness tips & product guides</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer group no-underline"
            >
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-amber-50">
                <img
                  src={post.image}
                  alt={post.title}
                  width="400"
                  height="224"
                  loading="lazy"
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

                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition">
                  {post.title}
                </h2>

                <p className="text-gray-600 mb-4">{post.excerpt}</p>

                <span className="text-amber-600 font-semibold group-hover:underline">
                  Read More →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
