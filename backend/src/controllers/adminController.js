const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Feedback = require('../models/Feedback');

// System Dashboard Stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCompanies = await User.countDocuments({ role: 'company' });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingFeedbacks = await Feedback.countDocuments({ status: 'Pending' });

    res.json({
      totalStudents,
      totalCompanies,
      totalJobs,
      totalApplications,
      pendingFeedbacks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manage Users (Get all)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify/Approve Company account
exports.toggleCompanyApproval = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user && user.role === 'company') {
      user.companyDetails.isVerified = !user.companyDetails.isVerified;
      await user.save();
      res.json({ message: `Company verification updated to ${user.companyDetails.isVerified}`, user });
    } else {
      res.status(404).json({ message: 'Company account not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Feedback & Complaints Handling
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resolveFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (feedback) {
      feedback.status = 'Resolved';
      await feedback.save();
      res.json({ message: 'Complaint resolved', feedback });
    } else {
      res.status(404).json({ message: 'Feedback record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const feedback = await Feedback.create({
      user: req.user ? req.user.id : null,
      name,
      email,
      subject,
      message
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
