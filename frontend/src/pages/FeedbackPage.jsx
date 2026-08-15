import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([
    { id: 'f1', name: 'David Smith', email: 'david@student.edu', subject: 'Deadline Reminder Notification Request', message: 'Can we get SMS notifications in addition to email/in-app deadline alerts?', status: 'Pending', date: '2026-02-05' },
    { id: 'f2', name: 'Nexus Tech HR', email: 'hr@nexustech.com', subject: 'Company Verification Request', message: 'Uploaded official incorporation certificate for company portal verification.', status: 'Resolved', date: '2026-02-02' }
  ]);

  const handleResolve = (id) => {
    setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status: 'Resolved' } : f));
  };

  return (
    <div>
      <Navbar 
        title="User Feedbacks & Complaints" 
        subtitle="Review student inquiries, recruiter feedback, and platform support tickets" 
      />

      <div className="glass-card">
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={20} color="var(--primary)" /> Support Tickets ({feedbacks.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {feedbacks.map(f => (
            <div key={f.id} style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(15, 23, 42, 0.5)',
              border: 'var(--glass-border)',
              borderLeft: f.status === 'Resolved' ? '4px solid var(--accent-emerald)' : '4px solid var(--accent-amber)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <span className={`status-pill ${f.status === 'Resolved' ? 'status-Selected' : 'status-Interview'}`} style={{ fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                    {f.status} Ticket
                  </span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{f.subject}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>From: {f.name} ({f.email}) • {f.date}</p>
                </div>

                {f.status === 'Pending' && (
                  <button onClick={() => handleResolve(f.id)} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                    Mark Resolved
                  </button>
                )}
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                "{f.message}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
