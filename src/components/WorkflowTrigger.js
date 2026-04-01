'use client';

import { useState } from 'react';
import { triggerWorkflow } from '@/lib/workflow';

export default function WorkflowTrigger() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleTrigger = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      // You can pass any data you want to send to your n8n workflow
      const result = await triggerWorkflow({
        action: 'generate-post',
        timestamp: new Date().toISOString(),
        // Add any other data your workflow needs
      });

      setMessage('Workflow triggered successfully!');
      console.log('Workflow result:', result);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleTrigger}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Triggering...' : 'Trigger n8n Workflow'}
      </button>

      {message && (
        <p className={`mt-2 ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
