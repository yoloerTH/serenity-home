/**
 * TikTok Server-Side Events Utility
 * Sends events to TikTok Events API via Netlify Function (secure, server-side)
 * This provides 99% tracking accuracy and works even with ad blockers!
 */

/**
 * Generate unique event ID
 */
const generateEventId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${timestamp}_${random}`;
};

/**
 * Get client IP address (best effort)
 * In production, Netlify function will use the actual client IP from headers
 */
const getClientIp = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Could not fetch IP:', error);
    return null;
  }
};

/**
 * Send event to TikTok via Netlify serverless function
 * @param {Object} eventData - Event data to send
 * @returns {Promise<Object>} - Response from TikTok API
 */
const sendServerEvent = async (eventData) => {
  try {
    // Get user agent and current URL
    const userAgent = navigator.userAgent;
    const url = window.location.href;

    // Get client IP (optional, Netlify can also get this from request headers)
    const clientIp = await getClientIp();

    // Prepare payload for Netlify function
    const payload = {
      ...eventData,
      userAgent,
      url,
      clientIp,
      eventId: eventData.eventId || generateEventId()
    };

    // Call Netlify function
    const response = await fetch('/.netlify/functions/tiktok-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Server Event Sent:', eventData.eventName);
      return { success: true, data: result };
    } else {
      console.error('❌ Server Event Failed:', result.error);
      return { success: false, error: result.error };
    }

  } catch (error) {
    console.error('❌ Server Event Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Track ViewContent event (server-side)
 * @param {Object} product - Product details
 */
export const serverTrackViewContent = async (product) => {
  return await sendServerEvent({
    eventName: 'ViewContent',
    value: product.price,
    currency: 'EUR',
    contents: [
      {
        content_id: String(product.id),
        content_type: 'product',
        content_name: product.name
      }
    ]
  });
};

/**
 * Track AddToCart event (server-side)
 * @param {Object} product - Product details
 */
export const serverTrackAddToCart = async (product) => {
  const quantity = product.quantity || 1;
  const value = product.price * quantity;

  return await sendServerEvent({
    eventName: 'AddToCart',
    value: value,
    currency: 'EUR',
    contents: [
      {
        content_id: String(product.id),
        content_type: 'product',
        content_name: product.name
      }
    ]
  });
};

/**
 * Track InitiateCheckout event (server-side)
 * @param {Array} items - Cart items
 * @param {number} totalValue - Total cart value
 */
export const serverTrackInitiateCheckout = async (items, totalValue) => {
  const contents = items.map(item => ({
    content_id: String(item.id),
    content_type: 'product',
    content_name: item.name
  }));

  return await sendServerEvent({
    eventName: 'InitiateCheckout',
    value: totalValue,
    currency: 'EUR',
    contents: contents
  });
};

/**
 * Track Purchase event (server-side) - MOST IMPORTANT!
 * This is the critical conversion event that TikTok optimizes for
 *
 * @param {Object} orderDetails - Order details
 * @param {string} orderDetails.orderId - Order ID
 * @param {string} orderDetails.customerEmail - Customer email
 * @param {string} orderDetails.customerPhone - Customer phone (optional)
 * @param {Array} orderDetails.items - Purchased items
 * @param {number} orderDetails.totalValue - Total order value
 */
export const serverTrackPurchase = async (orderDetails) => {
  const contents = orderDetails.items.map(item => ({
    content_id: String(item.id),
    content_type: 'product',
    content_name: item.name
  }));

  return await sendServerEvent({
    eventName: 'Purchase',
    customerEmail: orderDetails.customerEmail,
    customerPhone: orderDetails.customerPhone,
    externalId: orderDetails.orderId,
    value: orderDetails.totalValue,
    currency: 'EUR',
    contents: contents
  });
};

/**
 * Track AddPaymentInfo event (server-side)
 * @param {Array} items - Cart items
 * @param {number} totalValue - Total cart value
 */
export const serverTrackAddPaymentInfo = async (items, totalValue) => {
  const contents = items.map(item => ({
    content_id: String(item.id),
    content_type: 'product',
    content_name: item.name
  }));

  return await sendServerEvent({
    eventName: 'AddPaymentInfo',
    value: totalValue,
    currency: 'EUR',
    contents: contents
  });
};

/**
 * Track AddToWishlist event (server-side)
 * @param {Object} product - Product details
 */
export const serverTrackAddToWishlist = async (product) => {
  return await sendServerEvent({
    eventName: 'AddToWishlist',
    value: product.price,
    currency: 'EUR',
    contents: [
      {
        content_id: String(product.id),
        content_type: 'product',
        content_name: product.name
      }
    ]
  });
};

/**
 * Track Search event (server-side)
 * @param {string} searchQuery - Search query
 * @param {Array} results - Search results (optional)
 */
export const serverTrackSearch = async (searchQuery, results = []) => {
  const contents = results.map(item => ({
    content_id: String(item.id),
    content_type: 'product',
    content_name: item.name
  }));

  return await sendServerEvent({
    eventName: 'Search',
    search_string: searchQuery,
    currency: 'EUR',
    contents: contents
  });
};

// Export all functions
export default {
  serverTrackViewContent,
  serverTrackAddToCart,
  serverTrackInitiateCheckout,
  serverTrackPurchase,
  serverTrackAddPaymentInfo,
  serverTrackAddToWishlist,
  serverTrackSearch
};
