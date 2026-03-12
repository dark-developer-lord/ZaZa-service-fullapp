import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:zaza_driver_app/Order/models/order_model.dart';
import 'package:zaza_driver_app/Order/store/orders_store.dart';
import 'package:zaza_driver_app/Order/viewmodels/orders_detail_page.dart';

class HomePage extends StatefulWidget {
  final OrdersStore store;
  final VoidCallback onViewAllOrders;

  const HomePage({
    super.key,
    required this.store,
    required this.onViewAllOrders,
  });

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  void initState() {
    super.initState();
    widget.store.addListener(_refresh);
  }

  @override
  void dispose() {
    widget.store.removeListener(_refresh);
    super.dispose();
  }

  void _refresh() => setState(() {});

  void _showOfflineSnack() {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text("You are Offline. Turn Online to view orders."),
        ),
      );
  }

  Future<void> _onPullRefresh() async {
    final store = widget.store;

    if (!store.isOnline) {
      _showOfflineSnack();
      await Future.delayed(const Duration(milliseconds: 500));
      return;
    }

    await store.refreshFromServer();
  }

  @override
  Widget build(BuildContext context) {
    final store = widget.store;
    final active = store.activeOrder;
    final isOnline = store.isOnline;

    final double baseHeader = 290;
    final double extraHeader = isOnline ? 70 : 0;
    final double baseOverlap = 120;
    final double overlap = baseOverlap + extraHeader;
    final double headerH = baseHeader + extraHeader;

    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      body: RefreshIndicator.adaptive(
        onRefresh: _onPullRefresh,
        color: const Color(0xFF00A884),
        backgroundColor: Colors.white,
        strokeWidth: 2.6,
        displacement: 70,
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(
            parent: AlwaysScrollableScrollPhysics(),
          ),
          child: Column(
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 280),
                curve: Curves.easeInOut,
                height: headerH,
                width: double.infinity,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF00BBA7), Color(0xFF009966)],
                  ),
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(24),
                    bottomRight: Radius.circular(24),
                  ),
                ),
                child: const SafeArea(
                  bottom: false,
                  child: Column(children: [TopHeader()]),
                ),
              ),

              Transform.translate(
                offset: Offset(0, -overlap),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    children: [
                      OnlineStatusCard(
                        isOnline: isOnline,
                        onChanged: (v) => store.setOnline(v),
                        newOrdersCount: store.newOrders.length,
                      ),
                      const SizedBox(height: 16),

                      const EarningsCard(
                        amountText: "245.50 c",
                        orders: "12",
                        hoursOnline: "0.0",
                        avgOrder: "20 c",
                      ),
                      const SizedBox(height: 24),

                      if (!isOnline) ...[
                        const BigOfflineCard(),
                        const SizedBox(height: 16),
                      ],

                      if (active != null) ...[
                        ActiveOrderCard(
                          order: active,
                          onCard: () {
                            if (!isOnline) {
                              _showOfflineSnack();
                              return;
                            }
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => OrderDetailPage(
                                  order: active,
                                  store: store,
                                ),
                              ),
                            );
                          },
                          onNavigate: () async {},
                        ),
                        const SizedBox(height: 16),
                      ],

                      if (isOnline) ...[
                        NewOrdersSection(
                          store: store,
                          onViewAll: widget.onViewAllOrders,
                        ),
                        const SizedBox(height: 16),
                      ],

                      const SizedBox(height: 24),
                    ],
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

/// TOP HEADER
class TopHeader extends StatelessWidget {
  const TopHeader({super.key});

  String _greeting() {
    final hour = DateTime.now().hour;

    if (hour >= 5 && hour < 12) {
      return "☀️ Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "🌤️ Good afternoon";
    } else if (hour >= 17 && hour < 22) {
      return "🌙 Good evening";
    } else {
      return "😴 Good night";
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                _greeting(),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Hassan Ahmed',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const CircleAvatar(
            radius: 26,
            backgroundColor: Colors.white24,
            child: Text(
              'HA',
              style: TextStyle(
                color: Colors.white,
                fontSize: 17,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// ✅ ONLINE / OFFLINE CARD

class OnlineStatusCard extends StatefulWidget {
  final bool isOnline;
  final ValueChanged<bool> onChanged;

  // ✅ NEW: count аз store.newOrders.length
  final int newOrdersCount;

  const OnlineStatusCard({
    super.key,
    required this.isOnline,
    required this.onChanged,
    required this.newOrdersCount,
  });

  @override
  State<OnlineStatusCard> createState() => _OnlineStatusCardState();
}

class _OnlineStatusCardState extends State<OnlineStatusCard> {
  String _ordersText(int n) {
    if (n <= 0) return "No new orders nearby";
    if (n == 1) return "1 new order available nearby!";
    return "$n new orders available nearby!";
  }

  @override
  Widget build(BuildContext context) {
    final count = widget.newOrdersCount;

    return AnimatedSize(
      duration: const Duration(milliseconds: 280),
      curve: Curves.easeInOut,
      alignment: Alignment.topCenter,
      child: Material(
        color: Colors.white,
        elevation: 3,
        shadowColor: Colors.black12,
        borderRadius: BorderRadius.circular(22),
        clipBehavior: Clip.antiAlias,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: widget.isOnline
                          ? const Color(0xFFDFFAF3)
                          : const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Icon(
                      Icons.power_settings_new,
                      size: 26,
                      color: widget.isOnline
                          ? const Color(0xFF00A884)
                          : Colors.grey,
                    ),
                  ),
                  const SizedBox(width: 12),

                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.isOnline ? "You're Online" : "You're Offline",
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          widget.isOnline
                              ? "Ready to accept orders"
                              : "Not accepting orders",
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: widget.isOnline
                                ? const Color(0xFF00A884)
                                : Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ),

                  Switch(
                    value: widget.isOnline,
                    onChanged: widget.onChanged,
                    activeColor: const Color(0xFF00A884),
                  ),
                ],
              ),

              // ✅ EXTRA: танҳо вақте ONLINE бошад
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 220),
                switchInCurve: Curves.easeOut,
                switchOutCurve: Curves.easeIn,
                transitionBuilder: (child, anim) {
                  return SizeTransition(
                    sizeFactor: anim,
                    axisAlignment: -1,
                    child: FadeTransition(opacity: anim, child: child),
                  );
                },
                child: widget.isOnline
                    ? Column(
                        key: ValueKey('online_extra_$count'),
                        children: [
                          const SizedBox(height: 12),
                          const Divider(
                            height: 1,
                            thickness: 1,
                            color: Color(0xFFE6EAF0),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              const Text("⚡", style: TextStyle(fontSize: 18)),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _ordersText(count),
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w600,
                                    color: count > 0
                                        ? const Color(0xFF00A884)
                                        : const Color(0xFF64748B),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      )
                    : const SizedBox(key: ValueKey('offline_extra')),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// ✅ EARNINGS CARD (алоҳида класс)
class EarningsCard extends StatelessWidget {
  final String amountText;
  final String orders;
  final String hoursOnline;
  final String avgOrder;

  const EarningsCard({
    super.key,
    required this.amountText,
    required this.orders,
    required this.hoursOnline,
    required this.avgOrder,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(26),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF0B1730), Color(0xFF101D3A)],
        ),
        boxShadow: const [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 18,
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
                  "Today's Earnings",
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: const Color(0xFF0F2C2A),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(
                  Icons.trending_up,
                  color: Color(0xFF00D6A3),
                  size: 28,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            amountText,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 30,
              fontWeight: FontWeight.w500,
              height: 1.0,
            ),
          ),
          const SizedBox(height: 18),
          Container(height: 1, width: double.infinity, color: Colors.white12),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _StatItem(title: "Orders", value: orders),
              ),
              const _DividerLine(),
              Expanded(
                child: _StatItem(title: "Hours Online", value: hoursOnline),
              ),
              const _DividerLine(),
              Expanded(
                child: _StatItem(title: "Avg/Order", value: avgOrder),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String title;
  final String value;

  const _StatItem({required this.title, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            color: Colors.white54,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.w500,
            height: 1.0,
          ),
        ),
      ],
    );
  }
}

class _DividerLine extends StatelessWidget {
  const _DividerLine();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 1,
      height: 44,
      margin: const EdgeInsets.symmetric(horizontal: 12),
      color: Colors.white12,
    );
  }
}

/// BIG OFFLINE CARD
class BigOfflineCard extends StatelessWidget {
  const BigOfflineCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 250,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),

      decoration: BoxDecoration(
        color: const Color(0xFFF3F6FA),
        borderRadius: BorderRadius.circular(28),

        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 18,
            offset: Offset(0, 8),
          ),
        ],
      ),

      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: const [
          // ✅ Power Icon
          Icon(Icons.power_settings_new, size: 64, color: Color(0xFF94A3B8)),

          SizedBox(height: 20),

          // ✅ Title
          Text(
            "You're Currently Offline",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: Color(0xFF0F172A),
            ),
          ),

          SizedBox(height: 12),

          // ✅ Description
          Text(
            "Toggle to online to start\nreceiving delivery orders",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 15,
              height: 1.4,
              color: Color(0xFF64748B),
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

/// ORDER ACTIVE

class ActiveOrderCard extends StatelessWidget {
  final OrderModel order;
  final VoidCallback? onNavigate;
  final VoidCallback? onCard;

  const ActiveOrderCard({
    super.key,
    required this.order,
    this.onNavigate,
    this.onCard,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // ✅ Title row
        Row(
          children: [
            const Expanded(
              child: Text(
                "Active Order",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF0F172A),
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFFDFFAF3),
                borderRadius: BorderRadius.circular(999),
              ),
              child: const Text(
                "In Progress",
                style: TextStyle(
                  color: Color(0xFF00A884),
                  fontWeight: FontWeight.w500,
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // ✅ Card
        InkWell(
          onTap: onCard,
          borderRadius: BorderRadius.circular(22),
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFF3FFFB),
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: const Color(0xFF00A884), width: 1.2),
              boxShadow: const [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 14,
                  offset: Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              children: [
                // ✅ Top info row
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: _TopLeftInfo(
                        orderId: order.orderId,
                        customer: order.customer,
                      ),
                    ),
                    const SizedBox(width: 10),
                    _TopRightPriceKm(
                      price: _onlyAmount(order.price),
                      km: order.km,
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                // ✅ Route
                _RouteMini(pickup: order.pickup, dropoff: order.dropoff),

                const SizedBox(height: 14),
                const Divider(height: 1, color: Color(0xFFE6EAF0)),
                const SizedBox(height: 12),

                // ✅ Bottom row
                Row(
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 6,
                      ),
                      child: Row(
                        children: const [
                          Icon(
                            Icons.access_time_rounded,
                            size: 18,
                            color: Color(0xFF64748B),
                          ),
                          SizedBox(width: 8),
                          Text(
                            "Document",
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),
                    // const Spacer(),
                    // _NavigateButton(onTap: onNavigate),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  static String _onlyAmount(String s) {
    final cleaned = s.replaceAll(RegExp(r'[^0-9\.\,]'), '').trim();
    return cleaned.isEmpty ? s : cleaned;
  }
}

class _TopLeftInfo extends StatelessWidget {
  final String orderId;
  final String customer;

  const _TopLeftInfo({required this.orderId, required this.customer});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          orderId,
          style: const TextStyle(
            color: Color(0xFF64748B),
            fontWeight: FontWeight.w500,
            fontSize: 14,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          customer,
          style: const TextStyle(
            color: Color(0xFF0F172A),
            fontWeight: FontWeight.w600,
            fontSize: 18,
          ),
        ),
      ],
    );
  }
}

class _TopRightPriceKm extends StatelessWidget {
  final String price;
  final String km;

  const _TopRightPriceKm({required this.price, required this.km});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              price,
              style: const TextStyle(
                color: Color(0xFF00A884),
                fontWeight: FontWeight.w600,
                fontSize: 18,
              ),
            ),
            const SizedBox(width: 6),
            const Text(
              "c",
              style: TextStyle(
                color: Color(0xFF00A884),
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Text(
          km,
          style: const TextStyle(
            color: Color(0xFF64748B),
            fontWeight: FontWeight.w500,
            fontSize: 13,
          ),
        ),
      ],
    );
  }
}

class _RouteMini extends StatelessWidget {
  final String pickup;
  final String dropoff;

  const _RouteMini({required this.pickup, required this.dropoff});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _RouteRow(label: "Pickup", value: pickup, isPickup: true),
        const SizedBox(height: 10),
        _RouteRow(label: "Drop-off", value: dropoff, isPickup: false),
      ],
    );
  }
}

class _RouteRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isPickup;

  const _RouteRow({
    required this.label,
    required this.value,
    required this.isPickup,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // dot
        Container(
          width: 10,
          height: 10,
          margin: const EdgeInsets.only(top: 4),
          decoration: BoxDecoration(
            color: const Color(0xFF00A884),
            borderRadius: BorderRadius.circular(999),
          ),
        ),
        const SizedBox(width: 10),

        // text
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  color: Color(0xFF94A3B8),
                  fontWeight: FontWeight.w400,
                  fontSize: 12,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: const TextStyle(
                  color: Color(0xFF334155),
                  fontWeight: FontWeight.w500,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// class _NavigateButton extends StatelessWidget {
//   final VoidCallback? onTap;
//   const _NavigateButton({this.onTap});

//   @override
//   Widget build(BuildContext context) {
//     return InkWell(
//       onTap: onTap,
//       borderRadius: BorderRadius.circular(16),
//       child: Container(
//         height: 44,
//         padding: const EdgeInsets.symmetric(horizontal: 16),
//         decoration: BoxDecoration(
//           color: const Color(0xFF00A884),
//           borderRadius: BorderRadius.circular(16),
//         ),
//         child: Row(
//           mainAxisSize: MainAxisSize.min,
//           children: const [
//             Icon(Icons.near_me, color: Colors.white, size: 18),
//             SizedBox(width: 10),
//             Text(
//               "Navigate",
//               style: TextStyle(
//                 color: Colors.white,
//                 fontWeight: FontWeight.w600,
//                 fontSize: 14,
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

/// NEW ORDER SECTION

class NewOrdersSection extends StatelessWidget {
  final OrdersStore store;
  final VoidCallback onViewAll;

  const NewOrdersSection({
    super.key,
    required this.store,
    required this.onViewAll,
  });

  @override
  Widget build(BuildContext context) {
    final orders = store.newOrders;

    if (orders.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        /// TITLE
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              "New Orders Nearby",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
            ),
            InkWell(
              onTap: onViewAll, // 👈 ба bottom nav меравад
              child: Row(
                children: const [
                  Text(
                    "View All",
                    style: TextStyle(
                      fontSize: 14,
                      color: Color(0xFF009689),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  SizedBox(width: 4),
                  Icon(
                    Icons.arrow_forward_ios,
                    size: 14,
                    color: Color(0xFF009689),
                  ),
                ],
              ),
            ),
          ],
        ),

        const SizedBox(height: 12),

        /// ORDER CARDS (аз store)
        for (final o in orders.take(3)) ...[
          OrderItemCard(
            order: o,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => OrderDetailPage(order: o, store: store),
                ),
              );
            },
          ),
          const SizedBox(height: 12),
        ],
      ],
    );
  }
}

class OrderItemCard extends StatelessWidget {
  final OrderModel order;
  final VoidCallback onTap;

  const OrderItemCard({super.key, required this.order, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            boxShadow: const [
              BoxShadow(
                color: Colors.white,
                blurRadius: 10,
                offset: Offset(0, 6),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: const Color(0xFFDFFAF3),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(
                  Icons.inventory_2_outlined,
                  color: Color(0xFF009689),
                ),
              ),
              const SizedBox(width: 12),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      order.type,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      order.km,
                      style: const TextStyle(color: Colors.grey, fontSize: 14),
                    ),
                  ],
                ),
              ),

              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    order.price,
                    style: const TextStyle(
                      color: Color(0xFF009689),
                      fontWeight: FontWeight.w700,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    "Tap to view",
                    style: TextStyle(color: Colors.grey, fontSize: 12),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
