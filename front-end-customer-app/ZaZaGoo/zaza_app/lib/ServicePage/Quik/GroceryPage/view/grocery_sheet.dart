import 'package:flutter/material.dart';

// Future<void> showGroceryListDialog(BuildContext context) async {
//   await showDialog(
//     context: context,
//     barrierDismissible: true,
//     builder: (_) => const _GroceryListDialog(),
//   );
// }

// class _GroceryListDialog extends StatelessWidget {
//   const _GroceryListDialog();

//   @override
//   Widget build(BuildContext context) {
//     return Dialog(
//       backgroundColor: Colors.transparent,
//       insetPadding: const EdgeInsets.symmetric(horizontal: 18),
//       child: Container(
//         padding: const EdgeInsets.fromLTRB(16, 18, 16, 16),
//         decoration: BoxDecoration(
//           color: Colors.white,
//           borderRadius: BorderRadius.circular(22),
//         ),
//         child: Column(
//           mainAxisSize: MainAxisSize.min,
//           children: [
//             const Align(
//               alignment: Alignment.centerLeft,
//               child: Text(
//                 "Add your Grocery List",
//                 style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
//               ),
//             ),
//             const SizedBox(height: 20),

//             _GroceryDialogButton(
//               icon: Icons.edit_rounded,
//               text: "Type your list",
//               onTap: () {
//                 Navigator.pop(context);
//                 // TODO: open type list page/sheet
//               },
//             ),
//             const SizedBox(height: 14),

//             _GroceryDialogButton(
//               icon: Icons.photo_camera_outlined,
//               text: "Take a photo of your list",
//               onTap: () {
//                 Navigator.pop(context);
//                 // TODO: open camera
//               },
//             ),
//             const SizedBox(height: 14),

//             _GroceryDialogButton(
//               icon: Icons.image_outlined,
//               text: "Upload a photo of your list",
//               onTap: () {
//                 Navigator.pop(context);
//                 // TODO: open gallery picker
//               },
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// class _GroceryDialogButton extends StatelessWidget {
//   final IconData icon;
//   final String text;
//   final VoidCallback onTap;

//   const _GroceryDialogButton({
//     required this.icon,
//     required this.text,
//     required this.onTap,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Material(
//       color: Colors.transparent,
//       child: InkWell(
//         onTap: onTap,
//         borderRadius: BorderRadius.circular(14),
//         child: Container(
//           height: 56,
//           padding: const EdgeInsets.symmetric(horizontal: 14),
//           decoration: BoxDecoration(
//             borderRadius: BorderRadius.circular(14),
//             border: Border.all(color: Colors.black12),
//             color: Colors.white,
//           ),
//           child: Row(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               Icon(icon, size: 22),
//               const SizedBox(width: 10),
//               Flexible(
//                 child: Text(
//                   text,
//                   textAlign: TextAlign.center,
//                   style: const TextStyle(
//                     fontSize: 14,
//                     fontWeight: FontWeight.w600,
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

Future<void> showGroceryListDialog(
  BuildContext context, {
  required VoidCallback onTypeList,
  required Future<void> Function() onTakePhoto,
  required Future<void> Function() onUploadPhoto,
}) async {
  await showDialog(
    context: context,
    barrierDismissible: true,
    builder: (_) => _GroceryListDialog(
      onTypeList: onTypeList,
      onTakePhoto: onTakePhoto,
      onUploadPhoto: onUploadPhoto,
    ),
  );
}

class _GroceryListDialog extends StatelessWidget {
  final VoidCallback onTypeList;
  final Future<void> Function() onTakePhoto;
  final Future<void> Function() onUploadPhoto;

  const _GroceryListDialog({
    required this.onTypeList,
    required this.onTakePhoto,
    required this.onUploadPhoto,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 18),
      child: Container(
        padding: const EdgeInsets.fromLTRB(16, 18, 16, 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Align(
              alignment: Alignment.centerLeft,
              child: Text(
                "Add your Grocery List",
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900),
              ),
            ),
            const SizedBox(height: 14),

            _GroceryDialogButton(
              icon: Icons.edit_rounded,
              text: "Type your list",
              onTap: () {
                Navigator.pop(context);
                onTypeList(); // ✅ page баъд месозем
              },
            ),
            const SizedBox(height: 12),

            _GroceryDialogButton(
              icon: Icons.photo_camera_outlined,
              text: "Take a photo of your list",
              onTap: () async {
                Navigator.pop(context);
                await onTakePhoto();
              },
            ),
            const SizedBox(height: 12),

            _GroceryDialogButton(
              icon: Icons.image_outlined,
              text: "Upload a photo of your list",
              onTap: () async {
                Navigator.pop(context);
                await onUploadPhoto();
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _GroceryDialogButton extends StatelessWidget {
  final IconData icon;
  final String text;
  final VoidCallback onTap;

  const _GroceryDialogButton({
    required this.icon,
    required this.text,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          height: 56,
          padding: const EdgeInsets.symmetric(horizontal: 14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.black12),
            color: Colors.white,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 22),
              const SizedBox(width: 10),
              Flexible(
                child: Text(
                  text,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
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
