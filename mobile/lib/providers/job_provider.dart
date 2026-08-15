import 'package:flutter/material.dart';
import '../models/job_model.dart';
import '../models/application_model.dart';
import '../services/api_service.dart';

class JobProvider with ChangeNotifier {
  List<JobModel> _jobs = ApiService.getMockJobs();
  List<ApplicationModel> _applications = ApiService.getMockApplications();
  List<String> _savedJobIds = [];

  List<JobModel> get jobs => _jobs;
  List<ApplicationModel> get applications => _applications;
  List<String> get savedJobIds => _savedJobIds;

  void toggleSaveJob(String jobId) {
    if (_savedJobIds.contains(jobId)) {
      _savedJobIds.remove(jobId);
    } else {
      _savedJobIds.add(jobId);
    }
    notifyListeners();
  }

  void applyForJob(JobModel job) {
    _applications.add(ApplicationModel(
      id: 'app-${DateTime.now().millisecondsSinceEpoch}',
      job: job,
      status: 'Applied',
      appliedAt: DateTime.now(),
    ));
    notifyListeners();
  }
}
