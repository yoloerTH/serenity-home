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
import EmailPopup from './components/EmailPopup.jsx';

// Lazy load heavy components (only load when needed)
const Cart = lazy(() => import('./components/Cart.jsx'));
const Favorites = lazy(() => import('./components/Favorites.jsx'));
const ProductPage = lazy(() => import('./components/ProductPage.jsx'));
const ChristmasProductPage = lazy(() => import('./components/ChristmasProductPage.jsx'));
const Checkout = lazy(() => import('./components/Checkout.jsx'));
const AIChatAssistant = lazy(() => import('./components/AIChatAssistant.jsx'));
const BlogPost = lazy(() => import('./components/BlogPost.jsx'));
const ChristmasShopPage = lazy(() => import('./components/ChristmasShopPage.jsx'));


// Enhanced Product Data with Media
const products = [
  {
    id: 1,
    name: "Flame Fireplace Aroma Diffuser",
    category: "aromatherapy",
    price: 46.99,
    originalPrice: 99.99,
    image: "/images/flame-diffuser-main.png",
    relatedProducts: [7, 2, 3],
    media: [
      { type: "image", url: "/images/flame-diffuser-main.png" },
      { type: "video", url: "https://rdrbedgxihxavpplfigm.supabase.co/storage/v1/object/public/nvnbcxn/1018(1).mp4" },
      { type: "image", url: "/images/flame-diffuser-angle1.png" },
      { type: "image", url: "/images/flame-diffuser-angle2.png" },
      { type: "image", url: "/images/flame-diffuser-in-room.png" },
      { type: "image", url: "/images/flame-diffuser-angle3.png" },
      { type: "image", url: "/images/flame-diffuser-detail.png" }
    ],
    description: "Transform any space into a cozy sanctuary with realistic flame effects and aromatherapy",
    longDescription: "Experience the magic of a crackling fireplace without the hassle. Our Flame Fireplace Aroma Diffuser combines mesmerizing simulated flames with therapeutic aromatherapy to create the ultimate relaxation experience. The dancing LED flames create a realistic fireplace ambiance while the ultrasonic technology disperses your favorite essential oils into a fine mist. With multicolor lighting options, adjustable timer settings, and whisper-quiet operation, this USB-powered diffuser is perfect for bedrooms, bathrooms, or office spaces. The compact design makes it an elegant addition to any décor, while the long-lasting fragrance delivery ensures hours of continuous aromatherapy benefits. Create a warm, inviting atmosphere that soothes the senses and elevates your daily wellness routine.",
    specifications: {
      "Power Source": "USB (included cable)",
      "Tank Capacity": "180ml",
      "Run Time": "6-8 hours continuous",
      "Lighting": "Multicolor flame simulation",
      "Timer Options": "1H / 3H / 6H / Continuous",
      "Dimensions": "8.58\" x 3.35\" x 4.21\"",

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
    shippingInfo: "Free shipping • Delivery in 10-20 days",
    variants: [
      {
        name: "Black",
        price: 46.99,
        originalPrice: 99.99,
        image: "/images/flame-diffuser-main.png",
        inStock: true
      },
      {
        name: "White",
        price: 46.99,
        originalPrice: 99.99,
        image: "/images/flame-diffuser-white.png",
        inStock: true
      }
    ]
  },
  {
    id: 2,
    name: "Dynamic Jellyfish Aroma Diffuser",
    category: "aromatherapy",
    price: 55.99,
    originalPrice: 119.99,
    image: "/images/jellyfish-diffuser-main.png",
    relatedProducts: [7, 1, 3],
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
    shippingInfo: "Free shipping • Delivery in 10-20 days"
  },
  {
    id: 3,
    name: "Cannon Blast Flame Humidifier",
    category: "aromatherapy",
    price: 33.99,
    originalPrice: 69.99,
    image: "/images/cannon-humidifier-main.png",
    relatedProducts: [7, 1, 2],
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
    shippingInfo: "Free shipping • Delivery in 10-20 days"
  },
  {
    id: 4,
    name: "Lazy Kung Fu Magnetic Drip Teapot",
    category: "tea",
    price: 71.99,
    originalPrice: 116.99,
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
    shippingInfo: "Free shipping • Delivery in 10-20 days"
  },
  {
    id: 5,
    name: "Complete Kung Fu Tea Ceremony Set",
    category: "tea",
    price: 89.99,
    originalPrice: 143.99,
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
  price: 89.99,
  originalPrice: 143.99,
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
},
  {
    id: 7,
    name: "Essential Oils Collection",
    category: "aromatherapy",
    price: 5.99,
    originalPrice: 9.99,
    image: "/images/essential-oil-grapefruit.jpg",
    relatedProducts: [1, 2, 3],
    media: [
      { type: "image", url: "/images/essential-oil-grapefruit.jpg" },
      { type: "image", url: "/images/essential-oil-frankincense.jpg" },
      { type: "image", url: "/images/essential-oil-lavender.jpg" },
      { type: "image", url: "/images/essential-oil-12pack.jpg" },
      { type: "image", url: "/images/essential-oil-6pack.jpg" }
    ],
    description: "Pure plant essential oils for aromatherapy, diffusers, and wellness",
    longDescription: "Transform your space with our premium essential oils collection. Each 10ml bottle contains 100% pure, natural plant essences perfect for use with diffusers, aromatherapy, massage, or DIY wellness products. Choose from 18 calming scents including Lavender, Eucalyptus, Peppermint, Rose, and more. Each oil is carefully extracted to preserve maximum therapeutic benefits. Available as individual bottles or value-packed sets of 6 or 12 oils. Perfect for creating your personalized wellness routine or gifting to loved ones who appreciate natural self-care.",
    specifications: {
      "Size": "10ml (0.3 fl oz) per bottle",
      "Purity": "100% pure essential oils",
      "Quality": "Premium grade, therapeutic quality",
      "Packaging": "Glass bottle with dropper",
      "Usage": "Diffusers, aromatherapy, massage, DIY",
      "Shelf Life": "2-3 years when stored properly",
      "Origin": "Natural plant extracts",
      "Scent Options": "18 varieties available"
    },
    rating: 4.5,
    reviews: 18,
    detailedReviews: [
      {
        name: "Sarah J.",
        rating: 5,
        date: "1 week ago",
        comment: "Love these oils! The lavender helps me sleep and the peppermint is perfect for my morning diffuser routine. Great quality for the price!",
        verified: true
      },
      {
        name: "Mike D.",
        rating: 4,
        date: "2 weeks ago",
        comment: "Bought the 12-piece set - amazing value! Each scent is distinct and long-lasting. The eucalyptus cleared my sinuses instantly. Highly recommend!",
        verified: true
      },
      {
        name: "Emma L.",
        rating: 5,
        date: "3 weeks ago",
        comment: "Perfect for my diffuser collection! The rose and jasmine scents are heavenly. Glass bottles with droppers make them easy to use. Will reorder!",
        verified: true
      }
    ],
    features: ["100% Pure", "18 Scents", "Glass Bottles"],
    inStock: true,
    badge: "New",
    shippingInfo: "Free shipping • Delivery in 7-14 days",
 variants: [
  { name: "Grapefruit", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-grapefruit.jpg", inStock: true },
  { name: "Frankincense", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-frankincense.jpg", inStock: true },
  { name: "Sandalwood", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-sandalwood.jpg", inStock: true },
  { name: "Sweet Orange", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-orange.jpg", inStock: true },
  { name: "Vanilla", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-vanilla.jpg", inStock: true },
  { name: "Lavender", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-lavender.jpg", inStock: false },
  { name: "Ylang-Ylang", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-ylangylang.jpg", inStock: true },
  { name: "Sakura", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-sakura.jpg", inStock: true },
  { name: "Rose", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-rose.jpg", inStock: true },
  { name: "Peppermint", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-peppermint.jpg", inStock: true },
  { name: "Eucalyptus", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-eucalyptus.jpg", inStock: true },
  { name: "Tea Tree", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-teatree.jpg", inStock: true },
  { name: "Bergamot", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-bergamot.jpg", inStock: true },
  { name: "Patchouli", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-patchouli.jpg", inStock: true },
  { name: "Rosemary", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-rosemary.jpg", inStock: true },
  { name: "Jasmine", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-jasmine.jpg", inStock: true },
  { name: "Lemon", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-lemon.jpg", inStock: true },
  { name: "Lemongrass", price: 5.99, originalPrice: 9.99, image: "/images/essential-oil-lemongrass.jpg", inStock: true },

  // Updated bundle packs
  { 
    name: "6-Piece Set", 
    price: 18.99, 
    originalPrice: 35.99,
    image: "/images/essential-oil-6pack.jpg", 
    inStock: false
  },
  { 
    name: "12-Piece Set", 
    price: 36.99, 
    originalPrice: 71.99,
    image: "/images/essential-oil-12pack.jpg", 
    inStock: true
  }
]
  },
  {
    id: 8,
    name: "M18 Brushless Turbo Air Blower",
    category: "christmas",
    price: 39.99,
    originalPrice: 69.99,
    image: "/images/air-blower-white.png",
    relatedProducts: [9, 10, 14],
    media: [
      { type: "image", url: "/images/air-blower-black.png" },
      { type: "image", url: "/images/air-blower-white.png" },
      { type: "image", url: "/images/air-blower-inuse.png" },
      { type: "image", url: "/images/air-blower-accessories.png" },
      { type: "image", url: "/images/air-blower-detail.png" },
      { type: "image", url: "/images/air-blower-charging.png" },
      { type: "video", url: "https://sbupwhgzlrpiccvipeox.supabase.co/storage/v1/object/public/gfsh/1104%20(1).mp4" },
      { type: "image", url: "/images/air-blower-vacuum.png" }
    ],
    description: "Powerful 40,000 RPM brushless turbo blower - perfect for clearing snow from decorations and holiday cleanup",
    longDescription: "Transform your holiday prep from exhausting to effortless with this powerful 40,000 RPM brushless turbo blower. Whether you're clearing snow from your festive outdoor decorations, quick-drying wet boots after a winter walk, or cleaning up wrapping paper chaos, this compact powerhouse handles it all. Features 40,000 RPM motor with industrial power in pocket size, dual power options (USB rechargeable 10,000mAh battery + plug-in), 120-minute runtime, 55m/s wind speed for clearing leaves/snow/dust, whisper quiet operation, IP54 water-resistant design, and complete kit with vacuum attachment, concentrated nozzle, and Type-C cable. Perfect for setting up outdoor Christmas displays, clearing snow from decorations, workshop cleanup during DIY gift projects, car interior detailing, and post-wrapping cleanup.",
    specifications: {
      "Motor": "Brushless, 40,000 RPM",
      "Wind Speed": "55 m/s",
      "Battery": "10,000mAh rechargeable",
      "Runtime": "120 minutes continuous",
      "Power": "USB Type-C + plug-in option",
      "Speed Settings": "6-speed adjustment",
      "Water Resistance": "IP54 rated",
      "Noise Level": "Whisper quiet operation",
      "Includes": "Blower, vacuum attachment, nozzle, Type-C cable",
      "Protection": "Overcharge/discharge protection"
    },
    rating: 4.8,
    reviews: 142,
    detailedReviews: [
      {
        name: "Tom R.",
        rating: 5,
        date: "5 days ago",
        comment: "Perfect for Christmas prep! Used it to clear snow from my outdoor lights and blow leaves off the driveway. Battery lasts forever!",
        verified: true
      },
      {
        name: "Lisa M.",
        rating: 5,
        date: "1 week ago",
        comment: "So powerful yet surprisingly quiet! Love the USB charging. Great for workshop cleanup during DIY gift season.",
        verified: true
      },
      {
        name: "Chris K.",
        rating: 4,
        date: "2 weeks ago",
        comment: "Excellent quality. The attachments are super useful. Black version looks professional. Highly recommend!",
        verified: true
      }
    ],
    features: ["40,000 RPM Motor", "120-Min Runtime", "IP54 Water-Resistant", "6-Speed Control", "Complete Kit"],
    inStock: true,
    badge: "Bestseller",
    shippingInfo: "Free shipping • Delivery in 7-14 days",
    variants: [
      {
        name: "Classic Black",
        price: 39.99,
        originalPrice: 69.99,
        image: "/images/air-blower-black.png",
        inStock: true
      },
      {
        name: "Pure White",
        price: 39.99,
        originalPrice: 69.99,
        image: "/images/air-blower-white.png",
        inStock: true
      }
    ]
  },
  {
    id: 9,
    name: "2-in-1 Ceramic Candle Warmer Mug",
    category: "christmas",
    price: 18.99,
    originalPrice: 28.99,
    image: "/images/warmer-mug-red.png",
    relatedProducts: [10, 8, 14],
    media: [
      { type: "image", url: "/images/warmer-mug-red.png" },
      { type: "image", url: "/images/warmer-mug-white.png" },
      { type: "image", url: "/images/warmer-mug-brown.png" },
      { type: "image", url: "/images/warmer-mug-set3.png" },
      { type: "image", url: "/images/warmer-mug-red-netflix.png" },
      { type: "image", url: "/images/warmer-mug-white-netflix.png" },
      { type: "image", url: "/images/warmer-mug-brown-netflix.png" }
    ],
    description: "Keep your cozy drinks hot all winter long - elegant ceramic mug with built-in candle warmer base",
    longDescription: "Imagine sipping perfectly warm hot chocolate while wrapping presents... or keeping your morning coffee hot through an entire Christmas movie marathon. This isn't just a mug - it's your new winter tradition. Our innovative candle-warming base gently heats your favorite beverages AND creates ambient lighting for those cozy winter nights. No more rushing to finish your drink before it gets cold. No more sad microwave reheats. Keep drinks at perfect temperature for tea, coffee, hot chocolate, and mulled wine. Built-in candle warmer creates magical ambiance. Elegant ceramic design with handgrip handle fits any décor. Comes in beautiful gift-ready packaging. 8.3cm diameter fits perfectly in hand and car cup holder. Premium ceramic pottery with eco-friendly finish. Available in festive Red, Pure White, and Warm Brown. Brief, modern minimalist style.",
    specifications: {
      "Material": "Premium ceramic pottery",
      "Diameter": "8.3cm (fits car cup holder)",
      "Features": "Candle warmer base + beverage warmer",
      "Style": "Minimalist modern design",
      "Handle": "Ergonomic handgrip",
      "Finish": "Eco-friendly coating",
      "Packaging": "Gift-ready presentation box",
      "Perfect For": "Coffee, tea, hot chocolate, mulled wine"
    },
    rating: 4.9,
    reviews: 218,
    detailedReviews: [
      {
        name: "Sophie W.",
        rating: 5,
        date: "3 days ago",
        comment: "This is genius! My coffee stays hot for hours. The candle warmer feature is such a nice touch. Got the red one - so elegant!",
        verified: true
      },
      {
        name: "Mark D.",
        rating: 5,
        date: "1 week ago",
        comment: "Best Christmas gift I've received! Love sipping hot chocolate while it stays warm. The brown color matches my desk perfectly.",
        verified: true
      },
      {
        name: "Emma L.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Bought the white one for my office. Everyone asks where I got it! The ambiance from the candle warmer is lovely.",
        verified: true
      }
    ],
    features: ["Keeps Drinks Hot", "Candle Warmer Base", "Gift-Ready", "Elegant Design", "Fits Cup Holder"],
    inStock: true,
    badge: "Hot",
    shippingInfo: "Free shipping • Delivery in 7-14 days",
    variants: [
      {
        name: "Elegant Red",
        price: 18.99,
        originalPrice: 28.99,
        image: "/images/warmer-mug-red.png",
        inStock: true
      },
      {
        name: "Pure White",
        price: 18.99,
        originalPrice: 28.99,
        image: "/images/warmer-mug-white.png",
        inStock: true
      },
      {
        name: "Warm Brown",
        price: 18.99,
        originalPrice: 28.99,
        image: "/images/warmer-mug-brown.png",
        inStock: true
      },
      {
        name: "Set of 3 (All Colors)",
        price: 49.99,
        originalPrice: 86.97,
        image: "/images/warmer-mug-set3.png",
        inStock: true
      }
    ]
  },
  {
    id: 10,
    name: "30cm Wooden Nutcracker Soldier",
    category: "christmas",
    price: 29.99,
    originalPrice: 39.99,
    image: "/images/nutcracker-drummer.png",
    relatedProducts: [8, 9, 14],
    media: [
      { type: "image", url: "/images/nutcracker-drummer.png" },
      { type: "image", url: "/images/nutcracker-drummer-detail.png" },
      { type: "image", url: "/images/nutcracker-trumpeter.png" },
      { type: "image", url: "/images/nutcracker-trumpeter-detail.png" },
      { type: "image", url: "/images/nutcracker-sword.png" },
      { type: "image", url: "/images/nutcracker-sword-detail.png" },
      { type: "image", url: "/images/nutcracker-king.png" },
      { type: "image", url: "/images/nutcracker-king-detail.png" },
      { type: "image", url: "/images/nutcracker-set4.png" }
    ],
    description: "Handcrafted 30cm wooden nutcracker soldiers in 4 unique designs, plus complete set - German Christmas tradition",
    longDescription: "Bring authentic German Christmas tradition to your home with these exquisite 30cm handcrafted wooden nutcracker soldiers. Each character is lovingly hand-painted by skilled craftsmen with intricate details and vibrant colors. Choose from The Drummer (green & gold), The Trumpeter (black, gold & red), The Sword Soldier (red & green - most elaborate), or The King (multi-color with golden bell). Or get all 4 in our Complete Collection and save €21! Every nutcracker features premium solid pine/linden wood construction, 3-layer water-based varnish protection, weighted 8-10cm platform base for stability, and a functional movable jaw lever mechanism. Originating from German Christmas traditions, nutcracker soldiers are believed to bring good luck and protect your home. Perfect for mantelpiece displays, flanking Christmas trees, or as treasured heirloom gifts. Each arrives in individual gift box ready for gifting or display.",
    specifications: {
      "Height": "30cm (11.81 inches)",
      "Material": "Premium solid pine/linden wood",
      "Finish": "3-layer water-based varnish",
      "Base": "8-10cm weighted platform",
      "Mechanism": "Movable jaw lever (functional!)",
      "Character": "Drummer in green & gold",
      "Accessories": "Crown and scepter",
      "Craftsmanship": "Hand-painted details",
      "Packaging": "Individual gift box",
      "Tradition": "German Christmas heritage"
    },
    rating: 4.8,
    reviews: 97,
    detailedReviews: [
      {
        name: "Patricia S.",
        rating: 5,
        date: "1 week ago",
        comment: "Beautiful craftsmanship! The green and gold colors are stunning. Looks perfect on my mantle. Starting a new family tradition!",
        verified: true
      },
      {
        name: "Michael R.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Love the traditional design. Hand-painted details are incredible. Great quality for the price!",
        verified: true
      },
      {
        name: "Karen L.",
        rating: 4,
        date: "3 weeks ago",
        comment: "Gorgeous nutcracker! Jaw actually works. Perfect size at 30cm. Will be collecting more!",
        verified: true
      }
    ],
    features: ["Hand-Painted", "30cm Height", "Functional Jaw", "German Tradition", "Gift Box"],
    inStock: true,
    badge: "Bestseller",
    shippingInfo: "Free shipping • Delivery in 7-14 days",
    variants: [
      {
        name: "The Drummer (Green & Gold)",
        price: 29.99,
        originalPrice: 39.99,
        image: "/images/nutcracker-drummer.png",
        inStock: true
      },
      {
        name: "The Trumpeter (Black, Gold & Red)",
        price: 36.99,
        originalPrice: 49.99,
        image: "/images/nutcracker-trumpeter.png",
        inStock: true
      },
      {
        name: "The Sword Soldier (Red & Green)",
        price: 44.99,
        originalPrice: 59.99,
        image: "/images/nutcracker-sword.png",
        inStock: true
      },
      {
        name: "The King (Multi-Color)",
        price: 36.99,
        originalPrice: 49.99,
        image: "/images/nutcracker-king.png",
        inStock: true
      },
      {
        name: "Complete Set of 4",
        price: 129.99,
        originalPrice: 148.96,
        image: "/images/nutcracker-set4.png",
        inStock: true
      }
    ]
  },
  {
    id: 14,
    name: "Mini USB Humidifier & Aroma Diffuser",
    category: "aromatherapy",
    price: 19.99,
    originalPrice: 34.99,
    image: "/images/usb-humidifier-black.png",
    relatedProducts: [16, 15, 7],
    media: [
      { type: "image", url: "/images/usb-humidifier-black.png" },
      { type: "image", url: "/images/usb-humidifier-white.png" },
      { type: "image", url: "/images/usb-humidifier-angle.png" },
      { type: "image", url: "/images/usb-humidifier-inuse.png" },
      { type: "image", url: "/images/usb-humidifier-led.png" }
    ],
    description: "Compact ultrasonic humidifier with LED lights perfect for your desk, bedroom, or small spaces",
    longDescription: "Transform your personal space with this elegant mini USB humidifier. Using advanced ultrasonic technology, it creates a fine, cool mist that adds moisture and fragrance to the air. The 180ml water tank provides 4-6 hours of continuous operation, while the colorful LED light ring creates a soothing ambiance. Simply add water and a few drops of your favorite essential oil for instant aromatherapy. With whisper-quiet operation under 36dB, it won't disturb your work or sleep. The compact columnar design fits perfectly on any desk, nightstand, or small table. USB-powered for convenience - works with any USB port, power bank, or adapter. One-button control makes it incredibly easy to use.",
    specifications: {
      "Type": "Ultrasonic Humidifier",
      "Tank Capacity": "180ml",
      "Mist Output": "Cool mist, ultrasonic technology",
      "LED Lights": "Rainbow color ring",
      "Power": "USB 5V, 2W",
      "Noise Level": "< 36dB (ultra quiet)",
      "Run Time": "4-6 hours continuous",
      "Coverage Area": "11-20 m² (small rooms)",
      "Dimensions": "68 × 92.5mm",
      "Controls": "Touch button (one-button operation)"
    },
    rating: 4.7,
    reviews: 234,
    detailedReviews: [
      {
        name: "Jessica R.",
        rating: 5,
        date: "1 week ago",
        comment: "Perfect for my desk at work! The LED lights are gorgeous and it's so quiet. I add lavender oil and it makes my workspace feel like a spa. Great price too!",
        verified: true
      },
      {
        name: "Michael K.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Bought the black one for my nightstand. Love how compact it is and the mist output is surprisingly strong for such a small device. Very happy with this purchase!",
        verified: true
      },
      {
        name: "Amy T.",
        rating: 4,
        date: "3 weeks ago",
        comment: "Nice little humidifier! Works well and looks cute. Just remember to clean it regularly since it uses water. The white version matches my room perfectly.",
        verified: true
      }
    ],
    features: ["Ultrasonic Mist", "LED Light Ring", "USB Powered", "Whisper Quiet"],
    inStock: true,
    badge: "Budget Pick",
    shippingInfo: "Free shipping • Delivery in 7-14 days",
    variants: [
      {
        name: "Black",
        price: 19.99,
        originalPrice: 34.99,
        image: "/images/usb-humidifier-black.png",
        inStock: true
      },
      {
        name: "White",
        price: 19.99,
        originalPrice: 34.99,
        image: "/images/usb-humidifier-white.png",
        inStock: true
      }
    ]
  },
  {
    id: 15,
    name: "Waterless Car Essential Oil Diffuser",
    category: "aromatherapy",
    price: 34.99,
    originalPrice: 49.99,
    image: "/images/car-diffuser-black.png",
    relatedProducts: [16, 14, 7],
    media: [
      { type: "image", url: "/images/car-diffuser-black.png" },
      { type: "image", url: "/images/car-diffuser-incar.png" },
      { type: "image", url: "/images/car-diffuser-detail.png" },
      { type: "image", url: "/images/car-diffuser-charging.png" },
      { type: "image", url: "/images/car-diffuser-cupholder.png" }
    ],
    description: "Professional waterless nebulizer for pure essential oil diffusion - perfect for cars and larger spaces",
    longDescription: "Experience true aromatherapy with this advanced waterless essential oil diffuser. Unlike traditional water-based diffusers, this uses cold-air nebulizing technology to atomize pure essential oils without dilution, preserving their therapeutic properties and delivering stronger, longer-lasting fragrance. The metal construction ensures durability, while the rechargeable USB Type-C battery provides cord-free convenience. With programmable timer settings and adjustable intensity controls, you can customize your aromatherapy experience. Designed to fit standard car cup holders, it's perfect for keeping your vehicle fresh. Also works great in bedrooms, bathrooms, and offices with coverage up to 100 m³. The 80ml oil bottle is easy to refill and swap between different fragrances. No water means no mold, no cleaning hassles, and no condensation on your car windows.",
    specifications: {
      "Type": "Waterless Nebulizer (Cold-Air)",
      "Technology": "Air pump atomization",
      "Oil Capacity": "80ml pure essential oils",
      "Power": "USB Type-C rechargeable + plug-in option",
      "Coverage": "Up to 100 m³",
      "Material": "Premium metal construction",
      "Features": "Timer, intensity control, concentration settings",
      "Noise Level": "Silent operation",
      "Usage": "Car cup holder compatible, portable",
      "Maintenance": "No water = no mold, easy refill"
    },
    rating: 4.8,
    reviews: 178,
    detailedReviews: [
      {
        name: "Robert D.",
        rating: 5,
        date: "5 days ago",
        comment: "Game changer for my car! No more water spills or condensation on windows. The pure oil diffusion is so much stronger than my old diffuser. Fits perfectly in my cup holder.",
        verified: true
      },
      {
        name: "Sarah W.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Finally, a diffuser that actually works! The waterless technology is brilliant. I use it in my home office and the fragrance fills the whole room. Worth every penny.",
        verified: true
      },
      {
        name: "James P.",
        rating: 4,
        date: "1 month ago",
        comment: "Excellent quality and the metal build feels premium. Battery lasts several days with moderate use. The adjustable intensity is perfect for controlling how strong you want the scent.",
        verified: true
      }
    ],
    features: ["Waterless Technology", "Pure Oil Nebulizer", "USB Rechargeable", "Car Compatible", "Metal Build"],
    inStock: true,
    badge: "Premium",
    shippingInfo: "Free shipping • Delivery in 7-14 days"
  },
  {
    id: 16,
    name: "Car + Home Aroma Bundle",
    category: "aromatherapy",
    price: 44.99,
    originalPrice: 54.98,
    image: "/images/diffuser-bundle-black.png",
    relatedProducts: [7, 1, 14, 15],
    media: [
      { type: "image", url: "/images/diffuser-bundle-black.png" },
      { type: "image", url: "/images/diffuser-bundle-white.png" },
      { type: "image", url: "/images/car-diffuser-black.png" },
      { type: "image", url: "/images/usb-humidifier-black.png" },
      { type: "image", url: "/images/usb-humidifier-white.png" },
      { type: "image", url: "/images/bundle-lifestyle.png" }
    ],
    description: "Complete aromatherapy solution - waterless car diffuser + mini USB humidifier for home and travel",
    longDescription: "Get the best of both worlds with our Car + Home Aroma Bundle! This value pack includes our premium Waterless Car Essential Oil Diffuser (€34.99 value) and our popular Mini USB Humidifier & Aroma Diffuser (€19.99 value). Perfect for maintaining your wellness routine whether you're on the road or relaxing at home. The waterless car diffuser uses advanced nebulizing technology to deliver pure, undiluted essential oil fragrance in your vehicle without condensation or mess, while the USB humidifier adds moisture and aroma to your desk, bedroom, or any small space with its colorful LED lights and ultrasonic mist. Together, they create a complete aromatherapy ecosystem for your entire lifestyle. Save €10 when you buy them together - get both for the price of one premium diffuser! Choose your preferred humidifier color to match your style.",
    specifications: {
      "Bundle Includes": "1x Waterless Car Diffuser + 1x USB Humidifier (Choose Color)",
      "Car Diffuser": "Waterless nebulizer, 80ml oil capacity, USB Type-C rechargeable",
      "USB Humidifier": "180ml water tank, ultrasonic mist, LED lights (Black or White)",
      "Total Coverage": "Car interior + 11-20 m² room",
      "Power Options": "USB-C (car diffuser) + USB 5V (humidifier)",
      "Special Features": "Complementary technologies - waterless + water-based",
      "Perfect For": "Daily commuters, travelers, home office workers",
      "Value": "Save €10 - Get Both for €44.99!"
    },
    rating: 4.9,
    reviews: 89,
    detailedReviews: [
      {
        name: "Laura M.",
        rating: 5,
        date: "3 days ago",
        comment: "Best purchase ever! I use the car diffuser during my commute and the USB one on my work desk. Love having consistent aromatherapy throughout my day. The bundle pricing made it a no-brainer!",
        verified: true
      },
      {
        name: "David K.",
        rating: 5,
        date: "1 week ago",
        comment: "Smart bundle! The car diffuser is waterless so no mess in the vehicle, and the USB humidifier adds moisture at home. They complement each other perfectly. Great value for money.",
        verified: true
      },
      {
        name: "Maria S.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Love that I got both technologies - the waterless one for my car is powerful and the traditional one for my bedroom is soothing. Saved money buying together!",
        verified: true
      }
    ],
    features: ["Complete Set", "Home + Car", "Save €10", "Two Technologies", "USB Powered"],
    inStock: true,
    badge: "Best Value",
    shippingInfo: "Free shipping • Delivery in 7-14 days",
    bundleInfo: {
      isBundle: true,
      items: [
        { id: 15, quantity: 1, name: "Waterless Car Essential Oil Diffuser" },
        { id: 14, quantity: 1, name: "Mini USB Humidifier & Aroma Diffuser" }
      ],
      savings: 9.99
    },
    variants: [
      {
        name: "Bundle with Black Humidifier",
        price: 44.99,
        originalPrice: 54.98,
        image: "/images/diffuser-bundle-black.png",
        inStock: true
      },
      {
        name: "Bundle with White Humidifier",
        price: 44.99,
        originalPrice: 54.98,
        image: "/images/diffuser-bundle-white.png",
        inStock: true
      }
    ]
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
                  setSelectedCategory('aromatherapy');
                }}
                className="text-gray-600 hover:text-amber-600 transition font-medium relative group"
              >
                Aromatherapy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all"></span>
              </button>

              <button
                onClick={() => navigate('/christmas')}
                className="text-red-600 hover:text-green-600 transition font-bold relative group animate-pulse"
              >
                🎄 Christmas
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-green-500 group-hover:w-full transition-all"></span>
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
      <>
        {/* Backdrop Overlay */}
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden animate-fade-in"
          onClick={() => setMenuOpen(false)}
        />

        {/* Mobile Menu Panel */}
        <div className="fixed top-20 left-0 right-0 md:hidden border-t border-gray-100 bg-white animate-slide-down z-50 max-h-[calc(100vh-5rem)] overflow-y-auto shadow-2xl">
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
              setSelectedCategory('aromatherapy');
              setMenuOpen(false);
            }}
            className="text-left py-3 px-4 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
          >
            Aromatherapy
          </button>

          <button
            onClick={() => {
              navigate('/christmas');
              setMenuOpen(false);
            }}
            className="text-left py-3 px-4 text-red-600 font-bold hover:text-green-600 hover:bg-red-50 rounded-lg transition border-2 border-red-200"
          >
            🎄 Christmas Collection
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
      </>
    )}
  </>
  );
};

// ============================================
// PRODUCT PAGE WRAPPER (Routes to correct product page)
// ============================================
const ProductPageWrapper = ({ products, ...props }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  // If it's a Christmas product, show ChristmasProductPage
  if (product && product.category === 'christmas') {
    return <ChristmasProductPage products={products} {...props} />;
  }

  // Otherwise show regular ProductPage
  return <ProductPage products={products} {...props} />;
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
      {/* Subtle popularity indicator for bestsellers */}
      {product.badge === 'Bestseller' && product.inStock && (
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-semibold text-green-700">🔥 Popular choice</span>
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
      {/* Social proof indicator for popular products */}
      {product.badge === 'Bestseller' && (
        <div className="mb-3 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-lg inline-block">
          ✓ {Math.floor(product.reviews * 0.15)}+ purchased this month
        </div>
      )}
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

      {/* Essential Oils Discount Notice */}
      {product.id === 7 && (
        <div className="mb-4 flex items-start gap-2 text-xs text-amber-800 bg-amber-50 px-3 py-2.5 rounded-lg border border-amber-200">
          <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Quantity Discount Info:</span> Single essential oils don't count toward our Buy 2 (10% OFF) / Buy 3+ (15% OFF) promotion.
            <span className="font-medium"> Bundle packs (6-Piece, 12-Piece) do qualify!</span>
          </div>
        </div>
      )}

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
              onClick={() => navigate('/christmas')}
              className="relative overflow-hidden bg-gradient-to-r from-red-600 via-green-600 to-red-600 bg-[length:200%_100%] text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white shadow-lg animate-gradient"
            >
              <span className="relative z-10 flex items-center gap-2">
                🎄 Christmas Collection ❄️
              </span>
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
            onClick={() => { navigate('/shop'); setSelectedCategory('aromatherapy'); }}
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

    {/* Christmas Collection Section */}
    <section className="relative py-32 bg-gradient-to-br from-red-50 via-white to-green-50 overflow-hidden">
      {/* Snowflakes Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-snowfall opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${8 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${20 + Math.random() * 20}px`
            }}
          >
            ❄️
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-green-100 px-6 py-3 rounded-full mb-6 border-2 border-red-200 shadow-lg animate-twinkle">
            <span className="text-2xl">🎄</span>
            <span className="font-bold text-red-800 text-lg">LIMITED TIME CHRISTMAS COLLECTION</span>
            <span className="text-2xl">🎁</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-600 via-green-600 to-red-600 bg-clip-text text-transparent">
            Magical Holiday Season
          </h2>
          <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Celebrate the joy of the season with our festive collection of diffusers, tea sets, and holiday essentials
          </p>
        </div>

        {/* Christmas Featured Banner */}
        <div className="mb-16">
          <button
            onClick={() => navigate('/christmas')}
            className="group relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 border-4 border-red-200"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-green-600/20 to-red-600/20 animate-gradient"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="text-9xl mb-6 animate-twinkle">🎄</div>
                <h3 className="text-6xl font-bold text-white mb-6 drop-shadow-2xl">
                  Christmas Collection
                </h3>
                <p className="text-2xl text-white/95 mb-8 drop-shadow-lg">
                  Discover festive diffusers, holiday tea sets & seasonal scents
                </p>
                <span className="inline-flex items-center gap-3 bg-white text-red-600 px-10 py-5 rounded-full font-bold text-xl shadow-2xl group-hover:scale-110 transition-transform">
                  Shop Now 🎁
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </div>
            </div>
            <div className="absolute top-10 left-10 text-6xl animate-float">⭐</div>
            <div className="absolute bottom-10 right-10 text-6xl animate-float" style={{animationDelay: '1s'}}>🎅</div>
            <div className="absolute top-10 right-10 text-6xl animate-float" style={{animationDelay: '0.5s'}}>🔔</div>
          </button>
        </div>

        {/* Quick Preview of Christmas Products */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {products.filter(p => p.category === 'christmas').slice(0, 3).map((product, index) => (
            <div key={product.id} className="animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Christmas CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate('/christmas')}
            className="group bg-gradient-to-r from-red-600 via-green-600 to-red-600 bg-[length:200%_100%] text-white px-12 py-5 rounded-full text-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 border-2 border-white shadow-xl animate-gradient"
          >
            View Full Christmas Collection
            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
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

          {/* Social Proof Banner */}
          <div className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-sm font-medium text-green-800">
              Loved by 637+ wellness enthusiasts worldwide
            </span>
          </div>
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
           selectedCategory === 'christmas' ? '🎄 Christmas Collection 🎁' :
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
            <li><button onClick={() => { navigate('/shop'); setSelectedCategory('aromatherapy'); }} className="hover:text-amber-400 transition">Aromatherapy</button></li>
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
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  // Load cart and discount from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    const savedDiscount = localStorage.getItem('appliedDiscount');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedDiscount) setAppliedDiscount(JSON.parse(savedDiscount));
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
  // Check for existing item considering both id AND variant
  const existing = cart.find(item =>
    item.id === product.id &&
    (item.variant || null) === (product.variant || null)
  );

  if (existing) {
    setCart(cart.map(item =>
      (item.id === product.id && (item.variant || null) === (product.variant || null))
        ? {...item, quantity: item.quantity + qty}
        : item
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

    const result = await subscribeToNewsletter(email, 'footer');

    setNewsletterLoading(false);

    if (result.success) {
      showNotification(result.message, 'success');
      setNewsletterEmail('');
    } else {
      showNotification(result.message, 'info');
    }
  };

  // Newsletter subscription handler specifically for popup (returns result)
  const handlePopupSubscription = async (email) => {
    const result = await subscribeToNewsletter(email, 'popup');
    // Return result to popup so it can handle success/error states
    return result;
  };

  // Apply discount code
  const applyDiscountCode = (code) => {
    const trimmedCode = code.trim().toUpperCase();

    if (trimmedCode === 'WELCOME10') {
      const discount = {
        code: 'WELCOME10',
        percentage: 10,
        description: 'Welcome Discount'
      };
      setAppliedDiscount(discount);
      localStorage.setItem('appliedDiscount', JSON.stringify(discount));
      showNotification('Discount code applied! You save 10% 🎉', 'success');
      return true;
    } else if (trimmedCode === '') {
      showNotification('Please enter a discount code', 'error');
      return false;
    } else {
      showNotification('Invalid discount code', 'error');
      return false;
    }
  };

  // Remove discount code
  const removeDiscountCode = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    localStorage.removeItem('appliedDiscount');
    showNotification('Discount code removed', 'info');
  };

  const removeFromCart = (productId, variant = null) => {
    setCart(cart.filter(item =>
      !(item.id === productId && (item.variant || null) === variant)
    ));
    showNotification('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, change, variant = null) => {
    setCart(cart.map(item => {
      if (item.id === productId && (item.variant || null) === variant) {
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

  // Total cart count (for display - includes all items)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Count only eligible items for promotional discount (excluding single essential oils)
  const eligibleItemsCount = cart.reduce((sum, item) => {
    // Exclude single essential oils (id: 7), but include the 6-Piece and 12-Piece sets
    const isSingleEssentialOil = item.id === 7 &&
                                  item.variant !== "6-Piece Set" &&
                                  item.variant !== "12-Piece Set";

    return isSingleEssentialOil ? sum : sum + item.quantity;
  }, 0);

  // Check if cart has any single essential oils
  const hasSingleEssentialOils = cart.some(item =>
    item.id === 7 &&
    item.variant !== "6-Piece Set" &&
    item.variant !== "12-Piece Set"
  );

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Promotional discount logic (based on eligible items only)
  const getPromotionalDiscount = () => {
    if (eligibleItemsCount >= 3) return 0.15; // 15% off for 3+ eligible items
    if (eligibleItemsCount >= 2) return 0.10; // 10% off for 2+ eligible items
    return 0;
  };

  const promotionalDiscount = getPromotionalDiscount();
  const discountAmount = cartSubtotal * promotionalDiscount;

  // Calculate discount code amount
  const discountCodeAmount = appliedDiscount
    ? (cartSubtotal - discountAmount) * (appliedDiscount.percentage / 100)
    : 0;

  // Final cart total with both promotional and discount code discounts
  const cartTotal = cartSubtotal - discountAmount - discountCodeAmount;

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

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes snowfall {
          0% {
            transform: translate3d(0, -10vh, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translate3d(100px, 110vh, 0);
            opacity: 0;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-snowfall {
          animation: snowfall linear infinite;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
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
      <EmailPopup onSubscribe={handlePopupSubscription} />

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

        <Route path="/christmas" element={
          <ChristmasShopPage
            products={products}
            addToCart={addToCart}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            setSelectedProduct={setSelectedProduct}
            setCurrentView={setCurrentView}
          />
        } />

        <Route path="/cart" element={
          <Cart
            cart={cart}
            cartCount={cartCount}
            eligibleItemsCount={eligibleItemsCount}
            hasSingleEssentialOils={hasSingleEssentialOils}
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
            discountCode={discountCode}
            setDiscountCode={setDiscountCode}
            appliedDiscount={appliedDiscount}
            applyDiscountCode={applyDiscountCode}
            removeDiscountCode={removeDiscountCode}
            discountCodeAmount={discountCodeAmount}
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
            appliedDiscount={appliedDiscount}
            discountCodeAmount={discountCodeAmount}
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
          <ProductPageWrapper
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
