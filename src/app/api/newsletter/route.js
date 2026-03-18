import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, unsubscribed')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existing && !existing.unsubscribed) {
      return NextResponse.json({ message: 'Already subscribed!' });
    }

    if (existing && existing.unsubscribed) {
      // Re-subscribe
      await supabase
        .from('subscribers')
        .update({ unsubscribed: false, subscribed_at: new Date().toISOString() })
        .eq('id', existing.id);

      return NextResponse.json({ message: 'Welcome back! Re-subscribed.' });
    }

    // New subscriber
    const { error } = await supabase
      .from('subscribers')
      .insert({ email: email.toLowerCase().trim() });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: 'Already subscribed!' });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subscribed successfully!' });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
