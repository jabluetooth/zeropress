'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { triggerWorkflow } from '@/lib/workflow';

export default function WorkflowTrigger() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleTrigger = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const result = await triggerWorkflow({
        action: 'generate-post',
        timestamp: new Date().toISOString(),
      });

      setMessage('Workflow triggered! Refreshing page...');

      timerRef.current = setTimeout(() => {
        router.refresh();
      }, 5000);
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
