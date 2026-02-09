import React, { createContext, useState, useEffect, useContext } from 'react';
import pwaUtils from '../utils/pwaUtils';

const PWAContext = createContext();

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};

export const PWAProvider = ({ children }) => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [storageInfo, setStorageInfo] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check installation status
    setIsInstalled(pwaUtils.isInstalled());
    setCanInstall(pwaUtils.canInstall());

    // Listen for online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for beforeinstallprompt to update canInstall
    const handleBeforeInstallPrompt = () => {
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled to update isInstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
        pwaUtils.showUpdateNotification();
      });
    }

    // Get storage info
    const fetchStorageInfo = async () => {
      const info = await pwaUtils.getStorageUsage();
      setStorageInfo(info);
    };

    fetchStorageInfo();

    // Check for updates periodically
    const updateInterval = setInterval(() => {
      pwaUtils.checkForUpdate();
    }, 30 * 60 * 1000); // Every 30 minutes

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(updateInterval);
    };
  }, []);

  const value = {
    isInstalled,
    canInstall,
    isOffline,
    storageInfo,
    updateAvailable,
    installPWA: () => pwaUtils.installPWA(),
    clearCache: () => pwaUtils.clearCache(),
    checkForUpdate: () => pwaUtils.checkForUpdate(),
    getStorageUsage: () => pwaUtils.getStorageUsage()
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
      {/* Offline Indicator */}
      {isOffline && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: '#ff9800',
          color: 'white',
          padding: '8px 16px',
          textAlign: 'center',
          zIndex: 10000,
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          <span>You are currently offline. Some features may be limited.</span>
        </div>
      )}

      {/* Install Button for mobile */}
      {canInstall && !isInstalled && (
        <button
          onClick={() => pwaUtils.installPWA()}
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            background: '#2d5016',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(45, 80, 22, 0.3)',
            zIndex: 9999,
            fontSize: '24px'
          }}
          title="Install App"
        >
          📱
        </button>
      )}
    </PWAContext.Provider>
  );
};

export default PWAContext;
