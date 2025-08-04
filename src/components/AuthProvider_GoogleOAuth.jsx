import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'demo-client-id';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Load Google OAuth script
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        setGoogleLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          setGoogleLoaded(true);
        }
      };
      script.onerror = () => {
        console.error('Failed to load Google OAuth script');
        setGoogleLoaded(false);
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('veteranlawai_user');
        const savedSubscription = localStorage.getItem('veteranlawai_subscription');
        
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            console.log('Restored user from localStorage:', userData);
          } catch (e) {
            console.error('Error parsing saved user data:', e);
            localStorage.removeItem('veteranlawai_user');
          }
        }
        
        if (savedSubscription) {
          try {
            const subscriptionData = JSON.parse(savedSubscription);
            setSubscription(subscriptionData);
            console.log('Restored subscription from localStorage:', subscriptionData);
          } catch (e) {
            console.error('Error parsing saved subscription data:', e);
            localStorage.removeItem('veteranlawai_subscription');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle Google OAuth response
  const handleGoogleResponse = async (response) => {
    try {
      console.log('Google OAuth response received:', response);
      
      // Decode the JWT token to get user info
      const token = response.credential;
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      console.log('Google user payload:', payload);
      
      // Check if this is an admin email
      const adminEmails = ['skinnermk1434@gmail.com', 'daniel.j.hoover@gmail.com'];
      const isAdmin = adminEmails.includes(payload.email.toLowerCase());
      
      const userData = {
        id: 'google_' + payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        provider: 'google',
        createdAt: new Date().toISOString(),
        isAdmin: isAdmin,
        role: isAdmin ? 'admin' : 'user',
        googleToken: token
      };

      const subscriptionData = {
        plan: isAdmin ? 'admin' : 'enterprise',
        status: 'active',
        trialEndsAt: isAdmin ? null : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        features: {
          cameraOCR: true,
          legalKnowledge: true,
          claimGuidance: true,
          audioTranscription: true,
          caseResearch: true,
          analytics: true,
          adminPanel: isAdmin,
          userManagement: isAdmin,
          systemSettings: isAdmin,
        },
        limits: {
          documentsPerMonth: isAdmin ? -1 : 500,
          searchesPerMonth: isAdmin ? -1 : 1000,
          storageGB: isAdmin ? -1 : 5,
        },
        usage: {
          documentsThisMonth: 0,
          searchesThisMonth: 0,
          storageUsedGB: 0,
        }
      };

      setUser(userData);
      setSubscription(subscriptionData);
      
      localStorage.setItem('veteranlawai_user', JSON.stringify(userData));
      localStorage.setItem('veteranlawai_subscription', JSON.stringify(subscriptionData));
      
      console.log('User authenticated successfully:', userData);
      
      // Track user login for analytics
      trackUserLogin(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Error handling Google response:', error);
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    
    try {
      if (!googleLoaded || !window.google) {
        throw new Error('Google OAuth not loaded');
      }

      console.log('Initiating Google sign in...');
      
      // Use Google One Tap or popup
      window.google.accounts.id.prompt((notification) => {
        console.log('Google prompt notification:', notification);
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to popup
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            { theme: 'outline', size: 'large' }
          );
        }
      });
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Google sign in error:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    
    try {
      console.log('Email sign in attempt:', email);
      
      // Check if this is an admin email
      const adminEmails = ['skinnermk1434@gmail.com', 'daniel.j.hoover@gmail.com'];
      const isAdmin = adminEmails.includes(email.toLowerCase());
      
      const userData = {
        id: isAdmin ? 'admin_' + Date.now() : 'user_email_' + Date.now(),
        email,
        name: isAdmin ? 
          (email.includes('skinnermk1434') ? 'Admin User' : 'Daniel J. Hoover') :
          email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        picture: `https://via.placeholder.com/100x100/0ea5e9/ffffff?text=${email.charAt(0).toUpperCase()}`,
        provider: 'email',
        createdAt: new Date().toISOString(),
        isAdmin: isAdmin,
        role: isAdmin ? 'admin' : 'user'
      };

      const subscriptionData = {
        plan: isAdmin ? 'admin' : 'enterprise',
        status: 'active',
        trialEndsAt: isAdmin ? null : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        features: {
          cameraOCR: true,
          legalKnowledge: true,
          claimGuidance: true,
          audioTranscription: true,
          caseResearch: true,
          analytics: true,
          adminPanel: isAdmin,
          userManagement: isAdmin,
          systemSettings: isAdmin,
        },
        limits: {
          documentsPerMonth: isAdmin ? -1 : 500,
          searchesPerMonth: isAdmin ? -1 : 1000,
          storageGB: isAdmin ? -1 : 5,
        },
        usage: {
          documentsThisMonth: 0,
          searchesThisMonth: 0,
          storageUsedGB: 0,
        }
      };

      setUser(userData);
      setSubscription(subscriptionData);
      
      localStorage.setItem('veteranlawai_user', JSON.stringify(userData));
      localStorage.setItem('veteranlawai_subscription', JSON.stringify(subscriptionData));
      
      console.log('Email authentication successful:', userData);
      
      // Track user login for analytics
      trackUserLogin(userData);
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Email sign in error:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const createAccount = async (email, password, name) => {
    setLoading(true);
    
    try {
      console.log('Creating account for:', email);
      
      // Check if this is an admin email
      const adminEmails = ['skinnermk1434@gmail.com', 'daniel.j.hoover@gmail.com'];
      const isAdmin = adminEmails.includes(email.toLowerCase());
      
      const userData = {
        id: isAdmin ? 'admin_new_' + Date.now() : 'user_new_' + Date.now(),
        email,
        name: isAdmin ? 
          (email.includes('skinnermk1434') ? 'Admin User' : 'Daniel J. Hoover') :
          (name || email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
        picture: `https://via.placeholder.com/100x100/0ea5e9/ffffff?text=${(name || email).split(' ').map(n => n[0]).join('').toUpperCase()}`,
        provider: 'email',
        createdAt: new Date().toISOString(),
        isAdmin: isAdmin,
        role: isAdmin ? 'admin' : 'user'
      };

      const subscriptionData = {
        plan: isAdmin ? 'admin' : 'trial',
        status: 'active',
        trialEndsAt: isAdmin ? null : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        features: {
          cameraOCR: true,
          legalKnowledge: true,
          claimGuidance: true,
          audioTranscription: isAdmin,
          caseResearch: isAdmin,
          analytics: isAdmin,
          adminPanel: isAdmin,
          userManagement: isAdmin,
          systemSettings: isAdmin,
        },
        limits: {
          documentsPerMonth: isAdmin ? -1 : 100,
          searchesPerMonth: isAdmin ? -1 : 200,
          storageGB: isAdmin ? -1 : 1,
        },
        usage: {
          documentsThisMonth: 0,
          searchesThisMonth: 0,
          storageUsedGB: 0,
        }
      };

      setUser(userData);
      setSubscription(subscriptionData);
      
      localStorage.setItem('veteranlawai_user', JSON.stringify(userData));
      localStorage.setItem('veteranlawai_subscription', JSON.stringify(subscriptionData));
      
      console.log('Account created successfully:', userData);
      
      // Track user registration for analytics
      trackUserRegistration(userData);
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Account creation error:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const signOut = () => {
    console.log('Signing out user');
    setUser(null);
    setSubscription(null);
    localStorage.removeItem('veteranlawai_user');
    localStorage.removeItem('veteranlawai_subscription');
    
    // Sign out from Google if applicable
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
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
        adminPanel: user?.isAdmin || false,
        userManagement: user?.isAdmin || false,
        systemSettings: user?.isAdmin || false,
      },
      limits: {
        documentsPerMonth: plan === 'solo' ? 500 : plan === 'firm' ? 2000 : -1,
        searchesPerMonth: plan === 'solo' ? 1000 : plan === 'firm' ? 5000 : -1,
        storageGB: plan === 'solo' ? 5 : plan === 'firm' ? 50 : 500,
      }
    };

    setSubscription(upgradedSubscription);
    localStorage.setItem('veteranlawai_subscription', JSON.stringify(upgradedSubscription));
    
    console.log('Subscription upgraded to:', plan);
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

  // Analytics tracking functions
  const trackUserLogin = (userData) => {
    try {
      console.log('Tracking user login:', userData.email);
      // Here you would integrate with your analytics service
      // Example: Google Analytics, Mixpanel, etc.
    } catch (error) {
      console.error('Error tracking user login:', error);
    }
  };

  const trackUserRegistration = (userData) => {
    try {
      console.log('Tracking user registration:', userData.email);
      // Here you would integrate with your analytics service
    } catch (error) {
      console.error('Error tracking user registration:', error);
    }
  };

  const value = {
    user,
    subscription,
    loading,
    googleLoaded,
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
      {/* Hidden div for Google sign-in button */}
      <div id="google-signin-button" style={{ display: 'none' }}></div>
    </AuthContext.Provider>
  );
};

export default AuthProvider;

