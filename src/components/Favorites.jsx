import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Trash2, Sparkles } from 'lucide-react';

const Favorites = ({
  wishlist,
  products,
  toggleWishlist,
  addToCart,
  setSelectedProduct
}) => {
  const navigate = useNavigate();
  // Get favorite products
  const favoriteProducts = products.filter(product => wishlist.includes(product.id));

  return (
    <div className="pt-32 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center border-2 border-red-200">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gray-900">My Favorites</h1>
              <p className="text-xl text-gray-600 mt-1">
                {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
          </div>
        </div>

        {favoriteProducts.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-3xl p-16 text-center shadow-xl animate-fade-in-up border border-gray-100">
            <div className="inline-block p-8 bg-gradient-to-br from-red-50 to-pink-50 rounded-full mb-6 border-2 border-red-200">
              <Heart className="w-20 h-20 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your favorites list is empty</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Start adding products you love by clicking the heart icon on any item!
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-10 py-4 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg font-bold inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Discover Products
            </button>
          </div>
        ) : (
          // Favorites Grid
          <div>
            {/* Quick Actions Bar */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 mb-8 border-2 border-amber-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-600" />
                <div>
                  <p className="font-bold text-gray-900">💝 Your Wishlist</p>
                  <p className="text-sm text-gray-600">Items you've saved are waiting for you</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (window.confirm(`Remove all ${favoriteProducts.length} items from favorites?`)) {
                    favoriteProducts.forEach(product => toggleWishlist(product.id));
                  }
                }}
                className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-2 hover:underline"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-gray-100 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Product Image */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-amber-50/20">
                    {product.badge && (
                      <div
                        className={`absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${
                          product.badge === 'Bestseller'
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                            : product.badge === 'New'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : product.badge === 'Hot'
                            ? 'bg-gradient-to-r from-red-500 to-orange-500'
                            : 'bg-gradient-to-r from-amber-600 to-yellow-600'
                        }`}
                      >
                        {product.badge}
                      </div>
                    )}

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(product);
                        navigate(`/product/${product.id}`);
                      }}
                    />

                    {/* Remove from Favorites Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-10 group/heart"
                      title="Remove from favorites"
                    >
                      <Heart className="w-5 h-5 fill-red-500 text-red-500 group-hover/heart:scale-125 transition-transform" />
                    </button>

                    {/* Quick Add to Cart Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="w-full bg-white text-gray-900 py-3 rounded-full font-bold hover:bg-amber-50 transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-yellow-100 px-2 py-1 rounded-full border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-bold text-amber-900">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>

                    {/* Product Name */}
                    <h3
                      onClick={() => {
                        setSelectedProduct(product);
                        navigate(`/product/${product.id}`);
                      }}
                      className="font-bold text-lg mb-2 text-gray-900 hover:text-amber-700 transition-colors cursor-pointer line-clamp-2 leading-tight"
                    >
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-4">
                      {product.originalPrice && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400 line-through">€{product.originalPrice}</span>
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                          </span>
                        </div>
                      )}
                      <div className="text-2xl font-bold text-gray-900">€{product.price}</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-2.5 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {product.inStock ? 'Add' : 'Sold Out'}
                      </button>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="px-4 py-2.5 border-2 border-red-200 text-red-600 rounded-full hover:bg-red-50 transition-all font-semibold text-sm"
                        title="Remove from favorites"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping Section */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl p-8 border-2 border-amber-200">
                <p className="text-gray-700 text-lg mb-4">Looking for more amazing products?</p>
                <button
                  onClick={() => navigate('/shop')}
                  className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-8 py-3 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold inline-flex items-center gap-2"
                >
                  Continue Shopping
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
