import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:zaza_driver_app/AUTH/login/join_courier_sheet.dart';
import 'package:zaza_driver_app/AUTH/login/otp_page.dart';
import 'package:zaza_driver_app/core/auth_service.dart';

class DriverLoginPage extends StatefulWidget {
  const DriverLoginPage({
    super.key,
    // required this.store,
    // required this.onViewAllOrders,
  });

  // final OrdersStore store;
  // final VoidCallback onViewAllOrders;

  @override
  State<DriverLoginPage> createState() => _DriverLoginPageState();
}

class _DriverLoginPageState extends State<DriverLoginPage> {
  final _phoneC = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _phoneC.dispose();
    super.dispose();
  }

  String get _phoneDigits => _phoneC.text.replaceAll(RegExp(r'\D'), '');
  bool get _canContinue => _phoneDigits.length == 9;
  String get _fullPhone => "+992$_phoneDigits";

  Future<void> _sendOtp() async {
    if (!_canContinue || _loading) return;

    setState(() => _loading = true);
    try {
      // ✅ Отправляем OTP через бэкенд
      await AuthService.sendOtp(_fullPhone);

      if (!mounted) return;

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => DriverOtpPage(
            phone: _fullPhone,
            onVerified: (tokenOrDriver) {
              // Токен уже сохранён в AuthService.verifyOtp → SharedPreferences
            },
          ),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString().replaceFirst('ApiException', 'Ошибка')),
          backgroundColor: Colors.red.shade600,
        ),
      );
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _openJoinSheet() => showJoinCourierSheet(context);

  @override
  Widget build(BuildContext context) {
    const blue = Color(0xFF2F6BFF);
    const bg = Color(0xFFEEF3FF);

    return Scaffold(
      backgroundColor: bg,
      body: SafeArea(
        bottom: false,
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(18, 22, 18, 18),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                children: [
                  const SizedBox(height: 8),

                  Container(
                    width: 54,
                    height: 54,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.08),
                          blurRadius: 24,
                          offset: const Offset(0, 14),
                        ),
                      ],
                    ),
                    child: const Center(
                      child: Text(
                        "Z",
                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          fontSize: 28,
                          color: blue,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 18),

                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.fromLTRB(16, 18, 16, 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(22),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.08),
                          blurRadius: 28,
                          offset: const Offset(0, 18),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Welcome back",
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          "Please sign in to your driver account",
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            color: Colors.black.withOpacity(0.55),
                          ),
                        ),

                        const SizedBox(height: 16),
                        const _FieldLabel("Phone number"),
                        const SizedBox(height: 8),

                        Container(
                          height: 52,
                          decoration: BoxDecoration(
                            color: const Color(0xFFF6F7FB),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: Colors.black12),
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 10,
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: Colors.black12),
                                ),
                                child: const Text(
                                  "+992",
                                  style: TextStyle(fontWeight: FontWeight.w900),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: TextField(
                                  controller: _phoneC,
                                  keyboardType: TextInputType.phone,
                                  inputFormatters: [
                                    FilteringTextInputFormatter.digitsOnly,
                                    LengthLimitingTextInputFormatter(9),
                                  ],
                                  onChanged: (_) => setState(() {}),
                                  decoration: InputDecoration(
                                    hintText: "931234567",
                                    border: InputBorder.none,
                                    // helperText: _phoneDigits.isEmpty
                                    //     ? null
                                    //     : "${_phoneDigits.length}/9",
                                  ),
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 14),

                        SizedBox(
                          width: double.infinity,
                          height: 54,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color(0xFF009966),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                              elevation: 0,
                            ),
                            onPressed: _loading
                                ? null
                                : (_canContinue ? _sendOtp : null),
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

                        const SizedBox(height: 14),

                        Center(
                          child: InkWell(
                            onTap: _openJoinSheet,
                            borderRadius: BorderRadius.circular(12),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 8,
                              ),
                              child: RichText(
                                text: TextSpan(
                                  style: TextStyle(
                                    fontWeight: FontWeight.w800,
                                    color: Colors.black.withOpacity(0.65),
                                  ),
                                  children: const [
                                    TextSpan(text: "Want to join as courier? "),
                                    TextSpan(
                                      text: "Contact us",
                                      style: TextStyle(
                                        color: Color(0xFF009966),
                                        fontWeight: FontWeight.w900,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 6),
                        Center(
                          child: Text(
                            "Driver accounts are provided by the company backend.",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: Colors.black.withOpacity(0.45),
                            ),
                          ),
                        ),
                      ],
                    ),
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

class _FieldLabel extends StatelessWidget {
  const _FieldLabel(this.text);
  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: TextStyle(
        fontWeight: FontWeight.w800,
        color: Colors.black.withOpacity(0.65),
      ),
    );
  }
}
