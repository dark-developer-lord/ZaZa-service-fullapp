import 'dart:io';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class PersonalInformationPage extends StatefulWidget {
  const PersonalInformationPage({
    super.key,
    required this.initialName,
    required this.initialPhone,
    this.initialGender, // "male" | "female" | null
    this.initialDob,
    this.initialAvatarUrl,
    this.onSave,
  });

  final String initialName;
  final String initialPhone;
  final String? initialGender;
  final DateTime? initialDob;

  /// Агар аз backend дорӣ
  final String? initialAvatarUrl;

  /// API save callback
  final Future<void> Function({
    required String name,
    required String phone,
    required String? gender,
    required DateTime? dob,
    required XFile? pickedAvatar,
  })?
  onSave;

  @override
  State<PersonalInformationPage> createState() =>
      _PersonalInformationPageState();
}

class _PersonalInformationPageState extends State<PersonalInformationPage> {
  late final TextEditingController nameCtrl;
  late final TextEditingController phoneCtrl;

  String? gender;
  DateTime? dob;

  final ImagePicker _picker = ImagePicker();
  XFile? pickedAvatar;

  bool saving = false;

  @override
  void initState() {
    super.initState();
    nameCtrl = TextEditingController(text: widget.initialName);
    phoneCtrl = TextEditingController(text: widget.initialPhone);
    gender = widget.initialGender;
    dob = widget.initialDob;
  }

  @override
  void dispose() {
    nameCtrl.dispose();
    phoneCtrl.dispose();
    super.dispose();
  }

  Future<void> _openAvatarSheet() async {
    if (!mounted) return;
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
      ),
      builder: (_) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 8),
              Container(
                width: 44,
                height: 5,
                decoration: BoxDecoration(
                  color: Colors.black12,
                  borderRadius: BorderRadius.circular(99),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                "Change photo",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 10),
              ListTile(
                leading: const Icon(Icons.photo_library_outlined),
                title: const Text("Choose from gallery"),
                onTap: () async {
                  Navigator.pop(context);
                  await _pickAvatar(ImageSource.gallery);
                },
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt_outlined),
                title: const Text("Take a photo"),
                onTap: () async {
                  Navigator.pop(context);
                  await _pickAvatar(ImageSource.camera);
                },
              ),
              if (pickedAvatar != null ||
                  (widget.initialAvatarUrl != null &&
                      widget.initialAvatarUrl!.isNotEmpty))
                ListTile(
                  leading: const Icon(Icons.delete_outline, color: Colors.red),
                  title: const Text(
                    "Remove photo",
                    style: TextStyle(color: Colors.red),
                  ),
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => pickedAvatar = null);
                  },
                ),
              const SizedBox(height: 10),
            ],
          ),
        );
      },
    );
  }

  Future<void> _pickAvatar(ImageSource source) async {
    try {
      final file = await _picker.pickImage(
        source: source,
        imageQuality: 80,
        maxWidth: 1024,
      );
      if (file == null) return;
      setState(() => pickedAvatar = file);
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Could not pick image")));
    }
  }

  Future<void> _pickDob() async {
    final now = DateTime.now();
    final res = await showDatePicker(
      context: context,
      initialDate: dob ?? DateTime(now.year - 25),
      firstDate: DateTime(1950),
      lastDate: now,
    );
    if (res != null) setState(() => dob = res);
  }

  Future<void> _save() async {
    if (widget.onSave == null) {
      Navigator.pop(context);
      return;
    }
    setState(() => saving = true);
    await widget.onSave!(
      name: nameCtrl.text.trim(),
      phone: phoneCtrl.text.trim(),
      gender: gender,
      dob: dob,
      pickedAvatar: pickedAvatar,
    );
    if (!mounted) return;
    setState(() => saving = false);
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        centerTitle: true,
        title: const Text("Personal Information"),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _avatarCard(),

          const SizedBox(height: 14),

          _groupCard(
            children: [
              _inputRow(
                label: "Full name",
                child: TextField(
                  controller: nameCtrl,
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                    hintText: "Your name",
                  ),
                ),
              ),
              const _DividerLine(),
              _inputRow(
                label: "Phone number",
                child: TextField(
                  controller: phoneCtrl,
                  enabled: false,
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                    hintText: "+992...",
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          _groupCard(
            children: [
              _tileRow(
                icon: Icons.wc_outlined,
                title: "Gender",
                subtitle: gender == null
                    ? "Not set"
                    : (gender == "male" ? "Male" : "Female"),
                trailing: DropdownButton<String>(
                  value: gender,
                  underline: const SizedBox(),
                  hint: const Text("Select"),
                  items: const [
                    DropdownMenuItem(value: "male", child: Text("Male")),
                    DropdownMenuItem(value: "female", child: Text("Female")),
                  ],
                  onChanged: (v) => setState(() => gender = v),
                ),
              ),
              const _DividerLine(),
              _tileRow(
                icon: Icons.cake_outlined,
                title: "Date of birth",
                subtitle: dob == null
                    ? "Not set"
                    : "${dob!.day.toString().padLeft(2, '0')}.${dob!.month.toString().padLeft(2, '0')}.${dob!.year}",
                trailing: const Icon(
                  Icons.chevron_right,
                  color: Color(0xFF94A3B8),
                ),
                onTap: _pickDob,
              ),
            ],
          ),

          const SizedBox(height: 22),

          SizedBox(
            height: 52,
            child: ElevatedButton(
              onPressed: saving ? null : _save,
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF107C5E),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child: saving
                  ? const CupertinoActivityIndicator(color: Colors.white)
                  : const Text(
                      "Save changes",
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _avatarCard() {
    final initials = _initialsFromName(nameCtrl.text.trim());

    Widget avatar;
    if (pickedAvatar != null) {
      avatar = ClipRRect(
        borderRadius: BorderRadius.circular(18),
        child: Image.file(
          File(pickedAvatar!.path),
          width: 86,
          height: 86,
          fit: BoxFit.cover,
        ),
      );
    } else if (widget.initialAvatarUrl != null &&
        widget.initialAvatarUrl!.isNotEmpty) {
      avatar = ClipRRect(
        borderRadius: BorderRadius.circular(18),
        child: Image.network(
          widget.initialAvatarUrl!,
          width: 86,
          height: 86,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => _initialAvatar(initials),
        ),
      );
    } else {
      avatar = _initialAvatar(initials);
    }

    return _groupCard(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Container(
                    width: 86,
                    height: 86,
                    decoration: BoxDecoration(
                      color: const Color(0xFF00A884),
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Center(child: avatar),
                  ),
                  Positioned(
                    right: -6,
                    bottom: -6,
                    child: InkWell(
                      onTap: _openAvatarSheet,
                      borderRadius: BorderRadius.circular(99),
                      child: Container(
                        width: 34,
                        height: 34,
                        decoration: BoxDecoration(
                          color: const Color(0xFF00BBA7),
                          borderRadius: BorderRadius.circular(99),
                          border: Border.all(color: Colors.white, width: 2),
                        ),
                        child: const Icon(
                          Icons.photo_camera_outlined,
                          size: 16,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Profile photo",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      "Add a clear face photo for verification.",
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.black.withOpacity(0.55),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 10),
                    OutlinedButton(
                      onPressed: _openAvatarSheet,
                      style: OutlinedButton.styleFrom(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text("Change photo"),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _initialAvatar(String initials) {
    return Container(
      alignment: Alignment.center,
      child: Text(
        initials.isEmpty ? "DR" : initials,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 22,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }

  String _initialsFromName(String name) {
    if (name.isEmpty) return "";
    final parts = name
        .split(RegExp(r"\s+"))
        .where((e) => e.trim().isNotEmpty)
        .toList();
    if (parts.isEmpty) return "";
    if (parts.length == 1) return parts.first.substring(0, 1).toUpperCase();
    return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase();
  }

  Widget _groupCard({required List<Widget> children}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 12,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: Column(children: children),
    );
  }

  Widget _inputRow({required String label, required Widget child}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Color(0xFF94A3B8),
              fontWeight: FontWeight.w600,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 6),
          child,
        ],
      ),
    );
  }

  Widget _tileRow({
    required IconData icon,
    required String title,
    required String subtitle,
    required Widget trailing,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        child: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: const Color(0xFFDFFAF3),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: const Color(0xFF00A884), size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      color: Color(0xFF64748B),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            trailing,
          ],
        ),
      ),
    );
  }
}

class _DividerLine extends StatelessWidget {
  const _DividerLine();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 1,
      margin: const EdgeInsets.only(left: 16),
      color: const Color(0xFFE6EAF0),
    );
  }
}
