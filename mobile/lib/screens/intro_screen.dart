import 'package:flutter/material.dart';
import 'login_screen.dart';
import 'register_screen.dart';

class IntroScreen extends StatelessWidget {
  const IntroScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Header Brand Row
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF6366F1), Color(0xFF06B6D4)],
                      ),
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF6366F1).withOpacity(0.35),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        )
                      ],
                    ),
                    child: const Icon(Icons.auto_awesome, color: Colors.white, size: 20),
                  ),
                  const SizedBox(width: 10),
                  const Text(
                    'Career',
                    style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.extrabold, letterSpacing: -0.5),
                  ),
                  const Text(
                    'Mate',
                    style: TextStyle(color: Color(0xFF06B6D4), fontSize: 20, fontWeight: FontWeight.extrabold, letterSpacing: -0.5),
                  ),
                ],
              ),
              const SizedBox(height: 36),

              // Small Tech Tag
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF06B6D4).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF06B6D4).withOpacity(0.25)),
                ),
                child: const Text(
                  '✨ Placement & Internship Ecosystem',
                  style: TextStyle(color: Color(0xFF06B6D4), fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 24),

              // Main Hero Title
              const Text(
                'Never Miss a Career Opportunity Again',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  height: 1.25,
                ),
              ),
              const SizedBox(height: 14),

              // Hero Subtext
              const Text(
                'CareerMate centralizes job discovery, application status pipelines, interactive calendar reminders, and recruiter shortlisting into one seamless platform.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13.5, height: 1.45),
              ),
              const SizedBox(height: 32),

              // CTA Action Buttons
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const RegisterScreen()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6366F1),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 5,
                    shadowColor: const Color(0xFF6366F1).withOpacity(0.4),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Text(
                        'Start Tracking Applications',
                        style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(width: 8),
                      Icon(Icons.arrow_forward, color: Colors.white, size: 18),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                    );
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: BorderSide(color: Colors.white.withOpacity(0.08)),
                    backgroundColor: const Color(0xFF121A2B),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text(
                    'Sign In to Account',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 40),

              // Features Header Label
              const Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Core Capabilities',
                  style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 12),

              // 3 Features Cards
              _buildFeatureCard(
                Icons.access_time_outlined,
                'Smart Deadline Reminders',
                'Automated countdown alerts and scheduled notifications before application closes or interviews start.',
                const Color(0xFF6366F1),
              ),
              const SizedBox(height: 12),
              _buildFeatureCard(
                Icons.check_circle_outline,
                'Visual Pipeline Tracker',
                'Kanban status board for Applied, Shortlisted, Interview Scheduled, Selected, or Rejected positions.',
                const Color(0xFF06B6D4),
              ),
              const SizedBox(height: 12),
              _buildFeatureCard(
                Icons.shield_outlined,
                'Unified Recruiter Portals',
                'Companies can post opportunities and schedule interviews; Admins moderate and verify recruiter accounts.',
                const Color(0xFF10B981),
              ),
              const SizedBox(height: 40),

              // Footer Copyright text
              const Divider(color: Colors.white10),
              const SizedBox(height: 16),
              const Text(
                '© 2026 CareerMate Application Tracking System.\nBuilt for Students & Recruiters.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Color(0xFF64748B), fontSize: 11, height: 1.4),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureCard(IconData icon, String title, String desc, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF121A2B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  desc,
                  style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12, height: 1.35),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
