import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/job_provider.dart';
import '../models/application_model.dart';
import '../widgets/status_pill.dart';
import 'job_list_screen.dart';
import 'application_tracker_screen.dart';
import 'deadline_calendar_screen.dart';

class StudentDashboardScreen extends StatefulWidget {
  const StudentDashboardScreen({Key? key}) : super(key: key);

  @override
  State<StudentDashboardScreen> createState() => _StudentDashboardScreenState();
}

class _StudentDashboardScreenState extends State<StudentDashboardScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const StudentDashboardHome(),
    const JobListScreen(),
    const ApplicationTrackerScreen(),
    const DeadlineCalendarScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        backgroundColor: const Color(0xFF121A2B),
        selectedItemColor: const Color(0xFF6366F1),
        unselectedItemColor: const Color(0xFF94A3B8),
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.work_outline), label: 'Jobs'),
          BottomNavigationBarItem(icon: Icon(Icons.track_changes_outlined), label: 'Tracker'),
          BottomNavigationBarItem(icon: Icon(Icons.calendar_today_outlined), label: 'Deadlines'),
        ],
      ),
    );
  }
}

class StudentDashboardHome extends StatelessWidget {
  const StudentDashboardHome({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final jobProv = Provider.of<JobProvider>(context);

    // Calculate dynamic stats
    final totalApps = jobProv.applications.length;
    final interviewCount = jobProv.applications.where((app) => app.status.toLowerCase().contains('interview')).length;

    // Find the first scheduled interview (if any)
    final interviewApp = jobProv.applications.firstWhere(
      (app) => app.status.toLowerCase().contains('interview'),
      orElse: () => ApplicationModel(id: '', status: '', appliedAt: DateTime.now()),
    );

    return SafeArea(
      child: RefreshIndicator(
        onRefresh: () async {
          await jobProv.fetchJobs();
          if (auth.user?.token != null) {
            await jobProv.fetchApplications(auth.user!.token!);
          }
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome, ${auth.user?.name.split(' ')[0] ?? 'Student'} 👋',
                        style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
                      ),
                      const Text('Application & Placement Hub', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
                    ],
                  ),
                  CircleAvatar(
                    backgroundColor: const Color(0xFF6366F1).withOpacity(0.2),
                    child: const Icon(Icons.person, color: Color(0xFF6366F1)),
                  )
                ],
              ),
              const SizedBox(height: 24),

              // Stat Cards Grid
              Row(
                children: [
                  Expanded(child: _buildStatCard('Total Apps', '$totalApps', Icons.work, const Color(0xFF6366F1))),
                  const SizedBox(width: 12),
                  Expanded(child: _buildStatCard('Interviews', '$interviewCount', Icons.videocam, const Color(0xFFF59E0B))),
                ],
              ),
              const SizedBox(height: 24),

              // Upcoming Interview Alert Banner
              if (interviewApp.id.isNotEmpty)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF59E0B).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFF59E0B).withOpacity(0.4)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.event, color: Color(0xFFF59E0B), size: 28),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Interview Scheduled', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                            Text(
                              '${interviewApp.job?.title ?? 'Role'} • ${interviewApp.job?.companyName ?? 'Company'}',
                              style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                )
              else
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withOpacity(0.08)),
                  ),
                  child: Row(
                    children: const [
                      Icon(Icons.check_circle_outline, color: Color(0xFF10B981), size: 24),
                      SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'No interviews scheduled yet. Keep applying!',
                          style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: 24),

              const Text(
                'Recent Application Pipeline',
                style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),

              if (jobProv.applications.isEmpty)
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
                      'No applications submitted yet.',
                      style: TextStyle(color: Color(0xFF94A3B8), fontSize: 14, fontStyle: FontStyle.italic),
                    ),
                  ),
                )
              else
                ...jobProv.applications.take(5).map((app) => Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFF121A2B),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white.withOpacity(0.08)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(app.job?.title ?? 'Role', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          Text(app.job?.companyName ?? 'Company', style: const TextStyle(color: Color(0xFF06B6D4), fontSize: 12)),
                        ],
                      ),
                      StatusPill(status: app.status),
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
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF121A2B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 12),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
          Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
        ],
      ),
    );
  }
}
