import 'package:flutter/material.dart';
import 'package:zaza_driver_app/Wallet/models/tx_model.dart';
import 'package:zaza_driver_app/Wallet/view/transactions_detail_sheet.dart';
import 'package:zaza_driver_app/Wallet/view/wallet_page.dart';

class AllTransactionsPage extends StatelessWidget {
  final List<TxModel> allTx;

  const AllTransactionsPage({super.key, required this.allTx});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          "All Transactions",
          style: TextStyle(
            color: Color(0xFF0F172A),
            fontWeight: FontWeight.w800,
          ),
        ),
        iconTheme: const IconThemeData(color: Color(0xFF0F172A)),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: allTx.length,
        separatorBuilder: (_, __) => const SizedBox(height: 14),
        itemBuilder: (context, i) {
          final t = allTx[i];
          return TransactionCard(
            tx: t,
            onTap: () => TransactionDetailsSheet.show(context, t),
          );
        },
      ),
    );
  }
}
