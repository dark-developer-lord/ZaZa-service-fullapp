import 'package:flutter/material.dart';
import 'package:zaza_app/ServicePage/SuperMarkets/models/supermarkets_shop_model.dart';

import 'package:zaza_app/ServicePage/SuperMarkets/view/supermarkets_detail_page.dart';
import 'package:zaza_app/ShopByCategory/models/shop_category_model.dart';
// 👆 номи роҳи файлатро дуруст кун (мисол)

class SuperMarketsPage extends StatefulWidget {
  const SuperMarketsPage({super.key});

  @override
  State<SuperMarketsPage> createState() => _SuperMarketsPageState();
}

class _SuperMarketsPageState extends State<SuperMarketsPage> {
  final demoMarkets = <SuperMarketShop>[
    const SuperMarketShop(
      name: "Al Maya Supermarket",
      logoUrl: "https://picsum.photos/seed/almaya/400/300",
      rating: 3.9,
      reviewsText: "(4400+)",
      etaText: "40 - 50 mins",
      isClosed: false,
    ),
    const SuperMarketShop(
      name: "Choithrams",
      logoUrl: "https://picsum.photos/seed/choithrams/400/300",
      rating: 4.2,
      reviewsText: "(28)",
      etaText: "35 - 45 mins",
      isClosed: false,
    ),
    const SuperMarketShop(
      name: "VIVA Supermarket",
      logoUrl: "https://picsum.photos/seed/viva/400/300",
      rating: 3.5,
      reviewsText: "(183)",
      etaText: "50 - 60 mins",
      isClosed: true,
    ),
    const SuperMarketShop(
      name: "Marks & Spencer",
      logoUrl: "https://picsum.photos/seed/marks/400/300",
      rating: 4.8,
      reviewsText: "(22)",
      etaText: "40 - 50 mins",
      isClosed: false,
    ),
  ];
  final demoCategories = <ShopCategoryItem>[
    const ShopCategoryItem(
      id: "1",
      title: "Special Offers",
      imageUrl: "https://picsum.photos/seed/offers/120/120",
    ),
    const ShopCategoryItem(
      id: "1",
      title: "Bakery",
      imageUrl: "https://picsum.photos/seed/bakery/120/120",
    ),
    const ShopCategoryItem(
      id: "1",
      title: "Special Offers",
      imageUrl: "https://picsum.photos/seed/offers/120/120",
    ),
    const ShopCategoryItem(
      id: "1",
      title: "Bakery",
      imageUrl: "https://picsum.photos/seed/bakery/120/120",
    ),
    const ShopCategoryItem(
      id: "1",
      title: "Special Offers",
      imageUrl: "https://picsum.photos/seed/offers/120/120",
    ),
    const ShopCategoryItem(
      id: "1",
      title: "Bakery",
      imageUrl: "https://picsum.photos/seed/bakery/120/120",
    ),
    const ShopCategoryItem(
      id: "1",
      title: "Special Offers",
      imageUrl: "https://picsum.photos/seed/offers/120/120",
    ),
    const ShopCategoryItem(
      id: "1",
      title: "Bakery",
      imageUrl: "https://picsum.photos/seed/bakery/120/120",
    ),
    const ShopCategoryItem(
      id: "1",
      title: "Special Offers",
      imageUrl: "https://picsum.photos/seed/offers/120/120",
    ),
    const ShopCategoryItem(
      id: "1",
      title: "Bakery",
      imageUrl: "https://picsum.photos/seed/bakery/120/120",
    ),
  ];

  void _openShop(SuperMarketShop shop) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => SuperMarketDetailPage(
          shopName: shop.name,
          etaText: shop.etaText,
          rating: shop.rating,
          ratingsCountText: shop.reviewsText,
          minOrderText: "10c", // ҳоло demo
          deliveryText: "7c", // ҳоло demo
          deliveryByText: "ZaZa", // ҳоло demo
          categories: demoCategories,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            SuperMarkets(
              onBack: () => Navigator.pop(context),
              onMenu: () {},
              onAddressTap: () {},
              onSearchChanged: (q) {},
            ),

            Expanded(
              child: ListView(
                padding: const EdgeInsets.only(top: 6),
                children: [
                  const SizedBox(height: 14),

                  // ✅ Recommended Shops (ҳоло tap дорад)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Recommended Shops",
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 12),

                        GridView.count(
                          crossAxisCount: 4,
                          mainAxisSpacing: 10,
                          crossAxisSpacing: 10,
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          children: [
                            _LogoTile(
                              icon: Icons.bolt_rounded,
                              onTap: () => _openShop(demoMarkets[0]),
                            ),
                            _LogoTile(
                              icon: Icons.store_rounded,
                              onTap: () => _openShop(demoMarkets[1]),
                            ),
                            _LogoTile(
                              icon: Icons.local_mall_rounded,
                              onTap: () => _openShop(demoMarkets[2]),
                            ),
                            _LogoTile(
                              icon: Icons.shopping_basket_rounded,
                              onTap: () => _openShop(demoMarkets[3]),
                            ),
                            _LogoTile(
                              icon: Icons.eco_rounded,
                              onTap: () => _openShop(demoMarkets[0]),
                            ),
                            _LogoTile(
                              icon: Icons.star_border_rounded,
                              onTap: () => _openShop(demoMarkets[1]),
                            ),
                            _LogoTile(
                              icon: Icons.shopping_cart_rounded,
                              onTap: () => _openShop(demoMarkets[2]),
                            ),
                            _LogoTile(
                              icon: Icons.restaurant_rounded,
                              onTap: () => _openShop(demoMarkets[3]),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 18),

                  // ✅ All Shops section (ҳар shop тап шавад -> detail)
                  SuperMarketsAllShopsSection(
                    items: demoMarkets,
                    onTap: (shop) => _openShop(shop),
                  ),

                  const SizedBox(height: 16),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/* ---------------- UI widgets ---------------- */

class _LogoTile extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _LogoTile({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          alignment: Alignment.center,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: Icon(icon, size: 26, color: const Color(0xFF111827)),
        ),
      ),
    );
  }
}

/// ALL SHOPS

class SuperMarketsAllShopsSection extends StatelessWidget {
  final List<SuperMarketShop> items;
  final void Function(SuperMarketShop shop)? onTap;

  const SuperMarketsAllShopsSection({
    super.key,
    required this.items,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.fromLTRB(16, 10, 16, 10),
          child: Text(
            "All Shops",
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
          ),
        ),
        ListView.separated(
          itemCount: items.length,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          separatorBuilder: (_, __) => Divider(
            height: 1,
            thickness: 1,
            color: Colors.black.withOpacity(0.08),
          ),
          itemBuilder: (context, i) {
            final it = items[i];
            return _ShopRow(shop: it, onTap: () => onTap?.call(it));
          },
        ),
      ],
    );
  }
}

class _ShopRow extends StatelessWidget {
  final SuperMarketShop shop;
  final VoidCallback? onTap;

  const _ShopRow({required this.shop, this.onTap});

  @override
  Widget build(BuildContext context) {
    const green = Color(0xFF0C6B52);
    final dim = shop.isClosed;

    Color c(Color col) => dim ? col.withOpacity(0.35) : col;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: dim ? null : onTap, // ✅ Closed -> tap off
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ✅ Logo
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  width: 110,
                  height: 108,
                  color: Colors.black.withOpacity(0.04),
                  child: Image.network(
                    shop.logoUrl,
                    fit: BoxFit.cover,
                    color: dim ? Colors.white.withOpacity(0.15) : null,
                    colorBlendMode: dim ? BlendMode.srcATop : null,
                  ),
                ),
              ),
              const SizedBox(width: 14),

              // ✅ Text block + Closed badge
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      shop.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                        color: c(Colors.black),
                      ),
                    ),
                    const SizedBox(height: 8),

                    // rating row
                    Row(
                      children: [
                        Icon(Icons.star_rounded, size: 18, color: c(green)),
                        const SizedBox(width: 4),
                        Text(
                          shop.rating.toStringAsFixed(1),
                          style: TextStyle(
                            fontWeight: FontWeight.w500,
                            color: c(green),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          shop.reviewsText,
                          style: TextStyle(
                            fontWeight: FontWeight.w500,
                            color: c(green.withOpacity(0.90)),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          "•",
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            color: Colors.black.withOpacity(dim ? 0.18 : 0.35),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          shop.etaText,
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            color: c(green),
                          ),
                        ),
                      ],
                    ),

                    if (shop.isClosed) ...[
                      const SizedBox(height: 19),
                      const _ClosedBadge(),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ClosedBadge extends StatelessWidget {
  const _ClosedBadge();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.04),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.black.withOpacity(0.10)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.warning_amber_rounded,
            size: 14,
            color: Colors.black.withOpacity(0.70),
          ),
          const SizedBox(width: 6),
          Text(
            "Closed",
            style: TextStyle(
              fontWeight: FontWeight.w500,
              color: Colors.black.withOpacity(0.70),
            ),
          ),
        ],
      ),
    );
  }
}

/// TOP HEADER SUPERMARKETS

class SuperMarkets extends StatelessWidget {
  final VoidCallback? onBack;
  final VoidCallback? onMenu;
  final VoidCallback? onAddressTap;
  final ValueChanged<String>? onSearchChanged;

  final String title;
  final String addressLabel;
  final String searchHint;

  const SuperMarkets({
    super.key,
    this.onBack,
    this.onMenu,
    this.onAddressTap,
    this.onSearchChanged,
    this.title = "SuperMarkets",
    this.addressLabel = "KMM",
    this.searchHint = "Search in SuperMarkets",
  });

  @override
  Widget build(BuildContext context) {
    final green = const Color(0xFF0C6B52);

    return SafeArea(
      bottom: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
        child: Column(
          children: [
            // ✅ Top row: back | title | menu
            Row(
              children: [
                _SquareIconBtn(
                  icon: Icons.arrow_back_ios_new_rounded,
                  onTap: onBack,
                ),
                const Spacer(),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: green,
                  ),
                ),
                const Spacer(),
                _SquareIconBtn(
                  icon: Icons.menu_rounded,
                  onTap: onMenu,
                  filled: true,
                  fillColor: green,
                  iconColor: Colors.white,
                ),
              ],
            ),

            const SizedBox(height: 10),

            // ✅ Deliver to row
            GestureDetector(
              onTap: onAddressTap,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Deliver to ",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.black.withOpacity(0.60),
                    ),
                  ),
                  Text(
                    addressLabel,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Icon(
                    Icons.keyboard_arrow_down_rounded,
                    size: 22,
                    color: Colors.black.withOpacity(0.70),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // ✅ Search bar
            _SuperMarketsSearchBar(
              hint: searchHint,
              onChanged: onSearchChanged,
            ),
          ],
        ),
      ),
    );
  }
}

class _SquareIconBtn extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onTap;
  final bool filled;
  final Color? fillColor;
  final Color? iconColor;

  const _SquareIconBtn({
    required this.icon,
    this.onTap,
    this.filled = false,
    this.fillColor,
    this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    final bg = filled ? (fillColor ?? Colors.black) : Colors.transparent;
    final ic = iconColor ?? Colors.black;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(14),
            border: filled ? null : Border.all(color: Colors.black12),
          ),
          child: Icon(icon, size: 22, color: ic),
        ),
      ),
    );
  }
}

class _SuperMarketsSearchBar extends StatelessWidget {
  final String hint;
  final ValueChanged<String>? onChanged;

  const _SuperMarketsSearchBar({required this.hint, this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 46,
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFF3F4F6),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.black12),
      ),
      child: Row(
        children: [
          Icon(Icons.search_rounded, color: Colors.black.withOpacity(0.65)),
          SizedBox(width: 5),
          Expanded(
            child: TextField(
              onChanged: onChanged,
              decoration: InputDecoration(
                hintText: hint,
                hintStyle: TextStyle(
                  fontWeight: FontWeight.w700,
                  color: Colors.black.withOpacity(0.35),
                ),
                border: InputBorder.none,
                isCollapsed: true,
              ),
            ),
          ),
        ],
      ),
    );
  }
}



/// Banner
// class _PromoBanner extends StatelessWidget {
//   final VoidCallback onTap;

//   const _PromoBanner({required this.onTap});

//   @override
//   Widget build(BuildContext context) {
//     return InkWell(
//       borderRadius: BorderRadius.circular(18),
//       onTap: onTap,
//       child: Container(
//         height: 170,
//         decoration: BoxDecoration(
//           borderRadius: BorderRadius.circular(18),
//           color: const Color(0xFFEFF6FF),
//         ),
//         child: Stack(
//           children: const [
//             Positioned(
//               left: 18,
//               top: 18,
//               child: Icon(Icons.local_grocery_store_rounded, size: 44),
//             ),
//             Positioned(
//               left: 18,
//               bottom: 18,
//               child: Text(
//                 "Fresh finds\nevery day.",
//                 style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }