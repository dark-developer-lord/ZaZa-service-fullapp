import 'package:flutter/material.dart';
import 'package:zaza_app/Menu/view/menu_sheet.dart';
import 'package:zaza_app/Wallet/models/wallet_models.dart';

class WalletTransactionsPage extends StatefulWidget {
  const WalletTransactionsPage({
    super.key,
    required this.balance,
    required this.transactions,
  });

  final double balance;
  final List<WalletTransactionItem> transactions;

  @override
  State<WalletTransactionsPage> createState() => _WalletTransactionsPageState();
}

class _WalletTransactionsPageState extends State<WalletTransactionsPage> {
  WalletFilter _selectedFilter = WalletFilter.all;

  @override
  Widget build(BuildContext context) {
    final filtered = _applyFilter(widget.transactions, _selectedFilter);
    final grouped = _groupTransactionsByDate(filtered);

    return Scaffold(
      backgroundColor: const Color(0xFFF3F4F6),
      body: Column(
        children: [
          _WalletTopHeader(
            balance: widget.balance,
            onBack: () => Navigator.pop(context),
            onMenu: () => MenuSheet.show(context),
          ),
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Color(0xFFF3F4F6),
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: ListView(
                padding: const EdgeInsets.only(bottom: 20),
                children: [
                  const SizedBox(height: 12),

                  /// Service update card
                  // const Padding(
                  //   padding: EdgeInsets.symmetric(horizontal: 16),
                  //   child: _ServiceUpdateCard(),
                  // ),
                  const SizedBox(height: 14),

                  /// Filters
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      children: [
                        _FilterChipItem(
                          title: "All",
                          selected: _selectedFilter == WalletFilter.all,
                          onTap: () => setState(() {
                            _selectedFilter = WalletFilter.all;
                          }),
                        ),
                        const SizedBox(width: 10),
                        _FilterChipItem(
                          title: "Money In",
                          selected: _selectedFilter == WalletFilter.moneyIn,
                          onTap: () => setState(() {
                            _selectedFilter = WalletFilter.moneyIn;
                          }),
                        ),
                        const SizedBox(width: 10),
                        _FilterChipItem(
                          title: "Money Out",
                          selected: _selectedFilter == WalletFilter.moneyOut,
                          onTap: () => setState(() {
                            _selectedFilter = WalletFilter.moneyOut;
                          }),
                        ),
                        const SizedBox(width: 10),
                        _FilterChipItem(
                          title: "Rewards",
                          selected: _selectedFilter == WalletFilter.rewards,
                          onTap: () => setState(() {
                            _selectedFilter = WalletFilter.rewards;
                          }),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 14),

                  if (filtered.isEmpty)
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: _EmptyTransactionsView(),
                    )
                  else
                    ...grouped.entries.map((entry) {
                      final day = entry.key;
                      final items = entry.value;

                      final total = items.fold<double>(
                        0,
                        (sum, e) =>
                            e.isPositive ? sum + e.amount : sum - e.amount,
                      );

                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _DateHeader(
                            title: _formatHeaderDate(day),
                            total: total,
                          ),
                          ...items.map(
                            (item) => _WalletTransactionTile(item: item),
                          ),
                        ],
                      );
                    }),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<WalletTransactionItem> _applyFilter(
    List<WalletTransactionItem> items,
    WalletFilter filter,
  ) {
    switch (filter) {
      case WalletFilter.all:
        return items;
      case WalletFilter.moneyIn:
        return items
            .where(
              (e) =>
                  e.type == WalletTxType.topUp || e.type == WalletTxType.refund,
            )
            .toList();
      case WalletFilter.moneyOut:
        return items.where((e) => e.type == WalletTxType.payment).toList();
      case WalletFilter.rewards:
        return items.where((e) => e.type == WalletTxType.refund).toList();
    }
  }

  Map<DateTime, List<WalletTransactionItem>> _groupTransactionsByDate(
    List<WalletTransactionItem> items,
  ) {
    final map = <DateTime, List<WalletTransactionItem>>{};

    final sorted = [...items]..sort((a, b) => b.date.compareTo(a.date));

    for (final item in sorted) {
      final key = DateTime(item.date.year, item.date.month, item.date.day);
      map.putIfAbsent(key, () => []);
      map[key]!.add(item);
    }

    return map;
  }

  static String _formatHeaderDate(DateTime date) {
    const weekdays = [
      "",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const months = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return "${weekdays[date.weekday]}, ${date.day} ${months[date.month]}";
  }
}

enum WalletFilter { all, moneyIn, moneyOut, rewards }

class _WalletTopHeader extends StatelessWidget {
  const _WalletTopHeader({
    required this.balance,
    required this.onBack,
    required this.onMenu,
  });

  final double balance;
  final VoidCallback onBack;
  final VoidCallback onMenu;

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
      child: Stack(
        children: [
          Positioned.fill(
            child: IgnorePointer(
              child: CustomPaint(painter: _WalletLinesPainter()),
            ),
          ),
          SafeArea(
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
                      _SquareIconButton(icon: Icons.menu, onTap: onMenu),
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
                    "Ð ${balance.toStringAsFixed(0)}",
                    style: const TextStyle(
                      fontSize: 24,
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
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
}

class _WalletLinesPainter extends CustomPainter {
  const _WalletLinesPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.tealAccent.withOpacity(0.10)
      ..strokeWidth = 2;

    const gap = 34.0;
    for (double x = size.width * 0.35; x < size.width + 60; x += gap) {
      canvas.drawLine(Offset(x, size.height), Offset(x + 120, 0), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
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
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: SizedBox(
          width: 44,
          height: 44,
          child: Icon(icon, size: 22, color: const Color(0xFF1E1E1E)),
        ),
      ),
    );
  }
}

class _ServiceUpdateCard extends StatelessWidget {
  const _ServiceUpdateCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF004A3A), Color(0xFF000000)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.10),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 62,
            height: 62,
            decoration: BoxDecoration(
              color: const Color(0xFF003B2F),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(
              Icons.info_outline_rounded,
              color: Colors.white,
              size: 32,
            ),
          ),
          const SizedBox(width: 14),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Service Update",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  "Due to the regional network disruption,\nwithdrawals are temporarily paused.",
                  style: TextStyle(
                    fontSize: 13,
                    height: 1.45,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _FilterChipItem extends StatelessWidget {
  const _FilterChipItem({
    required this.title,
    required this.selected,
    required this.onTap,
  });

  final String title;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? const Color(0xFF004D40) : Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: selected
                  ? const Color(0xFF004D40)
                  : const Color(0xFFD5D7DB),
            ),
          ),
          child: Text(
            title,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w800,
              color: selected ? Colors.white : const Color(0xFF1E1E1E),
            ),
          ),
        ),
      ),
    );
  }
}

class _DateHeader extends StatelessWidget {
  const _DateHeader({required this.title, required this.total});

  final String title;
  final double total;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFE9EAED),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Row(
        children: [
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w800,
                color: Color(0xFF111827),
              ),
            ),
          ),
          Text(
            "${total >= 0 ? "" : "-"}Ð ${total.abs().toStringAsFixed(0)}",
            style: const TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w800,
              color: Color(0xFF6B7280),
            ),
          ),
        ],
      ),
    );
  }
}

class _WalletTransactionTile extends StatelessWidget {
  const _WalletTransactionTile({required this.item});

  final WalletTransactionItem item;

  @override
  Widget build(BuildContext context) {
    final amountColor = item.isPositive
        ? const Color(0xFF0B8B68)
        : const Color(0xFFB91C1C);
    final prefix = item.isPositive ? "+" : "-";

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(16, 18, 16, 18),
      child: Row(
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(
                  _iconForType(item.type),
                  color: const Color(0xFF1E1E1E),
                  size: 28,
                ),
              ),
              Positioned(
                top: -4,
                right: -4,
                child: Container(
                  width: 22,
                  height: 22,
                  decoration: BoxDecoration(
                    color: item.isPositive
                        ? const Color(0xFF0B8B68)
                        : const Color(0xFFB91C1C),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                  child: Icon(
                    item.isPositive
                        ? Icons.south_west_rounded
                        : Icons.north_east_rounded,
                    size: 13,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Text(
              item.title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: Color(0xFF111827),
              ),
            ),
          ),
          Text(
            "$prefix Ð ${item.amount.toStringAsFixed(0)}",
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w800,
              color: amountColor,
            ),
          ),
        ],
      ),
    );
  }

  IconData _iconForType(WalletTxType type) {
    switch (type) {
      case WalletTxType.topUp:
        return Icons.account_balance_wallet_rounded;
      case WalletTxType.payment:
        return Icons.shopping_bag_rounded;
      case WalletTxType.refund:
        return Icons.directions_car_filled_rounded;
    }
  }
}

class _EmptyTransactionsView extends StatelessWidget {
  const _EmptyTransactionsView();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 26),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(
        children: const [
          Icon(Icons.receipt_long_rounded, size: 38, color: Color(0xFF9CA3AF)),
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
            "All balance changes will appear here.",
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
