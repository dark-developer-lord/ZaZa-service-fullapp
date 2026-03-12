class MostOrderedItem {
  final String title; // McDonald's - Tasjeel
  final String cuisine; // American, Fast Food
  final String imageUrl; // banner image
  final double rating; // 4.7
  final int reviews; // 999
  final String eta; // 25 - 35 mins
  final String distance; // 1.4 km
  final String? badge; // "15 off\nMembers Only" etc

  const MostOrderedItem({
    required this.title,
    required this.cuisine,
    required this.imageUrl,
    required this.rating,
    required this.reviews,
    required this.eta,
    required this.distance,
    this.badge,
  });
}
