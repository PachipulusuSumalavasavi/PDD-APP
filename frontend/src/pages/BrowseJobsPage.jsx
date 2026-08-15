import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { dataStore } from '../services/dataStore';
import api from '../services/api';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Bookmark, 
  Filter, 
  Send, 
  CheckCircle2
} from 'lucide-react';

const BrowseJobsPage = () => {
  const { user } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);

  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [savedJobs, setSavedJobs] = useState([]);
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadJobsAndApps = () => {
    const allJobs = dataStore.getJobs();
    setJobs(allJobs);

    const apps = dataStore.getApplications();
    const myApps = apps.filter(a => a.studentId === user?._id || a.student?.email === user?.email);
    setAppliedJobIds(myApps.map(a => a.jobId || a.job?._id));
  };

  useEffect(() => {
    loadJobsAndApps();
  }, [user]);

  const filteredJobs = jobs.filter(j => {
    const matchKeyword = j.title.toLowerCase().includes(keyword.toLowerCase()) || 
                         j.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
                         j.description.toLowerCase().includes(keyword.toLowerCase());
    const matchType = typeFilter === 'All' || j.type === typeFilter;
    return matchKeyword && matchType;
  });

  const toggleSave = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Save dynamically to dataStore
    dataStore.applyForJob(selectedJob._id, user, coverLetter);
    
    try {
      await api.post('/applications/apply', { jobId: selectedJob._id, coverLetter });
    } catch (e) {
      // ignore
    }

    addNotification({
      title: 'Application Submitted! 🎉',
      message: `Your application for ${selectedJob.title} at ${selectedJob.companyName} was submitted.`,
      type: 'status_update'
    });

    setIsSubmitting(false);
    setSelectedJob(null);
    setCoverLetter('');
    loadJobsAndApps();
  };

  return (
    <div>
      <Navbar 
        title="Browse Opportunities" 
        subtitle="Discover internships and placement positions posted by verified recruiters" 
      />

      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="form-input" 
              style={{ paddingLeft: '2.5rem' }} 
              placeholder="Search position title, recruiter, or skill requirement..." 
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} color="var(--text-secondary)" />
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)} 
              className="form-select"
              style={{ width: '160px' }}
            >
              <option value="All">All Types</option>
              <option value="Internship">Internship</option>
              <option value="Placement">Placement</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {filteredJobs.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No opportunity postings match your search filters.</p>
          </div>
        ) : (
          filteredJobs.map(job => {
            const isApplied = appliedJobIds.includes(job._id);
            const isSaved = savedJobs.includes(job._id);
            const daysLeft = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));

            return (
              <div key={job._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <span className="status-pill status-Shortlisted" style={{ fontSize: '0.7rem', marginBottom: '0.4rem' }}>
                        {job.type}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700 }}>{job.title}</h3>
                      <p style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.85rem' }}>{job.companyName}</p>
                    </div>
                    <button 
                      onClick={() => toggleSave(job._id)} 
                      style={{ background: 'none', border: 'none', color: isSaved ? 'var(--accent-amber)' : 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <Bookmark size={20} fill={isSaved ? 'var(--accent-amber)' : 'none'} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} /> {job.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)' }}>
                      <DollarSign size={14} /> {job.stipendOrSalary}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {job.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    {job.requirements?.map((req, idx) => (
                      <span key={idx} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', border: 'var(--glass-border)', color: 'var(--text-secondary)' }}>
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ paddingTop: '0.75rem', borderTop: 'var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: daysLeft <= 3 ? 'var(--accent-rose)' : 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline closing'}
                  </span>

                  {isApplied ? (
                    <span style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={16} /> Applied
                    </span>
                  ) : (
                    <button onClick={() => setSelectedJob(job)} className="btn btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}>
                      Apply Opportunity
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} title={`Apply for ${selectedJob?.title}`}>
        <form onSubmit={handleApplySubmit}>
          <div className="form-group">
            <label className="form-label">Position & Company</label>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{selectedJob?.title} at {selectedJob?.companyName}</p>
          </div>

          <div className="form-group">
            <label className="form-label">Attached Resume</label>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>📄 {user?.studentDetails?.resumeUrl || `${user?.name?.replace(/\s+/g, '_')}_Resume.pdf`}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>Default Active</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cover Letter / Note (Optional)</label>
            <textarea 
              value={coverLetter} 
              onChange={(e) => setCoverLetter(e.target.value)} 
              className="form-textarea" 
              rows={4} 
              placeholder="Why are you a great fit for this role?"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setSelectedJob(null)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Confirm Application'} <Send size={16} />
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BrowseJobsPage;
