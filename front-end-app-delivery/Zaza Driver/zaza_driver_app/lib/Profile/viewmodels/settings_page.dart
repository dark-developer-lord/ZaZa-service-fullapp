import 'package:flutter/material.dart';

class DriverSettingsPage extends StatefulWidget {
  const DriverSettingsPage({super.key});

  @override
  State<DriverSettingsPage> createState() => _DriverSettingsPageState();
}

class _DriverSettingsPageState extends State<DriverSettingsPage> {
  bool pushOn = true;
  bool soundOn = true;

  bool darkMode = false;

  bool locationServices = true;
  bool backgroundLocation = true;

  String language = "English";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        centerTitle: true,
        title: const Text("Settings"),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
        children: [
          const _SectionLabel("Notifications"),
          const SizedBox(height: 10),
          _GroupCard(
            children: [
              _SettingRow(
                icon: Icons.notifications_none,
                title: "Push Notifications",
                subtitle: "New order alerts",
                trailing: Switch(
                  value: pushOn,
                  onChanged: (v) => setState(() => pushOn = v),
                  activeColor: const Color(0xFF00A884),
                ),
                onTap: () => setState(() => pushOn = !pushOn),
              ),
              const _DividerLine(),
              _SettingRow(
                icon: Icons.volume_up_outlined,
                title: "Sound",
                subtitle: "Notification sounds",
                trailing: Switch(
                  value: soundOn,
                  onChanged: (v) => setState(() => soundOn = v),
                  activeColor: const Color(0xFF00A884),
                ),
                onTap: () => setState(() => soundOn = !soundOn),
              ),
            ],
          ),

          const SizedBox(height: 16),

          const _SectionLabel("Appearance"),
          const SizedBox(height: 10),
          _GroupCard(
            children: [
              _SettingRow(
                icon: Icons.dark_mode_outlined,
                title: "Dark Mode",
                subtitle: "Use dark theme",
                trailing: Switch(
                  value: darkMode,
                  onChanged: (v) => setState(() => darkMode = v),
                  activeColor: const Color(0xFF00A884),
                ),
                onTap: () => setState(() => darkMode = !darkMode),
              ),
              const _DividerLine(),
              _SettingRow(
                icon: Icons.language_outlined,
                title: "Language",
                subtitle: language,
                trailing: const _TrailingTextButton(""),
                // onTap: _openLanguageSheet,
                // onTrailingTap: _openLanguageSheet,
              ),
            ],
          ),

          const SizedBox(height: 16),

          const _SectionLabel("Location"),
          const SizedBox(height: 10),
          _GroupCard(
            children: [
              _SettingRow(
                icon: Icons.location_on_outlined,
                title: "Location Services",
                subtitle: "Always allow",
                trailing: Switch(
                  value: locationServices,
                  onChanged: (v) => setState(() => locationServices = v),
                  activeColor: const Color(0xFF00A884),
                ),
                onTap: () =>
                    setState(() => locationServices = !locationServices),
              ),
              const _DividerLine(),
              _SettingRow(
                icon: Icons.phone_iphone_outlined,
                title: "Background Location",
                subtitle: "Track while offline",
                trailing: Switch(
                  value: backgroundLocation,
                  onChanged: (v) => setState(() => backgroundLocation = v),
                  activeColor: const Color(0xFF00A884),
                ),
                onTap: () =>
                    setState(() => backgroundLocation = !backgroundLocation),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // void _openLanguageSheet() {
  //   showModalBottomSheet(
  //     context: context,
  //     backgroundColor: Colors.white,
  //     shape: const RoundedRectangleBorder(
  //       borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
  //     ),
  //     builder: (_) {
  //       return SafeArea(
  //         child: Column(
  //           mainAxisSize: MainAxisSize.min,
  //           children: [
  //             const SizedBox(height: 8),
  //             Container(
  //               width: 44,
  //               height: 5,
  //               decoration: BoxDecoration(
  //                 color: Colors.black12,
  //                 borderRadius: BorderRadius.circular(99),
  //               ),
  //             ),
  //             const SizedBox(height: 12),
  //             const Text(
  //               "Choose language",
  //               style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
  //             ),
  //             const SizedBox(height: 10),

  //             // _langTile("English"),
  //             // _langTile("Русский"),

  //             // _langTile("Тоҷикӣ"),
  //             // _langTile("Oʻzbek"),
  //             const SizedBox(height: 10),
  //           ],
  //         ),
  //       );
  //     },
  //   );
  // }

  // Widget _langTile(String title) {
  //   final selected = language == title;
  //   return ListTile(
  //     title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
  //     trailing: selected
  //         ? const Icon(Icons.check_circle, color: Color(0xFF00A884))
  //         : null,
  //     onTap: () {
  //       setState(() => language = title);
  //       Navigator.pop(context);
  //       // TODO: save to SharedPreferences + apply AppLocalizations
  //     },
  //   );
  // }
}

/// =======================
/// UI pieces (same style as your Profile page)
/// =======================

class _SectionLabel extends StatelessWidget {
  final String text;
  const _SectionLabel(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        color: Color(0xFF94A3B8),
        fontWeight: FontWeight.w500,
        fontSize: 14,
      ),
    );
  }
}

class _GroupCard extends StatelessWidget {
  final List<Widget> children;
  const _GroupCard({required this.children});

  @override
  Widget build(BuildContext context) {
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
}

class _SettingRow extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final Widget trailing;

  final VoidCallback? onTap;
  final VoidCallback? onTrailingTap;

  const _SettingRow({
    required this.icon,
    required this.title,
    this.subtitle,
    required this.trailing,
    this.onTap,
    this.onTrailingTap,
  });

  bool _isSwitch() => trailing is Switch;

  @override
  Widget build(BuildContext context) {
    final isSwitch = _isSwitch();

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
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
                  if (subtitle != null && subtitle!.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      subtitle!,
                      style: const TextStyle(
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ],
              ),
            ),

            // ✅ trailing tap only for non-switch widgets
            if (!isSwitch)
              InkWell(
                onTap: onTrailingTap,
                borderRadius: BorderRadius.circular(12),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 6,
                  ),
                  child: trailing,
                ),
              )
            else
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
                child: trailing,
              ),
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
      margin: const EdgeInsets.only(left: 68),
      color: const Color(0xFFE6EAF0),
    );
  }
}

class _TrailingTextButton extends StatelessWidget {
  final String text;
  const _TrailingTextButton(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        color: Color(0xFF00A884),
        fontWeight: FontWeight.w700,
      ),
    );
  }
}
