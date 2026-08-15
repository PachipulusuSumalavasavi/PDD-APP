const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'company', 'admin'], 
    default: 'student' 
  },
  // Student Specific Fields
  studentDetails: {
    university: { type: String, default: '' },
    degree: { type: String, default: '' },
    graduationYear: { type: Number, default: 2026 },
    cgpa: { type: Number, default: 0 },
    resumeUrl: { type: String, default: '' },
    skills: [{ type: String }],
    phone: { type: String, default: '' },
    bio: { type: String, default: '' }
  },
  // Company Specific Fields
  companyDetails: {
    companyName: { type: String, default: '' },
    industry: { type: String, default: '' },
    website: { type: String, default: '' },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    isVerified: { type: Boolean, default: true },
    logoUrl: { type: String, default: '' }
  },
  isApproved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
