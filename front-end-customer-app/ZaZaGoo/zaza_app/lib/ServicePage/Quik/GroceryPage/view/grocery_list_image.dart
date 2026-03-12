import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:http/http.dart' as http;

class GroceryListImageFlow {
  GroceryListImageFlow._();

  static final ImagePicker _picker = ImagePicker();

  // ✅ PUBLIC: Take photo -> permission -> camera -> upload
  static Future<void> takePhotoAndUpload(BuildContext context) async {
    final ok = await _requestOrExplain(
      context,
      permission: Permission.camera,
      title: "Camera permission",
      message: "Allow camera access to take a photo of your grocery list.",
    );
    if (!ok) return;

    final XFile? photo = await _picker.pickImage(
      source: ImageSource.camera,
      imageQuality: 85,
    );
    if (photo == null) return;

    await _uploadFile(context, File(photo.path));
  }

  // ✅ PUBLIC: Upload from gallery -> permission -> gallery -> upload
  static Future<void> pickFromGalleryAndUpload(BuildContext context) async {
    // iOS: Permission.photos
    // Android: Permission.photos works on newer; fallback to storage if needed.
    final ok = await _requestPhotosSmart(context);
    if (!ok) return;

    final XFile? img = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 85,
    );
    if (img == null) return;

    await _uploadFile(context, File(img.path));
  }

  // ---------- PERMISSIONS ----------

  static Future<bool> _requestPhotosSmart(BuildContext context) async {
    if (Platform.isIOS) {
      final st = await Permission.photos.request(); // ✅ iOS popup
      if (st.isGranted || st.isLimited) return true;

      await _openSettingsDialog(
        context,
        "Photos permission",
        "Please allow Photos access in Settings to upload a grocery list photo.",
      );
      return false;
    }

    // Android
    // Try photos first (Android 13+)
    final st = await Permission.photos.request();
    if (st.isGranted || st.isLimited) return true;

    // Fallback for older Androids
    final st2 = await Permission.storage.request();
    if (st2.isGranted || st2.isLimited) return true;

    await _openSettingsDialog(
      context,
      "Photos permission",
      "Please allow Photos/Storage access in Settings to upload a grocery list photo.",
    );
    return false;
  }

  static Future<bool> _requestOrExplain(
    BuildContext context, {
    required Permission permission,
    required String title,
    required String message,
  }) async {
    final st = await permission
        .request(); // ✅ triggers system popup (if possible)

    if (st.isGranted || st.isLimited) return true;

    // If permanently denied or denied again, show settings dialog
    if (st.isPermanentlyDenied || st.isDenied || st.isRestricted) {
      await _openSettingsDialog(
        context,
        title,
        "$message\n\nOpen settings and allow permission.",
      );
    }
    return false;
  }

  static Future<void> _openSettingsDialog(
    BuildContext context,
    String title,
    String message,
  ) async {
    await showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Cancel"),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              await openAppSettings();
            },
            child: const Text("Open settings"),
          ),
        ],
      ),
    );
  }

  // ---------- UPLOAD ----------

  static Future<void> _uploadFile(BuildContext context, File file) async {
    // ✅ loader
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(child: CircularProgressIndicator()),
    );

    try {
      // TODO: change to your API endpoint
      final uri = Uri.parse("https://your-api.com/grocery/upload");

      final req = http.MultipartRequest("POST", uri);
      req.files.add(await http.MultipartFile.fromPath("file", file.path));

      final res = await req.send();
      final ok = res.statusCode >= 200 && res.statusCode < 300;

      if (!context.mounted) return;
      Navigator.pop(context); // close loader

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            ok ? "Uploaded ✅" : "Upload failed ❌ (${res.statusCode})",
          ),
        ),
      );
    } catch (e) {
      if (!context.mounted) return;
      Navigator.pop(context); // close loader
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error: $e")));
    }
  }
}
