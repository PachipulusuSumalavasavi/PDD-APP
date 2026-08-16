import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import CalendarView from '../components/CalendarView';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { dataStore } from '../services/dataStore';
import { Clock, Video, AlertCircle } from 'lucide-react';

const DeadlineCalendarPage = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const loadData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs'),
        api.get('/applications/student')
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error('Error loading calendar data from API:', err);
      // Fallback
      setJobs(dataStore.getJobs());
      if (user) {
        const allApps = dataStore.getApplications();
        const myApps = allApps.filter(a => a.studentId === user?._id || a.student?.email === user?.email);
        setApplications(myApps);
      }
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Combine job deadlines and scheduled interviews into calendar events
  const events = [
    ...jobs.map(j => ({
      id: j._id,
      title: j.title,
      company: j.companyName,
      date: j.deadline,
      type: 'deadline'
    })),
    ...applications.filter(a => a.interviewDate).map(a => ({
      id: a._id,
      title: `Interview: ${a.job?.title || 'Engineering Role'}`,
      company: a.job?.companyName || 'Recruiter',
      date: a.interviewDate,
      type: 'interview'
    }))
  ];

  return (
    <div>
      <Navbar 
        title="Deadlines & Calendar View" 
        subtitle="Stay organized with real-time application closing deadlines and scheduled interview dates" 
      />

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.2fr', gap: '1.5rem' }}>
        {/* Calendar Grid */}
        <CalendarView events={events} />

        {/* Reminders List Sidebar */}
        <div className="glass-card">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} color="var(--accent-cyan)" /> Key Upcoming Events
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {events.map((ev, idx) => (
              <div key={idx} style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: ev.type === 'interview' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                borderLeft: `4px solid ${ev.type === 'interview' ? 'var(--accent-amber)' : 'var(--accent-rose)'}`
              }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: ev.type === 'interview' ? '#fbbf24' : '#f87171', textTransform: 'uppercase' }}>
                  {ev.type === 'interview' ? '🎥 Interview Scheduled' : '⏳ Application Deadline'}
                </span>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '2px' }}>{ev.title}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ev.company}</p>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '4px', color: 'var(--text-primary)' }}>
                  📅 {new Date(ev.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeadlineCalendarPage;
