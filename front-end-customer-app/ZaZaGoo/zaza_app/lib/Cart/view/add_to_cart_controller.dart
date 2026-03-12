import 'package:flutter/material.dart';
import 'package:zaza_app/Basket/view/basket_controller.dart';

class AddControl extends StatelessWidget {
  final BasketController basket;

  final String productId;
  final String title;
  final double price;
  final String? imageUrl;

  final VoidCallback? onAddedFirst;

  const AddControl({
    super.key,
    required this.basket,
    required this.productId,
    required this.title,
    required this.price,
    this.imageUrl,
    this.onAddedFirst,
  });

  void _add() {
    final wasZero = basket.qtyOf(productId) == 0;
    basket.inc(id: productId, title: title, price: price, imageUrl: imageUrl);
    if (wasZero) onAddedFirst?.call();
  }

  void _minusOrDelete() {
    basket.decOrRemove(productId);
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: basket,
      builder: (_, __) {
        final qty = basket.qtyOf(productId);

        return Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.black.withOpacity(0.08), width: 1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 180),
            switchInCurve: Curves.easeOut,
            switchOutCurve: Curves.easeIn,
            transitionBuilder: (child, anim) => ScaleTransition(
              scale: Tween(begin: 0.92, end: 1.0).animate(anim),
              child: child,
            ),
            child: qty == 0
                ? _PlusBtn(key: const ValueKey("plus"), onTap: _add)
                : _Pill(
                    key: ValueKey("pill_$qty"),
                    qty: qty,
                    leftIcon: qty == 1
                        ? Icons.delete_outline_rounded
                        : Icons.remove_rounded,
                    onLeftTap: _minusOrDelete,
                    onAdd: _add,
                  ),
          ),
        );
      },
    );
  }
}

class _PlusBtn extends StatelessWidget {
  final VoidCallback onTap;
  const _PlusBtn({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      elevation: 2,
      shadowColor: Colors.black.withOpacity(0.12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: const SizedBox(
          width: 42,
          height: 42,
          child: Center(child: Icon(Icons.add, size: 21)),
        ),
      ),
    );
  }
}

class _Pill extends StatelessWidget {
  final int qty;
  final IconData leftIcon;
  final VoidCallback onLeftTap;
  final VoidCallback onAdd;

  const _Pill({
    super.key,
    required this.qty,
    required this.leftIcon,
    required this.onLeftTap,
    required this.onAdd,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      elevation: 2,
      shadowColor: Colors.black.withOpacity(0.12),
      child: Container(
        height: 42,
        padding: const EdgeInsets.symmetric(horizontal: 6),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _IconMini(icon: leftIcon, onTap: onLeftTap),
            const SizedBox(width: 6),
            SizedBox(
              width: 18,
              child: Text(
                "$qty",
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                ),
              ),
            ),
            const SizedBox(width: 6),
            _IconMini(icon: Icons.add_rounded, onTap: onAdd),
          ],
        ),
      ),
    );
  }
}

class _IconMini extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  const _IconMini({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: SizedBox(width: 34, height: 34, child: Icon(icon, size: 18)),
    );
  }
}
