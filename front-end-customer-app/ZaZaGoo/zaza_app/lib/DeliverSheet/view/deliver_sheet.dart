import 'package:flutter/material.dart';
import 'package:zaza_app/Address/models/save_address.dart';
import 'package:zaza_app/Address/storage/adress_store.dart';
import 'package:zaza_app/Address/view/add_edit_page.dart';

Future<SavedAddress?> showDeliveryAddressSheet(
  BuildContext context, {
  required List<SavedAddress> initialAddresses,
  Future<void> Function(List<SavedAddress> list)? onChanged,
}) async {
  // ✅ seed store once
  if (AddressStore.I.isEmpty && initialAddresses.isNotEmpty) {
    AddressStore.I.setAll(initialAddresses);
  }

  return await showModalBottomSheet<SavedAddress>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    barrierColor: Colors.black.withOpacity(0.25),
    builder: (_) => _DeliveryAddressDraggableSheet(onChanged: onChanged),
  );
}

class _DeliveryAddressDraggableSheet extends StatefulWidget {
  const _DeliveryAddressDraggableSheet({this.onChanged});

  final Future<void> Function(List<SavedAddress> list)? onChanged;

  @override
  State<_DeliveryAddressDraggableSheet> createState() =>
      _DeliveryAddressDraggableSheetState();
}

class _DeliveryAddressDraggableSheetState
    extends State<_DeliveryAddressDraggableSheet> {
  final TextEditingController _q = TextEditingController();
  String _query = "";

  @override
  void initState() {
    super.initState();
    _q.addListener(() => setState(() => _query = _q.text.trim().toLowerCase()));
    AddressStore.I.addListener(_refresh);
  }

  @override
  void dispose() {
    AddressStore.I.removeListener(_refresh);
    _q.dispose();
    super.dispose();
  }

  void _refresh() {
    if (mounted) setState(() {});
  }

  List<SavedAddress> get _filtered {
    final items = AddressStore.I.items;
    if (_query.isEmpty) return items;

    return items.where((a) {
      final text = "${a.label} ${a.addressLine} ${(a.note ?? "")}"
          .toLowerCase();
      return text.contains(_query);
    }).toList();
  }

  Future<void> _persist() async {
    final cb = widget.onChanged;
    if (cb == null) return;
    await cb(AddressStore.I.items);
  }

  Future<void> _addNew() async {
    final res = await Navigator.push<SavedAddress>(
      context,
      MaterialPageRoute(builder: (_) => const AddEditAddressPage()),
    );
    if (res == null) return;

    // ✅ add to store
    final list = [...AddressStore.I.items, res];
    AddressStore.I.setAll(list);

    await _persist();
  }

  void _select(SavedAddress a) async {
    AddressStore.I.setDefault(a);
    await _persist();

    if (!mounted) return;
    Navigator.pop(context, AddressStore.I.selected);
  }

  IconData _iconFor(AddressTag tag) {
    switch (tag) {
      case AddressTag.home:
        return Icons.home_rounded;
      case AddressTag.work:
        return Icons.work_rounded;
      case AddressTag.other:
        return Icons.place_rounded;
    }
  }

  String _subtitleFor(SavedAddress a) {
    final note = (a.note ?? "").trim();
    return note.isEmpty ? a.addressLine : "${a.addressLine}\n$note";
  }

  @override
  Widget build(BuildContext context) {
    final list = _filtered;

    return DraggableScrollableSheet(
      initialChildSize: 0.45,
      minChildSize: 0.20,
      maxChildSize: 0.80,
      expand: false,
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
          ),
          child: Column(
            children: [
              const SizedBox(height: 10),
              Container(
                width: 44,
                height: 5,
                decoration: BoxDecoration(
                  color: Colors.black.withAlpha(40),
                  borderRadius: BorderRadius.circular(99),
                ),
              ),
              const SizedBox(height: 14),
              Expanded(
                child: ListView(
                  controller: scrollController,
                  padding: EdgeInsets.zero,
                  children: [
                    const _DeliverySheetHeader(), // ✅ dynamic from store
                    _DeliverySearchBar(controller: _q),

                    _SavedAddressesSection(onAddNew: _addNew),

                    if (list.isEmpty)
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 18, 16, 22),
                        child: Text(
                          "No results",
                          style: TextStyle(
                            fontWeight: FontWeight.w800,
                            color: Colors.black.withAlpha(150),
                          ),
                        ),
                      )
                    else
                      ...list.map((a) {
                        return _AddressTile(
                          title: a.label,
                          subtitle: _subtitleFor(a),
                          icon: _iconFor(a.tag),
                          distance: a.isDefault ? "Default" : "",
                          onTap: () => _select(a),
                        );
                      }),

                    const SizedBox(height: 18),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _DeliverySheetHeader extends StatelessWidget {
  const _DeliverySheetHeader();

  @override
  Widget build(BuildContext context) {
    // ✅ header updates when store changes
    // final selectedLabel = AddressStore.I.selected?.label ?? "Select address";

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      child: Text(
        "Delivery Address", //Deliver to: $selectedLabel
        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w600),
      ),
    );
  }
}

class _DeliverySearchBar extends StatelessWidget {
  const _DeliverySearchBar({required this.controller});
  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        height: 48,
        decoration: BoxDecoration(
          color: const Color(0xFFF3F4F6),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.black12),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 12),
        child: Row(
          children: [
            Icon(Icons.search, color: Colors.black.withAlpha(140)),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                controller: controller,
                decoration: const InputDecoration(
                  hintText: "Search an address",
                  border: InputBorder.none,
                ),
              ),
            ),
            const Icon(Icons.map_outlined),
          ],
        ),
      ),
    );
  }
}

class _SavedAddressesSection extends StatelessWidget {
  const _SavedAddressesSection({required this.onAddNew});
  final VoidCallback onAddNew;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 18, 16, 6),
      child: Row(
        children: [
          Text(
            "Saved addresses",
            style: TextStyle(
              fontWeight: FontWeight.w500,
              color: Colors.black.withAlpha(180),
              fontSize: 15,
            ),
          ),
          const Spacer(),
          TextButton.icon(
            onPressed: onAddNew,
            icon: const Icon(Icons.add, size: 18, color: Color(0xFF0C6B52)),
            label: const Text(
              "Add new",
              style: TextStyle(color: Color(0xFF0C6B52)),
            ),
          ),
        ],
      ),
    );
  }
}

class _AddressTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final String distance;
  final VoidCallback onTap;

  const _AddressTile({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.distance,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    const green = Color(0xFF0C6B52);

    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
        child: Row(
          children: [
            Column(
              children: [
                Icon(icon, color: green),
                const SizedBox(height: 6),
                if (distance.isNotEmpty)
                  Text(
                    distance,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.black.withAlpha(140),
                    ),
                  ),
              ],
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.black.withAlpha(140),
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.more_vert),
          ],
        ),
      ),
    );
  }
}
