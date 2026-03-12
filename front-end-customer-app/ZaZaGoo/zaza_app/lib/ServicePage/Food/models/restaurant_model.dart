class RestaurantItem {
  final String name;
  final String cuisine;
  final String imageUrl;
  final double rating;
  final int reviews;
  final String eta;
  final double distanceKm;
  final double deliveryFee;

  const RestaurantItem({
    required this.name,
    required this.cuisine,
    required this.imageUrl,
    required this.rating,
    required this.reviews,
    required this.eta,
    required this.distanceKm,
    required this.deliveryFee,
  });
}
