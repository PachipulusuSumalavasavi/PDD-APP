import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { ThemeContext } from '../context/ThemeContext';
import { Bell, Check, Sun, Moon } from 'lucide-react';

const Navbar = ({ title, subtitle }) => {
  const { user } = useContext(AuthContext);
  const { notifications, markAllRead } = useContext(NotificationContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="top-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Theme Toggle Button (Light / Dark Mode) */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ padding: '0.6rem', borderRadius: '50%', cursor: 'pointer' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} color="#6366f1" />}
        </button>

        {/* Real-time Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="btn btn-secondary" 
            style={{ padding: '0.6rem', borderRadius: '50%', position: 'relative' }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: 'var(--accent-rose)',
                color: '#fff',
                borderRadius: '50%',
                fontSize: '0.65rem',
                fontWeight: 'bold',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="glass-card" style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              width: '320px',
              zIndex: 500,
              padding: '1rem',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: 'var(--border-color)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Notifications & Alerts</h4>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Check size={12} /> Mark read
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>No notifications yet.</p>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} style={{
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: n.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.1)',
                      borderLeft: n.type === 'interview' ? '3px solid var(--accent-amber)' : n.type === 'deadline' ? '3px solid var(--accent-rose)' : '3px solid var(--primary)'
                    }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{n.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
