import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class EmailUpdatePage extends StatefulWidget {
  const EmailUpdatePage({super.key, this.initialEmail = '', this.onUpdate});

  final String initialEmail;
  final Future<void> Function(String email)? onUpdate;

  @override
  State<EmailUpdatePage> createState() => _EmailUpdatePageState();
}

class _EmailUpdatePageState extends State<EmailUpdatePage> {
  late final TextEditingController _emailC;
  final FocusNode _emailFocus = FocusNode();

  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _emailC = TextEditingController(text: widget.initialEmail);
    _emailC.addListener(_refresh);
  }

  @override
  void dispose() {
    _emailC.removeListener(_refresh);
    _emailC.dispose();
    _emailFocus.dispose();
    super.dispose();
  }

  void _refresh() => setState(() {});

  bool _isValidEmail(String value) {
    final email = value.trim();
    return RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    ).hasMatch(email);
  }

  bool get _canUpdate {
    return _isValidEmail(_emailC.text.trim()) && !_loading;
  }

  Future<void> _updateEmail() async {
    final email = _emailC.text.trim();

    if (!_isValidEmail(email)) {
      _showSnack("Please enter a valid email address");
      _emailFocus.requestFocus();
      return;
    }

    setState(() => _loading = true);

    try {
      if (widget.onUpdate != null) {
        await widget.onUpdate!(email);
      } else {
        await Future.delayed(const Duration(milliseconds: 700));
      }

      if (!mounted) return;
      Navigator.pop(context, email);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _showSnack(String text) {
    ScaffoldMessenger.of(context)
      ..clearSnackBars()
      ..showSnackBar(
        SnackBar(content: Text(text), behavior: SnackBarBehavior.floating),
      );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F3F3),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 18, 16, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _BackSquareButton(onTap: () => Navigator.pop(context)),
              const SizedBox(height: 32),

              const Text(
                "Update your email",
                style: TextStyle(
                  fontSize: 27,
                  height: 1.1,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF1E1E1E),
                ),
              ),
              const SizedBox(height: 10),

              const Text(
                "Receive info about new updates and awesome promos in your inbox",
                style: TextStyle(
                  fontSize: 15,
                  height: 1.45,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF2B2B2B),
                ),
              ),
              const SizedBox(height: 28),

              Container(
                height: 58,
                decoration: BoxDecoration(
                  color: Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: const Color(0xFF0D5C46),
                    width: 1.6,
                  ),
                ),
                alignment: Alignment.center,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: TextField(
                  controller: _emailC,
                  focusNode: _emailFocus,
                  keyboardType: TextInputType.emailAddress,
                  textInputAction: TextInputAction.done,
                  onSubmitted: (_) {
                    if (_canUpdate) _updateEmail();
                  },
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF1E1E1E),
                  ),
                  decoration: InputDecoration(
                    border: InputBorder.none,
                    hintText: "Enter your new email address",
                    hintStyle: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF9B9B9B),
                    ),
                    suffixIcon: _emailC.text.isNotEmpty
                        ? IconButton(
                            onPressed: () {
                              _emailC.clear();
                              setState(() {});
                            },
                            icon: const Icon(
                              Icons.cancel_rounded,
                              color: Color(0xFF5E5E5E),
                            ),
                          )
                        : null,
                  ),
                ),
              ),

              const Spacer(),

              SizedBox(
                width: double.infinity,
                height: 62,
                child: ElevatedButton(
                  onPressed: _canUpdate ? _updateEmail : null,
                  style: ElevatedButton.styleFrom(
                    elevation: 0,
                    backgroundColor: _canUpdate
                        ? const Color(0xFF004D40)
                        : const Color(0xFFE8E8E8),
                    disabledBackgroundColor: const Color(0xFFE8E8E8),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: _loading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.2,
                            color: Colors.white,
                          ),
                        )
                      : Text(
                          "Update",
                          style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w700,
                            color: _canUpdate
                                ? const Color(0xFF22FF88)
                                : const Color(0xFF9C9C9C),
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

class _BackSquareButton extends StatelessWidget {
  const _BackSquareButton({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Ink(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: const Color(0xFFF3F3F3),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFD6D6D6), width: 1.2),
          ),
          child: const Icon(
            Icons.arrow_back_rounded,
            size: 22,
            color: Color(0xFF1E1E1E),
          ),
        ),
      ),
    );
  }
}
