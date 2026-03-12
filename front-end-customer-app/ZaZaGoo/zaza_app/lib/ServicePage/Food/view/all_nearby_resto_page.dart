import 'package:flutter/material.dart';
import 'package:zaza_app/ServicePage/Food/models/nearby_item.dart';

class NearbyPage extends StatelessWidget {
  final List<NearbyItem> items;

  const NearbyPage({super.key, required this.items});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          "Nearby",
          style: TextStyle(fontWeight: FontWeight.w900),
        ),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
        itemCount: items.length,
        separatorBuilder: (_, __) =>
            Divider(height: 24, color: Colors.black.withOpacity(0.08)),
        itemBuilder: (context, i) {
          final it = items[i];
          return _NearbyRowTile(
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

class _NearbyRowTile extends StatelessWidget {
  final NearbyItem item;
  final VoidCallback? onTap;

  const _NearbyRowTile({required this.item, this.onTap});

  @override
  Widget build(BuildContext context) {
    final green = const Color(0xFF0C6B52);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
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
                    item.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Icon(Icons.star_rounded, size: 18, color: green),
                      const SizedBox(width: 4),
                      Text(
                        item.tag ?? item.rating.toStringAsFixed(1),
                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          color: green,
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
    );
  }
}
