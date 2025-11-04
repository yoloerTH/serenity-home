import React, { useState, useEffect, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, ChevronRight, Sparkles, Gift, Clock } from 'lucide-react';

// Memoized ProductCard component to prevent re-renders from timer
const ProductCard = memo(({ product, addToCart, toggleWishlist, wishlist, setSelectedProduct, navigate }) => {
  return (
    <div
      onClick={() => { setSelectedProduct(product); navigate(`/product/${product.id}`); }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-3xl group border-2 border-red-100 cursor-pointer hover:border-green-300 relative z-50 isolate"
      style={{
        willChange: 'transform, box-shadow',
        transform: 'translateZ(0)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translate3d(0, -12px, 0)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translate3d(0, 0, 0)';
      }}
    >
      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-red-50 to-green-50">
        {product.badge && (
          <div className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${
            product.badge === 'Bestseller' ? 'bg-gradient-to-r from-red-500 to-green-500' :
            product.badge === 'New' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
            product.badge === 'Hot' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
            'bg-gradient-to-r from-red-600 to-green-600'
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
            className="w-full bg-gradient-to-r from-red-600 to-green-600 text-white py-4 rounded-full font-bold hover:shadow-2xl transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-2xl text-lg"
          >
            {product.inStock ? '🎁 Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 bg-gradient-to-r from-red-100 to-green-100 px-3 py-1.5 rounded-full border border-red-200">
            <Star className="w-4 h-4 fill-red-500 text-red-500" />
            <span className="text-sm font-bold text-red-900">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
        </div>
        <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-red-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {product.features.map((feature, idx) => (
            <span key={feature} className={`text-xs px-3 py-1.5 rounded-full font-medium border ${
              idx === 0 ? 'bg-red-50 border-red-200 text-red-800' :
              idx === 1 ? 'bg-green-50 border-green-200 text-green-700' :
              'bg-red-50 border-red-200 text-red-800'
            }`}>
              {feature}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            {product.originalPrice && (
              <div className="text-sm text-gray-400 line-through mb-1">
                €{product.originalPrice}
              </div>
            )}
            <div>
              <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
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
            className="bg-gradient-to-r from-red-600 to-green-600 text-white px-6 py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed font-bold"
          >
            {product.inStock ? 'Add' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
});

const ChristmasShopPage = ({ products, addToCart, toggleWishlist, wishlist, setSelectedProduct, setCurrentView }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({});

  // Generate snowflake configurations once and memoize them
  const snowflakes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 12 + Math.random() * 12,
      delay: Math.random() * 8,
      fontSize: 18 + Math.random() * 15
    }));
  }, []);

  // Calculate time until Christmas
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const christmas = new Date(currentYear, 11, 25); // December 25

      // If Christmas has passed this year, calculate for next year
      if (now > christmas) {
        christmas.setFullYear(currentYear + 1);
      }

      const difference = christmas - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const christmasProducts = products.filter(p => p.category === 'christmas');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 relative">
      {/* Animated Snowflakes */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ height: '100%', overflow: 'hidden' }}>
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute select-none pointer-events-none"
            style={{
              left: `${flake.left}%`,
              top: '-10vh',
              fontSize: `${flake.fontSize}px`,
              opacity: 0.5,
              willChange: 'transform',
              animation: `snowfall ${flake.duration}s linear infinite`,
              animationDelay: `${flake.delay}s`,
              transform: 'translateZ(0)'
            }}
          >
            ❄️
          </div>
        ))}
      </div>

      {/* Christmas Lights Top Border */}
      <div className="w-full h-3 bg-gradient-to-r from-red-500 via-green-500 via-yellow-500 via-blue-500 to-red-500 bg-[length:200%_100%] animate-gradient relative z-20"></div>

      <div className="pt-32 pb-16 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">

          {/* Countdown Timer - Moved to Top */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-red-100 max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                Countdown to Christmas
              </h2>
            </div>
            <div className="grid grid-cols-4 gap-3 md:gap-6">
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
                <div className="text-3xl md:text-4xl font-bold mb-1">{timeLeft.days || 0}</div>
                <div className="text-xs md:text-sm font-semibold opacity-90">Days</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
                <div className="text-3xl md:text-4xl font-bold mb-1">{timeLeft.hours || 0}</div>
                <div className="text-xs md:text-sm font-semibold opacity-90">Hours</div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
                <div className="text-3xl md:text-4xl font-bold mb-1">{timeLeft.minutes || 0}</div>
                <div className="text-xs md:text-sm font-semibold opacity-90">Minutes</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
                <div className="text-3xl md:text-4xl font-bold mb-1">{timeLeft.seconds || 0}</div>
                <div className="text-xs md:text-sm font-semibold opacity-90">Seconds</div>
              </div>
            </div>
          </div>

          {/* Hero Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="mb-8">
              <div className="text-8xl mb-4 animate-twinkle">🎄</div>
              <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-red-600 via-green-600 to-red-600 bg-clip-text text-transparent">
                Christmas Wonderland
              </h1>
              <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
                Step into our magical holiday portal filled with festive diffusers, cozy tea sets, and seasonal delights
              </p>
            </div>

            {/* Products Count */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-100 to-green-100 px-6 py-3 rounded-full border-2 border-red-200 shadow-lg">
              <Gift className="w-6 h-6 text-red-600" />
              <span className="font-bold text-lg text-gray-800">
                {christmasProducts.length} Festive Products Available
              </span>
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
          </div>

          {/* Products Grid */}
          {christmasProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🎄</div>
              <p className="text-gray-600 text-xl">No Christmas products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-40">
              {christmasProducts.map((product, index) => (
                <div key={product.id} className="animate-fade-in-up relative z-40" style={{animationDelay: `${index * 100}ms`}}>
                  <ProductCard
                    product={product}
                    addToCart={addToCart}
                    toggleWishlist={toggleWishlist}
                    wishlist={wishlist}
                    setSelectedProduct={setSelectedProduct}
                    navigate={navigate}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-20 text-center bg-gradient-to-r from-red-600 via-green-600 to-red-600 bg-[length:200%_100%] animate-gradient rounded-3xl p-12 shadow-2xl">
            <div className="text-6xl mb-6">🎅🎄🎁</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Make This Christmas Magical
            </h2>
            <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto">
              Transform your home into a winter wonderland with our exclusive holiday collection
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-red-600 px-10 py-5 rounded-full text-xl font-bold hover:scale-105 transition-all shadow-2xl inline-flex items-center gap-3"
            >
              Back to Top 🎄
            </button>
          </div>
        </div>
      </div>

      {/* Christmas Lights Bottom Border */}
      <div className="w-full h-3 bg-gradient-to-r from-red-500 via-green-500 via-yellow-500 via-blue-500 to-red-500 bg-[length:200%_100%] animate-gradient"></div>
    </div>
  );
};

export default ChristmasShopPage;
