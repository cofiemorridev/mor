import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-6">404</h1>
      <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
