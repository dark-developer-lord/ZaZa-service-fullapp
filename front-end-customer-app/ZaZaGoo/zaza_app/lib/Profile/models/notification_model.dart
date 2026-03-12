class AppNotification {
  final String title;
  final String body;
  final DateTime time;
  final bool isRead;

  const AppNotification({
    required this.title,
    required this.body,
    required this.time,
    this.isRead = false,
  });
}
