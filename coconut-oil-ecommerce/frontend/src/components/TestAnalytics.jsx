import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

const TestAnalytics = () => {
  const { trackEvent } = useAnalytics();

  const handleTest = () => {
    trackEvent('test_event', { message: 'Analytics working!' });
    alert('Analytics test successful! Check console.');
  };

  return (
    <button
      onClick={handleTest}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Test Analytics
    </button>
  );
};

export default TestAnalytics;
