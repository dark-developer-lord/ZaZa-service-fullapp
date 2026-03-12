import 'package:flutter/material.dart';
import 'package:zaza_app/Basket/view/basket_controller.dart';
import 'package:zaza_app/Basket/view/view_basket_bar.dart';
import 'package:zaza_app/Basket/view/view_basket_page.dart';
import 'package:zaza_app/Cart/view/add_to_cart_controller.dart';
import 'package:zaza_app/ServicePage/Pharmacy/models/product_model.dart';
import 'package:zaza_app/ShopByCategory/models/shop_category_model.dart';
import 'package:zaza_app/ShopByCategory/view/shop_category_page.dart';

class SuperMarketDetailPage extends StatefulWidget {
  final String shopName;
  final String etaText;
  final double rating;
  final String ratingsCountText;
  final String minOrderText;
  final String deliveryText;
  final String deliveryByText;
  final List<ShopCategoryItem> categories;

  const SuperMarketDetailPage({
    super.key,
    required this.shopName,
    required this.etaText,
    required this.rating,
    required this.ratingsCountText,
    required this.minOrderText,
    required this.deliveryText,
    required this.deliveryByText,
    required this.categories,
  });

  @override
  State<SuperMarketDetailPage> createState() => _SuperMarketDetailPageState();
}

class _SuperMarketDetailPageState extends State<SuperMarketDetailPage> {
  final basket = BasketController();

  // ✅ DEMO PRODUCTS (мисли расм)
  final fruitsVegItems = const <ProductItem>[
    ProductItem(
      id: "fv_001",
      title: "Anar Seed",
      imageUrl: "https://picsum.photos/seed/pom/600/600",
      price: 10.99,
    ),
    ProductItem(
      id: "fv_002",
      title: "Pineapple Cubes",
      imageUrl: "https://picsum.photos/seed/pine/600/600",
      price: 10.99,
    ),
    ProductItem(
      id: "fv_003",
      title: "Sunlee Ready To Corn Cuts",
      imageUrl: "https://picsum.photos/seed/corn/600/600",
      price: 7.50,
    ),
  ];

  final bakeryItems = const <ProductItem>[
    ProductItem(
      id: "bak_001",
      title: "Kawan / KG Paratha 400 g",
      imageUrl: "https://picsum.photos/seed/paratha/600/600",
      price: 20.99,
    ),
    ProductItem(
      id: "bak_002",
      title: "L'Usine White Sandwich Roll",
      imageUrl: "https://picsum.photos/seed/sandwich/600/600",
      price: 2.50,
    ),
    ProductItem(
      id: "bak_003",
      title: "Yaumi Plain Roll Sandwich Bread",
      imageUrl: "https://picsum.photos/seed/bread/600/600",
      price: 3.50,
    ),
  ];

  final adultCareItems = const <ProductItem>[
    ProductItem(
      id: "adult_001",
      title: "Durex Feel Thin Condoms 12 Per Pack",
      imageUrl: "https://picsum.photos/seed/adult1/600/600",
      price: 73.50,
    ),
    ProductItem(
      id: "adult_002",
      title: "Durex Extended Pleasure Condoms 3 Per Pack",
      imageUrl: "https://picsum.photos/seed/adult2/600/600",
      price: 31.50,
    ),
    ProductItem(
      id: "adult_003",
      title: "Durex Intense Pleasure Condoms 12 Per Pack",
      imageUrl: "https://picsum.photos/seed/adult3/600/600",
      price: 73.50,
    ),
  ];

  final sweetSnacksItems = const <ProductItem>[
    ProductItem(
      id: "sweet_001",
      title: "Chocolate Brownie Bites",
      imageUrl: "https://picsum.photos/seed/sweet1/600/600",
      price: 6.50,
    ),
    ProductItem(
      id: "sweet_002",
      title: "Mini Cookies Pack",
      imageUrl: "https://picsum.photos/seed/sweet2/600/600",
      price: 4.25,
    ),
    ProductItem(
      id: "sweet_003",
      title: "Milk Chocolate Bar",
      imageUrl: "https://picsum.photos/seed/sweet3/600/600",
      price: 3.10,
    ),
  ];

  final saltySnacksItems = const <ProductItem>[
    ProductItem(
      id: "salty_001",
      title: "Classic Potato Chips",
      imageUrl: "https://picsum.photos/seed/salty1/600/600",
      price: 5.00,
    ),
    ProductItem(
      id: "salty_002",
      title: "Salted Peanuts",
      imageUrl: "https://picsum.photos/seed/salty2/600/600",
      price: 7.25,
    ),
    ProductItem(
      id: "salty_003",
      title: "Crackers (Family Pack)",
      imageUrl: "https://picsum.photos/seed/salty3/600/600",
      price: 4.75,
    ),
  ];

  final breakfastItems = const <ProductItem>[
    ProductItem(
      id: "break_001",
      title: "Corn Flakes 500g",
      imageUrl: "https://picsum.photos/seed/break1/600/600",
      price: 12.90,
    ),
    ProductItem(
      id: "break_002",
      title: "Oats (Quick Cook)",
      imageUrl: "https://picsum.photos/seed/break2/600/600",
      price: 9.40,
    ),
    ProductItem(
      id: "break_003",
      title: "Honey 250g",
      imageUrl: "https://picsum.photos/seed/break3/600/600",
      price: 15.30,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      body: SafeArea(
        bottom: false,
        child: Stack(
          children: [
            Column(
              children: [
                SupermarketShopHeader(
                  title: widget.shopName,
                  addressLabel: "KMM",
                  etaText: widget.etaText,
                  ratingText: widget.rating.toStringAsFixed(1),
                  ratingsCountText: widget.ratingsCountText,
                  minOrderText: widget.minOrderText,
                  minOrderLabel: "Min order",
                  deliveryFeeText: widget.deliveryText,
                  deliveryFeeLabel: "Delivery",
                  deliveryByText: widget.deliveryByText,
                  deliveryByLabel: "Delivery By",
                  onBack: () => Navigator.pop(context),
                  onMenu: () {},
                  onSearchChanged: (q) {},
                ),

                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.only(
                      bottom: 30,
                    ), // ✅ ҷой барои bar
                    children: [
                      ShopByCategorySection(
                        items: widget.categories,
                        onAllTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ShopByCategoryPage(
                                categories: widget.categories,
                              ),
                            ),
                          );
                        },
                        onTap: (cat) {},
                      ),

                      ProductRowSection(
                        title: "Fruits & Vegetables",
                        items: fruitsVegItems,
                        basket: basket,
                        idOf: (p) => p.id,
                        onAll: () {},
                        onTapItem: (p) {},
                      ),
                      ProductRowSection(
                        title: "Bakery",
                        items: bakeryItems,
                        basket: basket,
                        idOf: (p) => p.id,
                        onAll: () {},
                        onTapItem: (p) {},
                      ),
                      ProductRowSection(
                        title: "Adult Care",
                        items: adultCareItems,
                        basket: basket,
                        idOf: (p) => p.id,
                        onAll: () {},
                        onTapItem: (p) {},
                      ),
                      ProductRowSection(
                        title: "Sweet Snacks",
                        items: sweetSnacksItems,
                        basket: basket,
                        idOf: (p) => p.id,
                        onAll: () {},
                        onTapItem: (p) {},
                      ),
                      ProductRowSection(
                        title: "Salty Snacks",
                        items: saltySnacksItems,
                        basket: basket,
                        idOf: (p) => p.id,
                        onAll: () {},
                        onTapItem: (p) {},
                      ),
                      ProductRowSection(
                        title: "Breakfast",
                        items: breakfastItems,
                        basket: basket,
                        idOf: (p) => p.id,
                        onAll: () {},
                        onTapItem: (p) {},
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // ✅ Overlay ViewBasketBar (мисли Careem)
            AnimatedBuilder(
              animation: basket,
              builder: (_, __) {
                if (basket.totalItems == 0) return const SizedBox.shrink();
                return Positioned(
                  right: 16,
                  bottom: 50,
                  child: ViewBasketBar(
                    count: basket.totalItems,
                    bottom: 0,
                    right: 0,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ViewBasketPage(
                            shopName: widget.shopName,
                            basket: basket,
                          ),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

///PRODUCT ROW
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
                    fontSize: 20,
                    fontWeight: FontWeight.w500,
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
                          fontWeight: FontWeight.w500,
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
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                "${item.price.toStringAsFixed(2)} c",
                style: const TextStyle(
                  fontSize: 15,
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

/// =======================
/// HEADER (мисли расм, бе discount)
/// =======================
class SupermarketShopHeader extends StatelessWidget {
  final String title;

  final String addressLabel; // "KMM"
  final String etaText; // "30 - 40 mins"

  final String ratingText; // "3.9"
  final String ratingsCountText; // "4400+ Ratings"

  final String minOrderText; // "৳ 10"
  final String minOrderLabel; // "Min order"

  final String deliveryFeeText; // "৳ 7"
  final String deliveryFeeLabel; // "Delivery"

  final String deliveryByText; // "Careem"
  final String deliveryByLabel; // "Delivery By"

  final VoidCallback onBack;
  final VoidCallback onMenu;
  final ValueChanged<String> onSearchChanged;

  const SupermarketShopHeader({
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
    required this.onSearchChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFF7F7F7),
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 12),
      child: Column(
        children: [
          // top row: back + title + menu
          Row(
            children: [
              _SquareIconBtn(
                icon: Icons.arrow_back_ios_new_rounded,
                onTap: onBack,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              _SquareIconBtn(icon: Icons.menu_rounded, onTap: onMenu),
            ],
          ),

          const SizedBox(height: 10),

          // Deliver to KMM 30 - 40 mins
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.03),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.black.withOpacity(0.06)),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.pedal_bike_rounded,
                  size: 18,
                  color: Colors.black.withOpacity(0.65),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    "Deliver to $addressLabel  $etaText",
                    style: TextStyle(
                      fontWeight: FontWeight.w500,
                      color: Colors.black.withOpacity(0.70),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 10),

          // 4 info boxes card (бе discount!)
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.black.withOpacity(0.08)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: _InfoBox(
                    top: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.star_rounded,
                          size: 18,
                          color: Colors.black.withOpacity(0.70),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          ratingText,
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    bottom: ratingsCountText,
                  ),
                ),
                _VLine(),
                Expanded(
                  child: _InfoBox(
                    top: Text(
                      minOrderText,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                      ),
                    ),
                    bottom: minOrderLabel,
                  ),
                ),
                _VLine(),
                Expanded(
                  child: _InfoBox(
                    top: Text(
                      deliveryFeeText,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                      ),
                    ),
                    bottom: deliveryFeeLabel,
                  ),
                ),
                _VLine(),
                Expanded(
                  child: _InfoBox(
                    top: Text(
                      deliveryByText,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                      ),
                    ),
                    bottom: deliveryByLabel,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 10),

          // search bar
          Container(
            height: 46,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.black.withOpacity(0.10)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    onChanged: onSearchChanged,
                    decoration: InputDecoration(
                      hintText: "Search $title",
                      hintStyle: TextStyle(
                        color: Colors.black.withOpacity(0.35),
                        fontWeight: FontWeight.w600,
                      ),
                      border: InputBorder.none,
                      isDense: true,
                    ),
                  ),
                ),
                Icon(
                  Icons.search_rounded,
                  color: Colors.black.withOpacity(0.60),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SquareIconBtn extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  const _SquareIconBtn({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
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
            border: Border.all(color: Colors.black.withOpacity(0.10)),
          ),
          child: Icon(icon, size: 20),
        ),
      ),
    );
  }
}

class _InfoBox extends StatelessWidget {
  final Widget top;
  final String bottom;
  const _InfoBox({required this.top, required this.bottom});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          top,
          const SizedBox(height: 6),
          Text(
            bottom,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontWeight: FontWeight.w500,
              fontSize: 12.5,
              color: Colors.black.withOpacity(0.55),
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
      width: 1,
      height: 56,
      color: Colors.black.withOpacity(0.1),
    );
  }
}

/// =======================
/// SHOP BY CATEGORY (мисли расм)
/// =======================

class ShopByCategorySection extends StatelessWidget {
  final List<ShopCategoryItem> items;
  final VoidCallback onAllTap;
  final void Function(ShopCategoryItem item) onTap;

  const ShopByCategorySection({
    super.key,
    required this.items,
    required this.onAllTap,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final preview = items.length > 9 ? items.take(9).toList() : items;

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Expanded(
                child: Text(
                  "Shop by Category",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
                ),
              ),
              InkWell(
                onTap: onAllTap,
                borderRadius: BorderRadius.circular(10),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 6,
                  ),
                  child: Row(
                    children: [
                      Text(
                        "All",
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                          color: const Color(0xFF0C6B52),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Icon(
                        Icons.arrow_forward_ios_rounded,
                        size: 14,
                        color: const Color(0xFF0C6B52),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: preview.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 4,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.05,
            ),
            itemBuilder: (_, i) {
              final it = preview[i];
              return _CategoryTile(item: it, onTap: () => onTap(it));
            },
          ),
        ],
      ),
    );
  }
}

class _CategoryTile extends StatelessWidget {
  final ShopCategoryItem item;
  final VoidCallback onTap;
  const _CategoryTile({required this.item, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.black.withOpacity(0.06)),
          ),
          padding: const EdgeInsets.fromLTRB(10, 12, 10, 10),
          child: Column(
            children: [
              Expanded(
                child: Center(
                  child: Image.network(
                    item.imageUrl,
                    fit: BoxFit.contain,
                    errorBuilder: (_, __, ___) => Icon(
                      Icons.image_not_supported_outlined,
                      color: Colors.black.withOpacity(0.25),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                item.title,
                maxLines: 1,
                overflow: TextOverflow.visible,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontWeight: FontWeight.w500,
                  fontSize: 11,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
