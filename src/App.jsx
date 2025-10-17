import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Heart, Star, ChevronRight, Sparkles, Shield, Truck, Package, Zap, Award, Clock } from 'lucide-react';

// Product Data - Replace images with your actual product images later
const products = [
  {
    id: 1,
    name: "Modern Tea Infusion Station",
    category: "tea",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80",
    description: "Elegant dual-chamber tea maker with precise temperature control",
    rating: 4.8,
    reviews: 124,
    features: ["Temperature Control", "Glass Design", "Easy Clean"],
    inStock: true,
    badge: "Bestseller"
  },
  {
    id: 2,
    name: "Ambient Flame Electric Fireplace",
    category: "ambiance",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    description: "Create cozy warmth with realistic 3D flame effects and heating",
    rating: 4.9,
    reviews: 89,
    features: ["Realistic Flames", "Heat Function", "Remote Control"],
    inStock: true,
    badge: "Hot"
  },
  {
    id: 3,
    name: "Floral Dream Aroma Diffuser",
    category: "ambiance",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
    description: "Whisper-quiet diffuser with enchanting LED flower display",
    rating: 4.7,
    reviews: 201,
    features: ["Silent Operation", "LED Display", "Auto Shut-off"],
    inStock: true,
    badge: "New"
  },
  {
    id: 4,
    name: "Midnight Mist Humidifier",
    category: "ambiance",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
    description: "Compact ultrasonic humidifier with ambient night lighting",
    rating: 4.6,
    reviews: 156,
    features: ["Ultrasonic Tech", "Night Light", "Whisper Quiet"],
    inStock: true
  },
  {
    id: 5,
    name: "Dragon's Wisdom Tea Ceremony Set",
    category: "tea",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80",
    description: "Exquisite handcrafted dragon tea set with traditional brewing station",
    rating: 5.0,
    reviews: 67,
    features: ["Handcrafted", "Complete Set", "Premium Glass"],
    inStock: true,
    badge: "Premium"
  }
];

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? {...item, quantity: item.quantity + 1} : item
      ));
      showNotification(`Added another ${product.name} to cart! 🎉`);
    } else {
      setCart([...cart, {...product, quantity: 1}]);
      showNotification(`${product.name} added to cart! ✨`);
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

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Notification Component
  const Notification = () => {
    if (!notification) return null;
    
    return (
      <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
        <div className={`rounded-2xl shadow-2xl p-4 flex items-center gap-3 backdrop-blur-lg ${
          notification.type === 'success' 
            ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
            : notification.type === 'info'
            ? 'bg-gradient-to-r from-sky-600 to-blue-600'
            : 'bg-gradient-to-r from-red-500 to-orange-600'
        } text-white min-w-[300px]`}>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-medium">{notification.message}</span>
        </div>
      </div>
    );
  };

  // Navigation Header
  const Header = () => (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-amber-500/10' : 'bg-slate-900'
    } border-b border-amber-500/20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => { setCurrentView('home'); setSelectedCategory('all'); }}
              className="group flex items-center gap-2"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                ✨ Serenity Home
              </div>
            </button>
            <nav className="hidden md:flex gap-6">
              <button 
                onClick={() => { setCurrentView('shop'); setSelectedCategory('all'); }} 
                className="text-slate-300 hover:text-amber-400 transition font-medium relative group"
              >
                All Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 group-hover:w-full transition-all"></span>
              </button>
              <button 
                onClick={() => { setCurrentView('shop'); setSelectedCategory('tea'); }} 
                className="text-slate-300 hover:text-amber-400 transition font-medium relative group"
              >
                Tea Essentials
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 group-hover:w-full transition-all"></span>
              </button>
              <button 
                onClick={() => { setCurrentView('shop'); setSelectedCategory('ambiance'); }} 
                className="text-slate-300 hover:text-amber-400 transition font-medium relative group"
              >
                Aromatherapy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 group-hover:w-full transition-all"></span>
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-slate-800/50 border border-amber-500/20 rounded-full px-4 py-2 hover:bg-slate-800 transition">
              <Search className="w-4 h-4 text-amber-400 mr-2" />
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-48 text-slate-200 placeholder-slate-400"
              />
            </div>
            <button className="relative p-3 hover:bg-amber-500/10 rounded-full transition-all duration-300 group">
              <Heart className={`w-5 h-5 transition-colors ${
                wishlist.length > 0 ? 'text-orange-400 fill-orange-400' : 'text-slate-300 group-hover:text-amber-400'
              }`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setCurrentView('cart')}
              className="relative p-3 hover:bg-amber-500/10 rounded-full transition-all duration-300 group"
            >
              <ShoppingCart className={`w-5 h-5 transition-colors ${
                cartCount > 0 ? 'text-amber-400' : 'text-slate-300 group-hover:text-amber-400'
              }`} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg shadow-amber-500/50">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden p-2 text-slate-300 hover:text-amber-400" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {menuOpen && (
        <div className="md:hidden border-t border-amber-500/20 bg-slate-900 animate-slide-down">
          <nav className="flex flex-col p-4 gap-2">
            <button 
              onClick={() => { setCurrentView('shop'); setSelectedCategory('all'); setMenuOpen(false); }} 
              className="text-left py-3 px-4 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition"
            >
              All Products
            </button>
            <button 
              onClick={() => { setCurrentView('shop'); setSelectedCategory('tea'); setMenuOpen(false); }} 
              className="text-left py-3 px-4 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition"
            >
              Tea Essentials
            </button>
            <button 
              onClick={() => { setCurrentView('shop'); setSelectedCategory('ambiance'); setMenuOpen(false); }} 
              className="text-left py-3 px-4 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition"
            >
              Aromatherapy
            </button>
          </nav>
        </div>
      )}
    </header>
  );

  // Homepage Hero
  const HomePage = () => (
    <div className="pt-20 bg-slate-950">
      {/* Hero Section with Stars */}
      <section className="relative min-h-[700px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex items-center overflow-hidden">
        {/* Animated stars background */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-400 rounded-full animate-twinkle"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-orange-300 rounded-full animate-twinkle animation-delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-amber-300 rounded-full animate-twinkle animation-delay-2000"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-orange-400 rounded-full animate-twinkle animation-delay-1500"></div>
          <div className="absolute bottom-1/3 right-1/5 w-1 h-1 bg-amber-200 rounded-full animate-twinkle animation-delay-500"></div>
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-amber-500 rounded-full mix-blend-screen filter blur-3xl animate-blob-slow"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-3xl animate-blob-slow animation-delay-3000"></div>
          <div className="absolute -bottom-20 left-40 w-96 h-96 bg-blue-900 rounded-full mix-blend-screen filter blur-3xl animate-blob-slow animation-delay-5000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 backdrop-blur-sm border border-amber-500/30 px-4 py-2 rounded-full mb-6 shadow-lg shadow-amber-500/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-amber-300">Free Shipping on Orders $50+</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Elevate Your
              <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                Daily Rituals
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Premium wellness products for mindful living. Transform your space into a sanctuary of calm and comfort with our curated collection.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setCurrentView('shop')}
                className="group bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                Shop Collection 
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setCurrentView('shop')}
                className="bg-slate-800/50 border-2 border-amber-500/50 text-amber-300 px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-800 hover:border-amber-400 hover:scale-105 transition-all duration-300"
              >
                Explore Products
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating badge */}
        <div className="absolute bottom-10 right-10 animate-float hidden lg:block">
          <div className="bg-slate-800/80 backdrop-blur-lg border border-amber-500/30 p-6 rounded-2xl shadow-2xl shadow-amber-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Award className="w-7 h-7 text-slate-900" />
              </div>
              <div>
                <div className="font-bold text-2xl text-amber-400">5.0★</div>
                <div className="text-sm text-slate-400">637+ Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <p className="text-xl text-slate-400">Discover your perfect wellness companion</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <button 
              onClick={() => { setCurrentView('shop'); setSelectedCategory('tea'); }}
              className="group relative h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/30 transition-all duration-500 border border-amber-500/20"
            >
              <img 
                src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80" 
                alt="Tea Ceremony"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent flex items-end p-10">
                <div className="text-white transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                  <h3 className="text-4xl font-bold mb-3 text-amber-300">Tea Ceremony Essentials</h3>
                  <p className="text-slate-300 text-lg mb-4">Artisan tea makers and traditional sets</p>
                  <span className="inline-flex items-center gap-2 text-amber-400 font-semibold">
                    Shop Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => { setCurrentView('shop'); setSelectedCategory('ambiance'); }}
              className="group relative h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/10 hover:shadow-orange-500/30 transition-all duration-500 border border-amber-500/20"
            >
              <img 
                src="https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80" 
                alt="Aromatherapy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent flex items-end p-10">
                <div className="text-white transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                  <h3 className="text-4xl font-bold mb-3 text-amber-300">Aromatherapy & Ambiance</h3>
                  <p className="text-slate-300 text-lg mb-4">Diffusers and atmosphere creators</p>
                  <span className="inline-flex items-center gap-2 text-amber-400 font-semibold">
                    Shop Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="font-semibold text-amber-400">Bestsellers</span>
            </div>
            <h2 className="text-5xl font-bold mb-4 text-white">
              Customer Favorites
            </h2>
            <p className="text-xl text-slate-400">Products our customers can't stop raving about</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-16">
            <button 
              onClick={() => setCurrentView('shop')}
              className="group border-2 border-amber-500 text-amber-400 px-10 py-4 rounded-full hover:bg-amber-500 hover:text-slate-900 transition-all duration-300 text-lg font-semibold inline-flex items-center gap-2"
            >
              View All Products
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 bg-slate-950 border-y border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-110 transition-transform duration-300 cursor-pointer">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl mb-4 group-hover:shadow-xl group-hover:shadow-amber-500/30 transition-all duration-300">
                <Star className="w-10 h-10 text-amber-400 fill-amber-400" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">5.0★</div>
              <div className="text-slate-400 font-medium">Average Rating</div>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300 cursor-pointer">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-sky-500/20 border border-blue-500/30 rounded-2xl mb-4 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all duration-300">
                <Shield className="w-10 h-10 text-sky-400" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent mb-2">637+</div>
              <div className="text-slate-400 font-medium">Happy Customers</div>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300 cursor-pointer">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-2xl mb-4 group-hover:shadow-xl group-hover:shadow-orange-500/30 transition-all duration-300">
                <Truck className="w-10 h-10 text-orange-400" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2">Free</div>
              <div className="text-slate-400 font-medium">Shipping $50+</div>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300 cursor-pointer">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl mb-4 group-hover:shadow-xl group-hover:shadow-amber-500/30 transition-all duration-300">
                <Package className="w-10 h-10 text-amber-400" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">30</div>
              <div className="text-slate-400 font-medium">Day Returns</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-y border-amber-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">Join Our Wellness Community ✨</h2>
            <p className="text-xl text-slate-300 mb-8">Get exclusive offers, wellness tips, and be the first to know about new arrivals</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-slate-800/50 border border-amber-500/30 text-slate-200 placeholder-slate-500 outline-none focus:ring-2 focus:ring-amber-500/50 transition"
              />
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl shadow-amber-500/30">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  // Product Card Component
  const ProductCard = ({ product }) => (
    <div className="bg-slate-900 border border-amber-500/20 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 group transform hover:-translate-y-3">
      <div className="relative h-80 overflow-hidden bg-slate-800">
        {product.badge && (
          <div className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-full text-sm font-bold text-slate-900 shadow-lg ${
            product.badge === 'Bestseller' ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
            product.badge === 'New' ? 'bg-gradient-to-r from-sky-400 to-blue-400' :
            product.badge === 'Hot' ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
            'bg-gradient-to-r from-amber-300 to-orange-300'
          }`}>
            {product.badge}
          </div>
        )}
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <button 
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-4 right-4 p-3 bg-slate-900/80 backdrop-blur-sm border border-amber-500/30 rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-10"
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-300 ${
              wishlist.includes(product.id) 
                ? 'fill-orange-400 text-orange-400 scale-110' 
                : 'text-slate-300 hover:text-amber-400'
            }`}
          />
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-slate-800 border border-amber-500/30 px-8 py-4 rounded-full font-bold text-xl shadow-2xl text-slate-300">Out of Stock</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 py-4 rounded-full font-bold hover:shadow-xl hover:shadow-amber-500/50 transition disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-lg"
          >
            {product.inStock ? '✨ Quick Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-amber-400">{product.rating}</span>
          </div>
          <span className="text-sm text-slate-500">({product.reviews} reviews)</span>
        </div>
        <h3 className="font-bold text-xl mb-2 text-white group-hover:text-amber-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {product.features.map((feature, idx) => (
            <span key={feature} className={`text-xs px-3 py-1.5 rounded-full font-medium ${
              idx === 0 ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300' :
              idx === 1 ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300' :
              'bg-orange-500/20 border border-orange-500/30 text-orange-300'
            }`}>
              {feature}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div>
            <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              ${product.price}
            </span>
            <span className="text-sm text-slate-500 ml-2">USD</span>
          </div>
          <button 
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 px-6 py-3 rounded-full hover:shadow-xl hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed font-bold"
          >
            {product.inStock ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );

  // Shop Page
  const ShopPage = () => (
    <div className="pt-32 pb-16 min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            {selectedCategory === 'all' ? 'All Products' : 
             selectedCategory === 'tea' ? 'Tea Ceremony Essentials' : 
             'Aromatherapy & Ambiance'}
          </h1>
          <p className="text-xl text-slate-400">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-slate-800/50 border border-amber-500/20 rounded-full mb-6">
              <Search className="w-16 h-16 text-amber-400" />
            </div>
            <p className="text-slate-300 text-xl mb-4">No products found matching your search.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-amber-400 hover:text-amber-300 font-semibold"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Cart Page
  const CartPage = () => (
    <div className="pt-32 pb-16 min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          Shopping Cart
        </h1>
        <p className="text-slate-400 mb-12 text-lg">{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p>
        
        {cart.length === 0 ? (
          <div className="bg-slate-900 border border-amber-500/20 rounded-3xl p-16 text-center shadow-2xl">
            <div className="inline-block p-8 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
              <ShoppingCart className="w-20 h-20 text-amber-400" />
            </div>
            <p className="text-slate-300 text-2xl mb-8">Your cart is empty</p>
            <button 
              onClick={() => setCurrentView('shop')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 px-10 py-4 rounded-full hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 text-lg font-bold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-slate-900 border border-amber-500/20 rounded-2xl p-6 flex gap-6 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-xl border border-amber-500/20"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-1 text-white">{item.name}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-1">{item.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 border-amber-500/30 rounded-xl overflow-hidden bg-slate-800/50">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-4 py-2 hover:bg-amber-500/20 transition font-bold text-lg text-amber-400"
                        >
                          −
                        </button>
                        <span className="px-6 py-2 border-x-2 border-amber-500/30 font-bold text-lg text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-4 py-2 hover:bg-amber-500/20 transition font-bold text-lg text-amber-400"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-orange-500 hover:text-orange-400 text-sm font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">${item.price} each</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-slate-900 border border-amber-500/20 rounded-3xl p-8 sticky top-32 shadow-2xl shadow-amber-500/10">
                <h2 className="text-2xl font-bold mb-6 text-white">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-300 text-lg">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-bold text-white">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-lg">
                    <span>Shipping</span>
                    <span className={`font-bold ${cartTotal > 50 ? 'text-amber-400' : 'text-white'}`}>
                      {cartTotal > 50 ? 'FREE' : '$9.99'}
                    </span>
                  </div>
                  <div className="border-t-2 border-amber-500/20 pt-4">
                    <div className="flex justify-between text-2xl font-bold text-white">
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                        ${(cartTotal + (cartTotal > 50 ? 0 : 9.99)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                {cartTotal < 50 && (
                  <div className="bg-amber-500/10 border-2 border-amber-500/30 text-amber-300 p-4 rounded-2xl text-sm mb-6 font-medium">
                    <Clock className="w-5 h-5 inline mr-2" />
                    Add ${(50 - cartTotal).toFixed(2)} more for free shipping! 🎉
                  </div>
                )}
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 py-4 rounded-full hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 font-bold text-lg mb-3">
                  Proceed to Checkout
                </button>
                <button 
                  onClick={() => setCurrentView('shop')}
                  className="w-full border-2 border-amber-500/50 text-amber-400 py-4 rounded-full hover:bg-amber-500/10 hover:border-amber-400 transition-all duration-300 font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Footer
  const Footer = () => (
    <footer className="bg-slate-950 border-t border-amber-500/20 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-bold text-2xl mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              ✨ Serenity Home
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Premium wellness products for mindful living and peaceful spaces. Transform your daily rituals.
            </p>
            <div className="flex gap-3">
              <button className="w-10 h-10 bg-slate-800/50 border border-amber-500/30 hover:bg-amber-500/20 rounded-full transition flex items-center justify-center">
                <span className="text-lg">📘</span>
              </button>
              <button className="w-10 h-10 bg-slate-800/50 border border-amber-500/30 hover:bg-amber-500/20 rounded-full transition flex items-center justify-center">
                <span className="text-lg">📷</span>
              </button>
              <button className="w-10 h-10 bg-slate-800/50 border border-amber-500/30 hover:bg-amber-500/20 rounded-full transition flex items-center justify-center">
                <span className="text-lg">🐦</span>
              </button>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-amber-400">Shop</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><button onClick={() => { setCurrentView('shop'); setSelectedCategory('all'); }} className="hover:text-amber-400 transition">All Products</button></li>
              <li><button onClick={() => { setCurrentView('shop'); setSelectedCategory('tea'); }} className="hover:text-amber-400 transition">Tea Essentials</button></li>
              <li><button onClick={() => { setCurrentView('shop'); setSelectedCategory('ambiance'); }} className="hover:text-amber-400 transition">Aromatherapy</button></li>
              <li><a href="#" className="hover:text-amber-400 transition">New Arrivals</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-amber-400">Support</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-amber-400">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-4">Get wellness tips and exclusive offers</p>
            <input 
              type="email" 
              placeholder="Your email"
              className="w-full bg-slate-800/50 border border-amber-500/30 text-white px-4 py-3 rounded-full text-sm mb-3 outline-none focus:ring-2 focus:ring-amber-500/50 placeholder-slate-500 transition"
            />
            <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 py-3 rounded-full text-sm font-bold hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105 transition-all">
              Subscribe Now
            </button>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <p>© 2025 Serenity Home. All rights reserved. Made with ❤️ for wellness enthusiasts.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-amber-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-slate-950">
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
        
        @keyframes blob-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.2);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.8);
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
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(0.8);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .animate-blob-slow {
          animation: blob-slow 20s infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-5000 {
          animation-delay: 5s;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
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
      `}</style>
      <Notification />
      <Header />
      {currentView === 'home' && <HomePage />}
      {currentView === 'shop' && <ShopPage />}
      {currentView === 'cart' && <CartPage />}
      <Footer />
    </div>
  );
}

export default App;
