import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'N8N webhook URL not configured' },
        { status: 500 }
      );
    }

    // Trigger the n8n workflow
    console.log('Triggering n8n webhook:', webhookUrl);
    console.log('Payload:', body);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('n8n response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n error response:', errorText);
      throw new Error(`n8n webhook failed with status ${response.status}: ${errorText}`);
    }

    // Try to parse response as JSON, but handle cases where it might not be
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log('n8n response:', data);

    return NextResponse.json({
      success: true,
      message: 'Workflow triggered successfully',
      data,
    });
  } catch (error) {
    console.error('Error triggering n8n workflow:', error);
    return NextResponse.json(
      { error: 'Failed to trigger workflow', details: error.message },
      { status: 500 }
    );
  }
}
