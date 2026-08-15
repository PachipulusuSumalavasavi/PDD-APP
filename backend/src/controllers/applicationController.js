const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

// Student submits an application
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter, resumeUrl } = req.body;

    const existingApp = await Application.findOne({
      job: jobId,
      student: req.user.id
    });

    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied for this position' });
    }

    const application = new Application({
      job: jobId,
      student: req.user.id,
      coverLetter: coverLetter || '',
      resumeUrl: resumeUrl || req.user.studentDetails?.resumeUrl || '',
      status: 'Applied'
    });

    const savedApp = await application.save();

    // Trigger Notification for company/student
    const job = await Job.findById(jobId);
    if (job) {
      await Notification.create({
        user: req.user.id,
        title: 'Application Submitted!',
        message: `Your application for ${job.title} at ${job.companyName} was submitted successfully.`,
        type: 'status_update'
      });
    }

    res.status(201).json(savedApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in Student's applications
exports.getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('job')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get applicants for a Company's posted jobs
exports.getCompanyApplicants = async (req, res) => {
  try {
    const companyJobs = await Job.find({ company: req.user.id }).select('_id');
    const jobIds = companyJobs.map(j => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job')
      .populate('student', 'name email studentDetails')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Recruiter updates Application Status & Schedules Interview
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, interviewDate, interviewLocation, interviewNotes, notes } = req.body;
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application record not found' });
    }

    if (status) application.status = status;
    if (interviewDate) application.interviewDate = interviewDate;
    if (interviewLocation) application.interviewLocation = interviewLocation;
    if (interviewNotes) application.interviewNotes = interviewNotes;
    if (notes) application.notes = notes;
    application.updatedAt = Date.now();

    const updatedApp = await application.save();

    // Send real-time notification to candidate
    let notifTitle = `Application Status Update`;
    let notifMsg = `Your application for ${application.job.title} status has been updated to "${application.status}".`;

    if (status === 'Interview Scheduled' && interviewDate) {
      notifTitle = `Interview Scheduled! 📅`;
      notifMsg = `Interview scheduled for ${application.job.title} on ${new Date(interviewDate).toLocaleDateString()} at ${new Date(interviewDate).toLocaleTimeString()}.`;
    }

    await Notification.create({
      user: application.student,
      title: notifTitle,
      message: notifMsg,
      type: status === 'Interview Scheduled' ? 'interview' : 'status_update'
    });

    res.json(updatedApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student Application Statistics Overview
exports.getStudentStats = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id }).populate('job');

    const totalApplications = applications.length;
    const appliedCount = applications.filter(a => a.status === 'Applied').length;
    const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
    const interviewCount = applications.filter(a => a.status === 'Interview Scheduled').length;
    const selectedCount = applications.filter(a => a.status === 'Selected').length;
    const rejectedCount = applications.filter(a => a.status === 'Rejected').length;

    // Upcoming interviews & deadlines
    const interviews = applications
      .filter(a => a.status === 'Interview Scheduled' && a.interviewDate && new Date(a.interviewDate) >= new Date())
      .map(a => ({
        id: a._id,
        jobTitle: a.job?.title,
        companyName: a.job?.companyName,
        date: a.interviewDate,
        location: a.interviewLocation,
        notes: a.interviewNotes
      }));

    res.json({
      totalApplications,
      appliedCount,
      shortlistedCount,
      interviewCount,
      selectedCount,
      rejectedCount,
      interviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
