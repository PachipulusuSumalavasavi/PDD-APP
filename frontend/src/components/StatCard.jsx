import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'var(--primary)', bg = 'var(--primary-light)' }) => {
  return (
    <div className="glass-card stat-card">
      <div className="stat-icon-wrapper" style={{ background: bg, color }}>
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
      </div>
    </div>
  );
};

export default StatCard;
