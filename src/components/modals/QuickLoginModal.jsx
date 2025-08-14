import React, { useState } from 'react';
// CORRECTED IMPORT PATH
import { useAuth } from '../../contexts/SimpleAuthContext';
import { Button } from '../../shared/ui';

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
    // ... (rest of the component remains the same)
  );
};

export default QuickLoginModal;
