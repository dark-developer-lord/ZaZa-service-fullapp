import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:zaza_driver_app/AUTH/login/login_page.dart';
import 'package:zaza_driver_app/bottom_navigation.dart';
import 'package:zaza_driver_app/core/auth_service.dart';

class DriverOtpPage extends StatefulWidget {
  const DriverOtpPage({
    super.key,
    required this.phone,
    // required this.store, // ✅ NEW
    // required this.onViewAllOrders, // ✅ NEW
    required this.onVerified,
  });

  final String phone;
  // final OrdersStore store; // ✅ NEW
  // final VoidCallback onViewAllOrders; // ✅ NEW

  final void Function(String tokenOrDriver) onVerified;

  @override
  State<DriverOtpPage> createState() => _DriverOtpPageState();
}

class _DriverOtpPageState extends State<DriverOtpPage> {
  static const _len = 6;
  final _otpC = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _otpC.dispose();
    super.dispose();
  }

  String get _otp => _otpC.text.trim();
  bool get _canContinue => _otp.length == _len;

  Future<void> _verify() async {
    if (!_canContinue) return;

    setState(() => _loading = true);
    try {
      // ✅ Реальная верификация через бэкенд
      final result = await AuthService.verifyOtp(widget.phone, _otp);

      if (!mounted) return;

      widget.onVerified(result.token);

      // Переходим на главную страницу приложения
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const MainNavigationPage()),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString().replaceFirst('ApiException(401): ', '')),
          backgroundColor: Colors.red.shade600,
        ),
      );
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _resend() async {
    try {
      await AuthService.sendOtp(widget.phone);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Новый OTP отправлен")),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Ошибка: $e'), backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    const blue = Color(0xFF009966);
    const bg = Colors.white;

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () {
            Navigator.pushReplacement(
              context,
              LeftToRightRoute(page: const DriverLoginPage()),
            );
          },
        ),
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(18, 10, 18, 18),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "OTP Verification",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Enter the $_len digit code sent to your phone\n${widget.phone}",
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      color: Colors.black.withOpacity(0.55),
                      height: 1.25,
                    ),
                  ),
                  const SizedBox(height: 18),

                  _OtpBoxes(length: _len, value: _otp),

                  // ✅ hidden input drives boxes
                  Opacity(
                    opacity: 0,
                    child: SizedBox(
                      height: 1,
                      child: TextField(
                        controller: _otpC,
                        autofocus: true,
                        keyboardType: TextInputType.number,
                        maxLength: _len,
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                          LengthLimitingTextInputFormatter(_len),
                        ],
                        onChanged: (_) => setState(() {}),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  Row(
                    children: [
                      Text(
                        "Didn't receive code? ",
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          color: Colors.black.withOpacity(0.55),
                        ),
                      ),
                      InkWell(
                        onTap: _resend,
                        child: const Text(
                          "Click to resend",
                          style: TextStyle(
                            fontWeight: FontWeight.w900,
                            color: blue,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 18),

                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: blue,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 0,
                      ),
                      onPressed: _loading
                          ? null
                          : (_canContinue ? _verify : null),
                      child: _loading
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Text(
                              "Continue",
                              style: TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 16,
                                color: Colors.white,
                              ),
                            ),
                    ),
                  ),

                  const SizedBox(height: 12),

                  _NumericPad(
                    onDigit: (d) {
                      if (_otp.length >= _len) return;
                      _otpC.text = (_otp + d);
                      setState(() {});
                    },
                    onBackspace: () {
                      if (_otp.isEmpty) return;
                      _otpC.text = _otp.substring(0, _otp.length - 1);
                      setState(() {});
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _OtpBoxes extends StatelessWidget {
  const _OtpBoxes({required this.length, required this.value});

  final int length;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(length, (i) {
        final ch = i < value.length ? value[i] : "";
        return Expanded(
          child: Container(
            height: 56,
            margin: EdgeInsets.only(right: i == length - 1 ? 0 : 10),
            decoration: BoxDecoration(
              color: const Color(0xFFF6F7FB),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.black12),
            ),
            child: Center(
              child: Text(
                ch,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
          ),
        );
      }),
    );
  }
}

class _NumericPad extends StatelessWidget {
  const _NumericPad({required this.onDigit, required this.onBackspace});

  final void Function(String d) onDigit;
  final VoidCallback onBackspace;

  @override
  Widget build(BuildContext context) {
    Widget btn(String t, {VoidCallback? onTap}) {
      return InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          height: 54,
          decoration: BoxDecoration(
            color: const Color(0xFFF6F7FB),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.black12),
          ),
          child: Center(
            child: Text(
              t,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
            ),
          ),
        ),
      );
    }

    final keys = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      ["", "0", "⌫"],
    ];

    return Column(
      children: keys.map((row) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: Row(
            children: row.map((k) {
              if (k.isEmpty) return const Expanded(child: SizedBox(height: 54));
              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 6),
                  child: btn(
                    k,
                    onTap: k == "⌫" ? onBackspace : () => onDigit(k),
                  ),
                ),
              );
            }).toList(),
          ),
        );
      }).toList(),
    );
  }
}

class LeftToRightRoute<T> extends PageRouteBuilder<T> {
  LeftToRightRoute({required Widget page})
    : super(
        transitionDuration: const Duration(milliseconds: 260),
        reverseTransitionDuration: const Duration(milliseconds: 260),
        pageBuilder: (_, __, ___) => page,
        transitionsBuilder: (_, animation, __, child) {
          final tween = Tween<Offset>(
            begin: const Offset(-1, 0), // ✅ аз чап меояд
            end: Offset.zero,
          ).chain(CurveTween(curve: Curves.easeOutCubic));

          return SlideTransition(
            position: animation.drive(tween),
            child: child,
          );
        },
      );
}
