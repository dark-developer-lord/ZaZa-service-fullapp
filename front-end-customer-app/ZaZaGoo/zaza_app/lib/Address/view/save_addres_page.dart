import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:zaza_app/Address/models/save_address.dart';
import 'package:zaza_app/Address/storage/adress_store.dart';
import 'package:zaza_app/Address/view/add_edit_page.dart';

class SavedAddressesPage extends StatefulWidget {
  const SavedAddressesPage({super.key, this.initialAddresses, this.onChanged});

  final List<SavedAddress>? initialAddresses;

  /// Callback when list changes (save to API/local)
  final Future<void> Function(List<SavedAddress> addresses)? onChanged;

  @override
  State<SavedAddressesPage> createState() => _SavedAddressesPageState();
}

const Color kPrimaryGreen = Color(0xFF0B8B68);

class _SavedAddressesPageState extends State<SavedAddressesPage> {
  late List<SavedAddress> _items;
  bool _saving = false;

  @override
  void initState() {
    super.initState();

    // агар store холӣ бошад, аз initial пур кун
    // if (AddressStore.I.isEmpty) {
    //   AddressStore.I.setAll(widget.initialAddresses ?? _demo());
    // }

    // UI ҳамеша аз store хонда мешавад
    _items = AddressStore.I.items.toList();
    AddressStore.I.addListener(_syncFromStore);
  }

  void _syncFromStore() {
    if (!mounted) return;
    setState(() {
      _items = AddressStore.I.items.toList();
    });
  }

  @override
  void dispose() {
    AddressStore.I.removeListener(_syncFromStore);
    super.dispose();
  }

  Future<void> _persist() async {
    // ✅ аввал store update
    AddressStore.I.setAll(_items);

    // ✅ баъд агар API callback дорӣ
    if (widget.onChanged == null) return;

    setState(() => _saving = true);
    try {
      await widget.onChanged!(AddressStore.I.items);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _addNew() async {
    final res = await Navigator.push<SavedAddress>(
      context,
      MaterialPageRoute(builder: (_) => const AddEditAddressPage()),
    );

    if (res == null) return;

    setState(() {
      if (res.isDefault) {
        _items = _items.map((e) => e.copyWith(isDefault: false)).toList();
      }
      _items.add(res);

      if (_items.where((e) => e.isDefault).isEmpty) {
        _items[_items.length - 1] = _items.last.copyWith(isDefault: true);
      }
    });
    await _persist();

    HapticFeedback.lightImpact();
    await _persist();
  }

  Future<void> _edit(int index) async {
    final current = _items[index];
    final res = await Navigator.push<SavedAddress>(
      context,
      MaterialPageRoute(builder: (_) => AddEditAddressPage(initial: current)),
    );

    if (res == null) return;

    setState(() {
      _items[index] = res;
      if (res.isDefault) {
        _items = _items
            .asMap()
            .entries
            .map(
              (e) => e.key == index ? res : e.value.copyWith(isDefault: false),
            )
            .toList();
      }
    });

    HapticFeedback.lightImpact();
    await _persist();
  }

  Future<void> _delete(int index) async {
    final ok = await _confirm(
      title: "Delete address?",
      message: "This address will be removed.",
      okText: "Delete",
    );
    if (!ok) return;

    final removedWasDefault = _items[index].isDefault;

    setState(() => _items.removeAt(index));

    // If deleted default, make first as default
    if (removedWasDefault && _items.isNotEmpty) {
      setState(() {
        _items[0] = _items[0].copyWith(isDefault: true);
      });
    }

    HapticFeedback.mediumImpact();
    await _persist();
  }

  Future<void> _setDefault(int index) async {
    setState(() {
      _items = _items
          .asMap()
          .entries
          .map(
            (e) => e.key == index
                ? e.value.copyWith(isDefault: true)
                : e.value.copyWith(isDefault: false),
          )
          .toList();
    });

    HapticFeedback.selectionClick();
    await _persist();
  }

  Future<bool> _confirm({
    required String title,
    required String message,
    required String okText,
  }) async {
    return await showDialog<bool>(
          context: context,
          builder: (_) => AlertDialog(
            title: Text(title),
            content: Text(message),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text("Cancel"),
              ),
              TextButton(
                onPressed: () => Navigator.pop(context, true),
                child: Text(okText),
              ),
            ],
          ),
        ) ??
        false;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      appBar: AppBar(
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: const Color(0xFFF7F7F7),
        surfaceTintColor: Colors.transparent,
        centerTitle: true,
        title: const Text(
          "Saved Addresses",
          style: TextStyle(
            color: Color(0xFF111827),
            fontSize: 17,
            fontWeight: FontWeight.w800,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          color: const Color(0xFF111827),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      floatingActionButton: _AddFab(title: "Add new", onTap: _addNew),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 100),
          children: [
            if (_saving)
              const _InfoPill(text: "Saving...", icon: Icons.sync_rounded),
            if (_items.isEmpty)
              _EmptyCard(onAddTap: _addNew)
            else
              ..._items.asMap().entries.map((e) {
                final i = e.key;
                final it = e.value;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _AddressCard(
                    item: it,
                    onTap: () => _setDefault(i),
                    onEdit: () => _edit(i),
                    onDelete: () => _delete(i),
                  ),
                );
              }).toList(),
          ],
        ),
      ),
    );
  }

  // List<SavedAddress> _demo() => [
  //   SavedAddress(
  //     label: "Home",
  //     tag: AddressTag.home,
  //     addressLine: "Rudaki avenue 55",
  //     note: "Entrance 2, floor 3",
  //     isDefault: true,
  //   ),
  //   SavedAddress(
  //     label: "Work",
  //     tag: AddressTag.work,
  //     addressLine: "Somoni street 12",
  //     note: "Reception",
  //     isDefault: false,
  //   ),
  // ];
}

class _AddressCard extends StatelessWidget {
  const _AddressCard({
    required this.item,
    required this.onTap,
    required this.onEdit,
    required this.onDelete,
  });

  final SavedAddress item;
  final VoidCallback onTap;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  IconData get _icon {
    switch (item.tag) {
      case AddressTag.home:
        return Icons.home_rounded;
      case AddressTag.work:
        return Icons.work_rounded;
      case AddressTag.other:
        return Icons.location_on_outlined;
    }
  }

  String get _tagLabel {
    switch (item.tag) {
      case AddressTag.home:
        return "Home";
      case AddressTag.work:
        return "Work";
      case AddressTag.other:
        return "Other";
    }
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.fromLTRB(14, 14, 14, 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: item.isDefault
                ? kPrimaryGreen.withOpacity(0.35)
                : const Color(0xFFE5E7EB),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 18,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  height: 38,
                  width: 38,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF3F4F6),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE5E7EB)),
                  ),
                  child: Icon(_icon, color: kPrimaryGreen),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              item.label,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 15,
                                color: Color(0xFF111827),
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          _TagPill(text: _tagLabel),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item.addressLine,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 13,
                          color: Color(0xFF6B7280),
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      if ((item.note ?? "").isNotEmpty) ...[
                        const SizedBox(height: 3),
                        Text(
                          item.note!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF9CA3AF),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(width: 8),

                /// ✅ Selection indicator
                Icon(
                  item.isDefault
                      ? Icons.check_circle_rounded
                      : Icons.radio_button_unchecked_rounded,
                  color: item.isDefault
                      ? kPrimaryGreen
                      : const Color(0xFFBFC5CE),
                  size: 24,
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: _SmallAction(
                    icon: Icons.edit_rounded,
                    text: "Edit",
                    onTap: onEdit,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _SmallAction(
                    icon: Icons.delete_outline_rounded,
                    text: "Delete",
                    danger: true,
                    onTap: onDelete,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyCard extends StatelessWidget {
  const _EmptyCard({required this.onAddTap});
  final VoidCallback onAddTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 18, 16, 18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE5E7EB)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 18,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            height: 44,
            width: 44,
            decoration: BoxDecoration(
              color: const Color(0xFFF3F4F6),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE5E7EB)),
            ),
            child: const Icon(Icons.place_rounded, color: Color(0xFF111827)),
          ),
          const SizedBox(height: 10),
          const Text(
            "No saved addresses",
            style: TextStyle(
              fontSize: 15,
              color: Color(0xFF111827),
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            "Add an address to make checkout faster.",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13,
              color: Color(0xFF6B7280),
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 12),
          _PrimaryButton(
            title: "Add address",
            enabled: true,
            loading: false,
            onTap: onAddTap,
          ),
        ],
      ),
    );
  }
}

class _AddFab extends StatelessWidget {
  const _AddFab({required this.title, required this.onTap});
  final String title;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.extended(
      backgroundColor: kPrimaryGreen,
      foregroundColor: Colors.white,
      onPressed: onTap,
      icon: const Icon(Icons.add_rounded),
      label: Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
    );
  }
}

class _InfoPill extends StatelessWidget {
  const _InfoPill({required this.text, required this.icon});
  final String text;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE5E7EB)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 18, color: const Color(0xFF111827)),
            const SizedBox(width: 8),
            Text(
              text,
              style: const TextStyle(
                fontSize: 13,
                color: Color(0xFF111827),
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SmallAction extends StatelessWidget {
  const _SmallAction({
    required this.icon,
    required this.text,
    required this.onTap,
    this.danger = false,
  });

  final IconData icon;
  final String text;
  final VoidCallback onTap;
  final bool danger;

  @override
  Widget build(BuildContext context) {
    final c = danger ? const Color(0xFFB91C1C) : const Color(0xFF111827);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        height: 44,
        decoration: BoxDecoration(
          color: const Color(0xFFF3F4F6),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE5E7EB)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 18, color: c),
            const SizedBox(width: 8),
            Text(
              text,
              style: TextStyle(
                fontSize: 13,
                color: c,
                fontWeight: FontWeight.w900,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TagPill extends StatelessWidget {
  const _TagPill({required this.text});
  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: kPrimaryGreen.withOpacity(0.08),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: kPrimaryGreen.withOpacity(0.18)),
      ),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 11,
          color: kPrimaryGreen,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }
}

class _PrimaryButton extends StatelessWidget {
  const _PrimaryButton({
    required this.title,
    required this.enabled,
    required this.loading,
    required this.onTap,
  });

  final String title;
  final bool enabled;
  final bool loading;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: AnimatedOpacity(
        duration: const Duration(milliseconds: 180),
        opacity: enabled ? 1 : 0.55,
        child: Container(
          height: 52,
          decoration: BoxDecoration(
            color: kPrimaryGreen,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: kPrimaryGreen.withOpacity(0.22),
                blurRadius: 18,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Center(
            child: loading
                ? const SizedBox(
                    height: 18,
                    width: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : Text(
                    title,
                    style: const TextStyle(
                      fontSize: 15,
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 0.2,
                    ),
                  ),
          ),
        ),
      ),
    );
  }
}
