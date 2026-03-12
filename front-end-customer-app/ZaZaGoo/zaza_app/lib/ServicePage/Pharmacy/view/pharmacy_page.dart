import 'package:flutter/material.dart';
import 'package:zaza_app/Menu/view/menu_sheet.dart';
import 'package:zaza_app/ServicePage/Pharmacy/models/pharmacy_shop_model.dart';
import 'package:zaza_app/ServicePage/Pharmacy/view/pharmacy_shop_detail_page.dart';

class PharmacyPage extends StatefulWidget {
  const PharmacyPage({super.key});

  @override
  State<PharmacyPage> createState() => _PharmacyPageState();
}

class _PharmacyPageState extends State<PharmacyPage> {
  final demoPharmacies = <PharmacyShop>[
    const PharmacyShop(
      name: "DOCIB Pharmacy",
      logoUrl: "https://picsum.photos/seed/docib/400/300",
      rating: 4.5,
      reviewsText: "(600+)",
      etaText: "40 - 50 mins",
      isClosed: false,
    ),
    const PharmacyShop(
      name: "Arabella Pharmacy",
      logoUrl: "https://picsum.photos/seed/arabella/400/300",
      rating: 4.5,
      reviewsText: "(83)",
      etaText: "30 - 40 mins",
      isClosed: true,
    ),
    const PharmacyShop(
      name: "Willkins Pharmacy",
      logoUrl: "https://picsum.photos/seed/willkins/400/300",
      rating: 4.6,
      reviewsText: "(338)",
      etaText: "45 - 55 mins",
      isClosed: true,
    ),
    const PharmacyShop(
      name: "MedX Pharmacy",
      logoUrl: "https://picsum.photos/seed/medx/400/300",
      rating: 4.8,
      reviewsText: "(239)",
      etaText: "30 - 40 mins",
      isClosed: false,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            PharmacyHeader(
              onBack: () => Navigator.pop(context),
              onMenu: () {
                MenuSheet.show(context);
              },
              onAddressTap: () {
                // TODO show delivery address sheet (ҳамон sheet-и Deliver)
              },
              onSearchChanged: (q) {
                // TODO filter pharmacy list
              },
            ),

            // ✅ content (scroll)
            Expanded(
              child: ListView(
                padding: const EdgeInsets.only(top: 6),
                children: [
                  AllShopsSection(
                    items: demoPharmacies,
                    onTap: (shop) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => PharmacyShopDetailPage(shop: shop),
                        ),
                      );
                    },
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

/// ALL SHOP SECTION ///

class AllShopsSection extends StatelessWidget {
  final List<PharmacyShop> items;
  final void Function(PharmacyShop shop)? onTap;

  const AllShopsSection({super.key, required this.items, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.fromLTRB(16, 10, 16, 10),
          child: Text(
            "All Shops",
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
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
  final PharmacyShop shop;
  final VoidCallback? onTap;

  const _ShopRow({required this.shop, this.onTap});

  @override
  Widget build(BuildContext context) {
    final green = const Color(0xFF0C6B52);
    final dim = shop.isClosed;

    Color c(Color col) => dim ? col.withOpacity(0.35) : col;
    Color b(Color col) => dim ? col.withOpacity(0.55) : col;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: dim ? null : onTap, // ✅ агар Closed бошад, tap-ро хомӯш мекунем
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
                        fontWeight: FontWeight.w700,
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
                            fontWeight: FontWeight.w700,
                            color: c(green),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          shop.reviewsText,
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            color: c(green.withOpacity(0.90)),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          "•",
                          style: TextStyle(
                            fontWeight: FontWeight.w900,
                            color: Colors.black.withOpacity(dim ? 0.18 : 0.35),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          shop.etaText,
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            color: c(green),
                          ),
                        ),
                      ],
                    ),

                    // ✅ Closed badge (like screenshot)
                    if (shop.isClosed) ...[
                      const SizedBox(height: 19),
                      _ClosedBadge(),
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
              fontWeight: FontWeight.w700,
              color: Colors.black.withOpacity(0.70),
            ),
          ),
        ],
      ),
    );
  }
}

///  Pharmacy Header  ///
class PharmacyHeader extends StatelessWidget {
  final VoidCallback? onBack;
  final VoidCallback? onMenu;
  final VoidCallback? onAddressTap;
  final ValueChanged<String>? onSearchChanged;

  final String title;
  final String addressLabel;
  final String searchHint;

  const PharmacyHeader({
    super.key,
    this.onBack,
    this.onMenu,
    this.onAddressTap,
    this.onSearchChanged,
    this.title = "Pharmacy",
    this.addressLabel = "KMM",
    this.searchHint = "Search in Pharmacies",
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
            _PharmacySearchBar(hint: searchHint, onChanged: onSearchChanged),
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

class _PharmacySearchBar extends StatelessWidget {
  final String hint;
  final ValueChanged<String>? onChanged;

  const _PharmacySearchBar({required this.hint, this.onChanged});

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
