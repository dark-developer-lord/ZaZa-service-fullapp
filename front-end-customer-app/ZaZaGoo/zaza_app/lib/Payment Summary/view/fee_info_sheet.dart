import 'package:flutter/material.dart';

const _green = Color(0xFF0C6B52);
const _bgGrey = Color(0xFFF3F4F6);

Future<void> showServiceFeeInfoSheet(BuildContext context) {
  return _showInfoSheet(
    context,
    title: "Service fee",
    body:
        "5% fee on your pre-discounted basket value to help us improve our services for you and our captains.\n\n"
        "A minimum of 2.00 c, capped at 10.00. c",
  );
}

Future<void> showSmallOrderFeeInfoSheet(BuildContext context) {
  return _showInfoSheet(
    context,
    title: "Small order fee",
    body:
        "Small order fee is applied when discounted basket amount is lower than 50.00. c\n\n"
        "It fills the difference up to 50.00. c",
  );
}

Future<void> showDeliveryFeeInfoSheet(BuildContext context) {
  return _showInfoSheet(
    context,
    title: "Delivery fee",
    body:
        "We charge a small delivery fee to get your order to you quickly and reliably.",
  );
}

Future<void> _showInfoSheet(
  BuildContext context, {
  required String title,
  required String body,
}) async {
  await showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    barrierColor: Colors.black.withOpacity(0.25),
    builder: (_) => _InfoSheet(title: title, body: body),
  );
}

class _InfoSheet extends StatelessWidget {
  final String title;
  final String body;

  const _InfoSheet({required this.title, required this.body});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      bottom: false,
      child: Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
        ),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 30),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // handle
              Container(
                width: 44,
                height: 5,
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.14),
                  borderRadius: BorderRadius.circular(99),
                ),
              ),
              const SizedBox(height: 14),

              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(height: 10),

              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  body,
                  style: TextStyle(
                    fontSize: 16,
                    height: 1.35,
                    fontWeight: FontWeight.w600,
                    color: Colors.black.withOpacity(0.60),
                  ),
                ),
              ),
              const SizedBox(height: 18),

              SizedBox(
                width: double.infinity,
                height: 56,
                child: Material(
                  color: _green,
                  borderRadius: BorderRadius.circular(16),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: () => Navigator.pop(context),
                    child: const Center(
                      child: Text(
                        "Got it",
                        style: TextStyle(
                          color: Color(0xFF19E38A),
                          fontWeight: FontWeight.w900,
                          fontSize: 18,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
