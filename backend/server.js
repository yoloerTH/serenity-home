// server.js or api/create-checkout-session.js
// Install required packages: npm install stripe express cors dotenv

require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items, customerInfo, total } = req.body;

    // Convert items to Stripe line items format
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      customer_email: customerInfo.email,
      shipping_address_collection: {
        allowed_countries: ['GR', 'US', 'GB', 'DE', 'FR', 'IT', 'ES'],
      },
      metadata: {
        customerName: customerInfo.name,
        address: customerInfo.address,
        city: customerInfo.city,
        postalCode: customerInfo.postalCode,
        country: customerInfo.country,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle successful payments
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Fulfill the order here
      console.log('Payment successful!');
      console.log('Session ID:', session.id);
      console.log('Customer email:', session.customer_email);
      console.log('Amount paid:', session.amount_total / 100, 'EUR');
      
      // TODO: 
      // - Send confirmation email to customer
      // - Update database with order details
      // - Update inventory
      // - Trigger shipping process
      
      break;
    
    case 'payment_intent.succeeded':
      console.log('PaymentIntent was successful!');
      break;
    
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object);
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Get session details (for success page)
app.get('/api/checkout-session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Stripe webhook endpoint: http://localhost:${PORT}/api/webhook`);
});
