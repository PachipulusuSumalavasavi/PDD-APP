class JobModel {
  final String id;
  final String title;
  final String companyName;
  final String type;
  final String location;
  final String stipendOrSalary;
  final String description;
  final List<String> requirements;
  final DateTime deadline;
  final String category;

  JobModel({
    required this.id,
    required this.title,
    required this.companyName,
    required this.type,
    required this.location,
    required this.stipendOrSalary,
    required this.description,
    required this.requirements,
    required this.deadline,
    required this.category,
  });

  factory JobModel.fromJson(Map<String, dynamic> json) {
    return JobModel(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      companyName: json['companyName'] ?? '',
      type: json['type'] ?? 'Internship',
      location: json['location'] ?? '',
      stipendOrSalary: json['stipendOrSalary'] ?? '',
      description: json['description'] ?? '',
      requirements: List<String>.from(json['requirements'] ?? []),
      deadline: json['deadline'] != null ? DateTime.parse(json['deadline']) : DateTime.now(),
      category: json['category'] ?? 'Software Engineering',
    );
  }
}
