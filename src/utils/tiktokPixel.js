/**
 * TikTok Pixel Enhanced Tracking Utility
 * Includes customer identification and advanced event parameters for better ad optimization
 */

// Check if TikTok pixel is loaded
const isTikTokPixelLoaded = () => {
  return typeof window !== 'undefined' && window.ttq;
};

// Check if user has given marketing consent
const hasMarketingConsent = () => {
  if (typeof window === 'undefined') return false;

  const consent = localStorage.getItem('cookieConsent');
  if (!consent) return false;

  try {
    const parsed = JSON.parse(consent);
    return parsed.marketing === true;
  } catch (e) {
    return false;
  }
};

/**
 * SHA-256 Hashing Function (for PII data)
 * Converts email/phone to a secure hash for privacy-safe tracking
 * @param {string} message - String to hash
 * @returns {Promise<string>} - Hashed string
 */
const sha256 = async (message) => {
  // Check if message is empty
  if (!message) return '';

  // Normalize: trim and lowercase for emails
  const normalized = message.trim().toLowerCase();

  // Convert string to ArrayBuffer
  const msgBuffer = new TextEncoder().encode(normalized);

  // Hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
};

/**
 * Generate unique event ID
 * Format: timestamp_random
 * Prevents duplicate tracking if pixel fires multiple times
 * @returns {string} - Unique event ID
 */
const generateEventId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${timestamp}_${random}`;
};

/**
 * Identify customer to TikTok (Advanced Matching)
 * This tells TikTok WHO your customers are for better targeting
 * All PII is hashed with SHA-256 for privacy
 *
 * @param {Object} customerData - Customer information
 * @param {string} customerData.email - Customer email
 * @param {string} customerData.phone - Customer phone (optional)
 * @param {string} customerData.externalId - User ID or customer ID (optional)
 */
export const identifyCustomer = async (customerData) => {
  if (!isTikTokPixelLoaded()) return;

  try {
    const identifyData = {};

    // Hash email if provided
    if (customerData.email) {
      identifyData.email = await sha256(customerData.email);
    }

    // Hash phone if provided (remove spaces and special chars first)
    if (customerData.phone) {
      const cleanPhone = customerData.phone.replace(/[\s\-\(\)]/g, '');
      identifyData.phone_number = await sha256(cleanPhone);
    }

    // Hash external ID if provided
    if (customerData.externalId) {
      identifyData.external_id = await sha256(customerData.externalId.toString());
    }

    // Only call identify if we have at least one identifier
    if (Object.keys(identifyData).length > 0) {
      window.ttq.identify(identifyData);
      console.log('✅ TikTok Customer Identified (hashed)');
    }
  } catch (error) {
    console.error('TikTok identify error:', error);
  }
};

/**
 * Track page view
 */
export const trackPageView = () => {
  if (isTikTokPixelLoaded() && hasMarketingConsent()) {
    window.ttq.page();
  }
};

/**
 * Track product view with enhanced parameters
 * @param {Object} product - Product details
 * @param {string|number} product.id - Product ID
 * @param {string} product.name - Product name
 * @param {number} product.price - Product price
 * @param {string} product.category - Product category (optional)
 */
export const trackViewContent = (product) => {
  if (!isTikTokPixelLoaded() || !hasMarketingConsent()) return;

  try {
    window.ttq.track('ViewContent', {
      contents: [
        {
          content_id: String(product.id),
          content_type: 'product',
          content_name: product.name
        }
      ],
      value: product.price,
      currency: 'EUR'
    }, {
      event_id: generateEventId()
    });
  } catch (error) {
    console.error('TikTok ViewContent error:', error);
  }
};

/**
 * Track add to cart event with enhanced parameters
 * @param {Object} product - Product details
 * @param {string|number} product.id - Product ID
 * @param {string} product.name - Product name
 * @param {number} product.price - Product price
 * @param {number} product.quantity - Quantity added
 */
export const trackAddToCart = (product) => {
  if (!isTikTokPixelLoaded() || !hasMarketingConsent()) return;

  try {
    const quantity = product.quantity || 1;
    const value = product.price * quantity;

    window.ttq.track('AddToCart', {
      contents: [
        {
          content_id: String(product.id),
          content_type: 'product',
          content_name: product.name
        }
      ],
      value: value,
      currency: 'EUR'
    }, {
      event_id: generateEventId()
    });
  } catch (error) {
    console.error('TikTok AddToCart error:', error);
  }
};

/**
 * Track initiate checkout event with enhanced parameters
 * @param {Array} items - Cart items
 * @param {number} totalValue - Total cart value
 */
export const trackInitiateCheckout = (items, totalValue) => {
  if (!isTikTokPixelLoaded() || !hasMarketingConsent()) return;

  try {
    const contents = items.map(item => ({
      content_id: String(item.id),
      content_type: 'product',
      content_name: item.name
    }));

    window.ttq.track('InitiateCheckout', {
      contents: contents,
      value: totalValue,
      currency: 'EUR'
    }, {
      event_id: generateEventId()
    });
  } catch (error) {
    console.error('TikTok InitiateCheckout error:', error);
  }
};

/**
 * Track add payment info event
 * @param {Array} items - Cart items
 * @param {number} totalValue - Total cart value
 */
export const trackAddPaymentInfo = (items, totalValue) => {
  if (!isTikTokPixelLoaded() || !hasMarketingConsent()) return;

  try {
    const contents = items.map(item => ({
      content_id: String(item.id),
      content_type: 'product',
      content_name: item.name
    }));

    window.ttq.track('AddPaymentInfo', {
      contents: contents,
      value: totalValue,
      currency: 'EUR'
    }, {
      event_id: generateEventId()
    });
  } catch (error) {
    console.error('TikTok AddPaymentInfo error:', error);
  }
};

/**
 * Track purchase completion (MOST IMPORTANT for conversion optimization)
 * Uses "Purchase" event name (TikTok standard) instead of "CompletePayment"
 *
 * @param {Object} orderDetails - Order details
 * @param {string} orderDetails.orderId - Order ID
 * @param {Array} orderDetails.items - Purchased items
 * @param {number} orderDetails.totalValue - Total order value
 */
export const trackPurchase = (orderDetails) => {
  if (!isTikTokPixelLoaded() || !hasMarketingConsent()) return;

  try {
    const contents = orderDetails.items.map(item => ({
      content_id: String(item.id),
      content_type: 'product',
      content_name: item.name
    }));

    window.ttq.track('Purchase', {
      contents: contents,
      value: orderDetails.totalValue,
      currency: 'EUR'
    }, {
      event_id: generateEventId()
    });

    console.log('✅ TikTok Purchase Tracked:', orderDetails.orderId);
  } catch (error) {
    console.error('TikTok Purchase error:', error);
  }
};

/**
 * Track add to wishlist event
 * @param {Object} product - Product details
 * @param {string|number} product.id - Product ID
 * @param {string} product.name - Product name
 * @param {number} product.price - Product price
 */
export const trackAddToWishlist = (product) => {
  if (!isTikTokPixelLoaded() || !hasMarketingConsent()) return;

  try {
    window.ttq.track('AddToWishlist', {
      contents: [
        {
          content_id: String(product.id),
          content_type: 'product',
          content_name: product.name
        }
      ],
      value: product.price,
      currency: 'EUR'
    }, {
      event_id: generateEventId()
    });
  } catch (error) {
    console.error('TikTok AddToWishlist error:', error);
  }
};

/**
 * Track search event with enhanced parameters
 * @param {string} searchQuery - Search query string
 * @param {Array} results - Search results (optional)
 */
export const trackSearch = (searchQuery, results = []) => {
  if (!isTikTokPixelLoaded() || !hasMarketingConsent()) return;

  try {
    const contents = results.length > 0 ? results.map(item => ({
      content_id: String(item.id),
      content_type: 'product',
      content_name: item.name
    })) : [];

    window.ttq.track('Search', {
      contents: contents,
      search_string: searchQuery,
      currency: 'EUR'
    }, {
      event_id: generateEventId()
    });
  } catch (error) {
    console.error('TikTok Search error:', error);
  }
};

/**
 * Track contact/lead event
 */
export const trackContact = () => {
  if (!isTikTokPixelLoaded() || !hasMarketingConsent()) return;

  try {
    window.ttq.track('Contact', {}, {
      event_id: generateEventId()
    });
  } catch (error) {
    console.error('TikTok Contact error:', error);
  }
};

/**
 * Track subscribe event (e.g., newsletter signup)
 */
export const trackSubscribe = () => {
  if (!isTikTokPixelLoaded() || !hasMarketingConsent()) return;

  try {
    window.ttq.track('Subscribe', {}, {
      event_id: generateEventId()
    });
  } catch (error) {
    console.error('TikTok Subscribe error:', error);
  }
};

/**
 * Track complete registration
 * @param {Object} userData - User data (optional)
 */
export const trackCompleteRegistration = (userData = {}) => {
  if (!isTikTokPixelLoaded() || !hasMarketingConsent()) return;

  try {
    window.ttq.track('CompleteRegistration', {
      currency: 'EUR'
    }, {
      event_id: generateEventId()
    });
  } catch (error) {
    console.error('TikTok CompleteRegistration error:', error);
  }
};

// Export all functions
export default {
  identifyCustomer,
  trackPageView,
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
  trackAddPaymentInfo,
  trackPurchase,
  trackAddToWishlist,
  trackSearch,
  trackContact,
  trackSubscribe,
  trackCompleteRegistration
};
