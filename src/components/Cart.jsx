import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Clock, CreditCard } from 'lucide-react';

const Cart = ({ 
  cart, 
  cartCount, 
  cartSubtotal, 
  promotionalDiscount, 
  discountAmount, 
  cartTotal, 
  updateQuantity, 
  removeFromCart
}) => {
  const navigate = useNavigate();

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
      </div>
    </div>
  );
};

export default Cart;
