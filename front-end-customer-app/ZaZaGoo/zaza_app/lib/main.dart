import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:zaza_app/Address/storage/adress_store.dart';
import 'package:zaza_app/Auth/login/view/welcome_page.dart';
import 'package:zaza_app/Auth/services/customer_auth_service.dart';
import 'package:zaza_app/Cart/view/cart_controller.dart';
import 'package:zaza_app/Home/View/home_page.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await AddressStore.I.loadFromPrefs();
  final bool loggedIn = await CustomerAuthService.isLoggedIn();

  runApp(
    MultiProvider(
      providers: [ChangeNotifierProvider(create: (_) => CartController())],
      child: MyApp(loggedIn: loggedIn),
    ),
  );
}

class MyApp extends StatelessWidget {
  final bool loggedIn;
  const MyApp({super.key, required this.loggedIn});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: loggedIn ? HomePage() : ZazaWelcomePage(),
    );
  }
}
