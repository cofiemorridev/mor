import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAnalytics } from './AnalyticsContext';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { trackEvent } = useAnalytics();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('coconutOilUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      }
    }
    setLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('coconutOilUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('coconutOilUser');
    }
  }, [user]);

  // Login function
  const login = async (email, password) => {
    try {
      // For now, mock login - in production, connect to backend
      const mockUser = {
        id: 'user_' + Date.now(),
        email,
        name: email.split('@')[0],
        token: 'mock_token_' + Date.now(),
        role: 'customer',
        createdAt: new Date().toISOString()
      };

      setUser(mockUser);
      
      trackEvent({
        action: 'login',
        category: 'authentication',
        label: 'User logged in'
      });

      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      // For now, mock signup
      const mockUser = {
        id: 'user_' + Date.now(),
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        token: 'mock_token_' + Date.now(),
        role: 'customer',
        createdAt: new Date().toISOString()
      };

      setUser(mockUser);
      
      trackEvent({
        action: 'signup',
        category: 'authentication',
        label: 'New user signed up'
      });

      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    trackEvent({
      action: 'logout',
      category: 'authentication',
      label: 'User logged out'
    });
    
    setUser(null);
  };

  // Update user profile
  const updateProfile = (updates) => {
    setUser(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString()
    }));

    trackEvent({
      action: 'update_profile',
      category: 'user',
      label: 'User updated profile'
    });
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    loading,
    isAuthenticated: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
