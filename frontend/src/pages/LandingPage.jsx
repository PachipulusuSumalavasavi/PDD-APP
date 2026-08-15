import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { Sparkles, CheckCircle, Clock, ShieldCheck, ArrowRight, Briefcase, Bell, Sun, Moon } from 'lucide-react';

const LandingPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Banner Navigation */}
      <header style={{
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 4rem',
        borderBottom: 'var(--border-color)',
        background: 'rgba(11, 15, 25, 0.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Brand Logo Left */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
          }}>
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            Career<span style={{ color: 'var(--accent-cyan)' }}>Mate</span>
          </h2>
        </Link>

        {/* Right Header Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{ padding: '0.6rem', borderRadius: '50%', cursor: 'pointer', height: '42px', width: '42px', justifyContent: 'center' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} color="#6366f1" />}
          </button>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.65rem 1.4rem', height: '42px', display: 'inline-flex', alignItems: 'center' }}>
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.65rem 1.4rem', height: '42px', display: 'inline-flex', alignItems: 'center' }}>
            Get Started <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '4.5rem 2rem', textAlign: 'center', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span className="status-pill status-Shortlisted" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', marginBottom: '1.75rem', display: 'inline-flex', alignItems: 'center' }}>
          ✨ The All-in-One Placement & Internship Tracking Ecosystem
        </span>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '3.5rem',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #818cf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          maxWidth: '920px'
        }}>
          Never Miss a Career Opportunity or Interview Deadline Again
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          CareerMate centralizes job discovery, application status pipelines, interactive calendar reminders, resume management, and recruiter shortlisting into one seamless platform.
        </p>

        {/* Centered Hero CTA Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', marginBottom: '4rem', width: '100%', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2.25rem', fontSize: '1rem', height: '50px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            Start Tracking Applications <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 2.25rem', fontSize: '1rem', height: '50px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '130px' }}>
            Sign In
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
          <div className="glass-card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Smart Deadline Reminders</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Automated countdown alerts and scheduled notifications before application closes or interviews start.</p>
          </div>

          <div className="glass-card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <CheckCircle size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Visual Pipeline Tracker</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Kanban status board for Applied, Shortlisted, Interview Scheduled, Selected, or Rejected positions.</p>
          </div>

          <div className="glass-card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Unified Recruiter & Admin Portals</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Companies can post opportunities and schedule interviews; Admins moderate and verify user accounts.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', padding: '2rem', textAlign: 'center', borderTop: 'var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        © 2026 CareerMate Application Tracking System. Built for Students, Recruiters & Placement Officers.
      </footer>
    </div>
  );
};

export default LandingPage;