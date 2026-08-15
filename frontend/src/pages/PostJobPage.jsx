import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { dataStore } from '../services/dataStore';
import api from '../services/api';
import { PlusCircle } from 'lucide-react';

const PostJobPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Internship');
  const [category, setCategory] = useState('Software Engineering');
  const [location, setLocation] = useState('Remote / Hybrid');
  const [stipendOrSalary, setStipendOrSalary] = useState('$3,500 / month');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('React, Node.js, Problem Solving');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newJob = dataStore.createJob({
      title,
      type,
      category,
      location,
      stipendOrSalary,
      deadline: deadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      description,
      requirements: requirements.split(',').map(s => s.trim())
    }, user);

    try {
      await api.post('/jobs', newJob);
    } catch (err) {
      // ignore
    }

    setIsSubmitting(false);
    navigate('/company/dashboard');
  };

  return (
    <div>
      <Navbar 
        title="Post Opportunity" 
        subtitle="Create an internship or placement position for student discovery and application tracking" 
      />

      <div style={{ maxWidth: '800px' }}>
        <div className="glass-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Job / Internship Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="form-input" 
                placeholder="e.g. Frontend Developer Intern" 
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Opportunity Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="form-select">
                  <option value="Internship">Internship</option>
                  <option value="Placement">Placement / Full-time</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-select">
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Product Management">Product Management</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  className="form-input" 
                  placeholder="e.g. San Francisco / Remote" 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stipend or Salary Range</label>
                <input 
                  type="text" 
                  value={stipendOrSalary} 
                  onChange={(e) => setStipendOrSalary(e.target.value)} 
                  className="form-input" 
                  placeholder="e.g. $3,500 / month or $100k / year" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Application Closing Deadline</label>
              <input 
                type="date" 
                value={deadline} 
                onChange={(e) => setDeadline(e.target.value)} 
                className="form-input" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="form-textarea" 
                rows={4} 
                placeholder="Describe role responsibilities..."
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Required Skills & Criteria (Comma Separated)</label>
              <input 
                type="text" 
                value={requirements} 
                onChange={(e) => setRequirements(e.target.value)} 
                className="form-input" 
                placeholder="React.js, Node.js, Problem Solving" 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => navigate('/company/dashboard')} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish Job Posting'} <PlusCircle size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;
