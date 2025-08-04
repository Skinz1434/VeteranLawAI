import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  // Simulate authentication check on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Simulate checking for existing session
      const savedUser = localStorage.getItem('veteranlawai_user');
      const savedSubscription = localStorage.getItem('veteranlawai_subscription');
      
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('veteranlawai_user');
        }
      }
      
      if (savedSubscription) {
        try {
          setSubscription(JSON.parse(savedSubscription));
        } catch (e) {
          localStorage.removeItem('veteranlawai_subscription');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    
    try {
      // Simulate Google OAuth flow
      const mockUser = {
        id: 'user_google_123',
        email: 'attorney@lawfirm.com',
        name: 'Sarah Mitchell',
        picture: 'https://via.placeholder.com/100x100/0ea5e9/ffffff?text=SM',
        provider: 'google',
        createdAt: new Date().toISOString(),
      };

      // Full access subscription for testing
      const mockSubscription = {
        plan: 'enterprise',
        status: 'active',
        trialEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        features: {
          cameraOCR: true,
          legalKnowledge: true,
          claimGuidance: true,
          audioTranscription: true,
          caseResearch: true,
          analytics: true,
        },
        limits: {
          documentsPerMonth: -1, // Unlimited
          searchesPerMonth: -1, // Unlimited
          storageGB: -1, // Unlimited
        },
        usage: {
          documentsThisMonth: 12,
          searchesThisMonth: 34,
          storageUsedGB: 0.3,
        }
      };

      setUser(mockUser);
      setSubscription(mockSubscription);
      
      localStorage.setItem('veteranlawai_user', JSON.stringify(mockUser));
      localStorage.setItem('veteranlawai_subscription', JSON.stringify(mockSubscription));
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    
    try {
      // For demo purposes, any email/password combination works
      const mockUser = {
        id: 'user_email_' + Date.now(),
        email,
        name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        picture: `https://via.placeholder.com/100x100/0ea5e9/ffffff?text=${email.charAt(0).toUpperCase()}`,
        provider: 'email',
        createdAt: new Date().toISOString(),
      };

      const mockSubscription = {
        plan: 'enterprise',
        status: 'active',
        trialEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year for testing
        features: {
          cameraOCR: true,
          legalKnowledge: true,
          claimGuidance: true,
          audioTranscription: true,
          caseResearch: true,
          analytics: true,
        },
        limits: {
          documentsPerMonth: -1, // Unlimited
          searchesPerMonth: -1, // Unlimited
          storageGB: -1, // Unlimited
        },
        usage: {
          documentsThisMonth: 0,
          searchesThisMonth: 0,
          storageUsedGB: 0,
        }
      };

      setUser(mockUser);
      setSubscription(mockSubscription);
      
      localStorage.setItem('veteranlawai_user', JSON.stringify(mockUser));
      localStorage.setItem('veteranlawai_subscription', JSON.stringify(mockSubscription));
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const createAccount = async (email, password, name) => {
    setLoading(true);
    
    try {
      // Simulate account creation
      const mockUser = {
        id: 'user_new_' + Date.now(),
        email,
        name: name || email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        picture: `https://via.placeholder.com/100x100/0ea5e9/ffffff?text=${(name || email).split(' ').map(n => n[0]).join('').toUpperCase()}`,
        provider: 'email',
        createdAt: new Date().toISOString(),
      };

      const mockSubscription = {
        plan: 'enterprise',
        status: 'active',
        trialEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year for testing
        features: {
          cameraOCR: true,
          legalKnowledge: true,
          claimGuidance: true,
          audioTranscription: true,
          caseResearch: true,
          analytics: true,
        },
        limits: {
          documentsPerMonth: -1, // Unlimited
          searchesPerMonth: -1, // Unlimited
          storageGB: -1, // Unlimited
        },
        usage: {
          documentsThisMonth: 0,
          searchesThisMonth: 0,
          storageUsedGB: 0,
        }
      };

      setUser(mockUser);
      setSubscription(mockSubscription);
      
      localStorage.setItem('veteranlawai_user', JSON.stringify(mockUser));
      localStorage.setItem('veteranlawai_subscription', JSON.stringify(mockSubscription));
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const signOut = () => {
    setUser(null);
    setSubscription(null);
    localStorage.removeItem('veteranlawai_user');
    localStorage.removeItem('veteranlawai_subscription');
  };

  const upgradeSubscription = (plan) => {
    const upgradedSubscription = {
      ...subscription,
      plan,
      status: 'active',
      features: {
        cameraOCR: true,
        legalKnowledge: true,
        claimGuidance: true,
        audioTranscription: plan !== 'solo',
        caseResearch: plan !== 'solo',
        analytics: plan === 'enterprise',
      },
      limits: {
        documentsPerMonth: plan === 'solo' ? 500 : plan === 'firm' ? 2000 : -1,
        searchesPerMonth: plan === 'solo' ? 1000 : plan === 'firm' ? 5000 : -1,
        storageGB: plan === 'solo' ? 5 : plan === 'firm' ? 50 : 500,
      }
    };

    setSubscription(upgradedSubscription);
    localStorage.setItem('veteranlawai_subscription', JSON.stringify(upgradedSubscription));
  };

  const hasFeatureAccess = (feature) => {
    if (!subscription) return false;
    return subscription.features[feature] === true;
  };

  const isWithinLimits = (limitType) => {
    if (!subscription) return false;
    const limit = subscription.limits[limitType];
    const usage = subscription.usage[limitType];
    
    if (limit === -1) return true; // Unlimited
    return usage < limit;
  };

  const value = {
    user,
    subscription,
    loading,
    signInWithGoogle,
    signIn,
    createAccount,
    signOut,
    upgradeSubscription,
    hasFeatureAccess,
    isWithinLimits,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

