/**
 * Netlify Serverless Function for TikTok Events API
 * Secure, compliant, validated v1.3 integration
 */

const crypto = require('crypto');

const sha256 = (message) => {
  if (!message) return '';
  return crypto.createHash('sha256').update(message.trim().toLowerCase()).digest('hex');
};

const TIKTOK_API_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const eventData = JSON.parse(event.body);

    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    const pixelId = process.env.VITE_TIKTOK_PIXEL_ID;

    if (!accessToken || !pixelId) {
      console.error('❌ Missing TikTok credentials', { hasAccessToken: !!accessToken, hasPixelId: !!pixelId });
      return { statusCode: 500, body: JSON.stringify({ error: 'TikTok credentials missing in env' }) };
    }

    console.log("✅ TikTok credentials found, processing:", eventData.eventName);

    const {
      eventName,
      eventId,
      customerEmail,
      customerPhone,
      externalId,
      userAgent,
      clientIp,
      url,
      value,
      currency,
      contents
    } = eventData;

    // Build the event object (WITHOUT event_source_id - that goes at root level)
    const singleEvent = {
      event: eventName,
      event_id: eventId,
      timestamp: new Date().toISOString(),  // ISO format timestamp
      context: {
        ad: {},
        page: { url },
        user_agent: userAgent,
        ip: clientIp
      },
      properties: {}
    };

    if (customerEmail || customerPhone || externalId) {
      singleEvent.context.user = {};
      if (customerEmail) singleEvent.context.user.email = sha256(customerEmail);
      if (customerPhone) singleEvent.context.user.phone_number = sha256(customerPhone.replace(/[\s\-\(\)]/g, ""));
      if (externalId) singleEvent.context.user.external_id = sha256(String(externalId));
    }

    if (contents?.length > 0) {
      singleEvent.properties.contents = contents.map(item => ({
        content_id: String(item.content_id),
        content_type: item.content_type || 'product',
        content_name: item.content_name || ''
      }));
    }

    // Ensure value is a proper number (handle both number and string inputs)
    if (value !== undefined && value !== null) {
      singleEvent.properties.value = typeof value === "number" ? value : parseFloat(value);
    }

    // Ensure currency is uppercase (TikTok expects ISO 4217 format)
    if (currency) {
      singleEvent.properties.currency = String(currency).toUpperCase();
    }

    // ✅ CRITICAL: event_source_id and event_source go at ROOT level, NOT in event object
    const finalPayload = {
      event_source_id: pixelId,
      event_source: "web",
      data: [singleEvent]
    };

    console.log("📦 FINAL Payload →", JSON.stringify(finalPayload, null, 2));

    const response = await fetch(TIKTOK_API_URL, {
      method: "POST",
      headers: {
        "Access-Token": accessToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(finalPayload)
    });

    const responseData = await response.json();

    if (response.ok && responseData.code === 0) {
      console.log(`✅ TikTok Event SUCCESS: ${eventName}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, response: responseData })
      };
    }

    console.error("❌ TikTok API Error:", responseData);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: responseData })
    };

  } catch (error) {
    console.error("❌ Server Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};
