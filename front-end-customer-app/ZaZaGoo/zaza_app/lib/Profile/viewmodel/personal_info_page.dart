// import 'package:flutter/cupertino.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';

// class PersonalInformationPage extends StatefulWidget {
//   const PersonalInformationPage({
//     super.key,
//     required this.initialName,
//     required this.initialPhone,
//     this.initialGender,
//     this.initialDob,
//     this.onSave,
//   });

//   final String initialName;
//   final String initialPhone;

//   /// "male" | "female" | "none"
//   final String? initialGender;

//   /// Date only (local)
//   final DateTime? initialDob;

//   /// Optional callback for saving (API call)
//   final Future<void> Function({
//     required String name,
//     required String phone,
//     required String gender,
//     required DateTime? dob,
//   })?
//   onSave;

//   @override
//   State<PersonalInformationPage> createState() =>
//       _PersonalInformationPageState();
// }

// class _PersonalInformationPageState extends State<PersonalInformationPage> {
//   late final TextEditingController _nameC;
//   late final TextEditingController _phoneC;

//   final FocusNode _nameFocus = FocusNode();

//   String _gender = "none";
//   DateTime? _dob;

//   bool _saving = false;

//   @override
//   void initState() {
//     super.initState();
//     _nameC = TextEditingController(text: widget.initialName.trim());
//     _phoneC = TextEditingController(text: widget.initialPhone.trim());
//     _gender = (widget.initialGender ?? "none").toLowerCase();
//     _dob = widget.initialDob;

//     _nameC.addListener(_rebuild);
//   }

//   @override
//   void dispose() {
//     _nameC.removeListener(_rebuild);
//     _nameC.dispose();
//     _phoneC.dispose();
//     _nameFocus.dispose();
//     super.dispose();
//   }

//   void _rebuild() => setState(() {});

//   bool get _isChanged {
//     final name = _nameC.text.trim();
//     final phone = _phoneC.text.trim();
//     final g = _gender;
//     final dob = _dob;

//     final initName = widget.initialName.trim();
//     final initPhone = widget.initialPhone.trim();
//     final initGender = (widget.initialGender ?? "none").toLowerCase();
//     final initDob = widget.initialDob;

//     final sameDob =
//         (dob == null && initDob == null) ||
//         (dob != null && initDob != null && _sameDate(dob, initDob));

//     return !(name == initName &&
//         phone == initPhone &&
//         g == initGender &&
//         sameDob);
//   }

//   bool _sameDate(DateTime a, DateTime b) =>
//       a.year == b.year && a.month == b.month && a.day == b.day;

//   bool _validate() {
//     final name = _nameC.text.trim();

//     if (name.length < 2) {
//       _toast("Ном бояд ҳадди ақал 2 ҳарф бошад");
//       _nameFocus.requestFocus();
//       return false;
//     }

//     if (_gender != "male" && _gender != "female" && _gender != "none") {
//       _toast("Лутфан Gender интихоб кунед");
//       return false;
//     }

//     if (_dob != null) {
//       final now = DateTime.now();
//       final today = DateTime(now.year, now.month, now.day);
//       final d = DateTime(_dob!.year, _dob!.month, _dob!.day);
//       if (d.isAfter(today)) {
//         _toast("Санаи таваллуд набояд дар оянда бошад");
//         return false;
//       }
//     }

//     // If you want to require Gender:
//     // if (_gender == "none") { _toast("Лутфан Gender интихоб кунед"); return false; }

//     return true;
//   }

//   Future<void> _pickGender() async {
//     final selected = await showModalBottomSheet<String>(
//       context: context,
//       backgroundColor: Colors.transparent,
//       isScrollControlled: false,
//       builder: (ctx) => _BottomSheetCard(
//         title: "Gender",
//         child: Column(
//           mainAxisSize: MainAxisSize.min,
//           children: [
//             _sheetTile(
//               title: "Male",
//               value: "male",
//               selected: _gender == "male",
//               onTap: () => Navigator.pop(ctx, "male"),
//             ),
//             _sheetTile(
//               title: "Female",
//               value: "female",
//               selected: _gender == "female",
//               onTap: () => Navigator.pop(ctx, "female"),
//             ),
//             _sheetTile(
//               title: "Prefer not to say",
//               value: "none",
//               selected: _gender == "none",
//               onTap: () => Navigator.pop(ctx, "none"),
//             ),
//             const SizedBox(height: 8),
//             _sheetCancel(ctx),
//           ],
//         ),
//       ),
//     );

//     if (selected != null && mounted) {
//       setState(() => _gender = selected);
//     }
//   }

//   Future<void> _pickDob() async {
//     final now = DateTime.now();
//     final initial = _dob ?? DateTime(now.year - 18, now.month, now.day);

//     final picked = await showDatePicker(
//       context: context,
//       initialDate: initial,
//       firstDate: DateTime(1900, 1, 1),
//       lastDate: DateTime(now.year, now.month, now.day),
//       helpText: "Date of Birth",
//       builder: (ctx, child) {
//         // keep it consistent with light UI; you can adapt to your app theme.
//         return Theme(
//           data: Theme.of(ctx).copyWith(
//             colorScheme: Theme.of(
//               ctx,
//             ).colorScheme.copyWith(primary: const Color(0xFF111827)),
//           ),
//           child: child ?? const SizedBox.shrink(),
//         );
//       },
//     );

//     if (picked != null && mounted) {
//       setState(() => _dob = DateTime(picked.year, picked.month, picked.day));
//     }
//   }

//   Future<void> _save() async {
//     if (_saving) return;
//     if (!_validate()) return;

//     setState(() => _saving = true);

//     try {
//       // If you have API:
//       if (widget.onSave != null) {
//         await widget.onSave!(
//           name: _nameC.text.trim(),
//           phone: _phoneC.text.trim(),
//           gender: _gender,
//           dob: _dob,
//         );
//       } else {
//         // Demo delay to simulate save
//         await Future.delayed(const Duration(milliseconds: 650));
//       }

//       if (!mounted) return;
//       HapticFeedback.lightImpact();
//       _toast("Сабт шуд ✅");
//       Navigator.pop(context, {
//         "name": _nameC.text.trim(),
//         "phone": _phoneC.text.trim(),
//         "gender": _gender,
//         "dob": _dob,
//       });
//     } catch (e) {
//       if (!mounted) return;
//       _toast("Хато шуд. Боз кӯшиш кунед.");
//     } finally {
//       if (mounted) setState(() => _saving = false);
//     }
//   }

//   void _toast(String msg) {
//     ScaffoldMessenger.of(context)
//       ..clearSnackBars()
//       ..showSnackBar(
//         SnackBar(
//           content: Text(msg),
//           behavior: SnackBarBehavior.floating,
//           duration: const Duration(seconds: 2),
//         ),
//       );
//   }

//   String _genderLabel(String g) {
//     switch (g) {
//       case "male":
//         return "Male";
//       case "female":
//         return "Female";
//       default:
//         return "Prefer not to say";
//     }
//   }

//   String _dobLabel(DateTime? d) {
//     if (d == null) return "Select date";
//     final dd = d.day.toString().padLeft(2, '0');
//     final mm = d.month.toString().padLeft(2, '0');
//     final yy = d.year.toString();
//     return "$dd/$mm/$yy";
//   }

//   @override
//   Widget build(BuildContext context) {
//     final canSave = _isChanged && !_saving;

//     return Scaffold(
//       backgroundColor: const Color(0xFFF7F7F7),
//       appBar: AppBar(
//         elevation: 0,
//         scrolledUnderElevation: 0,
//         backgroundColor: const Color(0xFFF7F7F7),
//         surfaceTintColor: Colors.transparent,
//         centerTitle: true,
//         title: const Text(
//           "Personal Information",
//           style: TextStyle(
//             color: Color(0xFF111827),
//             fontSize: 17,
//             fontWeight: FontWeight.w700,
//           ),
//         ),
//         leading: IconButton(
//           icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
//           color: const Color(0xFF111827),
//           onPressed: () => Navigator.pop(context),
//         ),
//       ),
//       body: SafeArea(
//         child: ListView(
//           padding: const EdgeInsets.fromLTRB(16, 10, 16, 16),
//           children: [
//             _SectionCard(
//               title: "Basic",
//               child: Column(
//                 children: [
//                   _InputRow(
//                     label: "Name",
//                     child: TextField(
//                       controller: _nameC,
//                       focusNode: _nameFocus,
//                       textInputAction: TextInputAction.done,
//                       keyboardType: TextInputType.name,
//                       style: const TextStyle(
//                         fontSize: 16,
//                         color: Color(0xFF111827),
//                         fontWeight: FontWeight.w600,
//                       ),
//                       decoration: const InputDecoration(
//                         hintText: "Enter your name",
//                         border: InputBorder.none,
//                         isDense: true,
//                       ),
//                     ),
//                   ),
//                   const _Divider(),
//                   _InputRow(
//                     label: "Phone",
//                     trailing: const Text(
//                       "Locked",
//                       style: TextStyle(
//                         fontSize: 12,
//                         color: Color(0xFF6B7280),
//                         fontWeight: FontWeight.w600,
//                       ),
//                     ),
//                     child: TextField(
//                       controller: _phoneC,
//                       readOnly: true,
//                       style: const TextStyle(
//                         fontSize: 16,
//                         color: Color(0xFF111827),
//                         fontWeight: FontWeight.w600,
//                       ),
//                       decoration: const InputDecoration(
//                         border: InputBorder.none,
//                         isDense: true,
//                       ),
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//             const SizedBox(height: 12),

//             _SectionCard(
//               title: "Details",
//               child: Column(
//                 children: [
//                   _TapRow(
//                     label: "Gender",
//                     value: _genderLabel(_gender),
//                     onTap: _pickGender,
//                   ),
//                   const _Divider(),
//                   _TapRow(
//                     label: "Date of Birth",
//                     value: _dobLabel(_dob),
//                     onTap: _pickDob,
//                   ),
//                 ],
//               ),
//             ),

//             const SizedBox(height: 16),

//             _PrimaryButton(
//               title: _saving ? "Saving..." : "Save",
//               enabled: canSave,
//               loading: _saving,
//               onTap: canSave ? _save : null,
//             ),

//             const SizedBox(height: 10),
//             Text(
//               "Phone number is locked for security. If you need to change it, we’ll add OTP verification later.",
//               textAlign: TextAlign.center,
//               style: TextStyle(
//                 fontSize: 12,
//                 color: Colors.black.withOpacity(0.45),
//                 fontWeight: FontWeight.w500,
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _sheetTile({
//     required String title,
//     required String value,
//     required bool selected,
//     required VoidCallback onTap,
//   }) {
//     return InkWell(
//       onTap: onTap,
//       borderRadius: BorderRadius.circular(14),
//       child: Container(
//         padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
//         decoration: BoxDecoration(
//           color: const Color(0xFFF3F4F6),
//           borderRadius: BorderRadius.circular(14),
//           border: Border.all(
//             color: selected ? const Color(0xFF111827) : const Color(0xFFE5E7EB),
//           ),
//         ),
//         child: Row(
//           children: [
//             Expanded(
//               child: Text(
//                 title,
//                 style: const TextStyle(
//                   fontSize: 15,
//                   color: Color(0xFF111827),
//                   fontWeight: FontWeight.w700,
//                 ),
//               ),
//             ),
//             if (selected)
//               const Icon(
//                 Icons.check_circle_rounded,
//                 size: 20,
//                 color: Color(0xFF111827),
//               )
//             else
//               const Icon(
//                 Icons.circle_outlined,
//                 size: 20,
//                 color: Color(0xFF9CA3AF),
//               ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _sheetCancel(BuildContext ctx) {
//     return InkWell(
//       onTap: () => Navigator.pop(ctx),
//       borderRadius: BorderRadius.circular(14),
//       child: Container(
//         width: double.infinity,
//         padding: const EdgeInsets.symmetric(vertical: 14),
//         decoration: BoxDecoration(
//           color: Colors.white,
//           borderRadius: BorderRadius.circular(14),
//           border: Border.all(color: const Color(0xFFE5E7EB)),
//         ),
//         child: const Center(
//           child: Text(
//             "Cancel",
//             style: TextStyle(
//               fontSize: 15,
//               color: Color(0xFF111827),
//               fontWeight: FontWeight.w500,
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }

// class _SectionCard extends StatelessWidget {
//   const _SectionCard({required this.title, required this.child});
//   final String title;
//   final Widget child;

//   @override
//   Widget build(BuildContext context) {
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         Padding(
//           padding: const EdgeInsets.only(left: 6, bottom: 8),
//           child: Text(
//             title.toUpperCase(),
//             style: const TextStyle(
//               fontSize: 12,
//               color: Color(0xFF6B7280),
//               fontWeight: FontWeight.w500,
//               letterSpacing: 0.6,
//             ),
//           ),
//         ),
//         Container(
//           decoration: BoxDecoration(
//             color: Colors.white,
//             borderRadius: BorderRadius.circular(18),
//             border: Border.all(color: const Color(0xFFE5E7EB)),
//             boxShadow: [
//               BoxShadow(
//                 color: Colors.black.withOpacity(0.04),
//                 blurRadius: 18,
//                 offset: const Offset(0, 10),
//               ),
//             ],
//           ),
//           child: child,
//         ),
//       ],
//     );
//   }
// }

// class _InputRow extends StatelessWidget {
//   const _InputRow({required this.label, required this.child, this.trailing});

//   final String label;
//   final Widget child;
//   final Widget? trailing;

//   @override
//   Widget build(BuildContext context) {
//     return Padding(
//       padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
//       child: Row(
//         crossAxisAlignment: CrossAxisAlignment.center,
//         children: [
//           SizedBox(
//             width: 88,
//             child: Text(
//               label,
//               style: const TextStyle(
//                 fontSize: 13,
//                 color: Color(0xFF6B7280),
//                 fontWeight: FontWeight.w500,
//               ),
//             ),
//           ),
//           Expanded(child: child),
//           if (trailing != null) ...[const SizedBox(width: 10), trailing!],
//         ],
//       ),
//     );
//   }
// }

// class _TapRow extends StatelessWidget {
//   const _TapRow({
//     required this.label,
//     required this.value,
//     required this.onTap,
//   });

//   final String label;
//   final String value;
//   final VoidCallback onTap;

//   @override
//   Widget build(BuildContext context) {
//     return InkWell(
//       onTap: onTap,
//       borderRadius: BorderRadius.circular(18),
//       child: Padding(
//         padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
//         child: Row(
//           children: [
//             SizedBox(
//               child: Text(
//                 label,
//                 style: const TextStyle(
//                   fontSize: 13,
//                   color: Color(0xFF6B7280),
//                   fontWeight: FontWeight.w500,
//                 ),
//               ),
//             ),
//             Expanded(
//               child: Text(
//                 value,
//                 textAlign: TextAlign.right,
//                 style: TextStyle(
//                   fontSize: 15,
//                   color: value == "Select date"
//                       ? const Color(0xFF9CA3AF)
//                       : const Color(0xFF111827),
//                   fontWeight: FontWeight.w500,
//                 ),
//               ),
//             ),
//             const SizedBox(width: 10),
//             const Icon(
//               Icons.chevron_right_rounded,
//               size: 22,
//               color: Color(0xFF9CA3AF),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// class _Divider extends StatelessWidget {
//   const _Divider();

//   @override
//   Widget build(BuildContext context) {
//     return const Padding(
//       padding: EdgeInsets.only(left: 14),
//       child: Divider(height: 1, thickness: 1, color: Color(0xFFE5E7EB)),
//     );
//   }
// }

// class _PrimaryButton extends StatelessWidget {
//   const _PrimaryButton({
//     required this.title,
//     required this.enabled,
//     required this.loading,
//     required this.onTap,
//   });

//   final String title;
//   final bool enabled;
//   final bool loading;
//   final VoidCallback? onTap;

//   @override
//   Widget build(BuildContext context) {
//     return GestureDetector(
//       onTap: enabled ? onTap : null,
//       child: AnimatedOpacity(
//         duration: const Duration(milliseconds: 180),
//         opacity: enabled ? 1 : 0.55,
//         child: Container(
//           height: 52,
//           decoration: BoxDecoration(
//             color: const Color(0xFF111827),
//             borderRadius: BorderRadius.circular(16),
//             boxShadow: [
//               BoxShadow(
//                 color: Colors.black.withOpacity(0.12),
//                 blurRadius: 18,
//                 offset: const Offset(0, 10),
//               ),
//             ],
//           ),
//           child: Center(
//             child: loading
//                 ? const SizedBox(
//                     height: 18,
//                     width: 18,
//                     child: CircularProgressIndicator(
//                       strokeWidth: 2,
//                       color: Colors.white,
//                     ),
//                   )
//                 : Text(
//                     title,
//                     style: const TextStyle(
//                       fontSize: 15,
//                       color: Colors.white,
//                       fontWeight: FontWeight.w900,
//                       letterSpacing: 0.2,
//                     ),
//                   ),
//           ),
//         ),
//       ),
//     );
//   }
// }

// class _BottomSheetCard extends StatelessWidget {
//   const _BottomSheetCard({required this.title, required this.child});
//   final String title;
//   final Widget child;

//   @override
//   Widget build(BuildContext context) {
//     return SafeArea(
//       bottom: false,
//       child: Container(
//         decoration: BoxDecoration(
//           color: Colors.white,
//           borderRadius: BorderRadius.circular(18),
//           border: Border.all(color: const Color(0xFFE5E7EB)),
//           boxShadow: [
//             BoxShadow(
//               color: Colors.black.withOpacity(0.12),
//               blurRadius: 24,
//               offset: const Offset(0, 14),
//             ),
//           ],
//         ),
//         child: Padding(
//           padding: const EdgeInsets.fromLTRB(14, 14, 14, 50),
//           child: Column(
//             mainAxisSize: MainAxisSize.min,
//             children: [
//               Container(
//                 height: 4,
//                 width: 44,
//                 decoration: BoxDecoration(
//                   color: const Color(0xFFE5E7EB),
//                   borderRadius: BorderRadius.circular(999),
//                 ),
//               ),
//               const SizedBox(height: 10),
//               Text(
//                 title,
//                 style: const TextStyle(
//                   fontSize: 16,
//                   color: Color(0xFF111827),
//                   fontWeight: FontWeight.w600,
//                 ),
//               ),
//               const SizedBox(height: 12),
//               child,
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class PersonalInformationPage extends StatefulWidget {
  const PersonalInformationPage({
    super.key,
    required this.initialName,
    required this.initialPhone,
    this.initialGender,
    this.initialDob,
    this.onSave,
  });

  final String initialName;
  final String initialPhone;

  /// "male" | "female" | "none"
  final String? initialGender;

  /// Date only (local)
  final DateTime? initialDob;

  /// Optional callback for saving (API call)
  final Future<void> Function({
    required String name,
    required String phone,
    required String gender,
    required DateTime? dob,
  })?
  onSave;

  @override
  State<PersonalInformationPage> createState() =>
      _PersonalInformationPageState();
}

class _PersonalInformationPageState extends State<PersonalInformationPage> {
  late final TextEditingController _nameC;
  late final TextEditingController _phoneC;

  final FocusNode _nameFocus = FocusNode();

  String _gender = "none";
  DateTime? _dob;

  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _nameC = TextEditingController(text: widget.initialName.trim());
    _phoneC = TextEditingController(text: widget.initialPhone.trim());
    _gender = (widget.initialGender ?? "none").toLowerCase();
    _dob = widget.initialDob;

    _nameC.addListener(_rebuild);
  }

  @override
  void dispose() {
    _nameC.removeListener(_rebuild);
    _nameC.dispose();
    _phoneC.dispose();
    _nameFocus.dispose();
    super.dispose();
  }

  void _rebuild() => setState(() {});

  bool get _isChanged {
    final name = _nameC.text.trim();
    final phone = _phoneC.text.trim();
    final g = _gender;
    final dob = _dob;

    final initName = widget.initialName.trim();
    final initPhone = widget.initialPhone.trim();
    final initGender = (widget.initialGender ?? "none").toLowerCase();
    final initDob = widget.initialDob;

    final sameDob =
        (dob == null && initDob == null) ||
        (dob != null && initDob != null && _sameDate(dob, initDob));

    return !(name == initName &&
        phone == initPhone &&
        g == initGender &&
        sameDob);
  }

  bool _sameDate(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;

  bool _validate() {
    final name = _nameC.text.trim();

    if (name.length < 2) {
      _toast("Ном бояд ҳадди ақал 2 ҳарф бошад");
      _nameFocus.requestFocus();
      return false;
    }

    if (_gender != "male" && _gender != "female" && _gender != "none") {
      _toast("Лутфан Gender интихоб кунед");
      return false;
    }

    if (_dob != null) {
      final now = DateTime.now();
      final today = DateTime(now.year, now.month, now.day);
      final d = DateTime(_dob!.year, _dob!.month, _dob!.day);
      if (d.isAfter(today)) {
        _toast("Санаи таваллуд набояд дар оянда бошад");
        return false;
      }
    }

    return true;
  }

  /// ✅ Gender sheet: NO margin left/right/bottom
  Future<void> _pickGender() async {
    final selected = await showModalBottomSheet<String>(
      context: context,
      backgroundColor: Colors.transparent,
      barrierColor: Colors.black.withOpacity(0.18),
      isScrollControlled: false,
      useSafeArea: true,
      builder: (ctx) => _BottomSheetCardNoMargin(
        title: "Gender",
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _sheetTileNoMargin(
              title: "Male",
              selected: _gender == "male",
              onTap: () => Navigator.pop(ctx, "male"),
            ),
            const SizedBox(height: 10),
            _sheetTileNoMargin(
              title: "Female",
              selected: _gender == "female",
              onTap: () => Navigator.pop(ctx, "female"),
            ),
            const SizedBox(height: 10),
            _sheetTileNoMargin(
              title: "Prefer not to say",
              selected: _gender == "none",
              onTap: () => Navigator.pop(ctx, "none"),
            ),
            const SizedBox(height: 12),
            _sheetCancelNoMargin(ctx),
          ],
        ),
      ),
    );

    if (selected != null && mounted) {
      setState(() => _gender = selected);
    }
  }

  /// ✅ DOB: iOS wheel picker bottom sheet (premium)
  Future<void> _pickDob() async {
    final picked = await DobWheelPicker.show(
      context,
      initial: _dob,
      title: "Date of Birth",
    );

    if (picked != null && mounted) {
      setState(() => _dob = DateTime(picked.year, picked.month, picked.day));
    }
  }

  Future<void> _save() async {
    if (_saving) return;
    if (!_validate()) return;

    setState(() => _saving = true);

    try {
      if (widget.onSave != null) {
        await widget.onSave!(
          name: _nameC.text.trim(),
          phone: _phoneC.text.trim(),
          gender: _gender,
          dob: _dob,
        );
      } else {
        await Future.delayed(const Duration(milliseconds: 650));
      }

      if (!mounted) return;
      HapticFeedback.lightImpact();
      _toast("Сабт шуд ✅");
      Navigator.pop(context, {
        "name": _nameC.text.trim(),
        "phone": _phoneC.text.trim(),
        "gender": _gender,
        "dob": _dob,
      });
    } catch (e) {
      if (!mounted) return;
      _toast("Хато шуд. Боз кӯшиш кунед.");
    } finally {
      if (mounted) setState(() => _saving = false);
    }
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

  String _genderLabel(String g) {
    switch (g) {
      case "male":
        return "Male";
      case "female":
        return "Female";
      default:
        return "Prefer not to say";
    }
  }

  String _dobLabel(DateTime? d) {
    if (d == null) return "Select date";
    final dd = d.day.toString().padLeft(2, '0');
    final mm = d.month.toString().padLeft(2, '0');
    final yy = d.year.toString();
    return "$dd/$mm/$yy";
  }

  @override
  Widget build(BuildContext context) {
    final canSave = _isChanged && !_saving;

    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      appBar: AppBar(
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: const Color(0xFFF7F7F7),
        surfaceTintColor: Colors.transparent,
        centerTitle: true,
        title: const Text(
          "Personal Information",
          style: TextStyle(
            color: Color(0xFF111827),
            fontSize: 17,
            fontWeight: FontWeight.w700,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          color: const Color(0xFF111827),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 16),
          children: [
            _SectionCard(
              title: "Basic",
              child: Column(
                children: [
                  _InputRow(
                    label: "Name",
                    child: TextField(
                      controller: _nameC,
                      focusNode: _nameFocus,
                      textInputAction: TextInputAction.done,
                      keyboardType: TextInputType.name,
                      style: const TextStyle(
                        fontSize: 16,
                        color: Color(0xFF111827),
                        fontWeight: FontWeight.w600,
                      ),
                      decoration: const InputDecoration(
                        hintText: "Enter your name",
                        border: InputBorder.none,
                        isDense: true,
                      ),
                    ),
                  ),
                  const _Divider(),
                  _InputRow(
                    label: "Phone",
                    trailing: const Text(
                      "Locked",
                      style: TextStyle(
                        fontSize: 12,
                        color: Color(0xFF6B7280),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    child: TextField(
                      controller: _phoneC,
                      readOnly: true,
                      style: const TextStyle(
                        fontSize: 16,
                        color: Color(0xFF111827),
                        fontWeight: FontWeight.w600,
                      ),
                      decoration: const InputDecoration(
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
              title: "Details",
              child: Column(
                children: [
                  _TapRow(
                    label: "Gender",
                    value: _genderLabel(_gender),
                    onTap: _pickGender,
                  ),
                  const _Divider(),

                  // ✅ NEW DOB DESIGN (chip + wheel picker)
                  _DobWheelRow(
                    label: "Date of Birth",
                    valueText: _dobLabel(_dob),
                    isEmpty: _dob == null,
                    onTap: _pickDob,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            _PrimaryButton(
              title: _saving ? "Saving..." : "Save",
              enabled: canSave,
              loading: _saving,
              onTap: canSave ? _save : null,
            ),
            const SizedBox(height: 10),
            Text(
              "Phone number is locked for security. If you need to change it, we’ll add OTP verification later.",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 12,
                color: Colors.black.withOpacity(0.45),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// ✅ UPDATED: remove unused `value` param, keep clean
  Widget _sheetTileNoMargin({
    required String title,
    required bool selected,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: const Color(0xFFF3F4F6),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: selected ? const Color(0xFF111827) : const Color(0xFFE5E7EB),
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 15,
                  color: Color(0xFF111827),
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            if (selected)
              const Icon(
                Icons.check_circle_rounded,
                size: 20,
                color: Color(0xFF111827),
              )
            else
              const Icon(
                Icons.circle_outlined,
                size: 20,
                color: Color(0xFF9CA3AF),
              ),
          ],
        ),
      ),
    );
  }

  Widget _sheetCancelNoMargin(BuildContext ctx) {
    return InkWell(
      onTap: () => Navigator.pop(ctx),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE5E7EB)),
        ),
        child: const Center(
          child: Text(
            "Cancel",
            style: TextStyle(
              fontSize: 15,
              color: Color(0xFF111827),
              fontWeight: FontWeight.w900,
            ),
          ),
        ),
      ),
    );
  }
}

/// ✅ DOB picker bottom sheet (NO margin)
class DobWheelPicker {
  static Future<DateTime?> show(
    BuildContext context, {
    required DateTime? initial,
    DateTime? minDate,
    DateTime? maxDate,
    String title = "Date of Birth",
  }) async {
    final now = DateTime.now();
    final min = minDate ?? DateTime(1900, 1, 1);
    final max = maxDate ?? DateTime(now.year, now.month, now.day);

    DateTime temp = initial ?? DateTime(now.year - 18, now.month, now.day);
    if (temp.isBefore(min)) temp = min;
    if (temp.isAfter(max)) temp = max;

    final result = await showModalBottomSheet<DateTime>(
      context: context,
      backgroundColor: Colors.transparent,
      barrierColor: Colors.black.withOpacity(0.18),
      useSafeArea: true,
      builder: (ctx) {
        return _BottomSheetCardNoMargin(
          title: title,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(
                height: 220,
                child: CupertinoTheme(
                  data: const CupertinoThemeData(brightness: Brightness.light),
                  child: CupertinoDatePicker(
                    mode: CupertinoDatePickerMode.date,
                    initialDateTime: temp,
                    minimumDate: min,
                    maximumDate: max,
                    onDateTimeChanged: (d) {
                      temp = DateTime(d.year, d.month, d.day);
                      HapticFeedback.selectionClick();
                    },
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _SheetButton(
                      title: "Cancel",
                      filled: false,
                      onTap: () => Navigator.pop(ctx),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _SheetButton(
                      title: "Done",
                      filled: true,
                      onTap: () => Navigator.pop(ctx, temp),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );

    return result;
  }
}

/// ✅ DOB row design (chip)
class _DobWheelRow extends StatelessWidget {
  const _DobWheelRow({
    required this.label,
    required this.valueText,
    required this.isEmpty,
    required this.onTap,
  });

  final String label;
  final String valueText;
  final bool isEmpty;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        child: Row(
          children: [
            SizedBox(
              width: 88,
              child: Text(
                label,
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF6B7280),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            Expanded(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Container(
                    // padding: const EdgeInsets.symmetric(
                    //   horizontal: 10,
                    //   vertical: 8,
                    // ),
                    // decoration: BoxDecoration(
                    //   color: const Color(0xFFF3F4F6),
                    //   borderRadius: BorderRadius.circular(12),
                    //   border: Border.all(color: const Color(0xFFE5E7EB)),
                    // ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.cake_rounded,
                          size: 18,
                          color: isEmpty
                              ? const Color(0xFF9CA3AF)
                              : const Color(0xFF111827),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          valueText,
                          style: TextStyle(
                            fontSize: 15,
                            color: isEmpty
                                ? const Color(0xFF9CA3AF)
                                : const Color(0xFF111827),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  const Icon(
                    Icons.chevron_right_rounded,
                    size: 22,
                    color: Color(0xFF9CA3AF),
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
              fontWeight: FontWeight.w500,
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
  const _InputRow({required this.label, required this.child, this.trailing});
  final String label;
  final Widget child;
  final Widget? trailing;

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
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Expanded(child: child),
          if (trailing != null) ...[const SizedBox(width: 10), trailing!],
        ],
      ),
    );
  }
}

class _TapRow extends StatelessWidget {
  const _TapRow({
    required this.label,
    required this.value,
    required this.onTap,
  });

  final String label;
  final String value;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        child: Row(
          children: [
            SizedBox(
              child: Text(
                label,
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF6B7280),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            Expanded(
              child: Text(
                value,
                textAlign: TextAlign.right,
                style: TextStyle(
                  fontSize: 15,
                  color: value == "Select date"
                      ? const Color(0xFF9CA3AF)
                      : const Color(0xFF111827),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            const SizedBox(width: 10),
            const Icon(
              Icons.chevron_right_rounded,
              size: 22,
              color: Color(0xFF9CA3AF),
            ),
          ],
        ),
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
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.2,
                    ),
                  ),
          ),
        ),
      ),
    );
  }
}

/// ✅ Bottom sheet card with NO outer margin
class _BottomSheetCardNoMargin extends StatelessWidget {
  const _BottomSheetCardNoMargin({required this.title, required this.child});
  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      left: true,
      right: true,
      bottom: false,
      child: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(18),
            topRight: Radius.circular(18),
          ),
          border: Border.all(color: const Color(0xFFE5E7EB)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.12),
              blurRadius: 24,
              offset: const Offset(0, -6),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 40),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                height: 4,
                width: 44,
                decoration: BoxDecoration(
                  color: const Color(0xFFE5E7EB),
                  borderRadius: BorderRadius.circular(999),
                ),
              ),
              const SizedBox(height: 10),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  color: Color(0xFF111827),
                  fontWeight: FontWeight.w400,
                ),
              ),
              const SizedBox(height: 12),
              child,
            ],
          ),
        ),
      ),
    );
  }
}

class _SheetButton extends StatelessWidget {
  const _SheetButton({
    required this.title,
    required this.filled,
    required this.onTap,
  });

  final String title;
  final bool filled;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        height: 46,
        decoration: BoxDecoration(
          color: filled ? const Color(0xFF111827) : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE5E7EB)),
        ),
        child: Center(
          child: Text(
            title,
            style: TextStyle(
              fontSize: 15,
              color: filled ? Colors.white : const Color(0xFF111827),
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}
