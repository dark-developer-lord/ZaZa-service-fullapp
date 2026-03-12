import 'package:flutter/material.dart';
import 'package:zaza_app/Address/controler/address_warning_controller.dart';

class AddressWarningBanner extends StatelessWidget {
  const AddressWarningBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: AddressWarningController.I,
      builder: (_, __) {
        if (!AddressWarningController.I.visible) {
          return const SizedBox();
        }

        return Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 10),
          child: Material(
            color: const Color(0xFF004D40),
            borderRadius: BorderRadius.circular(18),
            child: Stack(
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 40, 16),
                  child: Text(
                    AddressWarningController.I.message,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                Positioned(
                  right: 6,
                  top: 6,
                  child: IconButton(
                    icon: const Icon(Icons.close, color: Colors.white),
                    onPressed: () {
                      AddressWarningController.I.hide();
                    },
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
