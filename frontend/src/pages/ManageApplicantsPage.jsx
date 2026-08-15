import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';
import { dataStore } from '../services/dataStore';
import api from '../services/api';
import { Users, Video, FileText, Send } from 'lucide-react';

const ManageApplicantsPage = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewLocation, setInterviewLocation] = useState('Google Meet Link');
  const [interviewNotes, setInterviewNotes] = useState('');

  const loadApplicants = () => {
    const apps = dataStore.getApplications();
    setApplications(apps);
  };

  useEffect(() => {
    loadApplicants();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    const updated = dataStore.updateApplicationStatus(appId, newStatus);
    setApplications(updated);

    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
    } catch (e) {
      // ignore
    }

    if (newStatus === 'Interview Scheduled') {
      const app = updated.find(a => a._id === appId);
      setSelectedAppForInterview(app);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    const updated = dataStore.updateApplicationStatus(selectedAppForInterview._id, 'Interview Scheduled', {
      interviewDate,
      interviewLocation,
      interviewNotes
    });
    setApplications(updated);

    try {
      await api.put(`/applications/${selectedAppForInterview._id}/status`, {
        status: 'Interview Scheduled',
        interviewDate,
        interviewLocation,
        interviewNotes
      });
    } catch (err) {
      // ignore
    }

    setSelectedAppForInterview(null);
    setInterviewDate('');
  };

  return (
    <div>
      <Navbar 
        title="Applicant Review & Pipeline" 
        subtitle="Live dynamic view of candidate submissions, status transitions, and interview scheduling" 
      />

      <div className="glass-card">
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={20} color="var(--primary)" /> Registered Candidate Applications ({applications.length})
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: 'var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Candidate Name</th>
                <th style={{ padding: '0.75rem' }}>Position</th>
                <th style={{ padding: '0.75rem' }}>Academic Record</th>
                <th style={{ padding: '0.75rem' }}>Resume</th>
                <th style={{ padding: '0.75rem' }}>Pipeline Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No student candidate applications submitted yet.
                  </td>
                </tr>
              ) : (
                applications.map(app => (
                  <tr key={app._id} style={{ borderBottom: 'var(--border-color)' }}>
                    <td style={{ padding: '0.85rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{app.student?.name || 'Student Candidate'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.student?.email}</div>
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{app.job?.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.job?.companyName}</div>
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <div>{app.student?.studentDetails?.university || 'University'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>CGPA: {app.student?.studentDetails?.cgpa || 3.8}</div>
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert(`Viewing Resume PDF: ${app.resumeUrl || 'Candidate_Resume.pdf'}`); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 600 }}>
                        <FileText size={16} /> Resume PDF
                      </a>
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <select 
                        value={app.status} 
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="form-select"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => setSelectedAppForInterview(app)}
                        className="btn btn-secondary" 
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        <Video size={14} /> Schedule Interview
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!selectedAppForInterview} onClose={() => setSelectedAppForInterview(null)} title="Schedule Candidate Interview">
        <form onSubmit={handleScheduleSubmit}>
          <div className="form-group">
            <label className="form-label">Candidate & Position</label>
            <p style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
              {selectedAppForInterview?.student?.name} for {selectedAppForInterview?.job?.title}
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Interview Date & Time</label>
            <input 
              type="datetime-local" 
              value={interviewDate} 
              onChange={(e) => setInterviewDate(e.target.value)} 
              className="form-input" 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Meeting Location / Video Link</label>
            <input 
              type="text" 
              value={interviewLocation} 
              onChange={(e) => setInterviewLocation(e.target.value)} 
              className="form-input" 
              placeholder="e.g. Google Meet Link or Office Address" 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Interview Notes / Instructions</label>
            <textarea 
              value={interviewNotes} 
              onChange={(e) => setInterviewNotes(e.target.value)} 
              className="form-textarea" 
              rows={3} 
              placeholder="Instructions for the candidate..." 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setSelectedAppForInterview(null)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Send size={16} /> Send Interview Invitation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageApplicantsPage;
