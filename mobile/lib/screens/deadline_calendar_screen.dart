import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:table_calendar/table_calendar.dart';
import '../providers/job_provider.dart';

class DeadlineCalendarScreen extends StatefulWidget {
  const DeadlineCalendarScreen({Key? key}) : super(key: key);

  @override
  State<DeadlineCalendarScreen> createState() => _DeadlineCalendarScreenState();
}

class _DeadlineCalendarScreenState extends State<DeadlineCalendarScreen> {
  CalendarFormat _calendarFormat = CalendarFormat.month;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;
  }

  Map<DateTime, List<dynamic>> _getEventsMap(JobProvider jobProv) {
    final Map<DateTime, List<dynamic>> map = {};
    
    // Add job deadlines
    for (var job in jobProv.jobs) {
      final date = DateTime(job.deadline.year, job.deadline.month, job.deadline.day);
      if (map[date] == null) map[date] = [];
      map[date]!.add({
        'type': 'deadline',
        'title': job.title,
        'company': job.companyName,
        'date': job.deadline,
      });
    }

    // Add scheduled interviews
    for (var app in jobProv.applications) {
      if (app.interviewDate != null) {
        final date = DateTime(app.interviewDate!.year, app.interviewDate!.month, app.interviewDate!.day);
        if (map[date] == null) map[date] = [];
        map[date]!.add({
          'type': 'interview',
          'title': 'Interview: ${app.job?.title ?? "Role"}',
          'company': app.job?.companyName ?? "Company",
          'date': app.interviewDate!,
        });
      }
    }

    return map;
  }

  List<dynamic> _getEventsForDay(DateTime day, Map<DateTime, List<dynamic>> eventsMap) {
    return eventsMap[DateTime(day.year, day.month, day.day)] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    final jobProv = Provider.of<JobProvider>(context);
    final eventsMap = _getEventsMap(jobProv);
    
    final selectedDayEvents = _selectedDay != null 
        ? _getEventsForDay(_selectedDay!, eventsMap)
        : [];

    // All events sorted by date
    final allEvents = <dynamic>[];
    eventsMap.forEach((date, list) {
      allEvents.addAll(list);
    });
    allEvents.sort((a, b) => (a['date'] as DateTime).compareTo(b['date'] as DateTime));

    // Filter upcoming ones
    final upcomingEvents = allEvents.where((e) {
      final date = e['date'] as DateTime;
      return date.isAfter(DateTime.now().subtract(const Duration(days: 1)));
    }).toList();

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Deadline Calendar',
              style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const Text(
              'Interactive scheduler for job deadlines and interview calls',
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12.5),
            ),
            const SizedBox(height: 12),

            // TableCalendar
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF121A2B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: TableCalendar(
                firstDay: DateTime.utc(2026, 1, 1),
                lastDay: DateTime.utc(2027, 12, 31),
                focusedDay: _focusedDay,
                calendarFormat: _calendarFormat,
                selectedDayPredicate: (day) {
                  return isSameDay(_selectedDay, day);
                },
                onDaySelected: (selectedDay, focusedDay) {
                  setState(() {
                    _selectedDay = selectedDay;
                    _focusedDay = focusedDay;
                  });
                },
                onFormatChanged: (format) {
                  setState(() {
                    _calendarFormat = format;
                  });
                },
                onPageChanged: (focusedDay) {
                  _focusedDay = focusedDay;
                },
                eventLoader: (day) => _getEventsForDay(day, eventsMap),
                headerStyle: const HeaderStyle(
                  formatButtonVisible: true,
                  titleCentered: true,
                  titleTextStyle: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  formatButtonTextStyle: TextStyle(color: Colors.white, fontSize: 12),
                  formatButtonDecoration: BoxDecoration(
                    color: Color(0xFF6366F1),
                    borderRadius: BorderRadius.all(Radius.circular(8)),
                  ),
                  leftChevronIcon: Icon(Icons.chevron_left, color: Colors.white),
                  rightChevronIcon: Icon(Icons.chevron_right, color: Colors.white),
                ),
                calendarStyle: CalendarStyle(
                  defaultTextStyle: const TextStyle(color: Colors.white),
                  weekendTextStyle: const TextStyle(color: Colors.white70),
                  outsideDaysVisible: false,
                  selectedDecoration: const BoxDecoration(
                    color: Color(0xFF6366F1),
                    shape: BoxShape.circle,
                  ),
                  todayDecoration: BoxDecoration(
                    color: const Color(0xFF6366F1).withOpacity(0.2),
                    shape: BoxShape.circle,
                    border: Border.all(color: const Color(0xFF6366F1), width: 1),
                  ),
                ),
                calendarBuilders: CalendarBuilders(
                  markerBuilder: (context, date, events) {
                    if (events.isEmpty) return const SizedBox();
                    return Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: events.take(3).map((event) {
                        final ev = event as Map<String, dynamic>;
                        final color = ev['type'] == 'interview' ? const Color(0xFFF59E0B) : const Color(0xFFF43F5E);
                        return Container(
                          margin: const EdgeInsets.symmetric(horizontal: 1),
                          width: 5,
                          height: 5,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: color,
                          ),
                        );
                      }).toList(),
                    );
                  },
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Events List Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  _selectedDay != null
                      ? 'Events for ${_selectedDay!.toString().split(' ')[0]}'
                      : 'Upcoming Key Events',
                  style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                ),
                if (selectedDayEvents.isEmpty)
                  const Text(
                    'Showing next overall',
                    style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11.5, fontStyle: FontStyle.italic),
                  ),
              ],
            ),
            const SizedBox(height: 10),

            // Events List
            Expanded(
              child: _buildEventsList(
                selectedDayEvents.isNotEmpty ? selectedDayEvents : upcomingEvents,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEventsList(List<dynamic> events) {
    if (events.isEmpty) {
      return const Center(
        child: Text(
          'No scheduled interviews or deadlines.',
          style: TextStyle(color: Color(0xFF94A3B8), fontStyle: FontStyle.italic, fontSize: 13),
        ),
      );
    }

    return ListView.builder(
      itemCount: events.length,
      itemBuilder: (ctx, i) {
        final ev = events[i] as Map<String, dynamic>;
        final isInterview = ev['type'] == 'interview';
        final color = isInterview ? const Color(0xFFF59E0B) : const Color(0xFFF43F5E);
        final title = ev['title'] as String;
        final company = ev['company'] as String;
        final date = ev['date'] as DateTime;

        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFF121A2B),
            borderRadius: BorderRadius.circular(12),
            border: Border(
              left: BorderSide(color: color, width: 4),
              top: BorderSide(color: Colors.white.withOpacity(0.06)),
              right: BorderSide(color: Colors.white.withOpacity(0.06)),
              bottom: BorderSide(color: Colors.white.withOpacity(0.06)),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      isInterview ? '🎥 INTERVIEW SCHEDULED' : '⏳ APPLICATION DEADLINE',
                      style: TextStyle(color: color, fontSize: 9.5, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      title,
                      style: const TextStyle(color: Colors.white, fontSize: 13.5, fontWeight: FontWeight.bold),
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      company,
                      style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11.5),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.calendar_month, color: Color(0xFF94A3B8), size: 16),
                  const SizedBox(height: 2),
                  Text(
                    '${date.month}/${date.day}',
                    style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
