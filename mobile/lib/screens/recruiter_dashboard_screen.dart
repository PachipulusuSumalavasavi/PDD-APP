import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/job_provider.dart';
import '../models/job_model.dart';
import '../models/application_model.dart';
import '../widgets/status_pill.dart';
import 'intro_screen.dart';

class RecruiterDashboardScreen extends StatefulWidget {
  const RecruiterDashboardScreen({Key? key}) : super(key: key);

  @override
  State<RecruiterDashboardScreen> createState() => _RecruiterDashboardScreenState();
}

class _RecruiterDashboardScreenState extends State<RecruiterDashboardScreen> {
  int _selectedIndex = 0;

  final List<Widget> _tabs = const [
    RecruiterDashboardHome(),
    RecruiterPostJobTab(),
    RecruiterApplicantsTab(),
  ];

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      body: _tabs[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        backgroundColor: const Color(0xFF121A2B),
        selectedItemColor: const Color(0xFF6366F1),
        unselectedItemColor: const Color(0xFF94A3B8),
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.add_box_outlined), label: 'Post Job'),
          BottomNavigationBarItem(icon: Icon(Icons.people_outline), label: 'Candidates'),
        ],
      ),
    );
  }
}

// 1. Recruiter Dashboard Home Tab
class RecruiterDashboardHome extends StatelessWidget {
  const RecruiterDashboardHome({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final jobProv = Provider.of<JobProvider>(context);

    final companyName = auth.user?.name ?? 'Recruiter';
    
    // Filter jobs posted by this company
    final myJobs = jobProv.jobs.where((job) {
      return job.companyName.toLowerCase() == companyName.toLowerCase();
    }).toList();

    // Applicants count
    final totalApplicants = jobProv.companyApplications.length;

    return SafeArea(
      child: RefreshIndicator(
        onRefresh: () async {
          await jobProv.fetchJobs();
          if (auth.user?.token != null) {
            await jobProv.fetchCompanyApplications(auth.user!.token!);
          }
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header banner
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome, $companyName 👋',
                          style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                          overflow: TextOverflow.ellipsis,
                        ),
                        const Text('Company & Recruiter Portal', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.logout, color: Color(0xFFF43F5E)),
                    onPressed: () {
                      auth.logout();
                      Navigator.of(context).pushAndRemoveUntil(
                        MaterialPageRoute(builder: (_) => const IntroScreen()),
                        (route) => false,
                      );
                    },
                  )
                ],
              ),
              const SizedBox(height: 24),

              // Recruiter Stat Cards Grid (2x2)
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.35,
                children: [
                  _buildStatCard('Active Postings', '${myJobs.length}', Icons.work, const Color(0xFF6366F1)),
                  _buildStatCard('Total Applicants', '$totalApplicants', Icons.people, const Color(0xFF06B6D4)),
                  _buildStatCard('Account status', 'Verified ✅', Icons.verified, const Color(0xFF10B981)),
                  _buildStatCard('Recruiter role', 'Active', Icons.videocam, const Color(0xFFF59E0B)),
                ],
              ),
              const SizedBox(height: 28),

              const Text(
                'Your Posted Opportunities',
                style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),

              if (myJobs.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: const Color(0xFF121A2B),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white.withOpacity(0.08)),
                  ),
                  child: const Center(
                    child: Text(
                      'No active opportunity postings yet.',
                      style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13, fontStyle: FontStyle.italic),
                    ),
                  ),
                )
              else
                ...myJobs.map((job) => Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF121A2B),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white.withOpacity(0.08)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFF06B6D4).withOpacity(0.12),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                job.type.toUpperCase(),
                                style: const TextStyle(color: Color(0xFF06B6D4), fontSize: 9, fontWeight: FontWeight.bold),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(job.title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                            Text('📍 ${job.location} • 💰 ${job.stipendOrSalary}', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12.5)),
                          ],
                        ),
                      ),
                    ],
                  ),
                )).toList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF121A2B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 6),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11), overflow: TextOverflow.ellipsis),
        ],
      ),
    );
  }
}

// 2. Recruiter Post Job Tab
class RecruiterPostJobTab extends StatefulWidget {
  const RecruiterPostJobTab({Key? key}) : super(key: key);

  @override
  State<RecruiterPostJobTab> createState() => _RecruiterPostJobTabState();
}

class _RecruiterPostJobTabState extends State<RecruiterPostJobTab> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _locationController = TextEditingController();
  final _salaryController = TextEditingController();
  final _categoryController = TextEditingController(text: 'Software Engineering');
  final _descController = TextEditingController();
  final _reqController = TextEditingController();

  String _jobType = 'Internship';
  DateTime _deadline = DateTime.now().add(const Duration(days: 14));
  bool _submitting = false;

  @override
  void dispose() {
    _titleController.dispose();
    _locationController.dispose();
    _salaryController.dispose();
    _categoryController.dispose();
    _descController.dispose();
    _reqController.dispose();
    super.dispose();
  }

  void _handlePostJob() async {
    if (!_formKey.currentState!.validate()) return;

    final auth = Provider.of<AuthProvider>(context, listen: false);
    final jobProv = Provider.of<JobProvider>(context, listen: false);

    setState(() => _submitting = true);

    final success = await jobProv.createJobMobile({
      'title': _titleController.text.trim(),
      'type': _jobType,
      'location': _locationController.text.trim(),
      'stipendOrSalary': _salaryController.text.trim(),
      'category': _categoryController.text.trim(),
      'description': _descController.text.trim(),
      'requirements': _reqController.text.trim(),
      'deadline': _deadline.toIso8601String(),
    }, auth.user!.token!);

    setState(() => _submitting = false);

    if (success) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Opportunity posted successfully!'), backgroundColor: Colors.green),
        );
        _titleController.clear();
        _locationController.clear();
        _salaryController.clear();
        _descController.clear();
        _reqController.clear();
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to publish opportunity.'), backgroundColor: Colors.redAccent),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Publish Opportunity',
                style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const Text(
                'Publish a new placement or internship drive',
                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
              ),
              const SizedBox(height: 20),

              // Title
              TextFormField(
                controller: _titleController,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  labelText: 'Opportunity Title',
                  labelStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                  hintText: 'e.g. Software Engineer Intern',
                  hintStyle: const TextStyle(color: Color(0xFF64748B)),
                  filled: true,
                  fillColor: const Color(0xFF121A2B),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Required field' : null,
              ),
              const SizedBox(height: 12),

              // Row: Type and Category
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _jobType,
                      dropdownColor: const Color(0xFF121A2B),
                      style: const TextStyle(color: Colors.white, fontSize: 13.5),
                      decoration: InputDecoration(
                        labelText: 'Job Type',
                        labelStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                        filled: true,
                        fillColor: const Color(0xFF121A2B),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      items: ['Internship', 'Placement'].map((type) {
                        return DropdownMenuItem(value: type, child: Text(type));
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) setState(() => _jobType = val);
                      },
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextFormField(
                      controller: _categoryController,
                      style: const TextStyle(color: Colors.white, fontSize: 13.5),
                      decoration: InputDecoration(
                        labelText: 'Category',
                        labelStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                        filled: true,
                        fillColor: const Color(0xFF121A2B),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Location
              TextFormField(
                controller: _locationController,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  labelText: 'Location',
                  labelStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                  hintText: 'e.g. Remote / Austin, TX',
                  hintStyle: const TextStyle(color: Color(0xFF64748B)),
                  filled: true,
                  fillColor: const Color(0xFF121A2B),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Required field' : null,
              ),
              const SizedBox(height: 12),

              // Stipend / Salary
              TextFormField(
                controller: _salaryController,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  labelText: 'Stipend / Salary',
                  labelStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                  hintText: 'e.g. \$4,000 / month',
                  hintStyle: const TextStyle(color: Color(0xFF64748B)),
                  filled: true,
                  fillColor: const Color(0xFF121A2B),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Required field' : null,
              ),
              const SizedBox(height: 12),

              // Date Deadline
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Application Deadline', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
                subtitle: Text(
                  _deadline.toString().split(' ')[0],
                  style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                ),
                trailing: IconButton(
                  icon: const Icon(Icons.calendar_month, color: Color(0xFF6366F1)),
                  onPressed: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: _deadline,
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (picked != null) {
                      setState(() => _deadline = picked);
                    }
                  },
                ),
              ),
              const SizedBox(height: 12),

              // Requirements
              TextFormField(
                controller: _reqController,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  labelText: 'Requirements (comma separated)',
                  labelStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                  hintText: 'React, Node.js, RESTful APIs',
                  hintStyle: const TextStyle(color: Color(0xFF64748B)),
                  filled: true,
                  fillColor: const Color(0xFF121A2B),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 12),

              // Description
              TextFormField(
                controller: _descController,
                maxLines: 4,
                style: const TextStyle(color: Colors.white, fontSize: 13.5),
                decoration: InputDecoration(
                  labelText: 'Opportunity Description',
                  labelStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                  hintText: 'Describe roles and responsibilities...',
                  hintStyle: const TextStyle(color: Color(0xFF64748B)),
                  filled: true,
                  fillColor: const Color(0xFF121A2B),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Required field' : null,
              ),
              const SizedBox(height: 24),

              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _submitting ? null : _handlePostJob,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6366F1),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: _submitting
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Publish Opportunity', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// 3. Recruiter Applicants Tab
class RecruiterApplicantsTab extends StatelessWidget {
  const RecruiterApplicantsTab({Key? key}) : super(key: key);

  void _showCandidateReviewSheet(BuildContext context, ApplicationModel app, String token) {
    final jobProv = Provider.of<JobProvider>(context, listen: false);
    String selectedStatus = app.status;
    final notesController = TextEditingController(text: app.interviewNotes ?? '');
    final locationController = TextEditingController(text: app.interviewLocation ?? 'Google Meet');
    DateTime selectedDateTime = app.interviewDate ?? DateTime.now().add(const Duration(days: 2));
    bool innerSubmitting = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF121A2B),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
                top: 20,
                left: 20,
                right: 20,
              ),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2)),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Candidate Application', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12.5)),
                        StatusPill(status: app.status),
                      ],
                    ),
                    const SizedBox(height: 8),

                    // Student Details
                    Text(
                      app.student?.name ?? 'Applicant',
                      style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      '📧 ${app.student?.email ?? ""} • 🎓 ${app.student?.university ?? ""}',
                      style: const TextStyle(color: Color(0xFF06B6D4), fontSize: 13),
                    ),
                    const SizedBox(height: 16),

                    // Applied Job Details
                    const Text('Opportunity Details', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                    const SizedBox(height: 4),
                    Text(
                      '${app.job?.title} (${app.job?.type})',
                      style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 13.5),
                    ),
                    const SizedBox(height: 16),

                    // Status Dropdown selector
                    const Text('Update Pipeline Status', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0B0F19),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.white10),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: selectedStatus,
                          dropdownColor: const Color(0xFF121A2B),
                          isExpanded: true,
                          style: const TextStyle(color: Colors.white, fontSize: 13.5),
                          items: const [
                            DropdownMenuItem(value: 'Applied', child: Text('Applied')),
                            DropdownMenuItem(value: 'Shortlisted', child: Text('Shortlisted')),
                            DropdownMenuItem(value: 'Interview Scheduled', child: Text('Interview Scheduled')),
                            DropdownMenuItem(value: 'Selected', child: Text('Selected')),
                            DropdownMenuItem(value: 'Rejected', child: Text('Rejected')),
                          ],
                          onChanged: (val) {
                            if (val != null) setModalState(() => selectedStatus = val);
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Interview form (only shown if Interview Scheduled is selected)
                    if (selectedStatus == 'Interview Scheduled') ...[
                      const Text('Interview Schedule Details', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                      const SizedBox(height: 10),
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Interview Date & Time', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                        subtitle: Text(
                          selectedDateTime.toLocal().toString().split('.')[0],
                          style: const TextStyle(color: Colors.white, fontSize: 13.5, fontWeight: FontWeight.bold),
                        ),
                        trailing: IconButton(
                          icon: const Icon(Icons.date_range, color: Color(0xFFF59E0B)),
                          onPressed: () async {
                            final pickedDate = await showDatePicker(
                              context: context,
                              initialDate: selectedDateTime,
                              firstDate: DateTime.now().subtract(const Duration(days: 1)),
                              lastDate: DateTime.now().add(const Duration(days: 90)),
                            );
                            if (pickedDate != null) {
                              final pickedTime = await showTimePicker(
                                context: context,
                                initialTime: TimeOfDay.fromDateTime(selectedDateTime),
                              );
                              if (pickedTime != null) {
                                setModalState(() {
                                  selectedDateTime = DateTime(
                                    pickedDate.year,
                                    pickedDate.month,
                                    pickedDate.day,
                                    pickedTime.hour,
                                    pickedTime.minute,
                                  );
                                });
                              }
                            }
                          },
                        ),
                      ),
                      const SizedBox(height: 10),
                      TextField(
                        controller: locationController,
                        style: const TextStyle(color: Colors.white, fontSize: 13.5),
                        decoration: const InputDecoration(
                          labelText: 'Location / Link',
                          labelStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                          filled: true,
                          fillColor: Color(0xFF0B0F19),
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 10),
                      TextField(
                        controller: notesController,
                        style: const TextStyle(color: Colors.white, fontSize: 13.5),
                        decoration: const InputDecoration(
                          labelText: 'Candidate Interview Notes',
                          labelStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                          filled: true,
                          fillColor: Color(0xFF0B0F19),
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Save CTA Button
                    SizedBox(
                      width: double.infinity,
                      height: 46,
                      child: ElevatedButton(
                        onPressed: innerSubmitting
                            ? null
                            : () async {
                                setModalState(() => innerSubmitting = true);
                                final success = await jobProv.updateCompanyApplicationStatus(
                                  app.id,
                                  {
                                    'status': selectedStatus,
                                    if (selectedStatus == 'Interview Scheduled') ...{
                                      'interviewDate': selectedDateTime.toIso8601String(),
                                      'interviewLocation': locationController.text.trim(),
                                      'interviewNotes': notesController.text.trim(),
                                    }
                                  },
                                  token,
                                );
                                setModalState(() => innerSubmitting = false);
                                Navigator.of(context).pop();

                                if (context.mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(success
                                          ? 'Status updated successfully!'
                                          : 'Failed to update status.'),
                                      backgroundColor: success ? Colors.green : Colors.redAccent,
                                    ),
                                  );
                                }
                              },
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1)),
                        child: innerSubmitting
                            ? const CircularProgressIndicator(color: Colors.white)
                            : const Text('Update status & Save', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final jobProv = Provider.of<JobProvider>(context);
    final apps = jobProv.companyApplications;

    return DefaultTabController(
      length: 5,
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.only(left: 20, top: 20, right: 20),
              child: Text(
                'Candidate Pipeline',
                style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 4),
              child: Text(
                'Review student applicants and update status',
                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
              ),
            ),
            const SizedBox(height: 8),

            TabBar(
              isScrollable: true,
              indicatorColor: const Color(0xFF6366F1),
              labelColor: const Color(0xFF6366F1),
              unselectedLabelColor: const Color(0xFF94A3B8),
              tabs: [
                Tab(text: 'Applied (${apps.where((a) => a.status.toLowerCase() == 'applied').length})'),
                Tab(text: 'Shortlisted (${apps.where((a) => a.status.toLowerCase() == 'shortlisted').length})'),
                Tab(text: 'Interviews (${apps.where((a) => a.status.toLowerCase().contains('interview')).length})'),
                Tab(text: 'Offers (${apps.where((a) => a.status.toLowerCase() == 'selected' || a.status.toLowerCase().contains('offer')).length})'),
                Tab(text: 'Rejected (${apps.where((a) => a.status.toLowerCase() == 'rejected').length})'),
              ],
            ),

            Expanded(
              child: TabBarView(
                children: [
                  _buildCandidateList(context, apps.where((a) => a.status.toLowerCase() == 'applied').toList(), 'Applied', auth.user!.token!),
                  _buildCandidateList(context, apps.where((a) => a.status.toLowerCase() == 'shortlisted').toList(), 'Shortlisted', auth.user!.token!),
                  _buildCandidateList(context, apps.where((a) => a.status.toLowerCase().contains('interview')).toList(), 'Interview Scheduled', auth.user!.token!),
                  _buildCandidateList(context, apps.where((a) => a.status.toLowerCase() == 'selected' || a.status.toLowerCase().contains('offer')).toList(), 'Selected', auth.user!.token!),
                  _buildCandidateList(context, apps.where((a) => a.status.toLowerCase() == 'rejected').toList(), 'Rejected', auth.user!.token!),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCandidateList(BuildContext context, List<ApplicationModel> list, String stage, String token) {
    if (list.isEmpty) {
      return Center(
        child: Text(
          'No applicants in $stage',
          style: const TextStyle(color: Color(0xFF94A3B8), fontStyle: FontStyle.italic, fontSize: 13),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: list.length,
      itemBuilder: (ctx, i) {
        final app = list[i];
        return GestureDetector(
          onTap: () => _showCandidateReviewSheet(context, app, token),
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF121A2B),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withOpacity(0.08)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(app.student?.name ?? 'Applicant', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                      Text('🎓 ${app.student?.university ?? ""}', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12.5)),
                      const SizedBox(height: 8),
                      Text('Applied for: ${app.job?.title}', style: const TextStyle(color: Color(0xFF06B6D4), fontSize: 12.5)),
                    ],
                  ),
                ),
                const Icon(Icons.arrow_forward_ios, color: Color(0xFF94A3B8), size: 16),
              ],
            ),
          ),
        );
      },
    );
  }
}
