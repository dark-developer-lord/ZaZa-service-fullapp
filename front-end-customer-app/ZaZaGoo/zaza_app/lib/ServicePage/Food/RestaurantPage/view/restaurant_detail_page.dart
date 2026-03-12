import 'package:flutter/material.dart';
import 'package:zaza_app/Basket/view/view_basket_page.dart';
import 'package:zaza_app/ServicePage/Food/models/restaurant_model.dart';
import 'package:zaza_app/Basket/view/basket_controller.dart';
import 'package:zaza_app/Basket/view/view_basket_bar.dart';

class RestaurantDetailPage extends StatelessWidget {
  final RestaurantItem restaurant;
  final String? logoUrl;
  final BasketController basket;

  const RestaurantDetailPage({
    super.key,
    required this.restaurant,
    required this.basket,
    this.logoUrl,
  });

  @override
  Widget build(BuildContext context) {
    const darkGreen = Color(0xFF0C3A2E);

    return DefaultTabController(
      length: 5,
      child: Scaffold(
        backgroundColor: Colors.white,

        body: Stack(
          children: [
            NestedScrollView(
              headerSliverBuilder: (context, innerScrolled) => [
                SliverAppBar(
                  backgroundColor: Colors.white,
                  elevation: 0,
                  scrolledUnderElevation: 0,
                  automaticallyImplyLeading: false,
                  pinned: true,
                  floating: false,
                  stretch: false,
                  expandedHeight: 260,
                  toolbarHeight: 56,

                  flexibleSpace: LayoutBuilder(
                    builder: (context, c) {
                      final topPad = MediaQuery.of(context).padding.top;
                      final minH = kToolbarHeight + topPad;
                      final maxH = 260.0;
                      final currentH = c.biggest.height;

                      final t = ((maxH - currentH) / (maxH - minH)).clamp(
                        0.0,
                        1.0,
                      );

                      return Stack(
                        clipBehavior: Clip.none,
                        children: [
                          // ✅ HERO image
                          Positioned.fill(
                            child: Stack(
                              fit: StackFit.expand,
                              children: [
                                Image.network(
                                  restaurant.imageUrl,
                                  fit: BoxFit.cover,
                                ),
                                Container(
                                  color: Colors.black.withOpacity(0.18),
                                ),
                              ],
                            ),
                          ),

                          // ✅ Expanded buttons (даруни сурат)
                          Positioned(
                            left: 16,
                            right: 16,
                            top: topPad + 10,
                            child: Opacity(
                              opacity: 1 - t,
                              child: Row(
                                children: [
                                  _HeroSquareBtn(
                                    icon: Icons.arrow_back_ios_new_rounded,
                                    onTap: () => Navigator.pop(context),
                                  ),
                                  const Spacer(),
                                  _HeroSquareBtn(
                                    icon: Icons.ios_share_rounded,
                                    onTap: () {},
                                  ),
                                  const SizedBox(width: 10),
                                  _HeroSquareBtn(
                                    icon: Icons.search_rounded,
                                    onTap: () {},
                                  ),
                                ],
                              ),
                            ),
                          ),

                          // ✅ Collapsed header (мисли расми 3)
                          Positioned(
                            left: 0,
                            right: 0,
                            top: 0,
                            child: Opacity(
                              opacity: t,
                              child: Container(
                                height: minH,
                                padding: EdgeInsets.only(top: topPad),
                                color: Colors.white,
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                  ),
                                  child: Row(
                                    children: [
                                      _HeroSquareBtn(
                                        icon: Icons.arrow_back_ios_new_rounded,
                                        onTap: () => Navigator.pop(context),
                                      ),
                                      const SizedBox(width: 10),
                                      Expanded(
                                        child: Column(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              restaurant.name,
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.w900,
                                                fontSize: 16,
                                              ),
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              restaurant.eta,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.w700,
                                                fontSize: 12.5,
                                                color: Colors.black54,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      _HeroSquareBtn(
                                        icon: Icons.ios_share_rounded,
                                        onTap: () {},
                                      ),
                                      const SizedBox(width: 10),
                                      _HeroSquareBtn(
                                        icon: Icons.search_rounded,
                                        onTap: () {},
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),

                          // ✅ LOGO bottom:-20 + hide on scroll
                          Positioned(
                            left: 16,
                            bottom: -20,
                            child: IgnorePointer(
                              ignoring: t > 0.35,
                              child: Opacity(
                                opacity: (1 - (t * 1.6)).clamp(0.0, 1.0),
                                child: Transform.translate(
                                  offset: Offset(0, -t * 14),
                                  child: _LogoCard(logoUrl: logoUrl),
                                ),
                              ),
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ),

                // ✅ info block
                SliverToBoxAdapter(
                  child: _RestoInfoBlock(restaurant: restaurant),
                ),

                SliverToBoxAdapter(child: const SizedBox(height: 14)),

                // ✅ delivery card (аз restaurant меояд)
                SliverToBoxAdapter(
                  child: _DeliveryInfoCard(
                    etaText: restaurant.eta,
                    priceForOne: "\$\$\$",
                    deliveryFee: "${restaurant.deliveryFee.toStringAsFixed(2)}",
                  ),
                ),

                // ✅ Sticky TabBar
                SliverPersistentHeader(
                  pinned: true,
                  delegate: _TabBarHeader(
                    TabBar(
                      isScrollable: true,
                      tabAlignment: TabAlignment.start,
                      labelColor: Colors.black,
                      unselectedLabelColor: Colors.black38,
                      labelStyle: const TextStyle(fontWeight: FontWeight.w600),
                      unselectedLabelStyle: const TextStyle(
                        fontWeight: FontWeight.w500,
                      ),
                      indicatorColor: darkGreen,
                      indicatorWeight: 3,
                      tabs: const [
                        Tab(text: "Order Again 💚"),
                        Tab(text: "Bestsellers 🔥"),
                        Tab(text: "COMBOS"),
                        Tab(text: "MEZZE"),
                        Tab(text: "More"),
                      ],
                    ),
                  ),
                ),
              ],

              // ✅ Tab pages (demo food)
              body: TabBarView(
                children: [
                  _MenuList(basket: basket),
                  _MenuList(basket: basket),
                  _MenuList(basket: basket),
                  _MenuList(basket: basket),
                  _MenuList(basket: basket),
                ],
              ),
            ),

            // ✅ View Basket Bar (reactive)
            AnimatedBuilder(
              animation: basket,
              builder: (_, __) {
                return ViewBasketBar(
                  count: basket.totalItems,
                  bottom: 18, // дар detail поёнтар зебо
                  right: 16,
                  onTap: () {
                    // TODO: tu xudat ViewBasketPage mekuni
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => ViewBasketPage(
                          basket: basket,
                          shopName: restaurant.name,
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _MenuList extends StatelessWidget {
  final BasketController basket;
  const _MenuList({required this.basket});

  @override
  Widget build(BuildContext context) {
    // ✅ demo food items
    final items = const [
      _FoodItem(
        id: "1",
        title: "Grill Chicken",
        subtitle: "Customisable",
        price: 24.0,
      ),
      _FoodItem(
        id: "2",
        title: "Mix Grill",
        subtitle: "Customisable",
        price: 35.0,
      ),
      _FoodItem(
        id: "3",
        title: "Chicken Shawarma",
        subtitle: "Customisable",
        price: 18.0,
      ),
      _FoodItem(
        id: "4",
        title: "Grill Chicken Rice",
        subtitle: "Customisable",
        price: 28.0,
      ),
      _FoodItem(
        id: "5",
        title: "Hummus",
        subtitle: "Customisable",
        price: 12.0,
      ),
    ];

    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(
        16,
        14,
        16,
        90,
      ), // ⬅️ ҷой барои ViewBasketBar
      itemCount: items.length,
      separatorBuilder: (_, __) =>
          Divider(height: 20, color: Colors.black.withOpacity(0.07)),
      itemBuilder: (_, i) => _FoodRow(item: items[i], basket: basket),
    );
  }
}

class _FoodRow extends StatelessWidget {
  final _FoodItem item;
  final BasketController basket;
  const _FoodRow({required this.item, required this.basket});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: basket,
      builder: (_, __) {
        final qty = basket.qtyOf(item.id);

        return Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: Container(
                width: 92,
                height: 74,
                color: Colors.black.withOpacity(0.06),
                child: const Icon(Icons.fastfood_rounded),
              ),
            ),
            const SizedBox(width: 12),

            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    item.subtitle,
                    style: const TextStyle(
                      color: Colors.black45,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(width: 10),

            // ✅ RIGHT SIDE: Add OR Qty Control (мисли Pharmacy)
            if (qty == 0)
              SizedBox(
                height: 38,
                child: OutlinedButton(
                  onPressed: () {
                    basket.inc(
                      id: item.id,
                      title: item.title,
                      price: item.price,
                      imageUrl: null,
                    );
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.black, // ✅ text/icon color
                    side: BorderSide(
                      color: Colors.black.withOpacity(0.18),
                    ), // ✅ border
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12), // ✅ circular 12
                    ),
                    textStyle: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                  child: const Text("Add"),
                ),
              )
            else
              _QtyControl(
                qty: qty,
                onDec: () => basket.decOrRemove(item.id),
                onInc: () => basket.inc(
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  imageUrl: null,
                ),
              ),
          ],
        );
      },
    );
  }
}

class _QtyControl extends StatelessWidget {
  final int qty;
  final VoidCallback onDec;
  final VoidCallback onInc;

  const _QtyControl({
    required this.qty,
    required this.onDec,
    required this.onInc,
  });

  @override
  Widget build(BuildContext context) {
    // мисли Pharmacy: сафед, бордер, баландӣ якхела
    return Container(
      height: 38,
      padding: const EdgeInsets.symmetric(horizontal: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.black.withOpacity(0.12)),
        boxShadow: [
          BoxShadow(
            blurRadius: 10,
            offset: const Offset(0, 6),
            color: Colors.black.withOpacity(0.06),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // qty==1 -> delete icon (мисли Pharmacy)
          InkWell(
            onTap: onDec,
            borderRadius: BorderRadius.circular(10),
            child: SizedBox(
              width: 34,
              height: 34,
              child: Icon(
                qty <= 1 ? Icons.delete_outline_rounded : Icons.remove_rounded,
                size: 18,
                color: Colors.black87,
              ),
            ),
          ),

          SizedBox(
            width: 26,
            child: Text(
              "$qty",
              textAlign: TextAlign.center,
              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
            ),
          ),

          InkWell(
            onTap: onInc,
            borderRadius: BorderRadius.circular(10),
            child: const SizedBox(
              width: 34,
              height: 34,
              child: Icon(Icons.add_rounded, size: 18, color: Colors.black87),
            ),
          ),
        ],
      ),
    );
  }
}

class _FoodItem {
  final String id;
  final String title;
  final String subtitle;
  final double price;
  const _FoodItem({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.price,
  });
}

class _LogoCard extends StatelessWidget {
  final String? logoUrl;
  const _LogoCard({this.logoUrl});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 76,
      height: 76,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.black.withOpacity(0.10)),
        boxShadow: [
          BoxShadow(
            blurRadius: 22,
            offset: const Offset(0, 12),
            color: Colors.black.withOpacity(0.14),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: logoUrl == null
            ? Container(
                color: Colors.black.withOpacity(0.05),
                child: const Icon(Icons.restaurant_rounded, size: 30),
              )
            : Image.network(
                logoUrl!,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  color: Colors.black.withOpacity(0.05),
                  child: const Icon(Icons.restaurant_rounded, size: 30),
                ),
              ),
      ),
    );
  }
}

class _DeliveryInfoCard extends StatelessWidget {
  final String etaText;
  final String priceForOne;
  final String deliveryFee;

  const _DeliveryInfoCard({
    required this.etaText,
    required this.priceForOne,
    required this.deliveryFee,
  });

  @override
  Widget build(BuildContext context) {
    const darkGreen = Color(0xFF0C3A2E);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.black.withOpacity(0.10)),
      ),
      child: Row(
        children: [
          Expanded(
            child: _InfoCol(
              title: "Deliver Now",
              value: etaText,
              valueColor: darkGreen,
            ),
          ),
          _VLine(),
          Expanded(
            child: _InfoCol(
              title: "Price For One",
              value: priceForOne,
              valueColor: Colors.black87,
            ),
          ),
          _VLine(),
          Expanded(
            child: _InfoCol(
              title: "Delivery Fee",
              value: deliveryFee,
              valueColor: Colors.black87,
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoCol extends StatelessWidget {
  final String title;
  final String value;
  final Color valueColor;

  const _InfoCol({
    required this.title,
    required this.value,
    required this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            title,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontWeight: FontWeight.w500,
              color: Colors.black.withOpacity(0.45),
              fontSize: 13,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            value,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontWeight: FontWeight.w700,
              color: valueColor,
              fontSize: 15,
            ),
          ),
        ],
      ),
    );
  }
}

class _VLine extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 2,
      height: 54,
      color: Colors.black.withOpacity(0.08),
    );
  }
}

class _RestoInfoBlock extends StatelessWidget {
  final RestaurantItem restaurant;
  const _RestoInfoBlock({required this.restaurant});

  @override
  Widget build(BuildContext context) {
    const darkGreen = Color(0xFF0C3A2E);

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 0),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  restaurant.name,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  restaurant.cuisine,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  "${restaurant.distanceKm.toStringAsFixed(1)} km",
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Colors.black.withOpacity(0.55),
                  ),
                ),
                const SizedBox(height: 12),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.black12),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    const Icon(Icons.star_rounded, size: 18, color: darkGreen),
                    const SizedBox(width: 4),
                    Text(
                      restaurant.rating.toStringAsFixed(1),
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        color: darkGreen,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  "${restaurant.reviews}+\nratings",
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    color: Colors.black54,
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

class _TabBarHeader extends SliverPersistentHeaderDelegate {
  final TabBar tabBar;
  _TabBarHeader(this.tabBar);

  @override
  double get minExtent => tabBar.preferredSize.height + 8;

  @override
  double get maxExtent => tabBar.preferredSize.height + 8;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlaps) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.only(top: 5),
      child: Column(
        children: [
          tabBar,
          Divider(
            height: 1,
            thickness: 1,
            color: Colors.black.withOpacity(0.07),
          ),
        ],
      ),
    );
  }

  @override
  bool shouldRebuild(covariant _TabBarHeader oldDelegate) => false;
}

class _HeroSquareBtn extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _HeroSquareBtn({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.black.withOpacity(0.10)),
          ),
          child: Icon(icon, size: 20),
        ),
      ),
    );
  }
}
