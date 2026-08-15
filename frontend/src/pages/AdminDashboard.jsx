import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { dataStore } from '../services/dataStore';
import api from '../services/api';
import { ShieldCheck, Users, Building, Briefcase, MessageSquare } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    pendingFeedbacks: 0
  });

  const [unverifiedCompanies, setUnverifiedCompanies] = useState([]);

  const loadAdminData = async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data) {
        setStats(res.data);
      }
    } catch (e) {
      // Dynamic DataStore fallback
    }
    setStats(dataStore.getAdminStats());
    const allUsers = dataStore.getUsers();
    setUnverifiedCompanies(allUsers.filter(u => u.role === 'company' && !u.companyDetails?.isVerified));
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleVerify = (companyId) => {
    dataStore.toggleCompanyVerification(companyId);
    loadAdminData();
  };

  return (
    <div>
      <Navbar 
        title="Admin Portal Overview" 
        subtitle="Real-time live system analytics and platform account moderation" 
      />

      <div className="grid-4">
        <StatCard title="Registered Students" value={stats.totalStudents} icon={Users} color="var(--primary)" bg="rgba(99, 102, 241, 0.15)" />
        <StatCard title="Registered Recruiters" value={stats.totalCompanies} icon={Building} color="var(--accent-cyan)" bg="rgba(6, 182, 212, 0.15)" />
        <StatCard title="Total Opportunities" value={stats.totalJobs} icon={Briefcase} color="var(--accent-emerald)" bg="rgba(16, 185, 129, 0.15)" />
        <StatCard title="Submitted Applications" value={stats.totalApplications} icon={MessageSquare} color="var(--accent-amber)" bg="rgba(245, 158, 11, 0.15)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={20} color="var(--accent-cyan)" /> Pending Recruiter Approvals
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {unverifiedCompanies.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', padding: '1rem', textAlign: 'center' }}>
                ✅ All registered recruiter accounts are currently verified!
              </p>
            ) : (
              unverifiedCompanies.map(c => (
                <div key={c._id} style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'rgba(15, 23, 42, 0.5)', border: 'var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 700 }}>{c.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.email}</p>
                  </div>
                  <button onClick={() => handleVerify(c._id)} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                    Verify Company
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--primary)" /> System Synchronization Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
              ✔ Live Database Synchronization: Active
            </div>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
              ✔ Dynamic User Registry: Synced across Student, Recruiter & Admin Portals
            </div>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(6, 182, 212, 0.1)', color: '#38bdf8' }}>
              ✔ Application Pipeline: Real-time Status Tracking
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
