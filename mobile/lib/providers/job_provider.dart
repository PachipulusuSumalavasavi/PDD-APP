import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../models/job_model.dart';
import '../models/application_model.dart';
import '../services/api_service.dart';

class JobProvider with ChangeNotifier {
  List<JobModel> _jobs = [];
  List<ApplicationModel> _applications = [];
  List<String> _savedJobIds = [];
  bool _isLoading = false;

  List<ApplicationModel> _companyApplications = [];

  List<JobModel> get jobs => _jobs;
  List<ApplicationModel> get applications => _applications;
  List<ApplicationModel> get companyApplications => _companyApplications;
  List<String> get savedJobIds => _savedJobIds;
  bool get isLoading => _isLoading;

  Future<void> fetchJobs() async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await http.get(Uri.parse('${ApiService.baseUrl}/jobs'));
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        _jobs = data.map((json) => JobModel.fromJson(json)).toList();
      }
    } catch (e) {
      print('Error fetching jobs: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchApplications(String token) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await http.get(
        Uri.parse('${ApiService.baseUrl}/applications/student'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        _applications = data.map((json) => ApplicationModel.fromJson(json)).toList();
      }
    } catch (e) {
      print('Error fetching applications: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchCompanyApplications(String token) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await http.get(
        Uri.parse('${ApiService.baseUrl}/applications/company'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        _companyApplications = data.map((json) => ApplicationModel.fromJson(json)).toList();
      }
    } catch (e) {
      print('Error fetching company applications: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void toggleSaveJob(String jobId) {
    if (_savedJobIds.contains(jobId)) {
      _savedJobIds.remove(jobId);
    } else {
      _savedJobIds.add(jobId);
    }
    notifyListeners();
  }

  Future<bool> applyForJob(JobModel job, String token, {String? coverLetter}) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiService.baseUrl}/applications/apply'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'jobId': job.id,
          'coverLetter': coverLetter ?? '',
        }),
      );
      if (response.statusCode == 201) {
        await fetchApplications(token);
        return true;
      }
    } catch (e) {
      print('Error applying for job: $e');
    }
    return false;
  }

  Future<bool> createJobMobile(Map<String, dynamic> jobData, String token) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await http.post(
        Uri.parse('${ApiService.baseUrl}/jobs'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(jobData),
      );
      if (response.statusCode == 201) {
        await fetchJobs();
        return true;
      }
    } catch (e) {
      print('Error creating job: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return false;
  }

  Future<bool> updateCompanyApplicationStatus(
    String appId,
    Map<String, dynamic> updateData,
    String token,
  ) async {
    try {
      final response = await http.put(
        Uri.parse('${ApiService.baseUrl}/applications/$appId/status'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(updateData),
      );
      if (response.statusCode == 200) {
        await fetchCompanyApplications(token);
        return true;
      }
    } catch (e) {
      print('Error updating application status: $e');
    }
    return false;
  }
}
