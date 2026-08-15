import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { AuthContext } from '../context/AuthContext';
import { dataStore } from '../services/dataStore';
import { 
  Briefcase, 
  CheckSquare, 
  Clock, 
  Video, 
  ArrowRight, 
  TrendingUp
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    appliedCount: 0,
    shortlistedCount: 0,
    interviewCount: 0,
    selectedCount: 0
  });

  const loadStudentData = () => {
    const allApps = dataStore.getApplications();
    const myApps = allApps.filter(a => a.studentId === user?._id || a.student?.email === user?.email);
    setApplications(myApps);

    setStats({
      totalApplications: myApps.length,
      appliedCount: myApps.filter(a => a.status === 'Applied').length,
      shortlistedCount: myApps.filter(a => a.status === 'Shortlisted').length,
      interviewCount: myApps.filter(a => a.status === 'Interview Scheduled').length,
      selectedCount: myApps.filter(a => a.status === 'Selected').length
    });
  };

  useEffect(() => {
    loadStudentData();
  }, [user]);

  const upcomingInterview = applications.find(a => a.status === 'Interview Scheduled');

  return (
    <div>
      <Navbar 
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Student'} 👋`} 
        subtitle="Track your applications and stay on top of upcoming interview deadlines" 
      />

      <div className="grid-4">
        <StatCard title="Total Applications" value={stats.totalApplications} icon={Briefcase} color="var(--primary)" bg="rgba(99, 102, 241, 0.15)" />
        <StatCard title="Shortlisted" value={stats.shortlistedCount} icon={TrendingUp} color="var(--accent-cyan)" bg="rgba(6, 182, 212, 0.15)" />
        <StatCard title="Interviews Calls" value={stats.interviewCount} icon={Video} color="var(--accent-amber)" bg="rgba(245, 158, 11, 0.15)" />
        <StatCard title="Selected Offers" value={stats.selectedCount} icon={CheckSquare} color="var(--accent-emerald)" bg="rgba(16, 185, 129, 0.15)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700 }}>Your Application Pipeline</h3>
            <Link to="/student/tracker" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              View Pipeline Board <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {applications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>You have not applied for any positions yet.</p>
                <Link to="/student/jobs" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                  Browse & Apply Opportunities
                </Link>
              </div>
            ) : (
              applications.map(app => (
                <div key={app._id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: 'var(--glass-border)'
                }}>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{app.job?.title || 'Software Position'}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{app.job?.companyName} • {app.job?.location}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={app.status} />
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {upcomingInterview ? (
            <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-amber)' }}>
                <Video size={20} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Scheduled Interview
                </h3>
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{upcomingInterview.job?.title}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{upcomingInterview.job?.companyName}</p>
              <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#fbbf24' }}>
                📅 {new Date(upcomingInterview.interviewDate || Date.now()).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="glass-card">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                No Upcoming Interviews
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Keep applying! Recruiters will notify you when shortlisted.</p>
            </div>
          )}

          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-rose)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-rose)' }}>
              <Clock size={20} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Smart Deadline Reminders
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Check closing deadlines on active job postings before application windows end.
            </p>
            <Link to="/student/calendar" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}>
              View Deadlines Calendar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
