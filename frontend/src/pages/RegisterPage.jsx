import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, ArrowRight, User, Mail, Lock, Building, GraduationCap } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [university, setUniversity] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register({
      name,
      email,
      password,
      role,
      university,
      companyName
    });

    if (res.success) {
      if (res.role === 'student') navigate('/student/dashboard');
      else if (res.role === 'company') navigate('/company/dashboard');
      else if (res.role === 'admin') navigate('/admin/dashboard');
    } else {
      setError(res.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '0.75rem' }}>
            <Sparkles size={26} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800 }}>Create CareerMate Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Join the internship & placement tracking system</p>
        </div>

        {error && (
          <div style={{ marginBottom: '1.25rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', fontSize: '0.85rem', textAlign: 'center' }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">I am joining as a:</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setRole('student')} 
                className={`btn ${role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <GraduationCap size={16} /> Student
              </button>
              <button 
                type="button" 
                onClick={() => setRole('company')} 
                className={`btn ${role === 'company' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Building size={16} /> Recruiter
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name / Contact Person</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="form-input" 
              placeholder="e.g. Alex Johnson"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="form-input" 
              placeholder="alex@university.edu"
              required 
            />
          </div>

          {role === 'student' ? (
            <div className="form-group">
              <label className="form-label">University / Institute</label>
              <input 
                type="text" 
                value={university} 
                onChange={(e) => setUniversity(e.target.value)} 
                className="form-input" 
                placeholder="State Institute of Technology"
              />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input 
                type="text" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
                className="form-input" 
                placeholder="Acme Innovations Inc."
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="form-input" 
              placeholder="Create a strong password"
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.8rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register Account'} <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
