import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:zaza_app/Menu/view/menu_sheet.dart';
import 'package:zaza_app/Wallet/models/wallet_models.dart';
import 'package:zaza_app/Wallet/view/wallet_view_all_page.dart';

class WalletBalancePage extends StatelessWidget {
  const WalletBalancePage({
    super.key,
    required this.balance,
    this.transactions = const [],
    this.onTelegramTap,
    this.onWhatsAppTap,
    this.onCallTap,
  });

  final double balance;
  final List<WalletTransactionItem> transactions;

  final VoidCallback? onTelegramTap;
  final VoidCallback? onWhatsAppTap;
  final VoidCallback? onCallTap;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: Column(
        children: [
          _WalletHeader(
            balance: balance,
            onBack: () => Navigator.pop(context),
            onTopUpTap: () => _showTopUpSheet(context),
          ),
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Color(0xFFF5F5F5),
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 18, 16, 20),
                children: [
                  Row(
                    children: [
                      const Text(
                        "Wallet transactions",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF111827),
                        ),
                      ),
                      const Spacer(),
                      if (transactions.isNotEmpty)
                        Material(
                          color: Colors.transparent,
                          child: InkWell(
                            borderRadius: BorderRadius.circular(12),
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => WalletTransactionsPage(
                                    balance: 13,
                                    transactions: [
                                      WalletTransactionItem(
                                        title: "Ride refund",
                                        date: DateTime(2026, 1, 29, 16, 10),
                                        amount: 13,
                                        type: WalletTxType.refund,
                                      ),
                                      WalletTransactionItem(
                                        title: "Wallet top up",
                                        date: DateTime(2026, 1, 29, 10, 00),
                                        amount: 20,
                                        type: WalletTxType.topUp,
                                      ),
                                      WalletTransactionItem(
                                        title: "Order payment",
                                        date: DateTime(2026, 1, 29, 13, 20),
                                        amount: 7,
                                        type: WalletTxType.payment,
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                            child: const Padding(
                              padding: EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 6,
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    "View all",
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w700,
                                      color: Color(0xFF0B5D47),
                                    ),
                                  ),
                                  SizedBox(width: 4),
                                  Icon(
                                    Icons.arrow_forward_rounded,
                                    size: 19,
                                    color: Color(0xFF0B5D47),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  if (transactions.isEmpty)
                    const _EmptyTransactionsCard()
                  else
                    ...transactions.map(
                      (item) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: _TransactionCard(item: item),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showTopUpSheet(BuildContext context) {
    HapticFeedback.selectionClick();

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      barrierColor: Colors.black.withOpacity(0.18),
      isScrollControlled: false,
      useSafeArea: true,
      builder: (ctx) {
        return _TopUpBottomSheet(
          onTelegramTap: () {
            Navigator.pop(ctx);
            onTelegramTap?.call();
          },
          onWhatsAppTap: () {
            Navigator.pop(ctx);
            onWhatsAppTap?.call();
          },
          onCallTap: () {
            Navigator.pop(ctx);
            onCallTap?.call();
          },
        );
      },
    );
  }
}

class _WalletHeader extends StatelessWidget {
  const _WalletHeader({
    required this.balance,
    required this.onBack,
    required this.onTopUpTap,
  });

  final double balance;
  final VoidCallback onBack;
  final VoidCallback onTopUpTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 285,
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF003B2F), Color(0xFF004C3C)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(30)),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  _SquareIconButton(
                    icon: Icons.arrow_back_rounded,
                    onTap: onBack,
                  ),
                  const Spacer(),
                  _SquareIconButton(
                    icon: Icons.menu,
                    onTap: () => MenuSheet.show(context),
                  ),
                ],
              ),
              const Spacer(),
              const Text(
                "Wallet balance",
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.white70,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                "${balance.toStringAsFixed(0)} c",
                style: const TextStyle(
                  fontSize: 24,
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                height: 54,
                child: ElevatedButton(
                  onPressed: onTopUpTap,
                  style: ElevatedButton.styleFrom(
                    elevation: 0,
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF003B2F),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                  ),
                  child: const Text(
                    "Top up balance",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SquareIconButton extends StatelessWidget {
  const _SquareIconButton({required this.icon, required this.onTap});

  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white.withOpacity(0.92),
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: SizedBox(
          width: 44,
          height: 44,
          child: Icon(icon, color: const Color(0xFF1E1E1E), size: 22),
        ),
      ),
    );
  }
}

class _TopUpBottomSheet extends StatelessWidget {
  const _TopUpBottomSheet({
    required this.onTelegramTap,
    required this.onWhatsAppTap,
    required this.onCallTap,
  });

  final VoidCallback onTelegramTap;
  final VoidCallback onWhatsAppTap;
  final VoidCallback onCallTap;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      bottom: false,
      child: Container(
        padding: EdgeInsets.only(bottom: 34),
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.12),
              blurRadius: 20,
              offset: const Offset(0, -6),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 18),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 44,
                height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFE5E7EB),
                  borderRadius: BorderRadius.circular(999),
                ),
              ),
              const SizedBox(height: 14),
              const Text(
                "Top up balance",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF111827),
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                "Choose how you want to contact us for balance top up",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 13,
                  color: Color(0xFF6B7280),
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 18),
              _ContactActionTile(
                icon: Icons.telegram,
                title: "Telegram",
                subtitle: "Write to us on Telegram",
                onTap: onTelegramTap,
              ),
              const SizedBox(height: 10),
              _ContactActionTile(
                icon: Icons.chat_rounded,
                title: "WhatsApp",
                subtitle: "Write to us on WhatsApp",
                onTap: onWhatsAppTap,
              ),
              const SizedBox(height: 10),
              _ContactActionTile(
                icon: Icons.call_rounded,
                title: "Call",
                subtitle: "Call support to top up balance",
                onTap: onCallTap,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ContactActionTile extends StatelessWidget {
  const _ContactActionTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFFF8F8F8),
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, color: const Color(0xFF003B2F)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF6B7280),
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right_rounded, color: Color(0xFF9CA3AF)),
            ],
          ),
        ),
      ),
    );
  }
}

class _TransactionCard extends StatelessWidget {
  const _TransactionCard({required this.item});

  final WalletTransactionItem item;

  @override
  Widget build(BuildContext context) {
    final amountColor = item.isPositive
        ? const Color(0xFF0B8B68)
        : const Color(0xFFB91C1C);

    final amountPrefix = item.isPositive ? "+" : "-";

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: const Color(0xFFF3F4F6),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(
              _iconForType(item.type),
              color: item.isPositive
                  ? const Color(0xFF0B8B68)
                  : const Color(0xFFB91C1C),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _formatDate(item.date),
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF6B7280),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  item.title,
                  style: const TextStyle(
                    fontSize: 16,
                    color: Color(0xFF111827),
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
          ),
          Text(
            "$amountPrefix ${item.amount.toStringAsFixed(0)} c",
            style: TextStyle(
              fontSize: 16,
              color: amountColor,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
    );
  }

  /// icon барои transaction type
  IconData _iconForType(WalletTxType type) {
    switch (type) {
      case WalletTxType.topUp:
        return Icons.add_circle_rounded;
      case WalletTxType.payment:
        return Icons.remove_circle_rounded;
      case WalletTxType.refund:
        return Icons.replay_circle_filled_rounded;
    }
  }

  /// format date
  String _formatDate(DateTime date) {
    return "${date.day}.${date.month}.${date.year}";
  }
}

class _EmptyTransactionsCard extends StatelessWidget {
  const _EmptyTransactionsCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(
        children: const [
          Icon(Icons.receipt_long_rounded, size: 34, color: Color(0xFF9CA3AF)),
          SizedBox(height: 10),
          Text(
            "No wallet transactions yet",
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: Color(0xFF111827),
            ),
          ),
          SizedBox(height: 4),
          Text(
            "Your balance history will appear here.",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: Color(0xFF6B7280),
            ),
          ),
        ],
      ),
    );
  }
}
