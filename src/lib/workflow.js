/**
 * Trigger an n8n workflow with optional data payload
 * @param {Object} data - Data to send to the workflow
 * @returns {Promise<Object>} - Response from the workflow
 */
export async function triggerWorkflow(data = {}) {
  try {
    const response = await fetch('/api/trigger-workflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to trigger workflow');
    }

    return await response.json();
  } catch (error) {
    console.error('Error triggering workflow:', error);
    throw error;
  }
}
