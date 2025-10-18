import React, { useState } from 'react';
import { ChevronLeft, Heart, Star, Truck, Shield, Package, ZoomIn, Play, ChevronDown, ChevronUp } from 'lucide-react';

const ProductPage = ({ product, addToCart, toggleWishlist, wishlist, setCurrentView }) => {
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [expandedFaq, setExpandedFaq] = useState(null);

  if (!product) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button 
            onClick={() => setCurrentView('shop')}
            className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-3 rounded-full font-semibold"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const productFaqs = [
    {
      question: "How do I use this product?",
      answer: "Detailed usage instructions are included in the package. For optimal results, please refer to the user manual or watch our tutorial video."
    },
    {
      question: "What is the warranty period?",
      answer: "This product comes with a 1-year manufacturer's warranty covering defects in materials and workmanship."
    },
    {
      question: "Is this dishwasher safe?",
      answer: "Please check the care instructions on the product. Most components are hand-wash only to maintain longevity."
    },
    {
      question: "Can I return this if I'm not satisfied?",
      answer: "Yes! We offer a 30-day return policy. Items must be unused and in original packaging for a full refund."
    }
  ];

  const customerReviews = [
    {
      name: "Sarah M.",
      rating: 5,
      date: "2 weeks ago",
      comment: "Absolutely love this! The quality exceeded my expectations. Worth every penny.",
      verified: true
    },
    {
      name: "James K.",
      rating: 5,
      date: "1 month ago",
      comment: "Beautiful design and works perfectly. Great addition to my daily routine.",
      verified: true
    },
    {
      name: "Emily R.",
      rating: 4,
      date: "1 month ago",
      comment: "Very good product overall. Shipping was fast and packaging was excellent.",
      verified: true
    }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button 
          onClick={() => setCurrentView('shop')}
          className="inline-flex items-center text-gray-600 hover:text-amber-600 transition mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Shop
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Product Gallery */}
          <div className="space-y-4">
            {/* Main Media Display */}
            <div className="relative bg-gradient-to-br from-gray-50 to-amber-50/20 rounded-3xl overflow-hidden aspect-square border-2 border-gray-100">
              {product.media && product.media[selectedMedia] ? (
                product.media[selectedMedia].type === 'video' ? (
                  <iframe
                    src={product.media[selectedMedia].url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img 
                    src={product.media[selectedMedia].url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
              {product.badge && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.media && product.media.length > 0 && (
              <div className="grid grid-cols-5 gap-3">
                {product.media.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMedia(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedMedia === index 
                        ? 'border-amber-500 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    ) : (
                      <img 
                        src={media.url} 
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-yellow-100 px-3 py-2 rounded-full border border-amber-200">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <span className="font-bold text-amber-900">{product.rating}</span>
                  <span className="text-gray-600 ml-1">({product.reviews} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">{product.price}</span>
                <span className="text-xl text-gray-500 ml-2">EUR</span>
              </div>

              {/* Short Description */}
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-8">
                {product.features.map((feature, idx) => (
                  <span 
                    key={idx} 
                    className="px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-full text-sm font-medium text-amber-900"
                  >
                    ✓ {feature}
                  </span>
                ))}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-6 py-3 hover:bg-amber-50 transition font-bold text-xl"
                    >
                      −
                    </button>
                    <span className="px-8 py-3 border-x-2 border-gray-300 font-bold text-xl">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-6 py-3 hover:bg-amber-50 transition font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                  {product.inStock && (
                    <span className="text-green-600 font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      In Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button 
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      addToCart(product);
                    }
                  }}
                  disabled={!product.inStock}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-300"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className="p-4 border-2 border-gray-300 rounded-full hover:border-amber-600 hover:bg-amber-50 transition-all"
                >
                  <Heart className={`w-6 h-6 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-700">Free Shipping</p>
                  <p className="text-xs text-gray-500">Orders $50+</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-700">Secure Payment</p>
                  <p className="text-xs text-gray-500">SSL Encrypted</p>
                </div>
                <div className="text-center">
                  <Package className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-700">Easy Returns</p>
                  <p className="text-xs text-gray-500">30 Days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="max-w-5xl mx-auto">
          {/* Tab Headers */}
          <div className="flex gap-8 border-b-2 border-gray-200 mb-8">
            <button 
              onClick={() => setActiveTab('description')}
              className={`pb-4 font-bold text-lg transition relative ${
                activeTab === 'description' 
                  ? 'text-amber-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Description
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('specifications')}
              className={`pb-4 font-bold text-lg transition relative ${
                activeTab === 'specifications' 
                  ? 'text-amber-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Specifications
              {activeTab === 'specifications' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 font-bold text-lg transition relative ${
                activeTab === 'reviews' 
                  ? 'text-amber-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviews ({product.reviews})
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="mb-16">
            {activeTab === 'description' && (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.longDescription || product.description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && product.specifications && (
              <div className="bg-gradient-to-br from-gray-50 to-amber-50/20 rounded-2xl p-8 border border-gray-200">
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                      <span className="font-semibold text-gray-900">{key}:</span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 border border-amber-200">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900 mb-2">{product.rating}</div>
                      <div className="flex gap-1 mb-2">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className="w-5 h-5 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">{product.reviews} reviews</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 text-lg">
                        <span className="font-bold">98%</span> of customers recommend this product
                      </p>
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {customerReviews.map((review, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-gray-900">{review.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(star => (
                                <Star 
                                  key={star} 
                                  className={`w-4 h-4 ${star <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            {review.verified && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product FAQs */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Product FAQs</h2>
            <div className="space-y-4">
              {productFaqs.map((faq, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 flex justify-between items-center hover:bg-amber-50 transition"
                  >
                    <span className="font-semibold text-gray-900 text-left">{faq.question}</span>
                    {expandedFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-amber-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
      {/* Related Products */}
{product.relatedProducts && product.relatedProducts.length > 0 && (
  <div className="mt-16 border-t border-gray-200 pt-16">
    <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {product.relatedProducts.map(relatedId => {
        const relatedProduct = products.find(p => p.id === relatedId);
        if (!relatedProduct) return null;
        return (
          <div key={relatedId} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100">
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-amber-50/20">
              <img 
                src={relatedProduct.image} 
                alt={relatedProduct.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 text-gray-900">{relatedProduct.name}</h3>
              <div className="flex items-center justify-between">
                <div>
                  {relatedProduct.originalPrice && (
                    <div className="text-xs text-gray-400 line-through">€{relatedProduct.originalPrice}</div>
                  )}
                  <span className="text-2xl font-bold text-gray-900">€{relatedProduct.price}</span>
                </div>
                <button 
                  onClick={() => {
                    setSelectedProduct(relatedProduct);
                    window.scrollTo(0, 0);
                  }}
                  className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-4 py-2 rounded-full hover:shadow-xl transition-all text-sm font-bold"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
