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

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n webhook failed:', response.status);
      throw new Error(`n8n webhook failed with status ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    return NextResponse.json({ success: true, message: 'Workflow triggered successfully', data });
  } catch (error) {
    console.error('Error triggering n8n workflow:', error.message);
    return NextResponse.json({ error: 'Failed to trigger workflow' }, { status: 500 });
  }
}
