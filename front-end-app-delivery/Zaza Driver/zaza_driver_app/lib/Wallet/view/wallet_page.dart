import 'package:flutter/material.dart';
import 'package:zaza_driver_app/Wallet/models/tx_model.dart';
import 'package:zaza_driver_app/Wallet/services/wallet_api_service.dart';
import 'package:zaza_driver_app/Wallet/store/transaction_store.dart';
import 'package:zaza_driver_app/Wallet/view/all_transaction_page.dart';
import 'package:zaza_driver_app/Wallet/view/transactions_detail_sheet.dart';

class WalletPage extends StatefulWidget {
  const WalletPage({super.key});

  @override
  State<WalletPage> createState() => _WalletPageState();
}

class _WalletPageState extends State<WalletPage> {
  static const int _recentLimit = 5;

  WalletSummary? _summary;
  bool _loadingWallet = false;

  @override
  void initState() {
    super.initState();
    _loadWalletData();
  }

  Future<void> _loadWalletData() async {
    if (_loadingWallet) return;
    setState(() => _loadingWallet = true);
    try {
      final summary = await WalletApiService.fetchSummary();
      final txList  = await WalletApiService.fetchTransactions();
      // Populate the singleton transaction store
      for (final tx in txList) {
        WalletTxStore.I.add(TxModel(
          title:       tx.label,
          subtitle1:   tx.createdAt,
          subtitle2:   '',
          amountText:  '+${tx.amount.toStringAsFixed(2)} с',
          amountColor: const Color(0xFF00A884),
          icon:        Icons.south_west,
          iconBg:      const Color(0xFFDFFAF3),
          iconColor:   const Color(0xFF00A884),
        ));
      }
      if (mounted) setState(() => _summary = summary);
    } catch (_) {
      // network not available — keep default empty state
    } finally {
      if (mounted) setState(() => _loadingWallet = false);
    }
  }

  String _fmt(double v)  => '${v.toStringAsFixed(2)} с';
  String _trips(int v)   => '$v trips';

  @override
  Widget build(BuildContext context) {
    final s = _summary;
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          WalletHeader(
            balanceLabel: "Available Balance",
            balanceText: s != null ? _fmt(s.balance) : (_loadingWallet ? '…' : '0.00 с'),
            changeText:  s != null ? '+${_fmt(s.weekEarning)} this week' : '+0.00 с this week',
          ),

          Transform.translate(
            offset: const Offset(0, -80),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                children: [
                  WalletWithdrawButton(label: "Withdraw to Bank", onTap: () {}),
                  const SizedBox(height: 14),

                  EarningsSummaryCard(
                    todayAmount: s != null ? _fmt(s.todayEarning) : '0.00 с',
                    todayTrips:  s != null ? _trips(s.todayTrips)  : '0 trips',
                    weekAmount:  s != null ? _fmt(s.weekEarning)   : '0.00 с',
                    weekTrips:   s != null ? _trips(s.weekTrips)   : '0 trips',
                    monthAmount: s != null ? _fmt(s.monthEarning)  : '0.00 с',
                    monthTrips:  '— trips',
                  ),
                  const SizedBox(height: 16),

                  // ✅ Dynamic Recent Transactions
                  AnimatedBuilder(
                    animation: WalletTxStore.I,
                    builder: (_, __) {
                      final List<TxModel> allTx = WalletTxStore.I.items;
                      final List<TxModel> recentTx = allTx
                          .take(_recentLimit)
                          .toList();
                      final bool showViewAll = allTx.length > _recentLimit;

                      return Column(
                        children: [
                          _SectionTitleRow(
                            title: "Recent Transactions",
                            badgeText: "${allTx.length} total",
                          ),
                          const SizedBox(height: 12),

                          if (allTx.isEmpty)
                            Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(18),
                                boxShadow: const [
                                  BoxShadow(
                                    color: Colors.black12,
                                    blurRadius: 12,
                                    offset: Offset(0, 6),
                                  ),
                                ],
                              ),
                              child: const Row(
                                children: [
                                  Icon(
                                    Icons.receipt_long,
                                    color: Color(0xFF94A3B8),
                                  ),
                                  SizedBox(width: 10),
                                  Text(
                                    "No transactions yet",
                                    style: TextStyle(
                                      color: Color(0xFF64748B),
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ],
                              ),
                            )
                          else ...[
                            for (final t in recentTx) ...[
                              TransactionCard(
                                tx: t,
                                onTap: () =>
                                    TransactionDetailsSheet.show(context, t),
                              ),
                              const SizedBox(height: 14),
                            ],
                          ],

                          if (showViewAll) ...[
                            const SizedBox(height: 4),
                            _ViewAllButton(
                              total: allTx.length,
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) =>
                                        AllTransactionsPage(allTx: allTx),
                                  ),
                                );
                              },
                            ),
                            const SizedBox(height: 10),
                          ],
                        ],
                      );
                    },
                  ),

                  const SizedBox(height: 18),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// =======================
/// HEADER
/// =======================
class WalletHeader extends StatelessWidget {
  final String balanceLabel;
  final String balanceText;
  final String changeText;

  const WalletHeader({
    super.key,
    required this.balanceLabel,
    required this.balanceText,
    required this.changeText,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 280,
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF00BBA7), Color(0xFF009966)],
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(26),
          bottomRight: Radius.circular(26),
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 6),
            Text(
              balanceLabel,
              style: const TextStyle(color: Colors.white, fontSize: 16),
            ),
            const SizedBox(height: 12),
            Text(
              balanceText,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 36,
                height: 1.0,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                const Icon(Icons.trending_up, color: Colors.white, size: 20),
                const SizedBox(width: 10),
                Text(
                  changeText,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// =======================
/// WITHDRAW BUTTON
/// =======================
class WalletWithdrawButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const WalletWithdrawButton({
    super.key,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        height: 52,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: const [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 14,
              offset: Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(
              Icons.account_balance_wallet_outlined,
              color: Color(0xFF00A884),
            ),
            SizedBox(width: 12),
            Text(
              "Withdraw to Bank",
              style: TextStyle(
                color: Color(0xFF00A884),
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// =======================
/// EARNINGS SUMMARY
/// =======================
class EarningsSummaryCard extends StatelessWidget {
  final String todayAmount;
  final String todayTrips;
  final String weekAmount;
  final String weekTrips;
  final String monthAmount;
  final String monthTrips;

  const EarningsSummaryCard({
    super.key,
    required this.todayAmount,
    required this.todayTrips,
    required this.weekAmount,
    required this.weekTrips,
    required this.monthAmount,
    required this.monthTrips,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(18, 16, 18, 18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 14,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Earnings Summary",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              Expanded(
                child: _SummaryItem(
                  label: "Today",
                  amount: todayAmount,
                  trips: todayTrips,
                ),
              ),
              Expanded(
                child: _SummaryItem(
                  label: "This Week",
                  amount: weekAmount,
                  trips: weekTrips,
                ),
              ),
              Expanded(
                child: _SummaryItem(
                  label: "This Month",
                  amount: monthAmount,
                  trips: monthTrips,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _SummaryItem extends StatelessWidget {
  final String label;
  final String amount;
  final String trips;

  const _SummaryItem({
    required this.label,
    required this.amount,
    required this.trips,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Color(0xFF62748E),
            fontSize: 13,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 10),
        Text(
          amount,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w500,
            color: Color(0xFF0A0A0A),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          trips,
          style: const TextStyle(
            color: Color(0xFF64748B),
            fontSize: 13,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}

/// =======================
/// AVERAGE TRIP CARD (GREEN)
/// =======================
class AverageTripCard extends StatelessWidget {
  final String avgText;
  final String bestDay;
  final String completionRate;

  const AverageTripCard({
    super.key,
    required this.avgText,
    required this.bestDay,
    required this.completionRate,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF00BBA7), Color(0xFF009966)],
        ),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 16,
            offset: Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Expanded(
                child: Text(
                  "Average per Trip",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(
                  Icons.trending_up,
                  color: Colors.white,
                  size: 24,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            avgText,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 28,
              height: 1.0,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 18),
          Container(height: 1, color: Colors.white24),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _MiniInfo(label: "Best Day", value: bestDay),
              ),
              Expanded(
                child: _MiniInfo(
                  label: "Completion Rate",
                  value: completionRate,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _MiniInfo extends StatelessWidget {
  final String label;
  final String value;

  const _MiniInfo({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Color(0xFFECFDF5),
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 10),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}

/// =======================
/// SECTION TITLE
/// =======================
class _SectionTitleRow extends StatelessWidget {
  final String title;
  final String badgeText;

  const _SectionTitleRow({required this.title, required this.badgeText});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(
            title,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            badgeText,
            style: const TextStyle(
              color: Color(0xFF334155),
              fontWeight: FontWeight.w500,
              fontSize: 14,
            ),
          ),
        ),
      ],
    );
  }
}

/// =======================
/// TRANSACTION CARD
/// =======================
class TransactionCard extends StatelessWidget {
  final TxModel tx;
  final VoidCallback? onTap;

  const TransactionCard({super.key, required this.tx, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 12,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(22),
          splashColor: const Color(0xFF00A884).withOpacity(0.08),
          highlightColor: const Color(0xFF00A884).withOpacity(0.04),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: tx.iconBg,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(tx.icon, color: tx.iconColor, size: 20),
                ),
                const SizedBox(width: 14),

                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        tx.title,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        tx.subtitle1,
                        style: const TextStyle(
                          color: Color(0xFF64748B),
                          fontSize: 14,
                        ),
                      ),
                      if (tx.subtitle2.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          tx.subtitle2,
                          style: const TextStyle(
                            color: Color(0xFF94A3B8),
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),

                const SizedBox(width: 12),

                Text(
                  tx.amountText,
                  style: TextStyle(
                    color: tx.amountColor,
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// VIEW ALL BUTTON

class _ViewAllButton extends StatelessWidget {
  final int total;
  final VoidCallback onTap;

  const _ViewAllButton({required this.total, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        height: 54,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: const [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 14,
              offset: Offset(0, 8),
            ),
          ],
        ),
        padding: const EdgeInsets.symmetric(horizontal: 14),
        child: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: const Color(0xFFDFFAF3),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Icon(
                Icons.list_alt_outlined,
                color: Color(0xFF00A884),
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                "View All Transactions",
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
              ),
            ),
            Text(
              "$total",
              style: const TextStyle(
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(width: 8),
            const Icon(Icons.chevron_right, color: Color(0xFF94A3B8)),
          ],
        ),
      ),
    );
  }
}
