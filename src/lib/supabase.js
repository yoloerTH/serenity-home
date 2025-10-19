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

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `SH-${timestamp}-${random}`
}

// Create order in database
export const createOrder = async (orderData) => {
  try {
    const orderNumber = generateOrderNumber()
    
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          customer_email: orderData.email.toLowerCase().trim(),
          customer_name: orderData.name?.trim() || null,
          items: orderData.items,
          subtotal: orderData.subtotal,
          discount: orderData.discount,
          total: orderData.total,
          shipping_address: orderData.shippingAddress || null,
          stripe_payment_intent_id: orderData.paymentIntentId || null,
          payment_status: orderData.paymentStatus || 'pending',
          status: 'pending',
        },
      ])
      .select()

    if (error) {
      throw error
    }

    return {
      success: true,
      message: 'Order created successfully!',
      data: data[0],
      orderNumber,
    }
  } catch (error) {
    console.error('Create order error:', error)
    return {
      success: false,
      message: 'Failed to create order. Please contact support.',
    }
  }
}

// Update order payment status
export const updateOrderPaymentStatus = async (orderNumber, paymentStatus, paymentIntentId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        stripe_payment_intent_id: paymentIntentId,
        status: paymentStatus === 'succeeded' ? 'confirmed' : 'pending',
      })
      .eq('order_number', orderNumber)
      .select()

    if (error) {
      throw error
    }

    return {
      success: true,
      data: data[0],
    }
  } catch (error) {
    console.error('Update order payment status error:', error)
    return {
      success: false,
      message: 'Failed to update order status.',
    }
  }
}

// Get order by order number
export const getOrder = async (orderNumber) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
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
