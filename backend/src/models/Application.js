const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'], 
    default: 'Applied' 
  },
  coverLetter: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  interviewDate: { type: Date },
  interviewLocation: { type: String, default: '' },
  interviewNotes: { type: String, default: '' },
  notes: { type: String, default: '' },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
