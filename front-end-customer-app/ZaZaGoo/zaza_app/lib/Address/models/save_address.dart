// enum AddressTag { home, work, other }

// class SavedAddress {
//   final String label; // "Home" / "Work" / custom
//   final AddressTag tag;
//   final String addressLine; // full address string
//   final String? note; // optional
//   final bool isDefault;

//   const SavedAddress({
//     required this.label,
//     required this.tag,
//     required this.addressLine,
//     this.note,
//     required this.isDefault,
//   });

//   SavedAddress copyWith({
//     String? label,
//     AddressTag? tag,
//     String? addressLine,
//     String? note,
//     bool? isDefault,
//   }) {
//     return SavedAddress(
//       label: label ?? this.label,
//       tag: tag ?? this.tag,
//       addressLine: addressLine ?? this.addressLine,
//       note: note ?? this.note,
//       isDefault: isDefault ?? this.isDefault,
//     );
//   }
// }

enum AddressTag { home, work, other }

class SavedAddress {
  final String label;
  final AddressTag tag;
  final String addressLine;
  final String? note;
  final bool isDefault;

  const SavedAddress({
    required this.label,
    required this.tag,
    required this.addressLine,
    this.note,
    required this.isDefault,
  });

  SavedAddress copyWith({
    String? label,
    AddressTag? tag,
    String? addressLine,
    String? note,
    bool? isDefault,
  }) {
    return SavedAddress(
      label: label ?? this.label,
      tag: tag ?? this.tag,
      addressLine: addressLine ?? this.addressLine,
      note: note ?? this.note,
      isDefault: isDefault ?? this.isDefault,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'label': label,
      'tag': tag.name,
      'addressLine': addressLine,
      'note': note,
      'isDefault': isDefault,
    };
  }

  factory SavedAddress.fromJson(Map<String, dynamic> json) {
    return SavedAddress(
      label: json['label'] ?? '',
      tag: AddressTag.values.firstWhere(
        (e) => e.name == json['tag'],
        orElse: () => AddressTag.other,
      ),
      addressLine: json['addressLine'] ?? '',
      note: json['note'],
      isDefault: json['isDefault'] ?? false,
    );
  }
}
