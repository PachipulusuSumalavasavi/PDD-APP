import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/job_provider.dart';

class DeadlineCalendarScreen extends StatelessWidget {
  const DeadlineCalendarScreen({Key? key}) : super(key: key);

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
              'Deadline Reminders',
              style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: jobProv.jobs.length,
                itemBuilder: (ctx, i) {
                  final job = jobProv.jobs[i];
                  final daysLeft = job.deadline.difference(DateTime.now()).inDays;

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF121A2B),
                      borderRadius: BorderRadius.circular(16),
                      border: Border(left: BorderSide(color: daysLeft <= 3 ? const Color(0xFFF43F5E) : const Color(0xFF6366F1), width: 4)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(job.title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                            Text(job.companyName, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                          ],
                        ),
                        Row(
                          children: [
                            const Icon(Icons.timer_outlined, color: Color(0xFFF43F5E), size: 16),
                            const SizedBox(width: 4),
                            Text(
                              '$daysLeft Days',
                              style: const TextStyle(color: Color(0xFFF43F5E), fontWeight: FontWeight.bold),
                            ),
                          ],
                        )
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
