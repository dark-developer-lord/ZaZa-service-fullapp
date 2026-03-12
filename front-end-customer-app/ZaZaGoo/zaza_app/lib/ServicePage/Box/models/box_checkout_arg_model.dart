class BoxCheckoutArgs {
  final String pickup;
  final String dropoff;
  final String vehicleTitle;
  final String instructions; // empty allowed
  final String packageCategory;
  final int total; // example: 23

  const BoxCheckoutArgs({
    required this.pickup,
    required this.dropoff,
    required this.vehicleTitle,
    required this.instructions,
    required this.packageCategory,
    required this.total,
  });
}
