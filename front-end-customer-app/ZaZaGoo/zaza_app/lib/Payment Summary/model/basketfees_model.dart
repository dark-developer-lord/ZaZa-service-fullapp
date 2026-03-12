class BasketFees {
  final double serviceFee;
  final double smallOrderFee;
  final double deliveryFee;

  const BasketFees({
    required this.serviceFee,
    required this.smallOrderFee,
    required this.deliveryFee,
  });

  double get totalExtras => serviceFee + smallOrderFee + deliveryFee;
}

double _round2(double v) => double.parse(v.toStringAsFixed(2));

BasketFees calcFees({
  required double subtotal, // ҷамъбасти маҳсулот
  required double deliveryFee, // мисол: 10.00 ё 7.00
  double servicePercent = 0.05, // 5%
  double serviceMin = 2,
  double serviceMax = 10,
  double smallOrderThreshold = 50,
}) {
  if (subtotal <= 0) {
    return const BasketFees(serviceFee: 0, smallOrderFee: 0, deliveryFee: 0);
  }

  // ✅ Service fee: 5% min 0.95 max 4.95
  final rawService = subtotal * servicePercent;
  final serviceFee = _round2(rawService.clamp(serviceMin, serviceMax));

  // ✅ Small order fee: то threshold расондан
  final smallOrderFee = _round2(
    subtotal < smallOrderThreshold ? (smallOrderThreshold - subtotal) : 0.0,
  );

  return BasketFees(
    serviceFee: serviceFee,
    smallOrderFee: smallOrderFee,
    deliveryFee: _round2(deliveryFee),
  );
}
