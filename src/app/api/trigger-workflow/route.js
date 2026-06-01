import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Authenticate — same API_SECRET_KEY used by the posts route
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token || token !== process.env.API_SECRET_KEY) {
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

    const headers = { 'Content-Type': 'application/json' };
    if (bearerToken) {
      headers['Authorization'] = `Bearer ${bearerToken}`;
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
