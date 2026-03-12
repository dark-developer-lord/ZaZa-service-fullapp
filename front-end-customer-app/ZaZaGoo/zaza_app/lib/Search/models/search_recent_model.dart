class RecentSearchItem {
  final String title;
  final String subtitle;
  final SearchItemType type;

  const RecentSearchItem({
    required this.title,
    required this.subtitle,
    required this.type,
  });
}

enum SearchItemType { restaurant, product, category }
