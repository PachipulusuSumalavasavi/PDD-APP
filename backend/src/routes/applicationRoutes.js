const express = require('express');
const router = express.Router();
const { 
  applyForJob, 
  getStudentApplications, 
  getCompanyApplicants, 
  updateApplicationStatus,
  getStudentStats 
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/apply', protect, authorize('student'), applyForJob);
router.get('/student', protect, authorize('student'), getStudentApplications);
router.get('/student/stats', protect, authorize('student'), getStudentStats);
router.get('/company', protect, authorize('company', 'admin'), getCompanyApplicants);
router.put('/:id/status', protect, authorize('company', 'admin'), updateApplicationStatus);

module.exports = router;
