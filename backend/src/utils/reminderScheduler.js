const cron = require('node-cron');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

const initReminderScheduler = () => {
  // Run daily at midnight OR every hour to check upcoming deadlines
  cron.schedule('0 * * * *', async () => {
    console.log('[Scheduler] Checking for application deadline reminders...');
    try {
      const now = new Date();
      const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Jobs with deadlines closing in 24 hours
      const closingSoonJobs = await Job.find({
        deadline: { $gte: now, $lte: next24h },
        isApproved: true
      });

      for (const job of closingSoonJobs) {
        // Find students who haven't applied yet or have saved jobs
        console.log(`[Deadline Alert] Job "${job.title}" deadline expires soon!`);
      }

      // Upcoming interviews in 24 hours
      const upcomingInterviews = await Application.find({
        status: 'Interview Scheduled',
        interviewDate: { $gte: now, $lte: next24h }
      }).populate('job');

      for (const app of upcomingInterviews) {
        // Send notification if not already sent
        const existing = await Notification.findOne({
          user: app.student,
          title: { $regex: 'Reminder: Interview Tomorrow', $options: 'i' }
        });

        if (!existing) {
          await Notification.create({
            user: app.student,
            title: `Reminder: Interview Tomorrow! 🔔`,
            message: `Your interview for ${app.job?.title} at ${app.job?.companyName} is scheduled for ${new Date(app.interviewDate).toLocaleString()}.`,
            type: 'interview'
          });
        }
      }
    } catch (err) {
      console.error('[Scheduler Error]', err.message);
    }
  });
};

module.exports = initReminderScheduler;
