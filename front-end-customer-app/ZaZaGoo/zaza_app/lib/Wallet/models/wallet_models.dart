enum WalletTxType { topUp, payment, refund }

class WalletTransactionItem {
  final String title;
  final DateTime date;
  final double amount;
  final WalletTxType type;

  const WalletTransactionItem({
    required this.title,
    required this.date,
    required this.amount,
    required this.type,
  });

  bool get isPositive {
    return type == WalletTxType.topUp || type == WalletTxType.refund;
  }
}
