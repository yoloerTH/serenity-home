/**
 * Netlify Serverless Function for TikTok Events API
 * Securely sends events to TikTok from the server (prevents access token exposure)
 */

const crypto = require('crypto');

// SHA-256 hashing function (server-side)
const sha256 = (message) => {
  if (!message) return '';
  const normalized = message.trim().toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
};

// TikTok Events API endpoint
const TIKTOK_API_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const eventData = JSON.parse(event.body);

    // Get TikTok credentials from environment variables
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    const pixelId = process.env.VITE_TIKTOK_PIXEL_ID;

    if (!accessToken || !pixelId) {
      console.error('❌ Missing TikTok credentials:', {
        hasAccessToken: !!accessToken,
        hasPixelId: !!pixelId
      });
      throw new Error('TikTok credentials not configured in Netlify environment variables');
    }

    console.log('✅ TikTok credentials found, processing event:', eventData.eventName);

    // Extract event details
    const {
      eventName,           // e.g., "Purchase", "ViewContent"
      eventId,             // Unique event ID
      customerEmail,       // Customer email (will be hashed)
      customerPhone,       // Customer phone (optional, will be hashed)
      externalId,          // Order ID or customer ID (will be hashed)
      userAgent,           // Browser user agent
      clientIp,            // Client IP address
      url,                 // Current page URL
      value,               // Order value
      currency,            // Currency code (EUR)
      contents             // Array of products
    } = eventData;

    // Build the individual event object
    const eventObject = {
      event: eventName,
      event_id: eventId,
      timestamp: new Date().toISOString(),
      context: {
        user_agent: userAgent,
        ip: clientIp,
        page: {
          url: url
        }
      },
      properties: {}
    };

    // Add customer information (hashed)
    if (customerEmail || customerPhone || externalId) {
      eventObject.context.user = {};

      if (customerEmail) {
        eventObject.context.user.email = sha256(customerEmail);
      }

      if (customerPhone) {
        const cleanPhone = customerPhone.replace(/[\s\-\(\)]/g, '');
        eventObject.context.user.phone_number = sha256(cleanPhone);
      }

      if (externalId) {
        eventObject.context.user.external_id = sha256(String(externalId));
      }
    }

    // Add event properties
    if (contents && contents.length > 0) {
      eventObject.properties.contents = contents.map(item => ({
        content_id: String(item.content_id),
        content_type: item.content_type || 'product',
        content_name: item.content_name
      }));
    }

    if (value !== undefined) {
      eventObject.properties.value = value;
    }

    if (currency) {
      eventObject.properties.currency = currency;
    }

    // ✅ CRITICAL FIX: Wrap the event in the required structure
    // TikTok Events API v1.3 requires 'pixel_code' and 'data' array at top level
    const payload = {
      pixel_code: pixelId,
      data: [eventObject]  // Event must be in an array
    };

    // Log the payload for debugging
    console.log('📤 Sending to TikTok:', {
      endpoint: TIKTOK_API_URL,
      pixelCode: payload.pixel_code,
      event: eventObject.event,
      hasUserData: !!eventObject.context?.user,
      hasValue: !!eventObject.properties?.value
    });

    // Send to TikTok Events API
    const response = await fetch(TIKTOK_API_URL, {
      method: 'POST',
      headers: {
        'Access-Token': accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    // Check if successful
    if (response.ok && responseData.code === 0) {
      console.log(`✅ TikTok Event Sent: ${eventName}`, {
        event_id: eventId,
        pixel_code: pixelId
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Event sent to TikTok',
          data: responseData
        })
      };
    } else {
      console.error('❌ TikTok API Error:', {
        status: response.status,
        statusText: response.statusText,
        responseCode: responseData.code,
        responseMessage: responseData.message,
        fullResponse: JSON.stringify(responseData)
      });

      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: 'TikTok API error',
          message: responseData.message || 'Unknown error',
          code: responseData.code,
          details: responseData
        })
      };
    }

  } catch (error) {
    console.error('❌ Netlify Function Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
