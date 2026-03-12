import 'package:flutter/material.dart';

/// ✅ HELP CENTER (Careem-like header, but content is yours)
/// - Header: Back + Title + Menu (green)
/// - Sections:
///   1) Quick help (top shortcuts)
///   2) Support inbox
///   3) Help topics (list)
///   4) Legal + App info (bottom)
///
/// Copy as: help_center_page.dart
/// Use: Navigator.push(context, MaterialPageRoute(builder: (_) => const HelpCenterPage()));

class HelpCenterPage extends StatelessWidget {
  const HelpCenterPage({super.key});

  @override
  Widget build(BuildContext context) {
    final bg = Colors.white;
    final green = const Color(0xFF0C6B52);

    final quick = <_HelpShortcut>[
      _HelpShortcut(
        title: "Orders & delivery",
        icon: Icons.receipt_long_rounded,
        onTap: () => _go(
          context,
          _HelpTopicPage(
            title: "Orders & delivery",
            articles: _DemoHelpData.ordersDelivery,
          ),
        ),
      ),
      _HelpShortcut(
        title: "Payments",
        icon: Icons.credit_card_rounded,
        onTap: () => _go(
          context,
          _HelpTopicPage(title: "Payments", articles: _DemoHelpData.payments),
        ),
      ),
      _HelpShortcut(
        title: "Refunds",
        icon: Icons.replay_rounded,
        onTap: () => _go(
          context,
          _HelpTopicPage(title: "Refunds", articles: _DemoHelpData.refunds),
        ),
      ),
      _HelpShortcut(
        title: "Account",
        icon: Icons.person_rounded,
        onTap: () => _go(
          context,
          _HelpTopicPage(title: "Account", articles: _DemoHelpData.account),
        ),
      ),
    ];

    final topics = <_HelpTopic>[
      _HelpTopic(
        title: "Food",
        icon: Icons.fastfood_rounded,
        articles: _DemoHelpData.food,
      ),
      _HelpTopic(
        title: "SuperMarkets",
        icon: Icons.shopping_basket_rounded,
        articles: _DemoHelpData.supermarkets,
      ),
      _HelpTopic(
        title: "Pharmacy",
        icon: Icons.local_pharmacy_rounded,
        articles: _DemoHelpData.pharmacy,
      ),
      _HelpTopic(
        title: "Box delivery",
        icon: Icons.inventory_2_rounded,
        articles: _DemoHelpData.box,
      ),
      _HelpTopic(
        title: "Payments & wallet",
        icon: Icons.account_balance_wallet_rounded,
        articles: _DemoHelpData.payments,
      ),
      _HelpTopic(
        title: "Promos & discounts",
        icon: Icons.local_offer_rounded,
        articles: _DemoHelpData.promos,
      ),
      _HelpTopic(
        title: "Safety",
        icon: Icons.shield_rounded,
        articles: _DemoHelpData.safety,
      ),
      _HelpTopic(
        title: "Account & settings",
        icon: Icons.settings_rounded,
        articles: _DemoHelpData.account,
      ),
    ];

    return Scaffold(
      backgroundColor: bg,
      body: Column(
        children: [
          _TopHeader(
            title: "Help Center",
            onBack: () => Navigator.pop(context),
            onMenu: () {
              // TODO: open drawer/menu
            },
          ),

          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                const SizedBox(height: 8),

                // ✅ Search
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 6, 16, 10),
                  child: _SearchField(
                    hint: "Search help topics",
                    onChanged: (q) {
                      // TODO: optional: implement filtering
                    },
                  ),
                ),

                // ✅ Quick help row
                _SectionTitle("Quick help"),
                SizedBox(
                  height: 112,
                  child: ListView.separated(
                    padding: const EdgeInsets.fromLTRB(16, 10, 16, 10),
                    scrollDirection: Axis.horizontal,
                    itemCount: quick.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 12),
                    itemBuilder: (context, i) =>
                        _ShortcutCard(item: quick[i], green: green),
                  ),
                ),

                const SizedBox(height: 6),

                // ✅ Support inbox
                _SectionTitle("Support inbox"),
                const SizedBox(height: 8),
                _Tile(
                  icon: Icons.mail_outline_rounded,
                  title: "Read messages",
                  subtitle: "Replies from support team",
                  onTap: () => _go(context, const _SupportInboxPage()),
                ),
                _DividerSoft(),

                _Tile(
                  icon: Icons.chat_bubble_outline_rounded,
                  title: "Contact support",
                  subtitle: "Create a new request",
                  onTap: () => _go(context, const _CreateRequestPage()),
                ),

                const SizedBox(height: 14),

                // ✅ Help topics
                _SectionTitle("Help topics"),
                const SizedBox(height: 8),
                ...List.generate(topics.length, (i) {
                  final t = topics[i];
                  return Column(
                    children: [
                      _Tile(
                        icon: t.icon,
                        title: t.title,
                        subtitle: "${t.articles.length} articles",
                        onTap: () => _go(
                          context,
                          _HelpTopicPage(title: t.title, articles: t.articles),
                        ),
                      ),
                      if (i != topics.length - 1) _DividerSoft(),
                    ],
                  );
                }),

                const SizedBox(height: 18),

                // ✅ Legal / App info
                _SectionTitle("App"),
                const SizedBox(height: 8),
                _Tile(
                  icon: Icons.description_outlined,
                  title: "Terms & conditions",
                  onTap: () => _go(
                    context,
                    const _SimpleTextPage(
                      title: "Terms & conditions",
                      body:
                          "Here you can write your app terms.\n\n"
                          "Short version:\n"
                          "• Use the app responsibly\n"
                          "• Orders and delivery are subject to availability\n"
                          "• Refunds depend on case review\n"
                          "• We may update features anytime",
                    ),
                  ),
                ),
                _DividerSoft(),
                _Tile(
                  icon: Icons.lock_outline_rounded,
                  title: "Privacy policy",
                  onTap: () => _go(
                    context,
                    const _SimpleTextPage(
                      title: "Privacy policy",
                      body:
                          "Write your privacy policy here.\n\n"
                          "We store only necessary info for orders, support, and analytics.\n"
                          "You can request deletion via support.",
                    ),
                  ),
                ),
                _DividerSoft(),
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 10, 16, 18),
                  child: Text(
                    "App version 1.0.0",
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      color: Colors.black.withAlpha(130),
                    ),
                  ),
                ),
                SizedBox(height: 24),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static void _go(BuildContext context, Widget page) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => page));
  }
}

class _TopHeader extends StatelessWidget {
  final String title;
  final VoidCallback onBack;
  final VoidCallback onMenu;

  const _TopHeader({
    required this.title,
    required this.onBack,
    required this.onMenu,
  });

  @override
  Widget build(BuildContext context) {
    final green = const Color(0xFF0C6B52);

    return SafeArea(
      bottom: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
        child: Row(
          children: [
            Material(
              // color: Colors.black.withAlpha(10),
              borderRadius: BorderRadius.circular(14),
              child: InkWell(
                onTap: onBack,
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.black.withOpacity(0.10)),
                  ),
                  width: 44,
                  height: 44,
                  child: Center(
                    child: Icon(Icons.arrow_back_ios_new_rounded, size: 18),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Material(
              color: green,
              borderRadius: BorderRadius.circular(14),
              child: InkWell(
                onTap: onMenu,
                borderRadius: BorderRadius.circular(14),
                child: const SizedBox(
                  width: 44,
                  height: 44,
                  child: Center(
                    child: Icon(Icons.menu_rounded, color: Colors.white),
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

class _SearchField extends StatelessWidget {
  final String hint;
  final ValueChanged<String> onChanged;

  const _SearchField({required this.hint, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 46,
      decoration: BoxDecoration(
        color: Colors.black.withAlpha(10),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.black.withAlpha(18)),
      ),
      child: Row(
        children: [
          const SizedBox(width: 12),
          Icon(Icons.search_rounded, color: Colors.black.withAlpha(120)),
          const SizedBox(width: 10),
          Expanded(
            child: TextField(
              onChanged: onChanged,
              decoration: InputDecoration(
                hintText: hint,
                hintStyle: TextStyle(
                  fontWeight: FontWeight.w700,
                  color: Colors.black.withAlpha(110),
                ),
                border: InputBorder.none,
              ),
            ),
          ),
          const SizedBox(width: 6),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String text;
  const _SectionTitle(this.text);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 6),
      child: Text(
        text,
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
      ),
    );
  }
}

class _DividerSoft extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Divider(
      height: 1,
      thickness: 1,
      color: Colors.black.withAlpha(16),
      indent: 72,
      endIndent: 0,
    );
  }
}

class _Tile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback onTap;

  const _Tile({
    required this.icon,
    required this.title,
    required this.onTap,
    this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    final green = const Color(0xFF0C6B52);

    return Material(
      color: Colors.white,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
          child: Row(
            children: [
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: Colors.black.withAlpha(10),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(icon, color: green, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontWeight: FontWeight.w900,
                        fontSize: 16.5,
                      ),
                    ),
                    if (subtitle != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        subtitle!,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          color: Colors.black.withAlpha(120),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              Icon(
                Icons.chevron_right_rounded,
                color: Colors.black.withAlpha(90),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _HelpShortcut {
  final String title;
  final IconData icon;
  final VoidCallback onTap;

  const _HelpShortcut({
    required this.title,
    required this.icon,
    required this.onTap,
  });
}

class _ShortcutCard extends StatelessWidget {
  final _HelpShortcut item;
  final Color green;

  const _ShortcutCard({required this.item, required this.green});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        onTap: item.onTap,
        borderRadius: BorderRadius.circular(18),
        child: Container(
          width: 140,
          padding: const EdgeInsets.fromLTRB(14, 14, 14, 12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: Colors.black.withAlpha(16)),
            color: Colors.white,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: green.withAlpha(18),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(item.icon, color: green),
              ),
              const Spacer(),
              Text(
                item.title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _HelpTopic {
  final String title;
  final IconData icon;
  final List<_HelpArticle> articles;

  const _HelpTopic({
    required this.title,
    required this.icon,
    required this.articles,
  });
}

class _HelpArticle {
  final String title;
  final String body;

  const _HelpArticle({required this.title, required this.body});
}

class _HelpTopicPage extends StatelessWidget {
  final String title;
  final List<_HelpArticle> articles;

  const _HelpTopicPage({required this.title, required this.articles});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          _TopHeader(
            title: title,
            onBack: () => Navigator.pop(context),
            onMenu: () {},
          ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.only(top: 6),
              itemCount: articles.length,
              separatorBuilder: (_, __) => Divider(
                height: 1,
                thickness: 1,
                color: Colors.black.withAlpha(16),
                indent: 16,
              ),
              itemBuilder: (context, i) {
                final a = articles[i];
                return _Tile(
                  icon: Icons.article_outlined,
                  title: a.title,
                  subtitle: "Tap to read",
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => _ArticlePage(article: a)),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _ArticlePage extends StatelessWidget {
  final _HelpArticle article;
  const _ArticlePage({required this.article});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          _TopHeader(
            title: "Help article",
            onBack: () => Navigator.pop(context),
            onMenu: () {},
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 10, 16, 24),
              children: [
                Text(
                  article.title,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  article.body,
                  style: TextStyle(
                    height: 1.35,
                    fontWeight: FontWeight.w600,
                    color: Colors.black.withAlpha(160),
                  ),
                ),
                const SizedBox(height: 18),
                _Tile(
                  icon: Icons.chat_bubble_outline_rounded,
                  title: "Still need help?",
                  subtitle: "Contact support",
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const _CreateRequestPage(),
                    ),
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

class _SupportInboxPage extends StatelessWidget {
  const _SupportInboxPage();

  @override
  Widget build(BuildContext context) {
    final msgs = <_InboxMessage>[
      _InboxMessage(
        title: "Refund request received",
        body: "We received your request. We will update you in 24 hours.",
        time: "Today",
      ),
      _InboxMessage(
        title: "Order status update",
        body: "Your order was delivered. Thanks for using our app.",
        time: "Yesterday",
      ),
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          _TopHeader(
            title: "Support inbox",
            onBack: () => Navigator.pop(context),
            onMenu: () {},
          ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.only(top: 6),
              itemCount: msgs.length,
              separatorBuilder: (_, __) => Divider(
                height: 1,
                thickness: 1,
                color: Colors.black.withAlpha(16),
                indent: 16,
              ),
              itemBuilder: (context, i) {
                final m = msgs[i];
                return ListTile(
                  contentPadding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                  title: Text(
                    m.title,
                    style: const TextStyle(fontWeight: FontWeight.w900),
                  ),
                  subtitle: Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Text(
                      m.body,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: Colors.black.withAlpha(140),
                      ),
                    ),
                  ),
                  trailing: Text(
                    m.time,
                    style: TextStyle(
                      fontWeight: FontWeight.w800,
                      color: Colors.black.withAlpha(120),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _InboxMessage {
  final String title;
  final String body;
  final String time;
  const _InboxMessage({
    required this.title,
    required this.body,
    required this.time,
  });
}

class _CreateRequestPage extends StatelessWidget {
  const _CreateRequestPage();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          _TopHeader(
            title: "Contact support",
            onBack: () => Navigator.pop(context),
            onMenu: () {},
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 10, 16, 20),
              children: [
                const Text(
                  "Tell us what happened",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 10),
                _Input(
                  label: "Topic",
                  hint: "Example: Refund, Delivery issue, Payment",
                ),
                const SizedBox(height: 10),
                _Input(label: "Order ID (optional)", hint: "Example: #12345"),
                const SizedBox(height: 10),
                _Input(
                  label: "Message",
                  hint: "Write details here...",
                  maxLines: 6,
                ),
                const SizedBox(height: 16),
                SizedBox(
                  height: 50,
                  child: ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Request sent ✅")),
                      );
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0C6B52),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: const Text(
                      "Send",
                      style: TextStyle(
                        fontWeight: FontWeight.w900,
                        fontSize: 16,
                      ),
                    ),
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

class _Input extends StatelessWidget {
  final String label;
  final String hint;
  final int maxLines;

  const _Input({required this.label, required this.hint, this.maxLines = 1});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.w900)),
        const SizedBox(height: 6),
        Container(
          decoration: BoxDecoration(
            color: Colors.black.withAlpha(10),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.black.withAlpha(18)),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          child: TextField(
            maxLines: maxLines,
            decoration: InputDecoration(
              border: InputBorder.none,
              hintText: hint,
              hintStyle: TextStyle(
                fontWeight: FontWeight.w700,
                color: Colors.black.withAlpha(110),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _SimpleTextPage extends StatelessWidget {
  final String title;
  final String body;

  const _SimpleTextPage({required this.title, required this.body});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          _TopHeader(
            title: title,
            onBack: () => Navigator.pop(context),
            onMenu: () {},
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 10, 16, 24),
              children: [
                Text(
                  body,
                  style: TextStyle(
                    height: 1.35,
                    fontWeight: FontWeight.w600,
                    color: Colors.black.withAlpha(165),
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

/// ✅ Demo content (you can replace later with API)
class _DemoHelpData {
  static const ordersDelivery = <_HelpArticle>[
    _HelpArticle(
      title: "Where is my order?",
      body:
          "You can track your order from the Orders page.\n\n"
          "If the ETA is late:\n"
          "1) Check address & phone\n"
          "2) Check item availability\n"
          "3) If still late, contact support from this page.",
    ),
    _HelpArticle(
      title: "Items missing or wrong",
      body:
          "If an item is missing or incorrect:\n"
          "• Take a photo of what you received\n"
          "• Submit request within 24 hours\n"
          "We will review and refund/replace if eligible.",
    ),
    _HelpArticle(
      title: "Cancel an order",
      body:
          "You can cancel before the shop starts preparing.\n\n"
          "If preparation already started, cancellation may not be available.",
    ),
  ];

  static const payments = <_HelpArticle>[
    _HelpArticle(
      title: "Payment failed",
      body:
          "Try these steps:\n"
          "• Check internet connection\n"
          "• Try another card\n"
          "• Ensure sufficient balance\n"
          "If still failing, contact support and include screenshot.",
    ),
    _HelpArticle(
      title: "Card charged twice",
      body:
          "Sometimes banks create a temporary hold.\n"
          "If you see duplicate charges, we will verify and reverse within 3-7 days.",
    ),
    _HelpArticle(
      title: "Apple Pay / Google Pay",
      body:
          "If wallet payment does not show:\n"
          "• Confirm your device supports the wallet\n"
          "• Add a valid card to wallet\n"
          "• Try again after restarting the app",
    ),
  ];

  static const refunds = <_HelpArticle>[
    _HelpArticle(
      title: "Refund timeline",
      body:
          "Refunds are processed after verification.\n"
          "• Wallet refund: usually same day\n"
          "• Bank card refund: 3-10 business days (depends on bank)",
    ),
    _HelpArticle(
      title: "How to request a refund",
      body:
          "Open order details → Report an issue → Choose reason.\n"
          "Attach photo if needed.\n"
          "We will respond in support inbox.",
    ),
  ];

  static const account = <_HelpArticle>[
    _HelpArticle(
      title: "Change phone number",
      body:
          "Go to Profile → Personal information.\n"
          "You may need SMS verification.",
    ),
    _HelpArticle(
      title: "Change language",
      body:
          "Go to Settings → Language.\n"
          "Restart app for full effect (optional).",
    ),
    _HelpArticle(
      title: "Delete account",
      body:
          "Contact support with the message: “Delete my account”.\n"
          "We will confirm ownership and process the request.",
    ),
  ];

  static const food = <_HelpArticle>[
    _HelpArticle(
      title: "Restaurant is closed",
      body:
          "If a restaurant is closed, it will appear dimmed.\n"
          "You can still view menu, but ordering is disabled until open.",
    ),
    _HelpArticle(
      title: "Wrong food received",
      body:
          "Report within 2 hours.\n"
          "Attach a photo.\n"
          "We will refund or resend if eligible.",
    ),
  ];

  static const supermarkets = <_HelpArticle>[
    _HelpArticle(
      title: "Out of stock items",
      body:
          "If an item is out of stock, the shopper may replace it.\n"
          "You can set preferences: No replacement / Similar only.",
    ),
    _HelpArticle(
      title: "Grocery list feature",
      body:
          "You can create a grocery list by:\n"
          "• Typing items\n"
          "• Uploading a photo\n"
          "• Taking a photo\n"
          "Permissions are required for camera/gallery.",
    ),
  ];

  static const pharmacy = <_HelpArticle>[
    _HelpArticle(
      title: "Prescription items",
      body:
          "Some items may require a prescription.\n"
          "Upload prescription photo when requested.\n"
          "We do not store it longer than needed for verification.",
    ),
    _HelpArticle(
      title: "Shop marked as closed",
      body:
          "Closed shops are disabled (no tap).\n"
          "They will become available when open.",
    ),
  ];

  static const box = <_HelpArticle>[
    _HelpArticle(
      title: "Package pickup rules",
      body:
          "Ensure package is sealed and labeled.\n"
          "Items that are fragile should be marked.\n"
          "Prohibited items are not allowed.",
    ),
    _HelpArticle(
      title: "Delivery proof",
      body:
          "We may request a signature or photo proof for delivery completion.",
    ),
  ];

  static const promos = <_HelpArticle>[
    _HelpArticle(
      title: "Promo not applying",
      body:
          "Check these:\n"
          "• Promo is valid for the service (Food/Pharmacy/etc)\n"
          "• Minimum order amount reached\n"
          "• Promo not expired\n"
          "If still not working, contact support with promo code.",
    ),
  ];

  static const safety = <_HelpArticle>[
    _HelpArticle(
      title: "Report an incident",
      body:
          "If you faced unsafe behavior:\n"
          "1) Move to a safe place\n"
          "2) Contact local emergency services if needed\n"
          "3) Report to us via Contact support with details",
    ),
  ];
}
