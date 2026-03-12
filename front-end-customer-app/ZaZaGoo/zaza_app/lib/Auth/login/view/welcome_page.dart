// import 'package:flutter/material.dart';
// import 'package:zaza_app/Auth/login/view/login_page.dart';

// class ZazaWelcomePage extends StatelessWidget {
//   const ZazaWelcomePage({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Stack(
//         children: [
//           // Background gradient
//           Container(
//             decoration: const BoxDecoration(
//               gradient: LinearGradient(
//                 begin: Alignment.topCenter,
//                 end: Alignment.bottomCenter,
//                 colors: [
//                   Color(0xFFBDEEE6),
//                   Color(0xFF5FE4C6),
//                   Color(0xFF1EDFA7),
//                 ],
//               ),
//             ),
//           ),

//           // Big background text
//           Positioned.fill(
//             child: IgnorePointer(
//               child: Padding(
//                 padding: const EdgeInsets.only(left: 36, top: 10),
//                 child: Opacity(
//                   opacity: 0.22,
//                   child: Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     children: const [
//                       Text(
//                         "Pay",
//                         style: TextStyle(
//                           fontSize: 92,
//                           fontWeight: FontWeight.w800,
//                           color: Colors.white,
//                           height: 0.9,
//                         ),
//                       ),
//                       Text(
//                         "Go",
//                         style: TextStyle(
//                           fontSize: 92,
//                           fontWeight: FontWeight.w800,
//                           color: Colors.white,
//                           height: 0.9,
//                         ),
//                       ),
//                       Text(
//                         "Eat",
//                         style: TextStyle(
//                           fontSize: 92,
//                           fontWeight: FontWeight.w800,
//                           color: Colors.white,
//                           height: 0.9,
//                         ),
//                       ),
//                       Text(
//                         "Get",
//                         style: TextStyle(
//                           fontSize: 92,
//                           fontWeight: FontWeight.w800,
//                           color: Colors.white,
//                           height: 0.9,
//                         ),
//                       ),
//                       Text(
//                         "Pay",
//                         style: TextStyle(
//                           fontSize: 92,
//                           fontWeight: FontWeight.w800,
//                           color: Colors.white,
//                           height: 0.9,
//                         ),
//                       ),
//                       Text(
//                         "Go",
//                         style: TextStyle(
//                           fontSize: 92,
//                           fontWeight: FontWeight.w800,
//                           color: Colors.white,
//                           height: 0.9,
//                         ),
//                       ),
//                     ],
//                   ),
//                 ),
//               ),
//             ),
//           ),

//           // Bottom card
//           Align(
//             alignment: Alignment.bottomCenter,
//             child: Container(
//               width: double.infinity,
//               padding: const EdgeInsets.fromLTRB(24, 22, 24, 28),
//               decoration: const BoxDecoration(
//                 color: Colors.white,
//                 borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
//               ),
//               child: SafeArea(
//                 top: false,
//                 child: Column(
//                   mainAxisSize: MainAxisSize.min,
//                   children: [
//                     SizedBox(
//                       child: Image.asset(
//                         "assets/logo/logo.png",
//                         width: 150,
//                         height: 50,
//                       ),
//                     ),
//                     const SizedBox(height: 22),
//                     SizedBox(
//                       width: double.infinity,
//                       height: 58,
//                       child: ElevatedButton(
//                         onPressed: () {
//                           Navigator.push(
//                             context,
//                             MaterialPageRoute(
//                               builder: (_) => const PhoneLoginPage(),
//                             ),
//                           );
//                         },
//                         style: ElevatedButton.styleFrom(
//                           backgroundColor: const Color(0xFF063F39),
//                           elevation: 0,
//                           shape: RoundedRectangleBorder(
//                             borderRadius: BorderRadius.circular(16),
//                           ),
//                         ),
//                         child: const Text(
//                           "Continue with phone number",
//                           style: TextStyle(
//                             fontSize: 18,
//                             fontWeight: FontWeight.w700,
//                             color: Color(0xFF1BE39B),
//                           ),
//                         ),
//                       ),
//                     ),
//                     const SizedBox(height: 16),
//                     SizedBox(
//                       width: double.infinity,
//                       height: 58,
//                       child: OutlinedButton.icon(
//                         onPressed: () {},
//                         icon: const Icon(
//                           Icons.g_mobiledata_rounded,
//                           size: 28,
//                           color: Colors.black,
//                         ),
//                         label: const Text(
//                           "Continue with Google",
//                           style: TextStyle(
//                             fontSize: 17,
//                             fontWeight: FontWeight.w600,
//                             color: Color(0xFF3B3B3B),
//                           ),
//                         ),
//                         style: OutlinedButton.styleFrom(
//                           side: const BorderSide(color: Color(0xFFD9D9D9)),
//                           shape: RoundedRectangleBorder(
//                             borderRadius: BorderRadius.circular(16),
//                           ),
//                           backgroundColor: Colors.white,
//                         ),
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }
import 'package:flutter/material.dart';
import 'package:zaza_app/Auth/login/view/login_page.dart';

class ZazaWelcomePage extends StatelessWidget {
  const ZazaWelcomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFFBDEEE6),
                  Color(0xFF5FE4C6),
                  Color(0xFF1EDFA7),
                ],
              ),
            ),
          ),

          // Animated background text
          const Positioned.fill(
            child: IgnorePointer(child: _MovingWordsBackground()),
          ),

          // Bottom card
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(24, 22, 24, 28),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: SafeArea(
                top: false,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      child: Image.asset(
                        "assets/logo/logo.png",
                        width: 150,
                        height: 50,
                      ),
                    ),
                    const SizedBox(height: 22),
                    SizedBox(
                      width: double.infinity,
                      height: 58,
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const PhoneLoginPage(),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF063F39),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: const Text(
                          "Continue with phone number",
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1BE39B),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 58,
                      child: OutlinedButton.icon(
                        onPressed: () {},
                        icon: const Icon(
                          Icons.g_mobiledata_rounded,
                          size: 28,
                          color: Colors.black,
                        ),
                        label: const Text(
                          "Continue with Google",
                          style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF3B3B3B),
                          ),
                        ),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Color(0xFFD9D9D9)),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          backgroundColor: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MovingWordsBackground extends StatefulWidget {
  const _MovingWordsBackground();

  @override
  State<_MovingWordsBackground> createState() => _MovingWordsBackgroundState();
}

class _MovingWordsBackgroundState extends State<_MovingWordsBackground>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  final List<String> _words = const [
    "ZaZa Eat",
    "ZaZa Get",
    "ZaZa Eat",
    "ZaZa Get",
    "ZaZa Eat",
    "ZaZa Get",
    "ZaZa Eat",
  ];

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 18),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Widget _buildWordsColumn() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: _words
          .map(
            (word) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Text(
                word,
                style: const TextStyle(
                  fontSize: 92,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                  height: 0.9,
                  letterSpacing: -1.5,
                ),
              ),
            ),
          )
          .toList(),
    );
  }

  @override
  Widget build(BuildContext context) {
    const double itemHeight = 90;
    final double blockHeight = _words.length * itemHeight;

    return ClipRect(
      child: Padding(
        padding: const EdgeInsets.only(left: 36, top: 10),
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            final double offset = _controller.value * blockHeight;

            return Stack(
              children: [
                Positioned(
                  left: 0,
                  top: offset - blockHeight,
                  child: Opacity(opacity: 0.18, child: _buildWordsColumn()),
                ),
                Positioned(
                  left: 0,
                  top: offset,
                  child: Opacity(opacity: 0.18, child: _buildWordsColumn()),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
