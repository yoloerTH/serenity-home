import { serve } from "https://deno.land/std@0.177.1/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import Stripe from 'https://esm.sh/stripe@14.10.0?target=deno';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature'
};
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient()
    });
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!signature || !webhookSecret) {
      throw new Error('Missing signature or webhook secret');
    }
    const body = await req.text();
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response(JSON.stringify({
        error: 'Webhook signature verification failed'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    console.log('Webhook event received:', event.type);
    switch(event.type){
      case 'payment_intent.succeeded':
        {
          const paymentIntent = event.data.object;
          const orderNumber = paymentIntent.metadata.order_number;
          console.log('Payment succeeded for order:', orderNumber);
          // ✅ Retrieve payment method to get billing details (for PayPal, Apple Pay, etc.)
          let billingDetails = null;
          let paymentMethodType = 'unknown';
          const paymentMethodId = paymentIntent.payment_method;
          if (paymentMethodId && typeof paymentMethodId === 'string') {
            try {
              const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
              billingDetails = paymentMethod.billing_details;
              paymentMethodType = paymentMethod.type; // card, apple_pay, google_pay, paypal, etc.
              console.log('Billing details retrieved:', billingDetails);
              console.log('Payment method type:', paymentMethodType);
            } catch (err) {
              console.error('Error retrieving payment method:', err);
            }
          }
          // Build update object with payment status
          const updateData = {
            payment_status: 'paid',
            status: 'paid',
            stripe_payment_intent_id: paymentIntent.id,
            stripe_charge_id: paymentIntent.latest_charge,
            payment_method: paymentMethodType, // Track which payment method was used
            paid_at: new Date().toISOString()
          };
          // ✅ Add customer details from billing_details if available
          if (billingDetails) {
            if (billingDetails.email) {
              updateData.customer_email = billingDetails.email;
            }
            if (billingDetails.name) {
              const nameParts = billingDetails.name.trim().split(' ');
              updateData.customer_first_name = nameParts[0] || '';
              updateData.customer_last_name = nameParts.slice(1).join(' ') || '';
            }
            if (billingDetails.phone) {
              updateData.customer_phone = billingDetails.phone;
            }
            if (billingDetails.address) {
              if (billingDetails.address.line1) {
                updateData.shipping_address_line1 = billingDetails.address.line1;
              }
              if (billingDetails.address.line2) {
                updateData.shipping_address_line2 = billingDetails.address.line2;
              }
              if (billingDetails.address.city) {
                updateData.shipping_city = billingDetails.address.city;
              }
              if (billingDetails.address.state) {
                updateData.shipping_state = billingDetails.address.state;
              }
              if (billingDetails.address.postal_code) {
                updateData.shipping_postal_code = billingDetails.address.postal_code;
              }
              if (billingDetails.address.country) {
                updateData.shipping_country = billingDetails.address.country;
              }
            }
          }
          // Update database
          const { data, error } = await supabaseClient.from('orders').update(updateData).eq('order_number', orderNumber).select();
          if (error) {
            console.error('Error updating order:', error);
          } else {
            console.log('Order updated successfully:', data);
            // ✅ Send n8n webhook notification (same as frontend does for card payments)
            if (data && data[0]) {
              try {
                // Fetch order items for complete webhook data
                const { data: orderItems } = await supabaseClient.from('order_items').select('*').eq('order_id', data[0].id);
                const webhookResponse = await fetch('https://n8n-production-0d7d.up.railway.app/webhook/serenity', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    event_type: 'purchase',
                    order_number: orderNumber,
                    customer: {
                      email: data[0].customer_email,
                      first_name: data[0].customer_first_name,
                      last_name: data[0].customer_last_name,
                      phone: data[0].customer_phone
                    },
                    shipping_address: {
                      line1: data[0].shipping_address_line1,
                      line2: data[0].shipping_address_line2,
                      city: data[0].shipping_city,
                      state: data[0].shipping_state,
                      postal_code: data[0].shipping_postal_code,
                      country: data[0].shipping_country
                    },
                    order_details: {
                      subtotal: data[0].subtotal,
                      shipping_cost: data[0].shipping_cost,
                      tax: data[0].tax,
                      total: data[0].total,
                      currency: data[0].currency,
                      items: orderItems || []
                    },
                    payment: {
                      status: data[0].payment_status,
                      stripe_payment_intent_id: data[0].stripe_payment_intent_id,
                      paid_at: data[0].paid_at
                    },
                    timestamp: new Date().toISOString()
                  })
                });
                console.log('n8n webhook sent successfully, status:', webhookResponse.status);
              } catch (webhookError) {
                console.error('n8n webhook failed (non-blocking):', webhookError);
              }
            }
          }
          break;
        }
      case 'payment_intent.payment_failed':
        {
          const paymentIntent = event.data.object;
          const orderNumber = paymentIntent.metadata.order_number;
          const failureMessage = paymentIntent.last_payment_error?.message;
          console.log('Payment failed for order:', orderNumber, failureMessage);
          const { error } = await supabaseClient.from('orders').update({
            payment_status: 'failed',
            status: 'payment_failed',
            internal_notes: 'Payment failed: ' + (failureMessage || 'Unknown error')
          }).eq('order_number', orderNumber);
          if (error) {
            console.error('Error updating order:', error);
          }
          break;
        }
      case 'charge.refunded':
        {
          const charge = event.data.object;
          const paymentIntentId = charge.payment_intent;
          console.log('Charge refunded:', charge.id);
          const { error } = await supabaseClient.from('orders').update({
            payment_status: 'refunded',
            status: 'refunded',
            internal_notes: 'Payment refunded'
          }).eq('stripe_payment_intent_id', paymentIntentId);
          if (error) {
            console.error('Error updating order:', error);
          }
          break;
        }
      case 'payment_intent.canceled':
        {
          const paymentIntent = event.data.object;
          const orderNumber = paymentIntent.metadata.order_number;
          console.log('Payment canceled for order:', orderNumber);
          const { error } = await supabaseClient.from('orders').update({
            payment_status: 'canceled',
            status: 'cancelled'
          }).eq('order_number', orderNumber);
          if (error) {
            console.error('Error updating order:', error);
          }
          break;
        }
      default:
        console.log('Unhandled event type: ' + event.type);
    }
    return new Response(JSON.stringify({
      received: true
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});
