import React from 'react';
import { Calendar as CalendarIcon, Clock, Video } from 'lucide-react';

const CalendarView = ({ events = [] }) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  // Generating a 35-cell monthly calendar matrix around current date
  const startDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startDay; i++) {
    cells.push({ empty: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate();
    const cellDate = new Date(today.getFullYear(), today.getMonth(), d);
    
    // Filter events matching this date
    const dayEvents = events.filter(e => {
      const eventDate = new Date(e.date);
      return (
        eventDate.getDate() === d &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear()
      );
    });

    cells.push({
      dateNum: d,
      isToday,
      events: dayEvents
    });
  }

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarIcon size={20} color="var(--primary)" /> {currentMonth} Calendar
        </h3>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-amber)' }}>
            <Video size={14} /> Interview
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-rose)' }}>
            <Clock size={14} /> Deadline
          </span>
        </div>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}

        {cells.map((cell, idx) => (
          <div 
            key={idx} 
            className={`calendar-cell ${cell.isToday ? 'today' : ''}`}
            style={{ opacity: cell.empty ? 0.3 : 1 }}
          >
            {cell.dateNum && <span className="calendar-date-num">{cell.dateNum}</span>}
            {cell.events?.map((ev, eIdx) => (
              <div 
                key={eIdx} 
                className="calendar-event-tag"
                style={{
                  background: ev.type === 'interview' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                  color: ev.type === 'interview' ? '#fbbf24' : '#f87171',
                  border: `1px solid ${ev.type === 'interview' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`
                }}
                title={`${ev.title} - ${ev.company}`}
              >
                {ev.type === 'interview' ? '🎥 ' : '⏳ '}{ev.title}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
