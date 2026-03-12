import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:zaza_app/Auth/services/customer_auth_service.dart';
import 'package:zaza_app/core/api_service.dart';
import 'package:zaza_app/Home/View/home_page.dart';

class OtpPage extends StatefulWidget {
  final String phone;

  const OtpPage({super.key, required this.phone});

  @override
  State<OtpPage> createState() => _OtpPageState();
}

class _OtpPageState extends State<OtpPage> {
  final TextEditingController _otpController = TextEditingController();
  final FocusNode _otpFocusNode = FocusNode();

  Timer? _timer;
  int _secondsLeft = 120;
  bool _isVerifying = false;

  bool get _isOtpValid => _otpController.text.trim().length == 6;

  @override
  void initState() {
    super.initState();
    _startTimer();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _otpFocusNode.requestFocus();
      }
    });
  }

  void _startTimer() {
    _timer?.cancel();

    setState(() {
      _secondsLeft = 120;
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }

      if (_secondsLeft <= 1) {
        timer.cancel();
        setState(() {
          _secondsLeft = 0;
        });
      } else {
        setState(() {
          _secondsLeft--;
        });
      }
    });
  }

  String get _formattedTime {
    final minutes = (_secondsLeft ~/ 60).toString().padLeft(2, '0');
    final seconds = (_secondsLeft % 60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  void _onOtpChanged(String value) {
    setState(() {});

    if (value.length == 6) {
      _verifyOtp();
    }
  }

  Future<void> _verifyOtp() async {
    if (!_isOtpValid || _isVerifying) return;

    setState(() => _isVerifying = true);
    try {
      await CustomerAuthService.verifyOtp(widget.phone, _otpController.text.trim());
      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => HomePage()),
      );
    } on CustomerApiException catch (e) {
      if (!mounted) return;
      _otpController.clear();
      setState(() {});
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.message), backgroundColor: Colors.red),
      );
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Network error. Please try again.'), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _isVerifying = false);
    }
  }

  Future<void> _resendCode() async {
    if (_secondsLeft > 0) return;

    _otpController.clear();
    setState(() {});
    _otpFocusNode.requestFocus();

    try {
      await CustomerAuthService.sendOtp(widget.phone);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('OTP code resent successfully')),
      );
    } on CustomerApiException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.message), backgroundColor: Colors.red),
      );
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to resend OTP. Try again.'), backgroundColor: Colors.red),
      );
    }

    _startTimer();
  }

  @override
  void dispose() {
    _timer?.cancel();
    _otpController.dispose();
    _otpFocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final media = MediaQuery.of(context);
    final keyboardOpen = media.viewInsets.bottom > 0;
    final safeBottom = media.viewPadding.bottom;

    return Scaffold(
      resizeToAvoidBottomInset: true,
      backgroundColor: const Color(0xFFF7F7F7),
      body: SafeArea(
        child: GestureDetector(
          onTap: () => _otpFocusNode.requestFocus(),
          child: SingleChildScrollView(
            padding: EdgeInsets.fromLTRB(
              24,
              18,
              24,
              keyboardOpen ? 24 : (safeBottom + 24),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Material(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      child: InkWell(
                        borderRadius: BorderRadius.circular(16),
                        onTap: () => Navigator.pop(context),
                        child: Container(
                          width: 54,
                          height: 54,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: const Color(0xFFE1E1E1)),
                          ),
                          child: const Icon(
                            Icons.arrow_back_ios_new_rounded,
                            color: Colors.black87,
                            size: 22,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 40),
                const Text(
                  "Verify your mobile number",
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w500,
                    color: Colors.black,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 18),
                Text(
                  "You will receive a SMS with a verification pin on\n+992 ${widget.phone}",
                  style: const TextStyle(
                    fontSize: 15,
                    height: 1.45,
                    color: Color(0xFF8D8D8D),
                    fontWeight: FontWeight.w400,
                  ),
                ),
                const SizedBox(height: 70),

                Opacity(
                  opacity: 0,
                  child: SizedBox(
                    height: 0,
                    width: 0,
                    child: TextField(
                      controller: _otpController,
                      focusNode: _otpFocusNode,
                      autofocus: true,
                      keyboardType: TextInputType.number,
                      textInputAction: TextInputAction.done,
                      inputFormatters: [
                        FilteringTextInputFormatter.digitsOnly,
                        LengthLimitingTextInputFormatter(4),
                      ],
                      onChanged: _onOtpChanged,
                    ),
                  ),
                ),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: List.generate(4, (index) {
                    final hasValue = index < _otpController.text.length;
                    final isActive =
                        index == _otpController.text.length &&
                        _otpController.text.length < 4;
                    final char = hasValue ? _otpController.text[index] : '';

                    return GestureDetector(
                      onTap: () => _otpFocusNode.requestFocus(),
                      child: Container(
                        width: 70,
                        alignment: Alignment.center,
                        padding: const EdgeInsets.only(bottom: 10),
                        decoration: BoxDecoration(
                          border: Border(
                            bottom: BorderSide(
                              color: hasValue || isActive
                                  ? const Color(0xFF8F8F8F)
                                  : const Color(0xFFD9D9D9),
                              width: 3,
                            ),
                          ),
                        ),
                        child: Text(
                          char,
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w500,
                            color: Colors.black,
                          ),
                        ),
                      ),
                    );
                  }),
                ),

                const SizedBox(height: 34),

                Center(
                  child: GestureDetector(
                    onTap: _secondsLeft == 0 ? _resendCode : null,
                    child: Text(
                      _secondsLeft == 0
                          ? "Resend code"
                          : "Resend code $_formattedTime",
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w400,
                        color: _secondsLeft == 0
                            ? const Color(0xFF004D40)
                            : const Color(0xFFC5C5C5),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
