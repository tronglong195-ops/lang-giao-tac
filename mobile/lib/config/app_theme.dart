import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Màu xanh lũy tre / cốm làng (Primary)
  static const Color primary = Color(0xFF2D5A27);
  static const Color primaryDark = Color(0xFF1E3F1A);
  static const Color primaryLight = Color(0xFF4A7C59);
  static const Color primarySubtle = Color(0xFFEAF2EB);

  // Màu vàng rơm / đất phù sa (Secondary)
  static const Color secondary = Color(0xFFD4A373);
  static const Color secondaryDark = Color(0xFFB57D46);
  static const Color secondaryLight = Color(0xFFFAEDCD);

  // Màu đỏ son đình làng / ngói cổ (Accent)
  static const Color accent = Color(0xFFC14953);
  static const Color accentDark = Color(0xFF8E2800);

  // Nền giấy dó truyền thống & Chữ
  static const Color background = Color(0xFFFAF8F5);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color paper = Color(0xFFF4EFEA);

  static const Color ink = Color(0xFF2B2D42);
  static const Color inkMuted = Color(0xFF6B7280);
  static const Color inkLight = Color(0xFF9CA3AF);

  static const Color warmBorder = Color(0xFFE7DFD5);
  static const Color warmBorderDark = Color(0xFFD5C7B7);

  static const Color error = Color(0xFFE53E3E);
  static const Color success = Color(0xFF38A169);
  static const Color warning = Color(0xFFDD6B20);
}

class AppTheme {
  static ThemeData get lightTheme {
    final baseTextTheme = GoogleFonts.beVietnamProTextTheme();

    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primary,
        onPrimary: Colors.white,
        secondary: AppColors.secondary,
        onSecondary: AppColors.ink,
        surface: AppColors.surface,
        onSurface: AppColors.ink,
        error: AppColors.error,
        onError: Colors.white,
      ),
      textTheme: baseTextTheme.copyWith(
        displayLarge: GoogleFonts.beVietnamPro(
          fontSize: 28,
          fontWeight: FontWeight.w800,
          color: AppColors.primaryDark,
          letterSpacing: -0.5,
        ),
        displayMedium: GoogleFonts.beVietnamPro(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          color: AppColors.primaryDark,
        ),
        titleLarge: GoogleFonts.beVietnamPro(
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: AppColors.ink,
        ),
        titleMedium: GoogleFonts.beVietnamPro(
          fontSize: 15,
          fontWeight: FontWeight.w600,
          color: AppColors.ink,
        ),
        bodyLarge: GoogleFonts.beVietnamPro(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: AppColors.ink,
          height: 1.5,
        ),
        bodyMedium: GoogleFonts.beVietnamPro(
          fontSize: 13,
          fontWeight: FontWeight.w400,
          color: AppColors.inkMuted,
          height: 1.4,
        ),
        labelLarge: GoogleFonts.beVietnamPro(
          fontSize: 13,
          fontWeight: FontWeight.w600,
          color: Colors.white,
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.surface,
        elevation: 0,
        scrolledUnderElevation: 1,
        shadowColor: AppColors.warmBorder,
        centerTitle: false,
        iconTheme: const IconThemeData(color: AppColors.primaryDark),
        titleTextStyle: GoogleFonts.beVietnamPro(
          fontSize: 17,
          fontWeight: FontWeight.w700,
          color: AppColors.primaryDark,
        ),
      ),
      cardTheme: CardTheme(
        color: AppColors.surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.warmBorder, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.beVietnamPro(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primaryDark,
          side: const BorderSide(color: AppColors.warmBorderDark),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.beVietnamPro(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.warmBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.warmBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.error),
        ),
        hintStyle: GoogleFonts.beVietnamPro(
          fontSize: 13,
          color: AppColors.inkLight,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.surface,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.inkMuted,
        selectedLabelStyle: TextStyle(fontWeight: FontWeight.w700, fontSize: 11),
        unselectedLabelStyle: TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }
}
