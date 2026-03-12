import 'package:flutter/material.dart';
import 'package:zaza_app/ServicePage/Box/models/box_checkout_arg_model.dart';
import 'package:zaza_app/ServicePage/Box/view/box_page.dart';
import 'package:zaza_app/Basket/Payment%20Method/view/payment_method_sheet.dart';

class BoxCheckoutPage extends StatelessWidget {
  final BoxCheckoutArgs args;

  const BoxCheckoutPage({super.key, required this.args});

  @override
  Widget build(BuildContext context) {
    const darkGreen = Color(0xFF0C3A2E);
    const mint = Color(0xFF20E3A2);

    return Scaffold(
      backgroundColor: Colors.white,

      // ✅ Custom header (TopHeader ту аллакай дорӣ)
      body: Column(
        children: [
          TopHeader(
            title: "Box Delivery",
            leftIcon: Icons.arrow_back_ios_new_rounded,
            onLeftTap: () => Navigator.pop(context),
            rightText: "Help",
            onRightTap: () {},
          ),

          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 18),
              children: [
                const Text(
                  "Location details",
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 6),
                const Text(
                  "Estimated Delivery Time: 30 - 40 mins",
                  style: TextStyle(
                    color: Color(0xFF6B7280),
                    fontWeight: FontWeight.w400,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 14),

                _MapMockCard(), // агар map надорӣ, placeholder

                const SizedBox(height: 14),
                LocationStopsConnected(
                  pickup: args.pickup,
                  dropoff: args.dropoff,
                  onPickupTap: () => Navigator.pop(context),
                  onDropoffTap: () => Navigator.pop(context),
                ),

                // _AddressRow(
                //   title: "Pick-up",
                //   value: args.pickup,
                //   onTap: () => Navigator.pop(context), // edit -> back
                // ),
                // const SizedBox(height: 10),
                // _AddressRow(
                //   title: "Drop-off",
                //   value: args.dropoff,
                //   onTap: () => Navigator.pop(context),
                // ),
                const SizedBox(height: 26),

                _SectionHeader(
                  title: "Vehicle type",
                  actionText: "Edit",
                  onTap: () => Navigator.pop(context),
                ),
                const SizedBox(height: 10),
                _SimpleRow(
                  leadingIcon: Icons.two_wheeler_rounded,
                  title: args.vehicleTitle,
                ),

                const SizedBox(height: 26),

                _SectionHeader(
                  title: "Order details",
                  actionText: "Edit",
                  onTap: () => Navigator.pop(context),
                ),
                const SizedBox(height: 12),

                _KeyValue(
                  label: "Instructions",
                  value: args.instructions.trim().isEmpty
                      ? "No instructions"
                      : args.instructions.trim(),
                  onEdit: () => Navigator.pop(context),
                ),
                const SizedBox(height: 18),
                _KeyValue(
                  label: "Package category",
                  value: args.packageCategory,
                  onEdit: () => Navigator.pop(context),
                ),

                const SizedBox(height: 26),

                const Text(
                  "Total",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 12),

                // ❌ “Estimated …” нест
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      "Service fee",
                      style: TextStyle(
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF6B7280),
                      ),
                    ),
                    Text(
                      "${args.total} c",
                      style: const TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 15,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 26),

                const Text(
                  "Pay with",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 12),

                // _PayInfoBanner(amount: args.total),
                // const SizedBox(height: 12),
                _PaymentMethodTile(
                  brand: "VISA",
                  name: "KAMOLZODA MUHAMMADFOTEH",
                  onTap: () {
                    showPaymentMethodSheet(context);
                  },
                ),

                const SizedBox(height: 20),

                // барои scroll bottom spacing
                // const SizedBox(height: 80),
              ],
            ),
          ),
        ],
      ),

      bottomNavigationBar: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 12),
          child: SizedBox(
            height: 58,
            child: ElevatedButton(
              onPressed: () {
                // TODO: place order
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: darkGreen,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child: const Text(
                "Place order",
                style: TextStyle(
                  color: mint,
                  fontWeight: FontWeight.w600,
                  fontSize: 18,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class LocationStopsConnected extends StatelessWidget {
  final String pickup;
  final String dropoff;
  final VoidCallback onPickupTap;
  final VoidCallback onDropoffTap;

  const LocationStopsConnected({
    super.key,
    required this.pickup,
    required this.dropoff,
    required this.onPickupTap,
    required this.onDropoffTap,
  });

  @override
  Widget build(BuildContext context) {
    const darkGreen = Color(0xFF0C3A2E);

    // Андозаҳо (бо ҳамин хат 100% рост мешавад)
    const double iconBox = 42;
    const double iconSize = 40;
    const double rowHeight = 76;

    // Маркази icon дар ҳар row
    final double centerX = iconBox / 2;
    final double topCenterY = rowHeight / 2;
    final double bottomCenterY = rowHeight + rowHeight / 2;

    return Stack(
      children: [
        // ✅ ONE vertical line (пайваста)
        Positioned(
          left: centerX - 1, // 2px line -> center align
          top: topCenterY + iconSize / 2 - 2,
          height: (bottomCenterY - (topCenterY + iconSize / 2 + 2)),
          child: Container(width: 2, color: const Color(0xFFE5E7EB)),
        ),

        Column(
          children: [
            _StopRowSimple(
              height: rowHeight,
              title: "Pick-up",
              value: pickup,
              iconBg: darkGreen,
              icon: Icons.place_rounded,
              onTap: onPickupTap,
            ),
            _StopRowSimple(
              height: rowHeight,
              title: "Drop-off",
              value: dropoff,
              iconBg: darkGreen,
              icon: Icons.place_rounded,
              onTap: onDropoffTap,
            ),
          ],
        ),
      ],
    );
  }
}

class _StopRowSimple extends StatelessWidget {
  final double height;
  final String title;
  final String value;
  final Color iconBg;
  final IconData icon;
  final VoidCallback onTap;

  const _StopRowSimple({
    required this.height,
    required this.title,
    required this.value,
    required this.iconBg,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(14),
      onTap: onTap,
      child: SizedBox(
        height: height,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(width: 2),
            SizedBox(
              width: 42,
              child: Center(
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: iconBg,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(icon, color: Colors.white, size: 20),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    value,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(color: Color(0xFF6B7280)),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded),
            const SizedBox(width: 4),
          ],
        ),
      ),
    );
  }
}

/* ------------------ UI parts ------------------ */

class _MapMockCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 220,
      decoration: BoxDecoration(
        color: const Color(0xFFF3F4F6),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Stack(
        children: const [
          Positioned(
            left: 14,
            bottom: 12,
            child: Text(
              "Google",
              style: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 22,
                color: Color(0xFF111827),
              ),
            ),
          ),
          Center(
            child: Icon(
              Icons.place_rounded,
              size: 56,
              color: Color(0xFF0C3A2E),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final String actionText;
  final VoidCallback onTap;

  const _SectionHeader({
    required this.title,
    required this.actionText,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
        ),
        const Spacer(),
        InkWell(
          onTap: onTap,
          child: Text(
            actionText,
            style: const TextStyle(
              fontWeight: FontWeight.w500,
              fontSize: 16,
              color: Color(0xFF111827),
            ),
          ),
        ),
      ],
    );
  }
}

class _SimpleRow extends StatelessWidget {
  final IconData leadingIcon;
  final String title;

  const _SimpleRow({required this.leadingIcon, required this.title});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: const Color(0xFFF3F4F6),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(leadingIcon, color: const Color(0xFF111827)),
        ),
        const SizedBox(width: 12),
        Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 16),
        ),
      ],
    );
  }
}

class _KeyValue extends StatelessWidget {
  final String label;
  final String value;
  final VoidCallback onEdit;

  const _KeyValue({
    required this.label,
    required this.value,
    required this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  color: Color(0xFF6B7280),
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 6),
              Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
            ],
          ),
        ),
        InkWell(
          onTap: onEdit,
          child: const Text(
            "Edit",
            style: TextStyle(
              fontWeight: FontWeight.w600,
              color: Color(0xFF9CA3AF),
            ),
          ),
        ),
      ],
    );
  }
}

// class _PayInfoBanner extends StatelessWidget {
//   final int amount;

//   const _PayInfoBanner({required this.amount});

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       padding: const EdgeInsets.all(12),
//       decoration: BoxDecoration(
//         color: const Color(0xFFFFF4D6),
//         borderRadius: BorderRadius.circular(14),
//       ),
//       child: Row(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           const Icon(Icons.block_rounded, color: Color(0xFFB45309)),
//           const SizedBox(width: 10),
//           Expanded(
//             child: Text(
//               "Your card will be temporarily authorised for Ð $amount. Only final cost will be charged to your card after delivery.",
//               style: const TextStyle(
//                 color: Color(0xFF92400E),
//                 fontWeight: FontWeight.w700,
//                 height: 1.25,
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

class _PaymentMethodTile extends StatelessWidget {
  final String brand;
  final String name;
  final VoidCallback onTap;

  const _PaymentMethodTile({
    required this.brand,
    required this.name,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE5E7EB)),
        ),
        child: Row(
          children: [
            Container(
              width: 46,
              height: 30,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: const Color(0xFFF3F4F6),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                brand,
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                name,
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
            const Icon(Icons.chevron_right_rounded),
          ],
        ),
      ),
    );
  }
}
