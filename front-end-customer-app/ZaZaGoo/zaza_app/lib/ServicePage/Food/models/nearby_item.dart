class NearbyItem {
  final String title;
  final String imageUrl;
  final double rating;
  final String eta; // "20 - 30 mins"
  final String cuisine; // "BBQ & Grill"
  final String? tag; // "New" / null
  final String? badge; // "30% off" / null

  const NearbyItem({
    required this.title,
    required this.imageUrl,
    required this.rating,
    required this.eta,
    required this.cuisine,
    this.tag,
    this.badge,
  });
}
