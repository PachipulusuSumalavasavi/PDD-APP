import React, { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { User, FileText, Upload, Save, CheckCircle, GraduationCap } from 'lucide-react';

const StudentProfilePage = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || 'Alex Johnson');
  const [university, setUniversity] = useState(user?.studentDetails?.university || 'State Institute of Technology');
  const [degree, setDegree] = useState(user?.studentDetails?.degree || 'B.S. Computer Science & AI');
  const [graduationYear, setGraduationYear] = useState(user?.studentDetails?.graduationYear || 2026);
  const [cgpa, setCgpa] = useState(user?.studentDetails?.cgpa || 3.85);
  const [skills, setSkills] = useState(user?.studentDetails?.skills ? user.studentDetails.skills.join(', ') : 'React, Node.js, Python, Flutter, MongoDB');
  const [resumeName, setResumeName] = useState(user?.studentDetails?.resumeUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      studentDetails: {
        ...user?.studentDetails,
        university,
        degree,
        graduationYear: Number(graduationYear),
        cgpa: Number(cgpa),
        skills: skills.split(',').map(s => s.trim()),
        resumeUrl: resumeName
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeName(e.target.files[0].name);
    }
  };

  return (
    <div>
      <Navbar 
        title="Student Profile & Resume Management" 
        subtitle="Manage your personal details, academic metrics, and active resume for job applications" 
      />

      <div style={{ maxWidth: '780px' }}>
        <div className="glass-card">
          {savedSuccess && (
            <div style={{ marginBottom: '1.25rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} /> Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSave}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color="var(--primary)" /> Personal & Academic Information
            </h3>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">University / Institute</label>
                <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Degree Program</label>
                <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} className="form-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Graduation Year</label>
                <input type="number" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">CGPA / Grade Score</label>
                <input type="number" step="0.01" value={cgpa} onChange={(e) => setCgpa(e.target.value)} className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Skills (Comma Separated)</label>
              <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className="form-input" />
            </div>

            {/* Resume Upload Box */}
            <div className="form-group" style={{ marginTop: '1.75rem' }}>
              <label className="form-label">Resume Management</label>
              <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(15, 23, 42, 0.6)', border: '2px dashed rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
                <FileText size={32} color="var(--accent-cyan)" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Current Active Resume:</p>
                {resumeName ? (
                  <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>📄 {resumeName}</p>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem', fontStyle: 'italic' }}>No active resume uploaded</p>
                )}
                
                <label className="btn btn-secondary" style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  <Upload size={14} /> Upload New PDF Resume
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Save Profile & Resume
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
