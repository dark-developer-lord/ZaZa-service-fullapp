// import 'package:flutter/material.dart';

// class DeliveryCompletedPage extends StatelessWidget {
//   final String orderId;
//   final String customer;
//   final double earnedC;
//   final Duration deliveryTime;
//   final VoidCallback? onDone;

//   const DeliveryCompletedPage({
//     super.key,
//     required this.orderId,
//     required this.customer,
//     required this.earnedC,
//     required this.deliveryTime,
//     this.onDone,
//   });

//   String _formatDuration(Duration d) {
//     final h = d.inHours;
//     final m = d.inMinutes.remainder(60);
//     final s = d.inSeconds.remainder(60);

//     String two(int n) => n.toString().padLeft(2, '0');
//     if (h > 0) return "${two(h)}:${two(m)}:${two(s)}";
//     return "${two(m)}:${two(s)}";
//   }

//   @override
//   Widget build(BuildContext context) {
//     final bottom = MediaQuery.of(context).viewPadding.bottom;

//     return Scaffold(
//       backgroundColor: const Color(0xFFEFFFFA),
//       body: SafeArea(
//         bottom: false,
//         child: Column(
//           children: [
//             const SizedBox(height: 38),

//             Container(
//               width: 90,
//               height: 90,
//               decoration: BoxDecoration(
//                 color: const Color(0xFF0FAF73),
//                 borderRadius: BorderRadius.circular(999),
//                 boxShadow: const [
//                   BoxShadow(
//                     color: Colors.black12,
//                     blurRadius: 18,
//                     offset: Offset(0, 10),
//                   ),
//                 ],
//               ),
//               child: const Icon(Icons.check, color: Colors.white, size: 44),
//             ),

//             const SizedBox(height: 24),

//             const Text(
//               "Delivery Completed!",
//               style: TextStyle(
//                 fontSize: 34,
//                 fontWeight: FontWeight.w900,
//                 color: Color(0xFF0F172A),
//               ),
//             ),

//             const SizedBox(height: 10),

//             Text(
//               "You've earned ${earnedC.toStringAsFixed(2)} c",
//               style: const TextStyle(
//                 fontSize: 18,
//                 fontWeight: FontWeight.w700,
//                 color: Color(0xFF475569),
//               ),
//             ),

//             const SizedBox(height: 22),

//             Padding(
//               padding: const EdgeInsets.symmetric(horizontal: 18),
//               child: Container(
//                 padding: const EdgeInsets.all(18),
//                 decoration: BoxDecoration(
//                   color: Colors.white,
//                   borderRadius: BorderRadius.circular(22),
//                   boxShadow: const [
//                     BoxShadow(
//                       color: Colors.black12,
//                       blurRadius: 18,
//                       offset: Offset(0, 10),
//                     ),
//                   ],
//                 ),
//                 child: Column(
//                   children: [
//                     _kv("Order ID", "#$orderId"),
//                     const SizedBox(height: 16),
//                     _kv("Customer", customer),
//                     const SizedBox(height: 16),
//                     _kv("Delivery Time", _formatDuration(deliveryTime)),
//                     const SizedBox(height: 18),
//                     const Divider(height: 1),
//                     const SizedBox(height: 14),

//                     Row(
//                       mainAxisAlignment: MainAxisAlignment.center,
//                       children: const [
//                         Icon(Icons.verified_outlined, color: Color(0xFF0FAF73)),
//                         SizedBox(width: 10),
//                         Text(
//                           "Proof of Delivery Verified",
//                           style: TextStyle(
//                             color: Color(0xFF0FAF73),
//                             fontWeight: FontWeight.w900,
//                             fontSize: 16,
//                           ),
//                         ),
//                       ],
//                     ),
//                   ],
//                 ),
//               ),
//             ),

//             const Spacer(),

//             const Text(
//               "Redirecting to orders...",
//               style: TextStyle(
//                 color: Color(0xFF94A3B8),
//                 fontWeight: FontWeight.w700,
//               ),
//             ),

//             SizedBox(height: 16 + bottom),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _kv(String k, String v) {
//     return Row(
//       children: [
//         Expanded(
//           child: Text(
//             k,
//             style: const TextStyle(
//               color: Color(0xFF64748B),
//               fontWeight: FontWeight.w700,
//               fontSize: 15,
//             ),
//           ),
//         ),
//         Text(
//           v,
//           style: const TextStyle(
//             color: Color(0xFF0F172A),
//             fontWeight: FontWeight.w900,
//             fontSize: 17,
//           ),
//         ),
//       ],
//     );
//   }
// }

import 'package:flutter/material.dart';

class DeliveryCompletedPage extends StatefulWidget {
  final String orderId;
  final String customer;
  final double earnedC;
  final Duration deliveryTime;

  /// Called right before leaving this page (go Home/Orders tab)
  final VoidCallback? onGoOrders;

  const DeliveryCompletedPage({
    super.key,
    required this.orderId,
    required this.customer,
    required this.earnedC,
    required this.deliveryTime,
    this.onGoOrders,
  });

  @override
  State<DeliveryCompletedPage> createState() => _DeliveryCompletedPageState();
}

class _DeliveryCompletedPageState extends State<DeliveryCompletedPage> {
  @override
  void initState() {
    super.initState();

    // ✅ Auto redirect
    Future.delayed(const Duration(milliseconds: 1500), () {
      if (!mounted) return;
      widget.onGoOrders?.call();
      Navigator.pop(context, true); // return success
    });
  }

  String _fmtDuration(Duration d) {
    final h = d.inHours;
    final m = d.inMinutes.remainder(60);
    final s = d.inSeconds.remainder(60);

    String two(int n) => n.toString().padLeft(2, '0');

    // show HH:MM:SS if >=1 hour, else MM:SS
    if (h > 0) return "${two(h)}:${two(m)}:${two(s)}";
    return "${two(m)}:${two(s)}";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFFFFA),
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 36),

            // ✅ Big check icon
            Container(
              width: 92,
              height: 92,
              decoration: BoxDecoration(
                color: const Color(0xFF0FAF73),
                borderRadius: BorderRadius.circular(999),
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 18,
                    offset: Offset(0, 10),
                  ),
                ],
              ),
              child: const Icon(Icons.check, color: Colors.white, size: 46),
            ),

            const SizedBox(height: 22),

            const Text(
              "Delivery Completed!",
              style: TextStyle(
                fontSize: 34,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F172A),
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 10),

            Text(
              "You've earned ${widget.earnedC.toStringAsFixed(2)} c",
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: Color(0xFF475569),
              ),
            ),

            const SizedBox(height: 22),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18),
              child: Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 18,
                      offset: Offset(0, 10),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    _kv("Order ID", "#${widget.orderId}"),
                    const SizedBox(height: 16),
                    _kv("Customer", widget.customer),
                    const SizedBox(height: 16),
                    _kv("Delivery Time", _fmtDuration(widget.deliveryTime)),
                    const SizedBox(height: 18),
                    const Divider(height: 1),
                    const SizedBox(height: 14),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(Icons.verified_outlined, color: Color(0xFF0FAF73)),
                        SizedBox(width: 10),
                        Text(
                          "Proof of Delivery Verified",
                          style: TextStyle(
                            color: Color(0xFF0FAF73),
                            fontWeight: FontWeight.w900,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const Spacer(),

            const Text(
              "Redirecting to orders...",
              style: TextStyle(
                color: Color(0xFF94A3B8),
                fontWeight: FontWeight.w700,
              ),
            ),

            const SizedBox(height: 22),
          ],
        ),
      ),
    );
  }

  Widget _kv(String k, String v) {
    return Row(
      children: [
        Expanded(
          child: Text(
            k,
            style: const TextStyle(
              color: Color(0xFF64748B),
              fontWeight: FontWeight.w700,
              fontSize: 15,
            ),
          ),
        ),
        Text(
          v,
          style: const TextStyle(
            color: Color(0xFF0F172A),
            fontWeight: FontWeight.w900,
            fontSize: 17,
          ),
        ),
      ],
    );
  }
}
