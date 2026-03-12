import 'package:flutter/material.dart';
import 'package:zaza_driver_app/AUTH/login/login_page.dart';
import 'package:zaza_driver_app/Order/store/orders_store.dart';

// import 'package:yandex_maps_mapkit_lite/init.dart' as init;

void main() async {
  // WidgetsFlutterBinding.ensureInitialized();

  // await init.initMapkit(
  //   apiKey: 'YOUR_API_KEY'
  // );

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  MyApp({super.key});

  // ✅ store-и глобалӣ барои driver
  final OrdersStore _ordersStore = OrdersStore();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,

      home: DriverLoginPage(
        // store: _ordersStore, // ✅ ИН ҶО
        // onViewAllOrders: () {},
      ),
    );
  }
}
