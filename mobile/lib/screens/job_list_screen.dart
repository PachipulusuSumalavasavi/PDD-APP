import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/job_provider.dart';

class JobListScreen extends StatefulWidget {
  const JobListScreen({Key? key}) : super(key: key);

  @override
  State<JobListScreen> createState() => _JobListScreenState();
}

class _JobListScreenState extends State<JobListScreen> {
  bool _isActionLoading = false;

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final jobProv = Provider.of<JobProvider>(context);

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
            Expanded(
              child: jobProv.jobs.isEmpty
                  ? const Center(
                      child: Text(
                        'No job opportunities available.',
                        style: TextStyle(color: Color(0xFF94A3B8), fontStyle: FontStyle.italic),
                      ),
                    )
                  : ListView.builder(
                      itemCount: jobProv.jobs.length,
                      itemBuilder: (ctx, i) {
                        final job = jobProv.jobs[i];
                        final isApplied = jobProv.applications.any((app) => app.job?.id == job.id);

                        return Container(
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
                              Text(job.title, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 4),
                              Text('${job.companyName} • ${job.location}', style: const TextStyle(color: Color(0xFF06B6D4), fontSize: 13)),
                              const SizedBox(height: 8),
                              Text(job.stipendOrSalary, style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 13)),
                              const SizedBox(height: 12),
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton(
                                  onPressed: isApplied || _isActionLoading
                                      ? null
                                      : () async {
                                          final token = auth.user?.token;
                                          if (token != null) {
                                            setState(() => _isActionLoading = true);
                                            final success = await jobProv.applyForJob(job, token);
                                            setState(() => _isActionLoading = false);

                                            if (mounted) {
                                              ScaffoldMessenger.of(context).showSnackBar(
                                                SnackBar(
                                                  content: Text(success
                                                      ? 'Successfully applied for ${job.title}!'
                                                      : 'Failed to submit application. Please try again.'),
                                                  backgroundColor: success ? Colors.green : Colors.redAccent,
                                                ),
                                              );
                                            }
                                          }
                                        },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: isApplied ? const Color(0xFF1E293B) : const Color(0xFF6366F1),
                                    disabledBackgroundColor: const Color(0xFF1E293B),
                                  ),
                                  child: Text(
                                    isApplied ? 'Applied' : 'Apply Opportunity',
                                    style: TextStyle(
                                      color: isApplied ? const Color(0xFF94A3B8) : Colors.white,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              )
                            ],
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
