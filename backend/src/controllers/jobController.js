const Job = require('../models/Job');

// Get all jobs with optional filtering & search
exports.getJobs = async (req, res) => {
  try {
    const { keyword, type, category } = req.query;
    let query = { isApproved: true };

    if (type && type !== 'All') {
      query.type = type;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { companyName: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single job details
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job posting not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Post a new opportunity (Company Recruiter)
exports.createJob = async (req, res) => {
  try {
    const { title, location, stipendOrSalary, description, requirements, deadline, type, category } = req.body;

    const job = new Job({
      title,
      company: req.user.id,
      companyName: req.user.companyDetails?.companyName || req.user.name,
      type: type || 'Internship',
      location,
      stipendOrSalary,
      description,
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map(s => s.trim()) : []),
      deadline: deadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      category: category || 'Software Engineering',
      isApproved: true
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit job post (Company)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      if (job.company.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to edit this posting' });
      }

      job.title = req.body.title || job.title;
      job.type = req.body.type || job.type;
      job.location = req.body.location || job.location;
      job.stipendOrSalary = req.body.stipendOrSalary || job.stipendOrSalary;
      job.description = req.body.description || job.description;
      job.requirements = req.body.requirements || job.requirements;
      job.deadline = req.body.deadline || job.deadline;
      job.category = req.body.category || job.category;

      const updatedJob = await job.save();
      res.json(updatedJob);
    } else {
      res.status(404).json({ message: 'Job post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete job post
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      if (job.company.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this posting' });
      }
      await job.deleteOne();
      res.json({ message: 'Job post removed successfully' });
    } else {
      res.status(404).json({ message: 'Job post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get jobs posted by logged-in company recruiter
exports.getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user.id }).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
