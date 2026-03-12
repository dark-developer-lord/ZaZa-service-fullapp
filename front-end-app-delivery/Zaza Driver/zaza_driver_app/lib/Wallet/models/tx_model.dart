import 'package:flutter/material.dart';

class TxModel {
  final String title;
  final String subtitle1;
  final String subtitle2;
  final String amountText;
  final Color amountColor;
  final IconData icon;
  final Color iconBg;
  final Color iconColor;

  const TxModel({
    required this.title,
    required this.subtitle1,
    required this.subtitle2,
    required this.amountText,
    required this.amountColor,
    required this.icon,
    required this.iconBg,
    required this.iconColor,
  });
}
