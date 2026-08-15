import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import CalendarView from '../components/CalendarView';
import { MOCK_JOBS, MOCK_APPLICATIONS } from '../services/api';
import { Clock, Video, AlertCircle } from 'lucide-react';

const DeadlineCalendarPage = () => {
  // Combine job deadlines and scheduled interviews into calendar events
  const events = [
    ...MOCK_JOBS.map(j => ({
      id: j._id,
      title: j.title,
      company: j.companyName,
      date: j.deadline,
      type: 'deadline'
    })),
    ...MOCK_APPLICATIONS.filter(a => a.interviewDate).map(a => ({
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
