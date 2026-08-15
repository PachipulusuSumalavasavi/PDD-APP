import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Briefcase, 
  Calendar, 
  CheckSquare, 
  User, 
  PlusCircle, 
  Users, 
  ShieldCheck, 
  MessageSquare, 
  LogOut, 
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold'
        }}>
          <Sparkles size={22} />
        </div>
        <div className="logo-text">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, lineHeight: 1 }}>CareerMate</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>APPLICATIONS TRACKER</span>
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Student Navigation Links */}
        {user.role === 'student' && (
          <>
            <NavLink to="/student/dashboard" className={({ isActive }) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start' }}>
              <LayoutDashboard size={18} /> <span className="nav-label">Dashboard</span>
            </NavLink>
            <NavLink to="/student/jobs" className={({ isActive }) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start' }}>
              <Briefcase size={18} /> <span className="nav-label">Opportunities</span>
            </NavLink>
            <NavLink to="/student/tracker" className={({ isActive }) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start' }}>
              <CheckSquare size={18} /> <span className="nav-label">Application Tracker</span>
            </NavLink>
            <NavLink to="/student/calendar" className={({ isActive }) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start' }}>
              <Calendar size={18} /> <span className="nav-label">Deadlines & Calendar</span>
            </NavLink>
            <NavLink to="/student/profile" className={({ isActive }) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start' }}>
              <User size={18} /> <span className="nav-label">Profile & Resume</span>
            </NavLink>
          </>
        )}

        {/* Company Navigation Links */}
        {user.role === 'company' && (
          <>
            <NavLink to="/company/dashboard" className={({ isActive }) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start' }}>
              <LayoutDashboard size={18} /> <span className="nav-label">Dashboard</span>
            </NavLink>
            <NavLink to="/company/post-job" className={({ isActive }) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start' }}>
              <PlusCircle size={18} /> <span className="nav-label">Post Opportunity</span>
            </NavLink>
            <NavLink to="/company/applicants" className={({ isActive }) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start' }}>
              <Users size={18} /> <span className="nav-label">Applicants & Pipeline</span>
            </NavLink>
          </>
        )}

        {/* Admin Navigation Links */}
        {user.role === 'admin' && (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start' }}>
              <LayoutDashboard size={18} /> <span className="nav-label">Overview</span>
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start' }}>
              <ShieldCheck size={18} /> <span className="nav-label">User Accounts</span>
            </NavLink>
            <NavLink to="/admin/feedbacks" className={({ isActive }) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start' }}>
              <MessageSquare size={18} /> <span className="nav-label">Feedbacks & Moderation</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User Footer & Logout */}
      <div style={{ paddingTop: '1rem', borderTop: 'var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{user.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
          <LogOut size={16} /> <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
