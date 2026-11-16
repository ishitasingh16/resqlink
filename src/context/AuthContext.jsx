import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_ROLES = {
  NGO: {
    id: 'NGO',
    title: 'NGO / Relief Organization',
    defaultName: 'Care & Hope Foundation',
    badge: 'NGO Requester',
    description: 'Submit emergency supply requests, track prioritization, and monitor fulfillment status.',
    color: '#2563eb'
  },
  DONOR: {
    id: 'Donor',
    title: 'Resource Donor',
    defaultName: 'Apex Logistics Ltd',
    badge: 'Resource Donor',
    description: 'List emergency supplies, update inventory, manage warehouse locations, and view allocation progress.',
    color: '#059669'
  },
  VOLUNTEER: {
    id: 'Volunteer',
    title: 'Field Volunteer',
    defaultName: 'Dr. Priya Sharma',
    badge: 'Field Volunteer',
    description: 'Accept or decline transport & relief tasks, manage field skills, and update on-duty availability.',
    color: '#7c3aed'
  },
  ADMIN: {
    id: 'Admin',
    title: 'Relief Coordinator (Admin)',
    defaultName: 'State Disaster Operations HQ',
    badge: 'HQ Coordinator',
    description: 'Central overview, priority oversight, trigger automated matching, approve allocations, and inspect map.',
    color: '#dc2626'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('resqlink_user_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved session', e);
    }
    // Default to null so user arrives at login/welcome screen
    return null;
  });

  const [notificationCount, setNotificationCount] = useState(3);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Urgent Request Logged', message: 'Care & Hope Foundation requested 40 units of Insulin', time: '10m ago', unread: true },
    { id: 2, title: 'Resource Matched', message: 'Purified Water matched with Volunteer Vikram Raman', time: '35m ago', unread: true },
    { id: 3, title: 'System Notice', message: 'Demo mode active. Haversine distance engine ready.', time: '1h ago', unread: false }
  ]);

  const loginAsRole = (roleKey, customName = null) => {
    const roleConfig = DEMO_ROLES[roleKey.toUpperCase()] || DEMO_ROLES.NGO;
    const user = {
      role: roleConfig.id,
      roleKey: roleKey.toUpperCase(),
      name: customName || roleConfig.defaultName,
      badge: roleConfig.badge,
      color: roleConfig.color,
      isDemoSession: true,
      loginTime: new Date().toISOString()
    };
    setCurrentUser(user);
    try {
      localStorage.setItem('resqlink_user_session', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('resqlink_user_session');
    } catch (e) {
      console.error(e);
    }
  };

  const dismissNotifications = () => {
    setNotificationCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginAsRole,
        logout,
        isAuthenticated: !!currentUser,
        notifications,
        notificationCount,
        dismissNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
