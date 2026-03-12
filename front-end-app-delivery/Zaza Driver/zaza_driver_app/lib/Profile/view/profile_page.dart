// import 'package:flutter/material.dart';

// class ProfilePage extends StatefulWidget {
//   const ProfilePage({super.key});

//   @override
//   State<ProfilePage> createState() => _ProfilePageState();
// }

// class _ProfilePageState extends State<ProfilePage> {
//   bool notificationsOn = true;

//   @override
//   Widget build(BuildContext context) {
//     // баландии контентро ҳисоб мекунем, то scroll бурида нашавад
//     final h = MediaQuery.of(context).size.height;

//     return Scaffold(
//       backgroundColor: const Color(0xFFF7F7F7),
//       body: SingleChildScrollView(
//         child: Stack(
//           clipBehavior: Clip.none,
//           children: [
//             // ✅ HEADER BG
//             const _ProfileHeader(), // height: 400 дар худи _ProfileHeader ҳаст
//             // ✅ CONTENT (баромада аз сабз)
//             Positioned(
//               left: 16,
//               right: 16,
//               top: 160, // ин overlap-ро идора мекунад
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   const _ProfileInfoCard(
//                     initials: "HA",
//                     name: "Hassan Ahmed",
//                     role: "Courier Captain",
//                     badgeText: "Premium Driver",
//                     rating: "4.8",
//                     orders: "1247",
//                     onTime: "98%",
//                     accept: "95%",
//                   ),
//                   const SizedBox(height: 40),

//                   const _SectionLabel("Account"),
//                   const SizedBox(height: 10),
//                   _GroupCard(
//                     children: const [
//                       _SettingRow(
//                         icon: Icons.person_outline,
//                         title: "Personal Information",
//                         trailing: _RowChevron(),
//                       ),
//                       // _DividerLine(),
//                       // _SettingRow(
//                       //   icon: Icons.location_on_outlined,
//                       //   title: "Current Location",
//                       //   subtitle: "Dubai Marina, UAE",
//                       //   trailing: _RowChevron(),
//                       // ),
//                     ],
//                   ),

//                   // const SizedBox(height: 16),

//                   // const _SectionLabel("Vehicle"),
//                   // const SizedBox(height: 10),
//                   // _GroupCard(
//                   //   children: const [
//                   //     _SettingRow(
//                   //       icon: Icons.directions_car_outlined,
//                   //       title: "Vehicle Details",
//                   //       subtitle: "Motorcycle",
//                   //       trailing: _RowChevron(),
//                   //     ),
//                   //     _DividerLine(),
//                   //     _SettingRow(
//                   //       icon: Icons.description_outlined,
//                   //       title: "Documents",
//                   //       trailing: _RightBadge(text: "Verified"),
//                   //     ),
//                   //   ],
//                   // ),
//                   const SizedBox(height: 16),

//                   const _SectionLabel("Preferences"),
//                   const SizedBox(height: 10),
//                   _GroupCard(
//                     children: [
//                       _SettingRow(
//                         icon: Icons.notifications_none,
//                         title: "Notifications",
//                         trailing: Switch(
//                           value: notificationsOn,
//                           onChanged: (v) => setState(() => notificationsOn = v),
//                           activeColor: const Color(0xFF00A884),
//                         ),
//                       ),
//                       const _DividerLine(),
//                       const _SettingRow(
//                         icon: Icons.settings_outlined,
//                         title: "App Settings",
//                         trailing: _RowChevron(),
//                       ),
//                     ],
//                   ),

//                   const SizedBox(height: 16),

//                   const _SectionLabel("Support"),
//                   const SizedBox(height: 10),
//                   _GroupCard(
//                     children: const [
//                       _SettingRow(
//                         icon: Icons.help_outline,
//                         title: "Help Center",
//                         trailing: _RowChevron(),
//                       ),
//                       _DividerLine(),
//                       _SettingRow(
//                         icon: Icons.privacy_tip_outlined,
//                         title: "Privacy Policy",
//                         trailing: _RowChevron(),
//                       ),
//                       _DividerLine(),
//                       _SettingRow(
//                         icon: Icons.description_outlined,
//                         title: "Terms & Conditions",
//                         trailing: _RowChevron(),
//                       ),
//                     ],
//                   ),

//                   const SizedBox(height: 16),

//                   _LogoutButton(onTap: () {}),
//                   const SizedBox(height: 14),

//                   const Center(
//                     child: Text(
//                       "Version 1.0.0 · Build (1)",
//                       style: TextStyle(
//                         color: Color(0xFF94A3B8),
//                         fontWeight: FontWeight.w500,
//                       ),
//                     ),
//                   ),

//                   const SizedBox(height: 24),
//                 ],
//               ),
//             ),

//             // ✅ SPACE барои scroll (мисли HomePage)
//             SizedBox(height: h + 410),
//           ],
//         ),
//       ),
//     );
//   }
// }

// /// =======================
// /// HEADER
// /// =======================
// class _ProfileHeader extends StatelessWidget {
//   const _ProfileHeader();

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       height: 420,
//       decoration: const BoxDecoration(
//         gradient: LinearGradient(
//           begin: Alignment.topLeft,
//           end: Alignment.bottomRight,
//           colors: [Color(0xFF00BBA7), Color(0xFF009966)],
//         ),
//         borderRadius: BorderRadius.only(
//           bottomLeft: Radius.circular(26),
//           bottomRight: Radius.circular(26),
//         ),
//       ),
//       child: SafeArea(
//         bottom: false,
//         child: Padding(
//           padding: const EdgeInsets.fromLTRB(16, 14, 16, 0),
//           child: Row(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             children: [
//               Expanded(
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: const [
//                     Text(
//                       "Profile",
//                       style: TextStyle(
//                         color: Colors.white,
//                         fontSize: 24,
//                         fontWeight: FontWeight.w600,
//                       ),
//                     ),
//                     SizedBox(height: 4),
//                     Text(
//                       "Manage your account",
//                       style: TextStyle(
//                         color: Colors.white70,
//                         fontSize: 14,
//                         fontWeight: FontWeight.w500,
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//               Container(
//                 width: 44,
//                 height: 44,
//                 decoration: BoxDecoration(
//                   color: Colors.white24,
//                   borderRadius: BorderRadius.circular(16),
//                 ),
//                 child: const Icon(Icons.settings, color: Colors.white),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

// /// =======================
// /// PROFILE CARD
// /// =======================
// class _ProfileInfoCard extends StatelessWidget {
//   final String initials;
//   final String name;
//   final String role;
//   final String badgeText;

//   final String rating;
//   final String orders;
//   final String onTime;
//   final String accept;

//   const _ProfileInfoCard({
//     required this.initials,
//     required this.name,
//     required this.role,
//     required this.badgeText,
//     required this.rating,
//     required this.orders,
//     required this.onTime,
//     required this.accept,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       padding: const EdgeInsets.all(16),
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.circular(22),
//         boxShadow: const [
//           BoxShadow(
//             color: Colors.black12,
//             blurRadius: 14,
//             offset: Offset(0, 8),
//           ),
//         ],
//       ),
//       child: Column(
//         children: [
//           Row(
//             children: [
//               Stack(
//                 clipBehavior: Clip.none,
//                 children: [
//                   Container(
//                     width: 80,
//                     height: 80,
//                     decoration: BoxDecoration(
//                       color: const Color(0xFF00A884),
//                       borderRadius: BorderRadius.circular(16),
//                     ),
//                     child: Center(
//                       child: Text(
//                         initials,
//                         style: const TextStyle(
//                           color: Colors.white,
//                           fontSize: 24,
//                           fontWeight: FontWeight.w600,
//                         ),
//                       ),
//                     ),
//                   ),
//                   Positioned(
//                     right: -6,
//                     bottom: -6,
//                     child: Container(
//                       width: 32,
//                       height: 32,
//                       decoration: BoxDecoration(
//                         color: const Color(0xFF00BBA7),
//                         borderRadius: BorderRadius.circular(99),
//                         border: Border.all(color: Colors.white, width: 2),
//                       ),
//                       child: const Icon(
//                         Icons.photo_camera_outlined,
//                         size: 14,
//                         color: Colors.white,
//                       ),
//                     ),
//                   ),
//                 ],
//               ),
//               const SizedBox(width: 12),
//               Expanded(
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Text(
//                       name,
//                       style: const TextStyle(
//                         fontSize: 20,
//                         fontWeight: FontWeight.w600,
//                       ),
//                     ),
//                     const SizedBox(height: 4),
//                     Text(
//                       role,
//                       style: const TextStyle(
//                         fontSize: 16,
//                         color: Color(0xFF64748B),
//                         fontWeight: FontWeight.w500,
//                       ),
//                     ),
//                     const SizedBox(height: 8),
//                     Container(
//                       padding: const EdgeInsets.symmetric(
//                         horizontal: 10,
//                         vertical: 6,
//                       ),
//                       decoration: BoxDecoration(
//                         color: const Color(0xFFDFFAF3),
//                         borderRadius: BorderRadius.circular(999),
//                       ),
//                       child: Row(
//                         mainAxisSize: MainAxisSize.min,
//                         children: [
//                           const Icon(
//                             Icons.verified,
//                             size: 14,
//                             color: Color(0xFF00A884),
//                           ),
//                           const SizedBox(width: 6),
//                           Text(
//                             badgeText,
//                             style: const TextStyle(
//                               color: Color(0xFF00A884),
//                               fontSize: 12,
//                               fontWeight: FontWeight.w500,
//                             ),
//                           ),
//                         ],
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//             ],
//           ),

//           const SizedBox(height: 14),
//           const Divider(height: 1, color: Color(0xFFE6EAF0)),
//           const SizedBox(height: 14),

//           Row(
//             children: [
//               Expanded(
//                 child: _StatMini(
//                   icon: Icons.star,
//                   iconColor: Color(0xFFF59E0B),
//                   value: rating,
//                   label: "Rating",
//                 ),
//               ),
//               Expanded(
//                 child: _StatMini(
//                   icon: Icons.receipt_long,
//                   iconColor: Color(0xFF0EA5E9),
//                   value: orders,
//                   label: "Orders",
//                 ),
//               ),
//               Expanded(
//                 child: _StatMini(
//                   icon: Icons.timer_outlined,
//                   iconColor: Color(0xFF00A884),
//                   value: onTime,
//                   label: "On Time",
//                 ),
//               ),
//               Expanded(
//                 child: _StatMini(
//                   icon: Icons.check_circle_outline,
//                   iconColor: Color(0xFF00A884),
//                   value: accept,
//                   label: "Accept",
//                 ),
//               ),
//             ],
//           ),
//         ],
//       ),
//     );
//   }
// }

// class _StatMini extends StatelessWidget {
//   final IconData icon;
//   final Color iconColor;
//   final String value;
//   final String label;

//   const _StatMini({
//     required this.icon,
//     required this.iconColor,
//     required this.value,
//     required this.label,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Column(
//       children: [
//         Icon(icon, color: iconColor, size: 18),
//         const SizedBox(height: 6),
//         Text(
//           value,
//           style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 18),
//         ),
//         const SizedBox(height: 4),
//         Text(
//           label,
//           style: const TextStyle(
//             color: Color(0xFF64748B),
//             fontWeight: FontWeight.w500,
//             fontSize: 12,
//           ),
//         ),
//       ],
//     );
//   }
// }

// /// =======================
// /// SECTION LABEL
// /// =======================
// class _SectionLabel extends StatelessWidget {
//   final String text;
//   const _SectionLabel(this.text);

//   @override
//   Widget build(BuildContext context) {
//     return const Text("", style: TextStyle()).copyWithText(text);
//   }
// }

// /// helper extension to keep it short without repeating style blocks
// extension on Text {
//   Widget copyWithText(String t) {
//     return Text(
//       t,
//       style: const TextStyle(
//         color: Color(0xFF94A3B8),
//         fontWeight: FontWeight.w500,
//         fontSize: 14,
//       ),
//     );
//   }
// }

// /// =======================
// /// GROUP CARD + ROWS
// /// =======================
// class _GroupCard extends StatelessWidget {
//   final List<Widget> children;
//   const _GroupCard({required this.children});

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.circular(22),
//         boxShadow: const [
//           BoxShadow(
//             color: Colors.black12,
//             blurRadius: 12,
//             offset: Offset(0, 6),
//           ),
//         ],
//       ),
//       child: Column(children: children),
//     );
//   }
// }
// class _SettingRow extends StatelessWidget {
//   final IconData icon;
//   final String title;
//   final String? subtitle;

//   /// trailing widget (switch / arrow / icon / etc.)
//   final Widget trailing;

//   /// Row tap (whole tile)
//   final VoidCallback? onTap;

//   /// Trailing tap (only trailing area), e.g. arrow / logout icon
//   final VoidCallback? onTrailingTap;

//   /// If you want row tap to toggle a switch
//   final bool isSwitchRow;

//   const _SettingRow({
//     required this.icon,
//     required this.title,
//     this.subtitle,
//     required this.trailing,
//     this.onTap,
//     this.onTrailingTap,
//     this.isSwitchRow = false,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return InkWell(
//       onTap: onTap,
//       borderRadius: BorderRadius.circular(16),
//       child: Padding(
//         padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
//         child: Row(
//           children: [
//             Container(
//               width: 42,
//               height: 42,
//               decoration: BoxDecoration(
//                 color: const Color(0xFFDFFAF3),
//                 borderRadius: BorderRadius.circular(16),
//               ),
//               child: Icon(icon, color: const Color(0xFF00A884), size: 20),
//             ),
//             const SizedBox(width: 12),

//             Expanded(
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Text(
//                     title,
//                     style: const TextStyle(
//                       fontWeight: FontWeight.w600,
//                       fontSize: 16,
//                     ),
//                   ),
//                   if (subtitle != null && subtitle!.isNotEmpty) ...[
//                     const SizedBox(height: 4),
//                     Text(
//                       subtitle!,
//                       style: const TextStyle(
//                         color: Color(0xFF64748B),
//                         fontWeight: FontWeight.w500,
//                       ),
//                     ),
//                   ],
//                 ],
//               ),
//             ),

//             // ✅ Trailing tap zone
//             InkWell(
//               onTap: onTrailingTap,
//               borderRadius: BorderRadius.circular(12),
//               child: Padding(

//                 padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
//                 child: IgnorePointer(

//                 ignoring: false,
//                   child: trailing,
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// // class _SettingRow extends StatelessWidget {
// //   final IconData icon;
// //   final String title;
// //   final String? subtitle;
// //   final Widget trailing;

// //   const _SettingRow({
// //     required this.icon,
// //     required this.title,
// //     this.subtitle,
// //     required this.trailing,
// //   });

// //   @override
// //   Widget build(BuildContext context) {
// //     return InkWell(
// //       onTap: trailing is Switch ? null : () {},
// //       child: Padding(
// //         padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
// //         child: Row(
// //           children: [
// //             Container(
// //               width: 42,
// //               height: 42,
// //               decoration: BoxDecoration(
// //                 color: const Color(0xFFDFFAF3),
// //                 borderRadius: BorderRadius.circular(16),
// //               ),
// //               child: Icon(icon, color: const Color(0xFF00A884), size: 20),
// //             ),
// //             const SizedBox(width: 12),
// //             Expanded(
// //               child: Column(
// //                 crossAxisAlignment: CrossAxisAlignment.start,
// //                 children: [
// //                   Text(
// //                     title,
// //                     style: const TextStyle(
// //                       fontWeight: FontWeight.w600,
// //                       fontSize: 16,
// //                     ),
// //                   ),
// //                   if (subtitle != null && subtitle!.isNotEmpty) ...[
// //                     const SizedBox(height: 4),
// //                     Text(
// //                       subtitle!,
// //                       style: const TextStyle(
// //                         color: Color(0xFF64748B),
// //                         fontWeight: FontWeight.w500,
// //                       ),
// //                     ),
// //                   ],
// //                 ],
// //               ),
// //             ),
// //             trailing,
// //           ],
// //         ),
// //       ),
// //     );
// //   }
// // }

// class _DividerLine extends StatelessWidget {
//   const _DividerLine();

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       height: 1,
//       margin: const EdgeInsets.only(left: 68),
//       color: const Color(0xFFE6EAF0),
//     );
//   }
// }

// class _RowChevron extends StatelessWidget {
//   const _RowChevron();

//   @override
//   Widget build(BuildContext context) {
//     return const Icon(Icons.chevron_right, color: Color(0xFF94A3B8));
//   }
// }

// // class _RightBadge extends StatelessWidget {
// //   final String text;
// //   const _RightBadge({required this.text});

// //   @override
// //   Widget build(BuildContext context) {
// //     return Container(
// //       padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
// //       decoration: BoxDecoration(
// //         color: const Color(0xFFDFFAF3),
// //         borderRadius: BorderRadius.circular(999),
// //       ),
// //       child: Text(
// //         text,
// //         style: const TextStyle(
// //           color: Color(0xFF00A884),
// //           fontWeight: FontWeight.w500,
// //           fontSize: 12,
// //         ),
// //       ),
// //     );
// //   }
// // }

// /// =======================
// /// LOGOUT
// /// =======================
// class _LogoutButton extends StatelessWidget {
//   final VoidCallback onTap;
//   const _LogoutButton({required this.onTap});

//   @override
//   Widget build(BuildContext context) {
//     return InkWell(
//       onTap: onTap,
//       borderRadius: BorderRadius.circular(18),
//       child: Container(
//         height: 64,
//         decoration: BoxDecoration(
//           color: Colors.white,
//           borderRadius: BorderRadius.circular(18),
//           boxShadow: const [
//             BoxShadow(
//               color: Colors.black12,
//               blurRadius: 12,
//               offset: Offset(0, 6),
//             ),
//           ],
//         ),
//         child: Row(
//           mainAxisAlignment: MainAxisAlignment.center,

//           children: [
//             Icon(Icons.logout, color: Color(0xFFE7000B), size: 20),
//             SizedBox(width: 8),
//             Text(
//               "Logout",
//               style: TextStyle(
//                 color: Color(0xFFE7000B),
//                 fontWeight: FontWeight.w600,
//                 fontSize: 16,
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:zaza_driver_app/Profile/services/profile_api_service.dart';
import 'package:zaza_driver_app/Profile/viewmodels/help_center_page.dart';
import 'package:zaza_driver_app/Profile/viewmodels/personal_info_page.dart';
import 'package:zaza_driver_app/Profile/viewmodels/settings_page.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  bool notificationsOn = true;
  DriverProfile? _profile;
  bool _loadingProfile = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    setState(() => _loadingProfile = true);
    try {
      final p = await ProfileApiService.fetchProfile();
      if (mounted) setState(() => _profile = p);
    } catch (_) {
      // keep defaults if network unavailable
    } finally {
      if (mounted) setState(() => _loadingProfile = false);
    }
  }

  void _toggleNotifications() {
    setState(() => notificationsOn = !notificationsOn);
  }

  //   Future<void> launchPhone(String phone) async {
  //   final uri = Uri(scheme: 'tel', path: phone);
  //   if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
  //     throw 'Could not launch phone';
  //   }
  // }

  // Future<void> launchEmail({
  //   required String email,
  //   String subject = '',
  //   String body = '',
  // }) async {
  //   final uri = Uri(
  //     scheme: 'mailto',
  //     path: email,
  //     queryParameters: {
  //       if (subject.isNotEmpty) 'subject': subject,
  //       if (body.isNotEmpty) 'body': body,
  //     },
  //   );

  //   if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
  //     throw 'Could not launch email';
  //   }
  // }

  @override
  Widget build(BuildContext context) {
    final h = MediaQuery.of(context).size.height;

    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      body: SingleChildScrollView(
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            _ProfileHeader(
              onSettingsTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => DriverSettingsPage()),
                );
              },
            ),

            Positioned(
              left: 16,
              right: 16,
              top: 160,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _ProfileInfoCard(
                    initials: _profile != null
                        ? ((_profile!.firstName.isNotEmpty ? _profile!.firstName[0] : '') +
                           (_profile!.lastName.isNotEmpty  ? _profile!.lastName[0]  : '')).toUpperCase()
                        : (_loadingProfile ? '...' : 'DM'),
                    name:      _profile?.fullName ?? (_loadingProfile ? 'Loading...' : 'Driver'),
                    role:      'Courier',
                    badgeText: _profile?.isActive == true ? 'Online' : 'Offline',
                    rating:    _profile != null ? _profile!.avgRating.toStringAsFixed(1) : '—',
                    orders:    _profile != null ? _profile!.orderCount.toString()         : '—',
                    onTime:    '—%',
                    accept:    '—%',
                    onAvatarTap: () {
                      // open personal info
                    },
                  ),
                  const SizedBox(height: 40),

                  const _SectionLabel("Account"),
                  const SizedBox(height: 10),
                  _GroupCard(
                    children: [
                      _SettingRow(
                        icon: Icons.person_outline,
                        title: "Personal Information",
                        trailing: const _RowChevron(),

                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => PersonalInformationPage(
                                initialName:      _profile?.fullName     ?? '',
                                initialPhone:     _profile?.phone        ?? '',
                                initialGender:    'male',
                                initialDob:       DateTime(2000, 1, 15),
                                initialAvatarUrl: _profile?.image        ?? '',
                                onSave: ({required name, required phone, required gender, required dob, required pickedAvatar}) async {
                                  // TODO: multipart upload via ProfileApiService.updateProfile()
                                },
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  const _SectionLabel("Preferences"),
                  const SizedBox(height: 10),
                  _GroupCard(
                    children: [
                      _SettingRow(
                        icon: Icons.notifications_none,
                        title: "Notifications",
                        trailing: Switch(
                          value: notificationsOn,
                          onChanged: (v) => setState(() => notificationsOn = v),
                          activeColor: const Color(0xFF00A884),
                        ),
                        // ✅ row tap ҳам toggle мекунад (UX хуб)
                        onTap: _toggleNotifications,
                        // trailing tap барои switch лозим нест
                      ),
                      const _DividerLine(),
                      _SettingRow(
                        icon: Icons.settings_outlined,
                        title: "App Settings",

                        trailing: const _RowChevron(),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => DriverSettingsPage(),
                            ),
                          );
                        },
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  const _SectionLabel("Support"),
                  const SizedBox(height: 10),
                  _GroupCard(
                    children: [
                      _SettingRow(
                        icon: Icons.help_outline,
                        title: "Help Center",
                        trailing: const _RowChevron(),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => HelpCenterPage()),
                          );
                        },
                      ),
                      const _DividerLine(),
                      _SettingRow(
                        icon: Icons.privacy_tip_outlined,
                        title: "Privacy Policy",
                        trailing: const _RowChevron(),
                        onTap: () {},
                      ),
                      // const _DividerLine(),
                      // _SettingRow(
                      //   icon: Icons.description_outlined,
                      //   title: "Terms & Conditions",
                      //   trailing: const _RowChevron(),
                      //   onTap: () {},
                      // ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  _LogoutButton(
                    onTap: () {
                      // TODO: logout
                    },
                  ),
                  const SizedBox(height: 14),

                  const Center(
                    child: Text(
                      "Version 1.0.0 · Build (1)",
                      style: TextStyle(
                        color: Color(0xFF94A3B8),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),
                ],
              ),
            ),

            // ✅ extra space for scroll
            SizedBox(height: h + 410),
          ],
        ),
      ),
    );
  }
}

/// =======================
/// HEADER
/// =======================
class _ProfileHeader extends StatelessWidget {
  final VoidCallback? onSettingsTap;
  const _ProfileHeader({this.onSettingsTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 420,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF00BBA7), Color(0xFF009966)],
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(26),
          bottomRight: Radius.circular(26),
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Profile",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      "Manage your account",
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              InkWell(
                onTap: onSettingsTap,
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(Icons.settings, color: Colors.white),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// =======================
/// PROFILE CARD
/// =======================
class _ProfileInfoCard extends StatelessWidget {
  final String initials;
  final String name;
  final String role;
  final String badgeText;

  final String rating;
  final String orders;
  final String onTime;
  final String accept;

  final VoidCallback? onAvatarTap;

  const _ProfileInfoCard({
    required this.initials,
    required this.name,
    required this.role,
    required this.badgeText,
    required this.rating,
    required this.orders,
    required this.onTime,
    required this.accept,
    this.onAvatarTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 14,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              InkWell(
                onTap: onAvatarTap,
                borderRadius: BorderRadius.circular(16),
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: const Color(0xFF00A884),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Center(
                        child: Text(
                          initials,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      right: -6,
                      bottom: -6,
                      child: Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: const Color(0xFF00BBA7),
                          borderRadius: BorderRadius.circular(99),
                          border: Border.all(color: Colors.white, width: 2),
                        ),
                        child: const Icon(
                          Icons.photo_camera_outlined,
                          size: 14,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      role,
                      style: const TextStyle(
                        fontSize: 16,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFFDFFAF3),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.verified,
                            size: 14,
                            color: Color(0xFF00A884),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            badgeText,
                            style: const TextStyle(
                              color: Color(0xFF00A884),
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
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

          const SizedBox(height: 14),
          const Divider(height: 1, color: Color(0xFFE6EAF0)),
          const SizedBox(height: 14),

          Row(
            children: [
              Expanded(
                child: _StatMini(
                  icon: Icons.star,
                  iconColor: Color(0xFFF59E0B),
                  value: rating,
                  label: "Rating",
                ),
              ),
              Expanded(
                child: _StatMini(
                  icon: Icons.receipt_long,
                  iconColor: Color(0xFF0EA5E9),
                  value: orders,
                  label: "Orders",
                ),
              ),
              Expanded(
                child: _StatMini(
                  icon: Icons.timer_outlined,
                  iconColor: Color(0xFF00A884),
                  value: onTime,
                  label: "On Time",
                ),
              ),
              Expanded(
                child: _StatMini(
                  icon: Icons.check_circle_outline,
                  iconColor: Color(0xFF00A884),
                  value: accept,
                  label: "Accept",
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatMini extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String value;
  final String label;

  const _StatMini({
    required this.icon,
    required this.iconColor,
    required this.value,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: iconColor, size: 18),
        const SizedBox(height: 6),
        Text(
          value,
          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 18),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Color(0xFF64748B),
            fontWeight: FontWeight.w500,
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}

/// =======================
/// SECTION LABEL
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

/// =======================
/// GROUP CARD + ROWS
/// =======================
class _PressableCard extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry padding;
  final BorderRadius borderRadius;

  const _PressableCard({
    required this.child,
    this.onTap,
    this.padding = EdgeInsets.zero,
    this.borderRadius = const BorderRadius.all(Radius.circular(16)),
  });

  @override
  State<_PressableCard> createState() => _PressableCardState();
}

class _PressableCardState extends State<_PressableCard> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final br = widget.borderRadius;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 120),
      curve: Curves.easeOut,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: br,
        boxShadow: _pressed
            ? const [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 6,
                  offset: Offset(0, 3),
                ),
              ]
            : const [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 12,
                  offset: Offset(0, 6),
                ),
              ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: br,
        child: InkWell(
          borderRadius: br,
          onTap: widget.onTap,
          onHighlightChanged: (v) => setState(() => _pressed = v),
          child: Padding(padding: widget.padding, child: widget.child),
        ),
      ),
    );
  }
}

class _GroupCard extends StatelessWidget {
  final List<Widget> children;
  final VoidCallback? onTap; // optional (агар хоҳӣ whole card tap шавад)

  const _GroupCard({required this.children, this.onTap});

  @override
  Widget build(BuildContext context) {
    return _PressableCard(
      onTap: onTap,
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

  /// ✅ агар row tap бояд switch-ро toggle кунад
  final bool toggleSwitchOnRowTap;

  /// ✅ барои toggle аз берун (ҳолате ки switch аст)
  final VoidCallback? onToggleRequested;

  const _SettingRow({
    required this.icon,
    required this.title,
    this.subtitle,
    required this.trailing,
    this.onTap,

    this.toggleSwitchOnRowTap = false,
    this.onToggleRequested,
  });

  bool _looksLikeSwitch() => trailing is Switch;

  @override
  Widget build(BuildContext context) {
    final isSwitch = _looksLikeSwitch();

    return InkWell(
      onTap: () {
        // Агар row tap дода шуда бошад, ҳамон иҷро шавад
        if (onTap != null) {
          onTap!();
          return;
        }
        // Агар switch бошад ва хоҳем row tap toggle кунад
        if (isSwitch && toggleSwitchOnRowTap && onToggleRequested != null) {
          onToggleRequested!();
        }
      },
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

            // ✅ trailing tap (барои chevron, badge, etc.)
            if (!isSwitch)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
                child: trailing,
              )
            else
              // ✅ Switch бояд мустақил кор кунад (onChanged дар худи Switch аст)
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

class _RowChevron extends StatelessWidget {
  const _RowChevron();

  @override
  Widget build(BuildContext context) {
    return const Icon(Icons.chevron_right, color: Color(0xFF94A3B8));
  }
}

/// =======================
/// LOGOUT
/// =======================
class _LogoutButton extends StatelessWidget {
  final VoidCallback onTap;
  const _LogoutButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        height: 64,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: const [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 12,
              offset: Offset(0, 6),
            ),
          ],
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.logout, color: Color(0xFFE7000B), size: 20),
            SizedBox(width: 8),
            Text(
              "Logout",
              style: TextStyle(
                color: Color(0xFFE7000B),
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
