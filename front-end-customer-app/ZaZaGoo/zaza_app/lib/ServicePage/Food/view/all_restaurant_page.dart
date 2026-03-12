import 'package:flutter/material.dart';
import 'package:zaza_app/ServicePage/Food/models/restaurant_model.dart';

class AllRestaurantsPage extends StatelessWidget {
  final List<RestaurantItem> items;

  const AllRestaurantsPage({super.key, required this.items});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "All Restaurants",
          style: TextStyle(fontWeight: FontWeight.w900),
        ),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
        itemCount: items.length,
        separatorBuilder: (_, __) =>
            Divider(height: 24, color: Colors.black.withOpacity(0.08)),
        itemBuilder: (context, i) {
          final it = items[i];
          return _RestaurantRow(
            item: it,
            onTap: () {
              // TODO: open details
            },
          );
        },
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
