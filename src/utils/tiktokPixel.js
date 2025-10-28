/**
 * TikTok Pixel Utility
 * Helper functions to track e-commerce events with TikTok Pixel
 */

// Check if TikTok pixel is loaded
const isTikTokPixelLoaded = () => {
  return typeof window !== 'undefined' && window.ttq;
};

/**
 * Track page view
 */
export const trackPageView = () => {
  if (isTikTokPixelLoaded()) {
    window.ttq.page();
  }
};

/**
 * Track product view
 * @param {Object} product - Product details
 * @param {string} product.id - Product ID
 * @param {string} product.name - Product name
 * @param {number} product.price - Product price
 * @param {string} product.category - Product category
 */
export const trackViewContent = (product) => {
  if (isTikTokPixelLoaded()) {
    window.ttq.track('ViewContent', {
      content_type: 'product',
      content_id: product.id,
      content_name: product.name,
      price: product.price,
      currency: 'EUR',
      content_category: product.category || 'Wellness Products'
    });
  }
};

/**
 * Track add to cart event
 * @param {Object} product - Product details
 * @param {string} product.id - Product ID
 * @param {string} product.name - Product name
 * @param {number} product.price - Product price
 * @param {number} product.quantity - Quantity added
 */
export const trackAddToCart = (product) => {
  if (isTikTokPixelLoaded()) {
    window.ttq.track('AddToCart', {
      content_type: 'product',
      content_id: product.id,
      content_name: product.name,
      price: product.price,
      quantity: product.quantity || 1,
      currency: 'EUR',
      value: product.price * (product.quantity || 1)
    });
  }
};

/**
 * Track initiate checkout event
 * @param {Array} items - Cart items
 * @param {number} totalValue - Total cart value
 */
export const trackInitiateCheckout = (items, totalValue) => {
  if (isTikTokPixelLoaded()) {
    const contents = items.map(item => ({
      content_id: item.id,
      content_name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    window.ttq.track('InitiateCheckout', {
      content_type: 'product',
      contents: contents,
      currency: 'EUR',
      value: totalValue
    });
  }
};

/**
 * Track purchase/complete payment event
 * @param {Object} orderDetails - Order details
 * @param {string} orderDetails.orderId - Order ID
 * @param {Array} orderDetails.items - Purchased items
 * @param {number} orderDetails.totalValue - Total order value
 */
export const trackCompletePayment = (orderDetails) => {
  if (isTikTokPixelLoaded()) {
    const contents = orderDetails.items.map(item => ({
      content_id: item.id,
      content_name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    window.ttq.track('CompletePayment', {
      content_type: 'product',
      contents: contents,
      currency: 'EUR',
      value: orderDetails.totalValue,
      order_id: orderDetails.orderId
    });
  }
};

/**
 * Track add payment info event
 */
export const trackAddPaymentInfo = (totalValue) => {
  if (isTikTokPixelLoaded()) {
    window.ttq.track('AddPaymentInfo', {
      currency: 'EUR',
      value: totalValue
    });
  }
};

/**
 * Track search event
 * @param {string} searchQuery - Search query string
 */
export const trackSearch = (searchQuery) => {
  if (isTikTokPixelLoaded()) {
    window.ttq.track('Search', {
      query: searchQuery
    });
  }
};

/**
 * Track contact/lead event
 */
export const trackContact = () => {
  if (isTikTokPixelLoaded()) {
    window.ttq.track('Contact');
  }
};

/**
 * Track subscribe event (e.g., newsletter signup)
 */
export const trackSubscribe = () => {
  if (isTikTokPixelLoaded()) {
    window.ttq.track('Subscribe');
  }
};

export default {
  trackPageView,
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
  trackCompletePayment,
  trackAddPaymentInfo,
  trackSearch,
  trackContact,
  trackSubscribe
};
