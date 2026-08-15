import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { AuthContext } from '../context/AuthContext';
import { dataStore } from '../services/dataStore';
import { PlusCircle, Users, Briefcase, Video, Building } from 'lucide-react';

const CompanyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [myJobs, setMyJobs] = useState([]);
  const [myAppsCount, setMyAppsCount] = useState(0);

  useEffect(() => {
    const jobs = dataStore.getJobs();
    const companyJobs = jobs.filter(j => j.company === user?._id || j.companyName === user?.companyDetails?.companyName || j.companyName === user?.name);
    setMyJobs(companyJobs);

    const apps = dataStore.getApplications();
    const companyJobIds = companyJobs.map(j => j._id);
    const relatedApps = apps.filter(a => companyJobIds.includes(a.jobId) || companyJobIds.includes(a.job?._id));
    setMyAppsCount(relatedApps.length);
  }, [user]);

  return (
    <div>
      <Navbar 
        title="Company & Recruiter Portal" 
        subtitle="Manage your opportunity postings, track candidates, and schedule interviews" 
      />

      <div className="grid-4">
        <StatCard title="Active Postings" value={myJobs.length} icon={Briefcase} color="var(--primary)" bg="rgba(99, 102, 241, 0.15)" />
        <StatCard title="Total Applicants" value={`${myAppsCount} Candidates`} icon={Users} color="var(--accent-cyan)" bg="rgba(6, 182, 212, 0.15)" />
        <StatCard title="Account Verification" value="Verified Recruiter ✅" icon={Building} color="var(--accent-emerald)" bg="rgba(16, 185, 129, 0.15)" />
        <StatCard title="Recruiter Status" value="Active" icon={Video} color="var(--accent-amber)" bg="rgba(245, 158, 11, 0.15)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700 }}>Your Posted Opportunities</h3>
            <Link to="/company/post-job" className="btn btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}>
              <PlusCircle size={16} /> Post Opportunity
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {myJobs.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                No active jobs posted yet. Click "Post Opportunity" to publish a new position.
              </p>
            ) : (
              myJobs.map(job => (
                <div key={job._id} style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: 'var(--glass-border)',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span className="status-pill status-Shortlisted" style={{ fontSize: '0.7rem' }}>{job.type}</span>
                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '4px' }}>{job.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📍 {job.location} • 💰 {job.stipendOrSalary}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to="/company/applicants" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Review Applicants
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Recruiter Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/company/post-job" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              <PlusCircle size={18} /> Post Internship / Job
            </Link>
            <Link to="/company/applicants" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              <Users size={18} /> Candidate Pipeline
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
