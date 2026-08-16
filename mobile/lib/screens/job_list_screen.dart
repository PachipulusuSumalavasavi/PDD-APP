import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/job_provider.dart';
import '../models/job_model.dart';

class JobListScreen extends StatefulWidget {
  const JobListScreen({Key? key}) : super(key: key);

  @override
  State<JobListScreen> createState() => _JobListScreenState();
}

class _JobListScreenState extends State<JobListScreen> {
  String _selectedType = 'All';
  String _searchKeyword = '';
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showJobDetailsSheet(BuildContext context, JobModel job, bool isApplied, String token) {
    final jobProv = Provider.of<JobProvider>(context, listen: false);
    final coverController = TextEditingController();
    bool sheetSubmitting = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF121A2B),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            final daysLeft = job.deadline.difference(DateTime.now()).inDays;

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
                    // Handle Bar
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF06B6D4).withOpacity(0.15),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: const Color(0xFF06B6D4).withOpacity(0.3)),
                          ),
                          child: Text(
                            job.type.toUpperCase(),
                            style: const TextStyle(color: Color(0xFF06B6D4), fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, color: Colors.white, size: 20),
                          onPressed: () => Navigator.of(context).pop(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      job.title,
                      style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      job.companyName,
                      style: const TextStyle(color: Color(0xFF06B6D4), fontSize: 14, fontWeight: FontWeight.w500),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        const Icon(Icons.location_on_outlined, color: Color(0xFF94A3B8), size: 16),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            job.location,
                            style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const Icon(Icons.monetization_on_outlined, color: Color(0xFF10B981), size: 16),
                        const SizedBox(width: 4),
                        Text(
                          job.stipendOrSalary,
                          style: const TextStyle(color: Color(0xFF10B981), fontSize: 13, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Text('Requirements', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: job.requirements.map((req) => Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(color: Colors.white.withOpacity(0.08)),
                        ),
                        child: Text(req, style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 11)),
                      )).toList(),
                    ),
                    const SizedBox(height: 16),
                    const Text('Job Description', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                    const SizedBox(height: 6),
                    Text(
                      job.description,
                      style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13, height: 1.4),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Icon(Icons.access_time, color: daysLeft <= 3 ? const Color(0xFFF43F5E) : const Color(0xFF94A3B8), size: 16),
                        const SizedBox(width: 4),
                        Text(
                          daysLeft > 0 ? '$daysLeft days left to apply' : 'Deadline closing',
                          style: TextStyle(
                            color: daysLeft <= 3 ? const Color(0xFFF43F5E) : const Color(0xFF94A3B8),
                            fontSize: 12.5,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    
                    if (!isApplied) ...[
                      const Text('Cover Letter / Note (Optional)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                      const SizedBox(height: 6),
                      TextField(
                        controller: coverController,
                        maxLines: 3,
                        style: const TextStyle(color: Colors.white, fontSize: 13),
                        decoration: InputDecoration(
                          hintText: 'Why are you a good fit for this role?',
                          hintStyle: const TextStyle(color: Color(0xFF64748B)),
                          filled: true,
                          fillColor: const Color(0xFF0B0F19),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],

                    SizedBox(
                      width: double.infinity,
                      height: 46,
                      child: ElevatedButton(
                        onPressed: isApplied || sheetSubmitting
                            ? null
                            : () async {
                                setModalState(() => sheetSubmitting = true);
                                final success = await jobProv.applyForJob(
                                  job, 
                                  token,
                                  coverLetter: coverController.text.trim(),
                                );
                                setModalState(() => sheetSubmitting = false);
                                Navigator.of(context).pop();

                                if (context.mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(success
                                          ? 'Successfully applied for ${job.title}!'
                                          : 'Failed to submit application. Please try again.'),
                                      backgroundColor: success ? Colors.green : Colors.redAccent,
                                    ),
                                  );
                                }
                              },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: isApplied ? const Color(0xFF1E293B) : const Color(0xFF6366F1),
                          disabledBackgroundColor: const Color(0xFF1E293B),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: Text(
                          sheetSubmitting
                              ? 'Submitting...'
                              : (isApplied ? 'Applied' : 'Confirm Application'),
                          style: TextStyle(
                            color: isApplied ? const Color(0xFF94A3B8) : Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
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

    // Apply client filters
    final filteredJobs = jobProv.jobs.where((job) {
      final matchKeyword = job.title.toLowerCase().contains(_searchKeyword.toLowerCase()) ||
          job.companyName.toLowerCase().contains(_searchKeyword.toLowerCase()) ||
          job.description.toLowerCase().contains(_searchKeyword.toLowerCase()) ||
          job.requirements.any((req) => req.toLowerCase().contains(_searchKeyword.toLowerCase()));
      final matchType = _selectedType == 'All' || job.type == _selectedType;
      return matchKeyword && matchType;
    }).toList();

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Browse Opportunities',
              style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            // Search Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: const Color(0xFF121A2B),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: TextField(
                controller: _searchController,
                onChanged: (val) => setState(() => _searchKeyword = val),
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  border: InputBorder.none,
                  hintText: 'Search title, recruiter, or skill...',
                  hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                  icon: Icon(Icons.search, color: Color(0xFF94A3B8), size: 20),
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Filter Selector
            Row(
              children: [
                const Icon(Icons.filter_list, color: Color(0xFF94A3B8), size: 18),
                const SizedBox(width: 8),
                const Text('Filter Type:', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
                const SizedBox(width: 12),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFF121A2B),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.white.withOpacity(0.08)),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _selectedType,
                        dropdownColor: const Color(0xFF121A2B),
                        icon: const Icon(Icons.arrow_drop_down, color: Colors.white),
                        isExpanded: true,
                        style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                        items: <String>['All', 'Internship', 'Placement'].map((String value) {
                          return DropdownMenuItem<String>(
                            value: value,
                            child: Text(value),
                          );
                        }).toList(),
                        onChanged: (newValue) {
                          if (newValue != null) {
                            setState(() => _selectedType = newValue);
                          }
                        },
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Jobs list view
            Expanded(
              child: jobProv.isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : filteredJobs.isEmpty
                      ? const Center(
                          child: Text(
                            'No job opportunities available.',
                            style: TextStyle(color: Color(0xFF94A3B8), fontStyle: FontStyle.italic),
                          ),
                        )
                      : ListView.builder(
                          itemCount: filteredJobs.length,
                          itemBuilder: (ctx, i) {
                            final job = filteredJobs[i];
                            final isApplied = jobProv.applications.any((app) => app.job?.id == job.id);
                            final daysLeft = job.deadline.difference(DateTime.now()).inDays;

                            return GestureDetector(
                              onTap: () {
                                final token = auth.user?.token;
                                if (token != null) {
                                  _showJobDetailsSheet(context, job, isApplied, token);
                                }
                              },
                              child: Container(
                                margin: const EdgeInsets.only(bottom: 14),
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF121A2B),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFF6366F1).withOpacity(0.15),
                                            borderRadius: BorderRadius.circular(4),
                                            border: Border.all(color: const Color(0xFF6366F1).withOpacity(0.2)),
                                          ),
                                          child: Text(
                                            job.type,
                                            style: const TextStyle(color: Color(0xFF818CF8), fontSize: 9.5, fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                        Text(
                                          daysLeft > 0 ? '$daysLeft days left' : 'Closing soon',
                                          style: TextStyle(
                                            color: daysLeft <= 3 ? const Color(0xFFF43F5E) : const Color(0xFF94A3B8),
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(job.title, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                                    const SizedBox(height: 4),
                                    Text('${job.companyName} • ${job.location}', style: const TextStyle(color: Color(0xFF06B6D4), fontSize: 12.5)),
                                    const SizedBox(height: 8),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(job.stipendOrSalary, style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 13)),
                                        if (isApplied)
                                          Row(
                                            children: const [
                                              Icon(Icons.check_circle, color: Color(0xFF10B981), size: 16),
                                              SizedBox(width: 4),
                                              Text('Applied', style: TextStyle(color: Color(0xFF10B981), fontSize: 12, fontWeight: FontWeight.bold)),
                                            ],
                                          )
                                        else
                                          const Text(
                                            'View & Apply ➜',
                                            style: TextStyle(color: Color(0xFF6366F1), fontSize: 12, fontWeight: FontWeight.bold),
                                          )
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }
}
