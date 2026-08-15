import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Applied': return 'status-Applied';
      case 'Shortlisted': return 'status-Shortlisted';
      case 'Interview Scheduled':
      case 'Interview': return 'status-Interview';
      case 'Selected': return 'status-Selected';
      case 'Rejected': return 'status-Rejected';
      default: return 'status-Applied';
    }
  };

  return (
    <span className={`status-pill ${getBadgeStyle()}`}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
      {status}
    </span>
  );
};

export default StatusBadge;
