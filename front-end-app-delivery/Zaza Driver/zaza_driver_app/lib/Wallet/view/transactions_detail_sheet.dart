// import 'package:flutter/material.dart';
// import 'package:zaza_driver_app/Wallet/models/tx_model.dart';

// class TransactionDetailsSheet {
//   static Future<void> show(BuildContext context, TxModel tx) {
//     return showModalBottomSheet(
//       context: context,
//       isScrollControlled: true,
//       backgroundColor: Colors.transparent,
//       barrierColor: Colors.black.withOpacity(0.20),
//       builder: (_) => _TxDetailsSheet(tx: tx),
//     );
//   }
// }

// class _TxDetailsSheet extends StatelessWidget {
//   final TxModel tx;
//   const _TxDetailsSheet({required this.tx});

//   @override
//   Widget build(BuildContext context) {
//     final media = MediaQuery.of(context);
//     final top = media.viewPadding.top;
//     final bottom = media.viewPadding.bottom;

//     final dt = _splitDateTime(tx.subtitle1); // ("Feb 16, 2026", "12:14 AM")

//     return SafeArea(
//       top: false,
//       bottom: false,
//       child: Container(
//         margin: EdgeInsets.only(top: 340),
//         decoration: BoxDecoration(
//           color: Colors.white,
//           borderRadius: BorderRadius.circular(14),
//           boxShadow: const [
//             BoxShadow(
//               color: Colors.black12,
//               blurRadius: 18,
//               offset: Offset(0, 10),
//             ),
//           ],
//         ),
//         child: Column(
//           children: [
//             // ✅ Header
//             Padding(
//               padding: const EdgeInsets.fromLTRB(16, 14, 12, 10),
//               child: Row(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   const Expanded(
//                     child: Column(
//                       crossAxisAlignment: CrossAxisAlignment.start,
//                       children: [
//                         Text(
//                           "Transaction Details",
//                           style: TextStyle(
//                             fontSize: 18,
//                             fontWeight: FontWeight.w800,
//                             color: Color(0xFF0F172A),
//                           ),
//                         ),
//                         SizedBox(height: 4),
//                         Text(
//                           "View detailed information about this transaction.",
//                           style: TextStyle(
//                             fontSize: 13,
//                             fontWeight: FontWeight.w500,
//                             color: Color(0xFF94A3B8),
//                           ),
//                         ),
//                       ],
//                     ),
//                   ),
//                   InkWell(
//                     onTap: () => Navigator.pop(context),
//                     borderRadius: BorderRadius.circular(10),
//                     child: const Padding(
//                       padding: EdgeInsets.all(8),
//                       child: Icon(Icons.close, size: 20),
//                     ),
//                   ),
//                 ],
//               ),
//             ),

//             // ✅ Big amount card
//             Padding(
//               padding: const EdgeInsets.symmetric(horizontal: 16),
//               child: Container(
//                 width: double.infinity,
//                 padding: const EdgeInsets.symmetric(
//                   horizontal: 16,
//                   vertical: 22,
//                 ),
//                 decoration: BoxDecoration(
//                   color: const Color(0xFFF6FFFB),
//                   borderRadius: BorderRadius.circular(12),
//                 ),
//                 child: Column(
//                   children: [
//                     Container(
//                       width: 44,
//                       height: 44,
//                       decoration: BoxDecoration(
//                         color: const Color(0xFFDFFAF3),
//                         borderRadius: BorderRadius.circular(14),
//                       ),
//                       child: const Icon(
//                         Icons.south_west,
//                         color: Color(0xFF00A884),
//                       ),
//                     ),
//                     const SizedBox(height: 12),
//                     Text(
//                       tx.amountText,
//                       style: const TextStyle(
//                         fontSize: 34,
//                         fontWeight: FontWeight.w800,
//                         color: Color(0xFF00A884),
//                         height: 1.0,
//                       ),
//                     ),
//                     const SizedBox(height: 6),
//                     const Text(
//                       "Earning",
//                       style: TextStyle(
//                         fontSize: 14,
//                         fontWeight: FontWeight.w500,
//                         color: Color(0xFF64748B),
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//             ),

//             const SizedBox(height: 10),

//             // ✅ Rows list (like table)
//             Expanded(
//               child: Column(
//                 children: [
//                   _InfoRow(
//                     icon: Icons.access_time,
//                     label: "Date & Time",
//                     rightTop: dt.$1,
//                     rightBottom: dt.$2,
//                     showDivider: true,
//                   ),
//                   _InfoRow(
//                     icon: Icons.attach_money,
//                     label: "Description",
//                     rightTop: tx.title,
//                     rightBottom: "",
//                     showDivider: true,
//                   ),
//                   _PlainRow(
//                     label: "Order ID",
//                     value: tx.subtitle2.isEmpty
//                         ? "-"
//                         : tx.subtitle2.replaceFirst("Order ", ""),
//                     showDivider: true,
//                   ),
//                   _PlainRow(
//                     label: "Transaction ID",
//                     value: "1", // ✅ demo, after add to TxModel
//                     showDivider: true,
//                   ),
//                   _StatusRow(
//                     label: "Status",
//                     statusText: "Successful",
//                     showDivider: false,
//                   ),

//                   const SizedBox(height: 16),

//                   // ✅ Success message bar
//                   Padding(
//                     padding: const EdgeInsets.symmetric(horizontal: 16),
//                     child: Container(
//                       width: double.infinity,
//                       padding: const EdgeInsets.symmetric(vertical: 14),
//                       decoration: BoxDecoration(
//                         color: const Color(0xFFEFFFF7),
//                         borderRadius: BorderRadius.circular(10),
//                         border: Border.all(color: const Color(0xFFB7F0DA)),
//                       ),
//                       child: const Center(
//                         child: Text(
//                           "Amount credited to your wallet successfully",
//                           style: TextStyle(
//                             color: Color(0xFF0F766E),
//                             fontWeight: FontWeight.w600,
//                             fontSize: 13,
//                           ),
//                         ),
//                       ),
//                     ),
//                   ),
//                 ],
//               ),
//             ),

//             const SizedBox(height: 14),
//           ],
//         ),
//       ),
//     );
//   }

//   /// "Feb 16, 2026   12:14 AM" -> ("Feb 16, 2026", "12:14 AM")
//   (String, String) _splitDateTime(String s) {
//     final cleaned = s.replaceAll(RegExp(r'\s+'), ' ').trim();
//     // try split by double spaces first
//     if (s.contains("   ")) {
//       final parts = s.split("   ");
//       if (parts.length >= 2) return (parts[0].trim(), parts[1].trim());
//     }
//     // fallback: last 8-9 chars maybe time
//     final m = RegExp(r'(.+)\s(\d{1,2}:\d{2}\s[AP]M)$').firstMatch(cleaned);
//     if (m != null) return (m.group(1)!.trim(), m.group(2)!.trim());
//     return (cleaned, "");
//   }
// }

// class _InfoRow extends StatelessWidget {
//   final IconData icon;
//   final String label;
//   final String rightTop;
//   final String rightBottom;
//   final bool showDivider;

//   const _InfoRow({
//     required this.icon,
//     required this.label,
//     required this.rightTop,
//     required this.rightBottom,
//     required this.showDivider,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Column(
//       children: [
//         Padding(
//           padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
//           child: Row(
//             children: [
//               SizedBox(
//                 width: 26,
//                 child: Icon(icon, size: 18, color: const Color(0xFF94A3B8)),
//               ),
//               const SizedBox(width: 8),
//               Expanded(
//                 child: Text(
//                   label,
//                   style: const TextStyle(
//                     color: Color(0xFF64748B),
//                     fontWeight: FontWeight.w600,
//                     fontSize: 13,
//                   ),
//                 ),
//               ),
//               Column(
//                 crossAxisAlignment: CrossAxisAlignment.end,
//                 children: [
//                   Text(
//                     rightTop,
//                     style: const TextStyle(
//                       color: Color(0xFF0F172A),
//                       fontWeight: FontWeight.w800,
//                       fontSize: 14,
//                     ),
//                   ),
//                   if (rightBottom.isNotEmpty) ...[
//                     const SizedBox(height: 3),
//                     Text(
//                       rightBottom,
//                       style: const TextStyle(
//                         color: Color(0xFF94A3B8),
//                         fontWeight: FontWeight.w600,
//                         fontSize: 12,
//                       ),
//                     ),
//                   ],
//                 ],
//               ),
//             ],
//           ),
//         ),
//         if (showDivider)
//           const Divider(height: 1, thickness: 1, color: Color(0xFFF1F5F9)),
//       ],
//     );
//   }
// }

// class _PlainRow extends StatelessWidget {
//   final String label;
//   final String value;
//   final bool showDivider;

//   const _PlainRow({
//     required this.label,
//     required this.value,
//     required this.showDivider,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Column(
//       children: [
//         Padding(
//           padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
//           child: Row(
//             children: [
//               Expanded(
//                 child: Text(
//                   label,
//                   style: const TextStyle(
//                     color: Color(0xFF64748B),
//                     fontWeight: FontWeight.w600,
//                     fontSize: 13,
//                   ),
//                 ),
//               ),
//               Text(
//                 value,
//                 style: const TextStyle(
//                   color: Color(0xFF0F172A),
//                   fontWeight: FontWeight.w800,
//                   fontSize: 14,
//                 ),
//               ),
//             ],
//           ),
//         ),
//         if (showDivider)
//           const Divider(height: 1, thickness: 1, color: Color(0xFFF1F5F9)),
//       ],
//     );
//   }
// }

// class _StatusRow extends StatelessWidget {
//   final String label;
//   final String statusText;
//   final bool showDivider;

//   const _StatusRow({
//     required this.label,
//     required this.statusText,
//     required this.showDivider,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Column(
//       children: [
//         Padding(
//           padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
//           child: Row(
//             children: [
//               Expanded(
//                 child: Text(
//                   label,
//                   style: const TextStyle(
//                     color: Color(0xFF64748B),
//                     fontWeight: FontWeight.w600,
//                     fontSize: 13,
//                   ),
//                 ),
//               ),
//               Row(
//                 mainAxisSize: MainAxisSize.min,
//                 children: const [
//                   Icon(Icons.check_circle, size: 18, color: Color(0xFF00A884)),
//                   SizedBox(width: 8),
//                   Text(
//                     "Successful",
//                     style: TextStyle(
//                       color: Color(0xFF00A884),
//                       fontWeight: FontWeight.w800,
//                       fontSize: 14,
//                     ),
//                   ),
//                 ],
//               ),
//             ],
//           ),
//         ),
//         if (showDivider)
//           const Divider(height: 1, thickness: 1, color: Color(0xFFF1F5F9)),
//       ],
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:zaza_driver_app/Wallet/models/tx_model.dart';

class TransactionDetailsSheet {
  static Future<void> show(BuildContext context, TxModel tx) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      barrierColor: Colors.black.withOpacity(0.25),
      builder: (_) => _TxDetailsBottomSheet(tx: tx),
    );
  }
}

class _TxDetailsBottomSheet extends StatelessWidget {
  final TxModel tx;
  const _TxDetailsBottomSheet({required this.tx});

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.7,
      minChildSize: 0.4,
      maxChildSize: 0.8,
      builder: (_, controller) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
            boxShadow: [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 18,
                offset: Offset(0, -8),
              ),
            ],
          ),
          child: Column(
            children: [
              // ✅ top grabber (мисли sheet воқеӣ)
              const SizedBox(height: 10),
              Container(
                width: 44,
                height: 5,
                decoration: BoxDecoration(
                  color: const Color(0xFFE2E8F0),
                  borderRadius: BorderRadius.circular(999),
                ),
              ),
              const SizedBox(height: 10),

              Expanded(
                child: SingleChildScrollView(
                  controller: controller, // ✅ scroll ҳамроҳи sheet
                  child: _TxDetailsBody(tx: tx),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _TxDetailsBody extends StatelessWidget {
  final TxModel tx;
  const _TxDetailsBody({required this.tx});

  @override
  Widget build(BuildContext context) {
    final dt = _splitDateTime(tx.subtitle1);

    return Padding(
      padding: EdgeInsets.fromLTRB(
        16,
        0,
        16,
        16 + MediaQuery.of(context).viewPadding.bottom,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ✅ Header
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Transaction Details",
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      "View detailed information about this transaction.",
                      style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                    ),
                  ],
                ),
              ),
              InkWell(
                onTap: () => Navigator.pop(context),
                borderRadius: BorderRadius.circular(10),
                child: const Padding(
                  padding: EdgeInsets.all(8),
                  child: Icon(Icons.close, size: 20),
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          // ✅ Big amount card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 22),
            decoration: BoxDecoration(
              color: const Color(0xFFF6FFFB),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Column(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: const Color(0xFFDFFAF3),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(Icons.south_west, color: Color(0xFF00A884)),
                ),
                const SizedBox(height: 12),
                Text(
                  tx.amountText,
                  style: const TextStyle(
                    fontSize: 34,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF00A884),
                    height: 1.0,
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  "Earning",
                  style: TextStyle(fontSize: 16, color: Color(0xFF64748B)),
                ),
              ],
            ),
          ),

          const SizedBox(height: 14),

          // ✅ Table rows (100% like)
          _InfoRow(
            // icon: Icons.access_time,
            label: "Date & Time",
            rightTop: dt.$1,
            rightBottom: dt.$2,
          ),
          _InfoRow(
            // icon: Icons.attach_money,
            label: "Description",
            rightTop: tx.title,
            rightBottom: "",
          ),
          _PlainRow(
            label: "Order ID",
            value: tx.subtitle2.isEmpty
                ? "-"
                : tx.subtitle2.replaceFirst("Order #", "#"),
          ),
          const _PlainRow(
            label: "Transaction ID",
            value: "1", // demo
          ),
          const _StatusRow(label: "Status", statusText: "Successful"),

          const SizedBox(height: 18),

          // ✅ Green message bar
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 14),
            decoration: BoxDecoration(
              color: const Color(0xFFEFFFF7),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFB7F0DA)),
            ),
            child: const Center(
              child: Text(
                "Amount credited to your wallet successfully",
                style: TextStyle(
                  color: Color(0xFF0F766E),
                  fontWeight: FontWeight.w500,
                  fontSize: 13,
                ),
              ),
            ),
          ),

          const SizedBox(height: 10),
        ],
      ),
    );
  }

  (String, String) _splitDateTime(String s) {
    final cleaned = s.replaceAll(RegExp(r'\s+'), ' ').trim();
    if (s.contains("   ")) {
      final parts = s.split("   ");
      if (parts.length >= 2) return (parts[0].trim(), parts[1].trim());
    }
    final m = RegExp(r'(.+)\s(\d{1,2}:\d{2}\s[AP]M)$').firstMatch(cleaned);
    if (m != null) return (m.group(1)!.trim(), m.group(2)!.trim());
    return (cleaned, "");
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String rightTop;
  final String rightBottom;

  const _InfoRow({
    required this.label,
    required this.rightTop,
    required this.rightBottom,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 14),
          child: Row(
            children: [
              // SizedBox(
              //   width: 26,
              //   child: Icon(icon, size: 18, color: const Color(0xFF94A3B8)),
              // ),
              // const SizedBox(width: 8),
              Expanded(
                child: Text(
                  label,
                  style: const TextStyle(
                    color: Color(0xFF62748E),
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                  ),
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    rightTop,
                    style: const TextStyle(
                      color: Color(0xFF0F172A),
                      fontWeight: FontWeight.w500,
                      fontSize: 14,
                    ),
                  ),
                  if (rightBottom.isNotEmpty) ...[
                    const SizedBox(height: 3),
                    Text(
                      rightBottom,
                      style: const TextStyle(
                        color: Color(0xFF94A3B8),
                        fontWeight: FontWeight.w500,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),
        const Divider(height: 1, thickness: 1, color: Color(0xFFF1F5F9)),
      ],
    );
  }
}

class _PlainRow extends StatelessWidget {
  final String label;
  final String value;

  const _PlainRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 14),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  label,
                  style: const TextStyle(
                    color: Color(0xFF62748E),
                    fontWeight: FontWeight.w500,
                    fontSize: 13,
                  ),
                ),
              ),
              Text(
                value,
                style: const TextStyle(
                  color: Color(0xFF0F172A),
                  fontWeight: FontWeight.w500,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
        const Divider(height: 2, thickness: 1, color: Color(0xFFF1F5F9)),
      ],
    );
  }
}

class _StatusRow extends StatelessWidget {
  final String label;
  final String statusText;

  const _StatusRow({required this.label, required this.statusText});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 14),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  label,
                  style: const TextStyle(
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                  ),
                ),
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  Icon(Icons.check_circle, size: 18, color: Color(0xFF00A884)),
                  SizedBox(width: 8),
                  Text(
                    "Successful",
                    style: TextStyle(
                      color: Color(0xFF00A884),
                      fontWeight: FontWeight.w800,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const Divider(height: 1, thickness: 1, color: Color(0xFFF1F5F9)),
      ],
    );
  }
}
