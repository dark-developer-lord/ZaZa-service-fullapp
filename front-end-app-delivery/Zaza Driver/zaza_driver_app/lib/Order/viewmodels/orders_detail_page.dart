import 'package:flutter/material.dart';
import 'package:zaza_driver_app/Order/models/order_model.dart';
import 'package:zaza_driver_app/Order/store/orders_store.dart';
import 'package:zaza_driver_app/Order/viewmodels/proof_of_delivery_page.dart';

class OrderDetailPage extends StatefulWidget {
  final OrderModel order;
  final OrdersStore store;
  final VoidCallback? onAcceptedGoHome;

  const OrderDetailPage({
    super.key,
    required this.order,
    required this.store,
    this.onAcceptedGoHome,
  });

  @override
  State<OrderDetailPage> createState() => _OrderDetailPageState();
}

class _OrderDetailPageState extends State<OrderDetailPage> {
  void _showOfflineSnack() {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text("You are Offline. Turn Online to view orders."),
        ),
      );
  }

  /// ✅ АСОСӢ: order-и актуалиро аз STORE гир
  OrderModel get currentOrder {
    final active = widget.store.activeOrder;
    if (active != null && active.orderId == widget.order.orderId) {
      return active;
    }
    return widget.order;
  }

  @override
  Widget build(BuildContext context) {
    final o = currentOrder;
    final status = o.status;
    final isOnline = widget.store.isOnline;
    final hasInstructions = (o.specialInstructions?.trim().isNotEmpty ?? false);

    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      body: Stack(
        children: [
          // HEADER
          Container(
            height: 260,
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
          ),

          SafeArea(
            bottom: false,
            child: SingleChildScrollView(
              padding: const EdgeInsets.only(bottom: 140),
              child: Column(
                children: [
                  const SizedBox(height: 8),
                  _TopBar(
                    title: "Order Details",
                    subtitle: o.orderId,
                    badgeText: _badgeForStatus(status),
                    onBack: () => Navigator.pop(context),
                  ),
                  const SizedBox(height: 16),

                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: _FeeDistanceCard(
                      feeText: o.price,
                      distanceText: o.km,
                    ),
                  ),

                  const SizedBox(height: 14),

                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: _CustomerCard(
                      initials: _initials(o.customer),
                      name: o.customer,
                      phone: "+971 54 765 4321",
                    ),
                  ),

                  const SizedBox(height: 14),

                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: _RouteDetailsCard(
                      pickupTitle: "PICKUP LOCATION",
                      pickupValue: o.pickup,
                      dropTitle: "DELIVERY LOCATION",
                      dropValue: o.dropoff,
                    ),
                  ),

                  if (status == OrderStatus.accepted && hasInstructions) ...[
                    const SizedBox(height: 14),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: _SpecialInstructionsCard(
                        text: o.specialInstructions!.trim(),
                      ),
                    ),
                  ],

                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),

          /// ================= BOTTOM =================
          Align(
            alignment: Alignment.bottomCenter,
            child: _buildBottom(status, o, isOnline),
          ),
        ],
      ),
    );
  }

  /// ================= BOTTOM LOGIC =================
  Widget _buildBottom(OrderStatus status, OrderModel o, bool isOnline) {
    /// 1️⃣ NEW
    if (status == OrderStatus.newOrder) {
      return _BottomActions(
        onReject: () {
          if (!isOnline) {
            _showOfflineSnack();
            return;
          }
          widget.store.reject(o);
          Navigator.pop(context);
        },
        onAccept: () {
          if (!isOnline) {
            _showOfflineSnack();
            return;
          }

          // ❌ BLOCK if already has active order
          if (widget.store.hasActive) {
            ScaffoldMessenger.of(context)
              ..hideCurrentSnackBar()
              ..showSnackBar(
                const SnackBar(
                  content: Text(
                    "You already have an active order. Complete it first.",
                  ),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            return;
          }

          // ✅ Accept
          final ok = widget.store.accept(o);

          if (!ok) {
            ScaffoldMessenger.of(context)
              ..hideCurrentSnackBar()
              ..showSnackBar(
                const SnackBar(
                  content: Text(
                    "Finish current delivery before accepting a new order",
                  ),
                ),
              );
            return;
          }

          // ✅ Go home / active tab
          widget.onAcceptedGoHome?.call();
          Navigator.pop(context);
        },
      );
    }

    /// 2️⃣ ACCEPTED → PICK UP
    if (status == OrderStatus.accepted) {
      return _BottomGradientButton(
        icon: Icons.inventory_2_outlined,
        label: "Pick Up Order",
        onTap: () {
          if (!isOnline) return _showOfflineSnack();
          widget.store.pickup(o);
          setState(() {});
        },
      );
    }

    /// 3️⃣ PICKED UP → PROOF
    if (status == OrderStatus.pickedUp) {
      return _BottomGradientButton(
        icon: Icons.check_circle_outline,
        label: "Complete Delivery",
        onTap: () async {
          if (!isOnline) return _showOfflineSnack();

          final ok = await Navigator.push<bool>(
            context,
            MaterialPageRoute(
              builder: (_) => ProofOfDeliveryPage(
                order: o,
                store: widget.store,
                onFinishedGoHome: widget.onAcceptedGoHome,
              ),
            ),
          );

          if (!mounted) return;
          if (ok == true) Navigator.pop(context);
        },
      );
    }

    return const SizedBox.shrink();
  }

  String _badgeForStatus(OrderStatus s) {
    switch (s) {
      case OrderStatus.newOrder:
        return "New";
      case OrderStatus.accepted:
        return "Accepted";
      case OrderStatus.pickedUp:
        return "Picked Up";
      case OrderStatus.completed:
        return "Completed";
    }
  }

  String _initials(String name) {
    final parts = name.trim().split(RegExp(r"\s+"));
    final f = parts.isNotEmpty ? parts.first[0] : "U";
    final l = parts.length > 1 ? parts.last[0] : "";
    return (f + l).toUpperCase();
  }
}

/// =======================
/// TOP BAR
/// =======================
class _TopBar extends StatelessWidget {
  final String title;
  final String subtitle;
  final String badgeText;
  final VoidCallback onBack;

  const _TopBar({
    required this.title,
    required this.subtitle,
    required this.badgeText,
    required this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          InkWell(
            onTap: onBack,
            borderRadius: BorderRadius.circular(16),
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Icon(Icons.arrow_back, color: Colors.white),
            ),
          ),
          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
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

          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFFE8F1FF),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Text(
              badgeText,
              style: const TextStyle(
                color: Color(0xFF3B82F6),
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// =======================
/// FEE + DISTANCE CARD
/// =======================
class _FeeDistanceCard extends StatelessWidget {
  final String feeText;
  final String distanceText;

  const _FeeDistanceCard({required this.feeText, required this.distanceText});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white.withOpacity(0.22)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: _MiniStat(label: "Delivery Fee", value: feeText, big: true),
          ),
          Spacer(),
          Expanded(
            child: _MiniStat(
              label: "Distance",
              value: distanceText,
              big: false,
            ),
          ),
        ],
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  final String label;
  final String value;
  final bool big;

  const _MiniStat({
    required this.label,
    required this.value,
    required this.big,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Color(0xFFF0FDFA),
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          value,
          style: TextStyle(
            color: Colors.white,
            fontSize: big ? 28 : 20,
            fontWeight: FontWeight.w500,
            height: 1.0,
          ),
        ),
      ],
    );
  }
}

/// =======================
/// CUSTOMER CARD
/// =======================
class _CustomerCard extends StatelessWidget {
  final String initials;
  final String name;
  final String phone;

  const _CustomerCard({
    required this.initials,
    required this.name,
    required this.phone,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
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
          Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: const Color(0xFF00A884),
                child: Text(
                  initials,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      phone,
                      style: const TextStyle(
                        color: Color(0xFF64748B),
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          Row(
            children: [
              Expanded(
                child: _ActionButton(
                  icon: Icons.call,
                  label: "Call",
                  color: const Color(0xFF15B374), // сабз
                  onTap: () {},
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: _ActionButton(
                  icon: Icons.chat_bubble_outline,
                  label: "Chat",
                  color: const Color(0xFF1BB1A5), // туркуаз
                  onTap: () {},
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color color;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.onTap,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        height: 50,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.white, size: 20),
            const SizedBox(width: 10),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 15,
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
/// ROUTE DETAILS
/// =======================
class _RouteDetailsCard extends StatelessWidget {
  final String pickupTitle;
  final String pickupValue;
  final String dropTitle;
  final String dropValue;

  const _RouteDetailsCard({
    required this.pickupTitle,
    required this.pickupValue,
    required this.dropTitle,
    required this.dropValue,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
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
          Row(
            children: [
              const Expanded(
                child: Text(
                  "Route Details",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFDFFAF3),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: const Text(
                  "Document",
                  style: TextStyle(
                    color: Color(0xFF00A884),
                    fontWeight: FontWeight.w500,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          _RouteItem(
            icon: Icons.inventory_2_outlined,
            iconBg: const Color(0xFFDFFAF3),
            iconColor: const Color(0xFF00A884),
            title: pickupTitle,
            value: pickupValue,
            onNavigate: () {},
            showConnector: true,
          ),

          const SizedBox(height: 8),

          _RouteItem(
            icon: Icons.location_on_outlined,
            iconBg: const Color(0xFFDFFAF3),
            iconColor: const Color(0xFF00A884),
            title: dropTitle,
            value: dropValue,
            onNavigate: () {},
            showConnector: false,
          ),
        ],
      ),
    );
  }
}

class _RouteItem extends StatelessWidget {
  final IconData icon;
  final Color iconBg;
  final Color iconColor;
  final String title;
  final String value;
  final VoidCallback onNavigate;
  final bool showConnector;

  const _RouteItem({
    required this.icon,
    required this.iconBg,
    required this.iconColor,
    required this.title,
    required this.value,
    required this.onNavigate,
    required this.showConnector,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: iconBg,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: iconColor),
            ),
            if (showConnector)
              Container(
                width: 2,
                height: 70,
                margin: const EdgeInsets.only(top: 6),
                color: const Color(0xFFCAD5E2),
              ),
          ],
        ),

        const SizedBox(width: 12),

        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: Color(0xFF64748B),
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                value,
                style: const TextStyle(
                  color: Color(0xFF0F172A),
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 10),

              // InkWell(
              //   onTap: onNavigate,
              //   borderRadius: BorderRadius.circular(14),
              //   child: Container(
              //     padding: const EdgeInsets.symmetric(
              //       horizontal: 14,
              //       vertical: 10,
              //     ),
              //     decoration: BoxDecoration(
              //       borderRadius: BorderRadius.circular(14),
              //       border: Border.all(color: const Color(0xFF00A884)),
              //       color: Colors.white,
              //     ),
              //     child: Row(
              //       mainAxisSize: MainAxisSize.min,
              //       children: const [
              //         Icon(
              //           Icons.navigation_outlined,
              //           color: Color(0xFF00A884),
              //           size: 18,
              //         ),
              //         SizedBox(width: 8),
              //         Text(
              //           "Navigate",
              //           style: TextStyle(
              //             color: Color(0xFF00A884),
              //             fontWeight: FontWeight.w900,
              //           ),
              //         ),
              //       ],
              //     ),
              //   ),
              // ),
            ],
          ),
        ),
      ],
    );
  }
}

/// SPECIAL INSTRUCTION
class _SpecialInstructionsCard extends StatelessWidget {
  final String text;
  const _SpecialInstructionsCard({required this.text});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF7E6),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFF7C948)),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 14,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFFFFE8B3),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.error_outline, color: Color(0xFFB45309)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Special Instructions",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF7C2D12),
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  text,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF92400E),
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

/// =======================
/// BOTTOM ACTIONS
/// =======================
class _BottomActions extends StatelessWidget {
  final VoidCallback onReject;
  final VoidCallback onAccept;

  const _BottomActions({required this.onReject, required this.onAccept});

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewPadding.bottom;

    return Align(
      alignment: Alignment.bottomCenter,
      child: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 16,
              offset: Offset(0, -8),
            ),
          ],
        ),
        padding: EdgeInsets.fromLTRB(16, 12, 16, 12 + bottomInset), // ✅ бе gap
        child: Row(
          children: [
            Expanded(
              child: _BottomBtn(
                color: const Color(0xFFFF2D2D),
                icon: Icons.close,
                label: "Reject",
                onTap: onReject,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _BottomBtn(
                color: const Color(0xFF00A884),
                icon: Icons.check_circle,
                label: "Accept Order",
                onTap: onAccept,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BottomBtn extends StatelessWidget {
  final Color color;
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _BottomBtn({
    required this.color,
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        height: 54,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.white),
            const SizedBox(width: 10),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BottomComplete extends StatelessWidget {
  final VoidCallback onComplete;
  const _BottomComplete({required this.onComplete});

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewPadding.bottom;

    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(16, 12, 16, 12 + bottomInset),
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 16,
            offset: Offset(0, -8),
          ),
        ],
      ),
      child: InkWell(
        onTap: onComplete,
        borderRadius: BorderRadius.circular(18),
        child: Container(
          height: 58,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFF00BBA7), Color(0xFF009966)],
            ),
            borderRadius: BorderRadius.circular(18),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Icon(Icons.check_circle_outline, color: Colors.white),
              SizedBox(width: 12),
              Text(
                "Complete Delivery",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _OrderCompletedBanner extends StatelessWidget {
  const _OrderCompletedBanner();

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewPadding.bottom;

    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(16, 20, 16, 20 + bottomInset),
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 16,
            offset: Offset(0, -8),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: const [
          Icon(Icons.check_circle, size: 40, color: Color(0xFF00A884)),
          SizedBox(height: 12),
          Text(
            "Order Completed Successfully!",
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: Color(0xFF00A884),
            ),
          ),
        ],
      ),
    );
  }
}

class _BottomGradientButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _BottomGradientButton({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.of(context).viewPadding.bottom;

    return Container(
      padding: EdgeInsets.fromLTRB(16, 12, 16, 12 + bottom),
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 16,
            offset: Offset(0, -8),
          ),
        ],
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Container(
          height: 56,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFF00BBA7), Color(0xFF009966)],
            ),
            borderRadius: BorderRadius.circular(18),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: Colors.white),
              const SizedBox(width: 12),
              Text(
                label,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 17,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
