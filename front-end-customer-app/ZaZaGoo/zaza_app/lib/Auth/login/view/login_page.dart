// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';
// import 'package:zaza_app/Auth/login/view/otp_page.dart';

// class ZazaLoginPage extends StatefulWidget {
//   const ZazaLoginPage({super.key});

//   @override
//   State<ZazaLoginPage> createState() => _ZazaLoginPageState();
// }

// class _ZazaLoginPageState extends State<ZazaLoginPage> {
//   final TextEditingController _phoneController = TextEditingController();

//   bool get _isPhoneValid {
//     final text = _phoneController.text.trim();
//     return text.length >= 9;
//   }

//   @override
//   void dispose() {
//     _phoneController.dispose();
//     super.dispose();
//   }

//   void _goToOtp() {
//     final phone = _phoneController.text.trim();

//     if (!_isPhoneValid) return;

//     Navigator.push(
//       context,
//       MaterialPageRoute(builder: (_) => OtpPage(phone: phone)),
//     );
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: const Color(0xFFF8F8F8),
//       body: SafeArea(
//         child: Padding(
//           padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             children: [
//               const SizedBox(height: 20),

//               const Text(
//                 'Welcome to Zaza',
//                 style: TextStyle(fontSize: 28, fontWeight: FontWeight.w700),
//               ),

//               const SizedBox(height: 8),

//               const Text(
//                 'Enter your phone number to continue',
//                 style: TextStyle(fontSize: 15, color: Colors.black54),
//               ),

//               const SizedBox(height: 32),

//               Container(
//                 padding: const EdgeInsets.symmetric(horizontal: 16),
//                 decoration: BoxDecoration(
//                   color: Colors.white,
//                   borderRadius: BorderRadius.circular(18),
//                   border: Border.all(color: const Color(0xFFE6E6E6)),
//                 ),
//                 child: Row(
//                   children: [
//                     const Text(
//                       '+992',
//                       style: TextStyle(
//                         fontSize: 17,
//                         fontWeight: FontWeight.w600,
//                       ),
//                     ),
//                     const SizedBox(width: 12),
//                     Container(width: 1, height: 24, color: Colors.black12),
//                     const SizedBox(width: 12),
//                     Expanded(
//                       child: TextField(
//                         controller: _phoneController,
//                         keyboardType: TextInputType.phone,
//                         inputFormatters: [
//                           FilteringTextInputFormatter.digitsOnly,
//                           LengthLimitingTextInputFormatter(9),
//                         ],
//                         onChanged: (_) => setState(() {}),
//                         decoration: const InputDecoration(
//                           border: InputBorder.none,
//                           hintText: 'XX XXX XX XX',
//                         ),
//                       ),
//                     ),
//                   ],
//                 ),
//               ),

//               const SizedBox(height: 18),

//               const Text(
//                 'We will send you a one-time verification code.',
//                 style: TextStyle(fontSize: 13, color: Colors.black45),
//               ),

//               const Spacer(),

//               SizedBox(
//                 width: double.infinity,
//                 height: 56,
//                 child: ElevatedButton(
//                   onPressed: _isPhoneValid ? _goToOtp : null,
//                   style: ElevatedButton.styleFrom(
//                     backgroundColor: Colors.black,
//                     disabledBackgroundColor: Colors.black12,
//                     elevation: 0,
//                     shape: RoundedRectangleBorder(
//                       borderRadius: BorderRadius.circular(18),
//                     ),
//                   ),
//                   child: const Text(
//                     'Continue',
//                     style: TextStyle(
//                       fontSize: 16,
//                       fontWeight: FontWeight.w700,
//                       color: Colors.white,
//                     ),
//                   ),
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:zaza_app/Auth/login/view/otp_page.dart';
import 'package:zaza_app/Auth/services/customer_auth_service.dart';
import 'package:zaza_app/core/api_service.dart';

class PhoneLoginPage extends StatefulWidget {
  const PhoneLoginPage({super.key});

  @override
  State<PhoneLoginPage> createState() => _PhoneLoginPageState();
}

class _PhoneLoginPageState extends State<PhoneLoginPage> {
  final TextEditingController _phoneController = TextEditingController();
  final FocusNode _phoneFocusNode = FocusNode();

  static const Color _pageBg = Color(0xFFF7F7F7);
  static const Color _bottomBg = Color(0xFFF2F2F2);
  static const Color _activeButtonBg = Color(0xFF004D40);
  static const Color _activeButtonText = Color(0xFF00E676);
  static const Color _inactiveButtonBg = Color(0xFFE9E9E9);
  static const Color _inactiveButtonText = Color(0xFFA8A8A8);

  String get _digitsOnly => _phoneController.text.replaceAll(RegExp(r'\D'), '');

  bool get _isValid => _digitsOnly.length == 9;

  bool _loading = false;

  @override
  void dispose() {
    _phoneController.dispose();
    _phoneFocusNode.dispose();
    super.dispose();
  }

  void _clearPhone() {
    _phoneController.clear();
    setState(() {});
    _phoneFocusNode.requestFocus();
  }

  Future<void> _continue() async {
    if (!_isValid || _loading) return;

    final phone = '+992$_digitsOnly';
    setState(() => _loading = true);
    try {
      await CustomerAuthService.sendOtp(phone);
      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => OtpPage(phone: phone)),
      );
    } on CustomerApiException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.message), backgroundColor: Colors.red),
      );
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Network error. Please try again.'), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final media = MediaQuery.of(context);
    final keyboardBottom = media.viewInsets.bottom;
    final safeBottom = media.viewPadding.bottom;
    final keyboardOpen = keyboardBottom > 0;

    final double bottomPadding = keyboardOpen ? 16 : (safeBottom + 18);

    return Scaffold(
      resizeToAvoidBottomInset: true,
      backgroundColor: _pageBg,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.only(bottom: keyboardOpen ? 12 : 0),
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 18, 24, 0),
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
                                  border: Border.all(
                                    color: const Color(0xFFE1E1E1),
                                  ),
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
                      const SizedBox(height: 34),
                      const Text(
                        "Enter your phone number",
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w500,
                          color: Colors.black,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 14),
                      const Text(
                        "We need to send you a code to verify your\nphone number.",
                        style: TextStyle(
                          fontSize: 15,
                          height: 1.35,
                          color: Color(0xFF8D8D8D),
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      const SizedBox(height: 34),

                      // SAME PHONE FIELD LIKE PREVIOUS
                      Container(
                        height: 58,
                        padding: const EdgeInsets.symmetric(horizontal: 22),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF7F7F7),
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(
                            color: const Color(0xFFD9D9D9),
                            width: 1.2,
                          ),
                        ),
                        child: Row(
                          children: [
                            const Text(
                              "+992",
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF2B2B2B),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Container(
                              width: 1.3,
                              height: 34,
                              color: const Color(0xFFD8D8D8),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: TextField(
                                controller: _phoneController,
                                focusNode: _phoneFocusNode,
                                keyboardType: TextInputType.phone,
                                textInputAction: TextInputAction.done,
                                cursorColor: const Color(0xFF5B4FCF),
                                inputFormatters: [
                                  FilteringTextInputFormatter.digitsOnly,
                                  LengthLimitingTextInputFormatter(9),
                                  _PhoneNumberFormatter(),
                                ],
                                onChanged: (_) => setState(() {}),
                                onSubmitted: (_) {
                                  if (_isValid) _continue();
                                },
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w500,
                                  color: Color(0xFF2B2B2B),
                                ),
                                decoration: InputDecoration(
                                  border: InputBorder.none,
                                  hintText: "XX XXX XX XX",
                                  hintStyle: const TextStyle(
                                    fontSize: 18,
                                    color: Color(0xFF7E748A),
                                    fontWeight: FontWeight.w400,
                                  ),
                                  suffixIcon: _phoneController.text.isNotEmpty
                                      ? GestureDetector(
                                          onTap: _clearPhone,
                                          child: const Icon(
                                            Icons.close,
                                            color: Color(0xFFC7C7C7),
                                            size: 26,
                                          ),
                                        )
                                      : null,
                                  suffixIconConstraints: const BoxConstraints(
                                    minWidth: 32,
                                    minHeight: 32,
                                  ),
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

            // BOTTOM BUTTON FIXED FOR ANDROID
            Container(
              width: double.infinity,
              padding: EdgeInsets.fromLTRB(24, 22, 24, bottomPadding),
              decoration: const BoxDecoration(
                color: _bottomBg,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: SafeArea(
                top: false,
                child: SizedBox(
                  width: double.infinity,
                  height: 58,
                  child: ElevatedButton(
                    onPressed: _isValid ? _continue : null,
                    style: ElevatedButton.styleFrom(
                      elevation: 0,
                      backgroundColor: _isValid
                          ? _activeButtonBg
                          : _inactiveButtonBg,
                      disabledBackgroundColor: _inactiveButtonBg,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: Text(
                      "Continue",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: _isValid
                            ? _activeButtonText
                            : _inactiveButtonText,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PhoneNumberFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    String digits = newValue.text.replaceAll(RegExp(r'\D'), '');

    if (digits.length > 9) {
      digits = digits.substring(0, 9);
    }

    final buffer = StringBuffer();

    for (int i = 0; i < digits.length; i++) {
      buffer.write(digits[i]);

      if (i == 1 || i == 4 || i == 6) {
        if (i != digits.length - 1) {
          buffer.write(' ');
        }
      }
    }

    final text = buffer.toString();

    return TextEditingValue(
      text: text,
      selection: TextSelection.collapsed(offset: text.length),
    );
  }
}
