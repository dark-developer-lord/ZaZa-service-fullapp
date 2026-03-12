import 'package:flutter/material.dart';
import 'package:zaza_app/Activities/models/activities_model.dart';

class ActivitiesPage extends StatefulWidget {
  const ActivitiesPage({super.key});

  @override
  State<ActivitiesPage> createState() => _ActivitiesPageState();
}

class _ActivitiesPageState extends State<ActivitiesPage> {
  // 0 = All, 1 = Food, 2 = SuperMarkets, 3 = Pharmacy, 4 = Box
  int selected = 0;

  final _demo = <ActivityItem>[
    ActivityItem(
      date: DateTime(2026, 1, 23),
      type: ActivityType.food,
      title: "Sultan Al Arab Restaurant",
      subtitle: "Grill Chicken, Grill Chicken Rice",
      amount: 93.45,
    ),
    ActivityItem(
      date: DateTime(2026, 1, 21),
      type: ActivityType.food,
      title: "FIX Dessert Chocolatier",
      subtitle: "Can't Get Knafeh Of It - The Original Dub...",
      amount: 84.48,
      cancelled: false,
    ),
    ActivityItem(
      date: DateTime(2026, 1, 21),
      type: ActivityType.food,
      title: "FIX Dessert Chocolatier",
      subtitle: "Can't Get Knafeh Of It - The Original Dub...",
      amount: 84.48,
      cancelled: true,
    ),
    ActivityItem(
      date: DateTime(2026, 1, 20),
      type: ActivityType.food,
      title: "FIX Dessert Chocolatier",
      subtitle: "Can't Get Knafeh Of It - The Original Dub...",
      amount: 84.48,
      cancelled: true,
    ),
    ActivityItem(
      date: DateTime(2026, 1, 20),
      type: ActivityType.food,
      title: "McDonald's - Tasjeel",
      subtitle: "Big Mac Medium Meal, 9 Pcs Chicken Mc...",
      amount: 106.20,
    ),
    ActivityItem(
      date: DateTime(2026, 1, 18),
      type: ActivityType.supermarket,
      title: "Carrefour",
      subtitle: "Grocery items",
      amount: 52.10,
    ),
    ActivityItem(
      date: DateTime(2026, 1, 17),
      type: ActivityType.pharmacy,
      title: "800 Pharma",
      subtitle: "Vitamins & supplements",
      amount: 37.00,
    ),
    ActivityItem(
      date: DateTime(2026, 1, 16),
      type: ActivityType.box,
      title: "Box Delivery",
      subtitle: "Package dropoff",
      amount: 18.90,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final bg = Colors.white;

    final items = _filtered(_demo, selected)
      ..sort((a, b) => b.date.compareTo(a.date)); // newest first

    final grouped = _groupByDay(items);

    return Scaffold(
      backgroundColor: bg,
      body: Column(
        children: [
          _ActivitiesHeader(
            onBack: () => Navigator.pop(context),
            onMenu: () {
              // TODO: open menu
            },
          ),

          _ActivitiesTabs(
            selected: selected,
            onChanged: (i) => setState(() => selected = i),
          ),

          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.only(top: 8),
              itemCount: grouped.length,
              itemBuilder: (context, index) {
                final day = grouped[index].$1;
                final dayItems = grouped[index].$2;

                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _DayHeader(date: day),
                    const Divider(height: 1, thickness: 1),
                    ...dayItems.map((it) => _ActivityRow(item: it)),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  static List<ActivityItem> _filtered(List<ActivityItem> all, int selected) {
    if (selected == 0) return List.of(all);
    final type = switch (selected) {
      1 => ActivityType.food,
      2 => ActivityType.supermarket,
      3 => ActivityType.pharmacy,
      4 => ActivityType.box,
      _ => ActivityType.food,
    };
    return all.where((e) => e.type == type).toList();
  }

  // returns list of (DateOnly, items)
  static List<(DateTime, List<ActivityItem>)> _groupByDay(
    List<ActivityItem> items,
  ) {
    final map = <DateTime, List<ActivityItem>>{};
    for (final it in items) {
      final d = DateTime(it.date.year, it.date.month, it.date.day);
      map.putIfAbsent(d, () => []).add(it);
    }

    final keys = map.keys.toList()..sort((a, b) => b.compareTo(a));
    return keys.map((k) => (k, map[k]!)).toList();
  }
}

class _ActivitiesHeader extends StatelessWidget {
  final VoidCallback onBack;
  final VoidCallback onMenu;

  const _ActivitiesHeader({required this.onBack, required this.onMenu});

  @override
  Widget build(BuildContext context) {
    final green = const Color(0xFF0C6B52);

    return SafeArea(
      bottom: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
        child: Row(
          children: [
            Material(
              color: Colors.black.withOpacity(0.04),
              borderRadius: BorderRadius.circular(14),
              child: InkWell(
                onTap: onBack,
                borderRadius: BorderRadius.circular(14),
                child: const SizedBox(
                  width: 42,
                  height: 42,
                  child: Center(
                    child: Icon(Icons.arrow_back_ios_new_rounded, size: 18),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                "Activities",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
              ),
            ),
            Material(
              color: green,
              borderRadius: BorderRadius.circular(14),
              child: InkWell(
                onTap: onMenu,
                borderRadius: BorderRadius.circular(14),
                child: const SizedBox(
                  width: 42,
                  height: 42,
                  child: Center(
                    child: Icon(
                      Icons.menu_rounded,
                      color: Colors.white,
                      size: 21,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ActivitiesTabs extends StatelessWidget {
  final int selected;
  final ValueChanged<int> onChanged;

  const _ActivitiesTabs({required this.selected, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final green = const Color(0xFF0C6B52);

    final tabs = const [
      ("All", Icons.grid_view_rounded),
      ("Food", Icons.lunch_dining_rounded),
      ("SuperMarkets", Icons.shopping_basket_rounded),
      ("Pharmacy", Icons.local_pharmacy_rounded),
      ("Box", Icons.inventory_2_rounded),
    ];

    return Container(
      padding: const EdgeInsets.only(top: 2),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          bottom: BorderSide(color: Colors.black.withOpacity(0.06), width: 1),
        ),
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.fromLTRB(8, 0, 8, 0),
        child: Row(
          children: List.generate(tabs.length, (i) {
            final isOn = i == selected;
            final (label, icon) = tabs[i];

            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: InkWell(
                borderRadius: BorderRadius.circular(14),
                onTap: () => onChanged(i),
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(10, 8, 10, 10),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        icon,
                        size: 22,
                        color: isOn
                            ? Colors.black
                            : Colors.black.withOpacity(0.45),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        label,
                        style: TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w800,
                          color: isOn
                              ? Colors.black
                              : Colors.black.withOpacity(0.55),
                        ),
                      ),
                      const SizedBox(height: 8),
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 180),
                        width: 34,
                        height: 3,
                        decoration: BoxDecoration(
                          color: isOn ? green : Colors.transparent,
                          borderRadius: BorderRadius.circular(99),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
        ),
      ),
    );
  }
}

class _DayHeader extends StatelessWidget {
  final DateTime date;
  const _DayHeader({required this.date});

  @override
  Widget build(BuildContext context) {
    // Simple english like screenshot
    const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    final w = week[date.weekday - 1];
    final m = months[date.month - 1];

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
      child: Text(
        "$w, ${date.day} $m",
        style: TextStyle(
          fontWeight: FontWeight.w800,
          fontSize: 14,
          color: Colors.black.withOpacity(0.70),
        ),
      ),
    );
  }
}

class _ActivityRow extends StatelessWidget {
  final ActivityItem item;
  const _ActivityRow({required this.item});

  @override
  Widget build(BuildContext context) {
    final green = const Color(0xFF0C6B52);
    final icon = switch (item.type) {
      ActivityType.food => Icons.fastfood_rounded,
      ActivityType.supermarket => Icons.shopping_cart_rounded,
      ActivityType.pharmacy => Icons.local_pharmacy_rounded,
      ActivityType.box => Icons.inventory_2_rounded,
    };

    return Material(
      color: Colors.white,
      child: InkWell(
        onTap: () {
          // TODO: open activity details
        },
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // left icon "food emoji spot"
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.04),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, color: green, size: 22),
              ),
              const SizedBox(width: 12),

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
                    const SizedBox(height: 4),
                    Text(
                      item.subtitle,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: Colors.black.withOpacity(0.55),
                      ),
                    ),
                    if (item.cancelled) ...[
                      const SizedBox(height: 6),
                      const Text(
                        "Cancelled",
                        style: TextStyle(
                          color: Colors.redAccent,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ],
                  ],
                ),
              ),

              const SizedBox(width: 10),

              Text(
                "Ð ${item.amount.toStringAsFixed(2)}",
                style: const TextStyle(
                  fontWeight: FontWeight.w900,
                  fontSize: 16,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
