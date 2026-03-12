import 'package:flutter/material.dart';
import 'package:zaza_app/Basket/view/basket_controller.dart';
import 'package:zaza_app/DeliverSheet/view/deliver_sheet.dart';
import 'package:zaza_app/Menu/view/menu_sheet.dart';
import 'package:zaza_app/Address/storage/adress_store.dart';
import 'package:zaza_app/ServicePage/Food/RestaurantPage/view/restaurant_detail_page.dart';
import 'package:zaza_app/ServicePage/Food/models/brand_model.dart';
import 'package:zaza_app/ServicePage/Food/models/most_ordered_model.dart';
import 'package:zaza_app/ServicePage/Food/models/nearby_item.dart';
import 'package:zaza_app/ServicePage/Food/models/restaurant_model.dart';
import 'package:zaza_app/ServicePage/Food/view/all_nearby_resto_page.dart';
import 'package:zaza_app/ServicePage/Food/view/all_restaurant_page.dart';

class FoodMainPage extends StatefulWidget {
  const FoodMainPage({super.key});

  @override
  State<FoodMainPage> createState() => _FoodMainPageState();
}

class _FoodMainPageState extends State<FoodMainPage> {
  final basket = BasketController();

  @override
  void initState() {
    super.initState();
    // ✅ вақте адрес иваз мешавад, header auto update шавад
    AddressStore.I.addListener(_addrRefresh);

    Future.delayed(const Duration(seconds: 8), () {
      if (!mounted) return;
      setState(() {
        _showAddressWarning = false;
      });
    });
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
      // userName: "Muhammad", // ё widget.userName агар дорӣ
      initialAddresses: AddressStore.I.items,
      onChanged: (list) async {
        AddressStore.I.setAll(list);
      },
    );

    if (picked == null) return;

    // Store already does it, but ok:
    AddressStore.I.setDefault(picked);

    if (mounted) setState(() {});
  }

  // ====== DEMO DATA (unchanged) ======
  final demoMostOrdered = [
    const MostOrderedItem(
      title: "McDonald's - Tasjeel",
      cuisine: "American, Fast Food",
      imageUrl: "https://picsum.photos/seed/mc/800/400",
      rating: 4.7,
      reviews: 999,
      eta: "25 - 35 mins",
      distance: "1.4 km",
      badge: "15% off\nMembers Only",
    ),
    const MostOrderedItem(
      title: "Starbucks - Bars",
      cuisine: "American, Coffee",
      imageUrl: "https://picsum.photos/seed/sb/800/400",
      rating: 4.8,
      reviews: 999,
      eta: "15 - 25 mins",
      distance: "2.1 km",
      badge: "15 off\nMembers Only",
    ),
    const MostOrderedItem(
      title: "McDonald's - Tasjeel",
      cuisine: "American, Fast Food",
      imageUrl: "https://picsum.photos/seed/mc/800/400",
      rating: 4.7,
      reviews: 999,
      eta: "25 - 35 mins",
      distance: "1.4 km",
      badge: "15% off\nMembers Only",
    ),
    const MostOrderedItem(
      title: "Starbucks - Bars",
      cuisine: "American, Coffee",
      imageUrl: "https://picsum.photos/seed/sb/800/400",
      rating: 4.8,
      reviews: 999,
      eta: "15 - 25 mins",
      distance: "2.1 km",
      badge: "15 off\nMembers Only",
    ),
  ];

  final demoBrands = <BrandItem>[
    const BrandItem(
      name: "Allo Beirut",
      logoUrl: "https://picsum.photos/seed/allo/160",
    ),
    const BrandItem(
      name: "Costa",
      logoUrl: "https://picsum.photos/seed/costa/160",
    ),
    const BrandItem(
      name: "Breakfast Shop",
      logoUrl: "https://picsum.photos/seed/break/160",
    ),
  ];

  final demoNearby = <NearbyItem>[
    const NearbyItem(
      title: "Grill Bite Restaurant",
      imageUrl: "https://picsum.photos/seed/grill/900/600",
      rating: 4.7,
      eta: "20 - 30 mins",
      cuisine: "Indian, BBQ & Grill",
      tag: "New",
    ),
    const NearbyItem(
      title: "Harat Al Sham",
      imageUrl: "https://picsum.photos/seed/sham/900/600",
      rating: 4.6,
      eta: "40 - 50 mins",
      cuisine: "Arabic, BBQ & Grill",
      badge: "30% off",
    ),
  ];

  final demoRestaurants = <RestaurantItem>[
    const RestaurantItem(
      name: "Domino's Pizza",
      cuisine: "American, Pizza",
      imageUrl: "https://picsum.photos/seed/pizza/800/800",
      rating: 4.7,
      reviews: 461,
      eta: "30 - 40 mins",
      distanceKm: 3.2,
      deliveryFee: 7.0,
    ),
    const RestaurantItem(
      name: "McDonald's - Tasjeel",
      cuisine: "American, Fast Food",
      imageUrl: "https://picsum.photos/seed/burger/800/800",
      rating: 4.7,
      reviews: 999,
      eta: "25 - 35 mins",
      distanceKm: 1.4,
      deliveryFee: 7.5,
    ),
  ];

  void _openRestaurant({
    required String name,
    required String cuisine,
    required String imageUrl,
    required double rating,
    required int reviews,
    required String eta,
    required double distanceKm,
    required double deliveryFee,
    String? logoUrl,
  }) {
    final r = RestaurantItem(
      name: name,
      cuisine: cuisine,
      imageUrl: imageUrl,
      rating: rating,
      reviews: reviews,
      eta: eta,
      distanceKm: distanceKm,
      deliveryFee: deliveryFee,
    );

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => RestaurantDetailPage(
          restaurant: r,
          basket: basket,
          logoUrl: logoUrl,
        ),
      ),
    );
  }

  bool _showAddressWarning = true;

  @override
  Widget build(BuildContext context) {
    final addr = AddressStore.I.selected;

    final deliverLabel = addr?.label ?? "Select address";
    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // FoodHeader(
            //   deliverLabel: deliverLabel, // ✅
            //   onClose: () => Navigator.pop(context),
            //   onMenuTap: () {
            //     MenuSheet.show(context);
            //   },
            //   onAddressTap: _openAddressSheet,
            //   onSearchChanged: (q) {},
            // ),
            FoodHeader(
              deliverLabel: deliverLabel,
              onClose: () => Navigator.pop(context),
              onMenuTap: () {
                MenuSheet.show(context);
              },
              onAddressTap: _openAddressSheet,
              onSearchChanged: (q) {},

              // 👇 address warning
              showAddressWarning: _showAddressWarning,
              warningText:
                  "Is this the right delivery address? It seems like you're a bit far away",
              onDismissWarning: () {
                setState(() {
                  _showAddressWarning = false;
                });
              },
            ),
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  const SizedBox(height: 10),
                  const _CategoriesTwoRows(),
                  const SizedBox(height: 20),

                  MostOrderedSection(
                    items: demoMostOrdered,
                    onTap: (it) {
                      _openRestaurant(
                        name: it.title,
                        cuisine: it.cuisine,
                        imageUrl: it.imageUrl,
                        rating: it.rating,
                        reviews: it.reviews,
                        eta: it.eta,
                        distanceKm:
                            double.tryParse(
                              it.distance.replaceAll(" km", "").trim(),
                            ) ??
                            1.0,
                        deliveryFee: 7.5,
                      );
                    },
                  ),

                  PopularBrandsSection(
                    brands: demoBrands,
                    onTapBrand: (b) {
                      _openRestaurant(
                        name: b.name,
                        cuisine: "Popular brand",
                        imageUrl: b.logoUrl,
                        rating: 4.7,
                        reviews: 999,
                        eta: "25 - 35 mins",
                        distanceKm: 1.2,
                        deliveryFee: 6.0,
                        logoUrl: b.logoUrl,
                      );
                    },
                  ),

                  const SizedBox(height: 20),

                  AllRestaurantsSection(
                    items: demoRestaurants,
                    onViewAll: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) =>
                              AllRestaurantsPage(items: demoRestaurants),
                        ),
                      );
                    },
                    onTap: (r) {
                      _openRestaurant(
                        name: r.name,
                        cuisine: r.cuisine,
                        imageUrl: r.imageUrl,
                        rating: r.rating,
                        reviews: r.reviews,
                        eta: r.eta,
                        distanceKm: r.distanceKm,
                        deliveryFee: r.deliveryFee,
                      );
                    },
                  ),

                  NearbySection(
                    items: demoNearby,
                    onViewAll: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => NearbyPage(items: demoNearby),
                        ),
                      );
                    },
                    onTapItem: (it) {
                      _openRestaurant(
                        name: it.title,
                        cuisine: it.cuisine,
                        imageUrl: it.imageUrl,
                        rating: it.rating,
                        reviews: 999,
                        eta: it.eta,
                        distanceKm: 1.5,
                        deliveryFee: 7.0,
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// =======================
/// FOOD HEADER (updated)
/// =======================

class FoodHeader extends StatelessWidget {
  final String deliverLabel;
  final VoidCallback? onClose;
  final VoidCallback? onAddressTap;
  final VoidCallback? onMenuTap;
  final ValueChanged<String>? onSearchChanged;

  final bool showAddressWarning;
  final String warningText;
  final VoidCallback? onDismissWarning;

  const FoodHeader({
    super.key,
    required this.deliverLabel,
    this.onClose,
    this.onAddressTap,
    this.onMenuTap,
    this.onSearchChanged,
    this.showAddressWarning = false,
    this.warningText =
        "Is this the right delivery address? It seems like you're a bit far away",
    this.onDismissWarning,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      bottom: false,
      child: Stack(
        alignment: Alignment.topCenter,
        children: [
          /// HEADER CONTENT
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 20),
            child: Column(
              children: [
                Row(
                  children: [
                    _IconSquare(
                      icon: Icons.close,
                      bg: Colors.white,
                      fg: Colors.black87,
                      border: Colors.black12,
                      onTap: onClose,
                    ),
                    const SizedBox(width: 12),

                    Expanded(
                      child: InkWell(
                        onTap: onAddressTap,
                        borderRadius: BorderRadius.circular(12),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 8,
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                "Deliver to ",
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.black.withOpacity(0.65),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              Flexible(
                                child: Text(
                                  deliverLabel,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Icon(
                                Icons.keyboard_arrow_down_rounded,
                                size: 22,
                                color: Colors.black.withOpacity(0.65),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(width: 12),

                    _IconSquare(
                      icon: Icons.menu_rounded,
                      bg: const Color(0xFF0C6B52),
                      fg: Colors.white,
                      border: Colors.transparent,
                      onTap: onMenuTap,
                    ),
                  ],
                ),

                const SizedBox(height: 18),

                /// SEARCH BAR
                Container(
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: Colors.black12),
                  ),
                  child: TextField(
                    onChanged: onSearchChanged,
                    decoration: InputDecoration(
                      hintText: "Search food",
                      border: InputBorder.none,
                      prefixIcon: const Icon(Icons.search),
                    ),
                  ),
                ),
              ],
            ),
          ),

          /// ADDRESS WARNING BANNER
          if (showAddressWarning)
            Positioned(
              top: 56, // 👈 ҳамин чиз мобайнро дуруст мекунад
              left: 16,
              right: 16,
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  /// banner body
                  Container(
                    padding: const EdgeInsets.fromLTRB(18, 18, 18, 18),
                    decoration: BoxDecoration(
                      color: const Color(0xFF004D40),
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            warningText,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        GestureDetector(
                          onTap: onDismissWarning,
                          child: const Icon(
                            Icons.close,
                            color: Colors.white,
                            size: 26,
                          ),
                        ),
                      ],
                    ),
                  ),

                  /// arrow pointer
                  Positioned(
                    top: -10,
                    left: 0,
                    right: 0,
                    child: Center(
                      child: CustomPaint(
                        size: const Size(20, 10),
                        painter: _BannerArrowPainter(),
                      ),
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

class _BannerArrowPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = const Color(0xFF004D40);

    final path = Path()
      ..moveTo(size.width / 2, 0)
      ..lineTo(0, size.height)
      ..lineTo(size.width, size.height)
      ..close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}

class _IconSquare extends StatelessWidget {
  final IconData icon;
  final Color bg;
  final Color fg;
  final Color border;
  final VoidCallback? onTap;

  const _IconSquare({
    required this.icon,
    required this.bg,
    required this.fg,
    required this.border,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
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
            border: Border.all(color: border),
          ),
          child: Icon(icon, color: fg, size: 22),
        ),
      ),
    );
  }
}

/// ALL RESTAURANTS ///

class AllRestaurantsSection extends StatelessWidget {
  final List<RestaurantItem> items;
  final VoidCallback onViewAll;
  final void Function(RestaurantItem item)? onTap;

  const AllRestaurantsSection({
    super.key,
    required this.items,
    required this.onViewAll,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final preview = items.take(3).toList();

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 18, 16, 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Expanded(
                child: Text(
                  "All Restaurants",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
                ),
              ),
              SizedBox(
                height: 40,
                child: OutlinedButton(
                  onPressed: onViewAll,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.black,
                    side: BorderSide(color: Colors.black.withOpacity(0.20)),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    backgroundColor: Colors.white.withOpacity(0.75),
                  ),
                  child: const Text(
                    "View All",
                    style: TextStyle(fontWeight: FontWeight.w500, fontSize: 14),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          ...List.generate(preview.length, (i) {
            final it = preview[i];
            return Column(
              children: [
                _RestaurantRow(item: it, onTap: () => onTap?.call(it)),
                if (i != preview.length - 1)
                  Divider(height: 22, color: Colors.black.withOpacity(0.08)),
              ],
            );
          }),
        ],
      ),
    );
  }
}

class _RestaurantRow extends StatelessWidget {
  final RestaurantItem item;
  final VoidCallback? onTap;

  const _RestaurantRow({required this.item, this.onTap});

  @override
  Widget build(BuildContext context) {
    final green = const Color(0xFF0C6B52);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: Image.network(
                item.imageUrl,
                width: 92,
                height: 92,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(width: 14),

            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 4),

                  Text(
                    item.cuisine,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: Colors.black.withOpacity(0.55),
                    ),
                  ),

                  const SizedBox(height: 8),

                  Row(
                    children: [
                      Icon(Icons.star_rounded, size: 18, color: green),
                      const SizedBox(width: 4),
                      Text(
                        item.rating.toStringAsFixed(1),
                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          color: green,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        "(${item.reviews})",
                        style: TextStyle(
                          fontWeight: FontWeight.w800,
                          color: Colors.black.withOpacity(0.5),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        "·  ${item.eta}",
                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          color: green,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 8),

                  Row(
                    children: [
                      Text(
                        "${item.distanceKm.toStringAsFixed(1)} km",
                        style: TextStyle(
                          fontWeight: FontWeight.w800,
                          color: Colors.black.withOpacity(0.5),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Icon(
                        Icons.pedal_bike_rounded,
                        size: 18,
                        color: Colors.black.withOpacity(0.45),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        item.deliveryFee.toStringAsFixed(1),
                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          color: Colors.black.withOpacity(0.55),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// NEARBY SECTION ///

class NearbySection extends StatelessWidget {
  final List<NearbyItem> items;

  final VoidCallback? onViewAll;
  final void Function(NearbyItem item)? onTapItem;

  const NearbySection({
    super.key,
    required this.items,
    this.onViewAll,
    this.onTapItem,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      // padding: const EdgeInsets.fromLTRB(16, 18, 16, 16),
      decoration: BoxDecoration(
        // borderRadius: BorderRadius.circular(18),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFDFFFEF), Color(0xFFCFF7E8)],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ✅ Banner row (left text + button) + right stopwatch
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 18, 16, 16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Nearby",
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        "Savor the speedy goodness!",
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: Colors.black.withOpacity(0.65),
                        ),
                      ),
                      const SizedBox(height: 14),

                      SizedBox(
                        height: 42,
                        child: OutlinedButton(
                          onPressed: onViewAll,
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.black,
                            side: BorderSide(
                              color: Colors.black.withOpacity(0.20),
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                            backgroundColor: Colors.white.withOpacity(0.75),
                          ),
                          child: const Text(
                            "View All",
                            style: TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.network(
                    "https://picsum.photos/seed/stopwatch/180/180",
                    width: 110,
                    height: 110,
                    fit: BoxFit.cover,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 14),

          // ✅ Cards INSIDE the same container
          SizedBox(
            height: 270,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(width: 14),
              itemBuilder: (context, i) {
                final it = items[i];

                return Padding(
                  padding: EdgeInsets.only(
                    left: i == 0 ? 16 : 0,
                    right: i == items.length - 1 ? 16 : 0,
                  ),
                  child: _NearbyCard(
                    item: it,
                    onTap: () => onTapItem?.call(it),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _NearbyCard extends StatelessWidget {
  final NearbyItem item;
  final VoidCallback? onTap;

  const _NearbyCard({required this.item, this.onTap});

  @override
  Widget build(BuildContext context) {
    final green = const Color(0xFF0C6B52);

    return SizedBox(
      width: 250,
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
                child: Stack(
                  children: [
                    Image.network(
                      item.imageUrl,
                      height: 150,
                      width: 250,
                      fit: BoxFit.cover,
                    ),
                    if (item.badge != null)
                      Positioned(
                        left: 12,
                        bottom: 12,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.92),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            item.badge!,
                            style: const TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 13,
                              color: Colors.redAccent,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              Text(
                item.title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.star_rounded, size: 18, color: green),
                  const SizedBox(width: 4),
                  Text(
                    item.tag ?? item.rating.toStringAsFixed(1),
                    style: TextStyle(fontWeight: FontWeight.w900, color: green),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    "•",
                    style: TextStyle(
                      fontWeight: FontWeight.w900,
                      color: Colors.black.withOpacity(0.35),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    item.eta,
                    style: TextStyle(fontWeight: FontWeight.w900, color: green),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                item.cuisine,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: Colors.black.withOpacity(0.55),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// POPULAR BRANDS ///

class PopularBrandsSection extends StatelessWidget {
  final List<BrandItem> brands;
  final void Function(BrandItem b)? onTapBrand;

  const PopularBrandsSection({
    super.key,
    required this.brands,
    this.onTapBrand,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 18, 16, 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Popular Brands",
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 12),

          SizedBox(
            height: 86,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: brands.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, i) {
                final b = brands[i];
                return _BrandTile(brand: b, onTap: () => onTapBrand?.call(b));
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _BrandTile extends StatelessWidget {
  final BrandItem brand;
  final VoidCallback? onTap;

  const _BrandTile({required this.brand, this.onTap});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 92,
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(14),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.black12),
            ),
            padding: const EdgeInsets.all(10),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.network(
                brand.logoUrl,
                fit: BoxFit.contain,
                errorBuilder: (_, __, ___) => Center(
                  child: Text(
                    brand.name,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// MOST ORDERES FOOD ///

class MostOrderedSection extends StatelessWidget {
  final List<MostOrderedItem> items;
  final VoidCallback? onSeeAll;
  final void Function(MostOrderedItem item)? onTap;

  const MostOrderedSection({
    super.key,
    required this.items,
    this.onSeeAll,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFDDF6F2), // light mint like screenshot
      padding: const EdgeInsets.only(top: 16, bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                Text(
                  "Most Ordered ",
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
                ),
                Text("😋", style: TextStyle(fontSize: 20)),
              ],
            ),
          ),
          const SizedBox(height: 6),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              "Your guide to popular dishes making waves!",
              style: TextStyle(
                fontSize: 13,
                color: Colors.black.withOpacity(0.60),
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(height: 14),

          SizedBox(
            height: 230,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              scrollDirection: Axis.horizontal,
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, i) {
                final it = items[i];
                return _MostOrderedCard(
                  rank: i + 1,
                  item: it,
                  onTap: () => onTap?.call(it),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _MostOrderedCard extends StatelessWidget {
  final int rank;
  final MostOrderedItem item;
  final VoidCallback? onTap;

  const _MostOrderedCard({required this.rank, required this.item, this.onTap});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 310,
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // image + rank overlay + badge
              SizedBox(
                height: 120,
                child: Stack(
                  children: [
                    Positioned.fill(
                      child: Image.network(item.imageUrl, fit: BoxFit.cover),
                    ),

                    // dark gradient bottom for text contrast (optional)
                    Positioned.fill(
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.black.withOpacity(0.0),
                              Colors.black.withOpacity(0.20),
                            ],
                          ),
                        ),
                      ),
                    ),

                    // rank number
                    Positioned(
                      left: 12,
                      top: 0,
                      child: Text(
                        "$rank",
                        style: TextStyle(
                          fontSize: 44,
                          fontWeight: FontWeight.w900,
                          color: Colors.white.withOpacity(0.95),
                        ),
                      ),
                    ),

                    // badge (optional)
                    // if (item.badge != null)
                    //   Positioned(
                    //     left: 12,
                    //     bottom: 10,
                    //     child: _Badge(text: item.badge!),
                    //   ),
                  ],
                ),
              ),

              Padding(
                padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 6),

                    Row(
                      children: [
                        const Icon(Icons.star_rounded, size: 18),
                        const SizedBox(width: 4),
                        Text(
                          item.rating.toStringAsFixed(1),
                          style: const TextStyle(fontWeight: FontWeight.w800),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          "(${item.reviews}+)",
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            color: Colors.black.withOpacity(0.55),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          "·  ${item.eta}  (${item.distance})",
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            color: Colors.black.withOpacity(0.55),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 6),
                    Text(
                      item.cuisine,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: Colors.black.withOpacity(0.55),
                      ),
                    ),
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

// class _Badge extends StatelessWidget {
//   final String text;
//   const _Badge({required this.text});

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
//       decoration: BoxDecoration(
//         color: Colors.white.withOpacity(0.92),
//         borderRadius: BorderRadius.circular(12),
//       ),
//       child: Text(
//         text,
//         style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900),
//       ),
//     );
//   }
// }

/// CATEGORIES ///

class _CategoriesTwoRows extends StatelessWidget {
  const _CategoriesTwoRows();

  @override
  Widget build(BuildContext context) {
    Widget item({
      required Widget icon,
      required String title,
      VoidCallback? onTap,
    }) {
      return Expanded(
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(14),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: Column(
                children: [
                  SizedBox(width: 56, height: 56, child: Center(child: icon)),
                  const SizedBox(height: 8),
                  Text(
                    title,
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      height: 1.15,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    Widget roundImage(String url) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: Image.network(url, fit: BoxFit.cover),
      );
    }

    // ⭐ "New Additions" icon like star
    Widget newStar() {
      return Container(
        width: 56,
        height: 56,
        decoration: BoxDecoration(
          color: const Color(0xFFE7FFF6),
          borderRadius: BorderRadius.circular(16),
        ),
        alignment: Alignment.center,
        child: Stack(
          alignment: Alignment.center,
          children: [
            Icon(Icons.star_rounded, size: 44, color: const Color(0xFF12B981)),
            Positioned(
              top: 15,
              child: Text(
                "New",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: Colors.black.withOpacity(0.75),
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          // Row 1
          Row(
            children: [
              item(icon: newStar(), title: "New\nAdditions", onTap: () {}),
              item(
                icon: roundImage("https://picsum.photos/seed/coffee/120"),
                title: "Coffee",
                onTap: () {},
              ),
              item(
                icon: roundImage("https://picsum.photos/seed/manakish/120"),
                title: "Manakish",
                onTap: () {},
              ),
              item(
                icon: roundImage("https://picsum.photos/seed/healthy/120"),
                title: "Healthy",
                onTap: () {},
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Row 2
          Row(
            children: [
              item(
                icon: roundImage("https://picsum.photos/seed/offers/120"),
                title: "Offers",
                onTap: () {},
              ),
              item(
                icon: roundImage("https://picsum.photos/seed/breakfast/120"),
                title: "Breakfast",
                onTap: () {},
              ),
              item(
                icon: roundImage("https://picsum.photos/seed/wellness/120"),
                title: "Wellness\nBowls",
                onTap: () {},
              ),
              item(
                icon: roundImage("https://picsum.photos/seed/pancakes/120"),
                title: "Pancakes\n& Bagels",
                onTap: () {},
              ),
            ],
          ),
        ],
      ),
    );
  }
}
