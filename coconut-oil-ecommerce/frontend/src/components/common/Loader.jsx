import React from 'react';

const Loader = ({ type = 'page' }) => {
  if (type === 'inline') {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (type === 'button') {
    return (
      <div className="inline-flex items-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        <span>Loading...</span>
      </div>
    );
  }

  // Full page loader
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="relative">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-green-600 border-t-transparent animate-spin"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl">🥥</div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading</h2>
          <div className="flex justify-center space-x-1">
            <div className="h-2 w-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-2 w-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-2 w-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-gray-600 mt-4">Preparing your coconut oil experience...</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
