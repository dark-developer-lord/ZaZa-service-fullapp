// import 'package:flutter/material.dart';

// import 'package:zaza_driver_app/Home/view/home_page.dart';
import 'package:zaza_driver_app/Order/view/orders_page.dart';
import 'package:zaza_driver_app/Profile/view/profile_page.dart';
import 'package:zaza_driver_app/Wallet/view/wallet_page.dart';

// class MainNavigationPage extends StatefulWidget {
//   const MainNavigationPage({super.key});

//   @override
//   State<MainNavigationPage> createState() => _MainNavigationPageState();
// }

// class _MainNavigationPageState extends State<MainNavigationPage> {
//   int _currentIndex = 0;

//   final List<Widget> _pages = [
//     HomePage(),
//     OrdersPage(),
//     WalletPage(),
//     ProfilePage(),
//   ];

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: IndexedStack(index: _currentIndex, children: _pages),

//       bottomNavigationBar: _buildBottomBar(),
//     );
//   }

//   Widget _buildBottomBar() {
//     return Container(
//       height: 80,

//       padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
//       decoration: const BoxDecoration(
//         color: Colors.white,
//         boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8)],
//       ),
//       child: Row(
//         mainAxisAlignment: MainAxisAlignment.spaceBetween,
//         children: List.generate(4, (index) {
//           final isSelected = _currentIndex == index;

//           final icons = [
//             Icons.home,
//             Icons.receipt_long,
//             Icons.account_balance_wallet,
//             Icons.person,
//           ];

//           final labels = ['Home', 'Orders', 'Wallet', 'Profile'];

//           return Expanded(
//             child: GestureDetector(
//               onTap: () {
//                 setState(() {
//                   _currentIndex = index;
//                 });
//               },

//               child: AnimatedContainer(
//                 duration: const Duration(milliseconds: 250),

//                 padding: const EdgeInsets.symmetric(
//                   vertical: 8,
//                   horizontal: 12,
//                 ),

//                 decoration: BoxDecoration(
//                   color: isSelected
//                       ? const Color(0xFFE8FAF6) // сабзи равшан
//                       : Colors.transparent,

//                   borderRadius: BorderRadius.circular(16),
//                 ),

//                 child: Column(
//                   mainAxisAlignment: MainAxisAlignment.center,
//                   children: [
//                     Icon(
//                       icons[index],
//                       color: isSelected ? const Color(0xFF00A884) : Colors.grey,
//                     ),

//                     const SizedBox(height: 4),

//                     Text(
//                       labels[index],
//                       style: TextStyle(
//                         fontSize: 12,
//                         fontWeight: FontWeight.w500,

//                         color: isSelected
//                             ? const Color(0xFF00A884)
//                             : Colors.grey,
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//             ),
//           );
//         }),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:zaza_driver_app/Home/view/home_page.dart';
import 'package:zaza_driver_app/Order/store/orders_store.dart';

class MainNavigationPage extends StatefulWidget {
  const MainNavigationPage({super.key});

  @override
  State<MainNavigationPage> createState() => _MainNavigationPageState();
}

class _MainNavigationPageState extends State<MainNavigationPage> {
  int _index = 0;

  final OrdersStore store = OrdersStore();

  @override
  void initState() {
    super.initState();
    store.refreshFromServer();
  }

  void goHome() => setState(() => _index = 0);
  void goOrders() => setState(() => _index = 1);

  late final _pages = [
    HomePage(
      store: store,
      onViewAllOrders: goOrders, // ✅ барои View All дар Home
    ),
    // YandexTestMapPage(),
    OrdersPage(
      store: store,
      goHome: goHome, // ✅ муҳим!
    ),
    WalletPage(),
    ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _index, children: _pages),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _index,
        onTap: (i) => setState(() => _index = i),
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long_outlined),
            label: 'Orders',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_balance_wallet_outlined),
            label: 'Wallet',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
