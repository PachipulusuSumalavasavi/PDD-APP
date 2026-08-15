const express = require('express');
const router = express.Router();
const { 
  getAdminStats, 
  getUsers, 
  toggleCompanyApproval, 
  getFeedbacks, 
  resolveFeedback, 
  submitFeedback 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id/toggle-company', protect, authorize('admin'), toggleCompanyApproval);
router.get('/feedbacks', protect, authorize('admin'), getFeedbacks);
router.put('/feedbacks/:id/resolve', protect, authorize('admin'), resolveFeedback);
router.post('/feedback', submitFeedback);

module.exports = router;
