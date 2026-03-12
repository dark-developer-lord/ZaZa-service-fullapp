import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:zaza_driver_app/Order/models/order_model.dart';
import 'package:zaza_driver_app/Order/store/orders_store.dart';
import 'package:zaza_driver_app/Order/view/delivery_complete_page.dart';
import 'package:zaza_driver_app/Wallet/store/transaction_store.dart';

class ProofOfDeliveryPage extends StatefulWidget {
  final OrderModel order;
  final OrdersStore store;
  final VoidCallback? onFinishedGoHome;

  const ProofOfDeliveryPage({
    super.key,
    required this.order,
    required this.store,
    this.onFinishedGoHome,
  });

  @override
  State<ProofOfDeliveryPage> createState() => _ProofOfDeliveryPageState();
}

class _ProofOfDeliveryPageState extends State<ProofOfDeliveryPage> {
  final _picker = ImagePicker();

  File? _photoFile;
  bool _sending = false;

  // ✅ НЕ final, то Retake тавонад аз нав оғоз кунад
  late DateTime _proofOpenedAt;

  Timer? _ticker;
  int _elapsedSec = 0;

  @override
  void initState() {
    super.initState();
    _resetTimer();

    _ticker = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      setState(() {
        _elapsedSec = DateTime.now().difference(_proofOpenedAt).inSeconds;
      });
    });
  }

  void _resetTimer() {
    _proofOpenedAt = DateTime.now();
    _elapsedSec = 0;
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }

  Future<void> _capturePhoto() async {
    final x = await _picker.pickImage(
      source: ImageSource.camera,
      imageQuality: 82,
    );
    if (x == null) return;
    setState(() => _photoFile = File(x.path));
  }

  void _retake() {
    setState(() {
      _photoFile = null;
      _sending = false; // ✅ агар verifying буд, қатъ шавад
      _resetTimer(); // ✅ таймер аз нав сар мешавад
    });
  }

  Future<void> _confirmDelivery() async {
    if (_photoFile == null) return;
    if (_sending) return;

    setState(() => _sending = true);

    final o = widget.order;

    final orderId = o.orderId;
    final amount = _extractCAmount(o.price);
    final finalAmount = amount == 0 ? 10.0 : amount;

    final deliveryTime = DateTime.now().difference(_proofOpenedAt);

    widget.store.complete(o);

    WalletTxStore.I.addDeliveryFee(
      orderId: orderId,
      amount: finalAmount,
      currency: "c",
    );

    if (!mounted) return;

    final cleanOrderId = orderId
        .replaceAll("Order ", "")
        .replaceAll("#", "")
        .trim();

    setState(() => _sending = false);

    await Navigator.push<bool>(
      context,
      MaterialPageRoute(
        builder: (_) => DeliveryCompletedPage(
          orderId: cleanOrderId.isEmpty ? orderId : cleanOrderId,
          customer: o.customer,
          earnedC: finalAmount,
          deliveryTime: deliveryTime,
          onGoOrders: widget.onFinishedGoHome,
        ),
      ),
    );

    if (!mounted) return;
    Navigator.pop(context, true);
  }

  double _extractCAmount(String feeText) {
    final cleaned = feeText.replaceAll(RegExp(r'[^0-9\.\,]'), '');
    final normalized = cleaned.replaceAll(',', '.');
    return double.tryParse(normalized) ?? 0.0;
  }

  static String _fmtElapsed(int sec) {
    String pad(int n) => n.toString().padLeft(2, '0');

    final h = sec ~/ 3600;
    final m = (sec % 3600) ~/ 60;
    final s = sec % 60;

    if (h > 0) return "${pad(h)}:${pad(m)}:${pad(s)}";
    return "${pad(m)}:${pad(s)}";
  }

  @override
  Widget build(BuildContext context) {
    final o = widget.order;

    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      body: Stack(
        children: [
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
                  _PodTopBar(
                    title: "Proof of Delivery",
                    subtitle: o.orderId,
                    onBack: () => Navigator.pop(context),
                  ),
                  const SizedBox(height: 14),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: _PodHeaderCard(
                      name: o.customer,
                      location: o.dropoff,
                      elapsedText: _fmtElapsed(_elapsedSec),
                      locationVerified: _photoFile != null,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: _PhotoRequiredCard(),
                  ),
                  const SizedBox(height: 12),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: _PhotoBox(file: _photoFile),
                  ),
                  const SizedBox(height: 12),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: _DeliveryDetailsCard(
                      orderId: o.orderId,
                      customer: o.customer,
                      packageType: o.type,
                      earnings: o.price,
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16),
                    child: _SecureVerificationCard(),
                  ),
                  const SizedBox(height: 22),
                ],
              ),
            ),
          ),

          Align(
            alignment: Alignment.bottomCenter,
            child: _photoFile == null
                ? _BottomOneButton(
                    label: "Capture Photo",
                    icon: Icons.photo_camera_outlined,
                    onTap: _capturePhoto,
                  )
                : _BottomTwoButtons(
                    leftLabel: "Retake",
                    leftIcon: Icons.refresh_rounded,
                    onLeft: _retake,
                    rightLabel: _sending ? "Verifying..." : "Confirm Delivery",
                    rightIcon: _sending
                        ? Icons.hourglass_top
                        : Icons.check_circle,

                    // ✅ муҳим: wrapper (VoidCallback) то type error нашавад
                    onRight: _sending ? null : _confirmDelivery,
                  ),
          ),
        ],
      ),
    );
  }
}

/// =======================
/// HEADER CARD (UPDATED)
/// =======================
class _PodHeaderCard extends StatelessWidget {
  final String name;
  final String location;
  final String elapsedText;
  final bool locationVerified;

  const _PodHeaderCard({
    required this.name,
    required this.location,
    required this.elapsedText,
    required this.locationVerified,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.14),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white.withOpacity(0.20)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.16),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.inventory_2_outlined, color: Colors.white),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  location,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    const Icon(
                      Icons.timer_outlined,
                      color: Colors.white70,
                      size: 16,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      "Arrived • $elapsedText",
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(width: 14),
                    if (locationVerified) ...[
                      const Icon(
                        Icons.location_on_outlined,
                        color: Colors.white70,
                        size: 16,
                      ),
                      const SizedBox(width: 6),
                      const Text(
                        "Location verified",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// ---------- UI WIDGETS ----------
class _PodTopBar extends StatelessWidget {
  final String title;
  final String subtitle;
  final VoidCallback onBack;

  const _PodTopBar({
    required this.title,
    required this.subtitle,
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
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(16),
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
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
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

// class _PodHeaderCard extends StatelessWidget {
//   final String name;
//   final String location;
//   final DateTime startedAt;
//   final bool locationVerified;

//   const _PodHeaderCard({
//     required this.name,
//     required this.location,
//     required this.startedAt,
//     required this.locationVerified,
//   });

//   String _minutesAgo() {
//     final diff = DateTime.now().difference(startedAt);
//     final m = diff.inMinutes;

//     if (m <= 0) return "Just now";
//     if (m == 1) return "1 min ago";
//     return "$m min ago";
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       padding: const EdgeInsets.all(14),
//       decoration: BoxDecoration(
//         color: Colors.white.withOpacity(0.14),
//         borderRadius: BorderRadius.circular(18),
//         border: Border.all(color: Colors.white.withOpacity(0.20)),
//       ),
//       child: Row(
//         children: [
//           Container(
//             width: 42,
//             height: 42,
//             decoration: BoxDecoration(
//               color: Colors.white.withOpacity(0.16),
//               borderRadius: BorderRadius.circular(14),
//             ),
//             child: const Icon(Icons.inventory_2_outlined, color: Colors.white),
//           ),
//           const SizedBox(width: 12),
//           Expanded(
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Text(
//                   name,
//                   style: const TextStyle(
//                     color: Colors.white,
//                     fontSize: 16,
//                     fontWeight: FontWeight.w800,
//                   ),
//                 ),
//                 const SizedBox(height: 3),
//                 Text(
//                   location,
//                   style: const TextStyle(
//                     color: Colors.white70,
//                     fontSize: 13,
//                     fontWeight: FontWeight.w600,
//                   ),
//                 ),
//                 const SizedBox(height: 10),
//                 Row(
//                   children: [
//                     const Icon(
//                       Icons.access_time_rounded,
//                       color: Colors.white70,
//                       size: 16,
//                     ),
//                     const SizedBox(width: 6),
//                     Text(
//                       _minutesAgo(), // ✅ 10 min ago
//                       style: const TextStyle(
//                         color: Colors.white70,
//                         fontSize: 13,
//                         fontWeight: FontWeight.w600,
//                       ),
//                     ),
//                     if (locationVerified) ...[
//                       const SizedBox(width: 14),
//                       const Icon(
//                         Icons.location_on_outlined,
//                         color: Colors.white70,
//                         size: 16,
//                       ),
//                       const SizedBox(width: 6),
//                       const Text(
//                         "Location verified",
//                         style: TextStyle(
//                           color: Colors.white,
//                           fontSize: 13,
//                           fontWeight: FontWeight.w700,
//                         ),
//                       ),
//                     ],
//                   ],
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

class _PhotoRequiredCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF7E6),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFFFD48A)),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 14,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.info_outline, color: Color(0xFFB45309)),
          SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Photo Required",
                  style: TextStyle(
                    color: Color(0xFF7C2D12),
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                SizedBox(height: 6),
                Text(
                  "Take a clear photo of the delivered package at the customer's location. This serves as proof of delivery.",
                  style: TextStyle(
                    color: Color(0xFF9A3412),
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    height: 1.3,
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

class _PhotoBox extends StatelessWidget {
  final File? file;
  const _PhotoBox({required this.file});

  @override
  Widget build(BuildContext context) {
    final has = file != null;

    return Container(
      height: 170,
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(18),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 14,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Stack(
        children: [
          Positioned.fill(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(18),
              child: has
                  ? Image.file(file!, fit: BoxFit.cover)
                  : Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(
                          Icons.photo_camera_outlined,
                          size: 54,
                          color: Color(0xFF94A3B8),
                        ),
                        SizedBox(height: 10),
                        Text(
                          "No Photo Captured",
                          style: TextStyle(
                            color: Color(0xFF334155),
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          "Tap the button below to capture",
                          style: TextStyle(
                            color: Color(0xFF64748B),
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
            ),
          ),

          if (has)
            Positioned(
              top: 10,
              right: 10,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF1F9D6A),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.check, color: Colors.white, size: 18),
                    SizedBox(width: 8),
                    Text(
                      "Captured",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
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

class _DeliveryDetailsCard extends StatelessWidget {
  final String orderId;
  final String customer;
  final String packageType;
  final String earnings;

  const _DeliveryDetailsCard({
    required this.orderId,
    required this.customer,
    required this.packageType,
    required this.earnings,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
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
            "Delivery Details",
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 12),
          _RowKV("Order ID", orderId.replaceAll("Order ", "")),
          _RowKV("Customer", customer),
          _RowKV("Package Type", packageType),
          const Divider(height: 18),
          _RowKV(
            "Earnings",
            earnings,
            valueColor: const Color(0xFF00A884),
            bold: true,
          ),
        ],
      ),
    );
  }
}

class _RowKV extends StatelessWidget {
  final String k;
  final String v;
  final Color? valueColor;
  final bool bold;

  const _RowKV(this.k, this.v, {this.valueColor, this.bold = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(
            child: Text(
              k,
              style: const TextStyle(
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w700,
                fontSize: 13,
              ),
            ),
          ),
          Text(
            v,
            style: TextStyle(
              color: valueColor ?? const Color(0xFF0F172A),
              fontWeight: bold ? FontWeight.w900 : FontWeight.w800,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}

class _SecureVerificationCard extends StatelessWidget {
  const _SecureVerificationCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFE9FFFA),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFB7F3E6)),
      ),
      child: const Row(
        children: [
          Icon(Icons.verified_outlined, color: Color(0xFF00A884)),
          SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Secure Delivery Verification",
                  style: TextStyle(
                    color: Color(0xFF075E52),
                    fontWeight: FontWeight.w900,
                    fontSize: 13,
                  ),
                ),
                SizedBox(height: 3),
                Text(
                  "GPS tracked · Photo encrypted\n· Dispute prevention",
                  style: TextStyle(
                    color: Color(0xFF0F766E),
                    fontWeight: FontWeight.w700,
                    fontSize: 11,
                    height: 1.2,
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

/// --- Bottoms ---
class _BottomOneButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;

  const _BottomOneButton({
    required this.label,
    required this.icon,
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
          height: 54,
          decoration: BoxDecoration(
            color: const Color(0xFF00A884),
            borderRadius: BorderRadius.circular(18),
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
                  fontWeight: FontWeight.w900,
                  fontSize: 16,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _BottomTwoButtons extends StatelessWidget {
  final String leftLabel;
  final IconData leftIcon;
  final VoidCallback onLeft;

  final String rightLabel;
  final IconData rightIcon;

  // ✅ қабул кунад async callback
  final Future<void> Function()? onRight;

  const _BottomTwoButtons({
    required this.leftLabel,
    required this.leftIcon,
    required this.onLeft,
    required this.rightLabel,
    required this.rightIcon,
    required this.onRight,
    super.key,
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
      child: Row(
        children: [
          Expanded(
            child: _Btn(label: leftLabel, icon: leftIcon, onTap: onLeft),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _Btn(
              label: rightLabel,
              icon: rightIcon,

              // ✅ ҳамин ҷо async-ро бевосита даъват мекунем
              onTap: onRight == null ? null : () async => await onRight!(),
            ),
          ),
        ],
      ),
    );
  }
}

/// мисол (кнопкаи оддӣ)
class _Btn extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback? onTap;

  const _Btn({
    required this.label,
    required this.icon,
    required this.onTap,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final disabled = onTap == null;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Opacity(
        opacity: disabled ? 0.55 : 1,
        child: Container(
          height: 54,
          decoration: BoxDecoration(
            color: const Color(0xFF00A884),
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

class _CompletedBottomBanner extends StatelessWidget {
  const _CompletedBottomBanner();

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.of(context).viewPadding.bottom;

    return Container(
      padding: EdgeInsets.fromLTRB(16, 14, 16, 14 + bottom),
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
      child: Container(
        height: 84,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: const Color(0xFFF3FFFB),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: const Color(0xFFB7F3E6)),
        ),
        child: const Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.check_circle, color: Color(0xFF00A884), size: 28),
            SizedBox(height: 8),
            Text(
              "Order Completed Successfully!",
              style: TextStyle(
                color: Color(0xFF075E52),
                fontWeight: FontWeight.w900,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
