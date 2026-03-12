import 'package:flutter/material.dart';
import 'package:zaza_app/ShopByCategory/models/shop_category_model.dart';

/// ✅ PAGE: All Categories (мисли скрин)
class ShopByCategoryPage extends StatelessWidget {
  final List<ShopCategoryItem> categories;

  const ShopByCategoryPage({super.key, required this.categories});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // ✅ HEADER (arrow back + title + search)
            _TopHeader(
              title: "Shop by Category",
              onBack: () => Navigator.pop(context),
              onSearch: () {
                // TODO: open search page/sheet
              },
            ),

            // ✅ BODY
            Expanded(
              child: _CategoryGrid(
                items: categories,
                onTap: (cat) {
                  // TODO: open category products page
                  // Navigator.push(context, MaterialPageRoute(builder: (_) => CategoryProductsPage(cat: cat)));
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// ✅ SECTION: Grid
class _CategoryGrid extends StatelessWidget {
  final List<ShopCategoryItem> items;
  final void Function(ShopCategoryItem cat) onTap;

  const _CategoryGrid({required this.items, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
      physics: const BouncingScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3, // мисли скрин
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 0.95,
      ),
      itemCount: items.length,
      itemBuilder: (_, i) =>
          _CategoryTile(cat: items[i], onTap: () => onTap(items[i])),
    );
  }
}

/// ✅ TILE: each category card
class _CategoryTile extends StatelessWidget {
  final ShopCategoryItem cat;
  final VoidCallback onTap;

  const _CategoryTile({required this.cat, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final border = Colors.black.withOpacity(0.08);

    return Material(
      color: const Color(0xFFF6F7F7), // light grey like screenshot
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: border),
          ),
          padding: const EdgeInsets.fromLTRB(10, 12, 10, 10),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // image
              Expanded(
                child: Center(
                  child: Image.network(
                    cat.imageUrl,
                    height: 44,
                    fit: BoxFit.contain,
                    errorBuilder: (_, __, ___) => Icon(
                      Icons.category_rounded,
                      size: 34,
                      color: Colors.black.withOpacity(0.5),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 8),

              // title
              Text(
                cat.title,
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 12.5,
                  height: 1.1,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// ✅ HEADER widget (мисли скрин: back + title + search)
class _TopHeader extends StatelessWidget {
  final String title;
  final VoidCallback onBack;
  final VoidCallback onSearch;

  const _TopHeader({
    required this.title,
    required this.onBack,
    required this.onSearch,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 6, 16, 6),
      child: Row(
        children: [
          _HeaderBtn(icon: Icons.arrow_back_ios_new_rounded, onTap: onBack),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
            ),
          ),
          _HeaderBtn(icon: Icons.search_rounded, onTap: onSearch),
        ],
      ),
    );
  }
}

class _HeaderBtn extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _HeaderBtn({required this.icon, required this.onTap});

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
