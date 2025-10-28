import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Clock, CreditCard, Sparkles, TrendingUp, Star } from 'lucide-react';

const Cart = ({
  cart,
  cartCount,
  cartSubtotal,
  promotionalDiscount,
  discountAmount,
  cartTotal,
  updateQuantity,
  removeFromCart,
  products = [],
  addToCart,
  setSelectedProduct
}) => {
  const navigate = useNavigate();

  // Smart recommendation algorithm
  const recommendations = useMemo(() => {
    if (cart.length === 0 || !products || products.length === 0) return [];

    const cartProductIds = cart.map(item => item.id);
    const cartCategories = cart.map(item => item.category);
    const hasTeaProducts = cartCategories.includes('tea');
    const hasAmbianceProducts = cartCategories.includes('ambiance');

    // Calculate how much more is needed for free shipping
    const amountToFreeShipping = Math.max(0, 50 - cartTotal);

    let recommendedProducts = [];

    // Strategy 1: Cross-category recommendations (tea + diffuser pairing)
    if (hasTeaProducts && !hasAmbianceProducts) {
      // If they have tea, recommend diffusers
      recommendedProducts = products.filter(p =>
        p.category === 'ambiance' && !cartProductIds.includes(p.id)
      );
    } else if (hasAmbianceProducts && !hasTeaProducts) {
      // If they have diffusers, recommend tea sets
      recommendedProducts = products.filter(p =>
        p.category === 'tea' && !cartProductIds.includes(p.id)
      );
    } else {
      // Strategy 2: Related products from cart items
      const relatedIds = new Set();
      cart.forEach(item => {
        if (item.relatedProducts) {
          item.relatedProducts.forEach(id => {
            if (!cartProductIds.includes(id)) {
              relatedIds.add(id);
            }
          });
        }
      });

      recommendedProducts = products.filter(p =>
        relatedIds.has(p.id) && !cartProductIds.includes(p.id)
      );

      // Strategy 3: If still no recommendations, show bestsellers
      if (recommendedProducts.length === 0) {
        recommendedProducts = products.filter(p =>
          !cartProductIds.includes(p.id) && p.badge === 'Bestseller'
        );
      }

      // Strategy 4: Finally, just show any products not in cart
      if (recommendedProducts.length === 0) {
        recommendedProducts = products.filter(p => !cartProductIds.includes(p.id));
      }
    }

    // Strategy 5: Prioritize products that help reach free shipping
    if (amountToFreeShipping > 0 && amountToFreeShipping < 50) {
      recommendedProducts.sort((a, b) => {
        const aReachesThreshold = a.price >= amountToFreeShipping;
        const bReachesThreshold = b.price >= amountToFreeShipping;

        if (aReachesThreshold && !bReachesThreshold) return -1;
        if (!aReachesThreshold && bReachesThreshold) return 1;

        // If both reach or both don't reach, prefer products closer to the amount needed
        const aDiff = Math.abs(a.price - amountToFreeShipping);
        const bDiff = Math.abs(b.price - amountToFreeShipping);
        return aDiff - bDiff;
      });
    }

    // Limit to 4 recommendations and prioritize by rating
    return recommendedProducts
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }, [cart, products, cartTotal]);

  const handleQuickAdd = (product) => {
    if (addToCart) {
      addToCart(product, 1);
    }
  };

  const handleViewProduct = (product) => {
    if (setSelectedProduct) {
      setSelectedProduct(product);
    }
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="pt-32 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-2 text-gray-900 animate-fade-in-up">
          Shopping Cart
        </h1>
        <p className="text-gray-600 mb-12 text-lg animate-fade-in-up">
          {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
        </p>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xl animate-fade-in-up border border-gray-100">
            <div className="inline-block p-8 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full mb-6 border border-amber-200">
              <ShoppingCart className="w-20 h-20 text-amber-700" />
            </div>
            <p className="text-gray-600 text-2xl mb-8">Your cart is empty</p>
            <button 
              onClick={() => navigate('/shop')}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-10 py-4 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg font-bold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl p-6 flex flex-col sm:flex-row gap-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up border border-gray-100" 
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xl mb-1 text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden bg-white">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, item.quantity - 1);
                          }}
                          className="px-5 py-3 hover:bg-amber-50 active:bg-amber-100 transition font-bold text-xl cursor-pointer select-none"
                          aria-label="Decrease quantity"
                          type="button"
                        >
                          −
                        </button>
                        <span className="px-6 py-3 border-x-2 border-gray-300 font-bold text-xl min-w-[60px] text-center bg-white">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, item.quantity + 1);
                          }}
                          className="px-5 py-3 hover:bg-amber-50 active:bg-amber-100 transition font-bold text-xl cursor-pointer select-none"
                          aria-label="Increase quantity"
                          type="button"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(item.id);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition"
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-3xl font-bold text-gray-900">
                      €{(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">€{item.price} each</div>
                    {item.originalPrice && (
                      <div className="text-xs text-green-600 font-semibold mt-1">
                        Save €{((item.originalPrice - item.price) * item.quantity).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-8 sticky top-32 shadow-xl border-2 border-amber-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {/* Subtotal */}
                  <div className="flex justify-between text-gray-700 text-lg">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-bold">€{cartSubtotal.toFixed(2)}</span>
                  </div>
                  
                  {/* Promotional Discount */}
                  {promotionalDiscount > 0 && (
                    <div className="flex justify-between text-green-600 text-lg bg-green-50 p-3 rounded-xl border border-green-200">
                      <div className="flex flex-col">
                        <span className="font-bold">🎉 {Math.round(promotionalDiscount * 100)}% OFF</span>
                        <span className="text-xs text-green-700">
                          {cartCount === 2 ? 'Buy 2 items discount' : 'Buy 3+ items discount'}
                        </span>
                      </div>
                      <span className="font-bold">-€{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {/* Shipping */}
                  <div className="flex justify-between text-gray-700 text-lg">
                    <span>Shipping</span>
                    <span className={`font-bold ${cartTotal > 50 ? 'text-green-600' : ''}`}>
                      {cartTotal > 50 ? 'FREE ✓' : '€9.99'}
                    </span>
                  </div>
                  
                  {/* Total */}
                  <div className="border-t-2 border-amber-300 pt-4">
                    <div className="flex justify-between text-2xl font-bold text-gray-900">
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                        €{(cartTotal + (cartTotal > 50 ? 0 : 9.99)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Savings Summary */}
                  {(promotionalDiscount > 0 || cartTotal > 50) && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
                      <p className="text-sm font-bold text-green-800">
                        💰 You're saving €
                        {(
                          discountAmount + 
                          (cartTotal > 50 ? 9.99 : 0) +
                          cart.reduce((sum, item) => 
                            sum + ((item.originalPrice || item.price) - item.price) * item.quantity, 0
                          )
                        ).toFixed(2)} today!
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Free Shipping Progress */}
                {cartTotal < 50 && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-blue-800 p-4 rounded-2xl text-sm mb-6">
                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold mb-2">Almost there!</p>
                        <p>Add <span className="font-bold">€{(50 - cartTotal).toFixed(2)}</span> more for FREE shipping! 🚚</p>
                        <div className="mt-3 bg-white rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-yellow-500 h-full transition-all duration-500"
                            style={{ width: `${Math.min((cartTotal / 50) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Discount Promotion Banner */}
                {cartCount === 1 && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 p-4 rounded-2xl text-sm mb-6">
                    <p className="font-bold text-purple-800 mb-1">🎁 Special Offer!</p>
                    <p className="text-purple-700">Add 1 more item for <span className="font-bold">10% OFF</span> your order!</p>
                  </div>
                )}
                
                {cartCount === 2 && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 p-4 rounded-2xl text-sm mb-6">
                    <p className="font-bold text-purple-800 mb-1">🎁 Unlock More Savings!</p>
                    <p className="text-purple-700">Add 1 more item for <span className="font-bold">15% OFF</span> instead of 10%!</p>
                  </div>
                )}
                
                {/* Action Buttons */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mb-3"
                >
                  <CreditCard className="w-6 h-6" />
                  Proceed to Secure Checkout
                </button>

                {/* Continue Shopping Button */}
                <button 
                  onClick={() => navigate('/shop')}
                  className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-full hover:border-amber-600 hover:text-amber-700 transition-all duration-300 font-semibold"
                >
                  Continue Shopping
                </button>
                
                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-amber-200">
                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>30-Day Returns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Free Shipping $50+</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>SSL Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Smart Recommendations Section */}
        {cart.length > 0 && recommendations.length > 0 && (
          <div className="mt-16 animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4 border border-purple-200">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Recommended For You</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Wellness Set</h2>
              <p className="text-gray-600">
                {cartTotal < 50
                  ? `Add €${(50 - cartTotal).toFixed(2)} more to unlock FREE shipping!`
                  : 'Customers who bought these items also loved these products'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-gray-100 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Product Image */}
                  <div
                    className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-amber-50/20 cursor-pointer"
                    onClick={() => handleViewProduct(product)}
                  >
                    {product.badge && (
                      <div
                        className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
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

                    {/* Free Shipping Badge */}
                    {cartTotal < 50 && product.price >= (50 - cartTotal) && (
                      <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                        🚚 Unlocks FREE Shipping!
                      </div>
                    )}

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProduct(product);
                        }}
                        className="w-full bg-white text-gray-900 py-2 rounded-full font-bold text-sm hover:bg-amber-50 transition"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>

                    {/* Product Name */}
                    <h3
                      className="font-bold text-base mb-2 text-gray-900 line-clamp-2 cursor-pointer hover:text-amber-600 transition"
                      onClick={() => handleViewProduct(product)}
                    >
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">€{product.price}</span>
                        {product.originalPrice && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              €{product.originalPrice}
                            </span>
                            <span className="text-xs font-bold text-green-600">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Why These Products Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-blue-900 mb-1">Why we recommend these products:</p>
                  <p className="text-blue-800 text-sm">
                    {cartTotal < 50
                      ? 'These products will help you reach FREE shipping while creating the perfect wellness experience.'
                      : cart.some(item => item.category === 'tea') && !cart.some(item => item.category === 'ambiance')
                      ? 'Pair your tea ceremony with aromatherapy for the ultimate relaxation ritual.'
                      : cart.some(item => item.category === 'ambiance') && !cart.some(item => item.category === 'tea')
                      ? 'Enhance your aromatherapy experience with a mindful tea ceremony practice.'
                      : 'These highly-rated products pair perfectly with your selections.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
