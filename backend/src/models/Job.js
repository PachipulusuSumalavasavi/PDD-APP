const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Internship', 'Placement', 'Full-time', 'Part-time'], 
    default: 'Internship' 
  },
  location: { type: String, required: true },
  stipendOrSalary: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  deadline: { type: Date, required: true },
  category: { type: String, default: 'Software Engineering' },
  isApproved: { type: Boolean, default: true },
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
