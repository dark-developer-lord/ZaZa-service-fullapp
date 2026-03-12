import 'package:flutter/material.dart';

class ViewBasketBar extends StatelessWidget {
  final int count;
  final VoidCallback onTap;
  final double bottom;
  final double right;

  const ViewBasketBar({
    super.key,
    required this.count,
    required this.onTap,
    this.bottom = 80,
    this.right = 16,
  });

  @override
  Widget build(BuildContext context) {
    final green = const Color(0xFF0C6B52);
    final neon = const Color(0xFF19E38A);

    return IgnorePointer(
      ignoring: count == 0,
      child: AnimatedSlide(
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeOut,
        offset: count == 0 ? const Offset(0, 1.2) : Offset.zero,
        child: AnimatedOpacity(
          duration: const Duration(milliseconds: 180),
          opacity: count == 0 ? 0 : 1,
          child: Align(
            alignment: Alignment.bottomRight,
            child: Padding(
              padding: EdgeInsets.only(right: right, bottom: bottom),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 260),
                child: Material(
                  color: green,
                  borderRadius: BorderRadius.circular(16),
                  elevation: 10,
                  shadowColor: Colors.black.withOpacity(0.18),
                  child: InkWell(
                    onTap: onTap,
                    borderRadius: BorderRadius.circular(16),
                    child: SizedBox(
                      height: 56,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const SizedBox(width: 10),
                          Container(
                            width: 40,
                            height: 40,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: neon,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              "$count",
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                                fontSize: 18,
                                color: Colors.black,
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Text(
                            "View Basket",
                            style: TextStyle(
                              color: neon,
                              fontWeight: FontWeight.w700,
                              fontSize: 18,
                            ),
                          ),
                          const SizedBox(width: 16),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
