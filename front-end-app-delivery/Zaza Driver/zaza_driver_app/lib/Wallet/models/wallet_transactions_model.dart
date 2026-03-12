class WalletTransaction {
  final String orderId;
  final String transactionId;
  final String description;
  final DateTime date;
  final double amount;
  final bool success;

  const WalletTransaction({
    required this.orderId,
    required this.transactionId,
    required this.description,
    required this.date,
    required this.amount,
    required this.success,
  });
}
