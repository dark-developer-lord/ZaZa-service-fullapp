import 'package:flutter/material.dart';

/// =======================
/// LIVE CHAT PAGE (simple MVP)
/// =======================
class LiveChatPage extends StatefulWidget {
  const LiveChatPage({super.key});

  @override
  State<LiveChatPage> createState() => _LiveChatPageState();
}

class _LiveChatPageState extends State<LiveChatPage> {
  final List<_ChatMsg> messages = [
    const _ChatMsg(
      fromSupport: true,
      text: "Hi! 👋 Welcome to ZaZa Support. How can we help you today?",
      time: "Now",
    ),
  ];

  final TextEditingController ctrl = TextEditingController();
  final ScrollController scroll = ScrollController();

  @override
  void dispose() {
    ctrl.dispose();
    scroll.dispose();
    super.dispose();
  }

  void _send() {
    final text = ctrl.text.trim();
    if (text.isEmpty) return;

    setState(() {
      messages.add(_ChatMsg(fromSupport: false, text: text, time: _timeNow()));
      ctrl.clear();
    });

    _scrollToBottom();

    // ✅ MVP auto-reply (later replace with real backend/socket)
    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      setState(() {
        messages.add(
          _ChatMsg(
            fromSupport: true,
            text:
                "Got it ✅ Our team will respond shortly.\n"
                "If urgent, use Call Us from Help Center.",
            time: _timeNow(),
          ),
        );
      });
      _scrollToBottom();
    });
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 50), () {
      if (!scroll.hasClients) return;
      scroll.animateTo(
        scroll.position.maxScrollExtent + 200,
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOut,
      );
    });
  }

  String _timeNow() {
    final now = DateTime.now();
    final hh = now.hour.toString().padLeft(2, '0');
    final mm = now.minute.toString().padLeft(2, '0');
    return "$hh:$mm";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        centerTitle: true,
        title: const Text("Live Chat"),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: scroll,
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
              itemCount: messages.length,
              itemBuilder: (_, i) => _ChatBubble(msg: messages[i]),
            ),
          ),
          _ChatInput(controller: ctrl, onSend: _send),
        ],
      ),
    );
  }
}

/// =======================
/// CHAT UI
/// =======================
class _ChatMsg {
  final bool fromSupport;
  final String text;
  final String time;

  const _ChatMsg({
    required this.fromSupport,
    required this.text,
    required this.time,
  });
}

class _ChatBubble extends StatelessWidget {
  final _ChatMsg msg;
  const _ChatBubble({required this.msg});

  @override
  Widget build(BuildContext context) {
    final align = msg.fromSupport
        ? CrossAxisAlignment.start
        : CrossAxisAlignment.end;
    final bubbleColor = msg.fromSupport
        ? Colors.white
        : const Color(0xFF00A884);
    final textColor = msg.fromSupport ? Colors.black : Colors.white;

    return Column(
      crossAxisAlignment: align,
      children: [
        Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          constraints: const BoxConstraints(maxWidth: 320),
          decoration: BoxDecoration(
            color: bubbleColor,
            borderRadius: BorderRadius.circular(16),
            boxShadow: msg.fromSupport
                ? const [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 10,
                      offset: Offset(0, 5),
                    ),
                  ]
                : const [],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                msg.text,
                style: TextStyle(
                  color: textColor,
                  fontWeight: FontWeight.w500,
                  height: 1.3,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                msg.time,
                style: TextStyle(
                  color: msg.fromSupport
                      ? const Color(0xFF94A3B8)
                      : Colors.white70,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ChatInput extends StatelessWidget {
  final TextEditingController controller;
  final VoidCallback onSend;

  const _ChatInput({required this.controller, required this.onSend});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      child: Container(
        padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
        decoration: const BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 12,
              offset: Offset(0, -4),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF2F4F7),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: TextField(
                  controller: controller,
                  textInputAction: TextInputAction.send,
                  onSubmitted: (_) => onSend(),
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                    hintText: "Type your message...",
                  ),
                ),
              ),
            ),
            const SizedBox(width: 10),
            InkWell(
              onTap: onSend,
              borderRadius: BorderRadius.circular(14),
              child: Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: const Color(0xFF00A884),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(Icons.send, color: Colors.white, size: 20),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
