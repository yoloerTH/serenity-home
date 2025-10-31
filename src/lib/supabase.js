import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Newsletter subscription function
export const subscribeToNewsletter = async (email) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: email.toLowerCase().trim(),
          source: 'website',
        },
      ])
      .select()

    if (error) {
      if (error.code === '23505') {
        return {
          success: false,
          message: 'This email is already subscribed!',
        }
      }
      throw error
    }

    // Send webhook notification (non-blocking)
    try {
      await fetch('https://n8n-production-0d7d.up.railway.app/webhook/serenity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'newsletter_subscription',
          email: email.toLowerCase().trim(),
          source: 'website',
          timestamp: new Date().toISOString(),
          subscriber_data: data[0],
        }),
      })
    } catch (webhookError) {
      // Silently log webhook errors - don't affect user experience
      console.error('Webhook notification failed:', webhookError)
    }

    return {
      success: true,
      message: 'Successfully subscribed! Check your inbox.',
      data,
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return {
      success: false,
      message: 'Oops! Something went wrong. Please try again.',
    }
  }
}

// Contact form submission function
export const submitContactForm = async (formData) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          status: 'new',
        },
      ])
      .select()

    if (error) {
      throw error
    }

    return {
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
      data,
    }
  } catch (error) {
    console.error('Contact form submission error:', error)
    return {
      success: false,
      message:
        'Failed to send message. Please try again or email us directly.',
    }
  }
}

// Helper to split full name into first and last name
const splitName = (fullName) => {
  if (!fullName) return { firstName: '', lastName: '' }
  const parts = fullName.trim().split(' ')
  const firstName = parts[0] || ''
  const lastName = parts.slice(1).join(' ') || ''
  return { firstName, lastName }
}

// Create order in database with proper schema
export const createOrder = async (orderData) => {
  try {
    // Split customer name
    const { firstName, lastName } = splitName(orderData.name)
    
    // Extract shipping address fields
    const shipping = orderData.shippingAddress || {}
    
    // Calculate shipping cost (free over $50)
    const shippingCost = orderData.subtotal >= 50 ? 0 : 9.99
    
    // Insert order
    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          customer_email: orderData.email.toLowerCase().trim(),
          customer_first_name: firstName,
          customer_last_name: lastName,
          customer_phone: orderData.phone || null,
          
          // Shipping address - individual fields
          shipping_address_line1: shipping.address || '',
          shipping_address_line2: '',
          shipping_city: shipping.city || '',
          shipping_state: shipping.state || '',
          shipping_postal_code: shipping.zipCode || '',
          shipping_country: shipping.country || 'US',
          
          // Pricing
          subtotal: orderData.subtotal,
          shipping_cost: shippingCost,
          tax: 0.00,
          total: orderData.total,
          currency: 'EUR',
          
          // Payment
          stripe_payment_intent_id: orderData.paymentIntentId || null,
          payment_status: orderData.paymentStatus || 'pending',
          status: 'pending',
          
          // Notes
          customer_notes: orderData.notes || null,
        },
      ])
      .select()

    if (orderError) {
      console.error('Order insert error:', orderError)
      throw orderError
    }

    const order = orderResult[0]
    
    // Insert order items into order_items table
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_image: item.image || null,
      product_variant: item.variant || null, // Save variant information
      unit_price: item.price,
      quantity: item.quantity,
      total_price: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items insert error:', itemsError)
      // Don't throw - order is already created
    }

    return {
      success: true,
      message: 'Order created successfully!',
      data: order,
      orderNumber: order.order_number,
    }
  } catch (error) {
    console.error('Create order error:', error)
    return {
      success: false,
      message: 'Failed to create order. Please contact support.',
      error: error.message,
    }
  }
}

export const updateOrderPaymentStatus = async (
  orderNumber,
  paymentStatus,
  paymentIntentId,
  customerData = {}
) => {
  try {
    const updates = {
      payment_status: paymentStatus,
      stripe_payment_intent_id: paymentIntentId,
    };

    // When payment succeeds, update full customer + address info
    if (paymentStatus === 'succeeded') {
      updates.status = 'paid';
      updates.paid_at = new Date().toISOString();

      if (customerData.name) {
        const [firstName, ...last] = customerData.name.trim().split(' ');
        updates.customer_first_name = firstName;
        updates.customer_last_name = last.join(' ');
      }

      if (customerData.email)
        updates.customer_email = customerData.email.toLowerCase();

      if (customerData.address) {
        updates.shipping_address_line1 = customerData.address;
        updates.shipping_city = customerData.city || '';
        updates.shipping_state = customerData.state || '';
        updates.shipping_postal_code = customerData.zipCode || '';
        updates.shipping_country = customerData.country || 'US';
      }
    } else if (paymentStatus === 'failed') {
      updates.status = 'payment_failed';
      updates.internal_notes = 'Payment failed during confirmation.';
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('order_number', orderNumber)
      .select();

    if (error) throw error;

    // Send webhook notification for successful purchases (non-blocking)
    if (paymentStatus === 'succeeded' && data && data[0]) {
      try {
        // Fetch order items for complete webhook data
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', data[0].id);

        await fetch('https://n8n-production-0d7d.up.railway.app/webhook/serenity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_type: 'purchase',
            order_number: orderNumber,
            customer: {
              email: data[0].customer_email,
              first_name: data[0].customer_first_name,
              last_name: data[0].customer_last_name,
              phone: data[0].customer_phone,
            },
            shipping_address: {
              line1: data[0].shipping_address_line1,
              line2: data[0].shipping_address_line2,
              city: data[0].shipping_city,
              state: data[0].shipping_state,
              postal_code: data[0].shipping_postal_code,
              country: data[0].shipping_country,
            },
            order_details: {
              subtotal: data[0].subtotal,
              shipping_cost: data[0].shipping_cost,
              tax: data[0].tax,
              total: data[0].total,
              currency: data[0].currency,
              items: orderItems || [],
            },
            payment: {
              status: data[0].payment_status,
              stripe_payment_intent_id: data[0].stripe_payment_intent_id,
              paid_at: data[0].paid_at,
            },
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (webhookError) {
        // Silently log webhook errors - don't affect user experience
        console.error('Webhook notification failed:', webhookError)
      }
    }

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Update order payment status error:', error);
    return {
      success: false,
      message: 'Failed to update order status.',
    };
  }
};


// Get order by order number
export const getOrder = async (orderNumber) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', orderNumber)
      .single()

    if (error) {
      throw error
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('Get order error:', error)
    return {
      success: false,
      message: 'Order not found.',
    }
  }
}

// Get customer orders by email
export const getCustomerOrders = async (email) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_email', email.toLowerCase())
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('Get customer orders error:', error)
    return {
      success: false,
      message: 'Failed to retrieve orders.',
    }
  }
}
