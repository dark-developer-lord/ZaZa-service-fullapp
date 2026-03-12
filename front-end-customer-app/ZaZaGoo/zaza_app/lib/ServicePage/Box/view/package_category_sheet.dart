import 'package:flutter/material.dart';

Future<String?> showPackageCategorySheet(
  BuildContext context, {
  required String? currentValue,
}) async {
  return showModalBottomSheet<String>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.white,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
    ),
    builder: (_) => _PackageCategorySheetBody(currentValue: currentValue),
  );
}

class _PackageCategorySheetBody extends StatefulWidget {
  final String? currentValue;

  const _PackageCategorySheetBody({required this.currentValue});

  @override
  State<_PackageCategorySheetBody> createState() =>
      _PackageCategorySheetBodyState();
}

class _PackageCategorySheetBodyState extends State<_PackageCategorySheetBody> {
  static const darkGreen = Color(0xFF0C3A2E);
  static const mint = Color(0xFF20E3A2);

  late String selected;

  final items = const <String>["Food, groceries", "Documents and others"];

  @override
  void initState() {
    super.initState();
    selected = widget.currentValue?.trim().isNotEmpty == true
        ? widget.currentValue!.trim()
        : items.first;
    if (!items.contains(selected)) selected = items.first;
  }

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.of(context).viewInsets.bottom;

    return SafeArea(
      top: false,
      child: Padding(
        padding: EdgeInsets.only(bottom: bottom),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),

            // handle
            Container(
              width: 44,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFE5E7EB),
                borderRadius: BorderRadius.circular(999),
              ),
            ),

            const SizedBox(height: 14),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                // crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    "Package category",
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
                  ),
                  SizedBox(height: 6),
                  Text(
                    "This info isn't shared with the captain",
                    style: TextStyle(fontSize: 14, color: Color(0xFF6B7280)),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 10),

            // radios
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Column(
                children: items.map((t) {
                  final isSelected = selected == t;
                  return InkWell(
                    onTap: () => setState(() => selected = t),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 10,
                      ),
                      child: Row(
                        children: [
                          _RadioCircle(selected: isSelected),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              t,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF111827),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),

            const SizedBox(height: 12),

            // submit
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: SizedBox(
                height: 50,
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () =>
                      Navigator.of(context, rootNavigator: true).pop(selected),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: darkGreen,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: const Text(
                    "Submit",
                    style: TextStyle(
                      color: mint,
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
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

class _RadioCircle extends StatelessWidget {
  final bool selected;

  const _RadioCircle({required this.selected});

  @override
  Widget build(BuildContext context) {
    const darkGreen = Color(0xFF0C3A2E);

    return Container(
      width: 22,
      height: 22,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(
          color: selected ? darkGreen : const Color(0xFF9CA3AF),
          width: 2,
        ),
      ),
      child: Center(
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 160),
          width: selected ? 11 : 0,
          height: selected ? 11 : 0,
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
            color: darkGreen,
          ),
        ),
      ),
    );
  }
}
