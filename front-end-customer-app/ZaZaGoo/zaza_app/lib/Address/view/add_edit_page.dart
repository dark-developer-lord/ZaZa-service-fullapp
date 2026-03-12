import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:zaza_app/Address/models/save_address.dart';

class AddEditAddressPage extends StatefulWidget {
  const AddEditAddressPage({super.key, this.initial});

  final SavedAddress? initial;

  @override
  State<AddEditAddressPage> createState() => _AddEditAddressPageState();
}

class _AddEditAddressPageState extends State<AddEditAddressPage> {
  late final TextEditingController _labelC;
  late final TextEditingController _addrC;
  late final TextEditingController _noteC;

  AddressTag _tag = AddressTag.home;
  bool _isDefault = false;

  @override
  void initState() {
    super.initState();
    final it = widget.initial;
    _labelC = TextEditingController(text: it?.label ?? "");
    _addrC = TextEditingController(text: it?.addressLine ?? "");
    _noteC = TextEditingController(text: it?.note ?? "");
    _tag = it?.tag ?? AddressTag.home;
    _isDefault = it?.isDefault ?? false;
  }

  @override
  void dispose() {
    _labelC.dispose();
    _addrC.dispose();
    _noteC.dispose();
    super.dispose();
  }

  void _save() {
    final label = _labelC.text.trim();
    final addr = _addrC.text.trim();
    final note = _noteC.text.trim();

    if (label.isEmpty) {
      _toast("Label is required");
      return;
    }
    if (addr.length < 4) {
      _toast("Address is too short");
      return;
    }

    final res = SavedAddress(
      label: label,
      tag: _tag,
      addressLine: addr,
      note: note.isEmpty ? null : note,
      isDefault: _isDefault,
    );

    HapticFeedback.lightImpact();
    Navigator.pop(context, res);
  }

  void _toast(String msg) {
    ScaffoldMessenger.of(context)
      ..clearSnackBars()
      ..showSnackBar(
        SnackBar(
          content: Text(msg),
          behavior: SnackBarBehavior.floating,
          duration: const Duration(seconds: 2),
        ),
      );
  }

  @override
  Widget build(BuildContext context) {
    final editing = widget.initial != null;

    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      appBar: AppBar(
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: const Color(0xFFF7F7F7),
        surfaceTintColor: Colors.transparent,
        centerTitle: true,
        title: Text(
          editing ? "Edit Address" : "Add Address",
          style: const TextStyle(
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
        actions: [
          TextButton(
            onPressed: _save,
            child: const Text(
              "Save",
              style: TextStyle(
                color: Color(0xFF111827),
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 16),
          children: [
            _SectionCard(
              title: "Address",
              child: Column(
                children: [
                  _InputRow(
                    label: "Label",
                    child: TextField(
                      controller: _labelC,
                      textInputAction: TextInputAction.next,
                      style: const TextStyle(
                        fontSize: 16,
                        color: Color(0xFF111827),
                        fontWeight: FontWeight.w600,
                      ),
                      decoration: const InputDecoration(
                        hintText: "Home / Work / Other",
                        border: InputBorder.none,
                        isDense: true,
                      ),
                    ),
                  ),
                  const _Divider(),
                  _InputRow(
                    label: "Tag",
                    child: _TagChips(
                      value: _tag,
                      onChanged: (t) => setState(() => _tag = t),
                    ),
                  ),
                  const _Divider(),
                  _InputRow(
                    label: "Address",
                    child: TextField(
                      controller: _addrC,
                      minLines: 1,
                      maxLines: 3,
                      keyboardType: TextInputType.streetAddress,
                      style: const TextStyle(
                        fontSize: 16,
                        color: Color(0xFF111827),
                        fontWeight: FontWeight.w600,
                      ),
                      decoration: const InputDecoration(
                        hintText: "Street, building, apartment",
                        border: InputBorder.none,
                        isDense: true,
                      ),
                    ),
                  ),
                  const _Divider(),
                  _InputRow(
                    label: "Note",
                    child: TextField(
                      controller: _noteC,
                      minLines: 1,
                      maxLines: 2,
                      style: const TextStyle(
                        fontSize: 16,
                        color: Color(0xFF111827),
                        fontWeight: FontWeight.w600,
                      ),
                      decoration: const InputDecoration(
                        hintText: "Entrance, floor, instructions (optional)",
                        border: InputBorder.none,
                        isDense: true,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            _SectionCard(
              title: "Default",
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 12,
                    ),
                    child: Row(
                      children: [
                        const Expanded(
                          child: Text(
                            "Set as default",
                            style: TextStyle(
                              fontSize: 15,
                              color: Color(0xFF111827),
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                        Switch.adaptive(
                          value: _isDefault,
                          onChanged: (v) => setState(() => _isDefault = v),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),
            _PrimaryButton(
              title: "Save",
              enabled: true,
              loading: false,
              onTap: _save,
            ),
          ],
        ),
      ),
    );
  }
}

/// =====================
/// UI widgets (same style as your PersonalInformationPage)
/// =====================

class _TagChips extends StatelessWidget {
  const _TagChips({required this.value, required this.onChanged});
  final AddressTag value;
  final ValueChanged<AddressTag> onChanged;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        _chip("Home", AddressTag.home),
        _chip("Work", AddressTag.work),
        _chip("Other", AddressTag.other),
      ],
    );
  }

  Widget _chip(String text, AddressTag tag) {
    final selected = value == tag;
    return InkWell(
      onTap: () => onChanged(tag),
      borderRadius: BorderRadius.circular(999),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? const Color(0xFF111827) : const Color(0xFFF3F4F6),
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: const Color(0xFFE5E7EB)),
        ),
        child: Text(
          text,
          style: TextStyle(
            fontSize: 12,
            color: selected ? Colors.white : const Color(0xFF111827),
            fontWeight: FontWeight.w900,
          ),
        ),
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({required this.title, required this.child});
  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 6, bottom: 8),
          child: Text(
            title.toUpperCase(),
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFF6B7280),
              fontWeight: FontWeight.w800,
              letterSpacing: 0.6,
            ),
          ),
        ),
        Container(
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
          child: child,
        ),
      ],
    );
  }
}

class _InputRow extends StatelessWidget {
  const _InputRow({required this.label, required this.child});
  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SizedBox(
            width: 88,
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 13,
                color: Color(0xFF6B7280),
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
          Expanded(child: child),
        ],
      ),
    );
  }
}

class _Divider extends StatelessWidget {
  const _Divider();
  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.only(left: 14),
      child: Divider(height: 1, thickness: 1, color: Color(0xFFE5E7EB)),
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
            color: const Color(0xFF111827),
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.12),
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
