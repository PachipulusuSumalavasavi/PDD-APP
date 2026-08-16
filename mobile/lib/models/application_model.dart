import 'job_model.dart';

class StudentInfo {
  final String name;
  final String email;
  final String university;

  StudentInfo({
    required this.name,
    required this.email,
    required this.university,
  });

  factory StudentInfo.fromJson(Map<String, dynamic> json) {
    final studentDetails = json['studentDetails'] ?? {};
    return StudentInfo(
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      university: studentDetails['university'] ?? '',
    );
  }
}

class ApplicationModel {
  final String id;
  final JobModel? job;
  final String status;
  final DateTime appliedAt;
  final DateTime? interviewDate;
  final String? interviewLocation;
  final String? interviewNotes;
  final StudentInfo? student;

  ApplicationModel({
    required this.id,
    this.job,
    required this.status,
    required this.appliedAt,
    this.interviewDate,
    this.interviewLocation,
    this.interviewNotes,
    this.student,
  });

  factory ApplicationModel.fromJson(Map<String, dynamic> json) {
    return ApplicationModel(
      id: json['_id'] ?? json['id'] ?? '',
      job: json['job'] != null ? JobModel.fromJson(json['job']) : null,
      status: json['status'] ?? 'Applied',
      appliedAt: json['appliedAt'] != null ? DateTime.parse(json['appliedAt']) : DateTime.now(),
      interviewDate: json['interviewDate'] != null ? DateTime.parse(json['interviewDate']) : null,
      interviewLocation: json['interviewLocation'],
      interviewNotes: json['interviewNotes'],
      student: json['student'] != null ? StudentInfo.fromJson(json['student']) : null,
    );
  }
}
