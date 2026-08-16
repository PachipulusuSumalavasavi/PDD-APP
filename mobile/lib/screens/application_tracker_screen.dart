import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/job_provider.dart';
import '../models/application_model.dart';
import '../widgets/status_pill.dart';

class ApplicationTrackerScreen extends StatelessWidget {
  const ApplicationTrackerScreen({Key? key}) : super(key: key);

  void _showAppDetailsSheet(BuildContext context, ApplicationModel app) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF121A2B),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              // Handle bar
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
                  StatusPill(status: app.status),
                  Text(
                    'Applied: ${app.appliedAt.toLocal().toString().split(' ')[0]}',
                    style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                app.job?.title ?? 'Role',
                style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
              Text(
                app.job?.companyName ?? 'Company',
                style: const TextStyle(color: Color(0xFF06B6D4), fontSize: 14, fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 16),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF0B0F19),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('📍 Location: ${app.job?.location ?? "Remote"}', style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 13)),
                    const SizedBox(height: 6),
                    Text('💰 Compensation: ${app.job?.stipendOrSalary ?? "N/A"}', style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 13)),
                  ],
                ),
              ),
              if (app.interviewDate != null) ...[
                const SizedBox(height: 16),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF59E0B).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0xFFF59E0B).withOpacity(0.3)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.videocam, color: Color(0xFFF59E0B), size: 18),
                          SizedBox(width: 6),
                          Text('Interview Scheduled', style: TextStyle(color: Color(0xFFF59E0B), fontWeight: FontWeight.bold, fontSize: 13.5)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '📅 Date: ${app.interviewDate!.toLocal().toString().split('.')[0]}',
                        style: const TextStyle(color: Colors.white, fontSize: 12.5),
                      ),
                      if (app.interviewLocation != null && app.interviewLocation!.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          '📍 Location: ${app.interviewLocation}',
                          style: const TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ],
                      if (app.interviewNotes != null && app.interviewNotes!.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          '📝 Notes: ${app.interviewNotes}',
                          style: const TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: BorderSide(color: Colors.white.withOpacity(0.2)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: const Text('Close'),
                ),
              )
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final jobProv = Provider.of<JobProvider>(context);
    final apps = jobProv.applications;

    final appliedApps = apps.where((a) => a.status.toLowerCase() == 'applied').toList();
    final shortlistedApps = apps.where((a) => a.status.toLowerCase() == 'shortlisted').toList();
    final interviewApps = apps.where((a) => a.status.toLowerCase().contains('interview')).toList();
    final selectedApps = apps.where((a) => a.status.toLowerCase() == 'selected' || a.status.toLowerCase().contains('offer')).toList();
    final rejectedApps = apps.where((a) => a.status.toLowerCase() == 'rejected').toList();

    return DefaultTabController(
      length: 5,
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.only(left: 20, top: 20, right: 20),
              child: Text(
                'Application Tracker',
                style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
              ),
            ),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 4),
              child: Text(
                'Live pipeline board of your applications',
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
                Tab(text: 'Applied (${appliedApps.length})'),
                Tab(text: 'Shortlisted (${shortlistedApps.length})'),
                Tab(text: 'Interviews (${interviewApps.length})'),
                Tab(text: 'Offers (${selectedApps.length})'),
                Tab(text: 'Rejected (${rejectedApps.length})'),
              ],
            ),
            Expanded(
              child: TabBarView(
                children: [
                  _buildStageList(context, appliedApps, 'Applied'),
                  _buildStageList(context, shortlistedApps, 'Shortlisted'),
                  _buildStageList(context, interviewApps, 'Interview Scheduled'),
                  _buildStageList(context, selectedApps, 'Selected'),
                  _buildStageList(context, rejectedApps, 'Rejected'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStageList(BuildContext context, List<ApplicationModel> stageApps, String stageName) {
    if (stageApps.isEmpty) {
      return Center(
        child: Text(
          'No applications in $stageName',
          style: const TextStyle(color: Color(0xFF94A3B8), fontStyle: FontStyle.italic, fontSize: 14),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: stageApps.length,
      itemBuilder: (ctx, i) {
        final app = stageApps[i];
        return GestureDetector(
          onTap: () => _showAppDetailsSheet(context, app),
          child: Container(
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
                    Expanded(
                      child: Text(
                        app.job?.title ?? 'Role',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Icon(Icons.chevron_right, color: Color(0xFF94A3B8), size: 20),
                  ],
                ),
                const SizedBox(height: 4),
                Text(app.job?.companyName ?? 'Company', style: const TextStyle(color: Color(0xFF06B6D4), fontSize: 13)),
                if (app.interviewDate != null) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF59E0B).withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
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
          ),
        );
      },
    );
  }
}
