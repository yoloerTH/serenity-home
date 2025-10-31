import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Star, Truck, Shield, Package, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { trackViewContent, trackAddToCart } from '../utils/tiktokPixel';

const ProductPage = ({ products, addToCart, toggleWishlist, wishlist, setSelectedProduct }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedMedia, setSelectedMedia] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Find the product by ID from URL param
  const product = products.find(p => p.id === parseInt(id));

  // Initialize selected variant when product changes
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  // Get current product details (either from variant or main product)
  const currentPrice = selectedVariant ? selectedVariant.price : product?.price;
  const currentImage = selectedVariant ? selectedVariant.image : product?.image;
  const currentInStock = selectedVariant ? selectedVariant.inStock : product?.inStock;
  const currentName = selectedVariant ? `${product.name} - ${selectedVariant.name}` : product?.name;

  // Track product view with TikTok Pixel
  useEffect(() => {
    if (product) {
      trackViewContent({
        id: product.id,
        name: product.name,
        price: currentPrice,
        category: product.category || 'Wellness Products'
      });
    }
  }, [product, currentPrice]);

  if (!product) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/shop')}
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

  const customerReviews = product.detailedReviews || [
    {
      name: "Verified Customer",
      rating: 5,
      date: "Recently",
      comment: "Great product! Highly recommend.",
      verified: true
    }
  ];

  // ---------- SEO + Schema ----------
  const siteUrl = "https://serenityhome.online";
  const productUrl = `${siteUrl}/product/${id}`;
  const productImage = product.image.startsWith('http') ? product.image : `${siteUrl}${product.image}`;
  const description = product.longDescription || product.description;

  // Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": description,
    "image": productImage,
    "sku": `SKU-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Serenity Home"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "EUR",
      "price": product.price,
      "priceValidUntil": "2025-12-31",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Serenity Home"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviews,
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": `${siteUrl}/shop`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": productUrl
      }
    ]
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      {/* SEO Meta + Schema */}
      <Helmet>
        <title>{`${product.name} | Serenity Home`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={productUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={productImage} />
        <meta property="og:url" content={productUrl} />
        <meta property="og:site_name" content="Serenity Home" />
        <meta property="product:price:amount" content={product.price} />
        <meta property="product:price:currency" content="EUR" />
        <meta property="product:availability" content={product.inStock ? "in stock" : "out of stock"} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={productImage} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate('/shop')}
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
              {product.media && product.media[selectedMedia] && !selectedVariant ? (
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
                    width="800"
                    height="800"
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <img
                  src={currentImage}
                  alt={currentName}
                  width="800"
                  height="800"
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
            {product.media && product.media.length > 0 && !selectedVariant && (
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
                        width="120"
                        height="120"
                        loading="lazy"
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

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Variant {selectedVariant && `(${selectedVariant.name})`}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
                    {product.variants.map((variant, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={!variant.inStock}
                        className={`relative group p-3 rounded-xl border-2 transition-all ${
                          selectedVariant?.name === variant.name
                            ? 'border-amber-500 bg-amber-50 shadow-lg'
                            : variant.inStock
                            ? 'border-gray-200 hover:border-amber-300 bg-white'
                            : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="aspect-square mb-2 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={variant.image}
                            alt={variant.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="text-sm font-medium text-gray-900 text-center mb-1">
                          {variant.name}
                        </div>
                        <div className="text-lg font-bold text-center">
                          <span className={selectedVariant?.name === variant.name ? 'text-amber-600' : 'text-gray-900'}>
                            €{variant.price}
                          </span>
                        </div>
                        {!variant.inStock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
                            <span className="text-white text-xs font-bold px-2 py-1 bg-red-500 rounded">
                              Out of Stock
                            </span>
                          </div>
                        )}
                        {selectedVariant?.name === variant.name && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price with Quantity Calculation */}
              <div className="mb-6">
                {(() => {
                  // Calculate subtotal using current price (variant or product)
                  const subtotal = currentPrice * quantity;

                  // Apply promotional discount
                  let discount = 0;
                  if (quantity >= 3) discount = 0.15; // 15% off
                  else if (quantity >= 2) discount = 0.10; // 10% off

                  const discountAmount = subtotal * discount;
                  const finalPrice = subtotal - discountAmount;

                  // Calculate savings from original price
                  const originalTotal = product.originalPrice ? product.originalPrice * quantity : 0;
                  const totalSavings = originalTotal ? (originalTotal - finalPrice) : discountAmount;
                  
                  return (
                    <>
                      {/* Unit Price */}
                      <div className="flex items-center gap-3 mb-3">
                        {product.originalPrice && (
                          <>
                            <span className="text-xl text-gray-400 line-through">€{product.originalPrice}</span>
                            <span className="text-xl font-bold text-gray-900">→</span>
                          </>
                        )}
                        <span className="text-xl font-bold text-gray-900">€{currentPrice}</span>
                        <span className="text-sm text-gray-600">per unit</span>
                      </div>
                      
                      {/* Total Price with Discount */}
                      {quantity > 1 && (
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-4 mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700 font-medium">Subtotal ({quantity} items)</span>
                            <span className="text-xl font-bold text-gray-900">€{subtotal.toFixed(2)}</span>
                          </div>
                          
                          {discount > 0 && (
                            <div className="flex justify-between items-center py-2 border-t border-amber-200">
                              <span className="text-green-600 font-bold">
                                🎉 Bulk Discount ({Math.round(discount * 100)}% OFF)
                              </span>
                              <span className="text-green-600 font-bold">-€{discountAmount.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Final Price */}
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            {quantity > 1 ? 'Total Price' : 'Price'}
                          </div>
                          <span className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                            €{finalPrice.toFixed(2)}
                          </span>
                        </div>
                        
                        {totalSavings > 0 && (
                          <div className="bg-green-100 border border-green-300 rounded-xl px-4 py-2">
                            <div className="text-xs text-green-700 font-medium">You Save</div>
                            <div className="text-xl font-bold text-green-700">€{totalSavings.toFixed(2)}</div>
                          </div>
                        )}
                      </div>
                      
                      {/* Promotional Hints */}
                      {quantity === 1 && (
                        <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-3">
                          <p className="text-sm text-purple-800">
                            <span className="font-bold">💡 Tip:</span> Add 1 more for <span className="font-bold">10% OFF</span> your order!
                          </p>
                        </div>
                      )}
                      
                      {quantity === 2 && (
                        <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-3">
                          <p className="text-sm text-purple-800">
                            <span className="font-bold">💡 Upgrade:</span> Add 1 more for <span className="font-bold">15% OFF</span> instead of 10%!
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
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
                  <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden bg-white">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuantity(Math.max(1, quantity - 1));
                      }}
                      type="button"
                      className="px-6 py-3 hover:bg-amber-50 active:bg-amber-100 transition font-bold text-xl cursor-pointer select-none"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-8 py-3 border-x-2 border-gray-300 font-bold text-xl min-w-[80px] text-center bg-white">
                      {quantity}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuantity(quantity + 1);
                      }}
                      type="button"
                      className="px-6 py-3 hover:bg-amber-50 active:bg-amber-100 transition font-bold text-xl cursor-pointer select-none"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  {currentInStock ? (
                    <span className="text-green-600 font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      In Stock
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => {
                    // Create a product object with variant details if applicable
                    const productToAdd = selectedVariant
                      ? {
                          ...product,
                          name: currentName,
                          price: currentPrice,
                          image: currentImage,
                          variant: selectedVariant.name
                        }
                      : product;

                    // Track add to cart event with TikTok Pixel
                    trackAddToCart({
                      id: product.id,
                      name: currentName,
                      price: currentPrice,
                      quantity: quantity
                    });
                    addToCart(productToAdd, quantity);
                    setQuantity(1);
                  }}
                  disabled={!currentInStock}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-300 shadow-xl"
                >
                  {quantity > 1 ? `Add ${quantity} to Cart` : 'Add to Cart'}
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
              ))}
            </div>
          </div>

          {/* Related Products Section - NOW USING PASSED PRODUCTS PROP */}
          {product.relatedProducts && product.relatedProducts.length > 0 && (
            <div className="border-t border-gray-200 pt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.relatedProducts.map(relatedId => {
                  const relatedProduct = products.find(p => p.id === relatedId);
                  if (!relatedProduct) return null;
                  return (
                    <div
                      key={relatedId}
                      onClick={() => {
                        setSelectedProduct(relatedProduct);
                        navigate(`/product/${relatedId}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 group cursor-pointer"
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-amber-50/20">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          width="400"
                          height="192"
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {relatedProduct.badge && (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {relatedProduct.badge}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                          <span className="text-sm font-bold text-amber-900">{relatedProduct.rating}</span>
                          <span className="text-xs text-gray-500">({relatedProduct.reviews})</span>
                        </div>
                        <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-2">{relatedProduct.name}</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            {relatedProduct.originalPrice && (
                              <div className="text-xs text-gray-400 line-through mb-1">€{relatedProduct.originalPrice}</div>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-gray-900">€{relatedProduct.price}</span>
                              {relatedProduct.originalPrice && (
                                <span className="text-xs font-bold text-green-600">
                                  -{Math.round((1 - relatedProduct.price / relatedProduct.originalPrice) * 100)}%
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(relatedProduct);
                              navigate(`/product/${relatedId}`);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
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
        </div>
      </div>
    </div>
  );
};

export default ProductPage;