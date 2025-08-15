import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Button } from './shared/ui';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    return (
        <div style={{ color: 'white', padding: '2rem' }}>
            <h1>Welcome, {currentUser?.displayName || currentUser?.email}</h1>
            <p>You are now signed in.</p>
            <Button onClick={logout}>Sign Out</Button>
        </div>
    );
};

export default Dashboard;
