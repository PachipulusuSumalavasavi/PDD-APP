import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/job_provider.dart';

class JobListScreen extends StatelessWidget {
  const JobListScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
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
              child: ListView.builder(
                itemCount: jobProv.jobs.length,
                itemBuilder: (ctx, i) {
                  final job = jobProv.jobs[i];
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
                            onPressed: () {
                              jobProv.applyForJob(job);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Applied for ${job.title}!')),
                              );
                            },
                            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1)),
                            child: const Text('Apply Opportunity', style: TextStyle(color: Colors.white)),
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
