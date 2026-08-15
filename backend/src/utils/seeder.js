const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const Feedback = require('../models/Feedback');

dotenv.config();

const seedData = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careermate';
    await mongoose.connect(connStr);

    await User.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    await Notification.deleteMany();
    await Feedback.deleteMany();

    console.log('Database cleaned for seeding...');

    // Create Admin
    const admin = await User.create({
      name: 'CareerMate Admin',
      email: 'admin@careermate.com',
      password: 'password123',
      role: 'admin'
    });

    // Create Companies
    const company1 = await User.create({
      name: 'Nexus Tech Innovations',
      email: 'recruiter@nexustech.com',
      password: 'password123',
      role: 'company',
      companyDetails: {
        companyName: 'Nexus Tech Innovations',
        industry: 'Software & AI',
        website: 'https://nexustech.example.com',
        location: 'San Francisco, CA (Remote)',
        description: 'Leading AI solutions and enterprise cloud development platform.',
        isVerified: true
      }
    });

    const company2 = await User.create({
      name: 'CyberPulse Systems',
      email: 'hr@cyberpulse.io',
      password: 'password123',
      role: 'company',
      companyDetails: {
        companyName: 'CyberPulse Systems',
        industry: 'Cybersecurity',
        website: 'https://cyberpulse.io',
        location: 'New York, NY',
        description: 'Building next-generation threat detection & zero-trust security architecture.',
        isVerified: true
      }
    });

    // Create Student
    const student = await User.create({
      name: 'Alex Johnson',
      email: 'student@university.edu',
      password: 'password123',
      role: 'student',
      studentDetails: {
        university: 'State Institute of Technology',
        degree: 'B.S. Computer Science & AI',
        graduationYear: 2026,
        cgpa: 3.85,
        skills: ['React', 'Node.js', 'Python', 'Flutter', 'MongoDB'],
        phone: '+1 (555) 234-5678',
        bio: 'Passionate full-stack & mobile software engineer looking for summer internships and entry-level placement roles.'
      }
    });

    // Create Ram
    const ramStudent = await User.create({
      name: 'ram',
      email: 'ram@saveetha.com',
      password: 'Ram@1234',
      role: 'student',
      studentDetails: {
        university: 'Saveetha Engineering College',
        degree: 'B.Tech Computer Science',
        graduationYear: 2026,
        cgpa: 3.85,
        skills: ['React', 'Node.js', 'Python', 'Flutter', 'MongoDB'],
        phone: '+1 (555) 123-4567',
        bio: 'B.Tech Computer Science student at Saveetha Engineering College.'
      }
    });

    // Create Jobs
    const job1 = await Job.create({
      title: 'Full-Stack Developer Intern',
      company: company1._id,
      companyName: company1.companyDetails.companyName,
      type: 'Internship',
      location: 'Remote / San Francisco',
      stipendOrSalary: '$3,500 / month',
      description: 'Join our dynamic web team building React & Node.js features for millions of users.',
      requirements: ['Proficiency in JavaScript/TypeScript', 'React.js experience', 'RESTful API design'],
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      category: 'Software Engineering'
    });

    const job2 = await Job.create({
      title: 'Mobile App Developer (Flutter)',
      company: company1._id,
      companyName: company1.companyDetails.companyName,
      type: 'Internship',
      location: 'Hybrid - Austin, TX',
      stipendOrSalary: '$4,000 / month',
      description: 'Build sleek mobile user experiences using Flutter, Provider, and Firebase/Node backend.',
      requirements: ['Flutter/Dart', 'State Management', 'Mobile UI animations'],
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      category: 'Mobile Development'
    });

    const job3 = await Job.create({
      title: 'Graduate Placement Engineer',
      company: company2._id,
      companyName: company2.companyDetails.companyName,
      type: 'Placement',
      location: 'New York, NY',
      stipendOrSalary: '$110,000 / year',
      description: 'Full-time graduate placement position in cloud infrastructure and cybersecurity tooling.',
      requirements: ['Node.js/Go', 'Docker/Kubernetes basics', 'Strong Computer Science fundamentals'],
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      category: 'Cybersecurity'
    });

    // Create Applications
    await Application.create({
      job: job1._id,
      student: student._id,
      status: 'Interview Scheduled',
      interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      interviewLocation: 'Google Meet (Link will be emailed)',
      interviewNotes: 'Prepare 15min technical presentation on recent project.',
      notes: 'Reviewed resume, impressed with portfolio.'
    });

    await Application.create({
      job: job3._id,
      student: student._id,
      status: 'Shortlisted',
      notes: 'Passed initial screening.'
    });

    // Create Applications for Ram
    await Application.create({
      job: job1._id,
      student: ramStudent._id,
      status: 'Interview Scheduled',
      interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      interviewLocation: 'Google Meet',
      interviewNotes: 'Prepare 15min technical presentation.',
      notes: 'Excellent candidate profile.'
    });

    await Application.create({
      job: job3._id,
      student: ramStudent._id,
      status: 'Shortlisted',
      notes: 'Impressive academic records.'
    });

    // Notifications
    await Notification.create({
      user: student._id,
      title: 'Interview Scheduled! 📅',
      message: 'Nexus Tech Innovations scheduled an interview for Full-Stack Developer Intern.',
      type: 'interview'
    });

    await Notification.create({
      user: student._id,
      title: 'Deadline Alert: 2 Days Left ⏳',
      message: 'Application deadline for Graduate Placement Engineer closes soon.',
      type: 'deadline'
    });

    // Notifications for Ram
    await Notification.create({
      user: ramStudent._id,
      title: 'Interview Scheduled! 📅',
      message: 'Nexus Tech Innovations scheduled an interview for Full-Stack Developer Intern.',
      type: 'interview'
    });

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();
