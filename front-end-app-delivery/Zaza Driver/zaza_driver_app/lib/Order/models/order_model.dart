enum OrderStatus { newOrder, accepted, pickedUp, completed }

class OrderModel {
  final String customer;
  final String orderId;

  final String pickup;
  final double? pickupLat;
  final double? pickupLng;

  final String dropoff;
  final double? dropoffLat;
  final double? dropoffLng;

  final String km;
  final String type;
  final String price;
  final String? badge;
  final OrderStatus status;

  final String? specialInstructions;

  const OrderModel({
    required this.customer,
    required this.orderId,

    required this.pickup,
    this.pickupLat,
    this.pickupLng,

    required this.dropoff,
    this.dropoffLat,
    this.dropoffLng,

    required this.km,
    required this.type,
    required this.price,
    this.badge,
    this.status = OrderStatus.newOrder,
    this.specialInstructions,
  });

  OrderModel copyWith({
    OrderStatus? status,
    String? badge,
    String? specialInstructions,
    double? pickupLat,
    double? pickupLng,
    double? dropoffLat,
    double? dropoffLng,
  }) {
    return OrderModel(
      customer: customer,
      orderId: orderId,
      pickup: pickup,
      pickupLat: pickupLat ?? this.pickupLat,
      pickupLng: pickupLng ?? this.pickupLng,
      dropoff: dropoff,
      dropoffLat: dropoffLat ?? this.dropoffLat,
      dropoffLng: dropoffLng ?? this.dropoffLng,
      km: km,
      type: type,
      price: price,
      badge: badge ?? this.badge,
      status: status ?? this.status,
      specialInstructions: specialInstructions ?? this.specialInstructions,
    );
  }
}
