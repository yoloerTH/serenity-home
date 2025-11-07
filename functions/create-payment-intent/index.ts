// Edge Function: create-payment-intent
// Path: supabase/functions/create-payment-intent/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.10.0?target=deno';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient()
    });
    // Parse request body
    const { amount, currency, orderNumber, customerEmail, items } = await req.json();
    // Validate input
    if (!amount || amount < 0.5) {
      throw new Error('Invalid amount. Minimum $0.50 required.');
    }
    if (!orderNumber || !customerEmail) {
      throw new Error('Missing required fields: orderNumber or customerEmail');
    }
    // Use provided currency or default to EUR
    const paymentCurrency = currency ? currency.toLowerCase() : 'eur';

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: paymentCurrency,
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        order_number: orderNumber,
        customer_email: customerEmail,
        items: JSON.stringify(items || [])
      },
      description: `Serenity Home Order ${orderNumber}`,
      receipt_email: customerEmail
    });
    // Return client secret
    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to create payment intent'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});
