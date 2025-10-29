import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Heart, Star, ChevronRight, Sparkles, Shield, Truck, Package, Award, Clock } from 'lucide-react';
import { subscribeToNewsletter } from './lib/supabase.js';
import FAQ from './components/FAQ.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
import TermsOfService from './components/TermsOfService.jsx';
import AboutUs from './components/AboutUs.jsx';
import ContactUs from './components/ContactUs.jsx';
import Blog, { blogPosts } from './components/Blog.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import CookieConsent from './components/CookieConsent.jsx';

// Lazy load heavy components (only load when needed)
const Cart = lazy(() => import('./components/Cart.jsx'));
const Favorites = lazy(() => import('./components/Favorites.jsx'));
const ProductPage = lazy(() => import('./components/ProductPage.jsx'));
const Checkout = lazy(() => import('./components/Checkout.jsx'));
const AIChatAssistant = lazy(() => import('./components/AIChatAssistant.jsx'));
const BlogPost = lazy(() => import('./components/BlogPost.jsx'));


// Enhanced Product Data with Media
const products = [
  {
    id: 1,
    name: "Flame Fireplace Aroma Diffuser",
    category: "ambiance",
    price: 54.99,
    originalPrice: 89.99,
    image: "/images/flame-diffuser-main.png",
    relatedProducts: [2, 3, 4],
    media: [
      { type: "image", url: "/images/flame-diffuser-main.png" },
      { type: "video", url: "https://rdrbedgxihxavpplfigm.supabase.co/storage/v1/object/public/nvnbcxn/1018(1).mp4" },
      { type: "image", url: "/images/flame-diffuser-angle1.png" },
      { type: "image", url: "/images/flame-diffuser-angle2.png" },
      { type: "image", url: "/images/flame-diffuser-in-room.png" }
    ],
    description: "Transform any space into a cozy sanctuary with realistic flame effects and aromatherapy",
    longDescription: "Experience the magic of a crackling fireplace without the hassle. Our Flame Fireplace Aroma Diffuser combines mesmerizing simulated flames with therapeutic aromatherapy to create the ultimate relaxation experience. The dancing LED flames create a realistic fireplace ambiance while the ultrasonic technology disperses your favorite essential oils into a fine mist. With multicolor lighting options, adjustable timer settings, and whisper-quiet operation, this USB-powered diffuser is perfect for bedrooms, bathrooms, or office spaces. The compact design makes it an elegant addition to any décor, while the long-lasting fragrance delivery ensures hours of continuous aromatherapy benefits. Create a warm, inviting atmosphere that soothes the senses and elevates your daily wellness routine.",
    specifications: {
      "Power Source": "USB (included cable)",
      "Tank Capacity": "180ml",
      "Run Time": "6-8 hours continuous",
      "Lighting": "Multicolor flame simulation",
      "Timer Options": "1H / 3H / 6H / Continuous",
      "Dimensions": "5.5\" x 5.5\" x 7\"",
      "Noise Level": "< 35dB (whisper quiet)"
    },
    rating: 4.8,
    reviews: 156,
detailedReviews: [
  {
    name: "Sophie M.",
    rating: 5,
    date: "2 weeks ago",
    comment: "The flame effect is absolutely mesmerizing! I use it every evening in my bedroom with lavender oil. The realistic flames create such a cozy atmosphere. Best purchase this year!",
    verified: true
  },
  {
    name: "Marcus T.",
    rating: 5,
    date: "1 month ago",
    comment: "Exceeded expectations! The ultrasonic mist is so gentle and the multicolor lights are beautiful. I use it on my desk at work. Colleagues always ask where I got it.",
    verified: true
  },
  {
    name: "Emma L.",
    rating: 4,
    date: "3 weeks ago",
    comment: "Really nice diffuser with great ambiance. The flame simulation looks realistic. Only wish the water tank was slightly larger, but runs for several hours. Definitely recommend!",
    verified: true
  }
],
features: ["Realistic Flames", "Timer Function", "USB Powered"],
    inStock: true,
    badge: "Bestseller",
    shippingInfo: "Free shipping • Delivery in 10-14 days"
  },
  {
    id: 2,
    name: "Dynamic Jellyfish Aroma Diffuser",
    category: "ambiance",
    price: 72.99,
    originalPrice: 119.99,
    image: "/images/jellyfish-diffuser-main.png",
    relatedProducts: [1, 3, 5],
    media: [
      { type: "image", url: "/images/jellyfish-diffuser-main.png" },
      { type: "video", url: "https://rdrbedgxihxavpplfigm.supabase.co/storage/v1/object/public/nvnbcxn/1018(2).mp4" },
      { type: "image", url: "/images/jellyfish-diffuser-colors.png" },
      { type: "image", url: "/images/jellyfish-diffuser-remote.png" },
      { type: "image", url: "/images/jellyfish-diffuser-lifestyle.png" }
    ],
    description: "Mesmerizing jellyfish design with ultrasonic aromatherapy and color-changing ambient lighting",
    longDescription: "Dive into tranquility with our captivating Dynamic Jellyfish Aroma Diffuser. This innovative design combines the graceful beauty of floating jellyfish with advanced ultrasonic aromatherapy technology. Watch as ethereal LED lights dance and change colors, mimicking the gentle movement of jellyfish in the ocean depths. The generous 250ml water tank provides up to 10 hours of continuous misting, while the top-fill design makes refilling effortless. Control every aspect with the included remote—adjust mist intensity, cycle through 7 stunning color options, or set your preferred timer. The whisper-quiet operation (under 30dB) makes it perfect for bedrooms, nurseries, meditation spaces, or offices. Safety features include automatic shut-off when water runs low. Transform your space into an underwater sanctuary that soothes your mind and moisturizes your environment.",
    specifications: {
      "Tank Capacity": "250ml (large capacity)",
      "Technology": "Ultrasonic wave technology",
      "Run Time": "Up to 10 hours",
      "LED Colors": "7 color options + gradient mode",
      "Remote Control": "Included (full function)",
      "Auto Shut-off": "Yes (safety feature)",
      "Coverage": "Up to 350 sq ft",
      "Fill Type": "Top-fill design"
    },
    rating: 4.9,
    reviews: 203,
detailedReviews: [
  {
    name: "Rachel K.",
    rating: 5,
    date: "1 week ago",
    comment: "The jellyfish animations are SO calming! My kids love watching them before bed. The 250ml capacity lasts all night. Pure magic! 🪼",
    verified: true
  },
  {
    name: "David P.",
    rating: 5,
    date: "2 weeks ago",
    comment: "This is a work of art! The 5 different jellyfish patterns are incredibly realistic. Silent operation. The wood grain base adds elegance. Perfect for meditation.",
    verified: true
  },
  {
    name: "Lisa W.",
    rating: 5,
    date: "1 month ago",
    comment: "Bought this for my daughter's nursery - perfect! The gentle movements are soothing, auto shut-off gives peace of mind. Best baby shower gift!",
    verified: true
  }
],
features: ["Remote Control", "250ml Tank", "Color-Changing"],
    inStock: true,
    badge: "Premium",
    shippingInfo: "Free shipping • Delivery in 10-14 days"
  },
  {
    id: 3,
    name: "Cannon Blast Flame Humidifier",
    category: "ambiance",
    price: 39.99,
    originalPrice: 69.99,
    image: "/images/cannon-humidifier-main.png",
    relatedProducts: [1, 2, 4],
    media: [
      { type: "image", url: "/images/cannon-humidifier-main.png" },
      { type: "video", url: "https://rdrbedgxihxavpplfigm.supabase.co/storage/v1/object/public/nvnbcxn/1018(3).mp4" },
      { type: "image", url: "/images/cannon-humidifier-flame.png" },
      { type: "image", url: "/images/cannon-humidifier-desk.png" },
      { type: "image", url: "/images/cannon-humidifier-night.png" }
    ],
    description: "Unique cannon tower design with flame simulation and aromatherapy capabilities",
    longDescription: "Make a bold statement with our striking Cannon Blast Flame Humidifier. This conversation-piece combines industrial aesthetics with modern wellness technology. The distinctive cannon tower design features a realistic flame simulation that projects upward like cannon fire, creating a dramatic visual effect that's both powerful and calming. Perfect for adding moisture to dry air while dispersing your favorite essential oils, this compact humidifier is ideal for desks, nightstands, or small spaces. The sleek black finish complements any modern décor, from minimalist offices to contemporary bedrooms. Despite its powerful appearance, the operation is whisper-quiet, ensuring it won't disturb your work or sleep. The simple one-button control makes it easy to use, while the compact size means it fits anywhere. Add a touch of unique style to your wellness routine.",
    specifications: {
      "Design": "Cannon tower with flame effect",
      "Tank Capacity": "120ml",
      "Run Time": "4-6 hours",
      "Operation": "Silent (< 30dB)",
      "Color": "Matte Black",
      "Power": "USB powered",
      "Dimensions": "3.5\" x 3.5\" x 8\"",
      "Aromatherapy": "Compatible with all essential oils"
    },
    rating: 4.6,
    reviews: 142,
detailedReviews: [
  {
    name: "Alex H.",
    rating: 5,
    date: "3 weeks ago",
    comment: "Love the unique cannon design! Conversation starter on my desk. The flame simulation is subtle but beautiful. Perfect for home office.",
    verified: true
  },
  {
    name: "Jennifer S.",
    rating: 4,
    date: "2 weeks ago",
    comment: "Really cool diffuser! Silent operation is great for work calls. Compact yet powerful. Great value for money!",
    verified: true
  },
  {
    name: "Tom R.",
    rating: 5,
    date: "1 month ago",
    comment: "Fantastic! USB-powered means I can use it anywhere. Impressive mist for such a small unit. Using daily for 3 weeks - no issues!",
    verified: true
  }
],
features: ["Silent Operation", "Unique Design", "Compact Size"],
    inStock: true,
    badge: "Hot",
    shippingInfo: "Free shipping • Delivery in 10-14 days"
  },
  {
    id: 4,
    name: "Lazy Kung Fu Magnetic Drip Teapot",
    category: "tea",
    price: 79.99,
    originalPrice: 129.99,
    image: "/images/lazy-teapot-main.png",
    relatedProducts: [5, 1, 2],
    media: [
      { type: "image", url: "/images/lazy-teapot-main.png" },
      { type: "video", url: "https://sbupwhgzlrpiccvipeox.supabase.co/storage/v1/object/public/gfsh/d(16).mp4" },
      { type: "image", url: "/images/lazy-teapot-pouring.png" },
      { type: "image", url: "/images/lazy-teapot-with-cups.png" },
      { type: "image", url: "/images/lazy-teapot-ceremony.png" }
    ],
    description: "Innovative magnetic tea brewing system for effortless tea ceremony at home",
    longDescription: "Revolutionize your tea experience with the Lazy Kung Fu Magnetic Drip Teapot, where ancient tradition meets modern convenience. This ingenious design uses magnetic technology to automatically separate tea leaves from your brew, delivering the perfect cup without complicated steps or messy filters. Simply add your tea leaves, pour hot water, and watch as the magnetic mechanism works its magic. The elegant glass construction allows you to appreciate the beauty of blooming flower teas and unfolding loose leaves, while the heat-resistant borosilicate glass keeps your tea at the ideal temperature. Perfect for all types of tea—loose leaf, flowering tea, tea bags, or even French press coffee. Available as a single elegant teapot or as a complete set with matching cups, making it the perfect gift for tea enthusiasts, meditation practitioners, or anyone who appreciates the ritual of a well-brewed cup. A thoughtful present for Mother's Day, Ramadan, Christmas, or any special occasion.",
    specifications: {
      "Material": "Premium borosilicate glass",
      "Capacity": "600ml teapot",
      "Technology": "Magnetic tea/water separation",
      "Heat Resistance": "Up to 150°C (302°F)",
      "Included": "Choose: Solo pot or Set with 4 cups",
      "Cup Size": "50ml each (if set selected)",
      "Compatible With": "Loose leaf, flower tea, bags, coffee",
      "Care": "Dishwasher safe"
    },
    rating: 4.9,
    reviews: 187,
detailedReviews: [
  {
    name: "Catherine L.",
    rating: 5,
    date: "1 week ago",
    comment: "The magnetic tea/water separation is genius! Makes brewing loose leaf tea so easy and mess-free. The borosilicate glass is beautiful. Like meditation!",
    verified: true
  },
  {
    name: "James W.",
    rating: 5,
    date: "2 weeks ago",
    comment: "Revolutionized my tea routine! No more leaves in my cup. 600ml is perfect for 2-3 servings. Glass stays crystal clear. Magnetic system is so smooth!",
    verified: true
  },
  {
    name: "Maya P.",
    rating: 5,
    date: "3 weeks ago",
    comment: "Got the set with 4 cups - perfection! Stunning craftsmanship. I use it for my morning tea ceremony. Works great with coffee too! Best tea pot ever.",
    verified: true
  }
],
features: ["Magnetic Technology", "Premium Glass", "Versatile Brewing"],
    inStock: true,
    badge: "New",
    shippingInfo: "Free shipping • Delivery in 14 days"
  },
  {
    id: 5,
    name: "Complete Kung Fu Tea Ceremony Set",
    category: "tea",
    price: 99.99,
    originalPrice: 159.99,
    image: "/images/tea-ceremony-set-main.png",
    relatedProducts: [4, 1, 2],
    media: [
      { type: "image", url: "/images/tea-ceremony-set-main.png" },
      { type: "video", url: "https://rdrbedgxihxavpplfigm.supabase.co/storage/v1/object/public/nvnbcxn/1018(4).mp4" },
      { type: "image", url: "/images/tea-ceremony-set-full.png" },
      { type: "image", url: "/images/tea-ceremony-set-detail.png" },
      { type: "image", url: "/images/tea-ceremony-set-in-use.png" }
    ],
    description: "Exquisite glass tea ceremony set with magnetic water diversion system",
    longDescription: "Elevate your tea ritual to an art form with our Complete Kung Fu Tea Ceremony Set. This comprehensive 15-piece collection brings the authentic Chinese Gongfu tea ceremony experience to your home. At the heart of the set is the innovative magnetic water diversion system featuring a rotating Gaiwan (covered bowl) that allows for precise tea brewing and elegant serving. The crystal-clear glass construction showcases the beautiful color transformations as your tea steeps, turning each brewing session into a visual meditation. The set includes everything needed for a traditional ceremony: a stunning glass teapot with auto-pour technology, elegant tea canister for storage, the complete Tea Ceremony 6 Gentleman tools (tea scoop, needle, funnel, tweezers, presentation vessel, and tea cloth), a tea wash basin, bamboo tea tray with drainage, and a graceful cup tree for displaying your teacups. Perfect for entertaining guests, daily meditation practice, or creating a dedicated tea space in your living room, office, or reception area. Makes an exceptional gift for tea connoisseurs and those who appreciate the mindful art of tea ceremony.",
    specifications: {
      "Set Includes": "15 pieces complete ceremony set",
      "Teapot": "Magnetic rotating Gaiwan, 500ml",
      "Material": "Premium borosilicate glass + bamboo",
      "6 Gentleman Tools": "Complete traditional set",
      "Tea Tray": "Bamboo with water drainage",
      "Accessories": "Tea wash, canister, cup tree",
      "Cups": "6 glass cups (60ml each)",
      "Special Feature": "Auto deer glass teapot design",
      "Gift Ready": "Elegant packaging included"
    },
    rating: 5.0,
  reviews: 94,
detailedReviews: [
  {
    name: "Michelle Z.",
    rating: 5,
    date: "1 week ago",
    comment: "This 15-piece set is INCREDIBLE! The magnetic water diversion is so elegant. Every tool is premium quality. Hosting tea ceremonies is now my favorite ritual! 🍵",
    verified: true
  },
  {
    name: "Robert K.",
    rating: 5,
    date: "2 weeks ago",
    comment: "As a tea enthusiast, this exceeded all expectations! The 6 Gentleman tools are beautifully crafted. Bamboo tray with drainage is genius. Professional quality!",
    verified: true
  },
  {
    name: "Yuki T.",
    rating: 5,
    date: "1 month ago",
    comment: "Authentic Gongfu tea experience! Glass construction lets you appreciate the tea's color. Everything included - even storage canister. Perfect gift!",
    verified: true
  }
],
features: ["Complete 15-Piece Set", "Magnetic System", "Premium Glass"],
    inStock: true,
    badge: "Premium",
    shippingInfo: "Free shipping • Delivery in 30 days"
  },
  {
  id: 6,
  name: "Magnetic Deer Tea Brewing Set",
  category: "tea",
  price: 99.99,
  originalPrice: 159.99,
  image: "/images/camel-tea-set-main.png",
  relatedProducts: [4, 5, 1],
 media: [
  { type: "image", url: "/images/camel-tea-set-main.png" },
  { type: "video", url: "https://sbupwhgzlrpiccvipeox.supabase.co/storage/v1/object/public/gfsh/download%20(1).mp4" },
  { type: "image", url: "/images/camel-tea-set-colors.png" },
  { type: "image", url: "/images/camel-tea-set-detail.png" },
  { type: "image", url: "/images/camel-tea-set-lifestyle.png" }
],
  description: "Elegant deer-shaped magnetic tea brewing system with heat-resistant glass",
  longDescription: "Experience the artistry of tea brewing with our Magnetic Deer Tea Set. This stunning piece combines traditional Middle Eastern aesthetics with modern magnetic brewing technology. The beautifully crafted deer figurine (available in turquoise) holds a high borosilicate heat-resistant glass teapot that brews your tea to perfection. The magnetic drip system ensures smooth, controlled pouring while the elegant design makes it a conversation piece. Perfect for tea ceremonies or as a decorative statement piece. The set includes the deer base, glass teapot with lid, and a serving pitcher. Available in 350ml capacity.",
  specifications: {
    "Material": "High Borosilicate Glass + Resin",
    "Design": "Deer figurine with magnetic tea brewing",
    "Capacity": "300ml or 350ml",
    "Colors Available": "Turquoise",
    "Heat Resistant": "Up to 150°C",
    "Dishwasher Safe": "Hand wash recommended",
    "Dimensions": "8\" x 6\" x 9\"",
    "Weight": "850g"
  },
  rating: 4.7,
  reviews: 89,
  detailedReviews: [
    {
      name: "Sarah L.",
      rating: 5,
      date: "1 week ago",
      comment: "Absolutely stunning! The turquoise deer is gorgeous and the magnetic brewing works perfectly. Guests are always amazed!",
      verified: true
    },
    {
      name: "Michael T.",
      rating: 5,
      date: "2 weeks ago",
      comment: "Beautiful craftsmanship. The glass quality is excellent and it brews tea wonderfully. Worth every penny!",
      verified: true
    },
    {
      name: "Emma K.",
      rating: 4,
      date: "1 month ago",
      comment: "Love the unique design! It's both functional and decorative. Slightly fragile so handle with care.",
      verified: true
    }
  ],
  features: ["Magnetic Brewing", "Heat Resistant Glass"],
  inStock: true,
  badge: "New",
  shippingInfo: "Free shipping • Delivery in 30 days"
}
];
// ============================================
// NOTIFICATION COMPONENT
// ============================================
const Notification = ({ notification }) => {
  if (!notification) return null;
  
  return (
    <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
      <div className={`rounded-2xl shadow-2xl p-4 flex items-center gap-3 backdrop-blur-lg ${
        notification.type === 'success' 
          ? 'bg-gradient-to-r from-amber-500 to-yellow-500' 
          : notification.type === 'info'
          ? 'bg-gradient-to-r from-gray-700 to-gray-900'
          : 'bg-gradient-to-r from-red-500 to-pink-500'
      } text-white min-w-[300px] border border-white/20`}>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <span className="font-medium">{notification.message}</span>
      </div>
    </div>
  );
};

// ============================================
// HEADER COMPONENT
// ============================================
const Header = ({
  isScrolled,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  wishlist,
  cartCount,
  menuOpen,
  setMenuOpen
}) => {
  const navigate = useNavigate();

  return (
  <>
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/98 backdrop-blur-lg shadow-lg' : 'bg-white'
      } border-b border-gray-100`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <button
              onClick={() => {
                navigate('/');
                setSelectedCategory('all');
              }}
              className="group flex items-center gap-3"
            >
              <img
                src="/logo.png"
                alt="Serenity Home Logo"
                className="h-28 w-auto group-hover:scale-105 transition-transform"
              />
              <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent group-hover:scale-105 transition-transform hidden md:block">
                Serenity Home
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
              <button
                onClick={() => {
                  navigate('/shop');
                  setSelectedCategory('all');
                }}
                className="text-gray-600 hover:text-amber-600 transition font-medium relative group"
              >
                All Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all"></span>
              </button>

              <button
                onClick={() => {
                  navigate('/shop');
                  setSelectedCategory('tea');
                }}
                className="text-gray-600 hover:text-amber-600 transition font-medium relative group"
              >
                Tea Essentials
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all"></span>
              </button>

              <button
                onClick={() => {
                  navigate('/shop');
                  setSelectedCategory('ambiance');
                }}
                className="text-gray-600 hover:text-amber-600 transition font-medium relative group"
              >
                Aromatherapy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all"></span>
              </button>

              <button
                onClick={() => navigate('/blog')}
                className="text-gray-600 hover:text-amber-600 transition font-medium relative group"
              >
                Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all"></span>
              </button>

              <button
                onClick={() => navigate('/about')}
                className="text-gray-600 hover:text-amber-600 transition font-medium relative group"
              >
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all"></span>
              </button>
            </nav>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-gray-50 rounded-full px-4 py-2 hover:bg-amber-50 transition border border-gray-100">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-48"
              />
            </div>

            <button
              onClick={() => navigate('/favorites')}
              className="relative p-3 hover:bg-amber-50 rounded-full transition-all duration-300 group"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  wishlist.length > 0
                    ? 'text-red-500 fill-red-500'
                    : 'text-gray-600 group-hover:text-amber-600'
                }`}
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/cart')}
              className="relative p-3 hover:bg-amber-50 rounded-full transition-all duration-300 group"
            >
              <ShoppingCart
                className={`w-5 h-5 transition-colors ${
                  cartCount > 0
                    ? 'text-amber-600'
                    : 'text-gray-600 group-hover:text-amber-600'
                }`}
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-600 to-yellow-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Menu */}
    {menuOpen && (
      <div className="md:hidden border-t border-gray-100 bg-white animate-slide-down">
        <div className="p-4 border-b border-gray-100">
          <img
            src="/logo.png"
            alt="Serenity Home"
            className="h-8 w-auto mx-auto"
          />
        </div>
        <nav className="flex flex-col p-4 gap-2">
          <button
            onClick={() => {
              navigate('/shop');
              setSelectedCategory('all');
              setMenuOpen(false);
            }}
            className="text-left py-3 px-4 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
          >
            All Products
          </button>

          <button
            onClick={() => {
              navigate('/shop');
              setSelectedCategory('tea');
              setMenuOpen(false);
            }}
            className="text-left py-3 px-4 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
          >
            Tea Essentials
          </button>

          <button
            onClick={() => {
              navigate('/shop');
              setSelectedCategory('ambiance');
              setMenuOpen(false);
            }}
            className="text-left py-3 px-4 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
          >
            Aromatherapy
          </button>

          <button
            onClick={() => {
              navigate('/blog');
              setMenuOpen(false);
            }}
            className="text-left py-3 px-4 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
          >
            Blog
          </button>

          <button
            onClick={() => {
              navigate('/about');
              setMenuOpen(false);
            }}
            className="text-left py-3 px-4 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
          >
            About Us
          </button>
        </nav>
      </div>
    )}
  </>
  );
};

// ============================================
// PRODUCT CARD COMPONENT
// ============================================
const ProductCard = ({ product, addToCart, toggleWishlist, wishlist, setSelectedProduct, setCurrentView }) => {
  const navigate = useNavigate();

  return (
  <div
    onClick={() => { setSelectedProduct(product); navigate(`/product/${product.id}`); }}
    className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-3xl transition-all duration-500 group transform hover:-translate-y-3 border border-gray-100 cursor-pointer"
  >
    <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-50 to-amber-50/20">
      {product.badge && (
        <div className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${
          product.badge === 'Bestseller' ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
          product.badge === 'New' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
          product.badge === 'Hot' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
          'bg-gradient-to-r from-amber-600 to-yellow-600'
        }`}>
          {product.badge}
        </div>
      )}
      <img
        src={product.image}
        alt={product.name}
        width="400"
        height="400"
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <button 
  onClick={(e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  }}
  className="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-10"
>
        <Heart 
          className={`w-5 h-5 transition-all duration-300 ${
            wishlist.includes(product.id) 
              ? 'fill-red-500 text-red-500 scale-110' 
              : 'text-gray-600 hover:text-red-400'
          }`}
        />
      </button>
      {!product.inStock && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
          <span className="bg-white px-8 py-4 rounded-full font-bold text-xl shadow-2xl">Out of Stock</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
  onClick={(e) => {
    e.stopPropagation();
    addToCart(product);
  }}
  disabled={!product.inStock}
  className="w-full bg-white text-gray-900 py-4 rounded-full font-bold hover:bg-amber-50 transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-2xl text-lg"
>
          {product.inStock ? '✨ Quick Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-yellow-100 px-3 py-1.5 rounded-full border border-amber-200">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span className="text-sm font-bold text-amber-900">{product.rating}</span>
        </div>
        <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
      </div>
      <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-amber-700 transition-colors">
  {product.name}
</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {product.features.map((feature, idx) => (
          <span key={feature} className={`text-xs px-3 py-1.5 rounded-full font-medium border ${
            idx === 0 ? 'bg-amber-50 border-amber-200 text-amber-800' :
            idx === 1 ? 'bg-gray-50 border-gray-200 text-gray-700' :
            'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}>
            {feature}
          </span>
        ))}
      </div>
      {/* Shipping Info */}
<div className="mb-4 flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
  <Truck className="w-4 h-4" />
  <span className="font-medium">{product.shippingInfo}</span>
</div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          {product.originalPrice && (
            <div className="text-sm text-gray-400 line-through mb-1">
              €{product.originalPrice}
            </div>
          )}
          <div>
            <span className="text-3xl font-bold text-gray-900">
              €{product.price}
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-sm font-bold text-green-600">
                Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>
        </div>
        <button 
  onClick={(e) => {
    e.stopPropagation();
    addToCart(product);
  }}
  disabled={!product.inStock}
  className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed font-bold"
>
          {product.inStock ? 'Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </div>
  </div>
  );
};

// ============================================
// HOMEPAGE COMPONENT
// ============================================
const HomePage = ({
  setCurrentView,
  setSelectedCategory,
  products,
  ProductCard,
  cartCount,
  newsletterEmail,
  setNewsletterEmail,
  handleNewsletterSignup,
  newsletterLoading
}) => {
  const navigate = useNavigate();

  return (
  <div className="pt-20">
    {/* Hero Section */}
    <section className="relative min-h-[700px] bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/20 flex items-center overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Promotional Banner */}
      {cartCount === 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce">
            <span className="font-bold">🎉 Special Offer: Buy 2 Save 10% | Buy 3 Save 15%!</span>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg border border-amber-100">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">
              Free Shipping on Orders $50+
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Elevate Your
            <span className="block bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
              Daily Rituals
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed">
            Premium wellness products for mindful living. Transform your space into a sanctuary of calm and comfort with our curated collection.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/shop')}
              className="group bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
            >
              Shop Collection
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-gray-200"
            >
              Explore Products
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 right-10 animate-float hidden lg:block">
        <div className="bg-white p-6 rounded-2xl shadow-2xl backdrop-blur-sm border border-amber-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-2xl text-gray-900">5.0★</div>
              <div className="text-sm text-gray-600">637+ Reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Categories */}
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl font-bold mb-4 text-gray-900">Shop by Category</h2>
          <p className="text-xl text-gray-600">Discover your perfect wellness companion</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <button
            onClick={() => { navigate('/shop'); setSelectedCategory('tea'); }}
            className="group relative h-[500px] rounded-3xl overflow-hidden shadow-xl hover:shadow-3xl transition-all duration-500"
          >
            <img
              src="/images/tea-ceremony-set-full.png"
              alt="Tea Ceremony"
              width="800"
              height="500"
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-10">
              <div className="text-white transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                <h3 className="text-4xl font-bold mb-3">Tea Ceremony Essentials</h3>
                <p className="text-white/90 text-lg mb-4">Artisan tea makers and traditional sets</p>
                <span className="inline-flex items-center gap-2 text-amber-300 font-semibold">
                  Shop Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </button>

          <button
            onClick={() => { navigate('/shop'); setSelectedCategory('ambiance'); }}
            className="group relative h-[500px] rounded-3xl overflow-hidden shadow-xl hover:shadow-3xl transition-all duration-500"
          >
            <img
              src="/images/flame-diffuser-main.png"
              alt="Aromatherapy"
              width="800"
              height="500"
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-10">
              <div className="text-white transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                <h3 className="text-4xl font-bold mb-3">Aromatherapy & Ambiance</h3>
                <p className="text-white/90 text-lg mb-4">Diffusers and atmosphere creators</p>
                <span className="inline-flex items-center gap-2 text-amber-300 font-semibold">
                  Shop Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>

    {/* Featured Products */}
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 rounded-full mb-4 border border-amber-200">
            <Sparkles className="w-5 h-5 text-amber-700" />
            <span className="font-semibold text-amber-900">Bestsellers</span>
          </div>
          <h2 className="text-5xl font-bold mb-4 text-gray-900">Customer Favorites</h2>
          <p className="text-xl text-gray-600">Products our customers can't stop raving about</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product, index) => (
            <div key={product.id} className="animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <button
            onClick={() => navigate('/shop')}
            className="group border-2 border-gray-900 text-gray-900 px-10 py-4 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 text-lg font-semibold inline-flex items-center gap-2"
          >
            View All Products
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>

    {/* Trust Badges */}
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center group hover:scale-110 transition-transform duration-300 cursor-pointer">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl mb-4 group-hover:shadow-xl transition-all duration-300 border border-amber-200">
              <Star className="w-10 h-10 text-amber-600 fill-amber-600" />
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2">5.0★</div>
            <div className="text-gray-700 font-medium">Average Rating</div>
          </div>
          <div className="text-center group hover:scale-110 transition-transform duration-300 cursor-pointer">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-4 group-hover:shadow-xl transition-all duration-300 border border-gray-300">
              <Shield className="w-10 h-10 text-gray-700" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">637+</div>
            <div className="text-gray-700 font-medium">Happy Customers</div>
          </div>
          <div className="text-center group hover:scale-110 transition-transform duration-300 cursor-pointer">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-4 group-hover:shadow-xl transition-all duration-300 border border-green-200">
              <Truck className="w-10 h-10 text-green-700" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">Free</div>
            <div className="text-gray-700 font-medium">Shipping $50+</div>
          </div>
          <div className="text-center group hover:scale-110 transition-transform duration-300 cursor-pointer">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl mb-4 group-hover:shadow-xl transition-all duration-300 border border-amber-200">
              <Package className="w-10 h-10 text-amber-700" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">30</div>
            <div className="text-gray-700 font-medium">Day Returns</div>
          </div>
        </div>
      </div>
    </section>

    {/* Newsletter Section */}
    <section className="py-20 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTh2LTRoLTh2NGg4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <img
          src="/logo.png"
          alt="Serenity Home"
          width="224"
          height="224"
          loading="lazy"
          className="h-56 w-auto mx-auto mb-6 drop-shadow-2xl"
        />
        <h2 className="text-4xl font-bold text-white mb-4">Join Our Wellness Community</h2>
        <p className="text-xl text-white/95 mb-8">Get exclusive offers, wellness tips, and be the first to know about new arrivals</p>
        <div className="flex gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleNewsletterSignup(newsletterEmail)}
            disabled={newsletterLoading}
            className="flex-1 px-6 py-4 rounded-full text-gray-900 outline-none focus:ring-4 focus:ring-white/30 transition border-2 border-white/20 disabled:opacity-50"
          />
          <button 
            onClick={() => handleNewsletterSignup(newsletterEmail)}
            disabled={newsletterLoading}
            className="bg-white text-amber-700 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {newsletterLoading ? '...' : 'Subscribe'}
          </button>
        </div>
      </div>
    </section>
  </div>
  );
};

// ============================================
// SHOP PAGE COMPONENT
// ============================================
const ShopPage = ({ selectedCategory, filteredProducts, searchQuery, setSearchQuery, ProductCard }) => (
  <div className="pt-32 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 animate-fade-in-up">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          {selectedCategory === 'all' ? 'All Products' : 
           selectedCategory === 'tea' ? 'Tea Ceremony Essentials' : 
           'Aromatherapy & Ambiance'}
        </h1>
        <p className="text-xl text-gray-600">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-block p-8 bg-gradient-to-br from-gray-100 to-amber-50 rounded-full mb-6 border border-amber-200">
            <Search className="w-16 h-16 text-amber-600" />
          </div>
          <p className="text-gray-600 text-xl mb-4">No products found matching your search.</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="text-amber-600 hover:text-amber-700 font-semibold"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// ============================================
// FOOTER COMPONENT
// ============================================
const Footer = ({
  setCurrentView,
  setSelectedCategory,
  newsletterEmail,
  setNewsletterEmail,
  handleNewsletterSignup,
  newsletterLoading
}) => {
  const navigate = useNavigate();

  return (
  <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-16 border-t-4 border-amber-500">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/logo.png"
              alt="Serenity Home Logo"
              width="80"
              height="80"
              loading="lazy"
              className="h-20 w-auto"
            />
            <h3 className="font-bold text-xl bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              Serenity Home
            </h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Premium wellness products for mindful living and peaceful spaces. Transform your daily rituals.
          </p>
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 rounded-full transition flex items-center justify-center shadow-lg">
              <span className="text-lg">📘</span>
            </button>
            <button className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 rounded-full transition flex items-center justify-center shadow-lg">
              <span className="text-lg">📷</span>
            </button>
            <button className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 rounded-full transition flex items-center justify-center shadow-lg">
              <span className="text-lg">🐦</span>
            </button>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4 text-amber-300">Shop</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><button onClick={() => { navigate('/shop'); setSelectedCategory('all'); }} className="hover:text-amber-400 transition">All Products</button></li>
            <li><button onClick={() => { navigate('/shop'); setSelectedCategory('tea'); }} className="hover:text-amber-400 transition">Tea Essentials</button></li>
            <li><button onClick={() => { navigate('/shop'); setSelectedCategory('ambiance'); }} className="hover:text-amber-400 transition">Aromatherapy</button></li>
            <li><a href="#" className="hover:text-amber-400 transition">New Arrivals</a></li>
          </ul>
        </div>
        <div>
  <h4 className="font-bold text-lg mb-4 text-amber-300">Support</h4>
  <ul className="space-y-3 text-gray-400 text-sm">
    <li><button onClick={() => navigate('/contact')} className="hover:text-amber-400 transition">Contact Us</button></li>
    <li><button onClick={() => navigate('/about')} className="hover:text-amber-400 transition">About Us</button></li>
    <li><a href="#" className="hover:text-amber-400 transition">Shipping Info</a></li>
    <li><a href="#" className="hover:text-amber-400 transition">Returns & Exchanges</a></li>
    <li><button onClick={() => navigate('/faq')} className="hover:text-amber-400 transition">FAQ</button></li>
  </ul>
</div>
        <div>
          <h4 className="font-bold text-lg mb-4 text-amber-300">Newsletter</h4>
          <p className="text-gray-400 text-sm mb-4">Get wellness tips and exclusive offers</p>
          <input 
            type="email" 
            placeholder="Your email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleNewsletterSignup(newsletterEmail)}
            disabled={newsletterLoading}
            className="w-full bg-white/10 text-white px-4 py-3 rounded-full text-sm mb-3 outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-500 transition border border-white/10 disabled:opacity-50"
          />
          <button 
            onClick={() => handleNewsletterSignup(newsletterEmail)}
            disabled={newsletterLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-full text-sm font-bold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
          >
            {newsletterLoading ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
        <p>© 2025 Serenity Home. All rights reserved. Made with ❤️ for wellness enthusiasts.</p>
        <div className="flex gap-6">
          <button onClick={() => navigate('/privacy')} className="hover:text-amber-400 transition">Privacy Policy</button>
          <button onClick={() => navigate('/terms')} className="hover:text-amber-400 transition">Terms of Service</button>
        </div>
      </div>
    </div>
  </footer>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
const [selectedBlogPost, setSelectedBlogPost] = useState(null);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Scroll to top when view changes
useEffect(() => {
  window.scrollTo(0, 0);
}, [currentView, selectedProduct]);

const clearCart = () => {
  setCart([]);
  localStorage.removeItem('cart');
  showNotification('Cart cleared successfully', 'info');
};

  
  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const addToCart = (product, qty = 1) => {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    setCart(cart.map(item => 
      item.id === product.id ? {...item, quantity: item.quantity + qty} : item
    ));
    if (qty > 1) {
      showNotification(`Added ${qty} more ${product.name} to cart! 🎉`);
    } else {
      showNotification(`Added another ${product.name} to cart! 🎉`);
    }
  } else {
    setCart([...cart, {...product, quantity: qty}]);
    if (qty > 1) {
      showNotification(`${qty}x ${product.name} added to cart! ✨`);
    } else {
      showNotification(`${product.name} added to cart! ✨`);
    }
  }
};

  const handleNewsletterSignup = async (email) => {
    if (!email || !email.includes('@')) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    setNewsletterLoading(true);
    
    const result = await subscribeToNewsletter(email);
    
    setNewsletterLoading(false);
    
    if (result.success) {
      showNotification(result.message, 'success');
      setNewsletterEmail('');
    } else {
      showNotification(result.message, 'info');
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    showNotification('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? {...item, quantity: newQuantity} : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      showNotification('Removed from wishlist', 'info');
    } else {
      setWishlist([...wishlist, productId]);
      showNotification('Added to wishlist! ❤️');
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Promotional discount logic
  const getPromotionalDiscount = () => {
    if (cartCount >= 3) return 0.15; // 15% off for 3+ items
    if (cartCount >= 2) return 0.10; // 10% off for 2+ items
    return 0;
  };

  const promotionalDiscount = getPromotionalDiscount();
  const discountAmount = cartSubtotal * promotionalDiscount;
  const cartTotal = cartSubtotal - discountAmount;

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Create ProductCard with all necessary props
  const ProductCardWithProps = (props) => (
    <ProductCard 
      {...props}
      addToCart={addToCart}
      toggleWishlist={toggleWishlist}
      wishlist={wishlist}
      setSelectedProduct={setSelectedProduct}
      setCurrentView={setCurrentView}
    />
  );

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
      `}</style>


      <Notification notification={notification} />
      <CookieConsent />

      <Header
        isScrolled={isScrolled}
        setCurrentView={setCurrentView}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        wishlist={wishlist}
        cartCount={cartCount}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <ScrollToTop />

      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      }>
        <Routes>
        <Route path="/" element={
          <HomePage
            setCurrentView={setCurrentView}
            setSelectedCategory={setSelectedCategory}
            products={products}
            ProductCard={ProductCardWithProps}
            cartCount={cartCount}
            newsletterEmail={newsletterEmail}
            setNewsletterEmail={setNewsletterEmail}
            handleNewsletterSignup={handleNewsletterSignup}
            newsletterLoading={newsletterLoading}
          />
        } />

        <Route path="/favorites" element={
          <Favorites
            wishlist={wishlist}
            products={products}
            toggleWishlist={toggleWishlist}
            addToCart={addToCart}
            setSelectedProduct={setSelectedProduct}
            setCurrentView={setCurrentView}
          />
        } />

        <Route path="/shop" element={
          <ShopPage
            selectedCategory={selectedCategory}
            filteredProducts={filteredProducts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            ProductCard={ProductCardWithProps}
          />
        } />

        <Route path="/cart" element={
          <Cart
            cart={cart}
            cartCount={cartCount}
            cartSubtotal={cartSubtotal}
            promotionalDiscount={promotionalDiscount}
            discountAmount={discountAmount}
            cartTotal={cartTotal}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            setCurrentView={setCurrentView}
            products={products}
            addToCart={addToCart}
            setSelectedProduct={setSelectedProduct}
          />
        } />

        <Route path="/checkout" element={
          <Checkout
            cart={cart}
            cartSubtotal={cartSubtotal}
            discountAmount={discountAmount}
            cartTotal={cartTotal}
            setCurrentView={setCurrentView}
            clearCart={clearCart}
          />
        } />

        <Route path="/blog" element={
          <Blog
            setCurrentView={setCurrentView}
            setSelectedBlogPost={setSelectedBlogPost}
          />
        } />

        <Route path="/blog/:slug" element={
          <BlogPost
            blogPosts={blogPosts}
            setCurrentView={setCurrentView}
            setSelectedProduct={setSelectedProduct}
            products={products}
          />
        } />

        <Route path="/product/:id" element={
          <ProductPage
            product={selectedProduct}
            products={products}
            addToCart={addToCart}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            setCurrentView={setCurrentView}
            setSelectedProduct={setSelectedProduct}
          />
        } />

        <Route path="/faq" element={<FAQ setCurrentView={setCurrentView} />} />
        <Route path="/privacy" element={<PrivacyPolicy setCurrentView={setCurrentView} />} />
        <Route path="/terms" element={<TermsOfService setCurrentView={setCurrentView} />} />
        <Route path="/about" element={<AboutUs setCurrentView={setCurrentView} />} />
        <Route path="/contact" element={<ContactUs setCurrentView={setCurrentView} />} />
        </Routes>
      </Suspense>
      
      <Footer
        setCurrentView={setCurrentView}
        setSelectedCategory={setSelectedCategory}
        newsletterEmail={newsletterEmail}
        setNewsletterEmail={setNewsletterEmail}
        handleNewsletterSignup={handleNewsletterSignup}
        newsletterLoading={newsletterLoading}
      />
      {/* ADD THIS - AI Chat Assistant */}
      <AIChatAssistant />

    </div>
  );
}

export default App;