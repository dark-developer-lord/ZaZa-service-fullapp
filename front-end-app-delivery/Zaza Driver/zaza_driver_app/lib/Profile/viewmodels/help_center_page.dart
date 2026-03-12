import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:zaza_driver_app/Profile/viewmodels/live_chat_page.dart';

class HelpCenterPage extends StatefulWidget {
  const HelpCenterPage({super.key});

  @override
  State<HelpCenterPage> createState() => _HelpCenterPageState();
}

class _HelpCenterPageState extends State<HelpCenterPage> {
  Future<void> launchPhoneSafe(BuildContext context, String phone) async {
    final uri = Uri.parse("tel:$phone");
    final ok = await launchUrl(uri);
    if (!ok) {
      await Clipboard.setData(ClipboardData(text: phone));
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Could not open phone app. Copied: $phone")),
        );
      }
    }
  }

  Future<void> launchEmailSafe(
    BuildContext context, {
    required String email,
    String subject = '',
    String body = '',
  }) async {
    final uri = Uri(
      scheme: 'mailto',
      path: email,
      queryParameters: {
        if (subject.isNotEmpty) 'subject': subject,
        if (body.isNotEmpty) 'body': body,
      },
    );

    final ok = await launchUrl(uri);
    if (!ok) {
      await Clipboard.setData(ClipboardData(text: email));
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("No email app found. Copied: $email")),
        );
      }
    }
  }

  Future<void> openWeb(String url) async {
    final uri = Uri.parse(url);
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok) throw 'Could not open link';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        centerTitle: true,
        title: const Text("Help Center"),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
        children: [
          const _SectionLabel("Contact Support"),
          const SizedBox(height: 10),

          // ✅ Contact Support cards
          _SupportCard(
            icon: Icons.chat_bubble_outline,
            iconBg: const Color(0xFFDFFAF3),
            iconColor: const Color(0xFF00A884),
            title: "Live Chat",
            subtitle: "Chat with support team",
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const LiveChatPage()),
              );
            },
          ),
          const SizedBox(height: 12),
          _SupportCard(
            icon: Icons.call_outlined,
            iconBg: const Color(0xFFDFFAF3),
            iconColor: const Color(0xFF00A884),
            title: "Call Us",
            subtitle: "+992 067 66 66 66",
            onTap: () => launchPhoneSafe(context, "+992067666666"),
          ),
          const SizedBox(height: 12),
          _SupportCard(
            icon: Icons.mail_outline,
            iconBg: const Color(0xFFEFE7FF),
            iconColor: const Color(0xFF7C3AED),
            title: "Email",
            subtitle: "support@courier.com",
            onTap: () => launchEmailSafe(
              context,
              email: "support@courier.com",
              subject: "ZaZa Driver Support",
            ),
          ),

          const SizedBox(height: 18),

          const _SectionLabel("Frequently Asked Questions"),
          const SizedBox(height: 10),

          _FaqCard(
            items: const [
              _FaqItem(
                q: "How do I accept an order?",
                a: "Tap on any new order card to view details, then tap 'Accept Order'.",
              ),
              // _FaqItem(
              //   q: "How do I withdraw my earnings?",
              //   a: "Go to Wallet screen and tap 'Withdraw to Bank' button.",
              // ),
              _FaqItem(
                q: "How to update my vehicle details?",
                a: "Go to Profile > Vehicle Details to update your information.",
              ),
              _FaqItem(
                q: "What if I can't complete a delivery?",
                a: "Contact support immediately through the in-app chat or phone.",
              ),
              _FaqItem(
                q: "How are delivery fees calculated?",
                a: "Fees are based on distance, package type, and time of day.",
              ),
            ],
          ),
          SizedBox(height: 44),
        ],
      ),
    );
  }
}

/// =======================
/// UI Pieces
/// =======================

class _SectionLabel extends StatelessWidget {
  final String text;
  const _SectionLabel(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        color: Color(0xFF94A3B8),
        fontWeight: FontWeight.w500,
        fontSize: 14,
      ),
    );
  }
}

class _SupportCard extends StatelessWidget {
  final IconData icon;
  final Color iconBg;
  final Color iconColor;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _SupportCard({
    required this.icon,
    required this.iconBg,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: const [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 12,
              offset: Offset(0, 6),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                color: iconBg,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: iconColor, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      color: Color(0xFF64748B),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: Color(0xFF94A3B8)),
          ],
        ),
      ),
    );
  }
}

class _FaqCard extends StatelessWidget {
  final List<_FaqItem> items;
  const _FaqCard({required this.items});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 12,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        children: [
          for (int i = 0; i < items.length; i++) ...[
            _FaqRow(item: items[i]),
            if (i != items.length - 1) const _DividerLine(),
          ],
        ],
      ),
    );
  }
}

class _FaqRow extends StatelessWidget {
  final _FaqItem item;
  const _FaqRow({required this.item});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 34,
            height: 34,
            margin: const EdgeInsets.only(top: 2),
            decoration: BoxDecoration(
              color: const Color(0xFFDFFAF3),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.help_outline,
              color: Color(0xFF00A884),
              size: 18,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.q,
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 15,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  item.a,
                  style: const TextStyle(
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _DividerLine extends StatelessWidget {
  const _DividerLine();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 1,
      margin: const EdgeInsets.only(left: 60),
      color: const Color(0xFFE6EAF0),
    );
  }
}

class _FaqItem {
  final String q;
  final String a;
  const _FaqItem({required this.q, required this.a});
}
