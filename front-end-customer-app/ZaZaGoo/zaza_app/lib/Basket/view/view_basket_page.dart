// import 'package:flutter/material.dart';
// import 'package:zaza_app/Basket/view/basket_controller.dart';
// import 'package:zaza_app/Cart/view/add_to_cart_controller.dart';
// import 'package:zaza_app/DeliverSheet/view/deliver_sheet.dart';
// import 'package:zaza_app/Payment%20Summary/model/basketfees_model.dart';
// import 'package:zaza_app/Basket/Payment%20Method/view/payment_method_sheet.dart';
// import 'package:zaza_app/Payment%20Summary/view/payment_summary.dart';
// import 'package:zaza_app/Address/storage/adress_store.dart';

// class ViewBasketPage extends StatefulWidget {
//   final String shopName;
//   final String shopSubtitle;
//   final BasketController basket;

//   const ViewBasketPage({
//     super.key,
//     required this.shopName,
//     required this.basket,
//     this.shopSubtitle = "Al Quoz Industrial 3",
//   });

//   @override
//   State<ViewBasketPage> createState() => _ViewBasketPageState();
// }

// class _ViewBasketPageState extends State<ViewBasketPage> {
//   @override
//   void initState() {
//     super.initState();
//     AddressStore.I.addListener(_addrRefresh);
//   }

//   @override
//   void dispose() {
//     AddressStore.I.removeListener(_addrRefresh);
//     super.dispose();
//   }

//   void _addrRefresh() {
//     if (mounted) setState(() {});
//   }

//   Future<void> _openAddressSheet() async {
//     final picked = await showDeliveryAddressSheet(
//       context,
//       initialAddresses: AddressStore.I.items,
//       onChanged: (list) async {
//         AddressStore.I.setAll(list);
//       },
//     );

//     if (picked == null) return;

//     // бехатар: default кун
//     AddressStore.I.setDefault(picked);

//     if (mounted) setState(() {});
//   }

//   String _payment = "visa";

//   String get _paymentTitle {
//     switch (_payment) {
//       case "wallet":
//         return "Wallet";
//       case "cash":
//         return "Cash";
//       case "visa":
//       default:
//         return "VISA";
//     }
//   }

//   String get _paymentSubtitle {
//     switch (_payment) {
//       case "wallet":
//         return "Balance: 120.00 c"; // баъд аз store/API мегирем
//       case "cash":
//         return "Pay on delivery";
//       case "visa":
//       default:
//         return "KAMOLZODA MU...";
//     }
//   }

//   Future<void> _openPaymentSheet() async {
//     final picked = await showPaymentMethodSheet(context, initial: _payment);
//     if (picked == null) return;

//     setState(() => _payment = picked);
//   }

//   @override
//   Widget build(BuildContext context) {
//     const bottomBarReserve = 170.0;
//     const listGrey = Color(0xFFF3F4F6);
//     const green = Color(0xFF0C6B52);

//     final basket = widget.basket;

//     // ✅ address from store
//     final addr = AddressStore.I.selected;

//     // ✅ Title = Deliver to: label (ё Select address)
//     final addressTitle = addr == null
//         ? "Deliver to: Select address"
//         : "Deliver to: ${addr.label}";

//     // ✅ Subtitle = addressLine + note (агар note бошад)
//     final note = (addr?.note ?? "").trim();
//     final addressSubtitle = addr == null
//         ? "Tap to choose"
//         : note.isEmpty
//         ? addr.addressLine
//         : "${addr.addressLine}\n$note";

//     return Scaffold(
//       backgroundColor: Colors.white,
//       body: SafeArea(
//         bottom: false,
//         child: Stack(
//           children: [
//             Column(
//               children: [
//                 Padding(
//                   padding: const EdgeInsets.fromLTRB(16, 10, 16, 0),
//                   child: _TopHeader(
//                     title: widget.shopName,
//                     // subtitle: widget.shopSubtitle,
//                     onBack: () => Navigator.pop(context),
//                   ),
//                 ),

//                 Expanded(
//                   child: AnimatedBuilder(
//                     animation: basket,
//                     builder: (_, __) {
//                       final items = basket.items;

//                       if (items.isEmpty) {
//                         WidgetsBinding.instance.addPostFrameCallback((_) {
//                           if (Navigator.of(context).canPop()) {
//                             Navigator.of(context).pop();
//                           }
//                         });
//                         return const SizedBox.shrink();
//                       }

//                       final subtotal = items.fold<double>(
//                         0.0,
//                         (sum, it) => sum + (it.price * it.qty),
//                       );
//                       final fees = calcFees(
//                         subtotal: subtotal,
//                         deliveryFee: 10,
//                       );
//                       final total = subtotal + fees.totalExtras;

//                       return Container(
//                         color: listGrey,
//                         child: ListView(
//                           padding: const EdgeInsets.only(
//                             bottom: bottomBarReserve,
//                           ),
//                           children: [
//                             const SizedBox(height: 12),

//                             _SectionCard(
//                               child: Column(
//                                 crossAxisAlignment: CrossAxisAlignment.start,
//                                 children: [
//                                   Row(
//                                     mainAxisAlignment:
//                                         MainAxisAlignment.spaceBetween,
//                                     children: [
//                                       Column(
//                                         crossAxisAlignment:
//                                             CrossAxisAlignment.start,
//                                         children: [
//                                           const Text(
//                                             "Your Basket",
//                                             style: TextStyle(
//                                               fontSize: 22,
//                                               fontWeight: FontWeight.w600,
//                                             ),
//                                           ),
//                                           const SizedBox(height: 6),
//                                           Text(
//                                             "${basket.totalItems} item${basket.totalItems == 1 ? "" : "s"}",
//                                             style: TextStyle(
//                                               fontWeight: FontWeight.w600,
//                                               color: Colors.black.withOpacity(
//                                                 0.55,
//                                               ),
//                                             ),
//                                           ),
//                                         ],
//                                       ),

//                                       InkWell(
//                                         onTap: () => Navigator.pop(context),
//                                         borderRadius: BorderRadius.circular(10),
//                                         child: const Padding(
//                                           padding: EdgeInsets.symmetric(
//                                             horizontal: 8,
//                                             vertical: 6,
//                                           ),
//                                           child: Row(
//                                             mainAxisSize: MainAxisSize.min,
//                                             children: [
//                                               Icon(
//                                                 Icons.add,
//                                                 size: 18,
//                                                 color: green,
//                                               ),
//                                               SizedBox(width: 6),
//                                               Text(
//                                                 "Add more items",
//                                                 style: TextStyle(
//                                                   fontWeight: FontWeight.w600,
//                                                   color: green,
//                                                 ),
//                                               ),
//                                             ],
//                                           ),
//                                         ),
//                                       ),
//                                     ],
//                                   ),
//                                   const SizedBox(height: 12),
//                                   Divider(
//                                     height: 1,
//                                     thickness: 1,
//                                     color: Colors.black.withOpacity(0.1),
//                                   ),
//                                   const SizedBox(height: 14),

//                                   Column(
//                                     children: List.generate(items.length, (i) {
//                                       final it = items[i];
//                                       final isLast = i == items.length - 1;

//                                       return Column(
//                                         children: [
//                                           _BasketRow(
//                                             title: it.title,
//                                             price: it.price,
//                                             imageUrl: it.imageUrl,
//                                             control: AddControl(
//                                               basket: basket,
//                                               productId: it.id,
//                                               title: it.title,
//                                               price: it.price,
//                                               imageUrl: it.imageUrl,
//                                             ),
//                                           ),
//                                           if (!isLast) ...[
//                                             const SizedBox(height: 12),
//                                             Divider(
//                                               height: 1,
//                                               thickness: 1,
//                                               color: Colors.black.withOpacity(
//                                                 0.1,
//                                               ),
//                                             ),
//                                             const SizedBox(height: 12),
//                                           ],
//                                         ],
//                                       );
//                                     }),
//                                   ),
//                                 ],
//                               ),
//                             ),

//                             _SectionCard(child: PaymentSummary(basket: basket)),
//                             const SizedBox(height: 12),
//                           ],
//                         ),
//                       );
//                     },
//                   ),
//                 ),
//               ],
//             ),

//             // ✅ Bottom bar (title/subtitle dynamic)
//             AnimatedBuilder(
//               animation: basket,
//               builder: (_, __) {
//                 final items = basket.items;
//                 if (items.isEmpty) return const SizedBox.shrink();

//                 final subtotal = items.fold<double>(
//                   0.0,
//                   (sum, it) => sum + (it.price * it.qty),
//                 );
//                 final fees = calcFees(subtotal: subtotal, deliveryFee: 10);
//                 final total = subtotal + fees.totalExtras;

//                 return _CheckoutBottomBar(
//                   visible: basket.totalItems > 0,
//                   green: green,
//                   onAddressTap: _openAddressSheet,
//                   onPaymentTap: _openPaymentSheet,
//                   onPay: () {},
//                   addressTitle: addressTitle,
//                   addressSubtitle: addressSubtitle,
//                   paymentTitle: _paymentTitle,
//                   paymentSubtitle: _paymentSubtitle,
//                   payText: "Pay ${total.toStringAsFixed(2)} c",
//                 );
//               },
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }
// /* ---------- Card wrapper (full width by default) ---------- */

// class _SectionCard extends StatelessWidget {
//   final Widget child;
//   const _SectionCard({required this.child});

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       width: double.infinity,
//       margin: const EdgeInsets.symmetric(vertical: 10),
//       padding: const EdgeInsets.all(16),
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.circular(12),
//         border: Border.all(color: Colors.black.withOpacity(0.06)),
//       ),
//       child: child,
//     );
//   }
// }

// /* ---------- Header ---------- */

// class _TopHeader extends StatelessWidget {
//   final String title;
//   // final String subtitle;
//   final VoidCallback onBack;

//   const _TopHeader({
//     required this.title,
//     // required this.subtitle,
//     required this.onBack,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Column(
//       children: [
//         Row(
//           children: [
//             Container(
//               decoration: BoxDecoration(
//                 border: Border.all(color: Colors.black.withOpacity(0.18)),
//                 borderRadius: BorderRadius.circular(14),
//                 color: Colors.white,
//               ),
//               child: InkWell(
//                 onTap: onBack,
//                 borderRadius: BorderRadius.circular(14),
//                 child: const SizedBox(
//                   width: 42,
//                   height: 42,
//                   child: Center(
//                     child: Icon(Icons.arrow_back_ios_new_rounded, size: 18),
//                   ),
//                 ),
//               ),
//             ),
//             const SizedBox(width: 12),
//             Expanded(
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Text(
//                     title,
//                     maxLines: 1,
//                     overflow: TextOverflow.ellipsis,
//                     style: const TextStyle(
//                       fontSize: 18,
//                       fontWeight: FontWeight.w700,
//                     ),
//                   ),

//                 ],
//               ),
//             ),
//           ],
//         ),
//         const SizedBox(height: 10),
//       ],
//     );
//   }
// }

// /* ---------- Basket row (like screenshot) ---------- */

// class _BasketRow extends StatelessWidget {
//   final String title;
//   final double price;
//   final String? imageUrl;
//   final Widget control;

//   const _BasketRow({
//     required this.title,
//     required this.price,
//     required this.control,
//     this.imageUrl,
//   });

//   @override
//   Widget build(BuildContext context) {
//     const green = Color(0xFF0C6B52);

//     return SizedBox(
//       width: double.infinity,
//       child: Row(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           ClipRRect(
//             borderRadius: BorderRadius.circular(12),
//             child: Container(
//               width: 56,
//               height: 56,
//               color: Colors.black.withOpacity(0.04),
//               child: imageUrl == null
//                   ? Icon(Icons.image, color: green.withOpacity(0.6))
//                   : Image.network(
//                       imageUrl!,
//                       fit: BoxFit.cover,
//                       errorBuilder: (_, __, ___) => Icon(
//                         Icons.image_not_supported_outlined,
//                         color: Colors.black.withOpacity(0.35),
//                       ),
//                     ),
//             ),
//           ),
//           const SizedBox(width: 12),

//           Expanded(
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Text(
//                   title,
//                   maxLines: 2,
//                   overflow: TextOverflow.ellipsis,
//                   style: const TextStyle(
//                     fontWeight: FontWeight.w600,
//                     fontSize: 16,
//                     height: 1.15,
//                   ),
//                 ),
//                 const SizedBox(height: 10),
//                 Row(
//                   mainAxisSize: MainAxisSize.min,
//                   children: const [
//                     Icon(Icons.edit_outlined, size: 18, color: green),
//                     SizedBox(width: 6),
//                     Text(
//                       "Edit",
//                       style: TextStyle(
//                         fontWeight: FontWeight.w800,
//                         color: green,
//                       ),
//                     ),
//                   ],
//                 ),
//               ],
//             ),
//           ),

//           const SizedBox(width: 12),

//           Column(
//             crossAxisAlignment: CrossAxisAlignment.end,
//             children: [
//               Text(
//                 "${price.toStringAsFixed(2)} c",
//                 style: const TextStyle(
//                   fontWeight: FontWeight.w700,
//                   fontSize: 16,
//                 ),
//               ),
//               const SizedBox(height: 10),
//               control,
//             ],
//           ),
//         ],
//       ),
//     );
//   }
// }

// /* ---------- Bottom bar ---------- */

// class _CheckoutBottomBar extends StatelessWidget {
//   final bool visible;

//   final VoidCallback onAddressTap;
//   final VoidCallback onPaymentTap;
//   final VoidCallback onPay;

//   final String addressTitle;
//   final String addressSubtitle;

//   final String paymentTitle;
//   final String paymentSubtitle;

//   final String payText;

//   final Color green;

//   const _CheckoutBottomBar({
//     required this.visible,
//     required this.onAddressTap,
//     required this.onPaymentTap,
//     required this.onPay,
//     required this.addressTitle,
//     required this.addressSubtitle,
//     required this.paymentTitle,
//     required this.paymentSubtitle,
//     required this.payText,
//     required this.green,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return IgnorePointer(
//       ignoring: !visible,
//       child: AnimatedSlide(
//         duration: const Duration(milliseconds: 240),
//         curve: Curves.easeOut,
//         offset: visible ? Offset.zero : const Offset(0, 1.2),
//         child: AnimatedOpacity(
//           duration: const Duration(milliseconds: 180),
//           opacity: visible ? 1 : 0,
//           child: Align(
//             alignment: Alignment.bottomCenter,
//             child: Container(
//               padding: const EdgeInsets.fromLTRB(16, 12, 16, 40),
//               decoration: BoxDecoration(
//                 color: Colors.white,
//                 border: Border(
//                   top: BorderSide(
//                     color: Colors.black.withOpacity(0.08),
//                     width: 1,
//                   ),
//                 ),
//               ),
//               child: Column(
//                 mainAxisSize: MainAxisSize.min,
//                 children: [
//                   SizedBox(
//                     width: double.infinity,
//                     child: _AddressTile(
//                       title: addressTitle,
//                       subtitle: addressSubtitle,
//                       onTap: onAddressTap,
//                     ),
//                   ),
//                   const SizedBox(height: 12),
//                   Row(
//                     children: [
//                       Expanded(
//                         child: _PaymentTile(
//                           title: paymentTitle,
//                           subtitle: paymentSubtitle,
//                           onTap: onPaymentTap,
//                         ),
//                       ),
//                       const SizedBox(width: 12),
//                       SizedBox(
//                         width: 175,
//                         height: 56,
//                         child: Material(
//                           color: green,
//                           borderRadius: BorderRadius.circular(18),
//                           elevation: 10,
//                           shadowColor: Colors.black.withOpacity(0.18),
//                           child: InkWell(
//                             onTap: onPay,
//                             borderRadius: BorderRadius.circular(18),
//                             child: Center(
//                               child: Text(
//                                 payText,
//                                 maxLines: 1,
//                                 overflow: TextOverflow.ellipsis,
//                                 style: const TextStyle(
//                                   color: Color(0xFF19E38A),
//                                   fontWeight: FontWeight.w700,
//                                   fontSize: 18,
//                                 ),
//                               ),
//                             ),
//                           ),
//                         ),
//                       ),
//                       SizedBox(height: 20),
//                     ],
//                   ),
//                 ],
//               ),
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }

// class _AddressTile extends StatelessWidget {
//   final String title;
//   final String subtitle;
//   final VoidCallback onTap;

//   const _AddressTile({
//     required this.title,
//     required this.subtitle,
//     required this.onTap,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Material(
//       color: Colors.white,
//       borderRadius: BorderRadius.circular(16),
//       child: InkWell(
//         onTap: onTap,
//         borderRadius: BorderRadius.circular(16),
//         child: Padding(
//           padding: const EdgeInsets.fromLTRB(12, 10, 10, 10),
//           child: Row(
//             children: [
//               Container(
//                 width: 44,
//                 height: 44,
//                 decoration: BoxDecoration(
//                   color: Colors.white,
//                   borderRadius: BorderRadius.circular(14),
//                   border: Border.all(color: Colors.black.withOpacity(0.08)),
//                 ),
//                 child: Icon(
//                   Icons.delivery_dining_rounded,
//                   color: Colors.black.withOpacity(0.70),
//                 ),
//               ),
//               const SizedBox(width: 15),
//               Expanded(
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Text(
//                       title,
//                       style: const TextStyle(
//                         fontWeight: FontWeight.w900,
//                         fontSize: 14,
//                       ),
//                     ),
//                     const SizedBox(height: 2),
//                     Text(
//                       subtitle,
//                       maxLines: 2,
//                       overflow: TextOverflow.ellipsis,
//                       style: TextStyle(
//                         fontWeight: FontWeight.w700,
//                         color: Colors.black.withOpacity(0.55),
//                         height: 1.15,
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//               Icon(
//                 Icons.arrow_forward_ios_rounded,
//                 size: 18,
//                 color: Colors.black,
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

// class _PaymentTile extends StatelessWidget {
//   final String image;
//   final String subtitle;
//   final VoidCallback onTap;

//   const _PaymentTile({
//     required this.image,
//     required this.subtitle,
//     required this.onTap,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Material(
//       color: Colors.white,
//       borderRadius: BorderRadius.circular(16),
//       child: InkWell(
//         onTap: onTap,
//         borderRadius: BorderRadius.circular(16),
//         child: Padding(
//           padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
//           child: Row(
//             children: [
//               Container(
//                 width: 44,
//                 height: 32,
//                 decoration: BoxDecoration(
//                   color: Colors.white,
//                   borderRadius: BorderRadius.circular(10),
//                   border: Border.all(
//                     color: Colors.black.withOpacity(0.08),
//                   ),
//                 ),
//                 child: ClipRRect(
//                   borderRadius: BorderRadius.circular(10),
//                   child: Image.asset(
//                     image,
//                     width: double.infinity,
//                     height: double.infinity,
//                     fit: BoxFit.contain,
//                   ),
//                 ),
//               ),
//               const SizedBox(width: 10),
//               Expanded(
//                 child: Text(
//                   subtitle,
//                   maxLines: 1,
//                   overflow: TextOverflow.ellipsis,
//                   style: const TextStyle(
//                     fontWeight: FontWeight.w600,
//                     fontSize: 14,
//                   ),
//                 ),
//               ),
//               const Icon(
//                 Icons.keyboard_arrow_down_rounded,
//                 size: 24,
//                 color: Colors.black,
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

// // class _PaymentTile extends StatelessWidget {
// //   final String title;
// //   final String subtitle;
// //   final VoidCallback onTap;

// //   const _PaymentTile({
// //     required this.title,
// //     required this.subtitle,
// //     required this.onTap,
// //   });

// //   @override
// //   Widget build(BuildContext context) {
// //     return Material(
// //       color: Colors.white,
// //       borderRadius: BorderRadius.circular(16),
// //       child: InkWell(
// //         onTap: onTap,
// //         borderRadius: BorderRadius.circular(16),
// //         child: Padding(
// //           padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
// //           child: Row(
// //             children: [
// //               Container(
// //                 width: 44,
// //                 height: 32,
// //                 alignment: Alignment.center,
// //                 decoration: BoxDecoration(
// //                   color: Colors.white,
// //                   borderRadius: BorderRadius.circular(10),
// //                   border: Border.all(color: Colors.black.withOpacity(0.08)),
// //                 ),
// //                 child: Text(
// //                   title,
// //                   style: const TextStyle(
// //                     fontWeight: FontWeight.w800,
// //                     fontSize: 12,
// //                   ),
// //                 ),
// //               ),
// //               const SizedBox(width: 10),
// //               Expanded(
// //                 child: Text(
// //                   subtitle,
// //                   maxLines: 1,
// //                   overflow: TextOverflow.ellipsis,
// //                   style: const TextStyle(
// //                     fontWeight: FontWeight.w600,
// //                     fontSize: 14,
// //                   ),
// //                 ),
// //               ),
// //               Icon(
// //                 Icons.keyboard_arrow_down_rounded,
// //                 size: 24,
// //                 color: Colors.black,
// //               ),
// //             ],
// //           ),
// //         ),
// //       ),
// //     );
// //   }
// // }

import 'package:flutter/material.dart';
import 'package:zaza_app/Basket/view/basket_controller.dart';
import 'package:zaza_app/Cart/view/add_to_cart_controller.dart';
import 'package:zaza_app/DeliverSheet/view/deliver_sheet.dart';
import 'package:zaza_app/Payment%20Summary/model/basketfees_model.dart';
import 'package:zaza_app/Basket/Payment%20Method/view/payment_method_sheet.dart';
import 'package:zaza_app/Payment%20Summary/view/payment_summary.dart';
import 'package:zaza_app/Address/storage/adress_store.dart';

class ViewBasketPage extends StatefulWidget {
  final String shopName;
  final String shopSubtitle;
  final BasketController basket;

  const ViewBasketPage({
    super.key,
    required this.shopName,
    required this.basket,
    this.shopSubtitle = "Al Quoz Industrial 3",
  });

  @override
  State<ViewBasketPage> createState() => _ViewBasketPageState();
}

class _ViewBasketPageState extends State<ViewBasketPage> {
  @override
  void initState() {
    super.initState();
    AddressStore.I.addListener(_addrRefresh);
  }

  @override
  void dispose() {
    AddressStore.I.removeListener(_addrRefresh);
    super.dispose();
  }

  void _addrRefresh() {
    if (mounted) setState(() {});
  }

  Future<void> _openAddressSheet() async {
    final picked = await showDeliveryAddressSheet(
      context,
      initialAddresses: AddressStore.I.items,
      onChanged: (list) async {
        AddressStore.I.setAll(list);
      },
    );

    if (picked == null) return;

    AddressStore.I.setDefault(picked);

    if (mounted) setState(() {});
  }

  String _payment = "wallet";

  String get _paymentImage {
    switch (_payment) {
      case "cash":
        return "assets/icons/cash.png";
      case "wallet":
      case "visa":
      default:
        return "assets/icons/wallet.png";
    }
  }

  String get _paymentSubtitle {
    switch (_payment) {
      case "wallet":
        return "Wallet";
      case "cash":
        return "Cash";
      case "visa":
      default:
        return "Wallet";
    }
  }

  Future<void> _openPaymentSheet() async {
    final picked = await showPaymentMethodSheet(context, initial: _payment);
    if (picked == null) return;

    setState(() => _payment = picked);
  }

  @override
  Widget build(BuildContext context) {
    const bottomBarReserve = 170.0;
    const listGrey = Color(0xFFF3F4F6);
    const green = Color(0xFF0C6B52);

    final basket = widget.basket;
    final addr = AddressStore.I.selected;

    final addressTitle = addr == null
        ? "Deliver to: Select address"
        : "Deliver to: ${addr.label}";

    final note = (addr?.note ?? "").trim();
    final addressSubtitle = addr == null
        ? "Tap to choose"
        : note.isEmpty
        ? addr.addressLine
        : "${addr.addressLine}\n$note";

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        bottom: false,
        child: Stack(
          children: [
            Column(
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 10, 16, 0),
                  child: _TopHeader(
                    title: widget.shopName,
                    onBack: () => Navigator.pop(context),
                  ),
                ),
                Expanded(
                  child: AnimatedBuilder(
                    animation: basket,
                    builder: (_, __) {
                      final items = basket.items;

                      if (items.isEmpty) {
                        WidgetsBinding.instance.addPostFrameCallback((_) {
                          if (Navigator.of(context).canPop()) {
                            Navigator.of(context).pop();
                          }
                        });
                        return const SizedBox.shrink();
                      }

                      final subtotal = items.fold<double>(
                        0.0,
                        (sum, it) => sum + (it.price * it.qty),
                      );

                      return Container(
                        color: listGrey,
                        child: ListView(
                          padding: const EdgeInsets.only(
                            bottom: bottomBarReserve,
                          ),
                          children: [
                            const SizedBox(height: 12),
                            _SectionCard(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          const Text(
                                            "Your Basket",
                                            style: TextStyle(
                                              fontSize: 22,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                          const SizedBox(height: 6),
                                          Text(
                                            "${basket.totalItems} item${basket.totalItems == 1 ? "" : "s"}",
                                            style: TextStyle(
                                              fontWeight: FontWeight.w600,
                                              color: Colors.black54,
                                            ),
                                          ),
                                        ],
                                      ),
                                      InkWell(
                                        onTap: () => Navigator.pop(context),
                                        borderRadius: BorderRadius.circular(10),
                                        child: const Padding(
                                          padding: EdgeInsets.symmetric(
                                            horizontal: 8,
                                            vertical: 6,
                                          ),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Icon(
                                                Icons.add,
                                                size: 18,
                                                color: green,
                                              ),
                                              SizedBox(width: 6),
                                              Text(
                                                "Add more items",
                                                style: TextStyle(
                                                  fontWeight: FontWeight.w600,
                                                  color: green,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Divider(
                                    height: 1,
                                    thickness: 1,
                                    color: Colors.black.withOpacity(0.1),
                                  ),
                                  const SizedBox(height: 14),
                                  Column(
                                    children: List.generate(items.length, (i) {
                                      final it = items[i];
                                      final isLast = i == items.length - 1;

                                      return Column(
                                        children: [
                                          _BasketRow(
                                            title: it.title,
                                            price: it.price,
                                            imageUrl: it.imageUrl,
                                            control: AddControl(
                                              basket: basket,
                                              productId: it.id,
                                              title: it.title,
                                              price: it.price,
                                              imageUrl: it.imageUrl,
                                            ),
                                          ),
                                          if (!isLast) ...[
                                            const SizedBox(height: 12),
                                            Divider(
                                              height: 1,
                                              thickness: 1,
                                              color: Colors.black.withOpacity(
                                                0.1,
                                              ),
                                            ),
                                            const SizedBox(height: 12),
                                          ],
                                        ],
                                      );
                                    }),
                                  ),
                                ],
                              ),
                            ),
                            _SectionCard(child: PaymentSummary(basket: basket)),
                            const SizedBox(height: 12),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
            AnimatedBuilder(
              animation: basket,
              builder: (_, __) {
                final items = basket.items;
                if (items.isEmpty) return const SizedBox.shrink();

                final subtotal = items.fold<double>(
                  0.0,
                  (sum, it) => sum + (it.price * it.qty),
                );
                final fees = calcFees(subtotal: subtotal, deliveryFee: 10);
                final total = subtotal + fees.totalExtras;

                return _CheckoutBottomBar(
                  visible: basket.totalItems > 0,
                  green: green,
                  onAddressTap: _openAddressSheet,
                  onPaymentTap: _openPaymentSheet,
                  onPay: () {},
                  addressTitle: addressTitle,
                  addressSubtitle: addressSubtitle,
                  paymentImage: _paymentImage,
                  paymentSubtitle: _paymentSubtitle,
                  payText: "Pay ${total.toStringAsFixed(2)} c",
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final Widget child;

  const _SectionCard({required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(vertical: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.black.withOpacity(0.06)),
      ),
      child: child,
    );
  }
}

class _TopHeader extends StatelessWidget {
  final String title;
  final VoidCallback onBack;

  const _TopHeader({required this.title, required this.onBack});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.black.withOpacity(0.18)),
                borderRadius: BorderRadius.circular(14),
                color: Colors.white,
              ),
              child: InkWell(
                onTap: onBack,
                borderRadius: BorderRadius.circular(14),
                child: const SizedBox(
                  width: 42,
                  height: 42,
                  child: Center(
                    child: Icon(Icons.arrow_back_ios_new_rounded, size: 18),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
      ],
    );
  }
}

class _BasketRow extends StatelessWidget {
  final String title;
  final double price;
  final String? imageUrl;
  final Widget control;

  const _BasketRow({
    required this.title,
    required this.price,
    required this.control,
    this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    const green = Color(0xFF0C6B52);

    return SizedBox(
      width: double.infinity,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Container(
              width: 56,
              height: 56,
              color: Colors.black.withOpacity(0.04),
              child: imageUrl == null
                  ? Icon(Icons.image, color: green.withOpacity(0.6))
                  : Image.network(
                      imageUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Icon(
                        Icons.image_not_supported_outlined,
                        color: Colors.black.withOpacity(0.35),
                      ),
                    ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                    height: 1.15,
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    Icon(Icons.edit_outlined, size: 18, color: green),
                    SizedBox(width: 6),
                    Text(
                      "Edit",
                      style: TextStyle(
                        fontWeight: FontWeight.w800,
                        color: green,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                "${price.toStringAsFixed(2)} c",
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 10),
              control,
            ],
          ),
        ],
      ),
    );
  }
}

class _CheckoutBottomBar extends StatelessWidget {
  final bool visible;
  final VoidCallback onAddressTap;
  final VoidCallback onPaymentTap;
  final VoidCallback onPay;
  final String addressTitle;
  final String addressSubtitle;
  final String paymentImage;
  final String paymentSubtitle;
  final String payText;
  final Color green;

  const _CheckoutBottomBar({
    required this.visible,
    required this.onAddressTap,
    required this.onPaymentTap,
    required this.onPay,
    required this.addressTitle,
    required this.addressSubtitle,
    required this.paymentImage,
    required this.paymentSubtitle,
    required this.payText,
    required this.green,
  });

  @override
  Widget build(BuildContext context) {
    final bottomSafe = MediaQuery.of(context).padding.bottom;

    return IgnorePointer(
      ignoring: !visible,
      child: AnimatedSlide(
        duration: const Duration(milliseconds: 240),
        curve: Curves.easeOut,
        offset: visible ? Offset.zero : const Offset(0, 1.2),
        child: AnimatedOpacity(
          duration: const Duration(milliseconds: 180),
          opacity: visible ? 1 : 0,
          child: Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              padding: EdgeInsets.fromLTRB(16, 12, 16, bottomSafe + 16),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border(
                  top: BorderSide(
                    color: Colors.black.withOpacity(0.08),
                    width: 1,
                  ),
                ),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SizedBox(
                    width: double.infinity,
                    child: _AddressTile(
                      title: addressTitle,
                      subtitle: addressSubtitle,
                      onTap: onAddressTap,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _PaymentTile(
                          image: paymentImage,
                          subtitle: paymentSubtitle,
                          onTap: onPaymentTap,
                        ),
                      ),
                      const SizedBox(width: 12),
                      SizedBox(
                        width: 175,
                        height: 56,
                        child: Material(
                          color: green,
                          borderRadius: BorderRadius.circular(18),
                          elevation: 10,
                          shadowColor: Colors.black.withOpacity(0.18),
                          child: InkWell(
                            onTap: onPay,
                            borderRadius: BorderRadius.circular(18),
                            child: Center(
                              child: Text(
                                payText,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  color: Color(0xFF19E38A),
                                  fontWeight: FontWeight.w700,
                                  fontSize: 18,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _AddressTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _AddressTile({
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(12, 10, 10, 10),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.black.withOpacity(0.08)),
                ),
                child: Icon(
                  Icons.delivery_dining_rounded,
                  color: Colors.black.withOpacity(0.70),
                ),
              ),
              const SizedBox(width: 15),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontWeight: FontWeight.w900,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: Colors.black.withOpacity(0.55),
                        height: 1.15,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.arrow_forward_ios_rounded,
                size: 18,
                color: Colors.black,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PaymentTile extends StatelessWidget {
  final String image;
  final String subtitle;
  final VoidCallback onTap;

  const _PaymentTile({
    required this.image,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
          child: Row(
            children: [
              Container(
                width: 64,
                height: 42,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  // border: Border.all(color: Colors.black.withOpacity(0.08)),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Image.asset(
                    image,
                    width: double.infinity,
                    height: double.infinity,
                    fit: BoxFit.contain,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  subtitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
              ),
              const Icon(
                Icons.keyboard_arrow_down_rounded,
                size: 24,
                color: Colors.black,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
