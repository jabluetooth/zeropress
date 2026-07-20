import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/adminSession';

export async function POST(request) {
  try {
    // Accept: a short-lived admin session token (issued by /api/admin/verify),
    // or the raw API_SECRET_KEY / ADMIN_SECRET for direct API callers.
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const adminSecret = process.env.ADMIN_SECRET;
    const validTokens = [process.env.API_SECRET_KEY, adminSecret].filter(Boolean);

    const isValid =
      !!token &&
      (validTokens.includes(token) || (adminSecret && verifySessionToken(token, adminSecret)));

    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    const bearerToken = process.env.N8N_BEARER_TOKEN;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'N8N webhook URL not configured' },
        { status: 500 }
      );
    }

    // n8n's Webhook node is configured with Header Auth expecting a header
    // literally named N8N_BEARER_TOKEN (not a standard Authorization: Bearer
    // header) — match that here, or webhook calls will 401/403 at n8n.
    const headers = { 'Content-Type': 'application/json' };
    if (bearerToken) {
      headers['N8N_BEARER_TOKEN'] = bearerToken;
    }

    console.log('[trigger-workflow] POSTing to n8n:', webhookUrl);
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log('[trigger-workflow] n8n status:', response.status);
    console.log('[trigger-workflow] n8n response:', responseText);

    if (!response.ok) {
      throw new Error(`n8n returned ${response.status}: ${responseText}`);
    }

    let data;
    try { data = JSON.parse(responseText); } catch { data = responseText; }

    return NextResponse.json({ success: true, message: 'Workflow triggered successfully', data });
  } catch (error) {
    console.error('[trigger-workflow] error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
