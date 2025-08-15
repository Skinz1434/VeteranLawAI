import React from 'react';
import { useAuth } from './contexts/SimpleAuthContext';
import { Button } from './shared/ui';

const Dashboard = () => {
    const { user, logout } = useAuth();
    return (
        <div style={{ color: 'white', padding: '2rem' }}>
            <h1>Welcome, {user.name}</h1>
            <p>You are now in the functional demo environment.</p>
            <Button onClick={logout}>Sign Out</Button>
        </div>
    );
};

export default Dashboard;
