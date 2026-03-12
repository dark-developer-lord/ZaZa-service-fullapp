class BasketLine {
  final String id;
  final String title;
  final double price;
  final String? imageUrl;

  int qty;

  BasketLine({
    required this.id,
    required this.title,
    required this.price,
    this.imageUrl,
    required this.qty,
  });
}
