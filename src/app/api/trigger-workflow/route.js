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
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed with status ${response.status}`);
    }

    const data = await response.json();

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
