import React from 'react';
import { Calendar, Clock } from 'lucide-react';


const blogPosts = [
  {
    id: 1,
    title: '10 Best Aroma Diffusers for Better Sleep (2025 Complete Guide)',
    excerpt: 'Discover the scientifically-proven aroma diffusers that can transform your sleep quality.',
    image: '/images/blog/sleep-diffuser.jpg',
    date: 'January 24, 2025',
    readTime: '18 min read',
    category: 'Sleep & Wellness'
  },
  // ADD THIS NEW POST:
  {
    id: 2,
    title: 'The Art of Tea Ceremony: Ancient Mindfulness for Modern Living',
    excerpt: 'Learn how to create your own authentic tea ceremony ritual at home. Discover the science-backed wellness benefits.',
    image: '/images/blog/tea-ceremony.png',
    date: 'January 28, 2025',
    readTime: '15 min read',
    category: 'Mindfulness & Wellness'
  },
  {
  id: 3,
  title: 'Creating Your Perfect Home Wellness Sanctuary: A Room-by-Room Guide',
  excerpt: 'Transform every room into a healing space. Learn the science-backed design principles for optimal wellness at home.',
  image: '/images/blog/home-wellness-sanctuary.png',
  date: 'February 3, 2025',
  readTime: '20 min read',
  category: 'Home Design & Wellness'
},
  {
  id: 4,
  title: 'Aromatherapy for Beginners: The Complete Science-Backed Guide',
  excerpt: 'Everything a beginner needs to know about essential oils and diffusers. Learn the science, safety, and best practices.',
  image: '/images/blog/aromatherapy-beginners.png',
  date: 'February 10, 2025',
  readTime: '22 min read',
  category: 'Aromatherapy & Wellness'
}
];
const Blog = ({ setCurrentView, setSelectedBlogPost }) => {
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
            <article
              key={post.id}
              onClick={() => {
                setSelectedBlogPost(post);
                setCurrentView('blogPost');
              }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-amber-50">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
