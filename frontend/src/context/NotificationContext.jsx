import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      _id: 'n1',
      title: 'Interview Scheduled! 📅',
      message: 'Nexus Tech Innovations scheduled an interview for Full-Stack Developer Intern.',
      type: 'interview',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'n2',
      title: 'Deadline Alert: 2 Days Left ⏳',
      message: 'Application deadline for Graduate Placement Engineer closes soon.',
      type: 'deadline',
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (e) {
      // Keep initial fallback notifications
    }
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await api.put('/notifications/read-all');
    } catch (e) {
      // ignore
    }
  };

  const addNotification = (notif) => {
    setNotifications(prev => [
      {
        _id: `n-${Date.now()}`,
        isRead: false,
        createdAt: new Date().toISOString(),
        ...notif
      },
      ...prev
    ]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, fetchNotifications, markAllRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
