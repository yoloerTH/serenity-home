import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Newsletter subscription function
export const subscribeToNewsletter = async (email) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        { 
          email: email.toLowerCase().trim(),
          source: 'website'
        }
      ])
      .select();

    if (error) {
      // Check if email already exists
      if (error.code === '23505') {
        return { 
          success: false, 
          message: 'This email is already subscribed!' 
        };
      }
      throw error;
    }

    return { 
      success: true, 
      message: 'Successfully subscribed! Check your inbox.',
      data 
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { 
      success: false, 
      message: 'Oops! Something went wrong. Please try again.' 
    };
  }
};
