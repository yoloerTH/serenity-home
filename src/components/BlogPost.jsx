// /src/pages/BlogPost.jsx
import React, { useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Facebook, Twitter } from "lucide-react";
import { Helmet } from "react-helmet";

// Import blog content
import { sleepDiffusersContent } from "../blog-content/sleep-diffusers.js";
import { teaCeremonyContent } from "../blog-content/tea-ceremony.js";
import { homeWellnessSanctuaryContent } from "../blog-content/home-wellness-sanctuary.js";
import { aromatherapyBeginnersContent } from "../blog-content/aromatherapy-beginners.js";
import { teaForHealthContent } from "../blog-content/best-tea-for-health.js";
import { diffuserMaintenanceContent } from '../blog-content/diffuser-maintenance';
import { essentialOilsAnxietyStressContent } from '../blog-content/essential-oils-anxiety-stress.js';
import { diffuserVsCandlesContent } from '../blog-content/diffuser-vs-candles.js';
import { teaLoversGiftGuideContent } from '../blog-content/tea-lovers-gift-guide.js';
import { ledHumidifierGuideContent } from '../blog-content/led-humidifier-guide.js';
import { morningRoutineEnergyContent } from '../blog-content/morning-routine-energy.js';
import { humidifierVsDiffuserContent } from '../blog-content/humidifier-vs-diffuser.js';

const BlogPost = ({ setSelectedProduct, products, blogPosts }) => {
  const { slug } = useParams(); // ← Get slug from URL: /blog/aromatherapy-for-beginners, etc.
  const navigate = useNavigate(); // ← Use this instead of setCurrentView
  const articleRef = useRef(null);

  // Find the post by slug from the URL param
  const post = blogPosts.find((p) => p.slug === slug);

  // Handle post not found
  if (!post) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <button
            onClick={() => navigate("/blog")}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  // Handle clicks on in-article product buttons
  useEffect(() => {
    const handleProductClick = (e) => {
      const btn = e.target.closest(".blog-product-btn");
      if (!btn) return;

      const productId = parseInt(btn.dataset.productId, 10);
      const product = products.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        navigate(`/product/${productId}`); // ← Route to product page
      }
    };

    const el = articleRef.current;
    el?.addEventListener("click", handleProductClick);
    return () => el?.removeEventListener("click", handleProductClick);
  }, [products, navigate, setSelectedProduct]);

  // ---------- SEO + Schema ----------
  const siteUrl = "https://serenityhome.online";
  const fullUrl = `${siteUrl}/blog/${slug}`;
  const heroImage = `${siteUrl}${post.image}`;
  const description = post.excerpt || post.title;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    image: heroImage,
    author: {
      "@type": "Organization",
      name: "Serenity Home",
    },
    publisher: {
      "@type": "Organization",
      name: "Serenity Home",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
    url: fullUrl,
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      {/* SEO Meta + Schema */}
      <Helmet>
        <title>{`${post.title} | Serenity Home`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={fullUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={heroImage} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:site_name" content="Serenity Home" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={heroImage} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </button>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4" ref={articleRef}>
        <div className="mb-8">
          {post.category && (
            <div className="inline-block bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
              {post.category}
            </div>
          )}

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {post.readTime}
            </div>
          </div>

          {/* Social Share */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-gray-600 font-medium">Share:</span>

            <button
              onClick={() => {
                const url = encodeURIComponent(fullUrl);
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                  "_blank",
                  "width=600,height=400"
                );
              }}
              className="p-2 bg-blue-600 text-white rounded-full hover:scale-110 transition"
            >
              <Facebook className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                const url = encodeURIComponent(fullUrl);
                const text = encodeURIComponent(
                  `Check out this amazing guide from Serenity Home: ${post.title}`
                );
                window.open(
                  `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
                  "_blank",
                  "width=600,height=400"
                );
              }}
              className="p-2 bg-sky-500 text-white rounded-full hover:scale-110 transition"
            >
              <Twitter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={post.image}
            alt={post.title}
            width="1200"
            height="630"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Blog Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html:
              post.id === 1
                ? sleepDiffusersContent
                : post.id === 2
                ? teaCeremonyContent
                : post.id === 3
                ? homeWellnessSanctuaryContent
                : post.id === 4
                ? aromatherapyBeginnersContent
                : post.id === 5
                ? teaForHealthContent
                : post.id === 6
                ? diffuserMaintenanceContent
                : post.id === 7
                ? essentialOilsAnxietyStressContent
                : post.id === 8
                ? diffuserVsCandlesContent
                : post.id === 9
                ? teaLoversGiftGuideContent
                : post.id === 10
                ? ledHumidifierGuideContent
                : post.id === 11
                ? morningRoutineEnergyContent
                : post.id === 12
                ? humidifierVsDiffuserContent
                : null,
          }}
        />

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 rounded-3xl p-12 text-center mt-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Shop?
          </h3>
          <button
            onClick={() => navigate("/shop")}
            className="bg-white text-amber-700 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl"
          >
            View All Products
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
