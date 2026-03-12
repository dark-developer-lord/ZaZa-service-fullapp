enum ActivityType { food, supermarket, pharmacy, box }

class ActivityItem {
  final DateTime date; // only day is used for grouping
  final ActivityType type;
  final String title;
  final String subtitle;
  final double amount;
  final bool cancelled;

  const ActivityItem({
    required this.date,
    required this.type,
    required this.title,
    required this.subtitle,
    required this.amount,
    this.cancelled = false,
  });
}
