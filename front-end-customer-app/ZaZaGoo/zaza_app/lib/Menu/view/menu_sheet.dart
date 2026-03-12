import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:zaza_app/Activities/view/activities_page.dart';
import 'package:zaza_app/Help%20Center/view/help_center_page.dart';
import 'package:zaza_app/Home/View/home_page.dart';
import 'package:zaza_app/Profile/view/profile_page.dart';

class MenuSheet {
  static Future<void> show(BuildContext context) async {
    await showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: "menu",
      barrierColor: Colors.black.withOpacity(0.10),
      transitionDuration: const Duration(milliseconds: 260),
      pageBuilder: (ctx, __, ___) => const _TopDraggableMenu(),
      transitionBuilder: (_, anim, __, child) {
        final curved = CurvedAnimation(
          parent: anim,
          curve: Curves.easeOutCubic,
        );
        return FadeTransition(
          opacity: curved,
          child: SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(0, -0.15),
              end: Offset.zero,
            ).animate(curved),
            child: child,
          ),
        );
      },
    );
  }
}

class _TopDraggableMenu extends StatefulWidget {
  const _TopDraggableMenu();

  @override
  State<_TopDraggableMenu> createState() => _TopDraggableMenuState();
}

class _TopDraggableMenuState extends State<_TopDraggableMenu> {
  // ✅ only UP
  static const double minTop = -340; // боло (максимум)
  static const double maxTop = 0; // поён (ҷои аслӣ)
  static const double gain = 1.6; // ✅ осонтар боло равад (1.4–2.0)

  double topOffset = 0;

  // ✅ snap animation only on release
  void _animateTo(double target) {
    if (!mounted) return;
    setState(() => topOffset = target);
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // ✅ blur background
        BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
          child: Container(color: Colors.transparent),
        ),

        // ✅ NO AnimatedPositioned -> smoother drag
        Positioned(
          left: 0,
          right: 0,
          top: topOffset,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onVerticalDragUpdate: (d) {
              setState(() {
                topOffset = (topOffset + d.delta.dy * gain).clamp(
                  minTop,
                  maxTop,
                );
              });
            },
            onVerticalDragEnd: (_) {
              final reachedTop = topOffset <= minTop + 18;

              if (reachedTop) {
                Navigator.of(context).pop(); // ✅ close
                return;
              }

              // ✅ snap back to normal
              _animateTo(0);
            },
            child: _MenuCard(onClose: () => Navigator.pop(context)),
          ),
        ),
      ],
    );
  }
}

class _MenuCard extends StatelessWidget {
  final VoidCallback onClose;
  const _MenuCard({required this.onClose});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(26),
      child: SafeArea(
        bottom: false,
        child: SizedBox(
          height: 230,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(18, 16, 18, 16),
            child: Column(
              children: [
                Row(
                  children: [
                    const Spacer(),
                    const Text(
                      "ZaZaGoo",
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const Spacer(),
                    _CloseBtn(onTap: onClose),
                  ],
                ),
                const SizedBox(height: 18),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 23),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _MenuItem(
                        icon: Icons.home_outlined,
                        title: "Home",
                        onTap: () {
                          Navigator.pop(context); // ✅ close sheet
                        },
                      ),
                      _MenuItem(
                        icon: Icons.headset_mic_outlined,
                        title: "Help",
                        onTap: () {
                          Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => HelpCenterPage()),
                          );
                        },
                      ),
                      _MenuItem(
                        icon: Icons.access_time,
                        title: "Activities",
                        onTap: () {
                          Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => ActivitiesPage()),
                          );
                        },
                      ),
                      _MenuItem(
                        icon: Icons.person_outline,
                        title: "Profile",
                        onTap: () {
                          Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => ProfilePage()),
                          );
                        },
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 40),
                // ✅ handle bar
                Container(
                  height: 5,
                  width: 70,
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(99),
                  ),
                ),
                const SizedBox(height: 8),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _CloseBtn extends StatelessWidget {
  final VoidCallback onTap;
  const _CloseBtn({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFFF2F3F5),
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: const SizedBox(
          height: 38,
          width: 38,
          child: Icon(Icons.close, size: 18),
        ),
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  const _MenuItem({
    required this.icon,
    required this.title,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: onTap,
      child: Column(
        children: [
          Container(
            height: 54,
            width: 54,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE8E8E8)),
            ),
            child: Icon(icon, size: 22),
          ),
          const SizedBox(height: 10),
          Text(
            title,
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}
