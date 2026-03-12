import 'package:flutter/material.dart';
import 'package:zaza_app/Basket/view/basket_controller.dart';
import 'package:zaza_app/Basket/view/view_basket_bar.dart';
import 'package:zaza_app/Basket/view/view_basket_page.dart';
import 'package:zaza_app/Cart/view/add_to_cart_controller.dart';
import 'package:zaza_app/Menu/view/menu_sheet.dart';
import 'package:zaza_app/ServicePage/Pharmacy/models/pharmacy_shop_model.dart';
import 'package:zaza_app/ServicePage/Pharmacy/models/product_model.dart';
import 'package:zaza_app/ShopByCategory/models/shop_category_model.dart';

import 'package:zaza_app/ShopByCategory/view/shop_category_page.dart';

// NOTE: PharmacyShopHeader / ShopByCategorySection дар коди ту ҳастанд.

class PharmacyShopDetailPage extends StatefulWidget {
  final PharmacyShop shop;
  const PharmacyShopDetailPage({super.key, required this.shop});

  @override
  State<PharmacyShopDetailPage> createState() => _PharmacyShopDetailPageState();
}

class _PharmacyShopDetailPageState extends State<PharmacyShopDetailPage> {
  final basket = BasketController();

  // demo data (ҳамонҳои ту)
  final demoCategories = <ShopCategoryItem>[
    const ShopCategoryItem(
      id: "facial_care",
      title: "Facial Care",
      imageUrl: "https://picsum.photos/seed/facial/120/120",
    ),
    const ShopCategoryItem(
      id: "woman_care",
      title: "Woman Care",
      imageUrl: "https://picsum.photos/seed/woman/120/120",
    ),
    const ShopCategoryItem(
      id: "personal_hygiene",
      title: "Personal\nHygiene",
      imageUrl: "https://picsum.photos/seed/hyg/120/120",
    ),
    const ShopCategoryItem(
      id: "sexual_wellness",
      title: "Sexual\nWellness",
      imageUrl: "https://picsum.photos/seed/sex/120/120",
    ),
    const ShopCategoryItem(
      id: "sun_care",
      title: "Sun Care",
      imageUrl: "https://picsum.photos/seed/sun/120/120",
    ),
    const ShopCategoryItem(
      id: "dental_care",
      title: "Dental Care",
      imageUrl: "https://picsum.photos/seed/dental/120/120",
    ),
    const ShopCategoryItem(
      id: "natural_homeopathy",
      title: "Natural &\nHomeopathy",
      imageUrl: "https://picsum.photos/seed/natural/120/120",
    ),
    const ShopCategoryItem(
      id: "beauty_cosmetics",
      title: "Beauty &\nCosmetics",
      imageUrl: "https://picsum.photos/seed/beauty/120/120",
    ),
    const ShopCategoryItem(
      id: "special_offers",
      title: "Special Offers",
      imageUrl: "https://picsum.photos/seed/offers/120/120",
    ),
    const ShopCategoryItem(
      id: "otc_medicine",
      title: "OTC Medicine",
      imageUrl: "https://picsum.photos/seed/otc/120/120",
    ),
    const ShopCategoryItem(
      id: "hair_care",
      title: "Hair Care",
      imageUrl: "https://picsum.photos/seed/hair/120/120",
    ),
    const ShopCategoryItem(
      id: "vitamins_supplements",
      title: "Vitamins &\nSupplements",
      imageUrl: "https://picsum.photos/seed/vit/120/120",
    ),
    const ShopCategoryItem(
      id: "facial_care",
      title: "Facial Care",
      imageUrl: "https://picsum.photos/seed/facial/120/120",
    ),
    const ShopCategoryItem(
      id: "woman_care",
      title: "Woman Care",
      imageUrl: "https://picsum.photos/seed/woman/120/120",
    ),
    const ShopCategoryItem(
      id: "personal_hygiene",
      title: "Personal\nHygiene",
      imageUrl: "https://picsum.photos/seed/hyg/120/120",
    ),
    const ShopCategoryItem(
      id: "sexual_wellness",
      title: "Sexual\nWellness",
      imageUrl: "https://picsum.photos/seed/sex/120/120",
    ),
    const ShopCategoryItem(
      id: "sun_care",
      title: "Sun Care",
      imageUrl: "https://picsum.photos/seed/sun/120/120",
    ),
    const ShopCategoryItem(
      id: "dental_care",
      title: "Dental Care",
      imageUrl: "https://picsum.photos/seed/dental/120/120",
    ),
    const ShopCategoryItem(
      id: "natural_homeopathy",
      title: "Natural &\nHomeopathy",
      imageUrl: "https://picsum.photos/seed/natural/120/120",
    ),
    const ShopCategoryItem(
      id: "beauty_cosmetics",
      title: "Beauty &\nCosmetics",
      imageUrl: "https://picsum.photos/seed/beauty/120/120",
    ),
    const ShopCategoryItem(
      id: "special_offers",
      title: "Special Offers",
      imageUrl: "https://picsum.photos/seed/offers/120/120",
    ),
    const ShopCategoryItem(
      id: "otc_medicine",
      title: "OTC Medicine",
      imageUrl: "https://picsum.photos/seed/otc/120/120",
    ),
    const ShopCategoryItem(
      id: "hair_care",
      title: "Hair Care",
      imageUrl: "https://picsum.photos/seed/hair/120/120",
    ),
    const ShopCategoryItem(
      id: "vitamins_supplements",
      title: "Vitamins &\nSupplements",
      imageUrl: "https://picsum.photos/seed/vit/120/120",
    ),
  ];

  final babyCareItems = <ProductItem>[
    const ProductItem(
      id: "baby_001",
      title: "Beurer BY80 Baby Care Weight Scale 1's",
      imageUrl: "https://picsum.photos/seed/baby1/600/600",
      price: 257.25,
    ),
    const ProductItem(
      id: "baby_002",
      title: "Banana Boat Simply Protect Water Resistant Baby Sun...",
      imageUrl: "https://picsum.photos/seed/baby2/600/600",
      price: 34,
    ),
    const ProductItem(
      id: "baby_003",
      title: "Banana Boat Kids Sunscreen Lotion",
      imageUrl: "https://picsum.photos/seed/baby3/600/600",
      price: 63,
    ),
  ];

  final adultCareItems = <ProductItem>[
    const ProductItem(
      id: "adult_001",
      title: "Durex Feel Thin Condoms 12 Per Pack",
      imageUrl: "https://picsum.photos/seed/adult1/600/600",
      price: 73.50,
    ),
    const ProductItem(
      id: "adult_002",
      title: "Durex Extended Pleasure Condoms 3 Per Pack",
      imageUrl: "https://picsum.photos/seed/adult2/600/600",
      price: 31.50,
    ),
    const ProductItem(
      id: "adult_003",
      title: "Durex Intense Pleasure Condoms 12 Per Pack",
      imageUrl: "https://picsum.photos/seed/adult3/600/600",
      price: 73.50,
    ),
  ];

  final hairCareItems = <ProductItem>[
    const ProductItem(
      id: "hair_001",
      title: "Migliorin Anti Dandruff Shampoo 200 mL",
      imageUrl: "https://picsum.photos/seed/hair1/600/600",
      price: 105.00,
    ),
    const ProductItem(
      id: "hair_002",
      title: "Mielle Rosemary Mint Hair Strengthening Shampoo",
      imageUrl: "https://picsum.photos/seed/hair2/600/600",
      price: 49.57,
    ),
    const ProductItem(
      id: "hair_003",
      title: "Nizoral 2% Anti Dandruff Shampoo 100 mL",
      imageUrl: "https://picsum.photos/seed/hair3/600/600",
      price: 55.00,
    ),
  ];

  final skincareItems = <ProductItem>[
    const ProductItem(
      id: "skin_001",
      title: "Bioderma Photoderm AR Hypoallergenic",
      imageUrl: "https://picsum.photos/seed/skin1/600/600",
      price: 118.65,
    ),
    const ProductItem(
      id: "skin_002",
      title: "Bioderma Photoderm Max SPF 100",
      imageUrl: "https://picsum.photos/seed/skin2/600/600",
      price: 144.90,
    ),
    const ProductItem(
      id: "skin_003",
      title: "Bioderma Photoderm (Water Resistant)",
      imageUrl: "https://picsum.photos/seed/skin3/600/600",
      price: 131.25,
    ),
  ];
  String _idOf(ProductItem p) {
    // demo: unique id by title (for real API -> product.id)
    return p.title;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: Stack(
          children: [
            Column(
              children: [
                PharmacyShopHeader(
                  title: widget.shop.name,
                  addressLabel: "KMM",
                  etaText: widget.shop.etaText,
                  ratingText: widget.shop.rating.toStringAsFixed(1),
                  ratingsCountText: widget.shop.reviewsText,
                  minOrderText: "10c",
                  minOrderLabel: "Min order",
                  deliveryFeeText: "7c",
                  deliveryFeeLabel: "Delivery",
                  deliveryByText: "ZaZaGoo",
                  deliveryByLabel: "Delivery By",
                  onBack: () => Navigator.pop(context),
                  onMenu: () {
                    MenuSheet.show(context);
                  },
                  onSearchChanged: (q) {},
                ),
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.only(bottom: 160),
                    children: [
                      ShopByCategorySection(
                        items: demoCategories,
                        onAllTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ShopByCategoryPage(
                                categories: demoCategories, // ✅ list
                                // title: widget.shop.name,    // агар мехоҳӣ header title
                              ),
                            ),
                          );
                        },
                        onTap: (cat) {},
                      ),
                      const SizedBox(height: 18),

                      ProductRowSection(
                        title: "Baby Care",
                        items: babyCareItems,
                        basket: basket,
                        idOf: _idOf,
                        onAll: () {},
                        onTapItem: (p) {},
                      ),

                      ProductRowSection(
                        title: "Adult Care",
                        items: adultCareItems,
                        basket: basket,
                        idOf: _idOf,
                        onAll: () {},
                        onTapItem: (p) {},
                      ),

                      ProductRowSection(
                        title: "Hair Care",
                        items: hairCareItems,
                        basket: basket,
                        idOf: _idOf,
                        onAll: () {},
                        onTapItem: (p) {},
                      ),

                      ProductRowSection(
                        title: "Skincare",
                        items: skincareItems,
                        basket: basket,
                        idOf: _idOf,
                        onAll: () {},
                        onTapItem: (p) {},
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // ✅ View Basket bar (кунҷи рост-поён)
            AnimatedBuilder(
              animation: basket,
              builder: (_, __) => ViewBasketBar(
                count: basket.totalItems,
                bottom: 80,
                right: 16,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => ViewBasketPage(
                        shopName: widget.shop.name,
                        basket: basket,
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ProductRowSection extends StatelessWidget {
  final String title;
  final List<ProductItem> items;
  final BasketController basket;
  final String Function(ProductItem) idOf;

  final VoidCallback? onAll;
  final void Function(ProductItem item)? onTapItem;

  const ProductRowSection({
    super.key,
    required this.title,
    required this.items,
    required this.basket,
    required this.idOf,
    this.onAll,
    this.onTapItem,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              InkWell(
                onTap: onAll,
                borderRadius: BorderRadius.circular(10),
                child: const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 6, vertical: 6),
                  child: Row(
                    children: [
                      Text(
                        "All",
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                        ),
                      ),
                      SizedBox(width: 6),
                      Icon(Icons.arrow_forward_ios_rounded, size: 14),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 260,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: items.length,
            separatorBuilder: (_, __) => const SizedBox(width: 14),
            itemBuilder: (context, i) {
              final it = items[i];
              final id = idOf(it);

              return _ProductCard(
                item: it,
                onTap: () => onTapItem?.call(it),
                addControl: AddControl(
                  basket: basket,
                  productId: id,
                  title: it.title,
                  price: it.price,
                  imageUrl: it.imageUrl,
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _ProductCard extends StatelessWidget {
  final ProductItem item;
  final VoidCallback? onTap;
  final Widget addControl;

  const _ProductCard({
    required this.item,
    this.onTap,
    required this.addControl,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 170,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(18),
                child: Container(
                  height: 150,
                  width: 170,
                  color: Colors.black.withOpacity(0.04),
                  child: Stack(
                    children: [
                      Positioned.fill(
                        child: Image.network(
                          item.imageUrl,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Center(
                            child: Icon(
                              Icons.image_not_supported_outlined,
                              color: Colors.black.withOpacity(0.35),
                            ),
                          ),
                        ),
                      ),
                      Positioned(right: 10, bottom: 10, child: addControl),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Text(
                item.title,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 13.5,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                "Ð ${item.price.toStringAsFixed(2)}",
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

///SHOP CATEGORY SECTION

class ShopByCategorySection extends StatelessWidget {
  final List<ShopCategoryItem> items;
  final VoidCallback? onAllTap;
  final void Function(ShopCategoryItem item)? onTap;

  const ShopByCategorySection({
    super.key,
    required this.items,
    this.onAllTap,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    const spacing = 12.0;
    const tileW = 70.0; // паҳнои карточка
    const tileH = 84.0; // баландии карточка

    // ✅ 3 row намоён
    final gridHeight = tileH * 3 + spacing * 2;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // header
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 12),
          child: Row(
            children: [
              const Expanded(
                child: Text(
                  "Shop by Category",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
                ),
              ),
              InkWell(
                onTap: onAllTap,
                borderRadius: BorderRadius.circular(10),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 6,
                  ),
                  child: Row(
                    children: const [
                      Text(
                        "All",
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                        ),
                      ),
                      SizedBox(width: 6),
                      Icon(Icons.arrow_forward_ios_rounded, size: 14),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),

        // ✅ Horizontal scroll grid
        SizedBox(
          height: gridHeight,
          child: GridView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal, // ✅ swipe left/right
            itemCount: items.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3, // ✅ ин ҷо = чанд "қатор" (rows)
              mainAxisSpacing: spacing, // фосила байни колоннаҳо
              crossAxisSpacing: spacing, // фосила байни қаторҳо
              childAspectRatio: 0.85,
            ),
            itemBuilder: (context, i) {
              final it = items[i];
              return SizedBox(
                width: tileW,
                height: tileH,
                child: _CategoryTile(item: it, onTap: () => onTap?.call(it)),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _CategoryTile extends StatelessWidget {
  final ShopCategoryItem item;
  final VoidCallback? onTap;

  const _CategoryTile({required this.item, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFFF4F5F6),
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(6),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.network(
                item.imageUrl,
                height: 32,
                width: 32,
                fit: BoxFit.contain,
              ),
              const SizedBox(height: 6),
              Text(
                item.title,
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

///DETAIL HEADER

class PharmacyShopHeader extends StatelessWidget {
  final String title; // "800 Pharma"
  final String addressLabel; // "KMM"
  final String etaText; // "25 - 35 mins"

  final String ratingText; // "4.7"
  final String ratingsCountText; // "1500+ Ratings"

  final String minOrderText; // "฿10"
  final String minOrderLabel; // "Min order"

  final String deliveryFeeText; // "฿7"
  final String deliveryFeeLabel; // "Delivery"

  final String deliveryByText; // "Careem"
  final String deliveryByLabel; // "Delivery By"

  final VoidCallback onBack;
  final VoidCallback onMenu;
  final ValueChanged<String>? onSearchChanged;

  const PharmacyShopHeader({
    super.key,
    required this.title,
    required this.addressLabel,
    required this.etaText,
    required this.ratingText,
    required this.ratingsCountText,
    required this.minOrderText,
    required this.minOrderLabel,
    required this.deliveryFeeText,
    required this.deliveryFeeLabel,
    required this.deliveryByText,
    required this.deliveryByLabel,
    required this.onBack,
    required this.onMenu,
    this.onSearchChanged,
  });

  @override
  Widget build(BuildContext context) {
    final green = const Color(0xFF0C6B52);

    Widget statCell({
      required Widget top,
      required String bottom,
      bool showDivider = true,
    }) {
      return Expanded(
        child: Row(
          children: [
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  top,
                  const SizedBox(height: 6),
                  Text(
                    bottom,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 12.5,
                      fontWeight: FontWeight.w800,
                      color: Colors.black.withOpacity(0.55),
                    ),
                  ),
                ],
              ),
            ),
            if (showDivider)
              Container(
                width: 1,
                height: 34,
                color: Colors.black.withOpacity(0.08),
              ),
          ],
        ),
      );
    }

    return Column(
      children: [
        const SizedBox(height: 6),

        // ✅ top bar: back + title + menu
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 8),
          child: Row(
            children: [
              _IconBox(icon: Icons.arrow_back_ios_new_rounded, onTap: onBack),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              _MenuBox(onTap: onMenu),
            ],
          ),
        ),

        // ✅ deliver row
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.04),
            border: Border(
              top: BorderSide(color: Colors.black.withOpacity(0.06)),
              bottom: BorderSide(color: Colors.black.withOpacity(0.06)),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.delivery_dining_rounded,
                size: 20,
                color: Colors.black.withOpacity(0.65),
              ),
              const SizedBox(width: 10),
              Text(
                "Deliver to ",
                style: TextStyle(
                  fontWeight: FontWeight.w800,
                  color: Colors.black.withOpacity(0.70),
                ),
              ),
              Text(
                addressLabel,
                style: const TextStyle(fontWeight: FontWeight.w900),
              ),
              const SizedBox(width: 10),
              Text(
                etaText,
                style: TextStyle(
                  fontWeight: FontWeight.w900,
                  color: Colors.black.withOpacity(0.70),
                ),
              ),
            ],
          ),
        ),

        // ✅ stats row
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
          child: Row(
            children: [
              statCell(
                top: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.star_rounded, color: green, size: 18),
                    const SizedBox(width: 4),
                    Text(
                      ratingText,
                      style: TextStyle(
                        fontWeight: FontWeight.w900,
                        color: green,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
                bottom: ratingsCountText,
              ),
              statCell(
                top: Text(
                  minOrderText,
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 16,
                  ),
                ),
                bottom: minOrderLabel,
              ),
              statCell(
                top: Text(
                  deliveryFeeText,
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 16,
                  ),
                ),
                bottom: deliveryFeeLabel,
              ),
              statCell(
                showDivider: false,
                top: Text(
                  deliveryByText,
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 16,
                  ),
                ),
                bottom: deliveryByLabel,
              ),
            ],
          ),
        ),

        // ✅ search
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
          child: _SearchBar(hint: "Search $title", onChanged: onSearchChanged),
        ),

        Divider(height: 1, thickness: 1, color: Colors.black.withOpacity(0.06)),
      ],
    );
  }
}

class _SearchBar extends StatelessWidget {
  final String hint;
  final ValueChanged<String>? onChanged;

  const _SearchBar({required this.hint, this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 46,
      padding: const EdgeInsets.symmetric(horizontal: 14),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.04),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.black.withOpacity(0.10)),
      ),
      child: Row(
        children: [
          Icon(Icons.search_rounded, color: Colors.black.withOpacity(0.45)),
          const SizedBox(width: 10),
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
                isDense: true,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _IconBox extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _IconBox({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final border = Colors.black.withOpacity(0.12);

    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: border),
          ),
          child: Icon(icon, size: 20),
        ),
      ),
    );
  }
}

class _MenuBox extends StatelessWidget {
  final VoidCallback onTap;
  const _MenuBox({required this.onTap});

  @override
  Widget build(BuildContext context) {
    const green = Color(0xFF0C6B52);

    return Material(
      color: green,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: const SizedBox(
          width: 44,
          height: 44,
          child: Center(
            child: Icon(Icons.menu_rounded, color: Colors.white, size: 22),
          ),
        ),
      ),
    );
  }
}
