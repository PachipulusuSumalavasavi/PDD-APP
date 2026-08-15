import 'package:flutter/material.dart';

class StatusPill extends StatelessWidget {
  final String status;

  const StatusPill({Key? key, required this.status}) : super(key: key);

  Color getStatusColor() {
    switch (status) {
      case 'Applied': return const Color(0xFF6366F1);
      case 'Shortlisted': return const Color(0xFF06B6D4);
      case 'Interview Scheduled':
      case 'Interview': return const Color(0xFFF59E0B);
      case 'Selected': return const Color(0xFF10B981);
      case 'Rejected': return const Color(0xFFF43F5E);
      default: return const Color(0xFF6366F1);
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = getStatusColor();
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Text(
        status,
        style: TextStyle(
          color: color,
          fontSize: 11,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
