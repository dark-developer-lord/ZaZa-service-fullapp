// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';
// import 'package:zaza_app/Address/models/save_address.dart';
// import 'package:zaza_app/Address/storage/adress_store.dart';
// import 'package:zaza_app/Address/view/add_edit_page.dart';
// import 'package:zaza_app/Address/view/save_addres_page.dart';

// class ZazaSearchPage extends StatefulWidget {
//   const ZazaSearchPage({super.key});

//   @override
//   State<ZazaSearchPage> createState() => _ZazaSearchPageState();
// }

// class _ZazaSearchPageState extends State<ZazaSearchPage> {
//   final TextEditingController _searchC = TextEditingController();

//   List<SavedAddressItem> _savedAddresses = [];

//   List<RecentSearchItem> _recentSearches = [
//     const RecentSearchItem(
//       title: "Cinnabon",
//       subtitle: "in Food",
//       icon: Icons.restaurant_outlined,
//     ),
//     const RecentSearchItem(
//       title: "Batch Cookies",
//       subtitle: "in Food",
//       icon: Icons.restaurant_outlined,
//     ),
//     const RecentSearchItem(
//       title: "Koussa Blaban",
//       subtitle: "in Food",
//       icon: Icons.restaurant_outlined,
//     ),
//   ];

//   @override
//   void initState() {
//     super.initState();
//     _initAddresses();
//   }

//   Future<void> _initAddresses() async {
//     await AddressStore.I.loadFromPrefs();
//     if (!mounted) return;
//     _syncAddressesFromStore();
//   }

//   void _syncAddressesFromStore() {
//     final items = AddressStore.I.items;

//     setState(() {
//       _savedAddresses = items.map((e) {
//         IconData icon;

//         switch (e.tag) {
//           case AddressTag.home:
//             icon = Icons.home_rounded;
//             break;
//           case AddressTag.work:
//             icon = Icons.work_rounded;
//             break;
//           case AddressTag.other:
//             icon = Icons.location_on_outlined;
//             break;
//         }

//         return SavedAddressItem(title: e.label, icon: icon);
//       }).toList();
//     });
//   }

//   @override
//   void dispose() {
//     _searchC.dispose();
//     super.dispose();
//   }

//   Future<void> _openSavedAddressesPage() async {
//     await Navigator.push(
//       context,
//       MaterialPageRoute(builder: (_) => const SavedAddressesPage()),
//     );

//     await AddressStore.I.loadFromPrefs();
//     if (!mounted) return;
//     _syncAddressesFromStore();
//   }

//   Future<void> _openAddAddressPage() async {
//     final result = await Navigator.push<SavedAddress>(
//       context,
//       MaterialPageRoute(builder: (_) => const AddEditAddressPage()),
//     );

//     if (result == null) return;

//     await AddressStore.I.add(result);
//     if (!mounted) return;
//     _syncAddressesFromStore();
//   }

//   @override
//   Widget build(BuildContext context) {
//     final query = _searchC.text.trim().toLowerCase();

//     final filteredRecent = query.isEmpty
//         ? _recentSearches
//         : _recentSearches
//               .where(
//                 (e) =>
//                     e.title.toLowerCase().contains(query) ||
//                     e.subtitle.toLowerCase().contains(query),
//               )
//               .toList();

//     return Scaffold(
//       backgroundColor: const Color(0xFFF6F6F6),
//       body: SafeArea(
//         child: ListView(
//           padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
//           children: [
//             Row(
//               children: [
//                 _SquareButton(
//                   icon: Icons.close_rounded,
//                   onTap: () => Navigator.pop(context),
//                 ),
//                 const SizedBox(width: 12),
//                 Expanded(
//                   child: _SearchField(
//                     controller: _searchC,
//                     onChanged: (_) => setState(() {}),
//                     onClear: () {
//                       _searchC.clear();
//                       setState(() {});
//                     },
//                   ),
//                 ),
//               ],
//             ),
//             const SizedBox(height: 28),

//             const Text(
//               "Search for",
//               style: TextStyle(
//                 fontSize: 18,
//                 fontWeight: FontWeight.w500,
//                 color: Color(0xFF1B1B1B),
//               ),
//             ),
//             const SizedBox(height: 16),

//             Wrap(
//               spacing: 10,
//               runSpacing: 10,
//               children: const [
//                 _CategoryChip(title: "Eat", icon: Icons.fastfood_rounded),
//               ],
//             ),

//             const SizedBox(height: 34),

//             Row(
//               children: [
//                 const Expanded(
//                   child: Text(
//                     "Deliver to",
//                     style: TextStyle(
//                       fontSize: 18,
//                       fontWeight: FontWeight.w500,
//                       color: Color(0xFF1B1B1B),
//                     ),
//                   ),
//                 ),
//                 if (_savedAddresses.isNotEmpty)
//                   InkWell(
//                     borderRadius: BorderRadius.circular(10),
//                     onTap: _openSavedAddressesPage,
//                     child: const Padding(
//                       padding: EdgeInsets.all(4),
//                       child: Icon(
//                         Icons.arrow_forward_rounded,
//                         size: 28,
//                         color: Color(0xFF0B4E3F),
//                       ),
//                     ),
//                   ),
//               ],
//             ),
//             const SizedBox(height: 18),

//             if (_savedAddresses.isEmpty)
//               SizedBox(
//                 height: 108,
//                 child: Row(
//                   children: [
//                     _SavedAddressCard(
//                       item: const SavedAddressItem(
//                         title: "Add",
//                         icon: Icons.add_rounded,
//                         isAdd: true,
//                       ),
//                       onTap: () async {
//                         HapticFeedback.selectionClick();
//                         await _openAddAddressPage();
//                       },
//                     ),
//                   ],
//                 ),
//               )
//             else
//               SizedBox(
//                 height: 108,
//                 child: ListView.separated(
//                   scrollDirection: Axis.horizontal,
//                   itemCount: _savedAddresses.length + 1,
//                   separatorBuilder: (_, __) => const SizedBox(width: 12),
//                   itemBuilder: (context, index) {
//                     if (index == _savedAddresses.length) {
//                       return _SavedAddressCard(
//                         item: const SavedAddressItem(
//                           title: "Add",
//                           icon: Icons.add_rounded,
//                           isAdd: true,
//                         ),
//                         onTap: () async {
//                           HapticFeedback.selectionClick();
//                           await _openAddAddressPage();
//                         },
//                       );
//                     }

//                     final item = _savedAddresses[index];
//                     return _SavedAddressCard(
//                       item: item,
//                       onTap: () {
//                         HapticFeedback.selectionClick();
//                       },
//                     );
//                   },
//                 ),
//               ),

//             const SizedBox(height: 34),

//             Row(
//               children: [
//                 const Expanded(
//                   child: Text(
//                     "Recent searches",
//                     style: TextStyle(
//                       fontSize: 18,
//                       fontWeight: FontWeight.w500,
//                       color: Color(0xFF1B1B1B),
//                     ),
//                   ),
//                 ),
//                 if (_recentSearches.isNotEmpty)
//                   TextButton(
//                     onPressed: () {
//                       setState(() {
//                         _recentSearches = [];
//                       });
//                     },
//                     child: const Text(
//                       "Clear",
//                       style: TextStyle(
//                         fontSize: 16,
//                         fontWeight: FontWeight.w700,
//                         color: Color(0xFF0B4E3F),
//                       ),
//                     ),
//                   ),
//               ],
//             ),
//             const SizedBox(height: 10),

//             if (filteredRecent.isEmpty)
//               const _EmptyRecentView()
//             else
//               Container(
//                 decoration: BoxDecoration(
//                   color: Colors.transparent,
//                   borderRadius: BorderRadius.circular(18),
//                 ),
//                 child: Column(
//                   children: List.generate(filteredRecent.length, (index) {
//                     final item = filteredRecent[index];
//                     final isLast = index == filteredRecent.length - 1;

//                     return Column(
//                       children: [
//                         _RecentSearchTile(
//                           item: item,
//                           onTap: () {
//                             HapticFeedback.selectionClick();
//                           },
//                         ),
//                         if (!isLast)
//                           const Padding(
//                             padding: EdgeInsets.only(left: 88),
//                             child: Divider(
//                               height: 1,
//                               thickness: 1,
//                               color: Color(0xFFE9EAED),
//                             ),
//                           ),
//                       ],
//                     );
//                   }),
//                 ),
//               ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// class SavedAddressItem {
//   final String title;
//   final IconData icon;
//   final bool isAdd;

//   const SavedAddressItem({
//     required this.title,
//     required this.icon,
//     this.isAdd = false,
//   });
// }

// class RecentSearchItem {
//   final String title;
//   final String subtitle;
//   final IconData icon;

//   const RecentSearchItem({
//     required this.title,
//     required this.subtitle,
//     required this.icon,
//   });
// }

// class _SquareButton extends StatelessWidget {
//   const _SquareButton({required this.icon, required this.onTap});

//   final IconData icon;
//   final VoidCallback onTap;

//   @override
//   Widget build(BuildContext context) {
//     return Material(
//       color: Colors.white,
//       borderRadius: BorderRadius.circular(14),
//       child: InkWell(
//         borderRadius: BorderRadius.circular(14),
//         onTap: onTap,
//         child: Ink(
//           width: 52,
//           height: 52,
//           decoration: BoxDecoration(
//             borderRadius: BorderRadius.circular(14),
//             border: Border.all(color: const Color(0xFFD8DADF)),
//           ),
//           child: Icon(icon, size: 25, color: const Color(0xFF2A2A2A)),
//         ),
//       ),
//     );
//   }
// }

// class _SearchField extends StatelessWidget {
//   const _SearchField({
//     required this.controller,
//     required this.onChanged,
//     required this.onClear,
//   });

//   final TextEditingController controller;
//   final ValueChanged<String> onChanged;
//   final VoidCallback onClear;

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       height: 52,
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.circular(14),
//         border: Border.all(color: const Color(0xFFD8DADF)),
//       ),
//       child: Row(
//         children: [
//           const SizedBox(width: 16),
//           Expanded(
//             child: TextField(
//               controller: controller,
//               onChanged: onChanged,
//               textInputAction: TextInputAction.search,
//               style: const TextStyle(
//                 fontSize: 16,
//                 fontWeight: FontWeight.w500,
//                 color: Color(0xFF1B1B1B),
//               ),
//               decoration: const InputDecoration(
//                 hintText: "Search food or restaurants",
//                 border: InputBorder.none,
//                 isDense: true,
//                 hintStyle: TextStyle(
//                   fontSize: 16,
//                   color: Color(0xFF9A9A9A),
//                   fontWeight: FontWeight.w500,
//                 ),
//               ),
//             ),
//           ),
//           if (controller.text.isNotEmpty)
//             IconButton(
//               onPressed: onClear,
//               icon: const Icon(Icons.cancel_rounded, color: Color(0xFF6D6D6D)),
//             )
//           else
//             const Padding(
//               padding: EdgeInsets.only(right: 14),
//               child: Icon(
//                 Icons.search_rounded,
//                 size: 30,
//                 color: Color(0xFF424242),
//               ),
//             ),
//         ],
//       ),
//     );
//   }
// }

// class _CategoryChip extends StatelessWidget {
//   const _CategoryChip({required this.title, required this.icon});

//   final String title;
//   final IconData icon;

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       height: 48,
//       padding: const EdgeInsets.symmetric(horizontal: 16),
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.circular(14),
//         border: Border.all(color: const Color(0xFFD8DADF)),
//       ),
//       child: Row(
//         mainAxisSize: MainAxisSize.min,
//         children: [
//           Icon(icon, size: 20, color: const Color(0xFF2C2C2C)),
//           const SizedBox(width: 8),
//           Text(
//             title,
//             style: const TextStyle(
//               fontSize: 16,
//               fontWeight: FontWeight.w700,
//               color: Color(0xFF1B1B1B),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

// class _SavedAddressCard extends StatelessWidget {
//   const _SavedAddressCard({required this.item, required this.onTap});

//   final SavedAddressItem item;
//   final VoidCallback onTap;

//   @override
//   Widget build(BuildContext context) {
//     final icon = item.isAdd ? Icons.add_rounded : item.icon;

//     return Material(
//       color: Colors.transparent,
//       child: InkWell(
//         borderRadius: BorderRadius.circular(18),
//         onTap: onTap,
//         child: SizedBox(
//           width: 94,
//           child: Column(
//             children: [
//               Container(
//                 width: 94,
//                 height: 76,
//                 decoration: BoxDecoration(
//                   color: const Color(0xFFEFEFEF),
//                   borderRadius: BorderRadius.circular(16),
//                 ),
//                 child: Icon(icon, size: 31, color: const Color(0xFF2A2A2A)),
//               ),
//               const SizedBox(height: 10),
//               Text(
//                 item.title,
//                 textAlign: TextAlign.center,
//                 maxLines: 2,
//                 overflow: TextOverflow.ellipsis,
//                 style: const TextStyle(
//                   fontSize: 14,
//                   height: 1.25,
//                   fontWeight: FontWeight.w500,
//                   color: Color(0xFF1B1B1B),
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

// class _RecentSearchTile extends StatelessWidget {
//   const _RecentSearchTile({required this.item, required this.onTap});

//   final RecentSearchItem item;
//   final VoidCallback onTap;

//   @override
//   Widget build(BuildContext context) {
//     return Material(
//       color: Colors.transparent,
//       child: InkWell(
//         onTap: onTap,
//         borderRadius: BorderRadius.circular(16),
//         child: Padding(
//           padding: const EdgeInsets.symmetric(vertical: 16),
//           child: Row(
//             children: [
//               Container(
//                 width: 58,
//                 height: 58,
//                 decoration: BoxDecoration(
//                   color: const Color(0xFFEFEFEF),
//                   borderRadius: BorderRadius.circular(14),
//                 ),
//                 child: Icon(
//                   item.icon,
//                   size: 26,
//                   color: const Color(0xFF2A2A2A),
//                 ),
//               ),
//               const SizedBox(width: 16),
//               Expanded(
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Text(
//                       item.title,
//                       style: const TextStyle(
//                         fontSize: 16,
//                         fontWeight: FontWeight.w600,
//                         color: Color(0xFF1B1B1B),
//                       ),
//                     ),
//                     const SizedBox(height: 4),
//                     Text(
//                       item.subtitle,
//                       style: const TextStyle(
//                         fontSize: 14,
//                         fontWeight: FontWeight.w500,
//                         color: Color(0xFF7F7F7F),
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

// class _EmptyRecentView extends StatelessWidget {
//   const _EmptyRecentView();

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 30),
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.circular(18),
//         border: Border.all(color: const Color(0xFFE5E7EB)),
//       ),
//       child: const Column(
//         children: [
//           Icon(Icons.history_rounded, size: 34, color: Color(0xFF9CA3AF)),
//           SizedBox(height: 10),
//           Text(
//             "No recent searches",
//             style: TextStyle(
//               fontSize: 15,
//               fontWeight: FontWeight.w800,
//               color: Color(0xFF111827),
//             ),
//           ),
//           SizedBox(height: 4),
//           Text(
//             "Your recent food searches will appear here.",
//             textAlign: TextAlign.center,
//             style: TextStyle(
//               fontSize: 13,
//               fontWeight: FontWeight.w500,
//               color: Color(0xFF6B7280),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:zaza_app/Address/storage/adress_store.dart';
import 'package:zaza_app/Address/models/save_address.dart';
import 'package:zaza_app/Address/view/add_edit_page.dart';
import 'package:zaza_app/Address/view/save_addres_page.dart';

class ZazaSearchPage extends StatefulWidget {
  const ZazaSearchPage({super.key});

  @override
  State<ZazaSearchPage> createState() => _ZazaSearchPageState();
}

class _ZazaSearchPageState extends State<ZazaSearchPage> {
  final TextEditingController _searchC = TextEditingController();

  List<SavedAddressItem> _savedAddresses = [];

  List<RecentSearchItem> _recentSearches = [
    const RecentSearchItem(
      title: "Cinnabon",
      subtitle: "in Food",
      icon: Icons.restaurant_outlined,
    ),
    const RecentSearchItem(
      title: "Batch Cookies",
      subtitle: "in Food",
      icon: Icons.restaurant_outlined,
    ),
    const RecentSearchItem(
      title: "Koussa Blaban",
      subtitle: "in Food",
      icon: Icons.restaurant_outlined,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _syncAddressesFromStore();
  }

  void _syncAddressesFromStore() {
    final items = AddressStore.I.items;

    setState(() {
      _savedAddresses = items.map((e) {
        return SavedAddressItem(title: e.label, icon: _iconForTag(e.tag));
      }).toList();
    });
  }

  IconData _iconForTag(AddressTag tag) {
    switch (tag) {
      case AddressTag.home:
        return Icons.home_rounded;
      case AddressTag.work:
        return Icons.work_rounded;
      case AddressTag.other:
        return Icons.location_on_outlined;
    }
  }

  @override
  void dispose() {
    _searchC.dispose();
    super.dispose();
  }

  Future<void> _openSavedAddressesPage() async {
    await Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const SavedAddressesPage()),
    );

    await AddressStore.I.loadFromPrefs();
    _syncAddressesFromStore();
  }

  Future<void> _openAddAddressPage() async {
    final result = await Navigator.push<SavedAddress>(
      context,
      MaterialPageRoute(builder: (_) => const AddEditAddressPage()),
    );

    if (result == null) return;

    await AddressStore.I.add(result);
    _syncAddressesFromStore();
  }

  @override
  Widget build(BuildContext context) {
    final query = _searchC.text.trim().toLowerCase();

    final filteredRecent = query.isEmpty
        ? _recentSearches
        : _recentSearches
              .where(
                (e) =>
                    e.title.toLowerCase().contains(query) ||
                    e.subtitle.toLowerCase().contains(query),
              )
              .toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF6F6F6),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
          children: [
            Row(
              children: [
                _SquareButton(
                  icon: Icons.close_rounded,
                  onTap: () => Navigator.pop(context),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _SearchField(
                    controller: _searchC,
                    onChanged: (_) => setState(() {}),
                    onClear: () {
                      _searchC.clear();
                      setState(() {});
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 28),

            const Text(
              "Search for",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
                color: Color(0xFF1B1B1B),
              ),
            ),
            const SizedBox(height: 16),

            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: const [
                _CategoryChip(title: "Eat", icon: Icons.fastfood_rounded),
              ],
            ),

            const SizedBox(height: 34),

            Row(
              children: [
                const Expanded(
                  child: Text(
                    "Deliver to",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF1B1B1B),
                    ),
                  ),
                ),
                if (_savedAddresses.isNotEmpty)
                  InkWell(
                    borderRadius: BorderRadius.circular(10),
                    onTap: _openSavedAddressesPage,
                    child: const Padding(
                      padding: EdgeInsets.all(4),
                      child: Icon(
                        Icons.arrow_forward_rounded,
                        size: 24,
                        color: Color(0xFF0B4E3F),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 18),

            if (_savedAddresses.isEmpty)
              SizedBox(
                height: 108,
                child: Row(
                  children: [
                    _SavedAddressCard(
                      item: const SavedAddressItem(
                        title: "Add",
                        icon: Icons.add_rounded,
                        isAdd: true,
                      ),
                      onTap: () {
                        HapticFeedback.selectionClick();
                        _openAddAddressPage();
                      },
                    ),
                  ],
                ),
              )
            else
              SizedBox(
                height: 108,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: _savedAddresses.length + 1,
                  separatorBuilder: (_, __) => const SizedBox(width: 12),
                  itemBuilder: (context, index) {
                    if (index == _savedAddresses.length) {
                      return _SavedAddressCard(
                        item: const SavedAddressItem(
                          title: "Add",
                          icon: Icons.add_rounded,
                          isAdd: true,
                        ),
                        onTap: () {
                          HapticFeedback.selectionClick();
                          _openAddAddressPage();
                        },
                      );
                    }

                    final item = _savedAddresses[index];
                    return _SavedAddressCard(
                      item: item,
                      onTap: () {
                        HapticFeedback.selectionClick();
                      },
                    );
                  },
                ),
              ),

            const SizedBox(height: 34),

            Row(
              children: [
                const Expanded(
                  child: Text(
                    "Recent searches",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF1B1B1B),
                    ),
                  ),
                ),
                if (_recentSearches.isNotEmpty)
                  TextButton(
                    onPressed: () {
                      setState(() {
                        _recentSearches = [];
                      });
                    },
                    child: const Text(
                      "Clear",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF0B4E3F),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 10),

            if (filteredRecent.isEmpty)
              const _EmptyRecentView()
            else
              Container(
                decoration: BoxDecoration(
                  color: Colors.transparent,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Column(
                  children: List.generate(filteredRecent.length, (index) {
                    final item = filteredRecent[index];
                    final isLast = index == filteredRecent.length - 1;

                    return Column(
                      children: [
                        _RecentSearchTile(
                          item: item,
                          onTap: () {
                            HapticFeedback.selectionClick();
                          },
                        ),
                        if (!isLast)
                          const Padding(
                            padding: EdgeInsets.only(left: 88),
                            child: Divider(
                              height: 1,
                              thickness: 1,
                              color: Color(0xFFE9EAED),
                            ),
                          ),
                      ],
                    );
                  }),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class SavedAddressItem {
  final String title;
  final IconData icon;
  final bool isAdd;

  const SavedAddressItem({
    required this.title,
    required this.icon,
    this.isAdd = false,
  });
}

class RecentSearchItem {
  final String title;
  final String subtitle;
  final IconData icon;

  const RecentSearchItem({
    required this.title,
    required this.subtitle,
    required this.icon,
  });
}

class _SquareButton extends StatelessWidget {
  const _SquareButton({required this.icon, required this.onTap});

  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: Ink(
          width: 52,
          height: 52,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFD8DADF)),
          ),
          child: Icon(icon, size: 25, color: const Color(0xFF2A2A2A)),
        ),
      ),
    );
  }
}

class _SearchField extends StatelessWidget {
  const _SearchField({
    required this.controller,
    required this.onChanged,
    required this.onClear,
  });

  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final VoidCallback onClear;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 52,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFD8DADF)),
      ),
      child: Row(
        children: [
          const SizedBox(width: 16),
          Expanded(
            child: TextField(
              controller: controller,
              onChanged: onChanged,
              textInputAction: TextInputAction.search,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Color(0xFF1B1B1B),
              ),
              decoration: const InputDecoration(
                hintText: "Search food or restaurants",
                border: InputBorder.none,
                isDense: true,
                hintStyle: TextStyle(
                  fontSize: 16,
                  color: Color(0xFF9A9A9A),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
          if (controller.text.isNotEmpty)
            IconButton(
              onPressed: onClear,
              icon: const Icon(Icons.cancel_rounded, color: Color(0xFF6D6D6D)),
            )
          else
            const Padding(
              padding: EdgeInsets.only(right: 14),
              child: Icon(
                Icons.search_rounded,
                size: 30,
                color: Color(0xFF424242),
              ),
            ),
        ],
      ),
    );
  }
}

class _CategoryChip extends StatelessWidget {
  const _CategoryChip({required this.title, required this.icon});

  final String title;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 48,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFD8DADF)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 20, color: const Color(0xFF2C2C2C)),
          const SizedBox(width: 8),
          Text(
            title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: Color(0xFF1B1B1B),
            ),
          ),
        ],
      ),
    );
  }
}

class _SavedAddressCard extends StatelessWidget {
  const _SavedAddressCard({required this.item, required this.onTap});

  final SavedAddressItem item;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final icon = item.isAdd ? Icons.add_rounded : item.icon;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: SizedBox(
          width: 74,
          child: Column(
            children: [
              Container(
                width: 74,
                height: 64,
                decoration: BoxDecoration(
                  color: const Color(0xFFEFEFEF),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(icon, size: 25, color: const Color(0xFF2A2A2A)),
              ),
              const SizedBox(height: 10),
              Text(
                item.title,
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF1B1B1B),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _RecentSearchTile extends StatelessWidget {
  const _RecentSearchTile({required this.item, required this.onTap});

  final RecentSearchItem item;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Row(
            children: [
              Container(
                width: 58,
                height: 58,
                decoration: BoxDecoration(
                  color: const Color(0xFFEFEFEF),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(
                  item.icon,
                  size: 26,
                  color: const Color(0xFF2A2A2A),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF1B1B1B),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      item.subtitle,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF7F7F7F),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _EmptyRecentView extends StatelessWidget {
  const _EmptyRecentView();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 30),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: const Column(
        children: [
          Icon(Icons.history_rounded, size: 34, color: Color(0xFF9CA3AF)),
          SizedBox(height: 10),
          Text(
            "No recent searches",
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: Color(0xFF111827),
            ),
          ),
          SizedBox(height: 4),
          Text(
            "Your recent food searches will appear here.",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: Color(0xFF6B7280),
            ),
          ),
        ],
      ),
    );
  }
}
