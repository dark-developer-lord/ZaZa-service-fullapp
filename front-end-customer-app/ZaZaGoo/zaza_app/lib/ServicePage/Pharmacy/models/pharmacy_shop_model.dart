class PharmacyShop {
  final String name;
  final String logoUrl;
  final double rating;
  final String reviewsText; // "(600+)" ё "(83)" ё "New"
  final String etaText; // "40 - 50 mins"
  final bool isClosed;

  const PharmacyShop({
    required this.name,
    required this.logoUrl,
    required this.rating,
    required this.reviewsText,
    required this.etaText,
    this.isClosed = false,
  });
}
