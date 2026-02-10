import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const { trackPageView, trackEvent } = useAnalytics();

  React.useEffect(() => {
    trackPageView('/404');
    trackEvent('404_page', 'error', window.location.pathname);
  }, []);

  const handleHomeClick = () => {
    trackEvent('404_home_click', 'navigation', 'home_from_404');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            onClick={handleHomeClick}
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
