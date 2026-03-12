// import 'package:flutter/material.dart';
// import 'package:zaza_app/DeliverSheet/view/deliver_sheet.dart';
// import 'package:zaza_app/ServicePage/Quik/GroceryPage/view/grocery_list_image.dart';
// import 'package:zaza_app/ServicePage/Quik/GroceryPage/view/grocery_sheet.dart';
// import 'package:zaza_app/ServicePage/Quik/view/type_grocery_page.dart';

// class QuikMainPage extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Column(
//         children: [
//           QuikHeader(
//             onBack: () => Navigator.pop(context),
//             onAddressTap: () {
//               showDeliveryAddressSheet(context);
//             },
//             onMenuTap: () {
//               // TODO: open drawer/menu
//             },
//           ),

//           // ✅ Content below (scroll)
//           Expanded(
//             child: ListView(
//               children: [
//                 // Categories, banners, products...
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

// class QuikHeader extends StatelessWidget {
//   final VoidCallback? onBack;
//   final VoidCallback? onAddressTap;
//   final VoidCallback? onMenuTap;

//   const QuikHeader({super.key, this.onBack, this.onAddressTap, this.onMenuTap});

//   @override
//   Widget build(BuildContext context) {
//     return SafeArea(
//       bottom: false,
//       child: Padding(
//         padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
//         child: Column(
//           children: [
//             // ✅ TOP ROW
//             Row(
//               children: [
//                 _IconBtn(icon: Icons.arrow_back_ios_new_rounded, onTap: onBack),

//                 const Spacer(),

//                 GestureDetector(
//                   onTap: onAddressTap,
//                   child: Column(
//                     children: [
//                       Row(
//                         children: const [
//                           Icon(
//                             Icons.flash_on_rounded,
//                             size: 18,
//                             color: Color(0xFF0C6B52),
//                           ),
//                           SizedBox(width: 4),
//                           Text(
//                             "14 mins",
//                             style: TextStyle(
//                               fontWeight: FontWeight.w900,
//                               fontSize: 15,
//                             ),
//                           ),
//                         ],
//                       ),
//                       const SizedBox(height: 2),
//                       Row(
//                         children: const [
//                           Text(
//                             "KMM",
//                             style: TextStyle(
//                               fontWeight: FontWeight.w900,
//                               fontSize: 14,
//                             ),
//                           ),
//                           SizedBox(width: 2),
//                           Icon(Icons.keyboard_arrow_down_rounded, size: 18),
//                         ],
//                       ),
//                     ],
//                   ),
//                 ),

//                 const Spacer(),

//                 _IconBtn(icon: Icons.menu_rounded, onTap: onMenuTap),
//               ],
//             ),

//             const SizedBox(height: 20),

//             // ✅ SECOND ROW (Grocery + Search)
//             Row(
//               children: [
//                 // ⭐ Grocery = хурд
//                 Flexible(
//                   flex: 4,
//                   child: _GroceryBtnSmall(
//                     onTap: () {
//                       showGroceryListDialog(
//                         context,
//                         onTypeList: () {
//                           // ✅ ҳоло танҳо navigation:
//                           Navigator.push(
//                             context,
//                             MaterialPageRoute(
//                               builder: (_) => const TypeGroceryListPage(),
//                             ),
//                           );
//                         },
//                         onTakePhoto: () =>
//                             GroceryListImageFlow.takePhotoAndUpload(context),
//                         onUploadPhoto: () =>
//                             GroceryListImageFlow.pickFromGalleryAndUpload(
//                               context,
//                             ),
//                       );
//                     },
//                   ),
//                 ),

//                 const SizedBox(width: 14),

//                 // ⭐ Search = калон
//                 const Expanded(flex: 8, child: _SearchBox()),
//               ],
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// class _IconBtn extends StatelessWidget {
//   final IconData icon;
//   final VoidCallback? onTap;

//   const _IconBtn({required this.icon, this.onTap});

//   @override
//   Widget build(BuildContext context) {
//     return Material(
//       color: Colors.transparent,
//       child: InkWell(
//         onTap: onTap,
//         borderRadius: BorderRadius.circular(14),
//         child: Container(
//           width: 44,
//           height: 44,
//           decoration: BoxDecoration(
//             borderRadius: BorderRadius.circular(14),
//             border: Border.all(color: Colors.black12),
//           ),
//           child: Icon(icon, size: 22),
//         ),
//       ),
//     );
//   }
// }

// class _GroceryBtnSmall extends StatelessWidget {
//   final VoidCallback? onTap;
//   const _GroceryBtnSmall({this.onTap});

//   @override
//   Widget build(BuildContext context) {
//     return Material(
//       color: Colors.transparent,
//       child: InkWell(
//         onTap: onTap,
//         borderRadius: BorderRadius.circular(12),
//         child: Container(
//           height: 42,
//           padding: const EdgeInsets.symmetric(horizontal: 10),
//           decoration: BoxDecoration(
//             borderRadius: BorderRadius.circular(12),
//             border: Border.all(color: Colors.black12),
//             color: Colors.white,
//           ),
//           child: Row(
//             mainAxisSize: MainAxisSize.min,
//             children: const [
//               Icon(Icons.edit_note_rounded, size: 20),
//               SizedBox(width: 6),
//               Text(
//                 "Grocery List",
//                 style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

// class _SearchBox extends StatelessWidget {
//   const _SearchBox();

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       height: 44,
//       padding: const EdgeInsets.symmetric(horizontal: 12),
//       decoration: BoxDecoration(
//         color: const Color(0xFFF3F4F6),
//         borderRadius: BorderRadius.circular(14),
//         border: Border.all(color: Colors.black12),
//       ),
//       child: Row(
//         children: const [
//           Icon(Icons.search, size: 20),
//           SizedBox(width: 8),
//           Expanded(
//             child: TextField(
//               decoration: InputDecoration(
//                 hintText: "Search for items or brands",
//                 border: InputBorder.none,
//                 isCollapsed: true,
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }
