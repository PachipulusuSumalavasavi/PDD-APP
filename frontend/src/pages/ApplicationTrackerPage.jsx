import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';
import { dataStore } from '../services/dataStore';
import { 
  Video, 
  ChevronRight
} from 'lucide-react';

const ApplicationTrackerPage = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  const loadApplications = () => {
    const allApps = dataStore.getApplications();
    const myApps = allApps.filter(a => a.studentId === user?._id || a.student?.email === user?.email);
    setApplications(myApps);
  };

  useEffect(() => {
    loadApplications();
  }, [user]);

  const pipelineColumns = [
    { title: 'Applied', statusKey: 'Applied', color: '#818cf8' },
    { title: 'Shortlisted', statusKey: 'Shortlisted', color: '#38bdf8' },
    { title: 'Interview Scheduled', statusKey: 'Interview Scheduled', color: '#fbbf24' },
    { title: 'Selected / Offer', statusKey: 'Selected', color: '#34d399' },
    { title: 'Rejected', statusKey: 'Rejected', color: '#f87171' }
  ];

  return (
    <div>
      <Navbar 
        title="Application Status Tracker" 
        subtitle="Live dynamic visual pipeline of your application progress through each recruitment stage" 
      />

      <div className="kanban-board">
        {pipelineColumns.map(col => {
          const colApps = applications.filter(a => a.status === col.statusKey);

          return (
            <div key={col.statusKey} className="kanban-col">
              <div className="kanban-col-title" style={{ color: col.color }}>
                <span>{col.title}</span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px', borderRadius: '9999px' }}>
                  {colApps.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {colApps.length === 0 ? (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
                    No applications in this stage
                  </p>
                ) : (
                  colApps.map(app => (
                    <div 
                      key={app._id} 
                      onClick={() => setSelectedApp(app)}
                      className="glass-card" 
                      style={{ padding: '1rem', cursor: 'pointer', borderLeft: `3px solid ${col.color}` }}
                    >
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                        {app.job?.title || 'Software Role'}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
                        {app.job?.companyName || 'Recruiter Firm'}
                      </p>

                      {app.interviewDate && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.1)', padding: '0.3rem 0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.5rem' }}>
                          <Video size={12} /> {new Date(app.interviewDate).toLocaleDateString()}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>{new Date(app.appliedAt || Date.now()).toLocaleDateString()}</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title="Application Details & Status">
        {selectedApp && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <StatusBadge status={selectedApp.status} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, marginTop: '0.5rem' }}>
                {selectedApp.job?.title}
              </h3>
              <p style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{selectedApp.job?.companyName}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong>Location:</strong> {selectedApp.job?.location || 'Remote'}
              </div>
              <div>
                <strong>Stipend / Salary:</strong> {selectedApp.job?.stipendOrSalary}
              </div>
              <div>
                <strong>Applied On:</strong> {new Date(selectedApp.appliedAt || Date.now()).toLocaleString()}
              </div>

              {selectedApp.interviewDate && (
                <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.15)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <p style={{ fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Video size={16} /> Interview Scheduled
                  </p>
                  <p style={{ marginTop: '4px' }}>📅 Date & Time: {new Date(selectedApp.interviewDate).toLocaleString()}</p>
                  <p>📍 Location: {selectedApp.interviewLocation || 'Online Meeting Link'}</p>
                  {selectedApp.interviewNotes && <p>📝 Notes: {selectedApp.interviewNotes}</p>}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedApp(null)} className="btn btn-secondary">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApplicationTrackerPage;
