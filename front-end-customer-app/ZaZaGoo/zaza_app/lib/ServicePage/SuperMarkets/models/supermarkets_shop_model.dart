import 'package:flutter/foundation.dart';

@immutable
class SuperMarketShop {
  final String name;
  final String logoUrl; // ҳозир demo (picsum) ё баъд real
  final double rating;
  final String reviewsText; // "(600+)"
  final String etaText; // "40 - 50 mins"
  final bool isClosed;

  const SuperMarketShop({
    required this.name,
    required this.logoUrl,
    required this.rating,
    required this.reviewsText,
    required this.etaText,
    required this.isClosed,
  });
}
