import 'package:flutter/material.dart';
import 'package:zaza_driver_app/Order/models/order_model.dart';
import 'package:zaza_driver_app/Order/store/orders_store.dart';
import 'package:zaza_driver_app/Order/viewmodels/orders_detail_page.dart';

enum OrdersTab { newTab, active, completed }

class OrdersPage extends StatefulWidget {
  final OrdersStore store;
  final VoidCallback goHome;

  const OrdersPage({super.key, required this.store, required this.goHome});

  @override
  State<OrdersPage> createState() => _OrdersPageState();
}

class _OrdersPageState extends State<OrdersPage> {
  OrdersTab tab = OrdersTab.newTab;

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

  @override
  Widget build(BuildContext context) {
    final store = widget.store;
    final isOnline = store.isOnline;

    final list = switch (tab) {
      OrdersTab.newTab => store.newOrders,
      OrdersTab.active => store.activeOrders,
      OrdersTab.completed => store.completedOrders,
    };

    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          OrdersHeader(
            title: "Orders",
            subtitle: "Manage your deliveries",
            onFilterTap: () {},
          ),
          const SizedBox(height: 12),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: OrdersTabs(
              selected: tab,
              newCount: store.newOrders.length,
              onChanged: (t) => setState(() => tab = t),
            ),
          ),

          const SizedBox(height: 16),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                for (final o in list) ...[
                  OrderCard(
                    order: o,
                    onTap: () {
                      if (!isOnline) {
                        _showOfflineSnack();
                        return;
                      }
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => OrderDetailPage(
                            order: o,
                            store: store,
                            onAcceptedGoHome: widget.goHome,
                          ),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 16),
                ],

                if (list.isEmpty)
                  SizedBox(
                    height: MediaQuery.of(context).size.height * 0.55,
                    child: OrdersEmptyState(
                      title: tab == OrdersTab.active
                          ? "No active orders"
                          : tab == OrdersTab.completed
                          ? "No completed orders yet"
                          : "No new orders",
                      subtitle: tab == OrdersTab.active
                          ? "Accept orders from the New tab"
                          : tab == OrdersTab.completed
                          ? "Your completed deliveries will appear here"
                          : "Wait for new requests",
                    ),
                  ),

                const SizedBox(height: 24),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// =======================
/// ✅ HEADER SECTION
/// =======================
class OrdersHeader extends StatelessWidget {
  final String title;
  final String subtitle;
  final VoidCallback onFilterTap;

  const OrdersHeader({
    super.key,
    required this.title,
    required this.subtitle,
    required this.onFilterTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 180,
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
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
      child: SafeArea(
        bottom: false,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// =======================
/// ✅ TABS SECTION
/// =======================
class OrdersTabs extends StatelessWidget {
  final OrdersTab selected;
  final int newCount;
  final ValueChanged<OrdersTab> onChanged;

  const OrdersTabs({
    super.key,
    required this.selected,
    required this.newCount,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(6),
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
      child: Row(
        children: [
          _TabChip(
            label: "New",
            isSelected: selected == OrdersTab.newTab,
            trailingBadge: newCount > 0 ? "$newCount" : null,
            onTap: () => onChanged(OrdersTab.newTab),
          ),
          _TabChip(
            label: "Active",
            isSelected: selected == OrdersTab.active,
            onTap: () => onChanged(OrdersTab.active),
          ),
          _TabChip(
            label: "Completed",
            isSelected: selected == OrdersTab.completed,
            onTap: () => onChanged(OrdersTab.completed),
          ),
        ],
      ),
    );
  }
}

class _TabChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final String? trailingBadge;
  final VoidCallback onTap;

  const _TabChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
    this.trailingBadge,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF00A884) : Colors.transparent,
            borderRadius: BorderRadius.circular(14),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                label,
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.black87,
                  fontWeight: FontWeight.w700,
                ),
              ),
              if (trailingBadge != null) ...[
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 3,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.redAccent,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    trailingBadge!,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// =======================
/// ✅ ORDER CARD SECTION
/// =======================
class OrderCard extends StatelessWidget {
  final OrderModel order;
  final VoidCallback onTap;

  const OrderCard({super.key, required this.order, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(22),
      child: Container(
        padding: const EdgeInsets.all(16),
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
          children: [
            // top row: icon + name + badge
            Row(
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
                    color: Color(0xFF00A884),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        order.customer,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        order.orderId,
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),

                if (order.badge != null)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE8F1FF),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      order.badge!,
                      style: const TextStyle(
                        color: Color(0xFF3B82F6),
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
              ],
            ),

            const SizedBox(height: 14),

            OrderInfoRow(
              label: "Pickup",
              value: order.pickup,
              dotColor: const Color(0xFF00A884),
            ),
            const SizedBox(height: 10),
            OrderInfoRow(
              label: "Drop-off",
              value: order.dropoff,
              dotColor: const Color(0xFF00A884),
            ),

            const SizedBox(height: 14),
            const Divider(height: 1),
            const SizedBox(height: 14),

            OrderMetaRow(km: order.km, type: order.type, price: order.price),
          ],
        ),
      ),
    );
  }
}

class OrderInfoRow extends StatelessWidget {
  final String label;
  final String value;
  final Color dotColor;

  const OrderInfoRow({
    super.key,
    required this.label,
    required this.value,
    required this.dotColor,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 8,
          height: 8,
          margin: const EdgeInsets.only(top: 5),
          decoration: BoxDecoration(color: dotColor, shape: BoxShape.circle),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  color: Colors.grey,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: const TextStyle(
                  color: Color(0xFF334155),
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class OrderMetaRow extends StatelessWidget {
  final String km;
  final String type;
  final String price;

  const OrderMetaRow({
    super.key,
    required this.km,
    required this.type,
    required this.price,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Icon(Icons.place_outlined, size: 18, color: Colors.grey),
        const SizedBox(width: 6),
        Text(
          km,
          style: const TextStyle(
            color: Colors.grey,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(width: 14),

        const Icon(Icons.local_shipping_outlined, size: 18, color: Colors.grey),
        const SizedBox(width: 6),
        Expanded(
          child: Text(
            type,
            style: const TextStyle(
              color: Colors.grey,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),

        Text(
          price,
          style: const TextStyle(
            color: Color(0xFF00A884),
            fontWeight: FontWeight.w900,
            fontSize: 16,
          ),
        ),
        const SizedBox(width: 10),
        const Icon(Icons.chevron_right, color: Colors.grey),
      ],
    );
  }
}

class OrdersEmptyState extends StatelessWidget {
  final String title;
  final String subtitle;

  const OrdersEmptyState({
    super.key,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.inventory_2_outlined,
                size: 40,
                color: Color(0xFF94A3B8),
              ),
            ),
            const SizedBox(height: 18),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: Color(0xFF64748B),
              ),
            ),
            const SizedBox(height: 10),
            Text(
              subtitle,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 16,
                height: 1.35,
                fontWeight: FontWeight.w500,
                color: Color(0xFF94A3B8),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
