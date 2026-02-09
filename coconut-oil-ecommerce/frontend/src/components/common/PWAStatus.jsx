import React from 'react';
import { usePWA } from '../../context/PWAContext';

const PWAStatus = () => {
  const { isInstalled, isOffline, storageInfo, updateAvailable } = usePWA();

  if (!isInstalled && !isOffline && !updateAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      {/* Update Available Badge */}
      {updateAvailable && (
        <div className="bg-amber-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <span>🔄</span>
          <span className="text-sm font-medium">Update Available</span>
          <button 
            onClick={() => window.location.reload()}
            className="ml-2 bg-white text-amber-700 px-2 py-1 rounded text-xs font-semibold hover:bg-amber-50"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Offline Badge */}
      {isOffline && (
        <div className="bg-orange-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <span>⚠️</span>
          <span className="text-sm font-medium">Offline Mode</span>
        </div>
      )}

      {/* Installed Badge */}
      {isInstalled && (
        <div className="bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <span>📱</span>
          <span className="text-sm font-medium">App Installed</span>
        </div>
      )}

      {/* Storage Info (Debug) */}
      {storageInfo && process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg">
          <div className="text-xs">
            Storage: {storageInfo.percentage}% used
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
            <div 
              className="bg-green-500 h-1 rounded-full"
              style={{ width: `${storageInfo.percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PWAStatus;
