import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { dataStore } from '../services/dataStore';
import api from '../services/api';
import { Users, CheckCircle2, Search, UserCheck } from 'lucide-react';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data && res.data.length > 0) {
        setUsers(res.data);
        return;
      }
    } catch (e) {
      // Fallback to dynamic DataStore
    }
    setUsers(dataStore.getUsers());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleVerify = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-company`);
    } catch (e) {
      // ignore offline
    }
    const updatedUsers = dataStore.toggleCompanyVerification(userId);
    setUsers(updatedUsers);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar 
        title="Manage Registered Accounts" 
        subtitle="Live dynamic view of all registered student and company accounts across portals" 
      />

      <div className="glass-card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="form-input" 
              style={{ paddingLeft: '2.5rem' }} 
              placeholder="Search by student name, recruiter email, or role..." 
            />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Total Registered Users: {users.length}
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: 'var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>User / Candidate</th>
                <th style={{ padding: '0.75rem' }}>Email Address</th>
                <th style={{ padding: '0.75rem' }}>Role</th>
                <th style={{ padding: '0.75rem' }}>Registered Date</th>
                <th style={{ padding: '0.75rem' }}>Verification</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No registered user accounts found matching query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u._id} style={{ borderBottom: 'var(--border-color)' }}>
                    <td style={{ padding: '0.85rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                      {u.studentDetails?.university && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.studentDetails.university}</div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '0.85rem' }}>
                      <span className={`status-pill ${u.role === 'admin' ? 'status-Selected' : u.role === 'company' ? 'status-Shortlisted' : 'status-Applied'}`} style={{ textTransform: 'capitalize' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      {u.companyDetails?.isVerified || u.role !== 'company' ? (
                        <span style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={16} /> Verified
                        </span>
                      ) : (
                        <span style={{ color: 'var(--accent-amber)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Pending Approval
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                      {u.role === 'company' && (
                        <button 
                          onClick={() => toggleVerify(u._id)}
                          className={`btn ${u.companyDetails?.isVerified ? 'btn-danger' : 'btn-primary'}`} 
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                        >
                          {u.companyDetails?.isVerified ? 'Revoke Verification' : 'Approve Recruiter'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;
