import React, { useEffect } from 'react';
import socket from '../services/socket';
import toast from 'react-hot-toast';

const Dashboard = () => {
  useEffect(() => {
    // Connect socket
    socket.connect();

    // Event listeners
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socket.on('newPost', (data) => {
      console.log('Received newPost event:', data);
      toast.success(data.message, {
        duration: 4000,
        position: 'top-right',
      });
    });

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('newPost');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Welcome to your creator platform. Notifications will appear here.</p>
      <div className="status-indicator">
        <span className="dot"></span> Real-time connection active
      </div>
    </div>
  );
};

export default Dashboard;
