import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:zaza_app/Search/view/search_page.dart';
import 'package:zaza_app/Wallet/models/wallet_models.dart';
import 'package:zaza_app/Wallet/view/wallet_page.dart';
import 'package:zaza_app/Profile/viewmodel/add_email_page.dart';
import 'package:zaza_app/ServicePage/Box/view/box_page.dart';
import 'package:zaza_app/ServicePage/Food/view/food_main_page.dart';
import 'package:zaza_app/Menu/view/menu_sheet.dart';
import 'package:zaza_app/ServicePage/Pharmacy/view/pharmacy_page.dart';
import 'package:zaza_app/bottom_to_top.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  static const double r = 24; // ✅ radius
  static const double gap = 27; // ✅ ҷудоӣ байни header ва body
  static const double searchH = 44; // ✅ баландии search
  static const double glass = 0.38; // ✅ 0.30–0.40

  @override
  Widget build(BuildContext context) {
    final top = MediaQuery.of(context).padding.top;

    final headerBase = top + 12 + searchH + 16;

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // ✅ HEADER (сабз) + radius поён + stretch ҳангоми pull-down
          _StretchyHeader(
            baseHeight: headerBase,
            radius: r,
            child: const _GreenBg(),
          ),

          Positioned.fill(
            top: headerBase + gap - r,
            child: ClipRRect(
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(r),
              ),
              child: Container(
                color: Colors.white,
                child: ListView(
                  physics: const BouncingScrollPhysics(
                    parent: AlwaysScrollableScrollPhysics(),
                  ),
                  padding: EdgeInsets.only(bottom: 24, top: 16),

                  children: const [
                    _QuickActionsRow(),
                    SizedBox(height: 12),
                    _MiniCardsRow(), // ✅ 3 карточкаи хурд (Balance / Ride to / Salik) агар хоҳӣ
                    SizedBox(height: 18),
                    _TitleAndBanner(), // ✅ Unlock... + баннер
                    SizedBox(height: 16),
                    _DemoGrid(), // ✅ grid-и поён барои тест
                    SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          ),

          // ✅ SEARCH pinned (ҳамеша сабз мемонад, сафед намешавад)
          Positioned(
            left: 0,
            right: 0,
            top: 0,
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
                child: Row(
                  children: [
                    Expanded(child: _SearchBar(opacity: glass)),
                    SizedBox(width: 10),
                    _MenuBtn(
                      opacity: glass,
                      onTap: () => MenuSheet.show(context),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _DemoGrid extends StatelessWidget {
  const _DemoGrid();

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      itemCount: 9,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        mainAxisSpacing: 9,
        crossAxisSpacing: 9,
        childAspectRatio: 1,
      ),
      itemBuilder: (_, __) => Container(
        decoration: BoxDecoration(
          color: const Color(0xFFF3F4F6),
          borderRadius: BorderRadius.circular(18),
        ),
      ),
    );
  }
}

class _TitleAndBanner extends StatelessWidget {
  const _TitleAndBanner();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: const Text(
            "Unlock welcome offers, just for you!",
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
          ),
        ),
        const SizedBox(height: 12),
        Container(
          height: 150,
          decoration: BoxDecoration(
            color: const Color(0xFFEAE6FF),
            borderRadius: BorderRadius.circular(18),
          ),
        ),
      ],
    );
  }
}

/// MINI CARDS

class _MiniCardsRow extends StatelessWidget {
  const _MiniCardsRow({super.key});

  @override
  Widget build(BuildContext context) {
    Widget card(String title, String sub, {VoidCallback? onTap}) {
      final child = Container(
        width: 130,
        height: 62,
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFE9EAED)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 11, color: Colors.black54),
            ),
            const SizedBox(height: 4),
            Text(sub, style: const TextStyle(fontWeight: FontWeight.w700)),
          ],
        ),
      );

      /// агар onTap бошад clickable мешавад
      if (onTap != null) {
        return Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: onTap,
            child: child,
          ),
        );
      }

      /// агар onTap набошад static мемонад
      return child;
    }

    return SizedBox(
      height: 65,
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        child: Row(
          children: [
            const SizedBox(width: 16),

            /// ❌ no tap
            card(
              "Balance",
              "0.00",
              onTap: () async {
                await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => WalletBalancePage(
                      balance: 13,
                      transactions: [
                        WalletTransactionItem(
                          title: "Wallet top up",
                          date: DateTime(2026, 1, 29, 10, 0),
                          amount: 20,
                          type: WalletTxType.topUp,
                        ),
                        WalletTransactionItem(
                          title: "Order payment",
                          date: DateTime(2026, 1, 29, 13, 30),
                          amount: 7,
                          type: WalletTxType.payment,
                        ),
                        WalletTransactionItem(
                          title: "Ride refund",
                          date: DateTime(2026, 1, 29, 16, 10),
                          amount: 13,
                          type: WalletTxType.refund,
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),

            const SizedBox(width: 10),

            /// ❌ no tap
            card("Orders", "0"),

            const SizedBox(width: 10),

            /// ✅ only this clickable
            card(
              "Add email",
              "Stay updated",
              onTap: () async {
                await Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const EmailUpdatePage()),
                );
              },
            ),

            const SizedBox(width: 10),
          ],
        ),
      ),
    );
  }
}

///  Card of Quick
class _QuickActionsRow extends StatelessWidget {
  const _QuickActionsRow();

  @override
  Widget build(BuildContext context) {
    Widget item({
      required IconData icon,
      required String title,
      required VoidCallback onTap,
    }) {
      return Expanded(
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(12),
            child: Ink(
              height: 102,
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                color: const Color(0xFFF3F4F6),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(icon, size: 30),
                  const SizedBox(height: 10),
                  Text(
                    title,
                    style: const TextStyle(fontWeight: FontWeight.w800),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          item(
            icon: Icons.restaurant_rounded,
            title: "Food",
            onTap: () => Navigator.push(context, bottomToTop(FoodMainPage())),
          ),
          // const SizedBox(width: 10),
          // item(
          //   icon: Icons.flash_on_rounded,
          //   title: "Shop",

          //   onTap: () => Navigator.push(
          //     context,
          //     MaterialPageRoute(builder: (_) => SuperMarketsPage()),
          //   ),
          // ),
          const SizedBox(width: 10),
          item(
            icon: Icons.local_pharmacy_rounded,
            title: "Pharmacy",

            onTap: () => Navigator.push(context, bottomToTop(PharmacyPage())),
          ),
          const SizedBox(width: 10),
          item(
            icon: Icons.add_box,
            title: "Box",

            onTap: () => Navigator.push(context, bottomToTop(BoxPage())),
          ),
        ],
      ),
    );
  }
}

/// ✅ HEADER stretch (pull-down) бе SliverAppBar
class _StretchyHeader extends StatefulWidget {
  final double baseHeight;
  final double radius;
  final Widget child;

  const _StretchyHeader({
    required this.baseHeight,
    required this.radius,
    required this.child,
  });

  @override
  State<_StretchyHeader> createState() => _StretchyHeaderState();
}

class _StretchyHeaderState extends State<_StretchyHeader> {
  double extra = 0;

  @override
  Widget build(BuildContext context) {
    return NotificationListener<ScrollNotification>(
      onNotification: (n) {
        if (n.metrics.axis != Axis.vertical) return false;

        final px = n.metrics.pixels;
        final next = px < 0 ? (-px) : 0;

        if ((next - extra).abs() > 0.5) {
          setState(() => extra = next.clamp(0.0, 140.0).toDouble()); // ✅ FIX
        }
        return false;
      },
      child: Positioned(
        left: 0,
        right: 0,
        top: 0,
        height: widget.baseHeight + extra,
        child: ClipRRect(
          borderRadius: BorderRadius.vertical(
            bottom: Radius.circular(widget.radius),
          ),
          child: widget.child,
        ),
      ),
    );
  }
}

class _GreenBg extends StatelessWidget {
  const _GreenBg();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF0A8F6B), Color(0xFF0B5A4A), Color(0xFF063A30)],
        ),
      ),
    );
  }
}

class _SearchBar extends StatefulWidget {
  final double opacity;

  const _SearchBar({required this.opacity});

  @override
  State<_SearchBar> createState() => _SearchBarState();
}

class _SearchBarState extends State<_SearchBar> {
  final List<String> hints = [
    "Search food",
    "Search restaurants",
    "Search desserts",
    "Search drinks",
  ];

  int index = 0;
  Timer? timer;

  @override
  void initState() {
    super.initState();

    timer = Timer.periodic(const Duration(seconds: 2), (_) {
      if (!mounted) return;
      setState(() {
        index = (index + 1) % hints.length;
      });
    });
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  void _openSearch(BuildContext context) {
    Navigator.push(context, bottomToTop(ZazaSearchPage()));
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _openSearch(context),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            height: 44,
            padding: const EdgeInsets.only(left: 6, right: 6),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(widget.opacity),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              children: [
                IconButton(
                  onPressed: () => _openSearch(context),
                  icon: const Icon(Icons.search),
                  splashRadius: 10,
                ),
                Expanded(
                  child: SizedBox(
                    height: 44,
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 500),
                      switchInCurve: Curves.easeInOut,
                      switchOutCurve: Curves.easeInOut,

                      layoutBuilder: (currentChild, previousChildren) {
                        return Stack(
                          alignment: Alignment.centerLeft,
                          children: <Widget>[
                            ...previousChildren,
                            if (currentChild != null) currentChild,
                          ],
                        );
                      },

                      // ✅ танҳо fade, бе ҳаракат ба марказ
                      transitionBuilder: (child, animation) {
                        return FadeTransition(opacity: animation, child: child);
                      },

                      child: Align(
                        key: ValueKey(hints[index]),
                        alignment: Alignment.centerLeft,
                        child: Text(
                          hints[index],
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          textAlign: TextAlign.left,
                          style: const TextStyle(
                            fontSize: 16,
                            color: Colors.black87,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _MenuBtn extends StatelessWidget {
  final double opacity;
  final VoidCallback onTap;

  const _MenuBtn({required this.opacity, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      width: 56,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Material(
            color: Colors.white.withOpacity(opacity),
            child: InkWell(onTap: onTap, child: const Icon(Icons.menu)),
          ),
        ),
      ),
    );
  }
}
