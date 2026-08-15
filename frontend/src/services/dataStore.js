import api from './api';

// Dynamic Database Store with LocalStorage Persistence & API Synchronization

const INITIAL_USERS = [
  {
    _id: 'usr-admin-1',
    name: 'CareerMate Admin',
    email: 'admin@careermate.com',
    password: 'password123',
    role: 'admin',
    createdAt: '2026-01-01T10:00:00.000Z',
    isApproved: true,
    companyDetails: { isVerified: true }
  },
  {
    _id: 'usr-company-1',
    name: 'Nexus Tech Innovations',
    email: 'recruiter@nexustech.com',
    password: 'password123',
    role: 'company',
    createdAt: '2026-01-10T10:00:00.000Z',
    companyDetails: {
      companyName: 'Nexus Tech Innovations',
      industry: 'Software & Cloud',
      location: 'San Francisco, CA',
      isVerified: true
    }
  },
  {
    _id: 'usr-student-1',
    name: 'Alex Johnson',
    email: 'student@university.edu',
    password: 'password123',
    role: 'student',
    createdAt: '2026-01-15T10:00:00.000Z',
    studentDetails: {
      university: 'State Institute of Technology',
      degree: 'B.S. Computer Science',
      graduationYear: 2026,
      cgpa: 3.85,
      skills: ['React', 'Node.js', 'Flutter', 'MongoDB'],
      resumeUrl: 'Alex_Johnson_Resume.pdf'
    }
  }
];

const INITIAL_JOBS = [
  {
    _id: 'job-1',
    title: 'Full-Stack Developer Intern',
    company: 'usr-company-1',
    companyName: 'Nexus Tech Innovations',
    type: 'Internship',
    location: 'Remote / San Francisco',
    stipendOrSalary: '$3,500 / month',
    description: 'Join our dynamic web team building React & Node.js features for active users.',
    requirements: ['React.js', 'Node.js', 'REST APIs'],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Software Engineering',
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'job-2',
    title: 'Mobile App Developer (Flutter)',
    company: 'usr-company-1',
    companyName: 'Nexus Tech Innovations',
    type: 'Internship',
    location: 'Hybrid - Austin, TX',
    stipendOrSalary: '$4,000 / month',
    description: 'Build sleek mobile user experiences using Flutter, Provider, and Node backend.',
    requirements: ['Flutter/Dart', 'Provider', 'UI Animations'],
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Mobile Development',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_APPLICATIONS = [
  {
    _id: 'app-1',
    jobId: 'job-1',
    job: INITIAL_JOBS[0],
    studentId: 'usr-student-1',
    student: INITIAL_USERS[2],
    status: 'Interview Scheduled',
    interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    interviewLocation: 'Google Meet',
    interviewNotes: 'Technical architecture discussion.',
    resumeUrl: 'Alex_Johnson_Resume.pdf',
    appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_FEEDBACKS = [
  {
    _id: 'fb-1',
    name: 'David Smith',
    email: 'david@student.edu',
    subject: 'Deadline Notification Request',
    message: 'Can we get additional SMS deadline alerts?',
    status: 'Pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

class DataStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('careermate_users')) {
      localStorage.setItem('careermate_users', JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem('careermate_jobs')) {
      localStorage.setItem('careermate_jobs', JSON.stringify(INITIAL_JOBS));
    }
    if (!localStorage.getItem('careermate_applications')) {
      localStorage.setItem('careermate_applications', JSON.stringify(INITIAL_APPLICATIONS));
    }
    if (!localStorage.getItem('careermate_feedbacks')) {
      localStorage.setItem('careermate_feedbacks', JSON.stringify(INITIAL_FEEDBACKS));
    }
  }

  // --- Users Operations ---
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem('careermate_users') || '[]');
    } catch (e) {
      return INITIAL_USERS;
    }
  }

  registerUser(userData) {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('User already registered with this email address');
    }

    const newUser = {
      _id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      password: userData.password || 'password123',
      role: userData.role || 'student',
      createdAt: new Date().toISOString(),
      studentDetails: {
        university: userData.university || 'State Institute of Technology',
        degree: userData.degree || 'B.S. Computer Science',
        graduationYear: 2026,
        cgpa: 3.8,
        skills: ['React', 'JavaScript', 'Problem Solving'],
        resumeUrl: `${userData.name.replace(/\s+/g, '_')}_Resume.pdf`
      },
      companyDetails: {
        companyName: userData.companyName || userData.name,
        industry: 'Technology',
        isVerified: true
      }
    };

    users.unshift(newUser);
    localStorage.setItem('careermate_users', JSON.stringify(users));
    return newUser;
  }

  loginUser(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password');
    }
    return user;
  }

  toggleCompanyVerification(userId) {
    const users = this.getUsers();
    const updated = users.map(u => {
      if (u._id === userId && u.role === 'company') {
        return {
          ...u,
          companyDetails: {
            ...u.companyDetails,
            isVerified: !u.companyDetails?.isVerified
          }
        };
      }
      return u;
    });
    localStorage.setItem('careermate_users', JSON.stringify(updated));
    return updated;
  }

  // --- Jobs Operations ---
  getJobs() {
    try {
      return JSON.parse(localStorage.getItem('careermate_jobs') || '[]');
    } catch (e) {
      return INITIAL_JOBS;
    }
  }

  createJob(jobData, companyUser) {
    const jobs = this.getJobs();
    const newJob = {
      _id: `job-${Date.now()}`,
      title: jobData.title,
      company: companyUser?._id || 'usr-company-1',
      companyName: companyUser?.companyDetails?.companyName || companyUser?.name || 'Recruiter Firm',
      type: jobData.type || 'Internship',
      location: jobData.location,
      stipendOrSalary: jobData.stipendOrSalary,
      description: jobData.description,
      requirements: Array.isArray(jobData.requirements) ? jobData.requirements : (jobData.requirements ? jobData.requirements.split(',').map(s => s.trim()) : []),
      deadline: jobData.deadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      category: jobData.category || 'Software Engineering',
      postedAt: new Date().toISOString()
    };
    jobs.unshift(newJob);
    localStorage.setItem('careermate_jobs', JSON.stringify(jobs));
    return newJob;
  }

  // --- Applications Operations ---
  getApplications() {
    try {
      return JSON.parse(localStorage.getItem('careermate_applications') || '[]');
    } catch (e) {
      return INITIAL_APPLICATIONS;
    }
  }

  applyForJob(jobId, studentUser, coverLetter) {
    const applications = this.getApplications();
    const jobs = this.getJobs();
    const targetJob = jobs.find(j => j._id === jobId) || jobs[0];

    const newApp = {
      _id: `app-${Date.now()}`,
      jobId,
      job: targetJob,
      studentId: studentUser._id,
      student: studentUser,
      status: 'Applied',
      coverLetter: coverLetter || '',
      resumeUrl: studentUser.studentDetails?.resumeUrl || `${studentUser.name.replace(/\s+/g, '_')}_Resume.pdf`,
      appliedAt: new Date().toISOString()
    };

    applications.unshift(newApp);
    localStorage.setItem('careermate_applications', JSON.stringify(applications));
    return newApp;
  }

  updateApplicationStatus(appId, newStatus, interviewData = {}) {
    const applications = this.getApplications();
    const updated = applications.map(app => {
      if (app._id === appId) {
        return {
          ...app,
          status: newStatus,
          interviewDate: interviewData.interviewDate || app.interviewDate,
          interviewLocation: interviewData.interviewLocation || app.interviewLocation,
          interviewNotes: interviewData.interviewNotes || app.interviewNotes,
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    });
    localStorage.setItem('careermate_applications', JSON.stringify(updated));
    return updated;
  }

  // --- Feedback Operations ---
  getFeedbacks() {
    try {
      return JSON.parse(localStorage.getItem('careermate_feedbacks') || '[]');
    } catch (e) {
      return INITIAL_FEEDBACKS;
    }
  }

  resolveFeedback(feedbackId) {
    const feedbacks = this.getFeedbacks();
    const updated = feedbacks.map(f => f._id === feedbackId ? { ...f, status: 'Resolved' } : f);
    localStorage.setItem('careermate_feedbacks', JSON.stringify(updated));
    return updated;
  }

  // --- System Stats ---
  getAdminStats() {
    const users = this.getUsers();
    const jobs = this.getJobs();
    const apps = this.getApplications();
    const feedbacks = this.getFeedbacks();

    return {
      totalStudents: users.filter(u => u.role === 'student').length,
      totalCompanies: users.filter(u => u.role === 'company').length,
      totalJobs: jobs.length,
      totalApplications: apps.length,
      pendingFeedbacks: feedbacks.filter(f => f.status === 'Pending').length
    };
  }
}

export const dataStore = new DataStore();
