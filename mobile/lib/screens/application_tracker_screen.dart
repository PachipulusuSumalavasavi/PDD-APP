import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/job_provider.dart';
import '../widgets/status_pill.dart';

class ApplicationTrackerScreen extends StatelessWidget {
  const ApplicationTrackerScreen({Key? key}) : super(key: key);

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
              'Application Tracker',
              style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: jobProv.applications.length,
                itemBuilder: (ctx, i) {
                  final app = jobProv.applications[i];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
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
                            Text(app.job?.title ?? 'Role', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                            StatusPill(status: app.status),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(app.job?.companyName ?? 'Company', style: const TextStyle(color: Color(0xFF06B6D4), fontSize: 13)),
                        if (app.interviewDate != null) ...[
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF59E0B).withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.videocam, color: Color(0xFFF59E0B), size: 16),
                                const SizedBox(width: 6),
                                Text(
                                  'Interview: ${app.interviewDate.toString().split(' ')[0]}',
                                  style: const TextStyle(color: Color(0xFFF59E0B), fontSize: 12, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          )
                        ]
                      ],
                    ),
                  );
                },
              ),
            )
          ],
        ),
      ),
    );
  }
}
