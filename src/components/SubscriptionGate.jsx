import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthProvider';

const SubscriptionGate = ({ feature, children, fallback }) => {
  const { subscription } = useAuth();

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-slate-400">Please sign in to access this feature.</p>
        </div>
      </div>
    );
  }

  // REMOVED PAYWALL - Full access to all features for testing
  return children;
};

export default SubscriptionGate;

