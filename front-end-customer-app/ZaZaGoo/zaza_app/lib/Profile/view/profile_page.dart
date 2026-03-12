import 'package:flutter/material.dart';
import 'package:zaza_app/Help%20Center/view/help_center_page.dart';
import 'package:zaza_app/Profile/viewmodel/notification_page.dart';
import 'package:zaza_app/Profile/viewmodel/personal_info_page.dart';
import 'package:zaza_app/Address/view/save_addres_page.dart';
import 'package:zaza_app/Profile/viewmodel/settinga_apge.dart';
import 'package:zaza_app/bottom_to_top.dart';

class ProfilePage extends StatelessWidget {
  final String name;
  final String phone;
  final String language;
  // final String city;
  final String appVersion;

  const ProfilePage({
    super.key,
    this.name = "Muhammad",
    this.phone = "+992067666666",
    this.language = "Russian",
    // this.city = "Dushanbe, Tajikistan",
    this.appVersion = "App version 1.0.0",
  });

  @override
  Widget build(BuildContext context) {
    const green = Color(0xFF0C6B52);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: Row(
                children: [
                  _IconPillButton(
                    icon: Icons.arrow_back_ios_new_rounded,
                    onTap: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 18),
                children: [
                  // Name row + Help
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Expanded(
                        child: Text(
                          name,
                          style: const TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.w600,
                            letterSpacing: -0.5,
                          ),
                        ),
                      ),
                      InkWell(
                        borderRadius: BorderRadius.circular(12),
                        onTap: () {
                          Navigator.push(
                            context,
                            bottomToTop(HelpCenterPage()),
                          );
                        },
                        child: const Padding(
                          padding: EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 6,
                          ),
                          child: Text(
                            "Help",
                            style: TextStyle(
                              color: green,
                              fontWeight: FontWeight.w600,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),

                  // ✅ YOUR ACCOUNT
                  const _SectionTitle("Your account"),
                  const SizedBox(height: 6),
                  _ProfileTile(
                    icon: Icons.person_outline_rounded,
                    title: "Personal information",
                    subtitle: phone,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => PersonalInformationPage(
                            initialName: name,
                            initialPhone: phone,
                          ),
                        ),
                      );
                    },
                  ),
                  // _ProfileTile(
                  //   icon: Icons.credit_card_rounded,
                  //   title: "Cards and accounts",
                  //   onTap: () {
                  //     // TODO open cards
                  //   },
                  // ),
                  _ProfileTile(
                    icon: Icons.location_on_outlined,
                    title: "Saved addresses",
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => SavedAddressesPage()),
                      );
                    },
                  ),
                  _ProfileTile(
                    icon: Icons.notifications_none_rounded,
                    title: "Notifications",
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => NotificationsPage()),
                      );
                    },
                  ),

                  const SizedBox(height: 22),

                  // ✅ SUPPORT
                  const _SectionTitle("Support"),
                  const SizedBox(height: 6),
                  _ProfileTile(
                    icon: Icons.help_outline_rounded,
                    title: "Help",
                    onTap: () {
                      Navigator.push(context, bottomToTop(HelpCenterPage()));
                    },
                  ),
                  _ProfileTile(
                    icon: Icons.star_border_rounded,
                    title: "Rate the app",
                    onTap: () {
                      // TODO in_app_review
                    },
                  ),

                  // _ProfileTile(
                  //   icon: Icons.emoji_people_outlined,
                  //   title: "Become a captain",
                  //   onTap: () {
                  //     // TODO open captain
                  //   },
                  // ),
                  const SizedBox(height: 22),

                  // ✅ PREFERENCES
                  const _SectionTitle("Preferences"),
                  const SizedBox(height: 6),
                  _ProfileTile(
                    icon: Icons.language_rounded,
                    title: "Language",
                    subtitle: language,
                    onTap: () {
                      // TODO open language
                    },
                  ),
                  // _ProfileTile(
                  //   icon: Icons.location_city_rounded,
                  //   title: "City",
                  //   subtitle: city,
                  //   onTap: () {
                  //     // TODO open city select
                  //   },
                  // ),
                  _ProfileTile(
                    icon: Icons.settings_outlined,
                    title: "Settings",
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ZazaSettingsPage(
                            onLogout: () async {
                              // TODO: clear token + prefs
                            },
                            onDeleteAccount: () async {
                              // TODO: call API delete + clear local
                            },
                          ),
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 18),

                  // Footer
                  Center(
                    child: Column(
                      children: [
                        Text(
                          "Terms and conditions",
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            color: Colors.black.withOpacity(0.55),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          appVersion,
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            color: Colors.black.withOpacity(0.40),
                            fontSize: 12.5,
                          ),
                        ),
                      ],
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

class _SectionTitle extends StatelessWidget {
  final String text;
  const _SectionTitle(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        letterSpacing: -0.2,
      ),
    );
  }
}

class _ProfileTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback? onTap;

  const _ProfileTile({
    required this.icon,
    required this.title,
    this.subtitle,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 14),
        child: Row(
          children: [
            SizedBox(
              width: 34,
              child: Icon(icon, color: Colors.black.withOpacity(0.45)),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14.5,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      subtitle!,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w400,
                        color: Colors.black.withOpacity(0.45),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            Icon(
              Icons.chevron_right_rounded,
              size: 28,
              color: Colors.black.withOpacity(0.25),
            ),
          ],
        ),
      ),
    );
  }
}

class _IconPillButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _IconPillButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.black.withOpacity(0.10)),
          ),
          width: 44,
          height: 44,
          child: Center(
            child: Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          ),
        ),
      ),
    );
  }
}
