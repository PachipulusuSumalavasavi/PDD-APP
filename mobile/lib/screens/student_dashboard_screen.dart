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
    final shortlistedCount = jobProv.applications.where((app) => app.status.toLowerCase() == 'shortlisted').length;
    final interviewCount = jobProv.applications.where((app) => app.status.toLowerCase().contains('interview')).length;
    final selectedCount = jobProv.applications.where((app) => app.status.toLowerCase() == 'selected' || app.status.toLowerCase().contains('offer')).length;

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
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome back, ${auth.user?.name.split(' ')[0] ?? 'Student'} 👋',
                          style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
                          overflow: TextOverflow.ellipsis,
                        ),
                        const Text('Application & Placement Hub', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
                      ],
                    ),
                  ),
                  CircleAvatar(
                    backgroundColor: const Color(0xFF6366F1).withOpacity(0.2),
                    child: const Icon(Icons.person, color: Color(0xFF6366F1)),
                  )
                ],
              ),
              const SizedBox(height: 24),

              // Stat Cards Responsive Grid (2x2)
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.35,
                children: [
                  _buildStatCard('Total Apps', '$totalApps', Icons.work, const Color(0xFF6366F1)),
                  _buildStatCard('Shortlisted', '$shortlistedCount', Icons.trending_up, const Color(0xFF06B6D4)),
                  _buildStatCard('Interviews', '$interviewCount', Icons.videocam, const Color(0xFFF59E0B)),
                  _buildStatCard('Selected', '$selectedCount', Icons.check_circle_outline, const Color(0xFF10B981)),
                ],
              ),
              const SizedBox(height: 24),

              // Upcoming Interview Alert Banner
              if (interviewApp.id.isNotEmpty)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF121A2B),
                    borderRadius: BorderRadius.circular(16),
                    border: Border(
                      left: const BorderSide(color: Color(0xFFF59E0B), width: 4),
                      top: BorderSide(color: Colors.white.withOpacity(0.08)),
                      right: BorderSide(color: Colors.white.withOpacity(0.08)),
                      bottom: BorderSide(color: Colors.white.withOpacity(0.08)),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.videocam, color: Color(0xFFF59E0B), size: 22),
                          SizedBox(width: 8),
                          Text(
                            'Scheduled Interview',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        interviewApp.job?.title ?? 'Role',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        interviewApp.job?.companyName ?? 'Company',
                        style: const TextStyle(color: Color(0xFF06B6D4), fontSize: 13, fontWeight: FontWeight.w500),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF59E0B).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '📅 Date: ${interviewApp.interviewDate?.toLocal().toString().split('.')[0] ?? ''}',
                              style: const TextStyle(color: Color(0xFFF59E0B), fontSize: 12.5, fontWeight: FontWeight.bold),
                            ),
                            if (interviewApp.interviewLocation != null && interviewApp.interviewLocation!.isNotEmpty) ...[
                              const SizedBox(height: 4),
                              Text(
                                '📍 Location: ${interviewApp.interviewLocation}',
                                style: const TextStyle(color: Colors.white70, fontSize: 12),
                              ),
                            ],
                            if (interviewApp.interviewNotes != null && interviewApp.interviewNotes!.isNotEmpty) ...[
                              const SizedBox(height: 4),
                              Text(
                                '📝 Notes: ${interviewApp.interviewNotes}',
                                style: const TextStyle(color: Colors.white70, fontSize: 12),
                              ),
                            ],
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
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              app.job?.title ?? 'Role',
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              app.job?.companyName ?? 'Company',
                              style: const TextStyle(color: Color(0xFF06B6D4), fontSize: 12),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
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
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
          Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11), overflow: TextOverflow.ellipsis),
        ],
      ),
    );
  }
}
