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
    <div>
      <button
        onClick={handleTrigger}
        disabled={isLoading}
        className="btn-primary"
        style={{
          width: '100%',
          justifyContent: 'center',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {isLoading ? 'Generating...' : 'Generate New Post'}
      </button>

      {message && (
        <p style={{
          marginTop: '12px',
          fontSize: '0.8rem',
          color: message.startsWith('Error') ? '#ef4444' : '#22c55e',
        }}>
          {message}
        </p>
      )}
    </div>
  );
}
