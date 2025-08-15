import React, { useState } from 'react';
import { useAuth } from '../contexts/SimpleAuthContext.jsx';
import { Button } from '../shared/ui';

const QuickLoginModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { loginWithEmail } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    await loginWithEmail('demo@veteranlawai.com', 'demo');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-8 rounded-lg max-w-sm w-full text-center">
        <h2 className="text-white text-3xl font-bold mb-4">Demo Access</h2>
        <p className="text-slate-300 mb-8">
          This will sign you into a simulated demo environment.
        </p>
        <Button onClick={handleLogin} disabled={loading} className="w-full text-lg py-3">
          {loading ? 'Initializing...' : 'Enter Demo'}
        </Button>
        <Button onClick={onClose} variant="secondary" className="w-full mt-3">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default QuickLoginModal;
