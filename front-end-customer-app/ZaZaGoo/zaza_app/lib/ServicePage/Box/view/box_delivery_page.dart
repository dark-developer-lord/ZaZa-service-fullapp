import 'package:flutter/material.dart';
import 'package:zaza_app/ServicePage/Box/models/box_checkout_arg_model.dart';
import 'package:zaza_app/ServicePage/Box/view/box_checkout_page.dart';
import 'package:zaza_app/ServicePage/Box/view/box_page.dart';
import 'package:zaza_app/ServicePage/Box/view/package_category_sheet.dart';

class BoxDeliveryPage extends StatefulWidget {
  const BoxDeliveryPage({super.key});

  @override
  State<BoxDeliveryPage> createState() => _BoxDeliveryPageState();
}

class _BoxDeliveryPageState extends State<BoxDeliveryPage> {
  String? pickup;
  String? dropoff;

  int? selectedVehicleIndex;
  String? selectedPackageCategory;

  final noteCtrl = TextEditingController();
  static const int noteMax = 350;

  final vehicles = const <VehicleOption>[
    VehicleOption(
      title: "Motorbike",
      subtitle: "2 footballs. 7kg 💪",
      priceRange: "19 - 23 c",
      icon: Icons.two_wheeler_rounded,
    ),
    VehicleOption(
      title: "XL",
      subtitle: "2 suitcases. 60kg 😉",
      priceRange: "27 - 32 c",
      icon: Icons.directions_car_rounded,
    ),
  ];

  final quickNotes = const [
    "Upon arrival please call",
    "Please leave outside the door",
  ];

  bool get bothAddressesSelected => pickup != null && dropoff != null;

  bool get canCheckout =>
      bothAddressesSelected &&
      selectedVehicleIndex != null &&
      (selectedPackageCategory?.isNotEmpty ?? false);
  @override
  void initState() {
    super.initState();

    // ✅ default package category (null намешавад)
    selectedPackageCategory = "Food, groceries";
  }

  @override
  void dispose() {
    noteCtrl.dispose();
    super.dispose();
  }

  Future<String?> _fakePickAddress({required bool isPickup}) async {
    // ✅ Demo selector: ту баъд Map/Search page мепайвандӣ ва String бармегардонӣ
    // return await Navigator.push(...);
    return await showModalBottomSheet<String>(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
      ),
      builder: (_) {
        final list = isPickup
            ? ["Sultan Saray, Dubai", "Business Bay, Dubai", "JLT, Dubai"]
            : [
                "Centro Barsha, Dubai, Al Barsha 1",
                "Dubai Mall, Dubai",
                "Mall of the Emirates, Dubai",
              ];
        return SafeArea(
          child: ListView.separated(
            padding: const EdgeInsets.all(16),
            itemBuilder: (_, i) => ListTile(
              title: Text(
                list[i],
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
              trailing: const Icon(Icons.chevron_right_rounded),
              onTap: () => Navigator.pop(context, list[i]),
            ),
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemCount: list.length,
          ),
        );
      },
    );
  }

  Future<void> _selectPackageCategory() async {
    final res = await showPackageCategorySheet(
      context,
      currentValue: selectedPackageCategory,
    );

    if (!mounted) return;
    if (res == null) return;

    setState(() => selectedPackageCategory = res);
  }

  Future<void> _selectPickup() async {
    final res = await _fakePickAddress(isPickup: true);
    if (!mounted) return;
    if (res == null) return;

    setState(() {
      pickup = res;
      // ✅ Drop-off ҳоло ҳам баста буд, аммо вақте pickup интихоб шуд фаъол мешавад
      // Агар ту хоҳӣ, метавонед dropoff-ро reset кунӣ вақте pickup иваз шуд:
      dropoff = null;
      selectedVehicleIndex = null;
    });
  }

  Future<void> _selectDropoff() async {
    if (pickup == null) return; // ✅ safety
    final res = await _fakePickAddress(isPickup: false);
    if (!mounted) return;
    if (res == null) return;

    setState(() {
      dropoff = res;
      // вақте ду адрес тайёр шуд, vehicle section нишон дода мешавад
    });
  }

  void _appendQuickNote(String text) {
    final current = noteCtrl.text.trim();
    if (current.isEmpty) {
      noteCtrl.text = text;
    } else {
      if (!current.endsWith(".")) {
        noteCtrl.text = "$current. $text";
      } else {
        noteCtrl.text = "$current $text";
      }
    }
    noteCtrl.selection = TextSelection.fromPosition(
      TextPosition(offset: noteCtrl.text.length),
    );
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    const darkGreen = Color(0xFF0C3A2E);
    debugPrint("pickup=$pickup");
    debugPrint("dropoff=$dropoff");
    debugPrint("vehicle=$selectedVehicleIndex");
    debugPrint("category=$selectedPackageCategory");
    debugPrint("canCheckout=$canCheckout");

    return Scaffold(
      backgroundColor: Colors.white,

      bottomNavigationBar: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(14, 10, 14, 12),
          child: SizedBox(
            height: 58,
            child: ElevatedButton(
              onPressed: canCheckout
                  ? () {
                      final args = BoxCheckoutArgs(
                        pickup: pickup!,
                        dropoff: dropoff!,
                        vehicleTitle: vehicles[selectedVehicleIndex!].title,
                        instructions: noteCtrl.text,
                        packageCategory:
                            selectedPackageCategory ?? "Food, groceries",
                        total: 23,
                      );

                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => BoxCheckoutPage(args: args),
                        ),
                      );
                    }
                  : null,

              style: ElevatedButton.styleFrom(
                backgroundColor: darkGreen,
                disabledBackgroundColor: darkGreen,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),

              child: Text(
                "Continue to Checkout",
                style: TextStyle(
                  color: canCheckout ? const Color(0xFF20E3A2) : Colors.white,
                  fontWeight: FontWeight.w700,
                  fontSize: 16,
                ),
              ),
            ),
          ),
        ),
      ),

      body: SafeArea(
        child: Column(
          children: [
            TopHeader(
              title: "Box Delivery",
              leftIcon: Icons.close_rounded,
              onLeftTap: () => Navigator.pop(context),
              rightText: "Help",
              onRightTap: () {},
            ),
            Expanded(
              child: Container(
                color: Color(0xFFF3F4F6),

                child: ListView(
                  children: [
                    SectionCard(
                      padding: EdgeInsets
                          .zero, // ✅ location card худаш padding дорад
                      child: Column(
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(
                              left: 16,
                              right: 16,
                              top: 10,
                            ),
                            child: Align(
                              alignment: Alignment.topLeft,
                              child: const Text(
                                "Location details",
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                          ),
                          _LocationCard(
                            pickupTitle: pickup == null
                                ? "Add pick-up details"
                                : "Pick-up",
                            pickupValue: pickup,
                            dropTitle: dropoff == null
                                ? "Add drop-off details"
                                : "Drop-off",
                            dropValue: dropoff,
                            pickupEnabled: true,
                            dropEnabled: pickup != null,
                            onPickupTap: _selectPickup,
                            onDropTap: _selectDropoff,
                          ),
                        ],
                      ),
                    ),

                    if (bothAddressesSelected) ...[
                      SectionCard(
                        child: _AttentionBanner(
                          text:
                              "We do not transport anything illegal or prohibited by our terms,including alcohol and money",
                        ),
                      ),

                      SectionCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Select vehicle type",
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            const SizedBox(height: 10),
                            ...List.generate(vehicles.length, (i) {
                              final v = vehicles[i];
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 10),
                                child: _VehicleTile(
                                  option: v,
                                  selected: selectedVehicleIndex == i,
                                  onTap: () =>
                                      setState(() => selectedVehicleIndex = i),
                                ),
                              );
                            }),
                          ],
                        ),
                      ),

                      SectionCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Instructions for captain",
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            const SizedBox(height: 10),
                            _NoteField(
                              controller: noteCtrl,
                              max: noteMax,
                              onChanged: (_) => setState(() {}),
                            ),
                            const SizedBox(height: 10),
                            Wrap(
                              spacing: 10,
                              runSpacing: 10,
                              children: quickNotes
                                  .map(
                                    (t) => _ChipButton(
                                      text: t,
                                      onTap: () => _appendQuickNote(t),
                                    ),
                                  )
                                  .toList(),
                            ),
                            SizedBox(height: 20),
                            _PackageCategoryTile(
                              value:
                                  selectedPackageCategory ?? "Food, groceries",
                              onTap: _selectPackageCategory,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class SectionCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets padding;

  const SectionCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(14),
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: padding,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(0),
        border: Border.all(color: const Color(0xFFE5E7EB)),
        boxShadow: const [
          BoxShadow(
            blurRadius: 16,
            offset: Offset(0, 8),
            color: Color(0x0A000000),
          ),
        ],
      ),
      child: child,
    );
  }
}

/* ===================== UI PARTS ===================== */

class _TopIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _TopIconButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: Icon(icon, size: 22, color: const Color(0xFF111827)),
        ),
      ),
    );
  }
}

class _HelpButton extends StatelessWidget {
  final VoidCallback onTap;

  const _HelpButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: onTap,
      icon: const Icon(Icons.headset_mic_rounded, size: 18),
      label: const Text("Help", style: TextStyle(fontWeight: FontWeight.w800)),
      style: OutlinedButton.styleFrom(
        foregroundColor: const Color(0xFF111827),
        side: const BorderSide(color: Color(0xFFE5E7EB)),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      ),
    );
  }
}

class _LocationCard extends StatelessWidget {
  final String pickupTitle;
  final String? pickupValue;
  final String dropTitle;
  final String? dropValue;

  final bool pickupEnabled;
  final bool dropEnabled;

  final VoidCallback onPickupTap;
  final VoidCallback onDropTap;

  const _LocationCard({
    required this.pickupTitle,
    required this.pickupValue,
    required this.dropTitle,
    required this.dropValue,
    required this.pickupEnabled,
    required this.dropEnabled,
    required this.onPickupTap,
    required this.onDropTap,
  });

  @override
  Widget build(BuildContext context) {
    const darkGreen = Color(0xFF0C3A2E);

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(0),
        // border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(
        children: [
          _LocationRow(
            enabled: pickupEnabled,
            isActive: true,
            title: pickupTitle,
            value: pickupValue,
            iconBg: darkGreen,
            iconColor: Colors.white,
            lineColor: darkGreen,
            trailing: pickupValue == null
                ? Icons.chevron_right_rounded
                : Icons.edit_rounded,
            onTap: onPickupTap,
          ),
          const Divider(height: 1, color: Color(0xFFE5E7EB)),
          _LocationRow(
            enabled: dropEnabled,
            isActive: dropEnabled && (dropValue != null),
            title: dropTitle,
            value: dropValue,
            iconBg: dropEnabled ? darkGreen : const Color(0xFFF3F4F6),
            iconColor: dropEnabled ? Colors.white : const Color(0xFF9CA3AF),
            lineColor: dropEnabled ? darkGreen : const Color(0xFFE5E7EB),
            trailing: dropValue == null
                ? Icons.chevron_right_rounded
                : Icons.edit_rounded,
            onTap: onDropTap,
          ),
        ],
      ),
    );
  }
}

class _LocationRow extends StatelessWidget {
  final bool enabled;
  final bool isActive;
  final String title;
  final String? value;

  final Color iconBg;
  final Color iconColor;
  final Color lineColor;

  final IconData trailing;
  final VoidCallback onTap;

  const _LocationRow({
    required this.enabled,
    required this.isActive,
    required this.title,
    required this.value,
    required this.iconBg,
    required this.iconColor,
    required this.lineColor,
    required this.trailing,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final titleColor = enabled
        ? (isActive ? const Color(0xFF0C3A2E) : const Color(0xFF111827))
        : const Color(0xFF9CA3AF);
    final subColor = enabled
        ? const Color(0xFF6B7280)
        : const Color(0xFFBDBDBD);

    return AbsorbPointer(
      absorbing: !enabled,
      child: Opacity(
        opacity: enabled ? 1 : 0.55,
        child: InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
            child: Row(
              children: [
                SizedBox(
                  width: 44,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Positioned(
                        top: 24,
                        bottom: -24,
                        child: Container(width: 2, color: lineColor),
                      ),
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: iconBg,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          Icons.place_rounded,
                          color: iconColor,
                          size: 20,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(width: 8),

                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                          color: titleColor,
                        ),
                      ),
                      if (value != null) ...[
                        const SizedBox(height: 3),
                        Text(
                          value!,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(fontSize: 13, color: subColor),
                        ),
                      ],
                    ],
                  ),
                ),

                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE5E7EB)),
                  ),
                  child: Icon(
                    trailing,
                    color: const Color(0xFF111827),
                    size: 18,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _AttentionBanner extends StatelessWidget {
  final String text;

  const _AttentionBanner({required this.text});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
      decoration: BoxDecoration(
        color: const Color(0xFFF3F4F6),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.block_rounded, color: Color(0xFF111827), size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 12,
                height: 1.3,
                color: Color(0xFF111827),
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class VehicleOption {
  final String title;
  final String subtitle;
  final String priceRange;
  final IconData icon;

  const VehicleOption({
    required this.title,
    required this.subtitle,
    required this.priceRange,
    required this.icon,
  });
}

class _VehicleTile extends StatelessWidget {
  final VehicleOption option;
  final bool selected;
  final VoidCallback onTap;

  const _VehicleTile({
    required this.option,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    // const darkGreen = Color(0xFF0C3A2E);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: selected
                ? const Color.fromARGB(255, 30, 83, 69)
                : const Color(0xFFE5E7EB),
            width: selected ? 2.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: const Color(0xFFF3F4F6),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(option.icon, color: const Color(0xFF111827)),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    option.title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    option.subtitle,
                    style: const TextStyle(
                      fontSize: 12.5,
                      color: Color(0xFF6B7280),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 10),
            Text(
              option.priceRange,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }
}

class _NoteField extends StatelessWidget {
  final TextEditingController controller;
  final int max;
  final ValueChanged<String> onChanged;

  const _NoteField({
    required this.controller,
    required this.max,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final count = controller.text.characters.length;

    return Container(
      padding: const EdgeInsets.fromLTRB(12, 12, 12, 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextField(
            controller: controller,
            maxLength: max,
            maxLines: 4,
            onChanged: onChanged,
            decoration: const InputDecoration(
              counterText: "",
              border: InputBorder.none,
              hintText: "e.g. leave at reception, don’t ring bell",
              hintStyle: TextStyle(
                color: Color(0xFF9CA3AF),
                fontWeight: FontWeight.w500,
              ),
            ),
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
          Align(
            alignment: Alignment.centerRight,
            child: Text(
              "$count/$max",
              style: const TextStyle(
                fontSize: 12,
                color: Color(0xFF6B7280),
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ChipButton extends StatelessWidget {
  final String text;
  final VoidCallback onTap;

  const _ChipButton({required this.text, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(22),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: const Color(0xFFE5E7EB)),
        ),
        child: Text(
          text,
          style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 13),
        ),
      ),
    );
  }
}

class _PackageCategoryTile extends StatelessWidget {
  final String value;
  final VoidCallback onTap;

  const _PackageCategoryTile({required this.value, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(14),
      onTap: onTap,
      child: Container(
        // margin: EdgeInsets.symmetric(vertical: 10),
        padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
        decoration: BoxDecoration(
          color: const Color(0xFFF3F4F6),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE5E7EB)),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Package category",
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    value,
                    style: const TextStyle(
                      fontWeight: FontWeight.w400,
                      color: Color(0xFF6B7280),
                    ),
                  ),
                ],
              ),
            ),
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE5E7EB)),
              ),
              child: const Icon(Icons.edit_rounded, size: 18),
            ),
          ],
        ),
      ),
    );
  }
}
