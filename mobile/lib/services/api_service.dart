import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/job_model.dart';
import '../models/application_model.dart';

class ApiService {
  static const String baseUrl = 'https://pdd-backend-t1am.onrender.com/api';

  static List<JobModel> getMockJobs() {
    return [
      JobModel(
        id: 'm1',
        title: 'Full-Stack Developer Intern',
        companyName: 'Nexus Tech Innovations',
        type: 'Internship',
        location: 'Remote / San Francisco',
        stipendOrSalary: '\$3,500 / month',
        description: 'Join our dynamic web team building React & Node features.',
        requirements: ['React', 'Node.js', 'TypeScript'],
        deadline: DateTime.now().add(const Duration(days: 5)),
        category: 'Software Engineering',
      ),
      JobModel(
        id: 'm2',
        title: 'Mobile App Developer (Flutter)',
        companyName: 'Nexus Tech Innovations',
        type: 'Internship',
        location: 'Hybrid - Austin, TX',
        stipendOrSalary: '\$4,000 / month',
        description: 'Build sleek mobile applications using Flutter & Dart.',
        requirements: ['Flutter', 'Dart', 'Provider'],
        deadline: DateTime.now().add(const Duration(days: 10)),
        category: 'Mobile Development',
      ),
      JobModel(
        id: 'm3',
        title: 'Graduate Placement Engineer',
        companyName: 'CyberPulse Systems',
        type: 'Placement',
        location: 'New York, NY',
        stipendOrSalary: '\$110,000 / year',
        description: 'Full-time graduate placement position in cloud security.',
        requirements: ['Node.js', 'Go', 'Docker'],
        deadline: DateTime.now().add(const Duration(days: 2)),
        category: 'Cybersecurity',
      )
    ];
  }

  static List<ApplicationModel> getMockApplications() {
    final jobs = getMockJobs();
    return [
      ApplicationModel(
        id: 'app1',
        job: jobs[0],
        status: 'Interview Scheduled',
        appliedAt: DateTime.now().subtract(const Duration(days: 3)),
        interviewDate: DateTime.now().add(const Duration(days: 3)),
        interviewLocation: 'Google Meet',
        interviewNotes: 'Prepare 15min presentation',
      ),
      ApplicationModel(
        id: 'app2',
        job: jobs[2],
        status: 'Shortlisted',
        appliedAt: DateTime.now().subtract(const Duration(days: 5)),
      ),
      ApplicationModel(
        id: 'app3',
        job: jobs[1],
        status: 'Applied',
        appliedAt: DateTime.now().subtract(const Duration(days: 1)),
      ),
    ];
  }
}
