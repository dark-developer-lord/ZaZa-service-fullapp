// import 'package:flutter/material.dart';

// class BoxPage extends StatelessWidget {
//   const BoxPage({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: const Color(0xFFFFFFFF),
//       appBar: PreferredSize(
//         preferredSize: const Size.fromHeight(92),
//         child: SafeArea(
//           bottom: false,
//           child: Padding(
//             padding: const EdgeInsets.fromLTRB(16, 10, 16, 12),
//             child: Row(
//               children: [
//                 _SquareIconButton(
//                   icon: Icons.arrow_back_ios_new_rounded,
//                   onTap: () => Navigator.pop(context),
//                 ),
//                 const Spacer(),
//                 // ✅ Center "Box" (logo text)
//                 Row(
//                   mainAxisSize: MainAxisSize.min,
//                   children: const [
//                     _BoxLogo(),
//                     SizedBox(width: 8),
//                     Text(
//                       "Box",
//                       style: TextStyle(
//                         fontSize: 20,
//                         fontWeight: FontWeight.w800,
//                         letterSpacing: 0.2,
//                       ),
//                     ),
//                   ],
//                 ),
//                 const Spacer(),
//                 _SquareIconButton(
//                   icon: Icons.menu_rounded,
//                   onTap: () {
//                     // TODO: open drawer / menu
//                   },
//                   background: const Color(0xFF0C3A2E), // dark green
//                   iconColor: Colors.white,
//                 ),
//               ],
//             ),
//           ),
//         ),
//       ),
//       body: Padding(
//         padding: const EdgeInsets.fromLTRB(16, 14, 16, 16),
//         child: Row(
//           children: [
//             Expanded(
//               child: _BoxOptionCard(
//                 title: "Box Delivery",
//                 subtitle: "Send an item from point A to B",
//                 // TODO: asset image
//                 imageAsset: "assets/images/box_delivery.png",
//                 onTap: () {
//                   // TODO: open flow A -> B
//                 },
//               ),
//             ),
//             const SizedBox(width: 12),
//             Expanded(
//               child: _BoxOptionCard(
//                 // расм монанд: дар карта матн нест (ё метавонед гузоред)
//                 title: "",
//                 subtitle: "",
//                 imageAsset: "assets/images/box_store.png",
//                 onTap: () {
//                   // TODO: open flow store -> B
//                 },
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// class _BoxOptionCard extends StatelessWidget {
//   final String title;
//   final String subtitle;
//   final String imageAsset;
//   final VoidCallback onTap;

//   const _BoxOptionCard({
//     required this.title,
//     required this.subtitle,
//     required this.imageAsset,
//     required this.onTap,
//   });

//   @override
//   Widget build(BuildContext context) {
//     final hasText = title.trim().isNotEmpty || subtitle.trim().isNotEmpty;

//     return InkWell(
//       borderRadius: BorderRadius.circular(16),
//       onTap: onTap,
//       child: Ink(
//         decoration: BoxDecoration(
//           color: const Color(0xFFF7FAFF), // light blue/gray like screenshot
//           borderRadius: BorderRadius.circular(16),
//           border: Border.all(color: const Color(0xFFE8EEF6), width: 1),
//         ),
//         child: Padding(
//           padding: const EdgeInsets.all(14),
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             children: [
//               // ✅ Image area
//               Expanded(
//                 child: Center(
//                   child: Image.asset(imageAsset, fit: BoxFit.contain),
//                 ),
//               ),
//               if (hasText) ...[
//                 const SizedBox(height: 10),
//                 Text(
//                   title,
//                   maxLines: 1,
//                   overflow: TextOverflow.ellipsis,
//                   style: const TextStyle(
//                     fontSize: 16,
//                     fontWeight: FontWeight.w800,
//                     color: Color(0xFF0F172A),
//                   ),
//                 ),
//                 const SizedBox(height: 4),
//                 Text(
//                   subtitle,
//                   maxLines: 2,
//                   overflow: TextOverflow.ellipsis,
//                   style: const TextStyle(
//                     fontSize: 12.5,
//                     height: 1.3,
//                     color: Color(0xFF64748B),
//                     fontWeight: FontWeight.w600,
//                   ),
//                 ),
//               ],
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

// class _SquareIconButton extends StatelessWidget {
//   final IconData icon;
//   final VoidCallback onTap;
//   final Color background;
//   final Color iconColor;

//   const _SquareIconButton({
//     required this.icon,
//     required this.onTap,
//     this.background = const Color(0xFFFFFFFF),
//     this.iconColor = const Color(0xFF0F172A),
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Material(
//       color: background,
//       borderRadius: BorderRadius.circular(14),
//       child: InkWell(
//         borderRadius: BorderRadius.circular(14),
//         onTap: onTap,
//         child: Container(
//           width: 44,
//           height: 44,
//           decoration: BoxDecoration(
//             borderRadius: BorderRadius.circular(14),
//             border: background == Colors.white
//                 ? Border.all(color: const Color(0xFFE5E7EB))
//                 : null,
//           ),
//           child: Icon(icon, color: iconColor, size: 20),
//         ),
//       ),
//     );
//   }
// }

// class _BoxLogo extends StatelessWidget {
//   const _BoxLogo();

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       width: 26,
//       height: 26,
//       decoration: BoxDecoration(
//         color: const Color(0xFF0C3A2E),
//         borderRadius: BorderRadius.circular(8),
//       ),
//       child: const Center(
//         child: Icon(
//           Icons.sentiment_satisfied_alt_rounded,
//           color: Colors.white,
//           size: 18,
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:zaza_app/ServicePage/Box/view/box_delivery_page.dart';

class BoxPage extends StatelessWidget {
  const BoxPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFFFFF),

      body: Column(
        children: [
          TopHeader(
            title: "Box",
            leftIcon: Icons.arrow_back_ios_new_rounded,
            onLeftTap: () => Navigator.pop(context),
            rightIcon: Icons.menu_rounded,
            onRightTap: () {},
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 16),
              children: [
                Row(
                  children: [
                    Expanded(
                      child: _BoxOptionCard(
                        title: "Box Delivery",
                        subtitle: "Send an item from\n point A to B",
                        bigIcon: Icons.location_on_rounded,
                        smallIcon: Icons.inventory_2_rounded,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => BoxDeliveryPage(),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _BoxOptionCard(
                        title: "Store Pickup",
                        subtitle: "Bring items from store\n to point B",
                        bigIcon: Icons.storefront_rounded,
                        smallIcon: Icons.local_shipping_rounded,
                        onTap: () {
                          // TODO: open Store->B flow
                        },
                      ),
                    ),
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

//TOPHeader

class TopHeader extends StatelessWidget {
  final String title;

  final IconData leftIcon;
  final VoidCallback onLeftTap;

  final IconData? rightIcon;
  final VoidCallback? onRightTap;

  final String? rightText;

  const TopHeader({
    super.key,
    required this.title,
    required this.leftIcon,
    required this.onLeftTap,
    this.rightIcon,
    this.onRightTap,
    this.rightText,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      bottom: false,
      child: Container(
        padding: const EdgeInsets.fromLTRB(14, 10, 14, 10),
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(bottom: BorderSide(color: Color(0xFFE5E7EB))),
        ),
        child: Row(
          children: [
            _HeaderButton(icon: leftIcon, onTap: onLeftTap),

            const SizedBox(width: 10),

            Expanded(
              child: Align(
                alignment: AlignmentGeometry.center,
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),

            if (rightText != null)
              OutlinedButton.icon(
                onPressed: onRightTap,
                icon: const Icon(Icons.headset_mic_rounded, size: 18),
                label: Text(
                  rightText!,
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF111827),
                  side: const BorderSide(color: Color(0xFFE5E7EB)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                ),
              )
            else if (rightIcon != null)
              _HeaderButton(
                icon: rightIcon!,
                onTap: onRightTap ?? () {},
                dark: true,
              ),
          ],
        ),
      ),
    );
  }
}

class _HeaderButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  final bool dark;

  const _HeaderButton({
    required this.icon,
    required this.onTap,
    this.dark = false,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: dark ? const Color(0xFF0C3A2E) : Colors.white,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: dark ? null : Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: Icon(
            icon,
            size: 20,
            color: dark ? Colors.white : const Color(0xFF111827),
          ),
        ),
      ),
    );
  }
}

// CARD
class _BoxOptionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData bigIcon;
  final IconData smallIcon;
  final VoidCallback onTap;

  const _BoxOptionCard({
    required this.title,
    required this.subtitle,
    required this.bigIcon,
    required this.smallIcon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: onTap,

      child: Container(
        height: 200, // ✅ FIXED HEIGHT (мисли расм)

        padding: const EdgeInsets.all(14),

        decoration: BoxDecoration(
          color: const Color(0xFFF7FAFF),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFE8EEF6)),
        ),

        child: Column(
          children: [
            // ===== ICON AREA =====
            SizedBox(
              height: 100, // ✅ bounded height
              child: Center(
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      width: 90,
                      height: 90,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: const Color(0xFFE8EEF6)),
                      ),
                    ),

                    Positioned(
                      left: 20,
                      child: _MiniBadgeIcon(icon: smallIcon),
                    ),

                    Positioned(
                      top: 12,
                      right: 18,
                      child: Icon(
                        bigIcon,
                        size: 26,
                        color: const Color(0xFF16A34A),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 8),

            // ===== TEXT =====
            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Color(0xFF0F172A),
              ),
            ),

            const SizedBox(height: 4),

            Text(
              subtitle,
              // maxLines: 2,
              textAlign: TextAlign.center,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 12,
                height: 1.3,
                color: Color(0xFF64748B),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MiniBadgeIcon extends StatelessWidget {
  final IconData icon;

  const _MiniBadgeIcon({required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE8EEF6)),
      ),
      child: Icon(icon, size: 22, color: const Color(0xFF111827)),
    );
  }
}

class _SquareIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  final Color background;
  final Color iconColor;

  const _SquareIconButton({
    required this.icon,
    required this.onTap,
    this.background = const Color(0xFFFFFFFF),
    this.iconColor = const Color(0xFF0F172A),
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: background,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: background == Colors.white
                ? Border.all(color: const Color(0xFFE5E7EB))
                : null,
          ),
          child: Icon(icon, color: iconColor, size: 20),
        ),
      ),
    );
  }
}

class _BoxLogo extends StatelessWidget {
  const _BoxLogo();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 26,
      height: 26,
      decoration: BoxDecoration(
        color: const Color(0xFF0C3A2E),
        borderRadius: BorderRadius.circular(8),
      ),
      child: const Center(
        child: Icon(
          Icons.sentiment_satisfied_alt_rounded,
          color: Colors.white,
          size: 18,
        ),
      ),
    );
  }
}
