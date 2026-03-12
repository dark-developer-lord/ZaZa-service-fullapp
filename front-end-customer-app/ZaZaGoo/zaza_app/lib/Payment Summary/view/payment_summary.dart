// payment_summary.dart
import 'package:flutter/material.dart';
import 'package:zaza_app/Basket/view/basket_controller.dart';
import 'package:zaza_app/Payment%20Summary/model/basketfees_model.dart';
import 'package:zaza_app/Payment%20Summary/view/fee_info_sheet.dart';

class PaymentSummary extends StatelessWidget {
  final BasketController basket;

  const PaymentSummary({super.key, required this.basket});

  @override
  Widget build(BuildContext context) {
    final items = basket.items;

    // ✅ Subtotal (products only)
    final subtotal = items.fold<double>(
      0.0,
      (sum, it) => sum + (it.price * it.qty),
    );

    // ✅ Fees from model (NO UI logic)
    final fees = calcFees(
      subtotal: subtotal,
      deliveryFee: 10.0, // demo for now
    );

    final total = subtotal + fees.totalExtras;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Payment Summary",
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 18),

        _Row(label: "Basket total", value: subtotal),

        const SizedBox(height: 14),

        _Row(
          label: "Service fee",
          value: fees.serviceFee,
          withInfo: true,
          onInfoTap: () => showServiceFeeInfoSheet(context),
        ),

        if (fees.smallOrderFee > 0) ...[
          const SizedBox(height: 14),
          _Row(
            label: "Small order fee",
            value: fees.smallOrderFee,
            withInfo: true,
            onInfoTap: () => showSmallOrderFeeInfoSheet(context),
          ),
        ],

        const SizedBox(height: 14),

        _Row(
          label: "Delivery fee",
          value: fees.deliveryFee,
          withInfo: true,
          onInfoTap: () => showDeliveryFeeInfoSheet(context),
        ),

        const SizedBox(height: 18),
        Divider(height: 1, thickness: 1, color: Colors.black.withOpacity(0.10)),
        const SizedBox(height: 16),

        Row(
          children: [
            const Text(
              "Order Total",
              style: TextStyle(fontWeight: FontWeight.w600, fontSize: 20),
            ),
            const Spacer(),
            Text(
              "${total.toStringAsFixed(2)} c",
              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 18),
            ),
          ],
        ),
      ],
    );
  }
}

class _Row extends StatelessWidget {
  final String label;
  final double value;
  final bool withInfo;
  final VoidCallback? onInfoTap;

  const _Row({
    required this.label,
    required this.value,
    this.withInfo = false,
    this.onInfoTap,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(
          label,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 16,
            color: Colors.black.withOpacity(0.70),
          ),
        ),
        if (withInfo) ...[
          const SizedBox(width: 8),
          InkWell(
            onTap: onInfoTap,
            borderRadius: BorderRadius.circular(99),
            child: Padding(
              padding: const EdgeInsets.all(4),
              child: Icon(
                Icons.info_outline,
                size: 18,
                color: Colors.black.withOpacity(0.45),
              ),
            ),
          ),
        ],
        const Spacer(),
        Text(
          "${value.toStringAsFixed(2)} c",
          style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 15),
        ),
      ],
    );
  }
}
