import axios from 'axios';

const API_BASE_URL = window.location.origin.includes('localhost')
  ? '/api'
  : 'https://pdd-backend-t1am.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('careermate_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock Initial Data for offline fallback preview
export const MOCK_JOBS = [
  {
    _id: 'job-1',
    title: 'Full-Stack Developer Intern',
    companyName: 'Nexus Tech Innovations',
    type: 'Internship',
    location: 'Remote / San Francisco',
    stipendOrSalary: '$3,500 / month',
    description: 'Join our dynamic web team building React & Node.js features for millions of active users.',
    requirements: ['React.js / Node.js', 'TypeScript', 'RESTful APIs'],
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Software Engineering'
  },
  {
    _id: 'job-2',
    title: 'Mobile App Developer (Flutter)',
    companyName: 'Nexus Tech Innovations',
    type: 'Internship',
    location: 'Hybrid - Austin, TX',
    stipendOrSalary: '$4,000 / month',
    description: 'Build sleek mobile user experiences using Flutter, Dart, Provider, and Node APIs.',
    requirements: ['Flutter/Dart', 'Provider State Mgmt', 'UI Animations'],
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Mobile Development'
  },
  {
    _id: 'job-3',
    title: 'Graduate Placement Engineer',
    companyName: 'CyberPulse Systems',
    type: 'Placement',
    location: 'New York, NY',
    stipendOrSalary: '$110,000 / year',
    description: 'Full-time graduate placement position in cloud infrastructure and cybersecurity tooling.',
    requirements: ['Node.js', 'Go/Docker', 'System Design'],
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Cybersecurity'
  },
  {
    _id: 'job-4',
    title: 'AI / ML Research Associate',
    companyName: 'DeepData Labs',
    type: 'Placement',
    location: 'Boston, MA (Hybrid)',
    stipendOrSalary: '$125,000 / year',
    description: 'Work on cutting-edge generative AI models and data engineering pipelines.',
    requirements: ['Python', 'PyTorch / TensorFlow', 'Vector Databases'],
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Data Science'
  }
];

export const MOCK_APPLICATIONS = [
  {
    _id: 'app-1',
    job: MOCK_JOBS[0],
    status: 'Interview Scheduled',
    interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    interviewLocation: 'Google Meet',
    interviewNotes: 'Prepare 15min presentation on full-stack architecture.',
    appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'app-2',
    job: MOCK_JOBS[2],
    status: 'Shortlisted',
    notes: 'Passed code challenge.',
    appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'app-3',
    job: MOCK_JOBS[1],
    status: 'Applied',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default api;
